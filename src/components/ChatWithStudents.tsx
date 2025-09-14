'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/database.types'
import { MessageCircle, Users, Hash, Send, Smile, Reply, Trash2, MoreVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ProfileCompletionCheck } from './ProfileCompletionCheck'

type Channel = Database['public']['Tables']['channels']['Row']
type Message = Database['public']['Tables']['messages']['Row'] & {
  user: { email: string }
  reactions: Array<{ emoji: string; user_id: string; id: string }>
  replies: Array<Message & { user: { email: string } }>
}

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '👏']

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

      // Combine the data - for now, use user_id as email placeholder
      const messagesWithData = messagesData.map(message => ({
        ...message,
        user: { email: message.user_id.substring(0, 8) + '...' }, // Show first 8 chars of user_id
        reactions: reactionsData?.filter(r => r.message_id === message.id) || [],
        replies: (repliesData?.filter(r => r.parent_message_id === message.id) || []).map(reply => ({
          ...reply,
          user: { email: reply.user_id.substring(0, 8) + '...' },
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

    const { error } = await supabase
      .from('messages')
      .insert({
        channel_id: selectedChannel.id,
        user_id: user.id,
        content: newMessage.trim(),
        parent_message_id: replyingTo?.id || null
      })

    if (error) {
      console.error('Error sending message:', error)
    } else {
      setNewMessage('')
      setReplyingTo(null)
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                messages.map((message) => (
                  <MessageComponent
                    key={message.id}
                    message={message}
                    currentUserId={user.id}
                    onReply={setReplyingTo}
                    onReact={addReaction}
                    onDelete={deleteMessage}
                  />
                ))
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
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-blue-600 mt-1 truncate">{replyingTo.content}</p>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const isOwnMessage = message.user_id === currentUserId

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isOwnMessage ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
      }`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium opacity-75">
            {message.user.email}
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="opacity-75 hover:opacity-100"
            >
              <Smile className="h-4 w-4" />
            </button>
            <button
              onClick={() => onReply(message)}
              className="opacity-75 hover:opacity-100"
            >
              <Reply className="h-4 w-4" />
            </button>
            {isOwnMessage && (
              <button
                onClick={() => onDelete(message.id)}
                className="opacity-75 hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        <p className="text-sm">{message.content}</p>
        
        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {Object.entries(
              message.reactions.reduce((acc, reaction) => {
                acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1
                return acc
              }, {} as Record<string, number>)
            ).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => onReact(message.id, emoji)}
                className="text-xs px-2 py-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30"
              >
                {emoji} {count}
              </button>
            ))}
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute mt-2 p-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            <div className="flex space-x-1">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReact(message.id, emoji)
                    setShowEmojiPicker(false)
                  }}
                  className="text-lg hover:bg-gray-100 rounded p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Replies */}
        {message.replies && message.replies.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.replies.map((reply) => (
              <div key={reply.id} className="text-xs opacity-75 pl-2 border-l-2 border-white border-opacity-30">
                <span className="font-medium">{reply.user.email}:</span> {reply.content}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
