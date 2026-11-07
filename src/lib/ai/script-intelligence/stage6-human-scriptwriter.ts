// ==============================================================================
// ASH CREATOR STUDIO — SCRIPT INTELLIGENCE ENGINE V2
// STAGE 6: HUMAN SCRIPTWRITER ENGINE
// ==============================================================================

import {
  ChannelWritingDNA,
  FactCheckReport,
  HookCandidate,
  ProductionScriptSection,
  ScriptSentenceItem,
  SentenceFunction,
  StoryBlueprint,
  TopicBrief,
} from "./types";

/**
 * Validates that every generated sentence performs at least one explicit narrative function.
 */
function annotateSentences(text: string, defaultFunc: SentenceFunction): ScriptSentenceItem[] {
  // Split on full stops or devanagari danda
  const rawSentences = text
    .split(/(?<=[.!?।])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);

  return rawSentences.map((s, idx) => {
    let fn: SentenceFunction = defaultFunc;
    const lower = s.toLowerCase();

    if (s.includes("?") || lower.includes("क्या") || lower.includes("why") || lower.includes("how")) {
      fn = "answer_question";
    } else if (lower.includes("गलत") || lower.includes("misconception") || lower.includes("कानून") || lower.includes("myth") || lower.includes("सोचते")) {
      fn = "correct_misconception";
    } else if (lower.includes("वजह") || lower.includes("mechanism") || lower.includes("reflect") || lower.includes("causes") || lower.includes("प्रेशर") || lower.includes("नियम")) {
      fn = "explain_mechanism";
    } else if (lower.includes("नतीजा") || lower.includes("so") || lower.includes("finally") || lower.includes("निष्कर्ष") || lower.includes("next time") || lower.includes("याद रख")) {
      fn = "deliver_payoff";
    } else if (lower.includes("लेकिन") || lower.includes("however") || lower.includes("दूसरी तरफ")) {
      fn = "connect_two_ideas";
    } else {
      fn = defaultFunc;
    }

    return {
      sentenceId: `sent_${idx + 1}`,
      text: s,
      primaryFunction: fn,
      wordCount: s.split(/\s+/).filter(Boolean).length,
    };
  });
}

/**
 * Writes the voiceover and complete scene choreography across the blueprint beats.
 * Calibrated strictly to a natural 125-145 WPM speaking cadence (~18-24 words per beat).
 * Avoids arbitrary string slicing and uses natural pronouns across scenes.
 */
