import { createClient } from "@supabase/supabase-js";

const url = "https://tefltjtzuamuakgndmeg.supabase.co";
const anonKey = "sb_publishable_kE91CRz-xFJVUsBlNTXRIQ_Ko1f4C3-";

class DummyWebSocket {}

const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
  realtime: { transport: DummyWebSocket },
});

const tables = [
  "profiles",
  "youtube_connections",
  "channel_audits",
  "creator_scripts",
  "production_projects",
  "seo_projects",
  "thumbnail_projects",
  "recent_activities",
  "youtube_api_quotas",
  "youtube_research_cache",
];

async function checkCloudDatabase() {
  console.log("=== PROBING SUPABASE CLOUD DATABASE ===");
  console.log("URL:", url);

  const results = {};

  for (const table of tables) {
    try {
      const { data, error, status } = await supabase.from(table).select("*").limit(1);
      if (error) {
        results[table] = {
          exists: false,
          status,
          code: error.code,
          message: error.message,
        };
      } else {
        results[table] = {
          exists: true,
          status,
          rowCountSample: data ? data.length : 0,
        };
      }
    } catch (err) {
      results[table] = {
        exists: false,
        error: err.message,
      };
    }
  }

  // Also test atomic RPC function
  try {
    const { error: rpcError } = await supabase.rpc("increment_youtube_quota", {
      target_day_pt: "2026-11-07",
      search_inc: 0,
      shared_inc: 0,
    });
    results["rpc:increment_youtube_quota"] = {
      exists: !rpcError || !rpcError.message.includes("does not exist"),
      error: rpcError ? rpcError.message : null,
    };
  } catch (err) {
    results["rpc:increment_youtube_quota"] = { exists: false, error: err.message };
  }

  console.log(JSON.stringify(results, null, 2));
}

checkCloudDatabase();
