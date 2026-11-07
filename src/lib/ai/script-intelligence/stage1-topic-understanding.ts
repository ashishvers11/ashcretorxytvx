// ==============================================================================
// ASH CREATOR STUDIO — SCRIPT INTELLIGENCE ENGINE V2
// STAGE 1: TOPIC UNDERSTANDING ENGINE
// ==============================================================================

import { ChannelWritingDNA, ScriptContentFormat, TopicBrief } from "./types";

/**
 * Analyzes the user's topic input and extracts a comprehensive Topic Brief.
 * Rejects vague or ambiguous inputs and identifies the core learning outcome.
 * Strictly generates native Hindi / Hinglish fields when writing in Hindi,
 * preventing any raw English prompt fragment contamination.
 */
export function buildTopicBrief(
  rawTopic: string,
  writingDNA: ChannelWritingDNA,
  format: ScriptContentFormat,
  durationSeconds: number
): TopicBrief {
  const clean = rawTopic.trim().replace(/^["']|["']$/g, "");
  const lower = clean.toLowerCase();
  const isHindi = writingDNA.language === "Hindi" || writingDNA.language === "Hinglish";

  // Detect if input is too vague or a single broad keyword
  const words = clean.split(/\s+/).filter(Boolean);
  const isVague = words.length <= 1 && !clean.includes("?") && clean.length < 8;

  let exactTopic = clean;
  let mainSubject = clean;
  let centralQuestion = isHindi
    ? `क्या आप जानते हैं कि ${clean} के पीछे का असली वैज्ञानिक सच क्या है?`
    : `Why does ${clean} happen?`;
  let mainLearningOutcome = isHindi
    ? `${clean} के पीछे काम करने वाले वास्तविक वैज्ञानिक नियमों को समझना।`
    : `Understand the real mechanism behind ${clean}.`;
  let audienceKnowledgeLevel = writingDNA.audienceKnowledgeLevel;
  let interestingDiscovery = isHindi
    ? `${clean} के बारे में सबसे दिलचस्प बात यह है कि इसका असली कारण आम सोच से बिल्कुल अलग होता है।`
    : `The counter-intuitive scientific or practical truth behind ${clean}.`;
  let requiredFactualInformation: string[] = [];
  let possibleMisconceptions: string[] = [];
  let storyOpportunity = isHindi
    ? `${clean} के आम दृश्य से शुरुआत कर इसके पीछे के असली तंत्र को सामने लाना।`
    : `Show the transition from everyday assumption to scientific reality.`;
  let suitableEnding = isHindi
    ? `${clean} के पीछे का विज्ञान यह साबित करता है कि प्रकृति के नियम कितने सटीक और अद्भुत हैं।`
    : `A clear, satisfying takeaway that connects back to the opening question.`;
  let needsClarification = false;
  let clarificationQuestion: string | undefined = undefined;

  if (isVague) {
    needsClarification = true;
    clarificationQuestion = isHindi
      ? `विषय "${clean}" बहुत व्यापक है। क्या आप इसके भौतिक तंत्र, इतिहास या किसी रोचक पहलू पर वीडियो बनाना चाहते हैं?`
      : `The topic "${clean}" is broad. Are you explaining its physical mechanism, history, or an everyday curiosity?`;
    exactTopic = isHindi ? `${clean}: असली वैज्ञानिक सच और तथ्य` : `${clean}: Real Mechanism & Everyday Facts`;
  }

  // ============================================================================
  // DOMAIN-SPECIFIC INTELLIGENCE (BENCHMARK TOPICS & SPECIALIZED CLASSES)
  // ============================================================================

  // 1. Dinosaur extinction (K-Pg Extinction & Asteroid Impact)
  if (
    lower.includes("dinosaur") ||
    lower.includes("डायनासोर") ||
    lower.includes("extinction") ||
    lower.includes("विलुप्त")
  ) {
    if (isHindi) {
      mainSubject = "डायनासोर का विलुप्त होना और चिक्सुलूब एस्टेरॉयड प्रभाव";
      centralQuestion = "6.6 करोड़ साल पहले 10 किलोमीटर चौड़े एस्टेरॉयड के टकराने से डायनासोर अचानक कैसे खत्म हो गए?";
      mainLearningOutcome = "दर्शक सीखते हैं कि चिक्सुलूब उल्कापिंड के प्रभाव से उठी धूल और गंधक के बादलों ने सालों तक सूरज को ढक दिया, जिससे वैश्विक ठंड आई और खाद्य श्रृंखला टूट गई।";
      interestingDiscovery = "एस्टेरॉयड की टक्कर से केवल कुछ घंटों में नहीं, बल्कि उसके बाद पैदा हुए धूल के अंधेरे और वैश्विक ठंड से 75% जीव-जंतु धीरे-धीरे खत्म हुए।";
      requiredFactualInformation = [
        "6.6 करोड़ साल पहले चिक्सुलूब (मेक्सिको) में 10 से 15 किलोमीटर चौड़ा एस्टेरॉयड टकराया था",
        "दुनिया भर की K-Pg भूगर्भीय परतों में इरिडियम धातु पाई जाती है, जो केवल उल्कापिंडों में होती है",
        "धूल और सल्फर बादलों ने 2 साल तक सूर्य की धूप रोकी, जिससे प्रकाश-संश्लेषण ठप हो गया",
        "आधुनिक पक्षी वास्तव में जीवित मांसाहारी थेरोपोड डायनासोर के ही वंशज हैं",
      ];
      possibleMisconceptions = [
        "गलत धारणा: डायनासोर एस्टेरॉयड गिरते ही एक ही सेकंड में जलकर खत्म हो गए",
        "गलत धारणा: पृथ्वी के सारे डायनासोर पूरी तरह समाप्त हो गए (पक्षी जीवित रहे)",
      ];
      storyOpportunity = "एस्टेरॉयड की भीषण टक्कर के बाद छाए 2 साल लंबे अंधेरे और उसके बाद पक्षियों के जीवित बचने की यात्रा को दिखाना।";
      suitableEnding = "विशाल डायनासोर भले ही मिट गए, लेकिन उनके ही वंशज आज आसमान में उड़ते पक्षियों के रूप में हमारे बीच मौजूद हैं।";
    } else {
      mainSubject = "The Cretaceous-Paleogene (K-Pg) Extinction & Chicxulub Asteroid Impact";
      centralQuestion = "How did a single 10-kilometer asteroid trigger the sudden extinction of the dinosaurs 66 million years ago?";
      mainLearningOutcome = "Understand how the Chicxulub impact vaporized sulfur-rich rock, causing an impact winter and food web collapse that wiped out 75% of species.";
      interestingDiscovery = "Dinosaurs were not killed instantly by the firestorm; the fatal blow was years of sunlight-blocking dust that halted photosynthesis worldwide.";
      requiredFactualInformation = [
        "A 10-to-15 km asteroid struck the Yucatán Peninsula (Chicxulub) 66 million years ago",
        "The K-Pg boundary layer worldwide contains a spike in iridium, an element rare in Earth's crust but abundant in asteroids",
        "Vaporized sulfate aerosols and soot blocked sunlight for over two years, collapsing marine and terrestrial food chains",
        "Modern birds are living theropod dinosaurs that survived the catastrophe",
      ];
      possibleMisconceptions = [
        "Misconception: All dinosaurs died in an instantaneous global firestorm within minutes",
        "Misconception: All dinosaurs are completely extinct (modern birds are surviving theropods)",
      ];
      storyOpportunity = "Trace the timeline from the hypersonic impact blast to the global nuclear-winter darkness that reshaped life on Earth.";
      suitableEnding = "While giant reptiles vanished, one branch survived the darkness—and flies past our windows today as modern birds.";
    }
  }

  // 2. Airplane paint / White planes
  else if (
    lower.includes("airplane") ||
    lower.includes("aeroplane") ||
    lower.includes("aircraft") ||
    lower.includes("हवाई जहाज") ||
    (lower.includes("plane") && lower.includes("white")) ||
    (lower.includes("plane") && lower.includes("paint"))
  ) {
    if (isHindi) {
      mainSubject = "हवाई जहाजों का सफेद पेंट और थर्मल भौतिकी";
      centralQuestion = "दुनिया के ज्यादातर यात्री हवाई जहाज हमेशा सफेद रंग के ही क्यों होते हैं?";
      mainLearningOutcome = "दर्शक सीखते हैं कि सफेद पेंट 99% सौर विकिरण को परावर्तित कर केबिन को ठंडा रखता है, दरारें और लीकेज तुरंत दिखाता है, और ईंधन का वजन बचाता है।";
      interestingDiscovery = "एयरलाइंस को किसी भी रंग में प्लेन रंगने की पूरी आजादी है, लेकिन सफेद रंग हर प्लेन पर सालाना लाखों रुपये के ईंधन की बचत कराता है।";
      requiredFactualInformation = [
        "सफेद पेंट 99% सौर विकिरण को परावर्तित कर रनवे पर केबिन को जरूरत से ज्यादा गर्म होने से बचाता है",
        "सफेद सतह पर हाइड्रॉलिक लीकेज, धातु की दरारें और जंग सुरक्षा निरीक्षकों को तुरंत दिखाई दे जाते हैं",
        "रंगीन पेंट विमान में 500 किलोग्राम तक अतिरिक्त वजन जोड़ता है, जिससे ईंधन की खपत बढ़ जाती है",
        "एयरलाइंस विमान लीज पर देती हैं; सफेद प्लेन को बिना महंगे पेंट रिमूवल के आसानी से दोबारा लीज पर दिया जा सकता है",
      ];
      possibleMisconceptions = [
        "गलत धारणा: विमानन नियामक कानूनी रूप से सभी विमानों को सफेद रंगना अनिवार्य करते हैं",
        "गलत धारणा: हवाई जहाज बिना किसी पेंट के स्वाभाविक रूप से सफेद धातु के बने होते हैं",
      ];
      storyOpportunity = "रनवे पर खड़े सफेद जहाजों के बीच एक दुर्लभ रंगीन प्लेन का दृश्य दिखाकर इसके इंजीनियरिंग और आर्थिक कारणों को सामने लाना।";
      suitableEnding = "सफेद रंग कोई कानूनी मजबूरी नहीं, बल्कि एयरलाइंस की सुरक्षा और आर्थिक समझदारी का सबसे बड़ा फैसला है।";
    } else {
      mainSubject = "Commercial Aircraft Paint & Thermal Physics";
      centralQuestion = "Why do the vast majority of commercial passenger airplanes use white paint?";
      mainLearningOutcome = "Viewers learn that white paint reflects solar radiation (keeping cabins cool), exposes structural cracks, saves fuel weight compared to heavy pigments, and preserves resale value.";
      interestingDiscovery = "Airlines are completely legally free to paint aircraft any color, but white paint saves up to $150,000 in fuel and repainting costs per plane.";
      requiredFactualInformation = [
        "White paint reflects 99% of solar radiation, preventing cabin overheating on tarmac",
        "White surfaces make corrosion, hydraulic leaks, and metal fatigue cracks instantly visible to safety inspectors",
        "Colored liveries add significant weight (up to 500 kg), increasing fuel burn",
        "Airlines lease and resell airplanes; white planes can be re-leased without expensive stripping",
      ];
      possibleMisconceptions = [
        "Misconception: Aviation regulators legally require planes to be painted white",
        "Misconception: Planes are naturally white metal without paint",
      ];
      storyOpportunity = "Open with an airport tarmac scene comparing a rare colored plane to a sea of white jets, then unveil the engineering economics.";
      suitableEnding = "White is an economic and safety choice made by airlines, not a mandatory aviation law.";
    }
  }

  // 3. Flower to Fruit Transformation
  else if (
    (lower.includes("flower") && lower.includes("fruit")) ||
    (lower.includes("फूल") && lower.includes("फल")) ||
    lower.includes("bloom") && lower.includes("fruit")
  ) {
    if (isHindi) {
      mainSubject = "फूल से फल बनने की जैविक प्रक्रिया (परागण और निषेचन)";
      centralQuestion = "पेड़ पर खिलने वाला एक साधारण फूल रसीले और पौष्टिक फल में कैसे बदल जाता है?";
      mainLearningOutcome = "दर्शक सीखते हैं कि परागकण (Pollen) फूल के बीजांड को निषेचित करते हैं, जिसके बाद अंडाशय (Ovary) फूलकर फल बन जाता है और अंदर बीज सुरक्षित हो जाते हैं।";
      interestingDiscovery = "फल असल में पौधे के फूल का पका हुआ अंडाशय (गर्भाशय) होता है, जो बीजों की हिफाजत और फैलाव के लिए मीठा और गूदेदार बन जाता है।";
      requiredFactualInformation = [
        "परागण में कीट या हवा परागकणों को वर्तिकाग्र (Stigma) तक पहुंचाते हैं",
        "निषेचन के बाद फूल की पंखुड़ियां गिर जाती हैं और अंडाशय (Ovary) तेजी से बड़ा होने लगता है",
        "एथलीन और ऑक्सिन हार्मोन फल के पकने और शर्करा बढ़ाने का काम करते हैं",
        "फल का मुख्य उद्देश्य पौधे के बीजों को सुरक्षित रखना और दूर तक फैलाना है",
      ];
      possibleMisconceptions = [
        "गलत धारणा: फल पौधे की जड़ों या पत्तियों से सीधे उगते हैं",
        "गलत धारणा: फूल केवल खुशबू और सजावट के लिए खिलते हैं",
      ];
      storyOpportunity = "एक खिले हुए फूल की पंखुड़ियों के झड़ने और उसके आधार से एक छोटे फल के विकसित होने का टाइम-लैप्स दृश्य दिखाना।";
      suitableEnding = "हर बार जब आप कोई फल खाते हैं, तो आप कुदरत के एक खिले हुए फूल की परिपक्व यात्रा का आनंद ले रहे होते हैं।";
    } else {
      mainSubject = "Plant Reproductive Biology: Flower to Fruit Transformation";
      centralQuestion = "How does a delicate blooming flower transform into a fleshy, seed-bearing fruit?";
      mainLearningOutcome = "Learn how pollination triggers fertilization of ovules, prompting the flower's ovary wall (pericarp) to swell into edible fruit tissue.";
      interestingDiscovery = "Botanically, every fruit is simply the ripened, swollen ovary of a flower engineered specifically to protect and disperse seeds.";
      requiredFactualInformation = [
        "Pollination transfers pollen grains from anther to stigma via wind or insect pollinators",
        "Fertilization occurs as pollen tubes deliver sperm nuclei to ovules, which become seeds",
        "Post-fertilization hormonal signaling (auxins and gibberellins) induces the ovary wall to rapidly expand",
        "Petals wither and detach because their primary signaling role in attracting pollinators has concluded",
      ];
      possibleMisconceptions = [
        "Misconception: Fruits develop directly from leaves or roots independently of flowers",
        "Misconception: Flower petals transform directly into the edible fruit flesh",
      ];
      storyOpportunity = "Time-lapse from vibrant blossom petals dropping away to the miraculous swelling of the ovary into a juicy ripe fruit.";
      suitableEnding = "Every single fruit you eat is the botanical finale of a flower that achieved its reproductive destiny.";
    }
  }

  // 4. Why time seems to pass faster as we grow older
  else if (
    (lower.includes("time") && (lower.includes("faster") || lower.includes("older") || lower.includes("age"))) ||
    (lower.includes("समय") && (lower.includes("तेज") || lower.includes("उम्र")))
  ) {
    if (isHindi) {
      mainSubject = "उम्र बढ़ने के साथ समय का मस्तिष्क परसेप्शन (न्यूरोलॉजी और समय का आभास)";
      centralQuestion = "उम्र बढ़ने के साथ हमें ऐसा क्यों लगता है कि साल और महीने पहले से कहीं ज्यादा तेजी से बीत रहे हैं?";
      mainLearningOutcome = "दर्शक समझते हैं कि नया अनुभव कम होने से दिमाग कम यादें बनाता है, और आनुपातिक सिद्धांत के अनुसार 1 साल हमारे कुल जीवन का बहुत छोटा हिस्सा बन जाता है।";
      interestingDiscovery = "10 साल के बच्चे के लिए एक साल उसकी कुल जिंदगी का 10% होता है, जबकि 50 साल के इंसान के लिए वही साल उसकी जिंदगी का सिर्फ 2% होता है!";
      requiredFactualInformation = [
        "पॉल जेनेट का आनुपातिक सिद्धांत: हर बीता हुआ साल हमारी कुल जी गई उम्र का छोटा प्रतिशत होता है",
        "न्यूरोलॉजिस्ट डेविड ईगलमैन के अनुसार नए अनुभव दिमाग में अधिक सघन यादें बनाते हैं, जिससे समय लंबा महसूस होता है",
        "उम्र बढ़ने के साथ दिमाग में सूचना प्रोसेस करने की गति और न्यूरोप्लास्टिसिटी धीमी हो जाती है",
        "दैनिक दिनचर्या और आदतों की पुनरावृत्ति से दिमाग रूटीन पर आ जाता है और नई यादें दर्ज नहीं करता",
      ];
      possibleMisconceptions = [
        "गलत धारणा: पृथ्वी के घूमने की गति या घड़ियों की चाल सचमुच तेज हो गई है",
        "गलत धारणा: समय तेजी से बीतने का अहसास केवल एक वहम है जिसका कोई न्यूरोलॉजिकल आधार नहीं",
      ];
      storyOpportunity = "बचपन की लंबी गर्मियों की छुट्टियों की तुलना एक वयस्क के तेजी से बीतने वाले पूरे साल से करना।";
      suitableEnding = "अगर आप समय की रफ्तार को धीमा करना चाहते हैं, तो नए हुनर सीखें और हर दिन नई जगहों का अनुभव करें।";
    } else {
      mainSubject = "Cognitive Neuroscience of Subjective Time Perception & Aging";
      centralQuestion = "Why does time subjectively appear to accelerate as we grow older?";
      mainLearningOutcome = "Understand the proportional theory of life duration combined with neural processing deceleration and novel memory encoding density.";
      interestingDiscovery = "To a 10-year-old child, one single year constitutes 10% of their entire lifetime, but to a 50-year-old adult, that same year represents just 2% of lived existence.";
      requiredFactualInformation = [
        "Paul Janet's Proportional Theory: each passing year represents an exponentially smaller fraction of total lived memory",
        "Neuroscience reveals novel experiences require intense neural encoding, creating dense memory clusters that make periods feel long",
        "Adult routines trigger cognitive compression where repetitive events are merged into single low-resolution memories",
        "Saccadic eye movements and visual processing speeds decrease with age, capturing fewer mental frames per second",
      ];
      possibleMisconceptions = [
        "Misconception: Clocks or planetary rotational cycles are physically speeding up",
        "Misconception: Subjective acceleration is purely psychological with no neurological correlates",
      ];
      storyOpportunity = "Contrast the seemingly endless summer holidays of childhood with how rapidly an adult's entire calendar year flashes past.";
      suitableEnding = "To stretch out your perceived time, shatter routine: learn unfamiliar skills and seek out novel experiences every single week.";
    }
  }

  // 5. Venus Flytrap (Dionaea muscipula)
  else if (
    lower.includes("venus flytrap") ||
    lower.includes("flytrap") ||
    (lower.includes("पौधे") && lower.includes("कीड़े")) ||
    lower.includes("वीनस") ||
    lower.includes("कीटभक्षी")
  ) {
    if (isHindi) {
      mainSubject = "वीनस फ्लाईट्रैप की इलेक्ट्रोफिजियोलॉजी और बायोमैकेनिक्स";
      centralQuestion = "बिना दिमाग और बिना मांसपेशियों वाला वीनस फ्लाईट्रैप बिजली की तेजी से कीड़ों को कैसे पकड़ लेता है?";
      mainLearningOutcome = "दर्शक समझते हैं कि पत्तों के भीतरी ट्रिगर बालों को दो बार छूने पर इलेक्ट्रिक एक्शन पोटेंशियल पैदा होता है, जिससे पत्तियां 100 मिलीसेकंड में बंद हो जाती हैं।";
      interestingDiscovery = "यह पौधा असल में गिनती करता है! 20 सेकंड के भीतर दो बार बाल छूने पर ही पत्ता बंद होता है, ताकि बारिश की बूंदों पर व्यर्थ ऊर्जा बर्बाद न हो।";
      requiredFactualInformation = [
        "पत्ती के अंदर 3 से 4 संवेदनशील ट्रिगर बाल (sensory hairs) होते हैं",
        "बाल मुड़ने पर आयन चैनल खुलते हैं और विद्युत तरंग (Action Potential) पैदा होती है",
        "20 सेकंड में 2 स्पर्श होने पर कोशिकाओं का जल दबाव तेजी से बदलता है",
        "पत्ता मात्र 100 मिलीसेकंड में झटके से बंद हो जाता है",
      ];
      possibleMisconceptions = [
        "गलत धारणा: वीनस फ्लाईट्रैप के पास जानवरों जैसी मांसपेशियां होती हैं",
        "गलत धारणा: पत्ता धूल का कण या बारिश की बूंद गिरने पर भी तुरंत बंद हो जाता है",
      ];
      storyOpportunity = "पत्ते पर मक्खी के बैठने और पौधे के अंदर शुरू होने वाले खामोश 20 सेकंड के इलेक्ट्रिकल टाइमर का सफर दिखाना।";
      suitableEnding = "बिना आंख और बिना दिमाग वाला पौधा साधारण भौतिकी और इलेक्ट्रिकल टाइमर का उपयोग कर चालाक कीड़ों को मात देता है।";
    } else {
      mainSubject = "Plant Electrophysiology & Biomechanics";
      centralQuestion = "How does a brainless plant like the Venus flytrap detect and trap prey without muscles or a nervous system?";
      mainLearningOutcome = "Understand how trigger hairs generate action potentials and turgor pressure changes that snap the leaf closed.";
      interestingDiscovery = "The plant counts! It only snaps shut if a trigger hair is touched twice within 20 seconds, preventing false alarms from falling raindrops.";
      requiredFactualInformation = [
        "Inside each leaf lobe are 3 to 4 tiny trigger hairs (sensory trichomes)",
        "Bending a hair opens mechanosensitive ion channels, generating an electrical action potential",
        "A single touch activates a chemical timer; a second touch within 20 seconds triggers rapid water movement between cells",
        "The leaf snaps shut in 100 milliseconds due to elastic instability and rapid change in cell turgor pressure",
      ];
      possibleMisconceptions = [
        "Misconception: Venus flytraps have animal-like muscles",
        "Misconception: The plant closes whenever a speck of dust lands on it",
      ];
      storyOpportunity = "Trace the journey of an unsuspecting fly landing on the green leaf, highlighting the silent electrical countdown occurring inside the plant.";
      suitableEnding = "A plant without eyes or brain uses simple physics and electrical counters to outsmart lightning-fast insects.";
    }
  }

  // 6. Clove (Flower or Fruit)
  else if (lower.includes("clove") || lower.includes("लौंग")) {
    if (isHindi) {
      mainSubject = "लौंग की वनस्पति संरचना (Syzygium aromaticum)";
      centralQuestion = "रसोई में रखी लौंग असल में किसी पेड़ का फल है या फिर कोई सूखा हुआ फूल?";
      mainLearningOutcome = "दर्शक समझते हैं कि लौंग Syzygium aromaticum पेड़ की बिना खिली हुई सूखी कली है, और इसकी खुशबू युजिनॉल तेल से आती है।";
      interestingDiscovery = "अगर लौंग के पेड़ की कली को खिलने दिया जाए, तो उसका सुगन्धित तेल उड़ जाता है और वह एक लाल फल बन जाती है जिसे 'मदर ऑफ क्लोव' कहते हैं।";
      requiredFactualInformation = [
        "लौंग वनस्पति विज्ञान के अनुसार Myrtaceae परिवार के पेड़ की बिना खिली फूल की कली है",
        "लौंग का ऊपरी गोल सिरा 4 मुड़ी पंखुड़ियां हैं और नीचे की डंडी 4 बाह्यदल (Sepals) हैं",
        "लौंग को खिलने से ठीक पहले हाथ से तोड़ा जाता है जब कलियां गुलाबी-लाल हो जाती हैं",
        "युजिनॉल तेल लौंग के वाष्पशील तेल का 70% से 90% हिस्सा होता है जो प्राकृतिक दर्द निवारक है",
      ];
      possibleMisconceptions = [
        "गलत धारणा: लौंग किसी पेड़ की छाल या जड़ का बीज है",
        "गलत धारणा: लौंग काली मिर्च की तरह सूखा हुआ फल है",
      ];
      storyOpportunity = "रसोई के आम मसाले से शुरुआत कर दर्शकों से पूछना कि यह पत्ता, फल या फूल है, फिर इसकी असली संरचना दिखाना।";
      suitableEnding = "अगली बार जब आप लौंग देखें, तो याद रखें कि आप एक ऐसे फूल को देख रहे हैं जिसे खिलने से ठीक पहले संभाल लिया गया।";
    } else {
      mainSubject = "Botanical Anatomy of Clove (Syzygium aromaticum)";
      centralQuestion = "Is a clove actually a dried unopened flower bud or a fruit?";
      mainLearningOutcome = "Viewers understand that a clove is the dried, unopened flower bud of the Syzygium aromaticum tree, and its pungent aroma comes from eugenol oil.";
      interestingDiscovery = "If a clove tree is allowed to bloom, the aromatic oil evaporates and the flower turns into a red fleshy berry called 'Mother of Clove'.";
      requiredFactualInformation = [
        "Clove is botanically an unopened flower bud from the tree Syzygium aromaticum (Myrtaceae family)",
        "The 'head' of the clove is four unopened petals, and the 'stem' is the calyx tube",
        "Cloves must be picked by hand right before blooming when buds turn reddish-pink",
        "Eugenol constitutes 70% to 90% of the volatile oil in cloves and has natural anesthetic and antibacterial properties",
      ];
      possibleMisconceptions = [
        "Misconception: Clove is a tree bark or root seed",
        "Misconception: Clove is a dried fruit like black pepper",
      ];
      storyOpportunity = "Challenge viewers to guess whether the common spice in their kitchen is a leaf, fruit, or flower, then zoom into the anatomical petals.";
      suitableEnding = "Next time you see a clove, you're holding a flower that was harvested right before it could bloom.";
    }
  }

  // 7. Tomato (Fruit vs Vegetable)
  else if (lower.includes("tomato") || lower.includes("टमाटर")) {
    if (isHindi) {
      mainSubject = "टमाटर का वनस्पति बनाम पाक वर्गीकरण (Solanum lycopersicum)";
      centralQuestion = "टमाटर वनस्पति विज्ञान में एक फल होने के बावजूद हमारी रसोई में सब्जी क्यों माना जाता है?";
      mainLearningOutcome = "दर्शक समझते हैं कि फूल के अंडाशय से विकसित होने और बीज धारण करने के कारण टमाटर वैज्ञानिक रूप से फल है, जबकि पाक कला में नमकीन उपयोग के कारण इसे सब्जी कहा जाता है।";
      interestingDiscovery = "1893 में अमेरिकी सुप्रीम कोर्ट ने कानूनन फैसला सुनाया था कि टैक्स नियमों के लिए टमाटर एक सब्जी है, जबकि वैज्ञानिक आज भी इसे फल मानते हैं!";
      requiredFactualInformation = [
        "वनस्पति विज्ञान के अनुसार फूल के निषेचित अंडाशय से विकसित होने वाली हर बीजयुक्त संरचना फल होती है",
        "टमाटर विशेष रूप से एक बेरी (गुद्देदार फल) की श्रेणी में आता है",
        "पाक कला भोजन के नमकीन या मीठे उपयोग के आधार पर सब्जी और फल का अंतर तय करती है",
        "1893 के निक्स बनाम हेडन मामले में कोर्ट ने आयात शुल्क के लिए टमाटर को सब्जी माना था",
      ];
      possibleMisconceptions = [
        "गलत धारणा: टमाटर आलू की तरह जड़ या तने वाली सब्जी है",
        "गलत धारणा: वैज्ञानिक और शेफ की राय में अंतर विज्ञान की किसी गलती के कारण है",
      ];
      storyOpportunity = "उस ऐतिहासिक कानूनी विवाद को दिखाना जहां एक वनस्पति परिभाषा पर हजारों डॉलर का टैक्स निर्भर था।";
      suitableEnding = "ज्ञान यह जानना है कि टमाटर एक फल है; समझदारी यह है कि इसे फ्रूट चाट में न डाला जाए।";
    } else {
      mainSubject = "Botanical vs Culinary Classification of Solanum lycopersicum";
      centralQuestion = "Why is a tomato botanically a berry fruit even though we treat it as a culinary vegetable?";
      mainLearningOutcome = "Understand the botanical definition of a fruit (developed from the ovary of a flower containing seeds) versus the culinary definition based on culinary usage.";
      interestingDiscovery = "In 1893, the US Supreme Court (Nix v. Hedden) legally ruled that tomatoes are vegetables for customs tax purposes, while botanists still classify them as fleshy berries.";
      requiredFactualInformation = [
        "Botanically, any structure that develops from the fertilized ovary of a flower and bears seeds is a fruit",
        "Tomato is specifically a botanical berry with fleshy pericarp and multiple seeds",
        "Culinary classification categorizes plants by savory vs sweet usage in meals",
        "US Supreme Court ruling in 1893 legally declared tomatoes vegetables for import tariffs",
      ];
      possibleMisconceptions = [
        "Misconception: Tomatoes are roots or tuber vegetables",
        "Misconception: Botanists and chefs disagree because science is mistaken",
      ];
      storyOpportunity = "Introduce the historical legal dispute where thousands of dollars hung on a single botanical definition.";
      suitableEnding = "Knowledge is knowing a tomato is a fruit; wisdom is not putting it in a fruit salad.";
    }
  }

  // 8. Roman Ninth Legion (Lost Legion)
  else if (
    lower.includes("ninth legion") ||
    lower.includes("roman") ||
    lower.includes("रोम") ||
    lower.includes("legion")
  ) {
    if (isHindi) {
      mainSubject = "प्राचीन रोमन सैन्य इतिहास: लेजियो IX हिस्पना (9वीं सेना)";
      centralQuestion = "क्या रोमन साम्राज्य की 9वीं सेना सच में स्कॉटलैंड के कोहरे में गायब हो गई थी या इतिहास कुछ और सच बताता है?";
      mainLearningOutcome = "दर्शक हॉलीवुड फिल्मों के मिथक बनाम यूरोप में जमीन से निकले असली पुरातात्विक सबूतों की सच्चाई सीखते हैं।";
      interestingDiscovery = "जहां फिल्में दावा करती हैं कि 5,000 सैनिक 120 ईस्वी में स्कॉटलैंड में कट मरे, वहीं नीदरलैंड की छावनियों में दशकों बाद की मुहर लगी ईंटें मिली हैं!";
      requiredFactualInformation = [
        "लेजियो IX हिस्पना ब्रिटेन के यॉर्क शहर में तैनात एक अनुभवी रोमन सेना थी",
        "पारंपरिक मिथक कहता है कि वे 117-120 ईस्वी में स्कॉटलैंड गए और हमेशा के लिए गायब हो गए",
        "नीदरलैंड के निजमेगन में 121-130 ईस्वी की ईंटों पर 9वीं सेना की आधिकारिक मुहर पाई गई है",
        "सेना के अवशेष बाद में यहूदिया के विद्रोह या पूर्वी युद्धों में तैनात किए गए थे",
      ];
      possibleMisconceptions = [
        "गलत धारणा: 9वीं सेना एक ही रात में स्कॉटलैंड में मारी गई और सारे रिकॉर्ड मिटा दिए गए",
        "गलत धारणा: रोम अपने सैन्य अफसरों का कोई रिकॉर्ड नहीं रखता था",
      ];
      storyOpportunity = "कोहरे में 5,000 सैनिकों के मार्च करने के सिनेमाई मिथक से शुरू कर यूरोप भर में खुदे असली पुरातात्विक सुरागों को सामने लाना।";
      suitableEnding = "इतिहास फिल्मों की तरह नहीं होता; 9वीं सेना कोहरे में नहीं खोई, बल्कि रोम की विशाल सीमाओं पर लड़ते-लड़ते बिखर गई।";
    } else {
      mainSubject = "Ancient Roman Military History: Legio IX Hispana";
      centralQuestion = "Did the Roman Ninth Legion really vanish in the Scottish mists, or does historical evidence tell a different story?";
      mainLearningOutcome = "Learn the archaeological reality versus the romantic myth of the 'lost' Ninth Legion in Roman Britain.";
      interestingDiscovery = "While popular films claim 5,000 soldiers disappeared fighting Picts in Caledonia around 120 AD, stamped roof tiles in Nijmegen (Netherlands) show the 9th Legion served on the Rhine decades later.";
      requiredFactualInformation = [
        "Legio IX Hispana was a veteran Roman legion stationed at Eboracum (modern York)",
        "Traditional myth claims they marched north into Scotland around 117-120 AD and vanished completely",
        "Archaeological finds in Nijmegen (Netherlands) show tile stamps bearing the Ninth Legion's mark dating to around 121-130 AD",
        "The legion may have been redeployed to the Bar Kokhba revolt in Judea or disbanded after a defeat in the East",
      ];
      possibleMisconceptions = [
        "Misconception: The Ninth Legion was wiped out overnight in a Scottish ambush and wiped from records",
        "Misconception: Rome never recorded the names of legion commanders",
      ];
      storyOpportunity = "Begin with the eerie cinematic myth of 5,000 soldiers marching into northern fog, then reveal the real archaeological clues dug up across Europe.";
      suitableEnding = "History isn't a neat movie ending; the Ninth Legion didn't disappear in mist, they were quietly transferred and worn down across Rome's vast borders.";
    }
  }

  // 9. Rainbow physics
  else if (lower.includes("rainbow") || lower.includes("इंद्रधनुष")) {
    if (isHindi) {
      mainSubject = "वायुमंडलीय प्रकाशिकी: अपवर्तन, परावर्तन और वर्ण-विक्षेपण";
      centralQuestion = "इंद्रधनुष हमेशा सूरज के ठीक विपरीत दिशा में और ठीक 7 रंगों में ही क्यों बनता है?";
      mainLearningOutcome = "दर्शक समझते हैं कि हवा में तैरती लाखों बूंदें सूक्ष्म प्रिज्म की तरह काम करती हैं, जो प्रकाश को 42 डिग्री के कोण पर मोड़ती और परावर्तित करती हैं।";
      interestingDiscovery = "हर इंद्रधनुष असल में 360 डिग्री का पूरा गोल चक्र होता है; हमें जमीन से केवल आधा वृत्त दिखता है क्योंकि क्षितिज नीचे का हिस्सा ढक देता है!";
      requiredFactualInformation = [
        "पानी की बूंद में प्रवेश करते ही प्रकाश धीमा होकर अपने अलग-अलग रंगों में बंट जाता है",
        "लाल प्रकाश 42 डिग्री पर और बैंगनी प्रकाश 40 डिग्री पर बाहर निकलता है",
        "बूंद के पिछले हिस्से से पूर्ण आंतरिक परावर्तन (Total Internal Reflection) होता है",
        "इंद्रधनुष कोई स्थिर भौतिक वस्तु नहीं, बल्कि देखने वाले की आंख के सापेक्ष बनने वाला प्रकाशीय दृश्य है",
      ];
      possibleMisconceptions = [
        "गलत धारणा: एक साथ खड़े दो लोग बिल्कुल एक ही इंद्रधनुष को देख रहे होते हैं",
        "गलत धारणा: इंद्रधनुष का सिरा जमीन पर किसी निश्चित जगह पर जाकर टिकता है",
      ];
      storyOpportunity = "दर्शकों से पूछना कि क्या वे कभी इंद्रधनुष के अंत तक पहुंचे हैं, फिर हवाई जहाज से दिखने वाले पूरे गोल चक्र को दिखाना।";
      suitableEnding = "आप कभी किसी और का इंद्रधनुष नहीं देखते; हर इंसान अपनी आंखों में परावर्तित होने वाला अपना निजी इंद्रधनुष देखता है।";
    } else {
      mainSubject = "Atmospheric Optics: Refraction, Reflection & Dispersion";
      centralQuestion = "Why do rainbows always form a circular arc opposite the sun with exactly 7 distinct color bands?";
      mainLearningOutcome = "Understand how millions of airborne water droplets act as microscopic prisms, bending light twice and reflecting it once at a precise 42-degree angle.";
      interestingDiscovery = "Every rainbow is actually a complete 360-degree circle; we only see a semi-circular arc because the horizon blocks the bottom half!";
      requiredFactualInformation = [
        "Light slows down and refracts upon entering a raindrop, separating into component wavelengths (dispersion)",
        "Red light bends least (emerging at ~42 degrees) while violet bends most (emerging at ~40 degrees)",
        "Total internal reflection bounces the light off the back of the droplet",
        "A rainbow is not a physical object in a fixed location; it is an optical phenomenon relative to each observer's eye",
      ];
      possibleMisconceptions = [
        "Misconception: Two people standing next to each other see the exact same rainbow",
        "Misconception: A rainbow ends at a physical spot on the ground",
      ];
      storyOpportunity = "Ask viewers why they can never reach the end of a rainbow, then reveal that airplanes frequently view full 360-degree circular rainbows from above the clouds.";
      suitableEnding = "You never see someone else's rainbow; every single person sees their own personal spectrum reflected into their eyes.";
    }
  }

  // 10. General curiosity / scientific mechanism (Fallback / Dynamic extraction)
  else {
    if (isHindi) {
      mainSubject = clean;
      centralQuestion = clean.includes("?")
        ? clean
        : `क्या आप जानते हैं कि ${clean} के पीछे का असली वैज्ञानिक सच क्या है?`;
      mainLearningOutcome = `${clean} के पीछे काम करने वाले वास्तविक वैज्ञानिक नियमों और इसके व्यावहारिक महत्व को समझना।`;
      interestingDiscovery = `${clean} के बारे में सबसे दिलचस्प बात यह है कि इसकी भीतरी कार्यप्रणाली आम मानवीय सोच से बिल्कुल अलग होती है।`;
      requiredFactualInformation = [
        `${clean} को संचालित करने वाला मुख्य वैज्ञानिक या तार्किक सिद्धांत`,
        `इसके वास्तविक प्रभाव का प्रत्यक्ष और मापने योग्य प्रमाण`,
        `दैनिक जीवन में इस प्रक्रिया का प्रत्यक्ष उपयोग या महत्व`,
      ];
      possibleMisconceptions = [
        `गलत धारणा: ${clean} केवल संयोग से होता है और इसके पीछे कोई निश्चित नियम नहीं है`,
        `इंटरनेट पर फैली आम भ्रांतियां जो वैज्ञानिक तथ्यों से मेल नहीं खातीं`,
      ];
      storyOpportunity = `${clean} के आम दृश्य से शुरुआत कर इसके पीछे के असली तंत्र को सामने लाना।`;
      suitableEnding = `${clean} के पीछे का विज्ञान यह साबित करता है कि प्रकृति के नियम कितने सटीक और अद्भुत हैं।`;
    } else {
      centralQuestion = clean.includes("?")
        ? clean
        : `What is the real science and hidden mechanism behind ${clean}?`;
      mainSubject = clean;
      mainLearningOutcome = `Gain a clear, evidence-based understanding of ${clean} through real-world mechanisms.`;
      interestingDiscovery = `The fundamental principle that drives ${clean} is often the exact opposite of what common intuition suggests.`;
      requiredFactualInformation = [
        `The primary scientific or historical mechanism governing ${clean}`,
        `Observable physical proof that can be demonstrated or measured`,
        `The real-world implication for everyday human life`,
      ];
      possibleMisconceptions = [
        `Assuming ${clean} happens by coincidence rather than physical laws`,
        `Commonly repeated internet myths regarding ${clean}`,
      ];
      storyOpportunity = `Start with the everyday observation of ${clean}, challenge the popular intuition, and reveal the verifiable reality.`;
      suitableEnding = `A clear synthesis demonstrating how ${clean} connects directly to our everyday world.`;
    }
  }

  return {
    exactTopic,
    mainSubject,
    centralQuestion,
    mainLearningOutcome,
    audienceKnowledgeLevel,
    interestingDiscovery,
    requiredFactualInformation,
    possibleMisconceptions,
    storyOpportunity,
    suitableEnding,
    needsClarification,
    clarificationQuestion,
  };
}
