import { createClient } from './index.js'; // index.js is in the folder you copied

const supabaseUrl = 'https://qaqytxhlybxoxzttqwty.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhcXl0eGhseWJ4b3h6dHRxd3R5Iiwicm9sZSI6ImFub24iLCJp';

export const supabase = createClient(supabaseUrl, supabaseKey);
