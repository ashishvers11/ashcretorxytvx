async function testUrls() {
  const urls = [
    "https://www.youtube.com/feed/trending?gl=IN&hl=en",
    "https://www.youtube.com/feed/explore",
    "https://www.youtube.com/results?search_query=%23trending+india&sp=CAMSAkAB", // sorted by view count this week
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      const html = await res.text();
      console.log(`URL: ${url} -> length ${html.length}`);
      const match = html.match(/ytInitialData\s*=\s*({.+?});<\/script>/);
      if (match) {
        const text = match[1];
        // Count videoId
        const ids = [...text.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m => m[1]);
        const uniqueIds = [...new Set(ids)];
        console.log(`  Found ${uniqueIds.length} unique videoIds!`);
        // Find titles
        const titles = [...text.matchAll(/"title":\{"runs":\[\{"text":"([^"]+)"/g)].map(m => m[1]);
        console.log(`  Sample titles:`, titles.slice(0, 5));
      }
    } catch (e) {
      console.log("Error for", url, e.message);
    }
  }
}

testUrls();
