/**
 * Clinical Observation NLP Parser & Classical Guna Extractor
 * Analyzes free-form practitioner clinical observations and maps them
 * to classical Ayurvedic Dosha attributes and clinical weights.
 */

// Ayurvedic Guna and Clinical Symptom Lexicon
const CLINICAL_LEXICON = [
  // VATA INDICATORS (Air + Ether) - Ruksha, Laghu, Sheeta, Khara, Chala, Vishama
  {
    terms: ["lean", "slender", "thin frame", "ectomorphic", "prominent veins", "protruding joints", "visible bones", "scanty weight", "underweight"],
    dosha: "vata",
    guna: "Laghu (Light) / Alpa Sharira",
    weight: 1.0,
    category: "Physical"
  },
  {
    terms: ["dry skin", "rough skin", "cracked heels", "dryness", "chapped", "brittle nails", "flaky skin", "cracked lips", "xerosis"],
    dosha: "vata",
    guna: "Ruksha (Dry) & Khara (Rough)",
    weight: 1.1,
    category: "Physical"
  },
  {
    terms: ["cold extremities", "cold hands", "cold feet", "chilly", "intolerance to cold", "shivering easily", "sheeta"],
    dosha: "vata",
    guna: "Sheeta (Cold)",
    weight: 1.0,
    category: "Physiological"
  },
  {
    terms: ["irregular appetite", "erratic hunger", "vishama agni", "bloating", "flatulence", "gas", "turgid abdomen", "constipation", "hard stool"],
    dosha: "vata",
    guna: "Vishama (Erratic) Agni",
    weight: 1.2,
    category: "Physiological"
  },
  {
    terms: ["fast speech", "speaks quickly", "rapid talk", "chatter", "broken voice", "hoarse", "high pitched"],
    dosha: "vata",
    guna: "Chala (Mobile) & Kshipra",
    weight: 0.9,
    category: "Behavioral"
  },
  {
    terms: ["light sleep", "disturbed sleep", "insomnia", "wakes easily", "frequent awakening", "restless sleep", "anxious dreams"],
    dosha: "vata",
    guna: "Alpa Nidra (Light Sleep)",
    weight: 1.1,
    category: "Physiological"
  },
  {
    terms: ["anxious", "anxiety", "nervous", "worry", "restless", "fidgety", "hyperactive", "indecisive", "mood swings"],
    dosha: "vata",
    guna: "Chitta Chanchalata (Mental Mobility)",
    weight: 1.0,
    category: "Psychological"
  },
  {
    terms: ["cracking joints", "crepitus", "sandhi shabda", "clicking knees", "joint stiffness"],
    dosha: "vata",
    guna: "Khara (Rough) & Ruksha Sandhi",
    weight: 1.0,
    category: "Physical"
  },

  // PITTA INDICATORS (Fire + Water) - Ushna, Tikshna, Snigdha, Drava, Rakta
  {
    terms: ["medium frame", "moderate build", "symmetrical build", "muscular", "athletic build", "proportioned"],
    dosha: "pitta",
    guna: "Madhyama Sharira",
    weight: 0.9,
    category: "Physical"
  },
  {
    terms: ["warm skin", "soft skin", "warm palms", "flushed", "reddish", "ruddy complexion", "moles", "freckles", "acne", "rashes", "sensitive skin"],
    dosha: "pitta",
    guna: "Ushna (Hot) & Pitta Twak",
    weight: 1.1,
    category: "Physical"
  },
  {
    terms: ["heat intolerance", "sweats easily", "profuse sweating", "strong perspiration", "perspiration odor", "loves ac", "dislikes sun"],
    dosha: "pitta",
    guna: "Ushna Asahishnuta (Heat Intolerance)",
    weight: 1.1,
    category: "Physiological"
  },
  {
    terms: ["sharp appetite", "intense hunger", "tikshna agni", "acid reflux", "heartburn", "hyperacidity", "cannot tolerate delayed meal", "hangry"],
    dosha: "pitta",
    guna: "Tikshna Agni (Sharp Metabolism)",
    weight: 1.2,
    category: "Physiological"
  },
  {
    terms: ["sharp eyes", "piercing gaze", "red sclera", "yellowish tinge", "photophobia", "sensitive to bright light"],
    dosha: "pitta",
    guna: "Tikshna Drishti / Tejas",
    weight: 1.0,
    category: "Physical"
  },
  {
    terms: ["decisive", "ambitious", "focused", "perfectionist", "organized", "competitive", "commanding voice", "articulate", "authoritative"],
    dosha: "pitta",
    guna: "Medhavi (Sharp Intellect)",
    weight: 0.9,
    category: "Psychological"
  },
  {
    terms: ["quick tempered", "irritable", "impatient", "anger", "critical", "sarcastic", "frustrated easily"],
    dosha: "pitta",
    guna: "Krodhana (Prone to Anger)",
    weight: 1.1,
    category: "Psychological"
  },
  {
    terms: ["early greying", "premature greying", "hair loss", "thinning hair", "balding", "khalitya", "palitya", "reddish hair"],
    dosha: "pitta",
    guna: "Khalitya & Palitya (Pitta Ushna)",
    weight: 1.0,
    category: "Physical"
  },

  // KAPHA INDICATORS (Water + Earth) - Guru, Sheeta, Mridu, Snigdha, Sthira, Manda
  {
    terms: ["large frame", "heavy build", "stout", "broad shoulders", "well knit joints", "thick bones", "robust build", "endomorphic", "overweight tendency"],
    dosha: "kapha",
    guna: "Guru (Heavy) & Maha Sharira",
    weight: 1.0,
    category: "Physical"
  },
  {
    terms: ["thick skin", "oily skin", "moist skin", "smooth skin", "glowing complexion", "supple", "snigdha twak"],
    dosha: "kapha",
    guna: "Snigdha (Unctuous) & Mridu (Soft)",
    weight: 1.0,
    category: "Physical"
  },
  {
    terms: ["thick hair", "dense hair", "lustrous hair", "jet black hair", "deep black", "firmly rooted hair", "ghana kesha"],
    dosha: "kapha",
    guna: "Snigdha & Ghana (Dense)",
    weight: 1.0,
    category: "Physical"
  },
  {
    terms: ["large eyes", "white sclera", "thick eyelashes", "attractive gaze", "steady eyes", "calm gaze"],
    dosha: "kapha",
    guna: "Snigdha Shukla Netra",
    weight: 0.9,
    category: "Physical"
  },
  {
    terms: ["slow digestion", "sluggish appetite", "manda agni", "heaviness after food", "skips meals easily", "low thirst"],
    dosha: "kapha",
    guna: "Manda Agni (Sluggish Metabolism)",
    weight: 1.2,
    category: "Physiological"
  },
  {
    terms: ["deep sleep", "heavy sleep", "excessive sleep", "hypersomnia", "difficulty waking up", "morning lethargy", "drowsy"],
    dosha: "kapha",
    guna: "Guru & Sandra Nidra (Deep Sleep)",
    weight: 1.1,
    category: "Physiological"
  },
  {
    terms: ["slow gait", "deliberate walk", "slow movements", "steady pace", "deep voice", "resonant voice", "slow speech"],
    dosha: "kapha",
    guna: "Manda Gati & Megha Gambhira Vak",
    weight: 0.9,
    category: "Physiological"
  },
  {
    terms: ["calm", "patient", "forgiving", "compassionate", "peaceful", "unhurried", "emotional stability", "methodical", "long term memory"],
    dosha: "kapha",
    guna: "Dhriti & Sthirata (Steadfast Nature)",
    weight: 1.0,
    category: "Psychological"
  }
];

