/**
 * SDM College of Ayurveda, Udupi - Standard Prakriti Assessment Questionnaire
 * Comprehensive 24-Trait Classical Baseline Questionnaire
 * Rooted in Charaka Samhita (Vimanasthana 8), Sushruta (Sharirasthana 4) & Ashtanga Hridaya (Sharira 3)
 */

export const QUESTIONNAIRE_METADATA = {
  id: "sdm-udupi-standard-24",
  title: "SDM Udupi Standard Comprehensive Prakriti Questionnaire",
  kannadaTitle: "ಎಸ್.ಡಿ.ಎಂ ಉಡುಪಿ ಪ್ರಮಾಣಿತ ಸಮಗ್ರ ಪ್ರಕೃತಿ ಮೌಲ್ಯಮಾಪನ ಪ್ರಶ್ನಾವಳಿ",
  hindiTitle: "एसडीएम उडुपी मानक व्यापक प्रकृति मूल्यांकन प्रश्नावली",
  version: "2.4.0",
  institution: "SDM College of Ayurveda & Hospital, Kuthpady, Udupi",
  targetDomains: ["Physical (Sharirika)", "Physiological (Kriyatmaka)", "Psychological (Manasika)"],
  itemCount: 24,
  estimatedMinutes: 8
};

export const STANDARD_QUESTIONS = [
  // 1. Physical: Body Frame & Bones
  {
    id: "q1_frame",
    dimension: "Physical",
    sanskritTrait: "शरीर प्रमाण एवं संहनन (Sharira Pramana & Sanhanana)",
    question: {
      en: "Body Frame and Skeletal Structure",
      kn: "ದೇಹ ರಚನೆ ಮತ್ತು ಮೂಳೆಗಳ ವಿನ್ಯಾಸ",
      hi: "शरीर का ढांचा और अस्थि संरचना"
    },
    context: "Charaka Samhita Vimanasthana 8:96-98",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 1.0,
        text: {
          en: "Thin, slender, prominent joints with visible veins (Alpa Sharira / Krisha)",
          kn: "ತೆಳ್ಳನೆಯ, ಎಲುಬುಗಳು ಎದ್ದು ಕಾಣುವ, ಗಂಟುಗಳು ಸ್ಪಷ್ಟವಾಗಿರುವ ಶರೀರ",
          hi: "पतला, दुबला, नसें और जोड़ उभरे हुए"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 1.0,
        text: {
          en: "Medium, well-proportioned, moderate muscle development (Madhyama Sharira)",
          kn: "ಮಧ್ಯಮ ಗಾತ್ರದ, ಸುಸಂಗತವಾದ, ಸಾಧಾರಣ ಮಾಂಸಖಂಡಗಳ ಶರೀರ",
          hi: "मध्यम, सुडौल, संतुलित मांसपेशियों वाला शरीर"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 1.0,
        text: {
          en: "Broad, heavy, well-knit joints covered by firm tissue (Sthira / Maha Sharira)",
          kn: "ದಷ್ಟಪುಷ್ಟ, ದಪ್ಪ ಮೂಳೆಗಳುಳ್ಳ, ಸದೃಢ ಮತ್ತು ಭಾರವಾದ ಶರೀರ",
          hi: "चौड़ा, भारी, मजबूत और अच्छी तरह ढके हुए जोड़"
        }
      }
    ]
  },

  // 2. Physical: Body Weight Tendency
  {
    id: "q2_weight",
    dimension: "Physical",
    sanskritTrait: "भार एवं स्थೂಲತೆ (Bhara & Sthulata)",
    question: {
      en: "Body Weight Tendency and Stability",
      kn: "ದೇಹದ ತೂಕ ಮತ್ತು ಏರಿಳಿತದ ಸ್ವಭಾವ",
      hi: "शरीर का वजन और उसमें उतार-चढ़ाव की प्रवृत्ति"
    },
    context: "Sushruta Samhita Sharirasthana 4:64",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 1.0,
        text: {
          en: "Low weight, difficulty in gaining weight, fluctuates easily",
          kn: "ಕಡಿಮೆ ತೂಕ, ತೂಕ ಹೆಚ್ಚಿಸಿಕೊಳ್ಳಲು ಕಷ್ಟ, ಬೇಗ ಇಳಿಯುತ್ತದೆ",
          hi: "कम वजन, वजन बढ़ाना कठिन, आसानी से कम हो जाता है"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 1.0,
        text: {
          en: "Moderate stable weight, gains or loses weight with equal ease",
          kn: "ಮಧ್ಯಮ ತೂಕ, ನಿಯಂತ್ರಿಸಲು ಸುಲಭ, ಸಮತೋಲನದಿಂದ ಕೂಡಿರುತ್ತದೆ",
          hi: "मध्यम वजन, आसानी से बढ़ता या घटता है"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 1.0,
        text: {
          en: "Heavy, gains weight very quickly, extremely difficult to shed",
          kn: "ತೂಕ ಬೇಗ ಹೆಚ್ಚುತ್ತದೆ, ಇಳಿಸುವುದು ಬಹಳ ಕಷ್ಟಕರ",
          hi: "भारी शरीर, वजन तेजी से बढ़ता है और घटाना बहुत मुश्किल"
        }
      }
    ]
  },

  // 3. Physical: Skin Texture & Moisture
  {
    id: "q3_skin",
    dimension: "Physical",
    sanskritTrait: "त्वक् स्वभाव (Twak Swabhava)",
    question: {
      en: "Skin Texture, Moisture and Cold Sensitivity",
      kn: "ಚರ್ಮದ ವಿನ್ಯಾಸ, ತೇವಾಂಶ ಮತ್ತು ತಂಪು ಸ್ಪರ್ಶ",
      hi: "त्वचा की बनावट, नमी और स्पर्श"
    },
    context: "Charaka Samhita Vimana 8:96",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 1.0,
        text: {
          en: "Dry, rough, cool to touch, tends to crack or chap in winter (Ruksha)",
          kn: "ಒಣಗಿದ, ಒರಟು, ತಂಪಾದ ಸ್ಪರ್ಶ, ಚಳಿಗಾಲದಲ್ಲಿ ಒಡೆಯುವ ಸಾಧ್ಯತೆ",
          hi: "रूखी, खुरदरी, ठंडी, सर्दियों में फटने वाली त्वचा"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 1.0,
        text: {
          en: "Warm, soft, reddish, prone to freckles, moles, acne or rashes (Ushna / Snigdha)",
          kn: "ಬೆಚ್ಚನೆಯ, ಮೃದುವಾದ, ಕೆಂಪು ಛಾಯೆ, ಕಲೆಗಳು ಅಥವಾ ಮೊಡವೆಗಳ ಪ್ರವೃತ್ತಿ",
          hi: "गर्म, मुलायम, लालिमा युक्त, तिल या दानों की प्रवृत्ति"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 1.0,
        text: {
          en: "Thick, smooth, oily, moist, cool, clear complexion (Snigdha / Sandra)",
          kn: "ಮೃದು, ಜಿಡ್ಡುಳ್ಳ, ತೇವಾಂಶಭರಿತ, ಹೊಳಪಿನಿಂದ ಕೂಡಿದ ಸುಂದರ ಚರ್ಮ",
          hi: "मोटी, तैलीय, चमकदार, चिकनी और ठंडी त्वचा"
        }
      }
    ]
  },

  // 4. Physical: Hair Characteristics
  {
    id: "q4_hair",
    dimension: "Physical",
    sanskritTrait: "केश लक्षण (Kesha Lakshana)",
    question: {
      en: "Hair Quality, Texture and Color",
      kn: "ಕೂದಲಿನ ಸಾಂದ್ರತೆ, ಗುಣ ಮತ್ತು ಬಣ್ಣ",
      hi: "बालों की गुणवत्ता, बनावट और रंग"
    },
    context: "Ashtanga Hridaya Sharira 3:88",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 1.0,
        text: {
          en: "Dry, thin, coarse, curly or split ends, dull black (Ruksha Kesha)",
          kn: "ಒಣಗಿದ, ತೆಳುವಾದ, ಸೀಳುವ, ಸುರುಳಿ ಅಥವಾ ನಿಸ್ತೇಜ ಕೂದಲು",
          hi: "रूखे, पतले, दोमुंहे, घुंघराले या हल्के बाल"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 1.0,
        text: {
          en: "Fine, soft, reddish/brownish tint, early greying or thinning (Khalitya/Palitya)",
          kn: "ಮೃದು, ತಿಳಿ ಕಂದು/ಕೆಂಪು ಬಣ್ಣ, ಬೇಗ ನೆರೆಯುವ ಅಥವಾ ಉದುರುವ ಕೂದಲು",
          hi: "मुलायम, भूरे या लाल रंगत वाले, जल्दी सफेद या झड़ने वाले"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 1.0,
        text: {
          en: "Thick, lustrous, wavy, deep jet black, rooted firmly (Snigdha / Ghana)",
          kn: "ದಟ್ಟವಾದ, ಕಪ್ಪಾದ, ಹೊಳಪಿನಿಂದ ಕೂಡಿದ, ಗಟ್ಟಿಯಾದ ಕೂದಲು",
          hi: "घने, चमकदार, गहरे काले, मजबूत और लहराते हुए बाल"
        }
      }
    ]
  },

  // 5. Physical: Eyes and Gaze
  {
    id: "q5_eyes",
    dimension: "Physical",
    sanskritTrait: "नेत्र एवं दृष्टि (Netra & Drishti)",
    question: {
      en: "Eyes Size, Moisture and Gaze",
      kn: "ಕಣ್ಣುಗಳ ಗಾತ್ರ, ತೇವಾಂಶ ಮತ್ತು ದೃಷ್ಟಿಯ ಲಕ್ಷಣ",
      hi: "आंखों का आकार, नमी और दृष्टि"
    },
    context: "Sushruta Samhita Sharirasthana 4:66",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 1.0,
        text: {
          en: "Small, dry, blinking frequently, restless gaze, dull sclera (Chala Netra)",
          kn: "ಚಿಕ್ಕ ಕಣ್ಣುಗಳು, ಆಗಾಗ್ಗೆ ರೆಪ್ಪೆ ಬಡಿಯುವುದು, ಅಸ್ಥಿರ ದೃಷ್ಟಿ",
          hi: "छोटी, रूखी, जल्दी-जल्दी पलकें झपकाने वाली, चंचल आंखें"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 1.0,
        text: {
          en: "Medium, piercing gaze, sensitive to bright sun, reddish or yellowish tinge",
          kn: "ತೀಕ್ಷ್ಣ ದೃಷ್ಟಿ, ಬಿಸಿಲಿಗೆ ಸೂಕ್ಷ್ಮ, ತಿಳಿ ಕೆಂಪು ಅಥವಾ ಹಳದಿ ಛಾಯೆ",
          hi: "तीक्ष्ण दृष्टि, धूप के प्रति संवेदनशील, हल्की लालिमा युक्त"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 1.0,
        text: {
          en: "Large, wide, attractive, clear white sclera, thick eyelashes, steady gaze",
          kn: "ದೊಡ್ಡ, ಆಕರ್ಷಕ, ಸ್ಪಷ್ಟ ಬಿಳಿ ಬಣ್ಣ, ದಟ್ಟ ರೆಪ್ಪೆಗೂದಲು, ಸ್ಥಿರ ದೃಷ್ಟಿ",
          hi: "बड़ी, आकर्षक, सफेद, घनी पलकों वाली और शांत-स्थिर दृष्टि"
        }
      }
    ]
  },

  // 6. Physical: Teeth and Oral Cavity
  {
    id: "q6_teeth",
    dimension: "Physical",
    sanskritTrait: "दन्त लक्षण (Danta Lakshana)",
    question: {
      en: "Teeth Structure and Gums",
      kn: "ಹಲ್ಲುಗಳು ಮತ್ತು ವಸಡಿನ ಸ್ವರೂಪ",
      hi: "दांतों और मसूड़ों की बनावट"
    },
    context: "Charaka Samhita Vimana 8:97",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 1.0,
        text: {
          en: "Irregular, crooked, protruding, dry or prone to cavities",
          kn: "ಅಸಮವಾದ, ಡೊಂಕಾದ, ಒಣಗಿದ ಅಥವಾ ಬೇಗ ಹುಳುಕಾಗುವ ಹಲ್ಲುಗಳು",
          hi: "टेढ़े-मेढ़े, अनियमित, खुरदरे या कैविटी की आशंका वाले"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 1.0,
        text: {
          en: "Medium size, yellowish tint, soft sensitive gums prone to bleeding",
          kn: "ಮಧ್ಯಮ ಗಾತ್ರ, ತಿಳಿ ಹಳದಿ ಛಾಯೆ, ಸೂಕ್ಷ್ಮ ಹಾಗೂ ರಕ್ತಸ್ರಾವವಾಗುವ ವಸಡು",
          hi: "मध्यम, पीले रंगत वाले, संवेदनशील मसूड़े"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 1.0,
        text: {
          en: "Strong, large, pearl-white, uniform, firm healthy gums",
          kn: "ದೃಢವಾದ, ಮುತ್ತಿನಂತಹ ಬಿಳಿ, ಸಮನಾದ ಸಾಲು, ಆರೋಗ್ಯಕರ ವಸಡು",
          hi: "मजबूत, बड़े, चमकदार सफेद, एक समान और स्वस्थ मसूड़े"
        }
      }
    ]
  },

  // 7. Physiological: Digestion & Metabolic Fire
  {
    id: "q7_agni",
    dimension: "Physiological",
    sanskritTrait: "अग्नि एवं पचन शक्ति (Agni / Pachana Shakthi)",
    question: {
      en: "Digestive Fire and Hunger Regularity",
      kn: "ಜೀರ್ಣಕ್ರಿಯೆ ಮತ್ತು ಹಸಿವಿನ ಸಾಮರ್ಥ್ಯ (ಅಗ್ನಿ)",
      hi: "जठराग्नि और भूख की प्रकृति"
    },
    context: "Charaka Samhita Vimanasthana 8:96 (Agni Pariksha)",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 1.2,
        text: {
          en: "Erratic / Irregular (Vishama Agni): sometimes intense, other times absent; bloating after meals",
          kn: "ವಿಷಮಾಗ್ನಿ: ಅನಿಶ್ಚಿತ ಹಸಿವು, ಕೆಲವೊಮ್ಮೆ ಹೆಚ್ಚು, ಕೆಲವೊಮ್ಮೆ ಇಲ್ಲ; ಹೊಟ್ಟೆ ಉಬ್ಬರ",
          hi: "विषमाग्नि: अनिश्चित भूख, कभी बहुत तेज तो कभी बिल्कुल नहीं, पेट फूलना"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 1.2,
        text: {
          en: "Intense / Sharp (Tikshna Agni): frequent unbearable hunger, irritability if meals delayed, hyperacidity",
          kn: "ತೀಕ್ಷ್ಣಾಗ್ನಿ: ತಡೆದುಕೊಳ್ಳಲಾಗದ ಹಸಿವು, ಸಮಯಕ್ಕೆ ಊಟ ಸಿಗದಿದ್ದರೆ ಸಿಟ್ಟು, ಎದೆಯುರಿ",
          hi: "तीक्ष्णाग्नि: तेज भूख, समय पर खाना न मिलने पर चिड़चिड़ापन, एसिडिटी"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 1.2,
        text: {
          en: "Sluggish / Slow (Manda Agni): can easily skip meals, feels heaviness long after eating, slow metabolism",
          kn: "ಮಂದಾಗ್ನಿ: ನಿಧಾನ ಜೀರ್ಣ, ಊಟದ ನಂತರ ದೀರ್ಘಕಾಲ ಹೊಟ್ಟೆ ಭಾರ, ಹಸಿವು ಕಡಿಮೆ",
          hi: "मंदाग्नि: धीमी पाचन शक्ति, भोजन के बाद भारीपन, भूख कम लगना"
        }
      }
    ]
  },

  // 8. Physiological: Bowel Habits & Koshta
  {
    id: "q8_koshta",
    dimension: "Physiological",
    sanskritTrait: "कोष्ठ एवं मलप्रवृत्ति (Koshta & Mala Pravritti)",
    question: {
      en: "Bowel Evacuation and Stool Consistency (Koshta)",
      kn: "ಮಲವಿಸರ್ಜನೆ ಮತ್ತು ಕರುಳಿನ ಸ್ವಭಾವ (ಕೋಷ್ಠ)",
      hi: "मल त्याग और कोष्ठ की प्रकृति"
    },
    context: "Ashtanga Hridaya Sutrasthana 1:8",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 1.0,
        text: {
          en: "Hard, dry, irregular, prone to constipation and gas (Krura Koshta)",
          kn: "ಕ್ರೂರ ಕೋಷ್ಠ: ಗಟ್ಟಿ ಮಲ, ಅನಿಶ್ಚಿತತೆ, ಮಲಬದ್ಧತೆ ಹಾಗೂ ವಾಯು ಪ್ರವೃತ್ತಿ",
          hi: "क्रूर कोष्ठ: सूखा, कड़ा, कब्ज और गैस की प्रवृत्ति"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 1.0,
        text: {
          en: "Frequent, loose, yellowish, sensitive to mild laxatives or warm milk (Mridu Koshta)",
          kn: "ಮೃದು ಕೋಷ್ಠ: ದಿನಕ್ಕೆ ಹಲವು ಬಾರಿ, ಮೆದುವಾದ ಮಲ, ಉಷ್ಣವಾದರೆ ಬೇಗ ಬೇಧಿ",
          hi: "मृदु कोष्ठ: दिन में कई बार, ढीला मल, हल्के जुलाब से भी दस्त"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 1.0,
        text: {
          en: "Regular, once daily, well-formed, heavy, moderate speed (Madhyama Koshta)",
          kn: "ಮಧ್ಯಮ ಕೋಷ್ಠ: ದಿನಕ್ಕೆ ಒಂದು ಬಾರಿ ನಿಯಮಿತವಾಗಿ, ಸುಲಭವಾದ ವಿಸರ್ಜನೆ",
          hi: "मध्यम कोष्ठ: नियमित, दिन में एक बार, सुगठित और सामान्य"
        }
      }
    ]
  },

  // 9. Physiological: Thirst and Fluid Intake
  {
    id: "q9_thirst",
    dimension: "Physiological",
    sanskritTrait: "तृष्णा प्रवृत्ति (Trishna Pravritti)",
    question: {
      en: "Thirst Intensity and Water Intake Preference",
      kn: "ಬಾಯಾರಿಕೆ ಮತ್ತು ನೀರಿನ ಸೇವನೆಯ ಬಯಕೆ",
      hi: "प्यास की तीव्रता और पानी की आदत"
    },
    context: "Sushruta Samhita Sharira 4:67",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 1.0,
        text: {
          en: "Variable thirst, prefers warm or lukewarm drinks, drinks small sips",
          kn: "ಅನಿಶ್ಚಿತ ಬಾಯಾರಿಕೆ, ಬೆಚ್ಚನೆಯ ನೀರು ಇಷ್ಟ, ಸ್ವಲ್ಪ ಸ್ವಲ್ಪವೇ ಕುಡಿಯುವುದು",
          hi: "अनियमित प्यास, गुनगुना पानी पसंद, थोड़े-थोड़े घूंट पीना"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 1.0,
        text: {
          en: "Excessive and frequent thirst, strong craving for cold refrigerated drinks",
          kn: "ವಿಪರೀತ ಬಾಯಾರಿಕೆ, ತಣ್ಣನೆಯ ನೀರು ಮತ್ತು ತಂಪಾದ ಪಾನೀಯಗಳ ಬಯಕೆ",
          hi: "अत्यधिक और लगातार प्यास, ठंडा पानी पीने की तीव्र इच्छा"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 1.0,
        text: {
          en: "Low thirst, can go hours without water, prefers warm drinks",
          kn: "ಕಡಿಮೆ ಬಾಯಾರಿಕೆ, ದೀರ್ಘಕಾಲ ನೀರಿಲ್ಲದೆ ಇರಬಲ್ಲರು, ಬಿಸಿ ಪಾನೀಯ ಇಷ್ಟ",
          hi: "कम प्यास, लंबे समय तक बिना पानी रह सकते हैं"
        }
      }
    ]
  },

  // 10. Physiological: Perspiration & Body Odor
  {
    id: "q10_sweda",
    dimension: "Physiological",
    sanskritTrait: "स्वेद प्रवृत्ति (Sweda Pravritti)",
    question: {
      en: "Perspiration Pattern, Quantity and Odor",
      kn: "ಬೆವರುವಿಕೆ ಮತ್ತು ಶರೀರದ ವಾಸನೆ (ಸ್ವೇದ)",
      hi: "पसीने की मात्रा और गंध"
    },
    context: "Charaka Samhita Vimana 8:97",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 1.0,
        text: {
          en: "Scanty, minimal sweating even in warm weather, no distinct odor",
          kn: "ಕಡಿಮೆ ಬೆವರು, ಸೆಕೆಯಲ್ಲೂ ಹೆಚ್ಚು ಬೆವರಲ್ಲ, ವಾಸನೆ ರಹಿತ",
          hi: "बहुत कम पसीना, गर्मी में भी सूखापन, कोई विशेष गंध नहीं"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 1.0,
        text: {
          en: "Profuse sweating with slight exertion, strong distinct odor, stains clothes",
          kn: "ವಿಪರೀತ ಬೆವರು, ಬಲವಾದ ವಾಸನೆ, ಬಟ್ಟೆ ಹಳದಿಯಾಗುವುದು",
          hi: "प्रचुर पसीना, तीखी गंध, कपड़े पीले पड़ने की प्रवृत्ति"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 1.0,
        text: {
          en: "Moderate, slow to sweat, steady with prolonged physical exertion, pleasant",
          kn: "ಸಾಧಾರಣ ಬೆವರು, ಶ್ರಮಪಟ್ಟಾಗ ಮಾತ್ರ ಸಮನಾಗಿ ಬೆವರುವುದು",
          hi: "मध्यम पसीना, केवल भारी शारीरिक श्रम करने पर ही आता है"
        }
      }
    ]
  },

  // 11. Physiological: Temperature Tolerance
  {
    id: "q11_temp",
    dimension: "Physiological",
    sanskritTrait: "शीत-उष्ण सहिष्णुता (Sheeta-Ushna Sahishnuta)",
    question: {
      en: "Weather Sensitivity and Temperature Tolerance",
      kn: "ಹವಾಗುಣದ ಸಹಿಷ್ಣುತೆ (ತಂಪು ಮತ್ತು ಸೆಕೆ)",
      hi: "मौसम और तापमान की सहनशीलता"
    },
    context: "Charaka Samhita Vimana 8:96",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 1.1,
        text: {
          en: "Intolerant to cold and wind; loves sunny warm climates and sweaters",
          kn: "ಚಳಿ ಮತ್ತು ತಂಗಾಳಿ ತಡೆಯಲಾರರು; ಬೆಚ್ಚನೆಯ ವಾತಾವರಣ ಮತ್ತು ಬಿಸಿಲು ಇಷ್ಟ",
          hi: "ठंड और हवा सहन नहीं होती; गर्म मौसम और धूप पसंद"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 1.1,
        text: {
          en: "Intolerant to heat, sun and hot rooms; loves AC, cool breezes, winter",
          kn: "ಸೆಕೆ ಮತ್ತು ಬಿಸಿಲು ಸಹಿಸಲಾರರು; ತಂಪು ಪರಿಸರ, ಎ.ಸಿ ಹಾಗೂ ಚಳಿಗಾಲ ಪ್ರಿಯ",
          hi: "गर्मी और धूप बिल्कुल सहन नहीं होती; ठंडक और पंखा/एसी पसंद"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 1.1,
        text: {
          en: "Dislikes cold, damp or rainy weather; tolerates heat reasonably well",
          kn: "ತಂಪು, ತೇವಭರಿತ ಮಳೆಗಾಲ ಇಷ್ಟವಾಗುವುದಿಲ್ಲ; ಸೆಕೆಯನ್ನು ಸುಲಭವಾಗಿ ಸಹಿಸುತ್ತಾರೆ",
          hi: "नम और ठंडा मौसम अप्रिय; सामान्यतः गर्मी आसानी से सह लेते हैं"
        }
      }
    ]
  },

  // 12. Physiological: Sleep Pattern & Quality
  {
    id: "q12_nidra",
    dimension: "Physiological",
    sanskritTrait: "निद्रा स्वरूप (Nidra Swarupa)",
    question: {
      en: "Sleep Quality, Depth and Awakening",
      kn: "ನಿದ್ರೆಯ ಗುಣಮಟ್ಟ, ಆಳ ಮತ್ತು ಎಚ್ಚರವಾಗುವ ರೀತಿ",
      hi: "नींद की गुणवत्ता और गहराई"
    },
    context: "Ashtanga Hridaya Sharira 3:90",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 1.1,
        text: {
          en: "Light, easily awakened by minor noise, frequent waking, difficulty falling asleep (5-6 hrs)",
          kn: "ಹಗುರ ನಿದ್ರೆ, ಸಣ್ಣ ಶಬ್ದಕ್ಕೂ ಎಚ್ಚರ, ನಿದ್ರೆ ಬರಲು ತಡವಾಗುವುದು (೫-೬ ಗಂಟೆ)",
          hi: "हल्की नींद, छोटी आवाज पर खुल जाना, करवटें बदलना (5-6 घंटे)"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 1.1,
        text: {
          en: "Moderate, sound sleep, wakes up refreshed, occasionally disturbed by heat or work stress (6-7 hrs)",
          kn: "ಮಧ್ಯಮ ನಿದ್ರೆ, ಬೇಗ ಎಚ್ಚರ, ಉಲ್ಲಾಸದಾಯಕ ಅನುಭವ (೬-೭ ಗಂಟೆ)",
          hi: "मध्यम, शांत नींद, समय पर जागना, तरोताजा महसूस करना (6-7 घंटे)"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 1.1,
        text: {
          en: "Deep, heavy, uninterrupted, difficulty waking up in the morning, grogginess (8+ hrs)",
          kn: "ಗಾಢ ಮತ್ತು ದೀರ್ಘ ನಿದ್ರೆ, ಬೆಳಿಗ್ಗೆ ಏಳಲು ಆಲಸ್ಯ (೮+ ಗಂಟೆ)",
          hi: "गहरी, भारी, निर्बाध नींद, सुबह उठने में भारीपन और आलस्य (8+ घंटे)"
        }
      }
    ]
  },

  // 13. Physiological: Dreams & Sleep Imagery
  {
    id: "q13_swapna",
    dimension: "Physiological",
    sanskritTrait: "स्वप्न दर्शन (Swapna Darshana)",
    question: {
      en: "Common Dream Themes and Sleep Imagery",
      kn: "ಕನಸಿನಲ್ಲಿ ಕಾಣುವ ಸಾಮಾನ್ಯ ದೃಶ್ಯಗಳು",
      hi: "सपनों की प्रकृति और दृश्य"
    },
    context: "Charaka Samhita Vimana 8:96-98",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 0.9,
        text: {
          en: "Flying, running, jumping, falling, sky, wind, fear or chaos",
          kn: "ಹಾರಾಡುವುದು, ಓಡುವುದು, ಬೀಳುವುದು, ಆಕಾಶ, ಗಾಳಿ, ಭಯದ ಕನಸುಗಳು",
          hi: "उड़ना, दौड़ना, ऊंचाई से गिरना, आकाश, तूफान, भयभीत करने वाले सपने"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 0.9,
        text: {
          en: "Fire, lightning, bright sun, conflicts, problem-solving, gold or red objects",
          kn: "ಬೆಂಕಿ, ಮಿಂಚು, ಸೂರ್ಯ, ಜಗಳ, ಚಿನ್ನ, ಕೆಂಪು ಬಣ್ಣದ ದೃಶ್ಯಗಳು",
          hi: "आग, बिजली, तीव्र प्रकाश, वाद-विवाद, लाल रंग की वस्तुएं"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 0.9,
        text: {
          en: "Water bodies, lakes, swans, romantic scenes, serene landscapes, rain",
          kn: "ಸರೋವರ, ನದಿ, ಜಲಪಾತ, ಹಂಸ, ಪ್ರಶಾಂತ ತಾಣಗಳು, ಮಳೆ",
          hi: "नदी, तालाब, शांत प्राकृतिक दृश्य, हंस, वर्षा, सौम्य सपने"
        }
      }
    ]
  },

  // 14. Physiological: Physical Strength & Endurance
  {
    id: "q14_bala",
    dimension: "Physiological",
    sanskritTrait: "बल एवं व्यायाम शक्ति (Bala & Vyayama Shakthi)",
    question: {
      en: "Physical Endurance and Stamina (Bala)",
      kn: "ದೈಹಿಕ ಶಕ್ತಿ ಮತ್ತು ಸಹಿಷ್ಣುತೆ (ಬಲ)",
      hi: "शारीरिक बल और सहनशक्ति"
    },
    context: "Sushruta Samhita Sharira 4:71",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 1.0,
        text: {
          en: "Low stamina, rapid bursts of energy followed by quick exhaustion",
          kn: "ಕಡಿಮೆ ಸಹಿಷ್ಣುತೆ, ಒಮ್ಮೆಲೇ ಶಕ್ತಿ ಪ್ರದರ್ಶನ ಆದರೆ ಬೇಗನೆ ಆಯಾಸ",
          hi: "कम सहनशक्ति, तेजी से ऊर्जा का उपयोग और तुरंत थकान"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 1.0,
        text: {
          en: "Moderate stamina, competitive drive, pushes beyond limits",
          kn: "ಮಧ್ಯಮ ಶಕ್ತಿ, ಸ್ಪರ್ಧಾತ್ಮಕ ಮನೋಭಾವ, ಗುರಿ ಮುಟ್ಟುವ ಉತ್ಸಾಹ",
          hi: "मध्यम शक्ति, प्रतिस्पर्धी स्वभाव, लक्ष्य पाने तक परिश्रम"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 1.0,
        text: {
          en: "Excellent endurance, steady prolonged stamina, slow to fatigue",
          kn: "ಉತ್ತಮ ಸಹಿಷ್ಣುತೆ, ದೀರ್ಘಕಾಲ ಶ್ರಮಪಡುವ ಸಾಮರ್ಥ್ಯ, ಬೇಗ ಆಯಾಸವಾಗುವುದಿಲ್ಲ",
          hi: "उत्कृष्ट शक्ति, दीर्घकालिक सहनशक्ति, देर से थकान"
        }
      }
    ]
  },

  // 15. Physiological: Movement Speed and Gait
  {
    id: "q15_gati",
    dimension: "Physiological",
    sanskritTrait: "गति एवं चेष्टा (Gati & Cheshta)",
    question: {
      en: "Walking Pace, Movement Speed and Activity Style",
      kn: "ನಡೆಯುವ ವೇಗ ಮತ್ತು ದೈಹಿಕ ಚಲನವಲನದ ರೀತಿ",
      hi: "चलने की गति और शारीरिक गतिविधियां"
    },
    context: "Charaka Samhita Vimana 8:96",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 1.0,
        text: {
          en: "Fast, hurried walk, constantly fidgeting, brisk unpredictable movements",
          kn: "ವೇಗದ ನಡಿಗೆ, ಸದಾ ಚಟುವಟಿಕೆ, ಅಸ್ಥಿರ ಹಾಗೂ ತ್ವರಿತ ಚಲನೆ",
          hi: "तेज और फुर्तीली चाल, बेचैन हाथ-पैर, हमेशा जल्दी में"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 1.0,
        text: {
          en: "Determined, purposeful, sharp rhythmic gait, medium speed",
          kn: "ಸ್ಪಷ್ಟ ಗುರಿಯುಳ್ಳ ಗಂಭೀರ ನಡಿಗೆ, ಸಮತೋಲಿತ ವೇಗ",
          hi: "दृढ़, उद्देश्यपूर्ण और सधी हुई चाल, मध्यम गति"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 1.0,
        text: {
          en: "Slow, graceful, steady, deliberate, relaxed gait (Gaja Gati)",
          kn: "ನಿಧಾನ, ಗಜಗತಿಯಂತಹ ಸ್ಥಿರ ಮತ್ತು ಗಾಂಭೀರ್ಯದ ನಡಿಗೆ",
          hi: "धीमी, शांत, स्थिर और गरिमापूर्ण चाल (गज गति)"
        }
      }
    ]
  },

  // 16. Physiological: Voice, Speech & Cadence
  {
    id: "q16_vak",
    dimension: "Physiological",
    sanskritTrait: "वाक् एवं स्वर (Vak & Svara)",
    question: {
      en: "Voice Pitch, Volume and Speech Rate",
      kn: "ಧ್ವನಿಯ ಸ್ವರೂಪ ಮತ್ತು ಮಾತನಾಡುವ ಶೈಲಿ",
      hi: "आवाज की गंभीरता और बोलने की गति"
    },
    context: "Ashtanga Hridaya Sharira 3:85",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 1.0,
        text: {
          en: "Rapid, talkative, high-pitched, sometimes hoarse or broken speech",
          kn: "ವೇಗವಾಗಿ ಮಾತನಾಡುವುದು, ಹೆಚ್ಚು ಮಾತು, ಹಗುರ ಅಥವಾ ಒರಟು ಧ್ವನಿ",
          hi: "तेज, बहुत बोलने वाला, तीखी या कभी-कभी लड़खड़ाती आवाज"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 1.0,
        text: {
          en: "Clear, sharp, commanding, articulate, argumentative, medium pitch",
          kn: "ಸ್ಪಷ್ಟ, ತೀಕ್ಷ್ಣ, ಪ್ರಭಾವಶಾಲಿ ಹಾಗೂ ವಾದಿಸುವ ಧ್ವನಿ",
          hi: "स्पष्ट, प्रभावशाली, तार्किक, तीखी और निश्चित आवाज"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 1.0,
        text: {
          en: "Deep, resonant, calm, melodic, pleasant tone (Megha Gambhira)",
          kn: "ಗಂಭೀರ, ಸುಮಧುರ, ನಿಧಾನ ಹಾಗೂ ಶಾಂತ ಧ್ವನಿ",
          hi: "गहरी, गंभीर, मधुर, शांत और लयबद्ध आवाज (मेघ गंभीर)"
        }
      }
    ]
  },

  // 17. Psychological: Learning & Memory Retention
  {
    id: "q17_smriti",
    dimension: "Psychological",
    sanskritTrait: "धी, धृति एवं स्मृति (Dhee, Dhriti & Smriti)",
    question: {
      en: "Grasping Power and Memory Retention",
      kn: "ಗ್ರಹಣ ಶಕ್ತಿ ಮತ್ತು ನೆನಪಿನ ಸಾಮರ್ಥ್ಯ",
      hi: "समझने की क्षमता और याददाश्त"
    },
    context: "Charaka Samhita Vimanasthana 8:96 (Shruta-Grahina)",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 1.2,
        text: {
          en: "Quick to grasp new concepts, but quick to forget; associative memory",
          kn: "ಬೇಗ ಕಲಿಯುತ್ತಾರೆ, ಆದರೆ ಬೇಗ ಮರೆಯುತ್ತಾರೆ (ಶೀಘ್ರ ಗ್ರಹಣ, ಶೀಘ್ರ ವಿಸ್ಮರಣೆ)",
          hi: "जल्दी सीखते हैं पर जल्दी भूल जाते हैं (शीघ्र ग्रहण, शीघ्र विस्मृति)"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 1.2,
        text: {
          en: "Sharp intellect, grasps logically, excellent analytical recall",
          kn: "ತೀಕ್ಷ್ಣ ಬುದ್ಧಿ, ತಾರ್ಕಿಕ ಗ್ರಹಿಕೆ, ಅತ್ಯುತ್ತಮ ನೆನಪಿನ ಶಕ್ತಿ",
          hi: "तीक्ष्ण बुद्धि, तार्किक समझ, उत्कृष्ट विश्लेषणात्मक स्मरण"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 1.2,
        text: {
          en: "Takes time to learn, but once grasped, never forgets; long-term memory",
          kn: "ಕಲಿಯಲು ಸಮಯ ತೆಗೆದುಕೊಳ್ಳುತ್ತಾರೆ, ಆದರೆ ಶಾಶ್ವತವಾಗಿ ನೆನಪಿಡುತ್ತಾರೆ",
          hi: "सीखने में समय लेते हैं, परंतु जीवन भर नहीं भूलते"
        }
      }
    ]
  },

  // 18. Psychological: Temperament & Emotional Reaction
  {
    id: "q18_krodha",
    dimension: "Psychological",
    sanskritTrait: "क्रोध एवं मनोभाव (Krodha & Manobhava)",
    question: {
      en: "Emotional Reaction to Stress and Anger Expression",
      kn: "ಕೋಪ ಮತ್ತು ಒತ್ತಡದ ಸಂದರ್ಭದಲ್ಲಿ ಭಾವನಾತ್ಮಕ ಪ್ರತಿಕ್ರಿಯೆ",
      hi: "क्रोध और तनाव में प्रतिक्रिया"
    },
    context: "Sushruta Samhita Sharira 4:68",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 1.1,
        text: {
          en: "Prone to anxiety, worry, nervousness, fear under sudden stress; calms down quickly",
          kn: "ಆತಂಕ, ಭಯ, ಚಿಂತೆ; ಆದರೆ ಕೋಪ ಬೇಗ ಶಮನವಾಗುತ್ತದೆ",
          hi: "चिंता, घबराहट और डर की प्रवृत्ति; गुस्सा जल्दी शांत होना"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 1.1,
        text: {
          en: "Quick tempered, gets angry easily, aggressive or sarcastic, takes time to cool",
          kn: "ಬೇಗ ಕೋಪ ಬರುತ್ತದೆ, ತೀಕ್ಷ್ಣ ಪ್ರತಿಕ್ರಿಯೆ, ತಣ್ಣಗಾಗಲು ಸಮಯ ಬೇಕು",
          hi: "जल्दी क्रोधित होना, आक्रामक स्वभाव, शांत होने में समय लगना"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 1.1,
        text: {
          en: "Rarely gets angry, calm, forgiving, patient, peace-loving, emotionally stable",
          kn: "ಅಪರೂಪವಾಗಿ ಕೋಪ, ಶಾಂತಚಿತ್ತ, ಕ್ಷಮಾಶೀಲ, ಅತ್ಯಂತ ತಾಳ್ಮೆ",
          hi: "शांत, अत्यंत धैर्यवान, जल्दी गुस्सा न होना, क्षमाशील स्वभाव"
        }
      }
    ]
  },

  // 19. Psychological: Decision Making & Certainty
  {
    id: "q19_sankalpa",
    dimension: "Psychological",
    sanskritTrait: "संकल्प एवं निर्णय शक्ति (Sankalpa & Nirnaya)",
    question: {
      en: "Decision Making Style and Resoluteness",
      kn: "ನಿರ್ಧಾರ ತೆಗೆದುಕೊಳ್ಳುವ ಶೈಲಿ ಮತ್ತು ದೃಢತೆ",
      hi: "निर्णय लेने की क्षमता और दृढ़ता"
    },
    context: "Charaka Samhita Vimana 8:96",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 1.0,
        text: {
          en: "Hesitant, indecisive, changes mind frequently, second-guesses choices",
          kn: "ದ್ವಂದ್ವ ಮನಸ್ಸು, ನಿರ್ಧಾರ ತಳೆಯಲು ತಡವರಿಸುವುದು, ಪದೇ ಪದೇ ಬದಲಾಯಿಸುವುದು",
          hi: "असमंजस में रहना, निर्णय बदलने की प्रवृत्ति, बार-बार संदेह करना"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 1.0,
        text: {
          en: "Decisive, confident, swift execution, calculated risk-taker",
          kn: "ದೃಢ ನಿರ್ಧಾರ, ಆತ್ಮವಿಶ್ವಾಸ, ತ್ವರಿತ ಅನುಷ್ಠಾನ",
          hi: "दृढ़ निश्चयी, आत्मविश्वासी, त्वरित और सटीक निर्णय"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 1.0,
        text: {
          en: "Slow to decide, consults others, but sticks steadfastly once decided",
          kn: "ಯೋಚಿಸಿ ತಡವಾಗಿ ನಿರ್ಧಾರ, ಆದರೆ ತೆಗೆದುಕೊಂಡ ನಿರ್ಧಾರಕ್ಕೆ ಬದ್ಧ",
          hi: "धीमी गति से निर्णय, दूसरों से सलाह, पर एक बार तय करने पर अटल"
        }
      }
    ]
  },

  // 20. Psychological: Financial Habits & Spending
  {
    id: "q20_vyaya",
    dimension: "Psychological",
    sanskritTrait: "व्यय एवं धन संग्रह (Vyaya & Dhana Sangraha)",
    question: {
      en: "Spending Habits and Money Management",
      kn: "ಹಣದ ಖರ್ಚು ಮತ್ತು ಉಳಿತಾಯದ ಮನೋಭಾವ",
      hi: "खर्च और धन संचय की आदत"
    },
    context: "Charaka Samhita Vimana 8:96 (Druta-Vyaya)",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 0.9,
        text: {
          en: "Spontaneous / Impulsive spender; spends on quick pleasures, poor savings",
          kn: "ಕ್ಷಣಿಕ ಆಸೆಗಳಿಗೆ ಬೇಗ ಖರ್ಚು ಮಾಡುವ ಸ್ವಭಾವ, ಉಳಿತಾಯ ಕಡಿಮೆ",
          hi: "जल्दबाजी में खर्च, बचत करने में कठिनाई, आवेगी खरीदारी"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 0.9,
        text: {
          en: "Calculated spender on quality, luxury, status items, strategic investments",
          kn: "ಗುಣಮಟ್ಟ ಹಾಗೂ ಆಡಂಬರಕ್ಕೆ ಲೆಕ್ಕಾಚಾರದ ಖರ್ಚು, ಹೂಡಿಕೆಯಲ್ಲಿ ನಿಪುಣ",
          hi: "गुणवत्ता और प्रतिष्ठा की वस्तुओं पर योजनाबद्ध खर्च"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 0.9,
        text: {
          en: "Conservative saver, cautious spender, accumulates wealth securely",
          kn: "ಉಳಿತಾಯ ಮನೋಭಾವ, ಎಚ್ಚರಿಕೆಯ ಖರ್ಚು, ಭವಿಷ್ಯಕ್ಕೆ ಕೂಡಿಡುವುದು",
          hi: "मितव्ययी, धन संचय करने में कुशल, सोच-समझकर खर्च करने वाला"
        }
      }
    ]
  },

  // 21. Psychological: Social Interaction & Relationships
  {
    id: "q21_social",
    dimension: "Psychological",
    sanskritTrait: "ಸಾಮಾಜಿಕ ಸಂಬಂಧ (Samajika Sambandha)",
    question: {
      en: "Friendship Formation and Social Interactions",
      kn: "ಸ್ನೇಹ ಮತ್ತು ಸಾಮಾಜಿಕ ಒಡನಾಟದ ಸ್ವಭಾವ",
      hi: "सामाजिक संबंध और मित्रता"
    },
    context: "Ashtanga Hridaya Sharira 3:86",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 0.9,
        text: {
          en: "Makes friends very quickly, highly sociable, but friendships may change easily",
          kn: "ಬೇಗ ಸ್ನೇಹ ಬೆಳೆಸುತ್ತಾರೆ, ಆದರೆ ದೀರ್ಘಕಾಲ ಉಳಿಸಿಕೊಳ್ಳುವುದು ಕಡಿಮೆ",
          hi: "जल्दी मित्र बना लेना, अत्यधिक मिलनसार पर संबंध बदलते रहना"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 0.9,
        text: {
          en: "Selective friendships, leads groups, respects competence and intellect",
          kn: "ಆಯ್ದ ಸ್ನೇಹಿತರು, ಗುಂಪಿನ ನಾಯಕತ್ವ ವಹಿಸುವುದು, ಬುದ್ಧಿವಂತಿಕೆಗೆ ಗೌರವ",
          hi: "चुनिंदा मित्र, नेतृत्व की भावना, योग्यता का सम्मान"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 0.9,
        text: {
          en: "Takes time to warm up, but forms lifelong, loyal, deeply committed bonds",
          kn: "ಸ್ನೇಹಕ್ಕೆ ಸಮಯ ತಗಲುತ್ತದೆ, ಆದರೆ ಆಜೀವ ನಿಷ್ಠಾವಂತ ಒಡನಾಟ",
          hi: "मित्रता में समय लगाना, पर जीवनपर्यंत वफादार और गहरा रिश्ता"
        }
      }
    ]
  },

  // 22. Physical: Nails & Nail Beds
  {
    id: "q22_nails",
    dimension: "Physical",
    sanskritTrait: "नख लक्षण (Nakha Lakshana)",
    question: {
      en: "Nails Texture, Color and Shape",
      kn: "ಉಗುರುಗಳ ವಿನ್ಯಾಸ, ಬಣ್ಣ ಮತ್ತು ದೃಢತೆ",
      hi: "नाखूनों की बनावट, रंग और मजबूती"
    },
    context: "Charaka Samhita Vimana 8:96",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 0.9,
        text: {
          en: "Brittle, rough, ridged, dull, breaks easily",
          kn: "ಬೇಗ ಮುರಿಯುವ, ಒಣಗಿದ, ಗೆರೆಗಳಿರುವ ನಿಸ್ತೇಜ ಉಗುರುಗಳು",
          hi: "रूखे, खुरदरे, धारियों वाले और जल्दी टूटने वाले नाखून"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 0.9,
        text: {
          en: "Pinkish-red, flexible, smooth, shiny, medium hardness",
          kn: "ಕೆಂಪು/ಗುಲಾಬಿ ಛಾಯೆ, ಮೃದು, ನಯವಾದ ಹೊಳಪುಳ್ಳ ಉಗುರುಗಳು",
          hi: "गुलाबी, लचीले, चमकदार और चिकने नाखून"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 0.9,
        text: {
          en: "Large, thick, broad, strong, glossy white or pale pink",
          kn: "ದೊಡ್ಡದಾದ, ದಪ್ಪ, ಗಟ್ಟಿಯಾದ ಬಿಳಿ ಹೊಳಪಿನ ಉಗುರುಗಳು",
          hi: "चौड़े, मोटे, मजबूत, चमकदार और सफेद नाखून"
        }
      }
    ]
  },

  // 23. Physical: Joints and Cracking Sound
  {
    id: "q23_joints",
    dimension: "Physical",
    sanskritTrait: "सन्धि लक्षण एवं शब्द (Sandhi Lakshana)",
    question: {
      en: "Joint Prominence and Cracking Sounds (Sandhi Shabda)",
      kn: "ಕೀಲುಗಳ ರಚನೆ ಮತ್ತು ಶಬ್ದ ಮಾಡುವ ಸ್ವಭಾವ",
      hi: "जोड़ों की बनावट और आवाज"
    },
    context: "Charaka Samhita Vimana 8:96 (Sandhi Shabda)",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 1.0,
        text: {
          en: "Prominent, loose or cracking joints during movement (Sandhi Sphutana)",
          kn: "ಕೀಲುಗಳು ಎದ್ದು ಕಾಣುತ್ತವೆ, ಚಲಿಸುವಾಗ ಶಬ್ದ (ಪಟಕ್ ಎನ್ನುವುದು)",
          hi: "जोड़ उभरे हुए, उठने-बैठने पर कट-कट की आवाज आना"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 1.0,
        text: {
          en: "Moderately built joints, supple, warm, slightly loose tendons",
          kn: "ಮಧ್ಯಮ ಕೀಲುಗಳು, ಬೆಚ್ಚಗಿನ ಸ್ಪರ್ಶ, ಮೃದುವಾದ ತಂತುಗಳು",
          hi: "मध्यम आकार के जोड़, गर्म और लचीले"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 1.0,
        text: {
          en: "Well-padded joints, hidden bones, deeply lubricated, silent movement",
          kn: "ದೃಢವಾದ ಕೀಲುಗಳು, ಮೂಳೆ ಕಾಣದಷ್ಟು ಮಾಂಸಾವೃತ, ಯಾವುದೇ ಶಬ್ದವಿಲ್ಲ",
          hi: "मांसपेशियों से अच्छी तरह ढके, मजबूत और मौन जोड़"
        }
      }
    ]
  },

  // 24. Physiological: Disease Resistance & Recovery
  {
    id: "q24_vyadhikshamatva",
    dimension: "Physiological",
    sanskritTrait: "व्याधिक्षमत्व एवं आरोग्य (Vyadhikshamatva)",
    question: {
      en: "Natural Immunity and Recovery Rate (Vyadhikshamatva)",
      kn: "ರೋಗನಿರೋಧಕ ಶಕ್ತಿ ಮತ್ತು ಚೇತರಿಕೆಯ ವೇಗ (ವ್ಯಾಧಿಕ್ಷಮತ್ವ)",
      hi: "रोग प्रतिरोधक क्षमता और स्वास्थ्य लाभ की गति"
    },
    context: "Charaka Samhita Sutrasthana 28:7",
    options: [
      {
        id: "v",
        dosha: "vata",
        weight: 1.0,
        text: {
          en: "Fluctuating / delicate immunity, easily affected by weather shifts, slow to fully rebound",
          kn: "ಅನಿಶ್ಚಿತ ರೋಗನಿರೋಧಕ ಶಕ್ತಿ, ಹವಾಗುಣ ಬದಲಾದಾಗ ತಕ್ಷಣ ತೊಂದರೆ",
          hi: "कमजोर रोग प्रतिरोधक क्षमता, मौसम बदलने पर जल्दी बीमार पड़ना"
        }
      },
      {
        id: "p",
        dosha: "pitta",
        weight: 1.0,
        text: {
          en: "Moderate immunity, prone to inflammatory conditions and fevers, fast recovery",
          kn: "ಸಾಧಾರಣ ಶಕ್ತಿ, ಉರಿ ಅಥವಾ ಜ್ವರದ ಸಾಧ್ಯತೆ, ಆದರೆ ಬೇಗ ಚೇತರಿಕೆ",
          hi: "मध्यम प्रतिरोधक क्षमता, संक्रमण/जलन की आशंका, पर शीघ्र सुधार"
        }
      },
      {
        id: "k",
        dosha: "kapha",
        weight: 1.0,
        text: {
          en: "Strong robust immunity, rarely falls sick, excellent natural defense (Uttama Bala)",
          kn: "ಉತ್ತಮ ರೋಗನಿರೋಧಕ ಶಕ್ತಿ, ಅಪರೂಪವಾಗಿ ಅಸ್ವಸ್ಥತೆ, ಸಹಜ ಶಕ್ತಿಶಾಲಿ",
          hi: "मजबूत रोग प्रतिरोधक क्षमता, शायद ही कभी बीमार पड़ना"
        }
      }
    ]
  }
];
