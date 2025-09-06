-- Create a function that can be called from the API to create user profiles
CREATE OR REPLACE FUNCTION public.create_user_profile(
  user_id UUID,
  user_email TEXT,
  user_username TEXT
)
RETURNS JSON AS $$
DECLARE
  user_passkey VARCHAR(32);
  result JSON;
BEGIN
  -- Generate a unique passkey for the new user
  user_passkey := substring(encode(gen_random_bytes(16), 'hex'), 1, 32);
  
  -- Insert into public.users table
  INSERT INTO public.users (id, email, username, passkey, role)
  VALUES (user_id, user_email, user_username, user_passkey, 'user')
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    username = EXCLUDED.username,
    passkey = COALESCE(public.users.passkey, EXCLUDED.passkey);
  
  -- Return success response
  result := json_build_object(
    'success', true,
    'user_id', user_id,
    'passkey', user_passkey
  );
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Return error response
    result := json_build_object(
      'success', false,
      'error', SQLERRM
    );
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_user_profile(UUID, TEXT, TEXT) TO authenticated;

-- Create a simple API endpoint function
CREATE OR REPLACE FUNCTION public.create_user_profile_api(
  user_id UUID,
  user_email TEXT,
  user_username TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  username_to_use TEXT;
BEGIN
  -- Use provided username or extract from email
  username_to_use := COALESCE(user_username, split_part(user_email, '@', 1));
  
  -- Call the main function
  RETURN public.create_user_profile(user_id, user_email, username_to_use);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.create_user_profile_api(UUID, TEXT, TEXT) TO authenticated;
