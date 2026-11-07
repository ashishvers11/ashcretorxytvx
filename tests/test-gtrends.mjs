async function parseGoogleTrends() {
  const res = await fetch("https://trends.google.com/trending/rss?geo=IN");
  const xml = await res.text();
  const items = [];
  const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  for (const m of itemMatches) {
    const title = m.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
    const traffic = m.match(/<ht:approx_traffic>([\s\S]*?)<\/ht:approx_traffic>/)?.[1] || "";
    const pubDate = m.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
    const picture = m.match(/<ht:picture>([\s\S]*?)<\/ht:picture>/)?.[1] || "";
    const newsTitle = m.match(/<ht:news_item_title>([\s\S]*?)<\/ht:news_item_title>/)?.[1] || "";
    items.push({ title, traffic, pubDate, picture, newsTitle });
  }
  console.log("Total Google Trends India Items:", items.length);
  console.log(JSON.stringify(items.slice(0, 10), null, 2));
}

parseGoogleTrends();
