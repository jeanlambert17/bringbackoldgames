-- Add user_id column
ALTER TABLE user_votes 
ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Migrate existing data (if any)
UPDATE user_votes 
SET user_id = (SELECT id FROM auth.users WHERE email = user_votes.user_email)
WHERE user_email IS NOT NULL;

-- Make user_id not null after migration
ALTER TABLE user_votes 
ALTER COLUMN user_id SET NOT NULL;

-- Drop user_email column
ALTER TABLE user_votes 
DROP COLUMN user_email;

-- Update unique constraint
ALTER TABLE user_votes 
DROP CONSTRAINT IF EXISTS user_votes_game_id_user_email_key;

ALTER TABLE user_votes 
ADD CONSTRAINT user_votes_game_id_user_id_key UNIQUE (game_id, user_id);


create policy "Authenticated users can create and update user_votes"
on "public"."user_votes"
as PERMISSIVE
for all
to authenticated
using ( (select auth.uid()) = user_id ) -- checks if the existing row complies with the policy expression
with check ( (select auth.uid()) = user_id ); -- checks if the new row complies with the policy expression