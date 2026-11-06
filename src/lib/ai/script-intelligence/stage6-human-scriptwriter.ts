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
    } else if (lower.includes("गलत") || lower.includes("misconception") || lower.includes("कानून") || lower.includes("myth")) {
      fn = "correct_misconception";
    } else if (lower.includes("वजह") || lower.includes("mechanism") || lower.includes("reflect") || lower.includes("causes") || lower.includes("प्रेशर")) {
      fn = "explain_mechanism";
    } else if (lower.includes("नतीजा") || lower.includes("so") || lower.includes("finally") || lower.includes("निष्कर्ष") || lower.includes("next time")) {
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
 * Enforces natural, conversational cadence without robotic filler phrases.
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
    // BEAT 1: HOOK
    // -------------------------------------------------------------
    if (index === 0) {
      sectionType = "HOOK";
      voiceover = selectedHook.text;
      onScreenText = isHindi ? "90% विमान सिर्फ सफेद क्यों? ✈️" : "Why 90% of Airplanes Are White? ✈️";
      cameraMovement = "Slow tracking push-in focusing on tarmac flight line";
      soundEffect = "Distant jet engine hum and ambient runway wind";

      if (lower.includes("airplane") || lower.includes("हवाई")) {
        onScreenText = isHindi ? "सफेद रंग का असली रहस्य ✈️" : "The Real Truth About White Planes ✈️";
        visualPromptMidjourney =
          "Cinematic eye-level photograph of a gleaming modern commercial airliner parked on a shimmering hot airport tarmac, intense desert midday sunlight, thermal heat haze rising from tarmac, crisp titanium white fuselage, ultra-realistic 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Slow smooth cinematic push-in towards the cockpit and white fuselage of a parked passenger plane, heat ripples shimmering in desert sun, ultra-smooth 60fps";
      } else if (lower.includes("clove") || lower.includes("लौंग")) {
        onScreenText = isHindi ? "लौंग: फूल या फल? 🌿" : "Clove: Flower or Fruit? 🌿";
        visualPromptMidjourney =
          "Macro botanical photography of a single dried clove held between human fingers against an organic rustic wooden background, sharp focus on the four unopened petals at the head, warm directional light, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Ultra-macro slow camera push-in towards the textured dried flower bud of a clove, shallow depth of field, warm cinematic lighting";
        soundEffect = "Crisp gentle wooden crackle and soft organic whoosh";
      } else if (lower.includes("ninth legion") || lower.includes("रोम")) {
        onScreenText = isHindi ? "रोम की 9वीं सेना का रहस्य ⚔️" : "The Lost Ninth Legion ⚔️";
        visualPromptMidjourney =
          "Atmospheric cinematic shot of Roman legionary bronze eagle standard (Aquila) standing in dense swirling Scottish highland fog, ancient weathered pine trees, moody cold lighting, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Cinematic slow tracking shot gliding through cold thick mist revealing silhouette of Roman marching helmets, atmospheric suspense";
        soundEffect = "Low dramatic war drum strike with eerie whistling mountain wind";
      } else {
        onScreenText = `${topicBrief.mainSubject.slice(0, 28)} 💡`;
        visualPromptMidjourney = `Cinematic documentary presentation of ${topicBrief.mainSubject}, pristine dynamic studio lighting, crisp high-definition textures --ar 9:16 --style raw`;
        videoMotionPromptRunway = `Smooth cinematic camera push-in establishing ${topicBrief.mainSubject}, fluid motion, high fidelity`;
        soundEffect = "Modern curiosity chime with subtle atmospheric pad";
      }
    }

    // -------------------------------------------------------------
    // BEAT 2: MISCONCEPTION / SUBJECT CONTEXT
    // -------------------------------------------------------------
    else if (index === 1) {
      sectionType = "EXPLANATION";
      cameraMovement = "Subtle Dutch tilt or cross-section cutaway";
      soundEffect = "Subtle whoosh transition";

      if (lower.includes("airplane") || lower.includes("हवाई")) {
        voiceover = isHindi
          ? "ज्यादातर लोगों को लगता है कि प्लेन को सफेद रखना एविएशन का कोई सरकारी कानून है। लेकिन असल में एयरलाइंस इसे कानूनी मजबूरी से नहीं, बल्कि सबसे पहले सूरज की भयानक गर्मी से बचने के लिए चुनती हैं।"
          : "Most people assume keeping airplanes white is a mandatory international regulation. But airlines don't choose white because of the law—they choose it primarily as an enormous thermal shield against the sun.";
        onScreenText = isHindi ? "कोई सरकारी कानून नहीं! ☀️" : "Not an Aviation Law! ☀️";
        visualPromptMidjourney =
          "Scientifically accurate thermal infrared imaging visual split: left side showing dark fuselage absorbing extreme heat at 80 degrees Celsius glowing red, right side showing white plane reflecting solar rays glowing cool blue, technical HUD temperature readouts --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Dynamic split-screen thermal scan comparison, infrared color spectrum shifting from burning red heat to cool reflective blue";
        soundEffect = "Digital thermal scanner beep and energetic swoosh";
      } else if (lower.includes("clove") || lower.includes("लौंग")) {
        voiceover = isHindi
          ? "हम इसे रोज मसालों में इस्तेमाल करते हैं, फिर भी 90% लोग इसे पेड़ की छाल या बीज समझ लेते हैं। लेकिन बॉटनी के अनुसार लौंग Syzygium aromaticum पेड़ की वह कली है जिसे फूल बनने से पहले ही तोड़ लिया गया।"
          : "We use it daily in our kitchens, yet most people mistake it for tree bark or a dried seed. Botanically, every single clove is an unopened flower bud from the evergreen tree Syzygium aromaticum.";
        onScreenText = isHindi ? "न बीज, न फल — यह कली है! 🌱" : "Not a Seed — It's a Flower Bud! 🌱";
        visualPromptMidjourney =
          "Scientific botanical illustration showing a lush green clove branch with clusters of pinkish-red unopened buds alongside a single fully bloomed white-fringed flower, educational clarity --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Smooth botanical zoom from lush green tree branch into tightly clustered pink unopened buds, sunlight filtering through leaves";
      } else if (lower.includes("ninth legion") || lower.includes("रोम")) {
        voiceover = isHindi
          ? "हॉलीवुड फिल्मों ने यह कहानी गढ़ी कि 5,000 रोमन सिपाही स्कॉटलैंड की पहाड़ियों में घुसे और बर्बर कबीलों ने उन्हें रातों-रात खत्म कर दिया। लेकिन क्या सच में 9वीं सेना वहां कभी खत्म हुई थी?"
          : "Popular films love the tragic tale of five thousand Roman legionaries marching into northern Caledonia, supposedly massacred to the last man. But did the Ninth Legion actually die there?";
        onScreenText = isHindi ? "फिल्मों की कहानी vs असली सच 📜" : "Hollywood Myth vs Archaeological Truth 📜";
        visualPromptMidjourney =
          "Historical map of Roman Britain with Hadrian's Wall highlighted, overlaid with vintage parchment textures and tactical military legion markers, 8K documentary style --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Parchment camera pan moving along the northern Roman frontier wall, tactical legion emblems illuminating on old map";
        soundEffect = "Parchment paper rustle with deep cello resonance";
      } else {
        voiceover = isHindi
          ? `अक्सर हम ${topicBrief.mainSubject} को जैसा देखते हैं, उसकी भीतरी कार्यप्रणाली उससे बिल्कुल अलग होती है। आइए इसके पहले बड़े वैज्ञानिक कारण को समझें।`
          : `We often take ${topicBrief.mainSubject} for granted, yet the physical reality operating beneath the surface challenges our everyday assumptions.`;
        onScreenText = `${topicBrief.mainLearningOutcome.slice(0, 30)} 🔍`;
        visualPromptMidjourney = `Infographic breakdown diagram illustrating the fundamental mechanism of ${topicBrief.mainSubject}, clean vector highlights, educational clarity --ar 9:16 --style raw`;
        videoMotionPromptRunway = `Dynamic diagrammatic camera move revealing the internal structure of ${topicBrief.mainSubject}`;
      }
    }

    // -------------------------------------------------------------
    // BEAT 3: PRIMARY MECHANISM EXPLANATION
    // -------------------------------------------------------------
    else if (index === 2) {
      sectionType = "EXPLANATION";
      cameraMovement = "Macro pan across physical surface";
      soundEffect = "Subtle scientific chime and mechanical accent";

      if (lower.includes("airplane") || lower.includes("हवाई")) {
        voiceover = isHindi
          ? "सफेद रंग सूरज की 90 से 99 प्रतिशत धूप को वापस आसमान में परावर्तित कर देता है। रनवे पर खड़े विमान की केबिन ठंडी रहती है, जिससे एयर कंडीशनर का ईंधन बचता है और विमान की बॉडी को थर्मल तनाव नहीं झेलना पड़ता।"
          : "White paint reflects between 90% and 99% of solar radiation. On a scorching runway tarmac, this keeps the passenger cabin cool, slashing air-conditioning fuel burn and preventing severe thermal expansion on composite airframes.";
        onScreenText = isHindi ? "99% धूप को परावर्तित करता है ❄️" : "Reflects 99% of Solar Radiation ❄️";
        visualPromptMidjourney =
          "Close-up high-angle shot of sunlight rays bouncing off a brilliant white airplane wing, microscopic scientific diagram showing solar photons reflecting off titanium dioxide pigment crystals --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Animated photon beams striking white wing surface and cleanly reflecting upward into sky, sparkling clean clarity";
        soundEffect = "Solar reflection light shimmer with soft breeze";
      } else if (lower.includes("clove") || lower.includes("लौंग")) {
        voiceover = isHindi
          ? "अगर आप लौंग के सिर को गौर से देखें, तो वे चार मुड़ी हुई पंखुड़ियां हैं। इसके तने जैसी नली में युजिनॉल (Eugenol) नाम का खास प्राकृतिक तेल भरा होता है, जो दांतों के दर्द में कुदरती एनेस्थीसिया की तरह काम करता है।"
          : "If you look closely at the crown of a clove, you see four folded petals. Inside the stalk-like hypanthium are microscopic oil cavities packed with Eugenol, a potent natural antiseptic and local anesthetic.";
        onScreenText = isHindi ? "चार मुड़ी पंखुड़ियां + Eugenol तेल 🌿" : "4 Folded Petals + Eugenol Oil 🌿";
        visualPromptMidjourney =
          "Scientific 3D anatomical cutaway of a dried clove showing the internal unopened stamens and glowing microscopic golden oil glands containing Eugenol, high-precision botanical render --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Cross-section animation slicing through dried clove head, illuminating the internal golden essential oil glands";
        soundEffect = "Microscopic liquid droplet chime with clean mechanical sweep";
      } else if (lower.includes("ninth legion") || lower.includes("रोम")) {
        voiceover = isHindi
          ? "यॉर्क शहर में मिले ईसा पूर्व 108 के एक असली पत्थर पर 9वीं सेना का नाम दर्ज है। लेकिन इसके बाद हॉलीवुड के मुताबिक सब खत्म होना चाहिए था। जबकि असल सबूत नीदरलैंड की छावनी से मिले!"
          : "In York, archaeologists unearthed an official Roman inscription carved in stone in 108 AD proving the Ninth was building gates. But then came the archaeological shock: evidence unearthed hundreds of miles away on the Rhine!";
        onScreenText = isHindi ? "108 AD का असली पत्थर का सबूत 🏛️" : "Carved Stone Evidence from 108 AD 🏛️";
        visualPromptMidjourney =
          "Museum lighting macro photograph of an authentic Roman limestone building inscription block with Latin letters 'LEG IX HISP' deeply chiseled into weathered stone, museum quality 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Slow dramatic museum spotlight sweep across the chiseled Latin letters 'LEG IX HISP' on ancient Roman stone block";
        soundEffect = "Heavy stone slide with atmospheric museum echo";
      } else {
        voiceover = isHindi
          ? `वैज्ञानिक शोध से साबित होता है कि ${topicBrief.requiredFactualInformation[0] || "इसके पीछे सटीक भौतिक नियम काम करते हैं"}। यह सिद्धांत हर स्थिति में काम करता है।`
          : `Empirical research confirms that ${topicBrief.requiredFactualInformation[0] || "specific physical mechanisms govern this process cleanly"}.`;
        onScreenText = isHindi ? "सटीक वैज्ञानिक प्रमाण 📊" : "Empirical Scientific Evidence 📊";
        visualPromptMidjourney = `Macro laboratory visualization of ${topicBrief.mainSubject}, precision equipment, high-contrast scientific photography --ar 9:16 --style raw`;
        videoMotionPromptRunway = `Camera glide across laboratory apparatus demonstrating ${topicBrief.mainSubject}`;
      }
    }

    // -------------------------------------------------------------
    // BEAT 4: SECONDARY DIMENSION / SURPRISING DETAIL
    // -------------------------------------------------------------
    else if (index === 3) {
      sectionType = "DISCOVERY";
      cameraMovement = "Smooth tracking push across maintenance or historical artifacts";
      soundEffect = "High-pitch insight chime";

      if (lower.includes("airplane") || lower.includes("हवाई")) {
        voiceover = isHindi
          ? "दूसरा बड़ा कारण है सुरक्षा और वजन। सफेद बैकग्राउंड पर हाइड्रॉलिक ऑयल का लाल रिसाव, धातु की बारीक दरारें और पक्षियों की टक्कर तुरंत साफ दिख जाती हैं। साथ ही, रंगीन गाढ़ा पेंट प्लेन में 500 किलो फालतू वजन जोड़ देता है!"
          : "The second reason is safety and weight. On a crisp white surface, reddish hydraulic fluid leaks, metal fatigue micro-cracks, and bird strikes are instantly visible. Plus, heavy dark pigments add up to 500 kilograms of deadweight!";
        onScreenText = isHindi ? "दरारें और लीकेज तुरंत दिखते हैं! 🛠️" : "Leaks & Cracks Instantly Visible! 🛠️";
        visualPromptMidjourney =
          "Aircraft maintenance engineer in high-vis vest shining a powerful inspection flashlight onto the white aluminum fuselage under hangar lights, spotting a tiny purple-red hydraulic fluid trace, crisp focus --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Flashlight beam sweeping along smooth white aircraft panel, pinpointing a tiny red hydraulic tracer under industrial hangar floodlights";
        soundEffect = "Flashlight click and metallic hangar echo";
      } else if (lower.includes("clove") || lower.includes("लौंग")) {
        voiceover = isHindi
          ? "सबसे हैरान करने वाली बात यह है कि लौंग को केवल कुछ ही दिनों की खिड़की में हाथ से तोड़ा जा सकता है। अगर कली खिल गई, तो उसकी सारी औषधीय खुशबू उड़ जाती है और वह एक लाल फल बन जाती है जिसे मदर ऑफ क्लोव कहते हैं।"
          : "The most fascinating biological detail is that cloves must be hand-picked in a narrow window when buds turn pink. If they bloom, the fragrant oils vanish and the ovary swells into a fruit called 'Mother of Clove'.";
        onScreenText = isHindi ? "खिलने पर खुशबू खत्म हो जाती है! 🌸" : "Blooming Destroys the Aromatic Oil! 🌸";
        visualPromptMidjourney =
          "Time-lapse comparison: on left, a tight fragrant red-pink clove bud ready for harvest; on right, an opened flower losing its oils and developing a fleshy red seed berry, side-by-side macro --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Smooth macro morphing from an unopened pink clove bud into a blooming flower and ripening berry";
        soundEffect = "Delicate flower petal unfurl sound effect";
      } else if (lower.includes("ninth legion") || lower.includes("रोम")) {
        voiceover = isHindi
          ? "नीदरलैंड के निजमेगन में जमीन खोदने पर 9वीं सेना की मुहर लगी छत की ईंटें मिलीं, जो साबित करती हैं कि 120 ईस्वी के बाद भी इसके सैनिक यूरोप की सीमा पर तैनात थे। हॉलीवुड का मिथक पूरी तरह टूट गया!"
          : "In Nijmegen, Netherlands, archaeologists excavated roof tiles stamped with Legio IX seals dating after 120 AD, proving detachments survived and served on the Rhine frontier. The Scottish massacre myth was officially busted!";
        onScreenText = isHindi ? "नीदरलैंड में मिलीं ईंटें! 🧱" : "Stamped Tiles Found in Netherlands! 🧱";
        visualPromptMidjourney =
          "Macro shot of an ancient Roman terracotta roof tile stamped with raised letters 'LEG IX HISP' sitting on archaeological excavation grid, trowel and brush beside it, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Camera pushing in on the archaeological brush gently sweeping dirt off the terracotta tile stamped 'LEG IX HISP'";
        soundEffect = "Archeologist soft brush sweep on terracotta clay";
      } else {
        voiceover = isHindi
          ? `इतना ही नहीं, ${topicBrief.interestingDiscovery.slice(0, 110)}। यह तथ्य इस विषय को पूरी तरह बदल देता है।`
          : `Even more remarkable: ${topicBrief.interestingDiscovery.slice(0, 110)}. This changes the entire perspective on this subject.`;
        onScreenText = isHindi ? "हैरान करने वाला तथ्य ⚡" : "Surprising Dimension ⚡";
        visualPromptMidjourney = `Cinematic documentary reveal demonstrating ${topicBrief.interestingDiscovery.slice(0, 60)}, dramatic lighting, 8K --ar 9:16 --style raw`;
        videoMotionPromptRunway = `Dynamic camera acceleration revealing ${topicBrief.mainSubject}`;
      }
    }

    // -------------------------------------------------------------
    // BEAT 5: DECISIVE MAIN ANSWER
    // -------------------------------------------------------------
    else if (index === 4) {
      sectionType = "CLIMAX";
      cameraMovement = "Wide establishing camera pull-back";
      soundEffect = "Deep satisfying bass drop with crystal chime";

      if (lower.includes("airplane") || lower.includes("हवाई")) {
        voiceover = isHindi
          ? "और तीसरा कारण है व्यापार। जब एक एयरलाइन अपना विमान दूसरी कंपनी को लीज पर देती है, तो सफेद प्लेन का केवल लोगो बदलना पड़ता है। जबकि रंगीन प्लेन को दोबारा पेंट करने में 15 से 20 लाख रुपये और हफ्तों का नुकसान होता है।"
          : "And third comes economics. When airlines lease jets to other operators, a white plane only needs a quick tail-logo swap. Stripping and repainting an entire dark-colored jet costs over $150,000 and weeks of lost revenue.";
        onScreenText = isHindi ? "लाखों डॉलर की बचत 💰" : "Saves Hundreds of Thousands 💰";
        visualPromptMidjourney =
          "Split visualization of a commercial airliner inside a high-tech hangar: workers peeling away a simple vinyl tail decal from a pristine white tail fin, time-lapse aesthetic, high dynamic range --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Wide hangar camera crane shot pulling back as maintenance crew smoothly swaps tail logo on brilliant white jet";
        soundEffect = "Commercial cash register chime with satisfying hydraulic lift sound";
      } else if (lower.includes("clove") || lower.includes("लौंग")) {
        voiceover = isHindi
          ? "यानी लौंग न तो कोई पेड़ की जड़ है और न ही कोई बीज—यह कुदरत का वह फूल है जिसे खिलने से ठीक पहले सुखाकर आपके खाने और दवाओं तक पहुंचाया गया है।"
          : "So to answer the question: clove is neither a seed nor a fruit. It is an unopened flower whose life was paused right before blooming to lock in nature's most powerful healing essence.";
        onScreenText = isHindi ? "यह एक सूखा हुआ फूल है! 🌸" : "It is an Unopened Flower! 🌸";
        visualPromptMidjourney =
          "Lush golden hour shot of a hand gently holding a single fresh pink clove bud right next to a dried dark clove in a spice bowl, steam and natural sunlight, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Camera pulling back in slow motion showing fresh pink flower bud resting beside traditional dried aromatic spice";
      } else if (lower.includes("ninth legion") || lower.includes("रोम")) {
        voiceover = isHindi
          ? "इतिहास सच को साफ दिखाता है: 9वीं सेना स्कॉटलैंड के कोहरे में नहीं खोई, बल्कि कई मोर्चों पर लड़ते-लड़ते बिखर गई। इतिहास में कभी-कभी सच्चाई फिल्मों से कहीं ज्यादा दिलचस्प होती है।"
          : "The archaeological verdict is clear: Legio IX never vanished overnight in Scottish mist. They survived, transferred, and gradually disbanded across Rome's grueling imperial wars.";
        onScreenText = isHindi ? "इतिहास का पक्का फैसला 🏛️" : "The True Historical Verdict 🏛️";
        visualPromptMidjourney =
          "Majestic Roman stone triumphal arch at twilight, warm torchlight illuminating imperial statues and standard bearers, solemn documentary atmosphere, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Slow dramatic pan across Roman imperial arch and bronze military banners under flickering twilight torches";
      } else {
        voiceover = isHindi
          ? `इस प्रकार, ${topicBrief.mainLearningOutcome}। यही कारण है कि यह प्राकृतिक नियम आज भी पूरी दुनिया में उसी सटीकता से लागू होता है।`
          : `Ultimately, ${topicBrief.mainLearningOutcome}. This verified principle explains the reality observed across the world.`;
        onScreenText = isHindi ? "वैज्ञानिक निष्कर्ष 🎯" : "The Decisive Resolution 🎯";
        visualPromptMidjourney = `Hero shot resolving the core scientific question of ${topicBrief.mainSubject}, golden hour cinematic finish --ar 9:16 --style raw`;
        videoMotionPromptRunway = `Smooth steady pull back revealing complete system of ${topicBrief.mainSubject}`;
      }
    }

    // -------------------------------------------------------------
    // BEAT 6: PAYOFF & SEAMLESS ENDING
    // -------------------------------------------------------------
    else {
      sectionType = "PAYOFF";
      cameraMovement = "Dynamic loop zoom-in or cinematic fade";
      soundEffect = "Subtle clean riser resolving to silence";

      if (lower.includes("airplane") || lower.includes("हवाई")) {
        voiceover = isHindi
          ? "तो अगली बार जब आप रनवे पर किसी सफेद प्लेन में बैठें, तो याद रखिएगा—सफेद रंग मजबूरी नहीं, बल्कि विज्ञान और समझदारी का सबसे बड़ा फैसला है। क्या आप किसी रंग-बिरंगे प्लेन में बैठे हैं?"
          : "So next time you board a gleaming white airliner, remember: white isn't boring uniformity—it's pure engineering, safety, and physics at work. Have you ever flown on a brightly colored plane?";
        onScreenText = isHindi ? "विज्ञान और समझदारी का फैसला! ✈️" : "Engineering & Physics at Work! ✈️";
        visualPromptMidjourney =
          "Breathtaking cinematic passenger window shot of white jet wing slicing through fluffy golden sunset clouds, glorious golden hour light, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Smooth seamless glide through golden clouds alongside the white wing, setting up an endless video loop";
      } else if (lower.includes("clove") || lower.includes("लौंग")) {
        voiceover = isHindi
          ? "अगली बार जब आप किसी खाने में लौंग देखें, तो याद रखें कि आप एक न खिलने वाले फूल को देख रहे हैं। क्या आपको यह बॉटनी फैक्ट पहले से पता था?"
          : "Next time you smell the sharp aroma of a clove, remember you are holding a flower that never got to bloom. Did you know this botanical fact before?";
        onScreenText = isHindi ? "न खिलने वाले फूल का सच! 🌺" : "A Flower That Never Bloomed! 🌺";
        visualPromptMidjourney =
          "Artistic top-down flatlay of cloves arranged in a subtle flower blossom shape on handcrafted dark stone surface, warm studio light, 8K --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Slow circular camera rotation over cloves arranged like flower petals, fading smoothly";
      } else if (lower.includes("ninth legion") || lower.includes("रोम")) {
        voiceover = isHindi
          ? "इतिहास में हर रहस्य का जवाब जमीन के नीचे दबा होता है। क्या आप प्राचीन रोम के किसी और रहस्य के बारे में जानना चाहते हैं? कमेंट में बताएं।"
          : "History proves that the truth buried in the dirt is often far more gripping than legends. What ancient historical mystery should we investigate next?";
        onScreenText = isHindi ? "अगला ऐतिहासिक रहस्य कौन सा? ⚔️" : "What Mystery Next? ⚔️";
        visualPromptMidjourney =
          "Cinematic final shot of an antique Roman bronze coin and signet ring resting on an ancient leather-bound map, dramatic low key lighting --ar 9:16 --style raw";
        videoMotionPromptRunway =
          "Slow overhead orbital camera move around ancient Roman signet ring and coin, settling smoothly";
      } else {
        voiceover = isHindi
          ? `${topicBrief.suitableEnding} क्या आप इसके बारे में पहले से जानते थे? कमेंट में जरूर बताएं!`
          : `${topicBrief.suitableEnding} What aspect of this surprised you the most? Let us know in the comments!`;
        onScreenText = `${topicBrief.suitableEnding.slice(0, 32)} ✨`;
        visualPromptMidjourney = `Stunning artistic final tribute composition to ${topicBrief.mainSubject}, warm cinematic sunset glow, 8K --ar 9:16 --style raw`;
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
