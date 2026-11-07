async function verify() {
  const res = await fetch("http://localhost:3000/api/studio/trends?niche=Interesting%20Facts");
  const data = await res.json();
  console.log("Total Topics returned:", data.report.opportunities.length);
  const topics = data.report.opportunities.map(o => o.topic);
  console.log(JSON.stringify(topics, null, 2));

  const forbidden = ["wombat", "shark", "spin", "sunflower", "kela", "shahad", "octopus", "10 aise"];
  const violations = [];
  for (const t of topics) {
    for (const f of forbidden) {
      if (t.toLowerCase().includes(f)) {
        violations.push({ topic: t, matched: f });
      }
    }
  }

  if (violations.length === 0) {
    console.log("SUCCESS! ZERO FORBIDDEN / DUPLICATE TOPICS FOUND!");
  } else {
    console.error("FAILED! Found duplicates:", violations);
  }
}

verify();
