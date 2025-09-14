-- Test Database Setup
-- Run this in your Supabase SQL Editor to verify tables exist

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('channels', 'messages', 'reactions');

-- Check channels data
SELECT * FROM channels;

-- Check if messages table is empty (expected initially)
SELECT COUNT(*) as message_count FROM messages;

-- Test inserting a sample message (replace with actual user_id)
-- INSERT INTO messages (channel_id, user_id, content) 
-- VALUES (
--   (SELECT id FROM channels WHERE name = 'IIT/JEE' LIMIT 1),
--   'your-user-id-here',
--   'Hello, this is a test message!'
-- );
