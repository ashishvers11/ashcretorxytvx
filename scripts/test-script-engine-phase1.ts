// ==============================================================================
// ASH CREATOR STUDIO — SCRIPT ENGINE REPAIR (PHASE 1) VERIFICATION TEST SUITE
// ==============================================================================

import { generateScriptIntelligencePackage, ScriptLanguage } from "../src/lib/ai/script-intelligence";

const BENCHMARK_TOPICS = [
  { id: 1, name: "Dinosaur extinction" },
  { id: 2, name: "How airplanes are painted" },
  { id: 3, name: "How a flower becomes a fruit" },
  { id: 4, name: "Why time seems to pass faster as we grow older" },
  { id: 5, name: "How a Venus flytrap catches insects" },
];

const LANGUAGES: ScriptLanguage[] = ["Hindi", "Hinglish", "English"];

const FORBIDDEN_ENGLISH_FRAGMENTS_IN_HINDI = [
  /understand\s+the\s+real\s+mechanism/i,
  /empirical\s+research\s+confirms/i,
  /the\s+counter-intuitive\s+scientific/i,
  /is\s+often\s+the\s+exact\s+opposite/i,
  /gain\s+a\s+clear.*understanding/i,
  /the\s+primary\s+scientific\s+or\s+historical\s+mechanism/i,
  /observable\s+physical\s+proof/i,
  /the\s+real-world\s+implication/i,
  /show\s+the\s+transition\s+from/i,
  /start\s+with\s+the\s+everyday\s+observation/i,
  /a\s+clear\s+satisfying\s+takeaway/i,
  /what\s+aspect\s+of\s+this\s+surprised\s+you/i,
];

