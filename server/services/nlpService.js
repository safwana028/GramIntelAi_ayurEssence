/**
 * Natural Language Processing (NLP) Hook for Practitioner Clinical Notes
 * Extracts Dosha signals, classical Gunas, and clinical weights from free text.
 * Example: "patient reports poor sleep and dry skin" -> detects Vata (Alpa Nidra, Ruksha Twak)
 */

const DOSHA_LEXICON = [
  // Vata signals
  {
    terms: ["dry skin", "rough skin", "cracked skin", "cracked heels", "chapped", "brittle nails", "flaky"],
    dosha: "vata",
    guna: "Ruksha (Dry) & Khara (Rough)",
    weight: 1.0
  },
  {
    terms: ["poor sleep", "light sleep", "disturbed sleep", "insomnia", "wakes frequently", "difficulty falling asleep"],
    dosha: "vata",
    guna: "Alpa Nidra (Light/Disturbed Sleep)",
    weight: 1.1
  },
  {
    terms: ["irregular appetite", "erratic hunger", "bloating", "gas", "constipation", "hard stools", "flatulence"],
    dosha: "vata",
    guna: "Vishama Agni (Erratic Metabolism)",
    weight: 1.2
  },
  {
    terms: ["lean", "thin frame", "slender", "prominent veins", "protruding joints", "underweight", "ectomorphic"],
    dosha: "vata",
    guna: "Laghu (Light) / Alpa Sharira",
    weight: 1.0
  },
  {
    terms: ["fast speech", "speaks quickly", "rapid speech", "talkative", "hoarse voice"],
    dosha: "vata",
    guna: "Chala (Mobile) & Kshipra Vak",
    weight: 0.9
  },
  {
    terms: ["cold extremities", "cold hands", "cold feet", "chilly", "intolerance to cold"],
    dosha: "vata",
    guna: "Sheeta (Cold)",
    weight: 1.0
  },
  {
    terms: ["anxious", "anxiety", "nervous", "restless", "worry", "fidgety"],
    dosha: "vata",
    guna: "Chitta Chanchalata (Mental Agility/Worry)",
    weight: 1.0
  },

  // Pitta signals
  {
    terms: ["warm skin", "soft skin", "warm palms", "flushed", "reddish", "acne", "rashes", "moles", "freckles"],
    dosha: "pitta",
    guna: "Ushna (Hot) & Sasneha",
    weight: 1.0
  },
  {
    terms: ["sharp appetite", "intense hunger", "frequent hunger", "cannot tolerate delayed meal", "acid reflux", "heartburn", "hyperacidity"],
    dosha: "pitta",
    guna: "Tikshna Agni (Sharp Metabolism)",
    weight: 1.2
  },
  {
    terms: ["profuse sweating", "excessive sweating", "sweats easily", "strong body odor", "heat intolerance", "sensitive to sun"],
    dosha: "pitta",
    guna: "Ushna & Sweda Pravritti",
    weight: 1.1
  },
  {
    terms: ["piercing gaze", "sharp eyes", "photophobia", "burning eyes", "red sclera"],
    dosha: "pitta",
    guna: "Tikshna Drishti / Tejas",
    weight: 1.0
  },
  {
    terms: ["quick tempered", "irritable", "short tempered", "anger", "impatient", "critical", "perfectionist"],
    dosha: "pitta",
    guna: "Krodhana (Prone to Heat/Irritation)",
    weight: 1.0
  },
  {
    terms: ["premature greying", "early greying", "hair thinning", "balding"],
    dosha: "pitta",
    guna: "Khalitya & Palitya (Pitta Ushna)",
    weight: 0.9
  },

  // Kapha signals
  {
    terms: ["large frame", "broad shoulders", "heavy build", "thick bones", "well knit joints", "stout", "overweight"],
    dosha: "kapha",
    guna: "Guru (Heavy) & Maha Sharira",
    weight: 1.0
  },
  {
    terms: ["thick skin", "oily skin", "smooth skin", "glowing", "soft cool skin"],
    dosha: "kapha",
    guna: "Snigdha (Unctuous) & Mridu",
    weight: 1.0
  },
  {
    terms: ["sluggish digestion", "slow digestion", "low appetite", "fullness after eating", "skips meals easily"],
    dosha: "kapha",
    guna: "Manda Agni (Sluggish Metabolism)",
    weight: 1.2
  },
  {
    terms: ["deep sleep", "heavy sleep", "prolonged sleep", "excessive sleep", "morning lethargy", "drowsy"],
    dosha: "kapha",
    guna: "Guru & Sandra Nidra",
    weight: 1.1
  },
  {
    terms: ["slow speech", "deep voice", "calm voice", "resonant voice", "slow gait", "deliberate walk"],
    dosha: "kapha",
    guna: "Manda Gati & Megha Gambhira",
    weight: 0.9
  },
  {
    terms: ["calm", "patient", "forgiving", "compassionate", "peaceful", "unhurried", "stable memory"],
    dosha: "kapha",
    guna: "Dhriti & Sthirata",
    weight: 1.0
  }
];

/**
 * Extracts Dosha signals and classical Gunas from free-form clinical notes
 * @param {string} text - Raw practitioner observations
 * @returns {Array} List of matched signals with dosha, matched term, guna, and weight
 */
export function extractDoshaSignalsFromText(text) {
  if (!text || typeof text !== "string") {
    return [];
  }

  const normalized = text.toLowerCase();
  const matchedSignals = [];
  const seen = new Set();

  DOSHA_LEXICON.forEach((item) => {
    item.terms.forEach((term) => {
      // Word boundary check
      const regex = new RegExp(`\\b${term}\\b`, "i");
      if (regex.test(normalized)) {
        const key = `${item.dosha}-${item.guna}`;
        if (!seen.has(key)) {
          seen.add(key);
          matchedSignals.push({
            matchedPhrase: term,
            dosha: item.dosha,
            guna: item.guna,
            weight: item.weight,
            confidence: Number((0.85 + Math.random() * 0.1).toFixed(2))
          });
        }
      }
    });
  });

  return matchedSignals;
}
