/**
 * Classical Ayurvedic Literature References for Prakriti Assessment
 * Verified against classical treatises:
 * 1. Charaka Samhita (Vimana Sthana Chapter 8: Rogabhishagjitiya Adhyaya)
 * 2. Sushruta Samhita (Sharira Sthana Chapter 4: Garbha Vyakarana Sharira)
 * 3. Ashtanga Hridaya of Vagbhata (Sharira Sthana Chapter 3: Angavibhaga Sharira)
 */

export const SAMHITA_REFERENCES = [
  {
    id: "CS-VIM-8",
    source: "Charaka Samhita",
    section: "Vimana Sthana",
    chapter: "Chapter 8 (Rogabhishagjitiya Adhyaya)",
    verse: "Verse 95-100",
    sanskrit: "तत्र वातप्रकृतयः प्रजागराः शीतद्वेषिणो दुर्भगाः स्तेना मत्सरा गीतहास्यमृगयाकलहप्रियाः... पित्तप्रकृतयः स्वेदन दुर्गन्धाः पीतसिथिलाङ्गाः... कफप्रकृतयः स्थिरस्निग्धशुक्लदन्तनेत्राः...",
    translation: "Vata constitution individuals are characterized by light sleep, intolerance to cold, unsteady frame, quick movement and speech. Pitta individuals possess delicate warm bodies, excessive perspiration, sharp appetite and keen intelligence. Kapha individuals have firm, compact joints, oily smooth skin, deep restful sleep and enduring physical strength.",
    clinicalSignificance: "Fundamental source for assessing Sharirika (physical) and Manasika (behavioral) attributes of the three Doshas in clinical examination."
  },
  {
    id: "SS-SHA-4",
    source: "Sushruta Samhita",
    section: "Sharira Sthana",
    chapter: "Chapter 4 (Garbha Vyakarana Sharira)",
    verse: "Verse 62-76",
    sanskrit: "शुक्रशोणितसंयोगे यो भवेद्दोष उत्कटः। प्रकृत्या जायते तेन तस्या लक्षणमुच्यते॥",
    translation: "Whichever dosha is predominantly aggravated or established at the time of conception (union of Shukra and Shonita), the individual inherits that fundamental constitution (Prakriti), which remains lifelong and non-pathological.",
    clinicalSignificance: "Defines congenital Prakriti (Janma Prakriti) as an immutable constitutional baseline distinct from acquired pathology (Vikriti)."
  },
  {
    id: "AH-SHA-3",
    source: "Ashtanga Hridaya (Vagbhata)",
    section: "Sharira Sthana",
    chapter: "Chapter 3 (Angavibhaga Sharira)",
    verse: "Verse 83-104",
    sanskrit: "शुक्रार्तवस्थैर्जन्मादौ विषेणेव विषक्रिमेः। तैश्च तिस्रः प्रकृतयो हीनमध्योत्तमाः पृथक्॥ समधातुः समस्तासु श्रेष्ठा निन्द्या द्विदोषजाः॥",
    translation: "Just as poisonous worms are born in poison without perishing, human constitution is framed by Doshas at origin. Pure monodoshic types are lower/medium, dual-doshic (Dwandwaja) are common, while balanced Tridoshic (Sama Prakriti) is considered supreme and healthiest.",
    clinicalSignificance: "Validates the classification into Eka-Doshaja (single dominant), Dwandwaja (dual-doshic: ~85% of people), and Sama-Doshaja (balanced)."
  },
  {
    id: "SDM-METHODOLOGY",
    source: "SDM College of Ayurveda, Udupi",
    section: "Department of Kriya Sharira & Roga Nidana",
    chapter: "Standard Clinical Protocol for Deha Prakriti Pariksha",
    verse: "Academic Clinical Practice Guidelines",
    sanskrit: "त्रिविधं खलु रोगविशेषविज्ञानं भवति; तद्यथा- आप्तोपदेशः, प्रत्यक्षम्, अनुमानं चेति॥",
    translation: "Comprehensive constitutional analysis requires structured inquiry (Prashna Pariksha), direct sensory observation (Pratyaksha / Darshana-Sparshana), and clinical inference (Anumana).",
    clinicalSignificance: "Blends standardized questionnaire responses with free-form practitioner clinical observations for an evidence-grounded assessment."
  }
];

