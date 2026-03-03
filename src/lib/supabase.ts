import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://knmscxebabsangtmylrs.supabase.co';
const supabaseKey = 'sb_publishable_9B-CWt_J1O93tnBDr9Pwcw_BXJWQXmx';

export const supabase = createClient(supabaseUrl, supabaseKey);
