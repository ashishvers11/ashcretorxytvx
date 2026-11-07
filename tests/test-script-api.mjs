async function testScript() {
  const res = await fetch("http://localhost:3000/api/studio/scripts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic: "Cockroach Bina Sar Ke 9 Din Zinda Kaise Rehta Hai? 🪳",
      niche: "Interesting Facts",
      language: "Hinglish",
      videoFormat: "shorts",
      targetDuration: 60,
    }),
  });
  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Keys:", Object.keys(data));
  if (data.script) {
    console.log("Title:", data.script.title);
    console.log("Hooks:", data.script.hooks.map(h => h.text));
    console.log("Scenes count:", data.script.scenes.length);
    console.log("Fact check count:", data.script.factChecks.length);
    console.log("First fact check:", data.script.factChecks[0]);
  } else {
    console.log("Error response:", data);
  }
}

testScript();
