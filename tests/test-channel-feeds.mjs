async function testChannelFeeds() {
  const channels = [
    { name: "FactTechz", id: "UCRU_PkWl_qXm1M2FbgB0nOg", niche: "Interesting Facts" },
    { name: "GetsetflySCIENCE", id: "UC6_T1q1eQ5yq6tVz4n8k5lw", niche: "Science & Mysteries" },
    { name: "Tech Burner", id: "UCXUJJGkvdK_Yx4n1mZf8T_w", niche: "Technology" },
    { name: "Dhruv Rathee", id: "UCEBb_7i6t37kI0aVf1s1Ikg", niche: "Current Affairs & Mysteries" },
    { name: "Total Gaming", id: "UC5c9VlYTSvBSCaoMu_EI6gQ", niche: "Gaming" },
  ];

  for (const ch of channels) {
    try {
      const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${ch.id}`);
      const xml = await res.text();
      const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
      console.log(`Channel ${ch.name} (${ch.niche}): found ${entries.length} latest real videos`);
      if (entries.length > 0) {
        const titleMatch = entries[0].match(/<title>([\s\S]*?)<\/title>/);
        const viewsMatch = entries[0].match(/views="(\d+)"/);
        console.log(`  Top Video: "${titleMatch ? titleMatch[1] : ""}" | Views: ${viewsMatch ? viewsMatch[1] : "N/A"}`);
      }
    } catch (e) {
      console.error("Error for", ch.name, e);
    }
  }
}

testChannelFeeds();