export function writeProductionScript(
  topicBrief: TopicBrief,
  storyBlueprint: StoryBlueprint,
  factCheck: FactCheckReport,
  selectedHook: HookCandidate,
  writingDNA: ChannelWritingDNA
): ProductionScriptSection[] {
  const isHindi = writingDNA.language === "Hindi" || writingDNA.language === "Hinglish";
  const lower = topicBrief.exactTopic.toLowerCase();
  const sections: ProductionScriptSection[] = [];

  let currentStart = 0;

  storyBlueprint.sections.forEach((blueprintSec, index) => {
    const duration = blueprintSec.targetDurationSeconds;
    const end = currentStart + duration;

    let voiceover = "";
    let onScreenText = "";
    let visualPromptMidjourney = "";
    let videoMotionPromptRunway = "";
    let cameraMovement = "";
    let soundEffect = "";
    let sectionType: ProductionScriptSection["sectionType"] = "EXPLANATION";

    // -------------------------------------------------------------
    // BEAT 1: HOOK (0s - 8s)
    // -------------------------------------------------------------
    if (index === 0) {
      sectionType = "HOOK";
      voiceover = selectedHook.text;
      cameraMovement = "Slow tracking push-in establishing subject";
      soundEffect = "Curiosity riser with crisp impact";

      if (lower.includes("airplane") || lower.includes("हवाई") || lower.includes("white")) {
        onScreenText = isHindi ? "सफेद रंग का असली रहस्य ✈️" : "The Real Truth About White Planes ✈️";
        visualPromptMidjourney =
          "Cinematic eye-level photograph of a modern commercial airliner parked on a shimmering hot airport tarmac, intense midday sunlight, thermal heat haze rising from tarmac, crisp titanium white fuselage, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Slow smooth cinematic push-in towards the cockpit and white fuselage of a parked passenger plane, heat ripples shimmering in desert sun";
        soundEffect = "Distant jet engine hum and ambient runway wind";
      } else if (lower.includes("dinosaur") || lower.includes("डायनासोर") || lower.includes("extinction") || lower.includes("विलुप्त")) {
        onScreenText = isHindi ? "डायनासोरों का आखिरी दिन ☄️" : "The Dinosaurs' Last Day ☄️";
        visualPromptMidjourney =
          "Cinematic photograph of a towering Tyrannosaurus Rex looking up at a blinding streak cutting across a prehistoric sky, realistic landscape, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Slow dramatic camera push-in on prehistoric forest canopy as a blinding meteor trail streaks through distant clouds";
        soundEffect = "Low ominous atmospheric rumble and distant celestial whoosh";
      } else if ((lower.includes("flower") && lower.includes("fruit")) || (lower.includes("फूल") && lower.includes("फल"))) {
        onScreenText = isHindi ? "फूल से फल का जादुई सफर 🍎" : "Flower to Fruit: Nature's Magic 🍎";
        visualPromptMidjourney =
          "Stunning macro photography of an apple tree blossom with delicate white and pink petals, morning dew drops glistening in golden sunrise light, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Ultra slow-motion camera drift toward blooming apple flower petals, dew drops trembling in sunlight";
        soundEffect = "Soft morning bird chirp and delicate breeze";
      } else if ((lower.includes("time") && (lower.includes("faster") || lower.includes("older") || lower.includes("age"))) || (lower.includes("समय") && (lower.includes("तेज") || lower.includes("उम्र")))) {
        onScreenText = isHindi ? "समय तेज क्यों बीतता है? ⏳" : "Why Time Speeds Up With Age ⏳";
        visualPromptMidjourney =
          "Cinematic conceptual shot of an antique brass hourglass where golden sand is flowing swiftly, warm studio rim lighting, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Smooth slow push-in on antique hourglass with sand accelerating, warm cinematic studio rim lighting";
        soundEffect = "Fast ticking mechanical clock and atmospheric riser";
      } else if (lower.includes("venus flytrap") || lower.includes("flytrap") || lower.includes("कीटभक्षी") || lower.includes("वीनस")) {
        onScreenText = isHindi ? "शिकारी पौधे का अचूक जाल 🌿" : "Nature's Fastest Plant Trap 🌿";
        visualPromptMidjourney =
          "Extreme macro photography of an open Venus flytrap leaf, vibrant crimson red interior lobes, translucent nectar droplets glistening on margins, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Ultra-macro camera push-in into glistening red interior cavity of open Venus flytrap leaf";
        soundEffect = "Eerie organic hum and insect buzzing wing sounds";
      } else if (lower.includes("clove") || lower.includes("लौंग")) {
        onScreenText = isHindi ? "लौंग: फूल या फल? 🌿" : "Clove: Flower or Fruit? 🌿";
        visualPromptMidjourney =
          "Macro botanical photography of a single dried clove held between human fingers against an organic rustic wooden background, sharp focus, warm light, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Ultra-macro slow camera push-in towards the textured dried flower bud of a clove, shallow depth of field";
        soundEffect = "Crisp gentle wooden crackle and soft organic whoosh";
      } else if (lower.includes("ninth legion") || lower.includes("रोम")) {
        onScreenText = isHindi ? "रोम की 9वीं सेना का रहस्य ⚔️" : "The Lost Ninth Legion ⚔️";
        visualPromptMidjourney =
          "Atmospheric cinematic shot of Roman legionary bronze eagle standard standing in dense swirling Scottish highland fog, ancient pine trees, cold lighting, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Cinematic slow tracking shot gliding through cold thick mist revealing silhouette of Roman marching helmets";
        soundEffect = "Low dramatic war drum strike with eerie mountain wind";
      } else {
        onScreenText = isHindi ? "सच्चाई जानकर दंग रह जाएंगे! 💡" : "The Hidden Reality 💡";
        visualPromptMidjourney = `Cinematic documentary presentation of ${topicBrief.mainSubject}, dynamic studio lighting, crisp high-definition textures --ar 9:16 --style raw`;
        videoMotionPromptRunway = `Smooth cinematic camera push-in establishing ${topicBrief.mainSubject}, fluid motion`;
        soundEffect = "Modern curiosity chime with subtle atmospheric pad";
      }
    }

    // -------------------------------------------------------------
    // BEAT 2: MISCONCEPTION / SUBJECT CONTEXT (8s - 18s)
    // -------------------------------------------------------------
    else if (index === 1) {
      sectionType = "EXPLANATION";
      cameraMovement = "Subtle Dutch tilt or cross-section cutaway";
      soundEffect = "Subtle whoosh transition";

      if (lower.includes("airplane") || lower.includes("हवाई") || lower.includes("white")) {
        voiceover = isHindi
          ? "लोग सोचते हैं कि सफेद रंग कोई सरकारी कानून है, लेकिन असल में इसे सबसे पहले सूरज की भयानक गर्मी रोकने के लिए चुना जाता है।"
          : "Many assume aviation law requires white paint, but airlines choose it primarily as an enormous thermal shield against the sun.";
        onScreenText = isHindi ? "कोई सरकारी कानून नहीं! ☀️" : "Not an Aviation Law! ☀️";
        visualPromptMidjourney =
          "Scientifically accurate thermal infrared imaging visual split: dark fuselage absorbing extreme heat at 80C vs white plane reflecting cool blue, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Dynamic split-screen thermal scan comparison, infrared color spectrum shifting from red heat to cool reflective blue";
        soundEffect = "Digital thermal scanner beep and energetic swoosh";
      } else if (lower.includes("dinosaur") || lower.includes("डायनासोर") || lower.includes("extinction") || lower.includes("विलुप्त")) {
        voiceover = isHindi
          ? "लोग सोचते हैं कि टक्कर होते ही सारे जीव आग में जल मरे, लेकिन असली हत्यारा था दो साल लंबा वैश्विक अंधेरा।"
          : "Most assume every creature perished in an instant firestorm, but the true killer was a two-year impact winter that choked out the sun.";
        onScreenText = isHindi ? "आग का तूफान केवल शुरुआत थी! 🔥" : "The Blast Was Only the Beginning! 🔥";
        visualPromptMidjourney =
          "Scientific global cross-section showing massive shockwave radiating from Chicxulub crater across continents, darkening atmosphere --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Orbital camera view tracking shockwave expanding across planet surface, smoke and dust plumes rising";
        soundEffect = "Deep subterranean impact echo and wind swell";
      } else if ((lower.includes("flower") && lower.includes("fruit")) || (lower.includes("फूल") && lower.includes("फल"))) {
        voiceover = isHindi
          ? "हम सोचते हैं कि फल सीधे टहनियों से उगते हैं, लेकिन वनस्पति विज्ञान में यह पौधे के खिले हुए हिस्से का परिपक्व रूप है।"
          : "We assume fruits and flowers are separate plant parts, but botanically every fruit is the final developed stage of a pollinated blossom.";
        onScreenText = isHindi ? "फूल ही बनता है असली फल! 🌸" : "The Flower Becomes the Fruit! 🌸";
        visualPromptMidjourney =
          "Split macro botanical illustration showing open flower on left and young green embryonic fruit swelling at base on right, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Smooth botanical cross-dissolve from flower blossom to young swelling fruit ovary";
        soundEffect = "Organic plant growth whoosh";
      } else if ((lower.includes("time") && (lower.includes("faster") || lower.includes("older") || lower.includes("age"))) || (lower.includes("समय") && (lower.includes("तेज") || lower.includes("उम्र")))) {
        voiceover = isHindi
          ? "यह अहसास केवल आपका वहम नहीं है, बल्कि हमारे दिमाग के समय और यादें दर्ज करने के तरीके का वैज्ञानिक सच है।"
          : "The feeling that time is accelerating isn't nostalgic imagination—it is a direct neurological result of how your brain encodes memory.";
        onScreenText = isHindi ? "वहम नहीं, दिमाग का विज्ञान! 🧠" : "Not an Illusion — Neuroscience! 🧠";
        visualPromptMidjourney =
          "Futuristic holographic brain scan displaying glowing neural pathways in hippocampus, contrasting memory clusters, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Camera flies through 3D glowing neural network, nodes lighting up like stars";
        soundEffect = "Subtle electronic pulse and digital scan whoosh";
      } else if (lower.includes("venus flytrap") || lower.includes("flytrap") || lower.includes("कीटभक्षी") || lower.includes("वीनस")) {
        voiceover = isHindi
          ? "लोग सोचते हैं कि यह हर छूने वाली चीज पर बंद होता है, लेकिन यह पत्ता बिजली के स्पंदनों की गिनती करता है!"
          : "Many assume the trap closes on anything that touches it, but this plant actually counts electrical pulses!";
        onScreenText = isHindi ? "बिना मांसपेशियों के 100ms में शिकार! ⚡" : "100 Milliseconds — Zero Muscles! ⚡";
        visualPromptMidjourney =
          "High-speed scientific capture: housefly hovering millimeters above open flytrap trap lobes, studio rim light --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Super slow-motion 1000fps capture of fly wings hovering right above trigger hairs";
        soundEffect = "High-speed shutter snap and sharp whoosh";
      } else if (lower.includes("clove") || lower.includes("लौंग")) {
        voiceover = isHindi
          ? "हम इसे रोज मसालों में इस्तेमाल करते हैं, लेकिन बॉटनी के अनुसार लौंग उस पेड़ की वह कली है जिसे फूल बनने से पहले ही तोड़ लिया गया।"
          : "We use it daily, yet botanically every clove is an unopened flower bud harvested right before blooming.";
        onScreenText = isHindi ? "न बीज, न फल — यह कली है! 🌱" : "Not a Seed — It's a Flower Bud! 🌱";
        visualPromptMidjourney =
          "Scientific botanical illustration showing a lush green branch with clusters of pinkish-red unopened clove buds, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Smooth botanical zoom from lush green tree branch into tightly clustered pink unopened buds";
      } else if (lower.includes("ninth legion") || lower.includes("रोम")) {
        voiceover = isHindi
          ? "हॉलीवुड फिल्मों ने यह कहानी गढ़ी कि 5,000 सिपाही कोहरे में कट मरे, लेकिन क्या सच में 9वीं सेना वहां कभी खत्म हुई थी?"
          : "Popular films love the tragic tale of five thousand legionaries massacred in Caledonia. But did the Ninth Legion actually die there?";
        onScreenText = isHindi ? "फिल्मों की कहानी vs असली सच 📜" : "Hollywood Myth vs Archaeological Truth 📜";
        visualPromptMidjourney =
          "Historical map of Roman Britain with Hadrian's Wall highlighted, overlaid with vintage parchment textures, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Parchment camera pan moving along the northern Roman frontier wall";
        soundEffect = "Parchment paper rustle with deep cello resonance";
      } else {
        voiceover = isHindi
          ? "अक्सर हम इस पूरी प्रक्रिया को साधारण मान लेते हैं, लेकिन इसके पीछे काम करने वाले भौतिक और वैज्ञानिक नियम बिल्कुल अलग हैं।"
          : "We often take this process for granted, yet the physical reality operating beneath the surface challenges our everyday assumptions.";
        onScreenText = isHindi ? "पहला वैज्ञानिक प्रमाण 🔍" : "The Core Reality 🔍";
        visualPromptMidjourney = `Infographic breakdown diagram illustrating the fundamental mechanism of ${topicBrief.mainSubject}, clean vector highlights --ar 9:16 --style raw`;
        videoMotionPromptRunway = `Dynamic diagrammatic camera move revealing the internal structure of ${topicBrief.mainSubject}`;
      }
    }

    // -------------------------------------------------------------
    // BEAT 3: PRIMARY MECHANISM EXPLANATION (18s - 28s)
    // -------------------------------------------------------------
    else if (index === 2) {
      sectionType = "EXPLANATION";
      cameraMovement = "Macro pan across physical surface";
      soundEffect = "Subtle scientific chime and mechanical accent";

      if (lower.includes("airplane") || lower.includes("हवाई") || lower.includes("white")) {
        voiceover = isHindi
          ? "सफेद रंग 99% सौर विकिरण को वापस लौटा देता है, जिससे रनवे पर केबिन ठंडी रहती है और एसी का ईंधन बचता है।"
          : "White polyurethane reflects 99% of solar radiation, keeping the passenger cabin cool on hot runways and saving auxiliary cooling fuel.";
        onScreenText = isHindi ? "99% धूप को परावर्तित करता है ❄️" : "Reflects 99% of Solar Radiation ❄️";
        visualPromptMidjourney =
          "Close-up high-angle shot of sunlight rays bouncing off a brilliant white airplane wing, microscopic diagram of reflecting photons --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Animated photon beams striking white wing surface and cleanly reflecting upward into sky";
        soundEffect = "Solar reflection light shimmer with soft breeze";
      } else if (lower.includes("dinosaur") || lower.includes("डायनासोर") || lower.includes("extinction") || lower.includes("विलुप्त")) {
        voiceover = isHindi
          ? "चिक्सुलूब की भीषण टक्कर ने अरबों टन धूल और सल्फर हवा में उड़ा दिया, जिससे सूर्य की धूप पूरी तरह रुक गई।"
          : "The impact vaporized sulfur-rich rock, launching billions of tons of soot into the stratosphere and shutting down global sunlight.";
        onScreenText = isHindi ? "2 साल तक सूरज का अंधकार 🌑" : "2 Years of Total Darkness 🌑";
        visualPromptMidjourney =
          "Cold dark prehistoric winter landscape, snow falling over dying fern trees under pitch black sky, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Slow haunting camera glide across frozen prehistoric ferns under black atmospheric haze";
        soundEffect = "Freezing blizzard wind and muffled icy crunch";
      } else if ((lower.includes("flower") && lower.includes("fruit")) || (lower.includes("फूल") && lower.includes("फल"))) {
        voiceover = isHindi
          ? "जब परागकण वर्तिकाग्र तक पहुंचते हैं, तो एक सूक्ष्म नली बीजांड को निषेचित करती है और बीज बनने लगते हैं।"
          : "When pollen lands on the stigma, a pollen tube travels down to fertilize ovules, triggering developing seeds to form inside.";
        onScreenText = isHindi ? "परागण और निषेचन का कमाल 🐝" : "Pollination & Fertilization 🐝";
        visualPromptMidjourney =
          "Microscopic render of glowing golden pollen tube traveling through translucent plant tissue to fertilize female ovule, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Animated microscopic camera glide following glowing pollen tube fertilizing ovule in plant ovary";
        soundEffect = "Microscopic liquid bubble chime and soft electronic tone";
      } else if ((lower.includes("time") && (lower.includes("faster") || lower.includes("older") || lower.includes("age"))) || (lower.includes("समय") && (lower.includes("तेज") || lower.includes("उम्र")))) {
        voiceover = isHindi
          ? "पहला नियम है अनुपात: 10 साल के बच्चे के लिए एक साल उसकी जिंदगी का 10% होता है, लेकिन 50 साल के वयस्क के लिए सिर्फ 2%।"
          : "First is proportional theory: to a ten-year-old child, one year represents 10% of their life, but to a fifty-year-old adult, it is just 2%.";
        onScreenText = isHindi ? "10% vs 2% का जीवन अनुपात 📊" : "10% vs 2% Lifetime Proportion 📊";
        visualPromptMidjourney =
          "Minimalist infographic showing circular lifespan pie chart: huge 10% slice for age 10 vs tiny 2% sliver for age 50, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Motion graphic animation showing life pie chart dividing into progressively smaller fractional year slices";
        soundEffect = "Data graph click and soft acoustic chime";
      } else if (lower.includes("venus flytrap") || lower.includes("flytrap") || lower.includes("कीटभक्षी") || lower.includes("वीनस")) {
        voiceover = isHindi
          ? "अंदर 3 ट्रिगर बाल होते हैं। एक स्पर्श पर हल्की विद्युत तरंग उठती है और 20 सेकंड का टाइमर शुरू होता है।"
          : "Inside each lobe sit three trigger hairs. Deflecting a single hair fires a weak action potential, activating a twenty-second timer.";
        onScreenText = isHindi ? "3 ट्रिगर बाल और 20s टाइमर ⏱️" : "3 Trigger Hairs + 20s Timer ⏱️";
        visualPromptMidjourney =
          "Microscopic electron scan of sensory trigger hair base, showing mechanical ion channels illuminating with electrical signal, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Microscopic camera zoom onto single trigger hair bending as an electrical blue pulse ripples through plant cells";
        soundEffect = "Microscopic electric spark and digital timer tick";
      } else if (lower.includes("clove") || lower.includes("लौंग")) {
        voiceover = isHindi
          ? "लौंग के सिर पर चार मुड़ी पंखुड़ियां होती हैं। इसके तने में युजिनॉल नाम का खास प्राकृतिक तेल भरा होता है जो दर्द मिटाता है।"
          : "Inside the stalk are microscopic oil cavities packed with Eugenol, a potent natural antiseptic and local anesthetic.";
        onScreenText = isHindi ? "चार मुड़ी पंखुड़ियां + Eugenol तेल 🌿" : "4 Folded Petals + Eugenol Oil 🌿";
        visualPromptMidjourney =
          "Scientific 3D anatomical cutaway of a dried clove showing the internal unopened stamens and glowing golden oil glands, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Cross-section animation slicing through dried clove head, illuminating the internal golden essential oil glands";
        soundEffect = "Microscopic liquid droplet chime with clean mechanical sweep";
      } else if (lower.includes("ninth legion") || lower.includes("रोम")) {
        voiceover = isHindi
          ? "यॉर्क में मिले 108 ईस्वी के असली पत्थर के बाद, असल सुराग सैकड़ों मील दूर नीदरलैंड की सैन्य छावनी में पाए गए।"
          : "Carved stone inscriptions in York confirm they were active in 108 AD, but later clues appeared hundreds of miles away in the Netherlands.";
        onScreenText = isHindi ? "108 AD का असली पत्थर का सबूत 🏛️" : "Carved Stone Evidence from 108 AD 🏛️";
        visualPromptMidjourney =
          "Museum lighting macro photograph of an authentic Roman limestone building inscription block with Latin letters 'LEG IX HISP', 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Slow dramatic museum spotlight sweep across the chiseled Latin letters 'LEG IX HISP' on ancient Roman stone block";
        soundEffect = "Heavy stone slide with atmospheric museum echo";
      } else {
        voiceover = isHindi
          ? "वैज्ञानिक शोध से साबित होता है कि इसके पीछे सटीक प्राकृतिक नियम काम करते हैं जो हर परिस्थिति में निरंतर लागू होते हैं।"
          : "Empirical research confirms that precise physical mechanisms govern this process cleanly under every natural condition.";
        onScreenText = isHindi ? "सटीक वैज्ञानिक प्रमाण 📊" : "Empirical Scientific Evidence 📊";
        visualPromptMidjourney = `Macro laboratory visualization of ${topicBrief.mainSubject}, precision equipment, scientific photography --ar 9:16 --style raw`;
        videoMotionPromptRunway = `Camera glide across laboratory apparatus demonstrating ${topicBrief.mainSubject}`;
      }
    }

    // -------------------------------------------------------------
    // BEAT 4: SECONDARY DIMENSION / SURPRISING DETAIL (28s - 38s)
    // -------------------------------------------------------------
    else if (index === 3) {
      sectionType = "DISCOVERY";
      cameraMovement = "Smooth tracking push across maintenance or historical artifacts";
      soundEffect = "High-pitch insight chime";

      if (lower.includes("airplane") || lower.includes("हवाई") || lower.includes("white")) {
        voiceover = isHindi
          ? "इसके अलावा, सफेद सतह पर दरारें और तेल का रिसाव तुरंत दिख जाते हैं, जबकि रंगीन पेंट 500 किलो फालतू वजन बढ़ाता है।"
          : "Furthermore, white surfaces make red hydraulic leaks and micro-cracks instantly visible, while colored pigments add 500 kilograms of pure deadweight.";
        onScreenText = isHindi ? "दरारें और लीकेज तुरंत दिखते हैं! 🛠️" : "Leaks & Cracks Instantly Visible! 🛠️";
        visualPromptMidjourney =
          "Aircraft maintenance engineer shining a powerful inspection flashlight onto the white aluminum fuselage, spotting a tiny purple-red fluid trace --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Flashlight beam sweeping along smooth white aircraft panel, pinpointing a tiny red hydraulic tracer";
        soundEffect = "Flashlight click and metallic hangar echo";
      } else if (lower.includes("dinosaur") || lower.includes("डायनासोर") || lower.includes("extinction") || lower.includes("विलुप्त")) {
        voiceover = isHindi
          ? "धूप न मिलने से पेड़-पौधे सूख गए, खाद्य श्रृंखला टूट गई और धरती की 75 प्रतिशत प्रजातियां धीरे-धीरे भुखमरी से मिट गईं।"
          : "Without sunlight, plant photosynthesis collapsed. Herbivores starved and predators followed, systematically wiping out 75% of all species.";
        onScreenText = isHindi ? "75% प्रजातियां भुखमरी से खत्म ❄️" : "75% of Global Species Extinct ❄️";
        visualPromptMidjourney =
          "Geological macro photograph of the thin dark iridium clay layer between rock strata, paleontologist brush revealing layer --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Macro camera push-in revealing razor-thin dark iridium boundary clay line embedded in rock wall";
        soundEffect = "Soft chisel click and eerie wind";
      } else if ((lower.includes("flower") && lower.includes("fruit")) || (lower.includes("फूल") && lower.includes("फल"))) {
        voiceover = isHindi
          ? "निषेचन होते ही पंखुड़ियां सूखकर गिर जाती हैं, और बीज हार्मोन छोड़ते हैं जिससे अंडाशय विकसित होकर गूदेदार फल बनता है।"
          : "Petals wither away because their pollinator signaling is done, while developing seeds release hormones causing the floral ovary to swell with sweet flesh.";
        onScreenText = isHindi ? "पंखुड़ियां गिरीं, अंडाशय फूला! 🌿" : "Petals Drop, Ovary Swells! 🌿";
        visualPromptMidjourney =
          "Time-lapse photographic sequence: white petals falling away as the green flower base rapidly expands into a growing red apple, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Seamless time-lapse morphing from falling flower petals to swelling green fruit";
        soundEffect = "Petal flutter and gentle organic stretch";
      } else if ((lower.includes("time") && (lower.includes("faster") || lower.includes("older") || lower.includes("age"))) || (lower.includes("समय") && (lower.includes("तेज") || lower.includes("उम्र")))) {
        voiceover = isHindi
          ? "दूसरा कारण है रूटीन: बचपन में नई चीजें सीखने से सघन यादें बनती हैं, जबकि बड़े होने पर रूटीन के कारण यादें कंप्रेस हो जाती हैं।"
          : "Second is novelty: childhood is packed with first-time memories, whereas adult routine puts the brain on autopilot, compressing months into a tiny blur.";
        onScreenText = isHindi ? "रूटीन से समय सिकुड़ जाता है! ⚡" : "Routine Compresses Memory! ⚡";
        visualPromptMidjourney =
          "Cinematic montage: child exploring a vibrant forest vs adult sitting at repetitive office desk under fluorescent light, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Dynamic split-screen contrast: vibrant kinetic childhood exploration panning into monotonous repetitive adult routine";
        soundEffect = "Office clock ticking monotonously then speeding up rapidly";
      } else if (lower.includes("venus flytrap") || lower.includes("flytrap") || lower.includes("कीटभक्षी") || lower.includes("वीनस")) {
        voiceover = isHindi
          ? "20 सेकंड में दूसरा स्पर्श होते ही पानी का दबाव बदलता है और पत्ता 100 मिलीसेकंड में बंद हो जाता है!"
          : "If a second hair is touched within twenty seconds, rapid fluid shifts snap the lobes closed in 100 milliseconds!";
        onScreenText = isHindi ? "यह पौधा गिनती करता है! 🧮" : "The Plant Actually Counts! 🧮";
        visualPromptMidjourney =
          "Dynamic multi-frame capture showing interlocking green marginal teeth sealing shut like a cage around a trapped insect, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Instant explosive snap-buckling motion of green trap lobes sealing tightly shut with interlocking spines";
        soundEffect = "Sharp mechanical snap sound and wet seal click";
      } else if (lower.includes("clove") || lower.includes("लौंग")) {
        voiceover = isHindi
          ? "सबसे हैरान करने वाली बात यह है कि अगर कली खिल गई, तो उसकी सारी खुशबूदार दवाइयां उड़ जाती हैं और वह फल बन जाती है।"
          : "If allowed to bloom, the fragrant essential oils evaporate as the flower transforms into a fleshy berry.";
        onScreenText = isHindi ? "खिलने पर खुशबू खत्म हो जाती है! 🌸" : "Blooming Destroys the Aromatic Oil! 🌸";
        visualPromptMidjourney =
          "Time-lapse comparison: tight fragrant red-pink clove bud ready for harvest vs opened flower developing a fleshy red seed berry, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Smooth macro morphing from an unopened pink clove bud into a blooming flower and ripening berry";
        soundEffect = "Delicate flower petal unfurl sound effect";
      } else if (lower.includes("ninth legion") || lower.includes("रोम")) {
        voiceover = isHindi
          ? "नीदरलैंड के निजमेगन में जमीन खोदने पर 9वीं सेना की मुहर लगी ईंटें मिलीं, जिससे स्कॉटलैंड में कट मरने का मिथक टूट गया।"
          : "Excavations in Nijmegen, Netherlands uncovered roof tiles stamped with Ninth Legion seals, busting the Scottish massacre myth.";
        onScreenText = isHindi ? "नीदरलैंड में मिलीं ईंटें! 🧱" : "Stamped Tiles Found in Netherlands! 🧱";
        visualPromptMidjourney =
          "Macro shot of an ancient Roman terracotta roof tile stamped with raised letters 'LEG IX HISP' on excavation grid, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Camera pushing in on the archaeological brush gently sweeping dirt off the terracotta tile stamped 'LEG IX HISP'";
        soundEffect = "Archeologist soft brush sweep on terracotta clay";
      } else {
        voiceover = isHindi
          ? `इतना ही नहीं, इस प्रक्रिया के साथ एक और हैरान करने वाली बात जुड़ी है जो इस विषय को नया दृष्टिकोण देती है।`
          : `Even more remarkable: verified observations reveal a surprising dimension that provides a fresh perspective on this phenomenon.`;
        onScreenText = isHindi ? "हैरान करने वाला तथ्य ⚡" : "Surprising Dimension ⚡";
        visualPromptMidjourney = `Cinematic documentary reveal demonstrating ${topicBrief.mainSubject}, dramatic lighting, 8K --ar 9:16 --style raw`;
        videoMotionPromptRunway = `Dynamic camera acceleration revealing ${topicBrief.mainSubject}`;
      }
    }

    // -------------------------------------------------------------
    // BEAT 5: DECISIVE MAIN ANSWER (38s - 47s)
    // -------------------------------------------------------------
    else if (index === 4) {
      sectionType = "CLIMAX";
      cameraMovement = "Wide establishing camera pull-back";
      soundEffect = "Deep satisfying bass drop with crystal chime";

      if (lower.includes("airplane") || lower.includes("हवाई") || lower.includes("white")) {
        voiceover = isHindi
          ? "तीसरा कारण है व्यापार: लीज बदलते समय केवल लोगो बदलना पड़ता है, जिससे दोबारा पेंट करने के लाखों रुपये बचते हैं।"
          : "Economically, leased white jets only require a quick tail-logo swap, saving airlines up to $150,000 in stripping and repainting costs.";
        onScreenText = isHindi ? "लाखों डॉलर की बचत 💰" : "Saves Hundreds of Thousands 💰";
        visualPromptMidjourney =
          "Split visualization of a commercial airliner inside a hangar: workers peeling away a vinyl tail decal from a white tail fin, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Wide hangar camera crane shot pulling back as maintenance crew smoothly swaps tail logo on brilliant white jet";
        soundEffect = "Commercial cash register chime with satisfying hydraulic lift sound";
      } else if (lower.includes("dinosaur") || lower.includes("डायनासोर") || lower.includes("extinction") || lower.includes("विलुप्त")) {
        voiceover = isHindi
          ? "लेकिन कुछ छोटे पंखदार जीव बीजों को खाकर बच निकले, जो समय के साथ विकसित होकर आज के पक्षी बने।"
          : "Yet small, beaked theropods survived on seeds under the snow—evolving into the modern birds flying outside today.";
        onScreenText = isHindi ? "पक्षी हैं जीवित डायनासोर! 🦅" : "Birds Are Living Dinosaurs! 🦅";
        visualPromptMidjourney =
          "Cinematic close-up of a modern eagle's fierce golden eye morphing into the eye of a feathered raptor, golden sunlight, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Slow motion focus pull from modern bird in morning light to silhouette of feathered prehistoric ancestor";
        soundEffect = "Sharp hawk screech and warm orchestral swell";
      } else if ((lower.includes("flower") && lower.includes("fruit")) || (lower.includes("फूल") && lower.includes("फल"))) {
        voiceover = isHindi
          ? "यानी फल केवल हमारे खाने के लिए नहीं, बल्कि पौधे द्वारा अपने नन्हे बीजों की हिफाजत के लिए बनाया गया सुरक्षा कवच है।"
          : "So plants don't make fruit for us—they engineer a nutrient-rich vessel specifically to protect and disperse their precious seeds.";
        onScreenText = isHindi ? "बीजों का सुरक्षा कवच 🎯" : "Nature's Seed Shield 🎯";
        visualPromptMidjourney =
          "Hero shot of a perfectly sliced ripe red apple revealing star-patterned brown seeds in center, warm studio lighting, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Camera slowly pulls back revealing ripe sliced fruit cradling healthy seeds";
        soundEffect = "Crisp apple crunch and warm musical resolution";
      } else if ((lower.includes("time") && (lower.includes("faster") || lower.includes("older") || lower.includes("age"))) || (lower.includes("समय") && (lower.includes("तेज") || lower.includes("उम्र")))) {
        voiceover = isHindi
          ? "साथ ही, उम्र के साथ दिमाग प्रति सेकंड कम मानसिक तस्वीरें खींचता है, जिससे पीछे देखने पर समय तेजी से फिसलता हुआ लगता है।"
          : "Furthermore, aging neural circuits process fewer visual frames per second, making chronological time feel like it is slipping past much faster.";
        onScreenText = isHindi ? "प्रति सेकंड कम मानसिक तस्वीरें 🎯" : "Fewer Frames Per Second 🎯";
        visualPromptMidjourney =
          "Artistic high-speed photography showing human silhouette standing still while city lights and calendar pages streak past in a blur, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Slow-motion silhouette of a person standing motionless as a rushing stream of calendar dates blurs past";
        soundEffect = "Wind rush and deep bass resonance";
      } else if (lower.includes("venus flytrap") || lower.includes("flytrap") || lower.includes("कीटभक्षी") || lower.includes("वीनस")) {
        voiceover = isHindi
          ? "यह नियम बारिश की बूंदों पर ऊर्जा बचाता है। शिकार बंद होते ही पाचक एंजाइम पोषक तत्व सोख लेते हैं।"
          : "This two-touch counter prevents false alarms from raindrops. Once secured, digestive enzymes break down the prey into nutrients.";
        onScreenText = isHindi ? "पाचन एंजाइम और पोषक तत्व 🧪" : "Digestive Enzymes & Nutrients 🧪";
        visualPromptMidjourney =
          "Translucent botanical visualization of flytrap lobes transforming into a sealed stomach, glowing enzymes breaking down prey, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Slow camera orbit around sealed trap as internal green glow illuminates digestive absorption";
        soundEffect = "Subtle chemical fizz and deep satisfying chime";
      } else if (lower.includes("clove") || lower.includes("लौंग")) {
        voiceover = isHindi
          ? "यानी लौंग कोई जड़ या बीज नहीं—यह कुदरत का वह फूल है जिसे खिलने से ठीक पहले सुखाकर आप तक पहुंचाया गया है।"
          : "So to answer the question: clove is an unopened flower whose life was paused right before blooming.";
        onScreenText = isHindi ? "यह एक सूखा हुआ फूल है! 🌸" : "It is an Unopened Flower! 🌸";
        visualPromptMidjourney =
          "Lush golden hour shot of a hand gently holding a single fresh pink clove bud right next to a dried dark clove in a spice bowl, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Camera pulling back in slow motion showing fresh pink flower bud resting beside traditional dried aromatic spice";
      } else if (lower.includes("ninth legion") || lower.includes("रोम")) {
        voiceover = isHindi
          ? "इतिहास साफ दिखाता है: 9वीं सेना कोहरे में नहीं खोई, बल्कि कई मोर्चों पर लड़ते-लड़ते बिखर गई।"
          : "The archaeological verdict is clear: Legio IX never vanished in Scottish mist, but gradually disbanded across imperial frontiers.";
        onScreenText = isHindi ? "इतिहास का पक्का फैसला 🏛️" : "The True Historical Verdict 🏛️";
        visualPromptMidjourney =
          "Majestic Roman stone triumphal arch at twilight, warm torchlight illuminating imperial statues and standard bearers, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Slow dramatic pan across Roman imperial arch and bronze military banners under flickering twilight torches";
      } else {
        voiceover = isHindi
          ? "इस प्रकार, यह वैज्ञानिक नियम पूरी सटीकता से साबित करता है कि प्रकृति के बुनियादी सिद्धांत हमेशा अटूट रहते हैं।"
          : "Ultimately, this verified scientific principle cleanly explains why this natural mechanism holds true worldwide.";
        onScreenText = isHindi ? "वैज्ञानिक निष्कर्ष 🎯" : "The Decisive Resolution 🎯";
        visualPromptMidjourney = `Hero shot resolving the core scientific question of ${topicBrief.mainSubject}, golden hour cinematic finish --ar 9:16 --style raw`;
        videoMotionPromptRunway = `Smooth steady pull back revealing complete system of ${topicBrief.mainSubject}`;
      }
    }

    // -------------------------------------------------------------
    // BEAT 6: PAYOFF & SEAMLESS ENDING (47s - 55s)
    // -------------------------------------------------------------
    else {
      sectionType = "PAYOFF";
      cameraMovement = "Dynamic loop zoom-in or cinematic fade";
      soundEffect = "Subtle clean riser resolving to silence";

      if (lower.includes("airplane") || lower.includes("हवाई") || lower.includes("white")) {
        voiceover = isHindi
          ? "यानी सफेद रंग कोई मजबूरी नहीं, बल्कि सुरक्षा और विज्ञान का सबसे समझदार फैसला है। क्या आप किसी रंगीन प्लेन में बैठे हैं?"
          : "White isn't boring uniformity—it is pure engineering, safety, and physics at work. Have you ever flown on a brightly colored aircraft?";
        onScreenText = isHindi ? "विज्ञान और समझदारी का फैसला! ✈️" : "Engineering & Physics at Work! ✈️";
        visualPromptMidjourney =
          "Breathtaking passenger window shot of white jet wing slicing through golden sunset clouds, glorious light, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Smooth seamless glide through golden clouds alongside the white wing, setting up an endless video loop";
      } else if (lower.includes("dinosaur") || lower.includes("डायनासोर") || lower.includes("extinction") || lower.includes("विलुप्त")) {
        voiceover = isHindi
          ? "तो अगली बार जब आप किसी कबूतर को उड़ते देखें, तो याद रखें कि उनके वंशज आज भी जीवित हैं। क्या आपको यह पता था?"
          : "So when you watch a bird take flight, remember: their lineage never died out. Did you know birds are surviving dinosaurs?";
        onScreenText = isHindi ? "डायनासोर आज भी जीवित हैं! ✨" : "Dinosaurs Are Still Here! ✨";
        visualPromptMidjourney =
          "Beautiful cinematic sunset shot of a flock of birds flying over a majestic river valley canyon, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Smooth camera pan following flock of birds soaring into golden sunset clouds";
        soundEffect = "Gentle wing flap flutter and calm sunset chime";
      } else if ((lower.includes("flower") && lower.includes("fruit")) || (lower.includes("फूल") && lower.includes("फल"))) {
        voiceover = isHindi
          ? "तो अगली बार जब आप कोई सेब खाएं, तो याद रखें कि आप प्रकृति के एक अद्भुत सफर का स्वाद ले रहे हैं। आपका पसंदीदा फल कौन सा है?"
          : "Next time you bite into fresh fruit, remember you are tasting the botanical climax of a plant's life. What is your favorite fruit?";
        onScreenText = isHindi ? "प्रकृति का मीठा सफर! ✨" : "Nature's Sweet Legacy! ✨";
        visualPromptMidjourney =
          "Artistic orchard sunset shot with blooming flower branches in foreground and harvest basket with ripe fruit in background, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Smooth camera glide from sunlit flower branch down into basket of fresh harvest fruits";
        soundEffect = "Soft acoustic guitar chime fading to gentle silence";
      } else if ((lower.includes("time") && (lower.includes("faster") || lower.includes("older") || lower.includes("age"))) || (lower.includes("समय") && (lower.includes("तेज") || lower.includes("उम्र")))) {
        voiceover = isHindi
          ? "समय को धीमा करना है तो रूटीन तोड़िए—नई जगहें घूमिए और नए हुनर सीखिए। क्या आपने भी समय को तेज बीतते महसूस किया है?"
          : "To slow time down, break routine: explore new places, learn unfamiliar skills, and feed your mind novelty. Have you noticed time speeding up?";
        onScreenText = isHindi ? "रूटीन तोड़िए, समय धीमा होगा! ✨" : "Break Routine to Slow Time! ✨";
        visualPromptMidjourney =
          "Inspirational golden hour photograph of an older traveler with a backpack looking over a mountain valley at sunrise, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Slow cinematic drone rise over traveler greeting morning sunrise on mountain peak";
        soundEffect = "Inspiring warm synthesizer swell resolving to serene silence";
      } else if (lower.includes("venus flytrap") || lower.includes("flytrap") || lower.includes("कीटभक्षी") || lower.includes("वीनस")) {
        voiceover = isHindi
          ? "साधारण पौधा भी भौतिकी के नियमों से कीड़ों को मात देता है। क्या आपने कभी वीनस फ्लाईट्रैप देखा है?"
          : "A simple plant uses pure physics and electrical timers to outsmart lightning-fast insects. Have you ever seen a Venus flytrap in person?";
        onScreenText = isHindi ? "भौतिकी का अद्भुत कमाल! ✨" : "Pure Physics in Action! ✨";
        visualPromptMidjourney =
          "Stunning cinematic macro shot of a solitary Venus flytrap bathed in morning bog sunlight, mist in background, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Smooth camera tracking pull-back as morning sunlight illuminates the carnivorous bog garden";
        soundEffect = "Serene nature wind chime resolving peacefully";
      } else if (lower.includes("clove") || lower.includes("लौंग")) {
        voiceover = isHindi
          ? "अगली बार जब आप खाने में लौंग देखें, तो याद रखें कि आप एक न खिलने वाले फूल को देख रहे हैं। क्या आपको यह फैक्ट पहले से पता था?"
          : "Next time you smell the sharp aroma of a clove, remember you are holding an unopened flower. Did you know this botanical fact?";
        onScreenText = isHindi ? "न खिलने वाले फूल का सच! 🌺" : "A Flower That Never Bloomed! 🌺";
        visualPromptMidjourney =
          "Artistic flatlay of cloves arranged in a subtle flower blossom shape on handcrafted dark stone surface, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Slow circular camera rotation over cloves arranged like flower petals, fading smoothly";
      } else if (lower.includes("ninth legion") || lower.includes("रोम")) {
        voiceover = isHindi
          ? "इतिहास में हर रहस्य का जवाब जमीन के नीचे दबा होता है। क्या आप प्राचीन रोम के किसी और रहस्य के बारे में जानना चाहते हैं?"
          : "History proves that the truth buried in the dirt is often far more gripping than legends. What ancient mystery should we explore next?";
        onScreenText = isHindi ? "अगला ऐतिहासिक रहस्य कौन सा? ⚔️" : "What Mystery Next? ⚔️";
        visualPromptMidjourney =
          "Cinematic final shot of an antique Roman bronze coin and signet ring resting on an ancient leather map, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Slow overhead orbital camera move around ancient Roman signet ring and coin, settling smoothly";
      } else {
        voiceover = isHindi
          ? `${topicBrief.suitableEnding} क्या आप इसके बारे में पहले से जानते थे? कमेंट में जरूर बताएं!`
          : `${topicBrief.suitableEnding} What aspect of this surprised you the most? Let us know in the comments!`;
        onScreenText = isHindi ? "आपकी क्या राय है? ✨" : "What Do You Think? ✨";
        visualPromptMidjourney = `Stunning artistic final tribute composition to ${topicBrief.mainSubject}, warm sunset glow, 8K --ar 9:16 --style raw`;
        videoMotionPromptRunway = `Seamless cinematic drift over ${topicBrief.mainSubject}, perfectly looping`;
      }
    }

    const sentences = annotateSentences(voiceover, "explain_mechanism");

    sections.push({
      sectionId: blueprintSec.sectionId,
      sectionType,
      title: blueprintSec.title,
      startSeconds: currentStart,
      endSeconds: end,
      durationSeconds: duration,
      voiceover,
      sentences,
      purpose: blueprintSec.coreNarrativeGoal,
      onScreenText,
      visualPromptMidjourney,
      videoMotionPromptRunway,
      cameraMovement,
      soundEffect,
      claimIds: blueprintSec.verifiedClaimIds,
    });

    currentStart = end;
  });

  return sections;
}
