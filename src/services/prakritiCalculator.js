/**
 * Classical Ayurvedic Prakriti Calculation Engine
 * Designed according to SDM College of Ayurveda, Udupi clinical methodology
 * References: Charaka Vimana 8, Sushruta Sharira 4, Ashtanga Hridaya Sharira 3
 *
 * Guaranteed Properties:
 * 1. Deterministic & Authoritative (Vata + Pitta + Kapha === 100)
 * 2. Pure 24-Question Structured Assessment + Clinical Observation Modifiers
 * 3. NO AI camera / facial weighting
 */

/**
 * Normalizes 3 dosha values so that their integer percentages sum exactly to 100%.
 * Uses largest-remainder algorithm to eliminate floating-point rounding errors.
 */
export function normalizePercentages(v, p, k) {
  const total = v + p + k;
  if (total <= 0) {
    return { vata: 34, pitta: 33, kapha: 33 };
  }

  const items = [
    { key: "vata", raw: (v / total) * 100 },
    { key: "pitta", raw: (p / total) * 100 },
    { key: "kapha", raw: (k / total) * 100 }
  ];

  const floored = items.map((item) => ({
    key: item.key,
    floor: Math.floor(item.raw),
    diff: item.raw - Math.floor(item.raw)
  }));

  const currentSum = floored.reduce((acc, item) => acc + item.floor, 0);
  const remainder = 100 - currentSum;

  floored.sort((a, b) => b.diff - a.diff);

  for (let i = 0; i < remainder; i++) {
    floored[i % floored.length].floor += 1;
  }

  const result = {};
  floored.forEach((item) => {
    result[item.key] = item.floor;
  });

  return result;
}

/**
 * Calculates raw points, normalized percentages, subdimensional scores, and constitutional classification.
 * @param {Object} answers - Map of questionId -> optionId ('v', 'p', 'k')
 * @param {Array} questions - Active questions array (e.g. 24 standard questions)
 * @param {Array} observationIndicators - Array of { term, dosha, weight } from practitioner notes
 * @param {boolean} includeObservations - Whether observation indicators adjust scores
 */