export const DOSHA_PROFILES = {
  vata: {
    name: "Vata",
    sanskritName: "वात",
    elements: "Ether (Akasha) + Air (Vayu)",
    rulingPrinciple: "Movement, Circulation, Neuro-sensory Transmission (Gati & Utsaha)",
    gunas: ["Ruksha (Dry)", "Laghu (Light)", "Sheeta (Cold)", "Khara (Rough)", "Sukshma (Subtle)", "Chala (Mobile)"],
    colorScheme: {
      bg: "bg-sky-50",
      border: "border-sky-300",
      text: "text-sky-800",
      badge: "bg-sky-100 text-sky-800 border-sky-300",
      accent: "#0284c7"
    },
    strengths: "Creative, agile, quick learning, expressive communicator, adaptable, enthusiastic.",
    vulnerabilities: "Dryness, joint cracking, irregular appetite, anxiety under stress, disturbed sleep, sensitivity to cold winds.",
    dinacharyaTips: [
      "Follow consistent meal and sleep schedules to ground erratic energy.",
      "Abhyanga: Daily self-massage with warm unrefined sesame oil.",
      "Favor warm, moist, grounding cooked foods with healthy fats (ghee).",
      "Engage in calming exercises such as slow Hatha yoga and gentle walking."
    ]
  },
  pitta: {
    name: "Pitta",
    sanskritName: "पित्त",
    elements: "Fire (Tejas) + Water (Ap)",
    rulingPrinciple: "Metabolism, Digestion, Thermogenesis & Transformation (Paka & Tejas)",
    gunas: ["Sasneha (Slightly Oily)", "Tikshna (Sharp)", "Ushna (Hot)", "Laghu (Light)", "Visra (Fleshy Smelling)", "Sara (Flowing)", "Drava (Liquid)"],
    colorScheme: {
      bg: "bg-amber-50",
      border: "border-amber-300",
      text: "text-amber-800",
      badge: "bg-amber-100 text-amber-800 border-amber-300",
      accent: "#d97706"
    },
    strengths: "Sharp intellect, decisive leadership, strong metabolism, focused ambition, articulate articulation.",
    vulnerabilities: "Irritability when hungry, acid reflux, skin eruptions, excessive sweating, heat intolerance.",
    dinacharyaTips: [
      "Avoid skipping meals; maintain cool digestion with cooling herbs (coriander, fennel).",
      "Abhyanga: Gentle massage using cooling oils like coconut or Chandanadi oil.",
      "Favor sweet, bitter, and astringent tastes; minimize excessively spicy, sour, and fermented foods.",
      "Practice Sheetali pranayama and avoid direct mid-day sun exposure."
    ]
  },
  kapha: {
    name: "Kapha",
    sanskritName: "कफ",
    elements: "Water (Ap) + Earth (Prithvi)",
    rulingPrinciple: "Structure, Lubrication, Immunity & Cohesion (Bandha & Sthirata)",
    gunas: ["Guru (Heavy)", "Sheeta (Cold)", "Mridu (Soft)", "Snigdha (Unctuous)", "Madhura (Sweet)", "Sthira (Stable)", "Picchila (Cloudy/Sticky)"],
    colorScheme: {
      bg: "bg-emerald-50",
      border: "border-emerald-300",
      text: "text-emerald-800",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
      accent: "#059669"
    },
    strengths: "Strong physical stamina, deep patience, compassionate nature, robust immunity, excellent long-term memory.",
    vulnerabilities: "Lethargy, slow sluggish digestion (Manda Agni), weight gain tendencies, sinus congestion, attachment.",
    dinacharyaTips: [
      "Awaken early before 6:00 AM to harness Vata morning lightness.",
      "Udvartana: Dry herbal powder massage (Triphala / Kolakulathadi) to invigorate circulation.",
      "Favor pungent, bitter, and astringent tastes; consume warm, light, freshly prepared meals.",
      "Engage in vigorous daily aerobic exercise and Surya Namaskar."
    ]
  }
};
