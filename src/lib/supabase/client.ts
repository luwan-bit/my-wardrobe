import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    "https://zjeggimyldefzojrrvpi.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqZWdnaW15bGRlZnpvanJydnBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MjY2ODgsImV4cCI6MjEwNzMwMjY4OH0.QHSN-tr-E5oHvQohBJYJPsZx6CvCMPyv-a-RlzCfTBM"
  );
}