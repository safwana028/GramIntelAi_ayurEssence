import express from "express";
import { db } from "../data/database.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { cacheService } from "../services/cacheService.js";

export const questionnaireRouter = express.Router();

function formatQuestion(q) {
  return {
    id: q.id,
    questionText: typeof q.question === "object" ? q.question.en || Object.values(q.question)[0] : q.question,
    question: q.question,
    category: q.category || q.dimension || "Body Characteristics",
    dimension: q.dimension || "Physical",
    sanskritTrait: q.sanskritTrait || "",
    options: (q.options || []).map((opt) => ({
      id: opt.id,
      text: typeof opt.text === "object" ? opt.text.en || Object.values(opt.text)[0] : opt.text,
      dosha: opt.dosha,
      weight: opt.weight || 1.0,
      score: opt.weight || 1.0
    }))
  };
}

/**
 * GET /api/questionnaires
 * List questionnaires with full questions, categories, and scoring info
 */
questionnaireRouter.get("/", (req, res) => {
  try {
    const cached = cacheService.get("questionnaires_all");
    if (cached) {
      return res.json(cached);
    }

    const questionnaires = db.getCollection("questionnaires");
    const rawQuestions = db.getCollection("questions");
    const formattedQuestions = rawQuestions.map(formatQuestion);

    const enriched = questionnaires.map((q) => ({
      ...q,
      questions: formattedQuestions
    }));

    const response = {
      success: true,
      data: enriched,
      questionnaires: enriched,
      questions: formattedQuestions
    };

    cacheService.set("questionnaires_all", response, 600);
    return res.json(response);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message });
  }
});

/**
 * GET /api/questionnaires/standard
 * Store and serve the baseline standardised questionnaire
 */
questionnaireRouter.get("/standard", (req, res) => {
  try {
    const cached = cacheService.get("questionnaires_standard");
    if (cached) {
      return res.json(cached);
    }

    const questionnaires = db.getCollection("questionnaires");
    const standard = questionnaires.find((q) => q.isDefault) || questionnaires[0];
    const questions = db.getCollection("questions");
    const formattedQuestions = questions.map(formatQuestion);

    const response = {
      success: true,
      data: {
        metadata: standard,
        totalQuestions: questions.length,
        questions: formattedQuestions
      },
      questions: formattedQuestions
    };

    cacheService.set("questionnaires_standard", response, 600);
    return res.json(response);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message });
  }
});

/**
 * GET /api/questionnaires/:id
 * Retrieve specific questionnaire by ID
 */
questionnaireRouter.get("/:id", (req, res, next) => {
  // Pass through if matching special subpaths
  if (req.params.id === "questions" || req.params.id === "import") {
    return next();
  }

  try {
    const cacheKey = `questionnaires_${req.params.id}`;
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const questionnaires = db.getCollection("questionnaires");
    const target =
      req.params.id === "standard"
        ? questionnaires.find((q) => q.isDefault) || questionnaires[0]
        : questionnaires.find((q) => q.id === req.params.id) || questionnaires[0];

    if (!target) {
      return res.status(404).json({ success: false, message: "Questionnaire not found.", error: "Questionnaire not found." });
    }

    const rawQuestions = db.getCollection("questions");
    const formattedQuestions = rawQuestions.map(formatQuestion);

    const response = {
      success: true,
      data: {
        ...target,
        questions: formattedQuestions
      },
      questionnaire: {
        ...target,
        questions: formattedQuestions
      }
    };

    cacheService.set(cacheKey, response, 600);
    return res.json(response);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message });
  }
});


/**
 * POST /api/questionnaires
 * Create a new questionnaire
 */
questionnaireRouter.post("/", (req, res) => {
  try {
    const { title, description, category, questions } = req.body;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required for questionnaire.",
        error: "Title is required for questionnaire."
      });
    }

    const newQuestionnaire = {
      id: `q_bundle_${Date.now()}`,
      title,
      description: description || "AyurEssence Constitutional Questionnaire",
      category: category || "Prakriti Assessment",
      itemCount: Array.isArray(questions) ? questions.length : 0,
      isDefault: false,
      createdAt: new Date().toISOString()
    };

    db.insert("questionnaires", newQuestionnaire);

    if (Array.isArray(questions)) {
      questions.forEach((q, idx) => {
        db.insert("questions", {
          id: q.id || `custom_q_${newQuestionnaire.id}_${idx + 1}`,
          questionnaireId: newQuestionnaire.id,
          question: q.questionText || q.question,
          dimension: q.dimension || q.category || "Physical",
          category: q.category || q.dimension || "Physical",
          options: q.options || [],
          isCustom: true,
          createdAt: new Date().toISOString()
        });
      });
    }

    return res.status(201).json({
      success: true,
      message: "Questionnaire created successfully",
      questionnaire: newQuestionnaire,
      data: newQuestionnaire
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, error: err.message });
  }
});


