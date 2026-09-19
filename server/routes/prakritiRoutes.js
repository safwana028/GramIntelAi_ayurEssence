import express from "express";
import { db } from "../data/database.js";
import { calculatePrakritiScore } from "../services/prakritiService.js";

export const prakritiRouter = express.Router();

/**
 * POST /api/prakriti/calculate
 * Exposed as a callable service so other parts of the app (or third-party tools) can use it
 * E.g., a patient's answers add up to 60% Vata, 25% Pitta, 15% Kapha
 */
prakritiRouter.post("/calculate", (req, res) => {
  try {
    const { answers, observationSignals, includeObservations } = req.body;

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        success: false,
        error: "An 'answers' key with map of questionId -> optionId ('v', 'p', 'k') is required."
      });
    }

    const allQuestions = db.getCollection("questions");

    const result = calculatePrakritiScore(
      answers,
      allQuestions,
      observationSignals || [],
      includeObservations !== undefined ? includeObservations : true
    );

    return res.json({
      success: true,
      data: result
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/prakriti/methodology
 * Documentation of the Ayurvedic assessment methodology and citations
 * Demonstrating the scoring points to classical methods rather than an arbitrary formula
 */
prakritiRouter.get("/methodology", (req, res) => {
  return res.json({
    success: true,
    methodology: {
      title: "SDM College of Ayurveda, Udupi Deha Prakriti Assessment Protocol",
      classicalTreatises: [
        {
          treatise: "Charaka Samhita",
          section: "Vimana Sthana",
          chapter: "Chapter 8 (Rogabhishagjitiya Adhyaya)",
          verses: "95-100",
          sanskritExcerpt: "तत्र वातप्रकृतयः प्रजागराः शीतद्वेषिणो... पित्तप्रकृतयः स्वेदन दुर्गन्धाः... कफप्रकृतयः स्थिरस्निग्धशुक्लदन्तनेत्राः...",
          doctrine: "Defines morphological, physiological, and emotional traits of Vata, Pitta, and Kapha."
        },
        {
          treatise: "Sushruta Samhita",
          section: "Sharira Sthana",
          chapter: "Chapter 4 (Garbha Vyakarana Sharira)",
          verses: "62-76",
          doctrine: "Defines Janma Prakriti as congenital constitutional baseline established at conception."
        },
        {
          treatise: "Ashtanga Hridaya (Vagbhata)",
          section: "Sharira Sthana",
          chapter: "Chapter 3 (Angavibhaga Sharira)",
          verses: "83-104",
          doctrine: "Classifies constitution into Eka-Doshaja, Dwandwaja (dual-doshic, ~85% of people), and Sama-Doshaja (balanced tridoshic)."
        }
      ],
      classificationRules: {
        ekaDoshaja: "Dominant Dosha >= 48% with a lead >= 15% over secondary dosha.",
        dwandwaja: "Top two doshas within 12% margin of each other (bi-constitutional).",
        samaDoshaja: "All 3 doshas within +/- 4% equilibrium (~33% each)."
      },
      disclaimer: "Constitutional evaluation platform for educational and clinical guidance. Does not diagnose disease (Vikriti) or prescribe medicines."
    }
  });
});
