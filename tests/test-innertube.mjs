async function testInnertube() {
  try {
    const res = await fetch("https://www.youtube.com/youtubei/v1/browse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: "WEB",
            clientVersion: "2.20240301.00.00",
            gl: "IN",
            hl: "en-GB",
          },
        },
        browseId: "FEtrending",
      }),
    });
    console.log("Innertube status:", res.status);
    const data = await res.json();
    console.log("Keys in response:", Object.keys(data));
    
    // Walk and find videoRenderers
    const videos = [];
    function walk(obj) {
      if (!obj || typeof obj !== "object") return;
      if (obj.videoRenderer) {
        const vr = obj.videoRenderer;
        const videoId = vr.videoId;
        const title = vr.title?.runs?.map(r=>r.text).join("") || vr.title?.simpleText || "";
        const channelTitle = vr.ownerText?.runs?.map(r=>r.text).join("") || vr.shortBylineText?.runs?.map(r=>r.text).join("") || "";
        const viewCount = vr.viewCountText?.simpleText || vr.shortViewCountText?.simpleText || "";
        const publishedTime = vr.publishedTimeText?.simpleText || "";
        const thumbnail = vr.thumbnail?.thumbnails?.slice(-1)[0]?.url || "";
        if (videoId && title) {
          videos.push({ videoId, title, channelTitle, viewCount, publishedTime, thumbnail });
        }
      }
      for (const k of Object.keys(obj)) walk(obj[k]);
    }
    walk(data);
    console.log("Total Innertube Trending Videos:", videos.length);
    console.log("First 5 videos:", JSON.stringify(videos.slice(0, 5), null, 2));
  } catch (e) {
    console.error("Innertube Error:", e);
  }
}

testInnertube();
