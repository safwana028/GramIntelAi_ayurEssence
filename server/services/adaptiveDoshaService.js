import { CONFIG } from "../config/config.js";
import { calculatePrakritiScore } from "./prakritiService.js";

/**
 * Service for Configurable Adaptive Dosha Behavior
 * Default threshold is 80% (configurable via ADAPTIVE_DOSHA_THRESHOLD)
 */

export const DEFAULT_ADAPTIVE_THRESHOLD = 80;

export function getAdaptiveThreshold() {
  const envVal = process.env.ADAPTIVE_DOSHA_THRESHOLD || CONFIG.ADAPTIVE_DOSHA_THRESHOLD;
  const parsed = Number(envVal);
  return !isNaN(parsed) && parsed > 0 && parsed <= 100 ? parsed : DEFAULT_ADAPTIVE_THRESHOLD;
}

/**
 * Evaluates provisional dosha scores against the configurable threshold
 * @param {Object} scores - { vata, pitta, kapha }
 * @param {number} threshold - Configurable percentage threshold (e.g. 80)
 */
export function getAdaptiveDoshaState(scores, threshold = getAdaptiveThreshold()) {
  if (!scores || typeof scores !== "object") {
    return {
      thresholdReached: false,
      threshold,
      dominantDosha: null,
      dominantPercentage: 0,
      indicatorMessage: null,
      provisionalNotice: null,
      adaptiveEvents: []
    };
  }

  const vata = Number(scores.vata) || 0;
  const pitta = Number(scores.pitta) || 0;
  const kapha = Number(scores.kapha) || 0;

  const doshas = [
    { name: "Vata", key: "vata", pct: vata },
    { name: "Pitta", key: "pitta", pct: pitta },
    { name: "Kapha", key: "kapha", pct: kapha }
  ];

  const dominant = doshas.find((d) => d.pct >= threshold);

  if (dominant) {
    return {
      thresholdReached: true,
      threshold,
      dominantDosha: dominant.name,
      dominantKey: dominant.key,
      dominantPercentage: dominant.pct,
      indicatorMessage: `Current provisional result strongly indicates ${dominant.name} dominance (${dominant.pct}% >= ${threshold}% threshold).`,
      provisionalNotice: "Current provisional result strongly indicates dominance. Do not present the provisional result as the final Prakriti. Final Prakriti is calculated only after all 24 required questions are completed and the assessment is submitted/finalized.",
      adaptiveEvents: [
        {
          timestamp: new Date().toISOString(),
          type: "PROVISIONAL_THRESHOLD_REACHED",
          dosha: dominant.name,
          percentage: dominant.pct,
          threshold
        }
      ]
    };
  }

  return {
    thresholdReached: false,
    threshold,
    dominantDosha: null,
    dominantPercentage: Math.max(vata, pitta, kapha),
    indicatorMessage: null,
    provisionalNotice: null,
    adaptiveEvents: []
  };
}

/**
 * Calculates provisional question state and evaluates adaptive behavior
 * Safely preserves the authoritative questionnaire options without modifying database content.
 */
export function calculateAdaptiveQuestionState(currentAnswers = {}, allQuestions = [], observationSignals = [], threshold = getAdaptiveThreshold()) {
  // Compute provisional score
  const provisional = calculatePrakritiScore(currentAnswers, allQuestions, observationSignals, true);
  const adaptiveState = getAdaptiveDoshaState(provisional, threshold);

  return {
    provisionalScores: {
      vata: provisional.vata,
      pitta: provisional.pitta,
      kapha: provisional.kapha,
      dominantPrakriti: provisional.dominantPrakriti
    },
    answeredCount: provisional.answeredCount,
    totalQuestions: allQuestions.length,
    ...adaptiveState,
    adaptiveModeEnabled: true,
    authoritativeQuestionnairePreserved: true
  };
}