export function calculatePrakriti(
  answers = {},
  questions = [],
  observationIndicators = [],
  includeObservations = true
) {
  let vataPoints = 0;
  let pittaPoints = 0;
  let kaphaPoints = 0;

  const dimensionPoints = {
    Physical: { vata: 0, pitta: 0, kapha: 0, total: 0 },
    Physiological: { vata: 0, pitta: 0, kapha: 0, total: 0 },
    Psychological: { vata: 0, pitta: 0, kapha: 0, total: 0 }
  };

  let answeredCount = 0;

  // Process structured questionnaire
  questions.forEach((q) => {
    const selectedOptionVal = answers[q.id];
    if (!selectedOptionVal) return;

    const optIds = Array.isArray(selectedOptionVal)
      ? selectedOptionVal
      : [selectedOptionVal];
    if (optIds.length === 0) return;

    let hasMatchedOption = false;
    optIds.forEach((optId) => {
      const opt = q.options?.find((o) => o.id === optId || o.dosha === optId);
      if (!opt) return;

      hasMatchedOption = true;
      const weight = opt.weight || 1.0;
      const dim = q.dimension || "Physical";

      if (opt.dosha === "vata") {
        vataPoints += weight;
        if (dimensionPoints[dim]) dimensionPoints[dim].vata += weight;
      } else if (opt.dosha === "pitta") {
        pittaPoints += weight;
        if (dimensionPoints[dim]) dimensionPoints[dim].pitta += weight;
      } else if (opt.dosha === "kapha") {
        kaphaPoints += weight;
        if (dimensionPoints[dim]) dimensionPoints[dim].kapha += weight;
      }

      if (dimensionPoints[dim]) {
        dimensionPoints[dim].total += weight;
      }
    });

    if (hasMatchedOption) {
      answeredCount++;
    }
  });

  // Calculate observation modifier points (practitioner clinical insight)
  let obsVata = 0;
  let obsPitta = 0;
  let obsKapha = 0;

  if (includeObservations && Array.isArray(observationIndicators)) {
    observationIndicators.forEach((ind) => {
      const w = ind.weight || 0.8;
      if (ind.dosha === "vata") obsVata += w;
      if (ind.dosha === "pitta") obsPitta += w;
      if (ind.dosha === "kapha") obsKapha += w;
    });
  }

  const finalVata = vataPoints + obsVata;
  const finalPitta = pittaPoints + obsPitta;
  const finalKapha = kaphaPoints + obsKapha;
  const totalPoints = finalVata + finalPitta + finalKapha;

  // Prevent division by zero if empty
  if (totalPoints === 0) {
    return {
      vata: 34,
      pitta: 33,
      kapha: 33,
      totalPoints: 0,
      answeredCount: 0,
      dominant: "Balanced",
      dominantPrakriti: "Incomplete Assessment",
      constitutionType: "Undetermined",
      classicalTerm: "अनिर्णित (Undetermined)",
      explanation: "No responses recorded yet.",
      rationale: "Insufficient responses to establish a constitutional baseline.",
      points: {
        vata: 0,
        pitta: 0,
        kapha: 0,
        questionnaireVata: 0,
        questionnairePitta: 0,
        questionnaireKapha: 0,
        observationVata: 0,
        observationPitta: 0,
        observationKapha: 0
      },
      subScores: {
        physical: { vata: 34, pitta: 33, kapha: 33 },
        physiological: { vata: 34, pitta: 33, kapha: 33 },
        psychological: { vata: 34, pitta: 33, kapha: 33 }
      }
    };
  }

  // Exact 100% Normalized Percentages (Guaranteed vata + pitta + kapha === 100)
  const normalized = normalizePercentages(finalVata, finalPitta, finalKapha);
  const vataPct = normalized.vata;
  const pittaPct = normalized.pitta;
  const kaphaPct = normalized.kapha;

  // Compute sub-dimensional percentages
  const subScores = {};
  ["Physical", "Physiological", "Psychological"].forEach((dim) => {
    const d = dimensionPoints[dim];
    const key = dim.toLowerCase();
    if (d && d.total > 0) {
      const dimNorm = normalizePercentages(d.vata, d.pitta, d.kapha);
      subScores[key] = {
        vata: dimNorm.vata,
        pitta: dimNorm.pitta,
        kapha: dimNorm.kapha
      };
    } else {
      subScores[key] = { vata: 34, pitta: 33, kapha: 33 };
    }
  });

  // Determine Dominant Prakriti & Classification
  const sorted = [
    { dosha: "Vata", pct: vataPct, key: "vata" },
    { dosha: "Pitta", pct: pittaPct, key: "pitta" },
    { dosha: "Kapha", pct: kaphaPct, key: "kapha" }
  ].sort((a, b) => b.pct - a.pct);

  const top = sorted[0];
  const second = sorted[1];
  const third = sorted[2];

  let dominantPrakriti = "";
  let constitutionType = "";
  let classicalTerm = "";
  let rationale = "";

  // Check 1: Sama Doshaja (All three in relative equilibrium: within 4% of each other)
  if (Math.abs(top.pct - third.pct) <= 4.0) {
    dominantPrakriti = "Sama Prakriti (Tridoshaja)";
    constitutionType = "Sama-Doshaja (Balanced Tridoshic)";
    classicalTerm = "समदोषज प्रकृति (Sama-Doshaja)";
    rationale = `All three Doshas are in near equal proportion (Vata: ${vataPct}%, Pitta: ${pittaPct}%, Kapha: ${kaphaPct}%). Charaka and Vagbhata describe this as the supreme, ideal constitutional equilibrium.`;
  }
  // Check 2: Eka-Doshaja (Single Dominant: >= 45% and >= 12% lead over second)
  else if (top.pct >= 45.0 && (top.pct - second.pct) >= 12.0) {
    dominantPrakriti = `${top.dosha} Dominant`;
    constitutionType = "Eka-Doshaja (Monodoshic)";
    classicalTerm = `${top.dosha === "Vata" ? "वातज" : top.dosha === "Pitta" ? "पित्तज" : "कफज"} प्रकृति (Eka-Doshaja)`;
    rationale = `${top.dosha} represents ${top.pct}% of constitutional indicators, distinctly surpassing ${second.dosha} (${second.pct}%) by ${top.pct - second.pct}%. Conforms to classical single-dosha predominance (Charaka Vimana 8:95).`;
  }
  // Check 3: Dwandwaja (Dual-Doshic / Bi-constitutional)
  else {
    dominantPrakriti = `${top.dosha}-${second.dosha}`;
    constitutionType = "Dwandwaja (Dual-Doshic)";
    classicalTerm = `द्वन्द्वज प्रकृति (${top.dosha}-${second.dosha})`;
    rationale = `Combined predominance of ${top.dosha} (${top.pct}%) and ${second.dosha} (${second.pct}%), with ${third.dosha} (${third.pct}%) as tertiary. This bi-constitutional combination is present in approximately 85% of individuals (Ashtanga Hridaya Sharirasthana 3:84).`;
  }

  return {
    vata: vataPct,
    pitta: pittaPct,
    kapha: kaphaPct,
    dominant: top.dosha,
    dominantPrakriti,
    constitutionType,
    classicalTerm,
    rationale,
    totalPoints: Number(totalPoints.toFixed(1)),
    answeredCount,
    points: {
      vata: finalVata,
      pitta: finalPitta,
      kapha: finalKapha,
      questionnaireVata: vataPoints,
      questionnairePitta: pittaPoints,
      questionnaireKapha: kaphaPoints,
      observationVata: obsVata,
      observationPitta: obsPitta,
      observationKapha: obsKapha
    },
    subScores,
    methodologyReferences: [
      "Charaka Samhita Vimanasthana 8:95-100",
      "Sushruta Samhita Sharirasthana 4:62-76",
      "Ashtanga Hridaya Sharirasthana 3:83-104",
      "SDM College of Ayurveda, Udupi Clinical Guidelines"
    ]
  };
}
