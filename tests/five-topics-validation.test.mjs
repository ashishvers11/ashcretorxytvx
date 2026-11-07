import test from "node:test";
import assert from "node:assert/strict";

import { runScriptEnginePipeline } from "../src/lib/script-engine/pipeline.ts";

test("Validation Topic 1: Science (Airplane Windows)", async () => {
  const script = await runScriptEnginePipeline({
    topic: "Why Airplane Windows Are Round",
    niche: "Science & Engineering",
    format: "shorts",
    targetDurationSeconds: 60,
    language: "English",
  });

  // 1. Hook Specificity
  assert.ok(script.hooks[0].text.toLowerCase().includes("airplane windows"));
  // 2. Fact Accuracy & Real Primary Source
  const primaryFact = script.factChecks.find((f) => f.verificationStatus === "VERIFIED_PRIMARY");
  assert.ok(primaryFact);
  assert.ok(primaryFact.sourceTitle.includes("Federal Aviation Administration"));
  // 3. Sentence Connection & Flow
  assert.ok(script.fullVoiceover.includes("stress concentrates"));
  // 4. Payoff
  assert.ok(script.narrativeStructure.payoff.length > 20);
  // 5. Scene Matching
  assert.equal(script.scenes.length, 6);
  assert.equal(script.scenes[0].voiceoverLine, script.narrativeStructure.hook);
  // 6. Realistic Duration
  assert.ok(script.estimatedDurationSeconds >= 45 && script.estimatedDurationSeconds <= 75);
});

test("Validation Topic 2: Animals / Biology (Pistol Shrimp Cavitation)", async () => {
  const script = await runScriptEnginePipeline({
    topic: "Pistol Shrimp Cavitation Shockwave",
    niche: "Animals & Biology",
    format: "shorts",
    targetDurationSeconds: 60,
    language: "Hinglish",
  });

  // 1. Hook Specificity
  assert.ok(script.hooks[0].text.toLowerCase().includes("pistol shrimp"));
  // 2. Fact Accuracy (Nature Lohse et al.)
  const primaryFact = script.factChecks.find((f) => f.sourceTitle.includes("Nature"));
  assert.ok(primaryFact);
  assert.equal(primaryFact.verificationStatus, "VERIFIED_PRIMARY");
  assert.ok(primaryFact.sourceUrl.includes("nature.com"));
  // 3. Scene Matching & AI Visual Prompt
  assert.ok(script.scenes[0].imagePrompt.includes("pistol shrimp") || script.scenes[0].imagePrompt.includes("Pistol Shrimp"));
  assert.ok(script.scenes[0].soundEffect.length > 0);
  // 4. Realistic Duration
  assert.ok(script.wordCount >= 70 && script.wordCount <= 180);
});

test("Validation Topic 3: Technology / Computing (Quantum Computing)", async () => {
  const script = await runScriptEnginePipeline({
    topic: "Quantum Computing Qubit Superposition",
    niche: "Technology & Computing",
    format: "shorts",
    targetDurationSeconds: 60,
    language: "English",
  });

  // 1. Hook Specificity
  assert.ok(script.hooks[0].text.toLowerCase().includes("quantum computing"));
  // 2. Primary Source (NIST)
  const nistFact = script.factChecks.find((f) => f.sourceTitle.includes("NIST"));
  assert.ok(nistFact);
  assert.equal(nistFact.verificationStatus, "VERIFIED_PRIMARY");
  // 3. Payoff Resolution
  assert.ok(script.narrativeStructure.payoff.includes("precision") || script.narrativeStructure.payoff.includes("physics"));
  // 4. Quality Gate Score
  assert.ok(script.qualityGate.overallScore >= 85);
});

test("Validation Topic 4: History / Archaeology (Antikythera Mechanism)", async () => {
  const script = await runScriptEnginePipeline({
    topic: "The Antikythera Mechanism Ancient Computer",
    niche: "History & Archaeology",
    format: "shorts",
    targetDurationSeconds: 60,
    language: "Hinglish",
  });

  // 1. Hook Specificity
  assert.ok(script.hooks[0].text.toLowerCase().includes("antikythera"));
  // 2. Real Primary Citation (Freeth et al., Nature 2006)
  const natureFact = script.factChecks.find((f) => f.sourceTitle.includes("Freeth"));
  assert.ok(natureFact);
  assert.equal(natureFact.verificationStatus, "VERIFIED_PRIMARY");
  assert.ok(natureFact.sourceUrl.includes("nature.com/articles/nature05357"));
  // 3. Quality Gate Negative Penalties: Zero unverified claims
  assert.equal(script.qualityGate.negativeCheckPenalties.length, 0);
});

test("Validation Topic 5: Surprising Everyday Fact (Petrichor & Geosmin Rain Smell)", async () => {
  const script = await runScriptEnginePipeline({
    topic: "Why Rain Smells: Geosmin and Petrichor",
    niche: "Everyday Curiosities",
    format: "shorts",
    targetDurationSeconds: 60,
    language: "Hindi",
  });

  // 1. Hook Specificity & Hindi flow
  assert.ok(script.hooks[0].text.includes("Rain Smells") || script.hooks[0].text.includes("Geosmin"));
  assert.equal(script.language, "Hindi");
  // 2. Real Primary Citation (Nature Communications Joung & Buie 2015)
  const rainFact = script.factChecks.find((f) => f.sourceTitle.includes("Nature Communications"));
  assert.ok(rainFact);
  assert.equal(rainFact.verificationStatus, "VERIFIED_PRIMARY");
  assert.ok(rainFact.sourceUrl.includes("nature.com/articles/ncomms7083"));
  // 3. Narrative Continuity
  assert.ok(script.narrativeStructure.mainExplanation.length > 30);
  assert.equal(script.scenes.length, 6);
});
