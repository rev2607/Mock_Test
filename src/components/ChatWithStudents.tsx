'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/database.types'
import { MessageCircle, Users, Hash, Send, ThumbsUp, Reply, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ProfileCompletionCheck } from './ProfileCompletionCheck'

type Channel = Database['public']['Tables']['channels']['Row']
type Message = Database['public']['Tables']['messages']['Row'] & {
  user: { email: string }
  reactions: Array<{ emoji: string; user_id: string; id: string }>
  replies: Array<Message & { user: { email: string } }>
}


export function ChatWithStudents() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [databaseError, setDatabaseError] = useState<string | null>(null)
  const [userNames, setUserNames] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/auth/login?message=Please login to access the chat')
      return
    }

    fetchChannels()
  }, [user, loading, router])

  useEffect(() => {
    if (selectedChannel) {
      fetchMessages()
      subscribeToMessages()
    }
  }, [selectedChannel])

  const fetchChannels = async () => {
    console.log('Fetching channels...')
    
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching channels:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        
        // If channels table doesn't exist, show a helpful message
        if (error.message?.includes('relation "channels" does not exist')) {
          console.error('Channels table does not exist. Please run the setup-chat-database.sql script first.')
          setDatabaseError('Database not set up. Please run the setup-chat-database.sql script in Supabase.')
        }
      } else {
        console.log('Channels fetched successfully:', data)
        setChannels(data || [])
        if (data && data.length > 0) {
          setSelectedChannel(data[0])
        }
      }
    } catch (err) {
      console.error('Unexpected error fetching channels:', err)
    }
  }

  const fetchMessages = async () => {
    if (!selectedChannel) return

    setLoadingMessages(true)
    
    try {
      console.log('Fetching messages for channel:', selectedChannel.id)
      
      // First, try a simple query to check if the table exists
      const { data: testData, error: testError } = await supabase
        .from('messages')
        .select('id')
        .limit(1)

      if (testError) {
        console.error('Database connection test failed:', testError)
        console.error('This might mean the messages table does not exist')
        setLoadingMessages(false)
        return
      }

      console.log('Database connection test passed')

      // Now get the main messages (not replies) - simplified query without foreign key join
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('channel_id', selectedChannel.id)
        .is('parent_message_id', null)
        .order('created_at', { ascending: true })

      if (messagesError) {
        console.error('Error fetching messages:', messagesError)
        console.error('Error details:', JSON.stringify(messagesError, null, 2))
        console.error('Selected channel:', selectedChannel)
        setLoadingMessages(false)
        return
      }

      if (!messagesData || messagesData.length === 0) {
        setMessages([])
        setLoadingMessages(false)
        return
      }

      // Get reactions for all messages
      const messageIds = messagesData.map(m => m.id)
      const { data: reactionsData, error: reactionsError } = await supabase
        .from('reactions')
        .select('message_id, emoji, user_id, id')
        .in('message_id', messageIds)

      if (reactionsError) {
        console.error('Error fetching reactions:', reactionsError)
      }

      // Get replies for all messages - simplified query
      const { data: repliesData, error: repliesError } = await supabase
        .from('messages')
        .select('*')
        .in('parent_message_id', messageIds)
        .order('created_at', { ascending: true })

      if (repliesError) {
        console.error('Error fetching replies:', repliesError)
      }

      // Get reactions for replies
      const replyIds = repliesData?.map(r => r.id) || []
      const { data: replyReactionsData, error: replyReactionsError } = await supabase
        .from('reactions')
        .select('message_id, emoji, user_id, id')
        .in('message_id', replyIds)

      if (replyReactionsError) {
        console.error('Error fetching reply reactions:', replyReactionsError)
      }

      // Get user names for all unique user IDs
      const allUserIds = [...new Set([
        ...messagesData.map(m => m.user_id),
        ...(repliesData?.map(r => r.user_id) || [])
      ])]

      // Update user names map with current user
      if (user) {
        const currentUserName = user.user_metadata?.user_name || user.email?.split('@')[0] || 'You'
        setUserNames(prev => new Map(prev).set(user.id, currentUserName))
      }

      // For other users, we'll use a fallback approach
      const getUserName = (userId: string) => {
        if (userId === user?.id) {
          return user.user_metadata?.user_name || user.email?.split('@')[0] || 'You'
        }
        // For other users, we'll use a simple fallback
        return `User ${userId.substring(0, 6)}`
      }

      // Combine the data with user names
      const messagesWithData = messagesData.map(message => ({
        ...message,
        user: { 
          email: getUserName(message.user_id), 
          name: getUserName(message.user_id) 
        },
        reactions: reactionsData?.filter(r => r.message_id === message.id) || [],
        replies: (repliesData?.filter(r => r.parent_message_id === message.id) || []).map(reply => ({
          ...reply,
          user: { 
            email: getUserName(reply.user_id), 
            name: getUserName(reply.user_id) 
          },
          reactions: replyReactionsData?.filter(r => r.message_id === reply.id) || []
        }))
      }))

      setMessages(messagesWithData)
    } catch (error) {
      console.error('Error in fetchMessages:', error)
    }
    
    setLoadingMessages(false)
  }

  const subscribeToMessages = () => {
    if (!selectedChannel) return

    const subscription = supabase
      .channel(`messages:${selectedChannel.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${selectedChannel.id}`
        },
        () => {
          fetchMessages()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reactions'
        },
        () => {
          fetchMessages()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedChannel || !user) return

    const messageContent = newMessage.trim()
    const isReply = !!replyingTo

    // Immediately add the message to local state for instant UI update
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      channel_id: selectedChannel.id,
      user_id: user.id,
      content: messageContent,
      parent_message_id: replyingTo?.id || null,
      created_at: new Date().toISOString(),
      user: { 
        email: user.user_metadata?.user_name || user.email?.split('@')[0] || 'You',
        name: user.user_metadata?.user_name || user.email?.split('@')[0] || 'You'
      },
      reactions: [],
      replies: []
    }

    if (isReply) {
      // Add as a reply to the original message
      setMessages(prev => prev.map(msg => 
        msg.id === replyingTo.id 
          ? { ...msg, replies: [...(msg.replies || []), tempMessage] }
          : msg
      ))
    } else {
      // Add as a new message
      setMessages(prev => [...prev, tempMessage])
    }

    // Clear the input immediately
    setNewMessage('')
    setReplyingTo(null)

    // Send to database
    const { data, error } = await supabase
      .from('messages')
      .insert({
        channel_id: selectedChannel.id,
        user_id: user.id,
        content: messageContent,
        parent_message_id: replyingTo?.id || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error sending message:', error)
      // Remove the temporary message on error
      if (isReply) {
        setMessages(prev => prev.map(msg => 
          msg.id === replyingTo.id 
            ? { ...msg, replies: msg.replies?.filter(r => r.id !== tempMessage.id) || [] }
            : msg
        ))
      } else {
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id))
      }
    } else if (data) {
      // Replace temporary message with real message from database
      const realMessage: Message = {
        ...data,
        user: { 
          email: user.user_metadata?.user_name || user.email?.split('@')[0] || 'You',
          name: user.user_metadata?.user_name || user.email?.split('@')[0] || 'You'
        },
        reactions: [],
        replies: []
      }

      if (isReply) {
        setMessages(prev => prev.map(msg => 
          msg.id === replyingTo.id 
            ? { ...msg, replies: msg.replies?.map(r => r.id === tempMessage.id ? realMessage : r) || [] }
            : msg
        ))
      } else {
        setMessages(prev => prev.map(msg => msg.id === tempMessage.id ? realMessage : msg))
      }
    }
  }

  const addReaction = async (messageId: string, emoji: string) => {
    if (!user) return

    const { error } = await supabase
      .from('reactions')
      .upsert({
        message_id: messageId,
        user_id: user.id,
        emoji
      })

    if (error) {
      console.error('Error adding reaction:', error)
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!user) return

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting message:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (databaseError) {
    return (
      <div className="flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Database Setup Required</h3>
            <p className="text-gray-600 mb-4">{databaseError}</p>
            <div className="bg-gray-100 p-4 rounded-lg text-left">
              <p className="text-sm text-gray-700 mb-2">To fix this:</p>
              <ol className="text-sm text-gray-700 list-decimal list-inside space-y-1">
                <li>Go to your Supabase dashboard</li>
                <li>Navigate to the SQL Editor</li>
                <li>Run the <code className="bg-gray-200 px-1 rounded">setup-chat-database.sql</code> script</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProfileCompletionCheck>
      <div className="flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Study Groups
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setSelectedChannel(channel)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors ${
                selectedChannel?.id === channel.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center">
                <Hash className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium text-gray-900">{channel.name}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 truncate">{channel.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChannel ? (
          <>
            {/* Channel Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">#{selectedChannel.name}</h3>
                  <p className="text-sm text-gray-500">{selectedChannel.description}</p>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  {messages.length} messages
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.flatMap((message) => [
                  <MessageComponent
                    key={message.id}
                    message={message}
                    currentUserId={user.id}
                    onReply={setReplyingTo}
                    onReact={addReaction}
                    onDelete={deleteMessage}
                  />,
                  // Render replies as separate messages
                  ...(message.replies?.map((reply) => (
                    <ReplyMessageComponent
                      key={reply.id}
                      reply={reply}
                      originalMessage={message}
                      currentUserId={user.id}
                      onReply={setReplyingTo}
                      onReact={addReaction}
                      onDelete={deleteMessage}
                    />
                  )) || [])
                ])
              )}
            </div>

            {/* Reply Indicator */}
            {replyingTo && (
              <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-blue-700">
                    <Reply className="h-4 w-4 mr-2" />
                    Replying to {replyingTo.user.email}
                  </div>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-blue-500 hover:text-blue-700 text-lg"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-blue-600 mt-1 truncate italic">&ldquo;{replyingTo.content}&rdquo;</p>
              </div>
            )}

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message #${selectedChannel.name}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-black"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage(e)
                      }
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Select a channel to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </ProfileCompletionCheck>
  )
}

// Message Component
function MessageComponent({ 
  message, 
  currentUserId, 
  onReply, 
  onReact, 
  onDelete 
}: { 
  message: Message
  currentUserId: string
  onReply: (message: Message) => void
  onReact: (messageId: string, emoji: string) => void
  onDelete: (messageId: string) => void
}) {
  const isOwnMessage = message.user_id === currentUserId

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'ml-12' : 'mr-12'}`}>
        {/* User name - only show for other users' messages */}
        {!isOwnMessage && (
          <div className="text-xs text-gray-600 mb-1 px-1">
            {message.user.email}
          </div>
        )}
        
        <div className={`px-4 py-2 rounded-lg ${
          isOwnMessage ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex-1"></div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onReact(message.id, '👍')}
                className="opacity-75 hover:opacity-100 flex items-center space-x-1"
                title="Like"
              >
                <ThumbsUp className="h-4 w-4" />
                {message.reactions && message.reactions.length > 0 && (
                  <span className="text-xs">{message.reactions.length}</span>
                )}
              </button>
              <button
                onClick={() => onReply(message)}
                className="opacity-75 hover:opacity-100"
                title="Reply"
              >
                <Reply className="h-4 w-4" />
              </button>
              {isOwnMessage && (
                <button
                  onClick={() => onDelete(message.id)}
                  className="opacity-75 hover:opacity-100"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          <p className="text-sm text-black">{message.content}</p>
        

        </div>
      </div>
    </div>
  )
}

// Reply Message Component - displays as separate message like WhatsApp
function ReplyMessageComponent({ 
  reply, 
  originalMessage,
  currentUserId, 
  onReply, 
  onReact, 
  onDelete 
}: { 
  reply: Message & { user: { email: string } }
  originalMessage: Message
  currentUserId: string
  onReply: (message: Message) => void
  onReact: (messageId: string, emoji: string) => void
  onDelete: (messageId: string) => void
}) {
  const isOwnMessage = reply.user_id === currentUserId

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'ml-12' : 'mr-12'}`}>
        {/* User name - only show for other users' messages */}
        {!isOwnMessage && (
          <div className="text-xs text-gray-600 mb-1 px-1">
            {reply.user.email}
          </div>
        )}
        
        <div className={`px-4 py-2 rounded-lg ${
          isOwnMessage ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
        }`}>
          {/* Reply context - show what this is replying to */}
          <div className={`text-xs mb-2 pb-2 border-l-2 pl-2 ${
            isOwnMessage ? 'border-white border-opacity-30' : 'border-gray-400'
          }`}>
            <div className={`text-xs ${isOwnMessage ? 'text-white text-opacity-75' : 'text-gray-500'}`}>
              Replying to {originalMessage.user.email}
            </div>
            <div className={`text-xs italic ${isOwnMessage ? 'text-white text-opacity-60' : 'text-gray-600'}`}>
              &ldquo;{originalMessage.content}&rdquo;
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-1">
            <div className="flex-1"></div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onReact(reply.id, '👍')}
                className="opacity-75 hover:opacity-100 flex items-center space-x-1"
                title="Like"
              >
                <ThumbsUp className="h-4 w-4" />
                {reply.reactions && reply.reactions.length > 0 && (
                  <span className="text-xs">{reply.reactions.length}</span>
                )}
              </button>
              <button
                onClick={() => onReply(originalMessage)}
                className="opacity-75 hover:opacity-100"
                title="Reply"
              >
                <Reply className="h-4 w-4" />
              </button>
              {isOwnMessage && (
                <button
                  onClick={() => onDelete(reply.id)}
                  className="opacity-75 hover:opacity-100"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          <p className="text-sm text-black">{reply.content}</p>
          
        </div>
      </div>
    </div>
  )
}
