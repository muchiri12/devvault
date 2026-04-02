import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  console.log("Checking audit_logs...");
  const { data: auditLogs, error: auditError } = await supabase.from("audit_logs").select("id").limit(1);
  if (auditError) console.error("Audit Logs Error:", auditError.message);
  else console.log("Audit Logs exist!");

  console.log("Checking profiles...");
  const { data: profiles, error: profileError } = await supabase.from("profiles").select("id").limit(1);
  if (profileError) console.error("Profiles Error:", profileError.message);
  else console.log("Profiles exist!");

}

test();
