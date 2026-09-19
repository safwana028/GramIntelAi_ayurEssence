/**
 * Classical Ayurvedic Prakriti Calculation Engine
 * Designed according to SDM College of Ayurveda, Udupi clinical methodology
 * References: Charaka Vimana 8, Sushruta Sharira 4, Ashtanga Hridaya Sharira 3
 */

/**
 * Calculates raw points, percentages, subdimensional scores, and constitutional classification.
 * @param {Object} answers - Map of questionId -> optionId ('v', 'p', 'k')
 * @param {Array} questions - Active questions array
 * @param {Array} observationIndicators - Array of { term, dosha, weight } from practitioner notes
 * @param {boolean} includeObservations - Whether observation indicators adjust scores
 */
export function calculatePrakriti(answers, questions, observationIndicators = [], includeObservations = true) {
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
    const selectedOptionId = answers[q.id];
    if (!selectedOptionId) return;

    const opt = q.options.find((o) => o.id === selectedOptionId);
    if (!opt) return;

    answeredCount++;
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
      vata: 33.3,
      pitta: 33.3,
      kapha: 33.3,
      totalPoints: 0,
      answeredCount: 0,
      dominantPrakriti: "Incomplete Assessment",
      constitutionType: "Undetermined",
      explanation: "No responses recorded yet.",
      subScores: {
        physical: { vata: 33.3, pitta: 33.3, kapha: 33.3 },
        physiological: { vata: 33.3, pitta: 33.3, kapha: 33.3 },
        psychological: { vata: 33.3, pitta: 33.3, kapha: 33.3 }
      }
    };
  }

  // Calculate percentage distribution
  const vataPct = Number(((finalVata / totalPoints) * 100).toFixed(1));
  const pittaPct = Number(((finalPitta / totalPoints) * 100).toFixed(1));
  const kaphaPct = Number(((finalKapha / totalPoints) * 100).toFixed(1));

  // Compute sub-dimensional percentages
  const subScores = {};
  ["Physical", "Physiological", "Psychological"].forEach((dim) => {
    const d = dimensionPoints[dim];
    const key = dim.toLowerCase();
    if (d.total > 0) {
      subScores[key] = {
        vata: Number(((d.vata / d.total) * 100).toFixed(1)),
        pitta: Number(((d.pitta / d.total) * 100).toFixed(1)),
        kapha: Number(((d.kapha / d.total) * 100).toFixed(1))
      };
    } else {
      subScores[key] = { vata: 33.3, pitta: 33.3, kapha: 33.3 };
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
    rationale = `All three Doshas are in near equal proportion (Vata: ${vataPct}%, Pitta: ${pittaPct}%, Kapha: ${kaphaPct}%). Charaka and Vagbhata describe this as the supreme, ideal, yet rarest constitutional state.`;
  }
  // Check 2: Eka-Doshaja (Single Dominant: >= 48% and >= 15% lead over second)
  else if (top.pct >= 48.0 && (top.pct - second.pct) >= 15.0) {
    dominantPrakriti = `${top.dosha} Dominant`;
    constitutionType = "Eka-Doshaja (Monodoshic)";
    classicalTerm = `${top.dosha === "Vata" ? "वातज" : top.dosha === "Pitta" ? "पित्तज" : "कफज"} प्रकृति (Eka-Doshaja)`;
    rationale = `${top.dosha} represents ${top.pct}% of constitutional indicators, distinctly surpassing ${second.dosha} (${second.pct}%) by ${Number((top.pct - second.pct).toFixed(1))}%. Conforms to classical single-dosha predominance.`;
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
    totalPoints: Number(totalPoints.toFixed(1)),
    answeredCount,
    dominantPrakriti,
    constitutionType,
    classicalTerm,
    rationale,
    subScores
  };
}
