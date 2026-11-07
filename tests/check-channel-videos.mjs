async function check() {
  const res = await fetch("https://www.youtube.com/feeds/videos.xml?channel_id=UCq_9aJ9FOog48qCfPikSKdg");
  const xml = await res.text();
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
  console.log("Total videos in feed:", entries.length);
  entries.forEach((e, i) => {
    const title = e.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
    const vid = e.match(/<yt:videoId>([\s\S]*?)<\/yt:videoId>/)?.[1] || "";
    const views = e.match(/views="(\d+)"/)?.[1] || "";
    console.log(`${i + 1}. [${views} views] ${title} (ID: ${vid})`);
  });
}

check();
