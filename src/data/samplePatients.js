/**
 * Pre-populated realistic patient profiles for SDM College of Ayurveda, Udupi & SMVITM
 * Includes longitudinal assessment history, diverse doshic profiles, and student/doctor workflows.
 */

export const SAMPLE_PATIENTS = [
  {
    id: "PAT-UDU-2026-001",
    name: "Rahul Sharma",
    age: 32,
    gender: "Male",
    phone: "+91 98451 22345",
    email: "rahul.sharma@example.com",
    city: "Udupi, Karnataka",
    occupation: "Software Systems Architect",
    dietType: "Lacto-Vegetarian",
    primaryComplaint: "Routine constitutional evaluation & wellness guidance (Swastha Pariksha)",
    registeredDate: "2026-02-15",
    baselinePrakriti: "Vata-Pitta (Dwandwaja)",
    assessments: [
      {
        id: "ASM-2026-001",
        date: "2026-02-15",
        conductedBy: {
          name: "Dr. K. Raghavendra Rao, BAMS, MD (Ayu)",
          role: "doctor",
          institution: "SDM College of Ayurveda, Udupi"
        },
        supervisorApproved: true,
        supervisorNotes: "Verified classical Vata-Pitta constitution. Vishama Agni noted during dry season.",
        questionnaireId: "sdm-udupi-standard-24",
        scores: {
          vata: 46.2,
          pitta: 38.5,
          kapha: 15.3,
          dominantPrakriti: "Vata-Pitta",
          constitutionType: "Dwandwaja (Dual-Doshic)",
          subScores: {
            physical: { vata: 48, pitta: 36, kapha: 16 },
            physiological: { vata: 45, pitta: 40, kapha: 15 },
            psychological: { vata: 46, pitta: 39, kapha: 15 }
          }
        },
        observations: {
          freeText: "Patient exhibits lean ectomorphic frame, prominent tendon lines on dorsal foot. Speaks with brisk articulation. Reports dry skin during coastal winter winds and erratic appetite when coding late nights.",
          ashtavidha: {
            nadi: "Sarpa-Manduka Gati (Vata-Pitta)",
            mutra: "Pita-Varna (Slight yellowish)",
            mala: "Krura (Hard, slightly dry)",
            jihva: "Niralpa (Slightly dry edges)",
            shabda: "Spashta / Kshipra (Fast)",
            sparsha: "Sheeta-Ushna Mishrita (Cool palms, warm forehead)",
            drik: "Chala (Rapid gaze)",
            akriti: "Krisha (Lean)"
          },
          nlpIndicators: [
            { term: "lean ectomorphic frame", dosha: "vata", weight: 1.0 },
            { term: "brisk articulation", dosha: "vata", weight: 0.8 },
            { term: "dry skin", dosha: "vata", weight: 1.0 },
            { term: "erratic appetite", dosha: "vata", weight: 1.2 },
            { term: "warm forehead", dosha: "pitta", weight: 0.8 }
          ]
        },
        answers: {
          q1_frame: "v", q2_weight: "v", q3_skin: "v", q4_hair: "p", q5_eyes: "v", q6_teeth: "v",
          q7_agni: "v", q8_koshta: "v", q9_thirst: "p", q10_sweda: "p", q11_temp: "v", q12_nidra: "v",
          q13_swapna: "v", q14_bala: "p", q15_gati: "v", q16_vak: "v", q17_smriti: "v", q18_krodha: "p",
          q19_sankalpa: "p", q20_vyaya: "v", q21_social: "v", q22_nails: "v", q23_joints: "v", q24_vyadhikshamatva: "p"
        }
      },
      {
        id: "ASM-2026-004",
        date: "2026-08-10",
        conductedBy: {
          name: "Dr. K. Raghavendra Rao, BAMS, MD (Ayu)",
          role: "doctor",
          institution: "SDM College of Ayurveda, Udupi"
        },
        supervisorApproved: true,
        supervisorNotes: "Follow-up constitutional stability review. Prakriti remains reliably stable at Vata-Pitta.",
        questionnaireId: "sdm-udupi-standard-24",
        scores: {
          vata: 45.0,
          pitta: 39.5,
          kapha: 15.5,
          dominantPrakriti: "Vata-Pitta",
          constitutionType: "Dwandwaja (Dual-Doshic)",
          subScores: {
            physical: { vata: 47, pitta: 37, kapha: 16 },
            physiological: { vata: 44, pitta: 41, kapha: 15 },
            psychological: { vata: 45, pitta: 40, kapha: 15 }
          }
        },
        observations: {
          freeText: "Follow-up after 6 months. Patient maintained warm sesame oil Abhyanga; skin texture reported improved moisture.",
          ashtavidha: {
            nadi: "Sarpa Gati predominantly",
            mutra: "Prakruta",
            mala: "Sama",
            jihva: "Shuddha",
            shabda: "Spashta",
            sparsha: "Slightly unctuous",
            drik: "Sthira",
            akriti: "Madhyama-Krisha"
          },
          nlpIndicators: [
            { term: "warm oil abhyanga", dosha: "vata", weight: 0.8 },
            { term: "improved moisture", dosha: "kapha", weight: 0.5 }
          ]
        },
        answers: {
          q1_frame: "v", q2_weight: "v", q3_skin: "p", q4_hair: "p", q5_eyes: "v", q6_teeth: "v",
          q7_agni: "p", q8_koshta: "v", q9_thirst: "p", q10_sweda: "p", q11_temp: "v", q12_nidra: "p",
          q13_swapna: "v", q14_bala: "p", q15_gati: "v", q16_vak: "v", q17_smriti: "v", q18_krodha: "p",
          q19_sankalpa: "p", q20_vyaya: "v", q21_social: "v", q22_nails: "v", q23_joints: "v", q24_vyadhikshamatva: "p"
        }
      }
    ]
  },
  {
    id: "PAT-UDU-2026-002",
    name: "Deepa Shenoy",
    age: 41,
    gender: "Female",
    phone: "+91 94482 66781",
    email: "deepa.shenoy@example.org",
    city: "Karkala, Udupi Dist.",
    occupation: "Senior Teacher & School Principal",
    dietType: "Vegetarian",
    primaryComplaint: "Constitutional profile & lifestyle alignment (Ritucharya guidance)",
    registeredDate: "2026-03-01",
    baselinePrakriti: "Pitta-Kapha (Dwandwaja)",
    assessments: [
      {
        id: "ASM-2026-002",
        date: "2026-03-01",
        conductedBy: {
          name: "Dr. Sneha Nayak, BAMS",
          role: "doctor",
          institution: "SDM College of Ayurveda, Udupi"
        },
        supervisorApproved: true,
        supervisorNotes: "Classic Pitta-Kapha constitution with strong Agni and stable structural endurance.",
        questionnaireId: "sdm-udupi-standard-24",
        scores: {
          vata: 16.5,
          pitta: 45.2,
          kapha: 38.3,
          dominantPrakriti: "Pitta-Kapha",
          constitutionType: "Dwandwaja (Dual-Doshic)",
          subScores: {
            physical: { vata: 15, pitta: 44, kapha: 41 },
            physiological: { vata: 18, pitta: 48, kapha: 34 },
            psychological: { vata: 16, pitta: 43, kapha: 41 }
          }
        },
        observations: {
          freeText: "Patient displays medium well-knit frame with pleasant complexion. Warm soft palms, strong metabolic fire (Tikshna Agni), decisive speech and structured organizational leadership style.",
          ashtavidha: {
            nadi: "Manduka-Hamsa Gati (Pitta-Kapha)",
            mutra: "Pita Varna",
            mala: "Mridu",
            jihva: "Rakta-Kanta",
            shabda: "Gambhir-Spashta",
            sparsha: "Ushna-Snigdha",
            drik: "Tejasvi",
            akriti: "Madhyama"
          },
          nlpIndicators: [
            { term: "well-knit frame", dosha: "kapha", weight: 0.9 },
            { term: "warm soft palms", dosha: "pitta", weight: 1.0 },
            { term: "strong metabolic fire", dosha: "pitta", weight: 1.2 },
            { term: "decisive speech", dosha: "pitta", weight: 0.8 },
            { term: "calm resilience", dosha: "kapha", weight: 0.9 }
          ]
        },
        answers: {
          q1_frame: "p", q2_weight: "p", q3_skin: "p", q4_hair: "k", q5_eyes: "k", q6_teeth: "k",
          q7_agni: "p", q8_koshta: "p", q9_thirst: "p", q10_sweda: "p", q11_temp: "p", q12_nidra: "p",
          q13_swapna: "p", q14_bala: "k", q15_gati: "p", q16_vak: "p", q17_smriti: "p", q18_krodha: "p",
          q19_sankalpa: "p", q20_vyaya: "p", q21_social: "k", q22_nails: "p", q23_joints: "k", q24_vyadhikshamatva: "k"
        }
      }
    ]
  },
  {
    id: "PAT-UDU-2026-003",
    name: "Kiran Hegde",
    age: 23,
    gender: "Male",
    phone: "+91 97312 99014",
    email: "kiran.hegde@smvitm.ac.in",
    city: "Bantakal, Udupi",
    occupation: "Engineering Student (SMVITM)",
    dietType: "Non-Vegetarian (Occasional)",
    primaryComplaint: "Student Practice Evaluation (Kriya Sharira Case Study)",
    registeredDate: "2026-09-10",
    baselinePrakriti: "Vata-Kapha (Pending Supervisor Sign-Off)",
    assessments: [
      {
        id: "ASM-2026-003",
        date: "2026-09-11",
        conductedBy: {
          name: "Dr. Mahesh Bhat (Final Year BAMS Student)",
          role: "student",
          institution: "SDM College of Ayurveda, Udupi"
        },
        supervisorApproved: false,
        supervisorNotes: "Assessment drafted by student. Needs supervising Vaidya verification of Nadi and Agni scoring.",
        questionnaireId: "sdm-udupi-standard-24",
        scores: {
          vata: 41.5,
          pitta: 20.2,
          kapha: 38.3,
          dominantPrakriti: "Vata-Kapha",
          constitutionType: "Dwandwaja (Dual-Doshic)",
          subScores: {
            physical: { vata: 44, pitta: 18, kapha: 38 },
            physiological: { vata: 40, pitta: 22, kapha: 38 },
            psychological: { vata: 41, pitta: 20, kapha: 39 }
          }
        },
        observations: {
          freeText: "Patient has tall frame with heavy joints. Exhibits slow calm speech but irregular digestion and fluctuating appetite. Student noticed intolerance to cold rainy winds in Bantakal.",
          ashtavidha: {
            nadi: "Sarpa-Hamsa Gati",
            mutra: "Prakruta",
            mala: "Krura",
            jihva: "Shveta-Lipta",
            shabda: "Mridu",
            sparsha: "Sheeta",
            drik: "Sthira",
            akriti: "Dirgha"
          },
          nlpIndicators: [
            { term: "tall frame", dosha: "vata", weight: 0.9 },
            { term: "heavy joints", dosha: "kapha", weight: 1.0 },
            { term: "slow calm speech", dosha: "kapha", weight: 1.0 },
            { term: "irregular digestion", dosha: "vata", weight: 1.1 }
          ]
        },
        answers: {
          q1_frame: "v", q2_weight: "k", q3_skin: "v", q4_hair: "k", q5_eyes: "k", q6_teeth: "k",
          q7_agni: "v", q8_koshta: "v", q9_thirst: "v", q10_sweda: "k", q11_temp: "v", q12_nidra: "k",
          q13_swapna: "v", q14_bala: "k", q15_gati: "k", q16_vak: "k", q17_smriti: "k", q18_krodha: "k",
          q19_sankalpa: "k", q20_vyaya: "k", q21_social: "k", q22_nails: "k", q23_joints: "v", q24_vyadhikshamatva: "k"
        }
      }
    ]
  }
];
