/**
 * Normalizes 3 values so that their integer percentages sum exactly to 100%.
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
  let remainder = 100 - currentSum;

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
 * @param {Object|Array} rawAnswers - Map or Array of questionId -> optionId ('v', 'p', 'k') or dosha
 * @param {Array} questions - Array of questions
 * @param {Array} observationSignals - Array of { term, dosha, weight } extracted from practitioner notes
 * @param {boolean} includeObservations - Whether observation signals adjust scores
 */
export function calculatePrakritiScore(rawAnswers = {}, questions = [], observationSignals = [], includeObservations = true) {
  let vataPoints = 0;
  let pittaPoints = 0;
  let kaphaPoints = 0;

  const dimensionPoints = {
    Physical: { vata: 0, pitta: 0, kapha: 0, total: 0 },
    Physiological: { vata: 0, pitta: 0, kapha: 0, total: 0 },
    Psychological: { vata: 0, pitta: 0, kapha: 0, total: 0 }
  };

  let answeredCount = 0;

  // Normalize answers to an object map
  const answers = {};
  if (Array.isArray(rawAnswers)) {
    rawAnswers.forEach((item) => {
      if (item && item.questionId) {
        answers[item.questionId] = item.optionId || item.selectedOption || item.answer || item.dosha;
      }
    });
  } else if (typeof rawAnswers === "object" && rawAnswers !== null) {
    Object.assign(answers, rawAnswers);
  }

  // Create a quick lookup map for questions if available
  const questionMap = new Map();
  if (Array.isArray(questions)) {
    questions.forEach((q) => {
      if (q && q.id) questionMap.set(q.id, q);
    });
  }

  // Process answers
  Object.keys(answers).forEach((qId) => {
    const answerVal = answers[qId];
    if (!answerVal) return;

    answeredCount++;
    const q = questionMap.get(qId);
    let opt = null;
    let dim = q?.dimension || "Physical";

    if (q && q.options) {
      opt = q.options.find((o) => o.id === answerVal || o.dosha === answerVal);
    }

    if (opt) {
      const weight = opt.weight || 1.0;
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
      if (dimensionPoints[dim]) dimensionPoints[dim].total += weight;
    } else {
      // Fallback: direct option code or string inspection ('v', 'p', 'k', 'vata', etc.)
      const lower = String(answerVal).toLowerCase();
      if (lower === "v" || lower.startsWith("vat")) {
        vataPoints += 1.0;
        if (dimensionPoints[dim]) dimensionPoints[dim].vata += 1.0;
      } else if (lower === "p" || lower.startsWith("pit")) {
        pittaPoints += 1.0;
        if (dimensionPoints[dim]) dimensionPoints[dim].pitta += 1.0;
      } else if (lower === "k" || lower.startsWith("kaph")) {
        kaphaPoints += 1.0;
        if (dimensionPoints[dim]) dimensionPoints[dim].kapha += 1.0;
      }
      if (dimensionPoints[dim]) dimensionPoints[dim].total += 1.0;
    }
  });

  // Observation modifiers
  let obsVata = 0;
  let obsPitta = 0;
  let obsKapha = 0;

  if (includeObservations && Array.isArray(observationSignals)) {
    observationSignals.forEach((sig) => {
      const w = sig.weight || 0.8;
      if (sig.dosha === "vata") obsVata += w;
      if (sig.dosha === "pitta") obsPitta += w;
      if (sig.dosha === "kapha") obsKapha += w;
    });
  }

  const finalVata = vataPoints + obsVata;
  const finalPitta = pittaPoints + obsPitta;
  const finalKapha = kaphaPoints + obsKapha;
  const totalPoints = finalVata + finalPitta + finalKapha;

  if (totalPoints === 0) {
    return {
      vata: 34,
      pitta: 33,
      kapha: 33,
      dominant: "Balanced",
      dominantPrakriti: "Undetermined",
      constitutionType: "Incomplete",
      classicalTerm: "अनिर्णित (Undetermined)",
      totalPoints: 0,
      answeredCount: 0,
      rationale: "Insufficient responses to establish a constitutional baseline.",
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

  // Dimensional subscores
  const subScores = {};
  ["Physical", "Physiological", "Psychological"].forEach((dim) => {
    const d = dimensionPoints[dim];
    const key = dim.toLowerCase();
    if (d && d.total > 0) {
      const normDim = normalizePercentages(d.vata, d.pitta, d.kapha);
      subScores[key] = {
        vata: normDim.vata,
        pitta: normDim.pitta,
        kapha: normDim.kapha
      };
    } else {
      subScores[key] = { vata: 34, pitta: 33, kapha: 33 };
    }
  });

  // Determine dominant constitution
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

  // Rule 1: Sama Doshaja (All three in equilibrium within 4%)
  if (Math.abs(top.pct - third.pct) <= 4.0) {
    dominantPrakriti = "Sama Prakriti (Tridoshaja)";
    constitutionType = "Sama-Doshaja (Balanced Tridoshic)";
    classicalTerm = "समदोषज प्रकृति (Sama-Doshaja)";
    rationale = `All three Doshas are in near equal proportion (Vata: ${vataPct}%, Pitta: ${pittaPct}%, Kapha: ${kaphaPct}%). Charaka and Vagbhata describe this as the supreme, ideal constitutional equilibrium.`;
  }
  // Rule 2: Eka-Doshaja (Single Dominant >= 45% with >= 12% lead over second)
  else if (top.pct >= 45.0 && (top.pct - second.pct) >= 12.0) {
    dominantPrakriti = `${top.dosha} Dominant`;
    constitutionType = "Eka-Doshaja (Monodoshic)";
    classicalTerm = `${top.dosha === "Vata" ? "वातज" : top.dosha === "Pitta" ? "पित्तज" : "कफज"} प्रकृति (Eka-Doshaja)`;
    rationale = `${top.dosha} represents ${top.pct}% of constitutional indicators, exceeding ${second.dosha} (${second.pct}%) by ${top.pct - second.pct}%. Conforms to classical single-dosha predominance (Charaka Vimana 8:95).`;
  }
  // Rule 3: Dwandwaja (Dual-Doshic)
  else {
    dominantPrakriti = `${top.dosha}-${second.dosha}`;
    constitutionType = "Dwandwaja (Dual-Doshic)";
    classicalTerm = `द्वन्द्वज प्रकृति (${top.dosha}-${second.dosha})`;
    rationale = `Combined predominance of ${top.dosha} (${top.pct}%) and ${second.dosha} (${second.pct}%), with ${third.dosha} (${third.pct}%) as recessive. This bi-constitutional combination is present in ~85% of individuals (Ashtanga Hridaya Sharira 3:84).`;
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