async function runPhase1Tests() {
  console.log("================================================================================");
  console.log("🚀 STARTING ASH CREATOR STUDIO: SCRIPT ENGINE REPAIR (PHASE 1) TEST SUITE");
  console.log("================================================================================\n");

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  function assert(condition: boolean, testName: string, detail: string = "") {
    totalTests++;
    if (condition) {
      console.log(`  ✅ PASS: ${testName} ${detail ? `(${detail})` : ""}`);
      passedTests++;
    } else {
      console.error(`  ❌ FAIL: ${testName} ${detail ? `(${detail})` : ""}`);
      failedTests++;
    }
  }

  const sampleOutputs: Array<{ topic: string; language: string; script: any }> = [];

  for (const topicItem of BENCHMARK_TOPICS) {
    console.log(`\n--------------------------------------------------------------------------------`);
    console.log(`📌 BENCHMARK TOPIC ${topicItem.id}: "${topicItem.name}"`);
    console.log(`--------------------------------------------------------------------------------`);

    for (const lang of LANGUAGES) {
      console.log(`\n  ▶ Testing Language: [${lang.toUpperCase()}]`);

      const pkg = generateScriptIntelligencePackage({
        userInput: {
          channelId: "test_chan_001",
          topic: topicItem.name,
          format: "youtube_shorts",
          targetDurationSeconds: 55,
          language: lang,
        },
      });

      // 1. Verify Status
      assert(
        pkg.status === "READY",
        `Quality Status is READY`,
        `Status: ${pkg.status}, Score: ${pkg.qualityReport.overallScore}`
      );

      // 2. Verify Zero Trailing Ellipses or Chopped Strings
      const hasTrailingEllipsis = pkg.sections.some(
        (s) => s.voiceover.endsWith("...") || s.voiceover.includes("... ")
      );
      assert(
        !hasTrailingEllipsis,
        `No trailing ellipses or sliced sentences in voiceover`,
        hasTrailingEllipsis ? "Trailing ellipsis detected!" : "All sentences intact"
      );

      // 3. Verify Sentence Terminator Punctuation
      const validTerminators = pkg.sections.every((s) => /[.!?।]$/.test(s.voiceover.trim()));
      assert(
        validTerminators,
        `All scene voiceovers end with valid terminal punctuation (. ! ? ।)`,
        validTerminators ? "Punctuation complete" : "Missing terminal punctuation"
      );

      // 4. Verify Zero Malformed Hook Templates (no "??" or "Why does Why...")
      const hookText = pkg.selectedHook.text;
      const hasDoubleQuestion = hookText.includes("??");
      const hasWhyDoesWhy = /why\s+does\s+why/i.test(hookText);
      assert(
        !hasDoubleQuestion && !hasWhyDoesWhy,
        `Hook template is well-formed`,
        `Hook: "${hookText.slice(0, 60)}..."`
      );

      // 5. Verify Language Purity (Hindi/Hinglish must NOT have raw English prompt fragments)
      if (lang === "Hindi") {
        const fullVoiceover = pkg.sections.map((s) => s.voiceover).join(" ");
        let leaked = false;
        let leakedName = "";
        for (const pat of FORBIDDEN_ENGLISH_FRAGMENTS_IN_HINDI) {
          if (pat.test(fullVoiceover)) {
            leaked = true;
            leakedName = pat.source;
            break;
          }
        }
        assert(
          !leaked,
          `Zero raw English prompt leakage in Hindi voiceover`,
          leaked ? `Found leaked fragment: ${leakedName}` : "Devanagari Hindi clean"
        );
      }

      // 6. Verify Topic Repetition (Full subject must not be spammed in every beat)
      const STOP_WORDS = new Set([
        "the", "how", "why", "what", "is", "a", "an", "of", "to", "in", "for", "on", "does", "are", "do",
        "का", "के", "की", "में", "से", "पर", "और", "है", "हैं", "तो", "या"
      ]);
      const topicKeyword = (
        pkg.topicBrief.mainSubject
          .split(/[\s:,-]+/)
          .map((w) => w.toLowerCase())
          .find((w) => w.length > 2 && !STOP_WORDS.has(w)) || ""
      );
      let occurrences = 0;
      pkg.sections.forEach((s) => {
        if (s.voiceover.toLowerCase().includes(topicKeyword)) {
          occurrences++;
        }
      });
      assert(
        occurrences <= 3,
        `Natural pronoun usage (topic keyword not spammed in every beat)`,
        `Keyword "${topicKeyword}" appears in ${occurrences} of ${pkg.sections.length} scenes`
      );

      // 7. Verify Timing & Pacing Bounds
      const withinPacing =
        pkg.pacingMetrics.wordsPerMinute >= 115 && pkg.pacingMetrics.wordsPerMinute <= 165;
      assert(
        withinPacing,
        `Pacing is within natural speaking range (115-165 WPM)`,
        `WPM: ${pkg.pacingMetrics.wordsPerMinute}, Runtime: ${pkg.actualDurationSeconds}s (Target: 55s), [${topicItem.name} - ${lang}]`
      );

      // 8. Verify Non-Overlapping Sequential Timestamps
      let sequential = true;
      for (let i = 0; i < pkg.sections.length; i++) {
        const sec = pkg.sections[i];
        if (i > 0) {
          if (sec.startSeconds !== pkg.sections[i - 1].endSeconds) {
            sequential = false;
          }
        }
      }
      assert(
        sequential,
        `Timestamps are 100% sequential and non-overlapping`,
        `Scenes: ${pkg.sections.length}`
      );

      // 9. Store sample outputs for the final report
      if (sampleOutputs.length < 5) {
        sampleOutputs.push({
          topic: topicItem.name,
          language: lang,
          script: pkg,
        });
      }
    }
  }

  console.log("\n================================================================================");
  console.log("📊 PHASE 1 TEST SUITE SUMMARY");
  console.log("================================================================================");
  console.log(`Total Assertions Evaluated: ${totalTests}`);
  console.log(`Passed Assertions:         ${passedTests} ( ${( (passedTests / totalTests) * 100 ).toFixed(1)}% )`);
  console.log(`Failed Assertions:         ${failedTests}`);
  console.log("================================================================================\n");

  // Print 2 comprehensive script examples for the completion report
  console.log("════════════════════════════════════════════════════════════════════════════════");
  console.log("SAMPLE OUTPUT 1: Dinosaur Extinction (Hindi Shorts)");
  console.log("════════════════════════════════════════════════════════════════════════════════");
  const dinoHindi = sampleOutputs.find((s) => s.topic.includes("Dinosaur") && s.language === "Hindi");
  if (dinoHindi) {
    console.log(`Title: ${dinoHindi.script.videoTitle}`);
    console.log(`Quality Score: ${dinoHindi.script.qualityReport.overallScore}/100 (${dinoHindi.script.status})`);
    console.log(`Duration: ${dinoHindi.script.actualDurationSeconds}s | WPM: ${dinoHindi.script.pacingMetrics.wordsPerMinute}\n`);
    dinoHindi.script.sections.forEach((sec: any, idx: number) => {
      console.log(`[SCENE ${idx + 1} | ${sec.sectionType} | ${sec.startSeconds}s - ${sec.endSeconds}s (${sec.durationSeconds}s)]`);
      console.log(`VOICEOVER: "${sec.voiceover}"`);
      console.log(`ON-SCREEN TEXT: ${sec.onScreenText}`);
      console.log(`SOUND EFFECT: ${sec.soundEffect}\n`);
    });
  }

  console.log("════════════════════════════════════════════════════════════════════════════════");
  console.log("SAMPLE OUTPUT 2: How Airplanes Are Painted (English Shorts)");
  console.log("════════════════════════════════════════════════════════════════════════════════");
  const planeEnglish = sampleOutputs.find((s) => s.topic.includes("airplanes") && s.language === "English");
  if (planeEnglish) {
    console.log(`Title: ${planeEnglish.script.videoTitle}`);
    console.log(`Quality Score: ${planeEnglish.script.qualityReport.overallScore}/100 (${planeEnglish.script.status})`);
    console.log(`Duration: ${planeEnglish.script.actualDurationSeconds}s | WPM: ${planeEnglish.script.pacingMetrics.wordsPerMinute}\n`);
    planeEnglish.script.sections.forEach((sec: any, idx: number) => {
      console.log(`[SCENE ${idx + 1} | ${sec.sectionType} | ${sec.startSeconds}s - ${sec.endSeconds}s (${sec.durationSeconds}s)]`);
      console.log(`VOICEOVER: "${sec.voiceover}"`);
      console.log(`ON-SCREEN TEXT: ${sec.onScreenText}`);
      console.log(`SOUND EFFECT: ${sec.soundEffect}\n`);
    });
  }

  if (failedTests > 0) {
    process.exit(1);
  }
}

runPhase1Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
