// ==============================================================================
// ASH CREATOR STUDIO — Phase 2 YouTube Integration Verification Test Suite
// ==============================================================================

const http = require("http");

function fetchJson(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      `http://localhost:3000${path}`,
      {
        method: options.method || "GET",
        headers: options.headers || {},
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          let json = null;
          try {
            json = JSON.parse(body);
          } catch (e) {
            json = { raw: body, statusCode: res.statusCode, headers: res.headers };
          }
          resolve({ status: res.statusCode, data: json, headers: res.headers });
        });
      }
    );
    req.on("error", reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function runTests() {
  console.log("=================================================");
  console.log("🚀 STARTING PHASE 2 YOUTUBE INTEGRATION TESTS");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, detail = "") {
    if (condition) {
      console.log(`✅ PASS: ${testName} ${detail ? `(${detail})` : ""}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} ${detail ? `(${detail})` : ""}`);
      failed++;
    }
  }

  // TEST 1: Google OAuth Status (Security Check - Tokens must NEVER be exposed)
  try {
    const res = await fetchJson("/api/auth/youtube/status");
    assert(res.status === 200, "OAuth Status Endpoint Responds HTTP 200");
    assert(res.data.scopes && res.data.scopes.length === 2, "Minimum Scopes Configured (youtube.readonly & yt-analytics.readonly)");
    assert(res.data.access_token === undefined && res.data.refresh_token === undefined, "Security: Access & Refresh Tokens NEVER Exposed to Frontend");
  } catch (err) {
    assert(false, "OAuth Status Endpoint", err.message);
  }

  // TEST 2: OAuth Initiation Endpoint
  try {
    const res = await fetchJson("/api/auth/youtube");
    assert(res.status === 200 || res.status === 302 || res.status === 307, "OAuth Initiation Endpoint Responds Properly", `status: ${res.status}`);
  } catch (err) {
    assert(false, "OAuth Initiation Endpoint", err.message);
  }

  // TEST 3: OAuth Cancellation Handling
  try {
    const res = await fetchJson("/api/auth/youtube/callback?error=access_denied");
    // Should redirect to dashboard/analytics with error query
    assert(res.status === 307 || res.status === 302, "OAuth Cancellation Redirects Safely (No Crash)", `Location: ${res.headers.location}`);
    assert(res.headers.location && res.headers.location.includes("oauth_cancelled"), "OAuth Cancellation Query String Passed Correctly");
  } catch (err) {
    assert(false, "OAuth Cancellation Handling", err.message);
  }

  // TEST 4: Successful OAuth Connection (Callback Simulation)
  try {
    const res = await fetchJson("/api/auth/youtube/callback?demo=true");
    assert(res.status === 307 || res.status === 302, "OAuth Callback Completes and Redirects", `Location: ${res.headers.location}`);
    assert(res.headers.location && res.headers.location.includes("connected=true"), "Redirect URL contains connected=true parameter");
  } catch (err) {
    assert(false, "OAuth Connection Callback", err.message);
  }

  // TEST 5: Verified Connection Status after Connection
  try {
    const res = await fetchJson("/api/auth/youtube/status");
    assert(res.status === 200, "Status Endpoint Reflects Active Connection");
    assert(res.data.isConnected === true, "Channel Flagged as Connected");
    assert(res.data.isAuthorized === true, "Channel Flagged as Authorized for Analytics");
  } catch (err) {
    assert(false, "Status Check After Connection", err.message);
  }

  // TEST 6: Analytics API Report (7-Day Overview)
  try {
    const res = await fetchJson("/api/youtube/analytics?days=7");
    assert(res.status === 200, "Analytics 7-Day Endpoint Responds HTTP 200");
    const r = res.data.report;
    assert(r && r.dailyRows && r.dailyRows.length === 7, "Analytics 7-Day Returns Exactly 7 Daily Rows");
    assert(r.totals && typeof r.totals.views === "number", "Totals Aggregate Contains Views Metric");
    assert(r.totals && typeof r.totals.estimatedMinutesWatched === "number", "Totals Aggregate Contains Watch Time Minutes");
    assert(r.totals && typeof r.totals.netSubscribers === "number", "Totals Aggregate Contains Net Subscribers");
    assert(r.totals && typeof r.totals.averageViewDurationSeconds === "number", "Totals Aggregate Contains Average View Duration");
  } catch (err) {
    assert(false, "Analytics 7-Day Report", err.message);
  }

  // TEST 7: Analytics API Report (28-Day Overview)
  try {
    const res = await fetchJson("/api/youtube/analytics?days=28");
    assert(res.status === 200, "Analytics 28-Day Endpoint Responds HTTP 200");
    const r = res.data.report;
    assert(r && r.dailyRows && r.dailyRows.length === 28, "Analytics 28-Day Returns Exactly 28 Daily Rows");
  } catch (err) {
    assert(false, "Analytics 28-Day Report", err.message);
  }

  // TEST 8: Analytics API Report (90-Day Overview)
  try {
    const res = await fetchJson("/api/youtube/analytics?days=90");
    assert(res.status === 200, "Analytics 90-Day Endpoint Responds HTTP 200");
    const r = res.data.report;
    assert(r && r.dailyRows && r.dailyRows.length === 90, "Analytics 90-Day Returns Exactly 90 Daily Rows");
  } catch (err) {
    assert(false, "Analytics 90-Day Report", err.message);
  }

  // TEST 9: Top Performing Videos Table Data
  try {
    const res = await fetchJson("/api/youtube/analytics?days=28");
    const r = res.data.report;
    assert(r && Array.isArray(r.topVideos) && r.topVideos.length > 0, "Top Performing Content Returned");
    const topVideo = r.topVideos[0];
    assert(topVideo.title && typeof topVideo.views === "number", "Top Video Contains Title and Views Count");
  } catch (err) {
    assert(false, "Top Videos Analytics", err.message);
  }

  // TEST 10: Incremental Synchronization Endpoint
  try {
    const res = await fetchJson("/api/youtube/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ days: 28 }),
    });
    assert(res.status === 200, "Sync Endpoint Responds HTTP 200");
    assert(res.data.success === true, "Synchronization Flagged as Success");
    assert(typeof res.data.videosSynced === "number", "Videos Synced Count Reported");
    assert(typeof res.data.analyticsDaysSynced === "number", "Analytics Days Synced Reported");
    assert(res.data.syncStatus === "completed", "Sync Status Marked Completed");
  } catch (err) {
    assert(false, "Incremental Synchronization", err.message);
  }

  // TEST 11: Channel Disconnection Endpoint
  try {
    const res = await fetchJson("/api/auth/youtube/disconnect", { method: "POST" });
    assert(res.status === 200, "Disconnect Endpoint Responds HTTP 200");
    assert(res.data.success === true, "Channel Disconnected Successfully");

    // Verify status returns disconnected
    const statusRes = await fetchJson("/api/auth/youtube/status");
    assert(statusRes.data.isConnected === false, "Status Confirms Channel Disconnected and Token Revoked");
  } catch (err) {
    assert(false, "Channel Disconnection", err.message);
  }

  console.log("\n=================================================");
  console.log(`📊 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error("Test execution fatal error:", e);
  process.exit(1);
});
