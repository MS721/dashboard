import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://yhupgiuuzhwucmwzfhai.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlodXBnaXV1emh3dWNtd3pmaGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDg1NzAsImV4cCI6MjA3ODUyNDU3MH0.o2m2FZpODGYVIsxs_ZC1yGUoAbVv-YoyYvtHvwNdw2w"
);