/**
 * GET /api/questions
 * List all questions, with optional dimension filter (Physical, Physiological, Psychological)
 */
questionnaireRouter.get("/questions", (req, res) => {
  try {
    const { dimension } = req.query;
    let questions = db.getCollection("questions");

    if (dimension) {
      questions = questions.filter(
        (q) => q.dimension?.toLowerCase() === dimension.toLowerCase()
      );
    }

    return res.json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/questions/:id
 * Retrieve a specific question
 */
questionnaireRouter.get("/questions/:id", (req, res) => {
  try {
    const question = db.findById("questions", req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, error: "Question not found." });
    }
    return res.json({ success: true, data: question });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/questions
 * CRUD API: Add a new question to the form without changing any code (RBAC: Doctor only)
 */
questionnaireRouter.post("/questions", authenticateToken, requireRole("doctor"), (req, res) => {
  try {
    const { dimension, question, sanskritTrait, context, options } = req.body;

    if (!dimension || !question || !options || !Array.isArray(options) || options.length < 3) {
      return res.status(400).json({
        success: false,
        error: "Dimension, question text, and 3 options (Vata, Pitta, Kapha) are required."
      });
    }

    const newQuestion = {
      id: `custom_q_${Date.now()}`,
      dimension,
      sanskritTrait: sanskritTrait || "कस्टम गुण (Custom Trait)",
      question: typeof question === "string" ? { en: question, kn: question, hi: question } : question,
      context: context || "Doctor Custom Clinical Addition",
      options: options.map((opt, i) => ({
        id: opt.id || (opt.dosha ? opt.dosha[0] : `opt_${i}`),
        dosha: opt.dosha,
        weight: Number(opt.weight) || 1.0,
        text: typeof opt.text === "string" ? { en: opt.text, kn: opt.text, hi: opt.text } : opt.text
      })),
      isCustom: true,
      createdBy: req.user.name,
      createdAt: new Date().toISOString()
    };

    db.insert("questions", newQuestion);
    cacheService.invalidate("questionnaires*");

    return res.status(201).json({
      success: true,
      message: "Custom question created successfully.",
      data: newQuestion
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/questions/:id
 * CRUD API: Update existing question (RBAC: Doctor only)
 */
questionnaireRouter.put("/questions/:id", authenticateToken, requireRole("doctor"), (req, res) => {
  try {
    const existing = db.findById("questions", req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Question not found." });
    }

    const updated = db.updateById("questions", req.params.id, req.body);
    cacheService.invalidate("questionnaires*");

    return res.json({
      success: true,
      message: "Question updated successfully.",
      data: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/questions/:id
 * CRUD API: Delete question (RBAC: Doctor only)
 */
questionnaireRouter.delete("/questions/:id", authenticateToken, requireRole("doctor"), (req, res) => {
  try {
    const existing = db.findById("questions", req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Question not found." });
    }

    db.deleteById("questions", req.params.id);
    cacheService.invalidate("questionnaires*");

    return res.json({
      success: true,
      message: `Question '${req.params.id}' deleted successfully.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/questionnaires/import
 * Import custom questionnaire bundle JSON (Doctor only)
 */
questionnaireRouter.post("/import", authenticateToken, requireRole("doctor"), (req, res) => {
  try {
    const { metadata, questions } = req.body;
    if (!metadata || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        error: "Invalid bundle format: metadata object and questions array required."
      });
    }

    const newQ = {
      id: metadata.id || `q_bundle_${Date.now()}`,
      title: metadata.title,
      institution: metadata.institution || "Custom",
      version: metadata.version || "1.0",
      itemCount: questions.length,
      isDefault: false,
      importedBy: req.user.name,
      importedAt: new Date().toISOString()
    };

    db.insert("questionnaires", newQ);

    // Insert imported questions
    questions.forEach((q) => {
      if (!db.findById("questions", q.id)) {
        db.insert("questions", { ...q, questionnaireId: newQ.id, isCustom: true });
      }
    });

    cacheService.invalidate("questionnaires*");

    return res.status(201).json({
      success: true,
      message: `Questionnaire '${newQ.title}' with ${questions.length} questions imported.`,
      data: newQ
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

