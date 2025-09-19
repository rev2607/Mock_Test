-- Ensure reactions table exists with proper structure
CREATE TABLE IF NOT EXISTS reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL,
  user_id UUID NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- Add foreign key constraints if they don't exist
DO $$ 
BEGIN
    -- Add foreign key to messages table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_reactions_message_id'
    ) THEN
        ALTER TABLE reactions 
        ADD CONSTRAINT fk_reactions_message_id 
        FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE;
    END IF;

    -- Add foreign key to auth.users table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_reactions_user_id'
    ) THEN
        ALTER TABLE reactions 
        ADD CONSTRAINT fk_reactions_user_id 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reactions_message_id ON reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reactions_emoji ON reactions(emoji);

-- Enable RLS
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Anyone can view reactions" ON reactions;
    DROP POLICY IF EXISTS "Authenticated users can insert reactions" ON reactions;
    DROP POLICY IF EXISTS "Users can delete their own reactions" ON reactions;
    
    -- Create new policies
    CREATE POLICY "Anyone can view reactions" ON reactions FOR SELECT USING (true);
    CREATE POLICY "Authenticated users can insert reactions" ON reactions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
    CREATE POLICY "Users can delete their own reactions" ON reactions FOR DELETE USING (auth.uid() = user_id);
END $$;
