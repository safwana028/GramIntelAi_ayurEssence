/**
 * AyurEssence — Interactive Live Terminal Demo Mode
 * PS-01: SDM College of Ayurveda, Udupi & SMVITM Bantakal
 * 
 * Uses the exact same backend services, calculation engine,
 * and database models as the REST API.
 */

import readline from "readline";
import bcrypt from "bcryptjs";
import { db } from "../data/database.js";
import { calculatePrakritiScore } from "../services/prakritiService.js";
import { generateToken } from "../middleware/auth.js";

async function createReader() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: process.stdin.isTTY || false
  });

  const queue = [];
  let waiter = null;

  rl.on("line", (line) => {
    const trimmed = line.trim();
    if (waiter) {
      const resolve = waiter;
      waiter = null;
      resolve(trimmed);
    } else {
      queue.push(trimmed);
    }
  });

  function ask(promptText) {
    if (promptText) {
      process.stdout.write(promptText);
    }
    if (queue.length > 0) {
      const line = queue.shift();
      if (!process.stdin.isTTY) {
        process.stdout.write(line + "\n");
      }
      return Promise.resolve(line);
    }
    return new Promise((resolve) => {
      waiter = resolve;
    });
  }

  function close() {
    rl.close();
  }

  return { ask, close };
}

