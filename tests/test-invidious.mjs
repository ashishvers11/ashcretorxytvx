async function testTrendingApis() {
  const instances = [
    "https://inv.nadeko.net/api/v1/trending?region=IN",
    "https://yewtu.be/api/v1/trending?region=IN",
    "https://invidious.nerdvpn.de/api/v1/trending?region=IN",
    "https://invidious.drgns.space/api/v1/trending?region=IN",
    "https://api.piped.privacydev.net/trending?region=IN",
    "https://pipedapi.kavin.rocks/trending?region=IN",
  ];

  for (const url of instances) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(url, { signal: controller.signal, headers: { "User-Agent": "Mozilla/5.0" } });
      clearTimeout(timeout);
      console.log(`URL ${url} -> status ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        console.log(`SUCCESS! Found ${data.length} trending items!`);
        console.log("Sample:", JSON.stringify(data[0], null, 2));
        return data;
      }
    } catch (e) {
      console.log(`Failed for ${url}:`, e.message);
    }
  }
}

testTrendingApis();
