import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tzkglbsmfkyzauvluifl.supabase.co';
const supabaseKey = 'sb_publishable_7s6KbVpGFTs2dMqxhf4HMA_oXf3XRRY';

export const supabase = createClient(supabaseUrl, supabaseKey);