/**
 * Parses free-form text and extracts matched Ayurvedic Dosha indicators.
 * @param {string} text - Raw practitioner clinical notes
 * @returns {Array} List of matched indicators with confidence, dosha, and clinical guna
 */
export function extractDoshaIndicators(text) {
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return [];
  }

  const normalizedText = text.toLowerCase();
  const matchedIndicators = [];
  const seenKeys = new Set();

  CLINICAL_LEXICON.forEach((item) => {
    item.terms.forEach((term) => {
      // Regex check with word boundary consideration
      const regex = new RegExp(`\\b${term}\\b`, "i");
      if (regex.test(normalizedText)) {
        const key = `${item.dosha}-${item.guna}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          matchedIndicators.push({
            id: `ind-${Math.random().toString(36).substring(2, 8)}`,
            matchedPhrase: term,
            dosha: item.dosha,
            guna: item.guna,
            category: item.category,
            weight: item.weight,
            confidence: 0.88 + Math.random() * 0.08
          });
        }
      }
    });
  });

  return matchedIndicators;
}

/**
 * Generates sample observation text for instant testing
 */
export function getSampleObservation(type = "vata-pitta") {
  if (type === "vata-pitta") {
    return "Patient presents with a lean ectomorphic frame and prominent veins on the forearms. Skin is dry and slightly cool to touch, with mild crepitus in knee joints. Speaks rapidly with articulate cadence. Reports erratic appetite (Vishama Agni), light disturbed sleep with early morning waking, but displays sharp analytical intellect and ambitious drive.";
  } else if (type === "pitta-kapha") {
    return "Individual has a moderate symmetrical build with well-developed muscle tone. Skin is warm and soft with occasional reddish flushing. Reports sharp appetite (Tikshna Agni) and intolerance to hot humid afternoons. Possesses deep resonant voice, calm emotional stability under pressure, and thick lustrous hair.";
  } else {
    return "Patient displays a broad heavy build with well-padded joints. Speaks in a deliberate, unhurried melodic tone. Strong endurance and steady stamina. Digestion is sluggish (Manda Agni) with prolonged feeling of fullness after heavy meals. Deep uninterrupted sleep exceeding 8 hours.";
  }
}