async function runInteractiveDemo() {
  const reader = await createReader();
  const ask = reader.ask;

  if (process.stdout.isTTY) {
    console.clear();
  }
  console.log("===============================================================");
  console.log("🌿 GRAMINTEL AI — AYURESSENCE INTERACTIVE LIVE DEMO");
  console.log("   SDM College of Ayurveda, Udupi & SMVITM Bantakal");
  console.log("===============================================================\n");
  console.log("Welcome to the interactive Ayurvedic Prakriti evaluation!");
  console.log("This live session directly executes the real backend database,");
  console.log("authentication, scoring algorithms, and report generation.\n");

  try {

    // -----------------------------------------------------------------
    // 1. Collect Patient / User Details
    // -----------------------------------------------------------------
    console.log("📝 Step 1: Patient / User Details");
    console.log("---------------------------------------------------------------");

    let name = await ask("Enter Patient / User Name [Default: Demo Candidate]: ");
    if (!name) name = "Demo Candidate";

    let ageInput = await ask("Enter Age [Default: 24]: ");
    let age = parseInt(ageInput, 10);
    while (ageInput && (isNaN(age) || age < 1 || age > 120)) {
      console.log("❌ Please enter a valid age between 1 and 120.");
      ageInput = await ask("Enter Age: ");
      age = parseInt(ageInput, 10);
    }
    if (!ageInput) age = 24;

    let email = await ask("Enter Email [Default: demo.candidate@sdm.edu]: ");
    while (email && (!email.includes("@") || !email.includes("."))) {
      console.log("❌ Please enter a valid email address.");
      email = await ask("Enter Email: ");
    }
    if (!email) email = `demo.${Date.now().toString().slice(-4)}@sdm.edu`;

    console.log("\nSelect Role:");
    console.log("1. Patient (Individual seeking assessment)");
    console.log("2. Student (BAMS Scholar conducting evaluation)");
    console.log("3. Doctor (Senior Ayurvedic Physician)");
    let roleChoice = await ask("Enter role choice (1-3) [Default: 1]: ");
    while (roleChoice && !["1", "2", "3"].includes(roleChoice)) {
      console.log("❌ Invalid choice. Please enter 1, 2, or 3.");
      roleChoice = await ask("Enter role choice (1-3): ");
    }
    const roleMap = { "1": "Patient", "2": "Student", "3": "Doctor" };
    const role = roleMap[roleChoice || "1"];

    console.log(`\n✓ User Profile Configured: ${name} (${age} yrs, Role: ${role})\n`);

    // -----------------------------------------------------------------
    // 2. Select Questionnaire Length
    // -----------------------------------------------------------------
    const allQuestions = db.getCollection("questions");
    console.log("📋 Step 2: Assessment Questionnaire");
    console.log("---------------------------------------------------------------");
    console.log("1. Quick Core Demo (6 key classical traits — Ideal for 2-min demo)");
    console.log("2. Comprehensive SDM Protocol (All 24 classical questions)");
    let modeChoice = await ask("Select assessment depth (1 or 2) [Default: 1]: ");
    while (modeChoice && !["1", "2"].includes(modeChoice)) {
      console.log("❌ Invalid choice. Please enter 1 or 2.");
      modeChoice = await ask("Select assessment depth (1 or 2): ");
    }

    const selectedQuestions =
      modeChoice === "2"
        ? allQuestions
        : allQuestions.filter((q) =>
            ["q1_frame", "q2_weight", "q3_skin", "q7_agni", "q12_nidra", "q20_temperament"].includes(q.id)
          );

    console.log(`\nStarting ${selectedQuestions.length} Ayurvedic Diagnostic Questions.\n`);

    // -----------------------------------------------------------------
    // 3. Ask Questions One by One with Validation
    // -----------------------------------------------------------------
    const answersMap = {};

    for (let i = 0; i < selectedQuestions.length; i++) {
      const q = selectedQuestions[i];
      const qTitle = typeof q.question === "object" ? q.question.en : q.question;
      const dim = q.dimension || q.category || "Trait";

      console.log(`---------------------------------------------------------------`);
      console.log(`Q${i + 1}. ${qTitle} [${dim}]`);
      if (q.sanskritTrait) {
        console.log(`    Classical Reference: ${q.sanskritTrait}`);
      }

      q.options.forEach((opt, optIndex) => {
        const optText = typeof opt.text === "object" ? opt.text.en : opt.text;
        console.log(`   ${optIndex + 1}. ${optText}`);
      });

      let choice = "";
      while (true) {
        choice = await ask(`\nEnter choice (1-${q.options.length}): `);
        const parsedIdx = parseInt(choice, 10) - 1;
        if (!isNaN(parsedIdx) && parsedIdx >= 0 && parsedIdx < q.options.length) {
          const selectedOption = q.options[parsedIdx];
          answersMap[q.id] = selectedOption.id;
          console.log(`   → Selected: Option ${choice} (${selectedOption.dosha.toUpperCase()})`);
          break;
        } else {
          console.log(`❌ Invalid choice "${choice}". Please enter a number between 1 and ${q.options.length}.`);
        }
      }
      console.log("");
    }

    // -----------------------------------------------------------------
    // 4. Process Through Real Backend Services
    // -----------------------------------------------------------------
    console.log("===============================================================");
    console.log("⚙️  EXECUTING BACKEND SERVICES & PRAKRITI PIPELINE");
    console.log("===============================================================\n");

    // A. User creation / retrieval & token generation (Same as /api/auth)
    let user = db.query("users", (u) => u.email.toLowerCase() === email.toLowerCase())[0];
    if (!user) {
      const passwordHash = bcrypt.hashSync("Demo@123", 10);
      user = {
        id: `USR-${role.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-6)}`,
        name,
        email: email.toLowerCase(),
        passwordHash,
        role,
        institution: "SDM College of Ayurveda & Hospital, Udupi",
        createdAt: new Date().toISOString()
      };
      db.insert("users", user);
    }
    const token = generateToken(user);

    // Patient record
    let patient = db.query("patients", (p) => p.email?.toLowerCase() === email.toLowerCase())[0];
    if (!patient) {
      patient = {
        id: `PAT-DEMO-${Date.now().toString().slice(-4)}`,
        name,
        age,
        email,
        city: "Udupi, Karnataka",
        registeredDate: new Date().toISOString().slice(0, 10),
        linkedAssessments: []
      };
      db.insert("patients", patient);
    }

    // B. Prakriti Calculation Engine (Same as /api/prakriti/calculate)
    const calculationResult = calculatePrakritiScore(answersMap, allQuestions, [], true);

    // C. Save Assessment to Database (Same as /api/assessments)
    const newAssessment = {
      id: `ASM-LIVE-${Date.now().toString().slice(-6)}`,
      userId: user.id,
      patientId: patient.id,
      patientEmail: email,
      questionnaireId: "sdm-udupi-standard-24",
      date: new Date().toISOString().slice(0, 10),
      status: "SUBMITTED",
      scores: calculationResult,
      prakritiResult: calculationResult,
      prakriti: {
        vata: calculationResult.vata,
        pitta: calculationResult.pitta,
        kapha: calculationResult.kapha,
        dominant: calculationResult.dominant
      },
      answers: answersMap,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.insert("assessments", newAssessment);

    // D. Retrieve Stored Assessment from Database
    const retrieved = db.findById("assessments", newAssessment.id);

    // -----------------------------------------------------------------
    // 5. Display Structured Report
    // -----------------------------------------------------------------
    console.log("===============================================================");
    console.log(`📋 AYURESSENCE CONSTITUTIONAL REPORT (ID: ${retrieved.id})`);
    console.log("===============================================================");
    console.log(`Patient Name:       ${name}`);
    console.log(`Age / Role:         ${age} years | ${role}`);
    console.log(`Assessment Date:    ${retrieved.date}`);
    console.log(`Assessment Status:  ${retrieved.status}`);
    console.log("---------------------------------------------------------------");
    console.log("📊 CALCULATED PRAKRITI BREAKDOWN:");
    console.log(`Vata:               ${retrieved.prakriti.vata}%`);
    console.log(`Pitta:              ${retrieved.prakriti.pitta}%`);
    console.log(`Kapha:              ${retrieved.prakriti.kapha}%`);
    console.log(`Total:              ${retrieved.prakriti.vata + retrieved.prakriti.pitta + retrieved.prakriti.kapha}%`);
    console.log(`Dominant Prakriti:  ${retrieved.scores.dominantPrakriti || retrieved.prakriti.dominant}`);
    console.log(`Constitution Type:  ${retrieved.scores.constitutionType}`);
    console.log(`Classical Term:     ${retrieved.scores.classicalTerm}`);
    console.log("---------------------------------------------------------------");
    console.log("🌿 CLASSICAL SAMHITA RATIONALE:");
    console.log(retrieved.scores.rationale);
    console.log("---------------------------------------------------------------");
    console.log("💡 PERSONALIZED LIFESTYLE (DINACHARYA) GUIDANCE:");
    const dom = (retrieved.scores.dominantPrakriti || retrieved.prakriti.dominant).toLowerCase();
    if (dom.includes("vata")) {
      console.log(" • Favor warm, freshly prepared, grounding meals with healthy fats (ghee, sesame oil).");
      console.log(" • Daily warm oil massage (Abhyanga) helps protect joints and soothe nervous agility.");
      console.log(" • Maintain a regular daily sleep schedule to counter restlessness.");
    }
    if (dom.includes("pitta")) {
      console.log(" • Favor naturally cooling foods (fennel, sweet fruits, coconut water, leafy greens).");
      console.log(" • Avoid excessive midday sun, intense heat, and overly spicy or acidic food.");
      console.log(" • Cultivate cooling mental practices like Sheetali Pranayama.");
    }
    if (dom.includes("kapha")) {
      console.log(" • Wake up before sunrise and participate in brisk physical exercise.");
      console.log(" • Favor warm, light foods with stimulating spices (ginger, black pepper, turmeric).");
      console.log(" • Avoid cold dairy, heavy sweets, and daytime naps.");
    }
    console.log("===============================================================\n");

    // Exact required confirmation checkmarks
    console.log("✓ User created/authenticated");
    console.log("✓ Assessment processed");
    console.log("✓ Prakriti calculated");
    console.log("✓ Assessment saved to database");
    console.log("✓ Report generated\n");

    console.log("JWT Token Issued: " + token.slice(0, 32) + "...\n");
  } catch (err) {
    console.error("❌ Demo encountered an error:", err);
  } finally {
    reader.close();
    process.exit(0);
  }
}


runInteractiveDemo();
