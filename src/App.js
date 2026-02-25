/* eslint-disable */
import React, { useState, useCallback, useEffect } from "react";
import { db } from "./firebase";
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";


const DARK = {
  bg: "#0b0b14", card: "#141422", cardAlt: "#1a1a2e",
  border: "#2e2e48", borderHi: "#4a4a70",
  textPrimary: "#eae8e0", textSecondary: "#8a8a9a", textMuted: "#5a5a6a",
  accent: "#c2955a", accentDim: "#c2955a33",
  red: "#dc2626", green: "#16a34a", blue: "#3b82f6",
};
const LIGHT = {
  bg: "#f0ede8", card: "#ffffff", cardAlt: "#f5f2ee",
  border: "#d6cfc6", borderHi: "#b8ae9e",
  textPrimary: "#1a1610", textSecondary: "#5a5248", textMuted: "#6b6560",
  accent: "#8a5a18", accentDim: "#8a5a1822",
  red: "#991b1b", green: "#14532d", blue: "#1d4ed8",
};
let S = { ...DARK };

const SUSPECT_COLORS = ["#2563eb", "#059669", "#d97706", "#8b5cf6"];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const CASES = [
{
  id: "ashworth", title: "The Ashworth Affair", caseNumber: "#2025-0118",
  subtitle: "A mysterious poisoning. A locked study. Three deadly sources.",
  coverIcon: "🏚️", difficulty: "Intermediate",
  victim: { name: "Lord Edmund Ashworth", summary: "Found dead in his locked study at 6:14 AM on Saturday 18 January 2025 by his housekeeper. The door was sealed from the inside. No signs of forced entry. A half-eaten dinner plate and an open bottle of wine were on the study desk. Cause of death: pending toxicology — but the medical examiner noted signs consistent with both acute poisoning and oxygen deprivation." },
  suspects: [
    { id: "victoria", name: "Lady Victoria Ashworth", title: "The Wife", portrait: "👩‍🦰", color: "#e11d48", guilty: true, connection: "Runs copper jewelry business; regularly orders copper(II) compounds for creating blue-green patina finishes and metal treatments. Highly soluble copper salts create distinctive blue-green solutions. Alone in kitchen Friday evening; full access to all three scenes.", motive: "Edmund discovered Victoria's affair with the estate accountant—threatened divorce exposing her publicly and cutting her off financially.", alibi: "Claims she read in bedroom all evening. No witnesses after 9 PM—movements completely unverified." },
    { id: "marsh", name: "Dr Henry Marsh", title: "The Family Doctor", portrait: "👨‍⚕️", color: "#2563eb", guilty: false, connection: "Medical practice stocks zinc sulfate for eye drops, magnesium hydroxide for antacids, and aluminum hydroxide for stomach treatments. Brief kitchen visit at 4 PM raises questions despite solid dinner alibi.", motive: "Edmund threatened to expose Marsh's fraudulent prescriptions—years of medical fraud covering malpractice.", alibi: "Dinner party 7 PM-midnight with 12 witnesses. However, stepped outside at 10:30 PM for 'phone call' he initially concealed from police." },
    { id: "rossi", name: "Chef Elena Rossi", title: "The Cook", portrait: "👩‍🍳", color: "#d97706", guilty: false, connection: "Kitchen uses calcium carbonate for baking, aluminum foil, and iron-fortified flour. Her Saturday return remains unexplained despite solid taxi alibi.", motive: "Edmund discovered Rossi skimming £20,000+ from household budget over three years—threatened criminal charges.", alibi: "Left estate 5 PM, taxi confirms 5:40 PM departure. However, returned Saturday morning before police arrived to 'collect knife roll'—why the rush?" },
    { id: "cole", name: "James Cole", title: "The Groundskeeper", portrait: "👨‍🌾", color: "#16a34a", guilty: false, connection: "Manages estate grounds using iron(II) sulfate for moss control and lawn treatment, potassium carbonate as fertilizer, and magnesium sulfate (Epsom salts) for plant health. Has well access but cannot explain how he'd access kitchen or study undetected.", motive: "Dismissed after 12 years with no severance—publicly threatened 'Edmund will get exactly what he deserves.'", alibi: "Claims he stayed in cottage all evening. No witnesses. Cottage is 200m from main house—close enough to hear or approach undetected." },
  ],
  stations: [
    {
      id: "kitchen", title: "The Kitchen", icon: "🍽️",
      locationDesc: "The large estate kitchen. A dinner plate with the remains of a lamb stew sits on the counter — this is the last meal Lord Ashworth ate.",
      policeReport: "SCENE REPORT — KITCHEN\n─────────────────────────\nOfficer Wren, 18 Jan, 09:20\n\nThe kitchen has been sealed since discovery. On the main counter sits a ceramic plate bearing the remains of a lamb stew — this is confirmed as Lord Ashworth's final meal, prepared Friday evening.\n\nVictoria Ashworth states she made the stew herself after dismissing Chef Rossi at 5 PM. A forensic technician has scraped a residue sample from the plate into a labelled vial (SAMPLE A).\n\nPreliminary note: the stew had an unusual green tint. Lord Ashworth reportedly complained of a \"metallic taste\" to his wife, who dismissed it as the wine.\n\nACTION REQUIRED: Analyse SAMPLE A for the presence of toxic ions.",
      objects: [{ id: "vial_a", label: "Vial — SAMPLE A", icon: "🧫", pickup: true }, { id: "bunsen_burner", label: "Bunsen Burner", icon: "🔥", pickup: false }],
      reagents: ["NaOH solution", "Aqueous NH₃"],
      reactions: {
        "NaOH solution": { first: { text: "You add a few drops of NaOH solution to the vial. A LIGHT BLUE precipitate forms immediately.", visual: { type: "ppt", color: "#7dd3fc" } }, excess: { text: "You add excess NaOH solution. The light blue precipitate does NOT dissolve — it remains as a solid.", visual: { type: "ppt", color: "#7dd3fc" } } },
        "Aqueous NH₃": { first: { text: "You add a few drops of aqueous ammonia. A LIGHT BLUE precipitate forms.", visual: { type: "ppt", color: "#7dd3fc" } }, excess: { text: "You add excess ammonia. The light blue precipitate DISSOLVES and the solution turns DARK BLUE.", visual: { type: "solution", color: "#1e3a8a" } } },
      },
      heating: { requiresReagent: ["NaOH solution", "Aqueous NH₃"], result: { textWithPrecipitate: "You gently warm the mixture over the Bunsen burner. The light blue precipitate remains unchanged—heating has no additional effect.", textWithoutPrecipitate: "You gently warm the mixture over the Bunsen burner. The dark blue solution remains unchanged—heating has no additional effect.", visual: { type: "heating", bubbles: false } } },
      answer: { accepted: ["Cu2+","Cu²+","copper(II)","Copper(II)","copper(Ⅱ)","Copper(Ⅱ)"], partialCredit: ["Cu+2","Cu 2+","copper II","copper 2+","copper","copper(ii)","copper(iI)","copper(Ii)"] },
      promptLabel: "What is the name or formula of the cation found in the sample?",
      placeholder: "name with (II)/(III) or formula like Fe3+",
      hints: ["Focus on the key difference between adding NaOH and adding NH₃ in excess. What happens differently to the precipitate?", "The ion you are looking for produces a light blue precipitate. Think about which common metal ions do this — and check whether the precipitate dissolves or stays when you add more reagent.", "The answer is copper — specifically, the copper(Ⅱ) ion, Cu²⁺. It forms a light blue precipitate with both NaOH and NH₃, but only dissolves in excess NH₃ to give a dark blue solution."],
      solvedMessage: "Cu²⁺ confirmed in the food. Copper(II) ions are highly toxic — this stew was deliberately poisoned.",
      evidence: { label: "Cu²⁺ in food", detail: "Copper(II) ions found in the stew. Copper compounds are used in metal etching, creating patina finishes on jewelry, and in textile dyeing.", icon: "☠️" },
    },
    {
      id: "wellhouse", title: "The Well House", icon: "💧",
      locationDesc: "A small stone building at the edge of the grounds housing the estate's private water well. The water here supplies the kitchen and bathrooms.",
      policeReport: "SCENE REPORT — WELL HOUSE\n─────────────────────────\nOfficer Wren, 18 Jan, 11:05\n\nThe well house was inspected as part of the wider search. Groundskeeper Cole had noted the water had a faint blue-green tint several days prior but made no report.\n\nA water sample has been drawn from the well and labelled SAMPLE B. The water shows a slight blue-green coloration—consistent with dissolved copper(II) compounds.\n\nContext: Edmund Ashworth had been suffering from recurring stomach pains for the past two weeks — initially attributed to a stomach bug. The blue-green water suggests copper contamination, but the specific anion present needs to be identified.\n\nACTION REQUIRED: Analyse SAMPLE B for anion contamination.",
      objects: [{ id: "vial_b", label: "Vial — SAMPLE B", icon: "🧪", pickup: true }, { id: "bunsen_burner", label: "Bunsen Burner", icon: "🔥", pickup: false }, { id: "litmus_red_no3", label: "Damp Red Litmus Paper", icon: "🔴", pickup: true }, { id: "litmus_blue_no3", label: "Damp Blue Litmus Paper", icon: "🔵", pickup: true }],
      reagents: ["NaOH solution", "Aluminium foil", "Dilute HNO₃", "AgNO₃ solution", "Ba(NO₃)₂ solution", "Dilute HCl", "Limewater"],
      reactions: {
        "Dilute HNO₃": { first: { text: "You add dilute nitric acid to the sample. No fizzing or bubbling occurs — the solution stays clear with its blue-green tint.", visual: null } },
        "Dilute HCl": { first: { text: "You add dilute hydrochloric acid to the sample. No fizzing or bubbling occurs — the solution stays clear. No reaction observed.", visual: null } },
        "Limewater": { first: { text: "You add limewater to the sample. Nothing happens — no precipitate forms.", visual: null } },
        "NaOH solution": { first: { text: "You add NaOH solution to the water sample. The blue-green solution stays clear — no precipitate forms.", visual: null } },
        "Aluminium foil": { first_without_naoh: { text: "You add aluminium foil, but nothing happens. You need to add NaOH solution first to create an alkaline environment for the reaction.", visual: null, warning: true }, first_with_naoh: { text: "You add small pieces of aluminium foil to the NaOH solution. The aluminium begins to react slowly, producing tiny bubbles. Now heat the mixture with the Bunsen burner to speed up the reaction.", visual: { type: "bubbling", bubbles: true } } },
        "AgNO₃ solution": { first: { text: "You add AgNO₃ solution. No precipitate forms — the solution stays clear.", visual: null } },
        "Ba(NO₃)₂ solution": { first: { text: "You add Ba(NO₃)₂ solution. No precipitate forms — the solution stays clear.", visual: null } },
      },
      heating: { requiresReagent: "Aluminium foil", result: { text: "You heat the mixture over the Bunsen burner. The reaction speeds up dramatically—bubbles form vigorously as the aluminium dissolves. A PUNGENT gas is released.", visual: { type: "heating", bubbles: true }, gasTest: "litmus_red_no3" } },
      answer: { accepted: ["NO3-","NO₃⁻","nitrate","nitrate ion"] },
      promptLabel: "What is the name or formula of the anion found in the water?",
      placeholder: "anion name or formula like Cl-",
      hints: ["Look at which tests gave you a reaction. Which reagents produced visible changes? Pay attention to the heating step — what was released?", "When you heated the mixture with aluminium in alkaline conditions, a pungent gas was released. What colour did the red litmus paper turn? What does this tell you about the gas?", "The answer is nitrate — the nitrate ion, NO₃⁻. The test: NO₃⁻ + Al + NaOH + heat → NH₃ (gas). Ammonia turns red litmus blue."],
      solvedMessage: "NO₃⁻ confirmed in the well water. Combined with Cu²⁺ found in the food, this indicates contamination from a copper and nitrate compound.",
      evidence: { label: "NO₃⁻ in well water", detail: "Nitrate ions at toxic concentrations. Combined with Cu²⁺ from the food, indicates a soluble copper salt.", icon: "💧" },
    },
    {
      id: "study", title: "The Study", icon: "📖",
      locationDesc: "Lord Ashworth's private study. The door was found locked from the inside. A window was sealed with tape from the inside. The air feels unusually heavy.",
      policeReport: "SCENE REPORT — STUDY\n─────────────────────────\nOfficer Wren, 18 Jan, 10:15\n\nThe study door was found locked from the inside this morning. The housekeeper used a spare key. Upon entry, she noticed the room felt \"stuffy and strange\" and opened a window immediately.\n\nCrucially: the single window in the study was sealed with strong adhesive tape from the INSIDE. This is highly unusual and suggests a deliberate effort to make the room airtight.\n\nA portable CO detector found no carbon monoxide. However, a sealed room with an airtight window and a heavy atmosphere raises concern about a different gas. A small canister was found behind a bookshelf — its label has been removed.\n\nThe medical examiner's preliminary notes mention signs of oxygen deprivation consistent with breathing a gas that displaces O₂ but is itself odourless.\n\nACTION REQUIRED: Test the residual gas from the canister to confirm its identity.",
      objects: [{ id: "canister", label: "Sealed Canister", icon: "🛢️", pickup: true }, { id: "litmus_red", label: "Damp Red Litmus Paper", icon: "🔴", pickup: true }, { id: "litmus_blue", label: "Damp Blue Litmus Paper", icon: "🔵", pickup: true }, { id: "limewater_tube", label: "Test Tube of Limewater", icon: "🥛", pickup: true }, { id: "splint_burning", label: "Burning Splint", icon: "🕯️", pickup: true }, { id: "splint_glowing", label: "Glowing Splint", icon: "✨", pickup: true }, { id: "kmno4_paper", label: "Acidified KMnO₄ Paper", icon: "🟣", pickup: true }],
      reagents: [], reactions: {},
      gasTests: {
        "litmus_red": { text: "You hold damp red litmus paper near the escaping gas. … Nothing happens. The paper stays red.", visual: null },
        "litmus_blue": { text: "You hold damp blue litmus paper near the gas. … Nothing obvious happens. The paper stays blue.", visual: null },
        "limewater_tube": { text: "You hold the test tube of limewater up to the gas stream. A white precipitate forms IN the limewater. On further bubbling, the precipitate dissolves as the solution turns colourless again!", visual: { type: "solution", color: "#d1d5db" } },
        "splint_burning": { text: "You hold a burning splint to the gas. The flame is EXTINGUISHED immediately — no 'pop' sound is heard.", visual: null },
        "splint_glowing": { text: "You hold a glowing splint in the gas. … It does NOT relight.", visual: null },
        "kmno4_paper": { text: "You hold acidified KMnO₄ paper near the gas. The purple colour does NOT change.", visual: null },
      },
      answer: { accepted: ["CO2","CO₂","carbon dioxide","carbondioxide","carbon dioxide gas"] },
      promptLabel: "What is the name or formula of the gas in the canister?",
      placeholder: "gas name or formula like H2",
      hints: ["Think about which of your tests produced a visible change, and which did not. The one test that DID produce a change is your strongest clue — what did it show?", "The gas causes limewater to form a white precipitate. On further bubbling, the precipitate dissolves. Think about which common gas reacts with limewater this way.", "The answer is carbon dioxide — CO₂. It reacts with limewater (calcium hydroxide) to form calcium carbonate (white precipitate), which then dissolves with excess CO₂ to form soluble calcium hydrogencarbonate."],
      solvedMessage: "CO₂ confirmed. The canister was used to flood the sealed study with carbon dioxide — displacing oxygen and causing asphyxiation.",
      evidence: { label: "CO₂ canister in study", detail: "A pressurised CO₂ canister was hidden behind the bookshelf. The study window was deliberately sealed to make the room airtight. CO₂ displaced the oxygen, causing Lord Ashworth's death.", icon: "🛢️" },
    },
  ],
  accusationGuide: "You found Cu²⁺ in the food. You found NO₃⁻ in the well water. You found CO₂ in the sealed study. Connect the chemistry findings to the suspects' backgrounds, alibis, and access to all three crime scenes.",
  guilty: "Lady Victoria Ashworth is guilty.\n\nEVIDENCE: Cu²⁺ in food, NO₃⁻ in well water—both from copper(II) nitrate. CO₂ in sealed study from dry ice.\n\nMOTIVE: Edmund discovered Victoria's affair and threatened divorce, exposing her publicly and cutting her off financially.\n\nOPPORTUNITY: Alone in kitchen Friday evening. Complete access to all three crime scenes. Movements unverified after 9 PM.\n\nCONNECTION: Runs copper jewelry business—orders copper(II) nitrate for patina finishes. Blue-green well water matches dissolved copper(II) nitrate. Edmund's chronic stomach pains align with long-term exposure through contaminated well water.",
  debrief: [
    { scenario: "Food poisoning (Kitchen)", ion: "Cu²⁺", realWorld: "Heavy metal contamination in food is a genuine public health and criminal concern. Copper(II) ions are toxic — chronic exposure causes liver damage.", tests: [{ reagent: "NaOH (few drops)", result: "Light blue precipitate forms" }, { reagent: "NaOH (excess)", result: "Precipitate does NOT dissolve" }, { reagent: "Aqueous NH₃ (few drops)", result: "Light blue precipitate forms" }, { reagent: "Aqueous NH₃ (excess)", result: "Precipitate DISSOLVES → dark blue solution" }] },
    { scenario: "Water contamination (Well House)", ion: "NO₃⁻", realWorld: "Nitrate contamination of groundwater is a serious environmental and health concern. Copper(II) nitrate is highly soluble and creates blue-green solutions. The aluminium reduction test is the standard O-Level test for nitrate.", tests: [{ reagent: "NaOH solution (first)", result: "Add sodium hydroxide — creates alkaline environment" }, { reagent: "Aluminium foil", result: "Add small pieces — slow reaction, bubbles form" }, { reagent: "Heat with Bunsen burner", result: "Reaction speeds up — pungent NH₃ gas released" }, { reagent: "Damp red litmus", result: "Turns BLUE — confirms ammonia (NO₃⁻ reduced to NH₃)" }, { reagent: "Connection", result: "Cu²⁺ in food + NO₃⁻ in water = both from copper(II) nitrate" }] },
    { scenario: "Sealed room gas (Study)", ion: "CO₂", realWorld: "CO₂ asphyxiation in sealed spaces is a documented cause of death — in submarines, wine cellars, and homes with faulty heating.", tests: [{ reagent: "Limewater", result: "White precipitate forms (CaCO₃)" }, { reagent: "Burning splint", result: "Flame extinguished (does NOT pop)" }, { reagent: "Glowing splint", result: "Does not relight" }, { reagent: "Damp litmus paper", result: "No colour change" }] },
  ],
},
{
  id: "blackwood", title: "The Blackwood Inheritance", caseNumber: "#2025-0203",
  subtitle: "A fatal inheritance. Three contaminated sources. One deadly element.",
  coverIcon: "🏰", difficulty: "Challenging",
  victim: { name: "Mr Oliver Blackwood", summary: "Found dead in his conservatory at 7:02 AM on Sunday 2 February 2025 by his housekeeper, Mrs Hale. He was slumped in his favourite armchair. A cup of herbal tea — his nightly ritual — sat cold on the side table. An open bottle of Bordeaux wine was beside it. The conservatory windows were all shut. Cause of death: pending — but initial signs suggest respiratory distress combined with acute poisoning." },
  suspects: [
    { id: "harrow", name: "Mr Geoffrey Harrow", title: "The Business Partner", portrait: "👨‍💼", color: "#2563eb", guilty: false, connection: "Runs a wine import business and was alone in Oliver's cellar cataloguing bottles on Saturday afternoon. Has extensive knowledge of wine chemistry and storage. Uses copper(II) sulfate for wine fining and clarification. Also uses sulfur dioxide as a preservative—common practice in the wine industry.", motive: "Oliver owed him £200,000+ from a failed business venture—the debt would settle from the estate if Oliver died before a Monday court deadline.", alibi: "Hotel check-in 6 PM confirmed—but left 9 PM to midnight 'to drive around and clear his head.' 3-hour gap completely unexplained; no CCTV coverage." },
    { id: "margaret", name: "Lady Margaret Blackwood", title: "The Sister", portrait: "👩‍🦰", color: "#e11d48", guilty: true, connection: "Purchased 5kg zinc sulfate powder three weeks ago claiming 'garden supplement use.' Also stores sulfur candles in her garden shed—used routinely for fumigating her greenhouse. Chemistry background from university. Visited estate Friday evening with unsupervised access to the greenhouse, cellar, and conservatory.", motive: "Secretly owes £2M in gambling debts. Oliver controlled the family trust as trustee and refused her desperate requests for emergency funds. His death would dissolve the trust and release her full inheritance immediately.", alibi: "Claims she left the estate at 8 PM Friday. However, a neighbour spotted her car parked near the estate gates at 10:30 PM. A critical 2-hour gap is completely unaccounted for." },
    { id: "hale", name: "Mrs Dorothy Hale", title: "The Housekeeper", portrait: "👩‍🏫", color: "#d97706", guilty: false, connection: "Prepared Oliver's nightly herbal tea for years and holds master keys to all rooms including the cellar and conservatory. Orders household chemicals for estate maintenance regularly—including sodium carbonate for cleaning, iron(III) chloride for treating garden paths, and calcium hydroxide for neutralizing acidic soil.", motive: "Oliver planned to dismiss her after 20 years of service with no pension—she overheard an HR call on Thursday and had not spoken to him since.", alibi: "Claims she was cleaning all evening and retired at 10 PM. A neighbour reported hearing raised voices from the manor at 10 PM—no one has confirmed who was present." },
  ],
  stations: [
    {
      id: "greenhouse", title: "The Greenhouse", icon: "🌿",
      locationDesc: "A large Victorian greenhouse attached to the manor. Rows of exotic plants line the glass walls. On a workbench sits a cold cup of herbal tea — a sample has been poured into a vial by the forensics team.",
      policeReport: "SCENE REPORT — GREENHOUSE\n─────────────────────────\nOfficer Wren, 02 Feb, 08:45\n\nThe greenhouse was searched this morning. Oliver Blackwood's nightly herbal tea was prepared here using dried herbs from the greenhouse stores. A residue sample has been collected from the tea cup and placed in Vial C.\n\nOliver's physician noted that Mr Blackwood had been experiencing intermittent nausea and fatigue for approximately two weeks prior to his death — symptoms initially attributed to seasonal illness.\n\nThe herbal blend used is a proprietary mix stored in an unlabelled jar on the top shelf.\n\nACTION REQUIRED: Analyse SAMPLE C for the presence of toxic ions.",
      objects: [{ id: "vial_c", label: "Vial — SAMPLE C", icon: "🧫", pickup: true }, { id: "bunsen_burner", label: "Bunsen Burner", icon: "🔥", pickup: false }],
      reagents: ["NaOH solution", "Aqueous NH₃"],
      reactions: {
        "NaOH solution": { first: { text: "You add a few drops of NaOH solution. A WHITE precipitate forms immediately.", visual: { type: "ppt", color: "#e2e8f0" } }, excess: { text: "You add excess NaOH solution. The white precipitate dissolves completely — the solution turns colourless.", visual: { type: "solution", color: "transparent" } } },
        "Aqueous NH₃": { first: { text: "You add a few drops of aqueous ammonia. A WHITE precipitate forms.", visual: { type: "ppt", color: "#e2e8f0" } }, excess: { text: "You add excess ammonia. The white precipitate DISSOLVES and the solution turns colourless.", visual: { type: "solution", color: "transparent" } } },
      },
      heating: { requiresReagent: ["NaOH solution", "Aqueous NH₃"], result: { textWithPrecipitate: "You gently warm the mixture over the Bunsen burner. No change—heating has no effect on the white precipitate.", textWithoutPrecipitate: "You gently warm the mixture over the Bunsen burner. No change—heating has no effect on the colourless solution.", visual: { type: "heating", bubbles: false } } },
      answer: { accepted: ["Zn2+","Zn²+","zinc","Zinc","ZINC"] },
      promptLabel: "What is the name or formula of the cation found in the sample?",
      placeholder: "name or formula like Ca2+",
      hints: ["Compare what happens when you add excess NaOH versus excess NH₃. In both cases, does the precipitate dissolve or remain? What does that tell you?", "The precipitate dissolves in excess of BOTH NaOH and NH₃. Think about which common metal ions produce a white precipitate that behaves this way with both reagents.", "The answer is zinc — specifically, the zinc(Ⅱ) ion, Zn²⁺. Zinc hydroxide is amphoteric and dissolves in both excess NaOH and excess NH₃."],
      solvedMessage: "Zn²⁺ confirmed in the tea. Zinc ions at this concentration are acutely toxic — the herbal tea was deliberately contaminated.",
      evidence: { label: "Zn²⁺ in tea", detail: "Zinc ions found in the herbal tea. Soluble zinc salts are toxic at high concentrations.", icon: "☠️" },
    },
    {
      id: "cellar", title: "The Wine Cellar", icon: "🍷",
      locationDesc: "A stone cellar beneath the manor. Rows of bottles line the walls. An opened bottle of Bordeaux wine was found beside Oliver's chair. A sample has been collected into a vial.",
      policeReport: "SCENE REPORT — WINE CELLAR\n─────────────────────────\nOfficer Wren, 02 Feb, 09:30\n\nThe wine cellar was searched as part of the investigation. An opened bottle of 2019 Bordeaux was found beside Oliver's body. The wine appears darker than normal.\n\nThe cellar records show this bottle was added to the rack last Thursday—the same day Oliver confronted Mrs Hale about her employment. The handwriting on the cellar log for that entry does not match Oliver's usual script.\n\nACTION REQUIRED: Analyse SAMPLE D for anion contamination.",
      objects: [{ id: "vial_d", label: "Vial — SAMPLE D", icon: "🧪", pickup: true }, { id: "bunsen_burner", label: "Bunsen Burner", icon: "🔥", pickup: false }, { id: "litmus_red_cellar", label: "Damp Red Litmus Paper", icon: "🔴", pickup: true }, { id: "litmus_blue_cellar", label: "Damp Blue Litmus Paper", icon: "🔵", pickup: true }],
      reagents: ["NaOH solution", "Aluminium foil", "Dilute HNO₃", "Ba(NO₃)₂ solution", "AgNO₃ solution", "Dilute HCl", "Limewater"],
      reactions: {
        "NaOH solution": { first: { text: "You add NaOH solution to the wine sample. The solution stays clear — no precipitate forms.", visual: null } },
        "Aluminium foil": { first_without_naoh: { text: "You add aluminium foil, but nothing happens. Add NaOH solution first if you intend to test for nitrate.", visual: null, warning: true }, first_with_naoh: { text: "You add aluminium foil to the alkaline solution. The aluminium reacts very slowly at room temperature. You could heat the mixture to see if any gas is released.", visual: null } },
        "Dilute HNO₃": { first: { text: "You add dilute nitric acid to the wine sample. No fizzing or bubbling occurs — the solution stays clear.", visual: null } },
        "Dilute HCl": { first: { text: "You add dilute hydrochloric acid to the wine sample. No fizzing or bubbling occurs — the solution stays clear. No reaction observed.", visual: null } },
        "Limewater": { first: { text: "You add limewater to the sample. Nothing happens — no precipitate forms.", visual: null } },
        "Ba(NO₃)₂ solution": { first_without_acid: { text: "You add Ba(NO₃)₂ directly without acidifying first. A white precipitate forms—but you cannot be sure this isn't from carbonate ions. You should acidify with dilute HNO₃ first to get a reliable result.", visual: { type: "ppt", color: "#e5e7eb" }, warning: true }, first_with_acid: { text: "You add Ba(NO₃)₂ solution to the acidified sample. A WHITE precipitate forms immediately and does NOT dissolve in the acid.", visual: { type: "ppt", color: "#e5e7eb" } } },
        "AgNO₃ solution": { first: { text: "You add AgNO₃ solution. No precipitate forms — the solution stays clear.", visual: null } },
      },
      heating: { requiresReagent: "Aluminium foil", result: { text: "You heat the alkaline mixture with aluminium foil over the Bunsen burner. No pungent gas is produced.", visual: null } },
      answer: { accepted: ["SO4 2-","SO₄²⁻","SO42-","SO4^2-","sulfate","Sulfate","SULFATE","sulfate ion","Sulfate ion","sulphate","Sulphate","SULPHATE","sulphate ion","Sulphate ion"] },
      promptLabel: "What is the name or formula of the anion found in the wine?",
      placeholder: "anion name or formula like NO3-",
      hints: ["Start systematically — try NaOH with aluminium foil and heat. Does the mixture produce any pungent gas? Then try acidifying with dilute HNO₃ before adding Ba(NO₃)₂.", "No gas from the NaOH + Al + heat test rules out nitrate. You are looking for an anion that forms a white precipitate with Ba²⁺ ions that does NOT dissolve in dilute nitric acid.", "The answer is sulfate — the sulfate ion, SO₄²⁻. Barium sulfate (BaSO₄) is a white precipitate that is insoluble in dilute nitric acid."],
      solvedMessage: "SO₄²⁻ confirmed at toxic levels in the wine. Sulfate contamination of this nature indicates deliberate tampering with a sulfate salt.",
      evidence: { label: "SO₄²⁻ in wine", detail: "Sulfate ions at abnormal concentrations. Combined with Zn²⁺ from the tea, indicates a soluble zinc salt.", icon: "🍷" },
    },
    {
      id: "conservatory", title: "The Conservatory", icon: "🌸",
      locationDesc: "The glass-walled conservatory where Oliver was found. The air still feels thick and sharp. A small flask was discovered behind a potted fern — its label scratched off. A faint, pungent smell lingers.",
      policeReport: "SCENE REPORT — CONSERVATORY\n─────────────────────────\nOfficer Wren, 02 Feb, 08:10\n\nOliver Blackwood was found slumped in his armchair. The conservatory was sealed — all windows closed, the single door shut from the inside. Upon entry, the responding officer noted a sharp, acrid smell.\n\nA small ceramic dish was found on the floor near Oliver's chair. It contains yellowish residue with a distinctive smell. The dish appears to have been used to burn something.\n\nAdditionally, a sealed glass flask was discovered behind a potted fern — its label scratched off. When the forensics technician carefully cracked the seal, a pungent gas escaped.\n\nThe medical examiner notes severe respiratory irritation consistent with toxic gas inhalation in an enclosed space.\n\nACTION REQUIRED: Test the residual gas from the flask to confirm its identity.",
      objects: [{ id: "flask", label: "Sealed Flask", icon: "🫙", pickup: true }, { id: "litmus_red", label: "Damp Red Litmus Paper", icon: "🔴", pickup: true }, { id: "litmus_blue", label: "Damp Blue Litmus Paper", icon: "🔵", pickup: true }, { id: "limewater_tube", label: "Test Tube of Limewater", icon: "🥛", pickup: true }, { id: "splint_burning", label: "Burning Splint", icon: "🕯️", pickup: true }, { id: "splint_glowing", label: "Glowing Splint", icon: "✨", pickup: true }, { id: "kmno4_paper", label: "Acidified KMnO₄ Paper", icon: "🟣", pickup: true }],
      reagents: [], reactions: {},
      gasTests: {
        "litmus_red": { text: "You hold damp red litmus paper near the gas. The paper stays red — it was already red to begin with, so this tells you little on its own.", visual: null },
        "litmus_blue": { text: "You hold damp blue litmus paper near the gas. The paper turns RED.", visual: { type: "solution", color: "#ef4444" } },
        "limewater_tube": { text: "You hold the test tube of limewater up to the gas. … Nothing happens. The limewater stays clear.", visual: null },
        "splint_burning": { text: "You hold a burning splint to the gas. The flame is EXTINGUISHED immediately — no 'pop' sound is heard.", visual: null },
        "splint_glowing": { text: "You hold a glowing splint in the gas. … It does NOT relight.", visual: null },
        "kmno4_paper": { text: "You hold acidified KMnO₄ paper near the gas. The purple colour DECOLOURISES — the paper bleaches to a pale yellow!", visual: { type: "solution", color: "#ca8a04" } },
      },
      answer: { accepted: ["SO2","SO₂","sulfur dioxide","sulphur dioxide"] },
      promptLabel: "What is the name or formula of the gas in the flask?",
      placeholder: "gas name or formula like NH3",
      hints: ["Two of your tests produced visible changes. Think about what those two results have in common — what kind of gas causes both of those reactions?", "The gas is acidic (it turned blue litmus red) and it decolourises acidified KMnO₄. Think about which common acidic gases are also reducing agents strong enough to bleach KMnO₄.", "The answer is sulfur dioxide — SO₂. It is an acidic gas (turns blue litmus red) and a strong reducing agent (decolourises acidified KMnO₄ paper)."],
      solvedMessage: "SO₂ confirmed. Sulfur dioxide at this concentration is a deadly respiratory irritant — the flask was used to poison the conservatory air.",
      evidence: { label: "SO₂ flask in conservatory", detail: "A flask of sulfur dioxide gas was hidden behind a potted fern. SO₂ is a toxic respiratory irritant — prolonged exposure in an enclosed space is fatal.", icon: "🫙" },
    },
  ],
  accusationGuide: "You found Zn²⁺ in the herbal tea. You found SO₄²⁻ in the wine. You found SO₂ in the conservatory. Connect the chemistry findings to the suspects' backgrounds, alibis, and access to all three crime scenes.",
  guilty: "Lady Margaret Blackwood is guilty.\n\nEVIDENCE: Zn²⁺ in tea and SO₄²⁻ in wine — both from zinc sulfate. SO₂ in the conservatory from burning sulfur candles she routinely stores for greenhouse fumigation.\n\nMOTIVE: £2M gambling debts. Oliver refused to release her inheritance from the family trust. His death dissolves the trust immediately.\n\nOPPORTUNITY: Visited the estate Friday evening with unsupervised access to all three crime scenes. Neighbour saw her car at 10:30 PM — 2 hours after she claimed to have left.\n\nCONNECTION: Purchased 5kg zinc sulfate three weeks before the murder. University chemistry background. The sulfur candles from her garden shed were the perfect, readily available source for the SO₂ gas.",
  debrief: [
    { scenario: "Poisoned tea (Greenhouse)", ion: "Zn²⁺", realWorld: "Zinc poisoning is a real forensic concern. At high doses, zinc salts cause acute organ damage. Zinc compounds are sometimes found in industrial contamination cases.", tests: [{ reagent: "NaOH (few drops)", result: "White precipitate forms" }, { reagent: "NaOH (excess)", result: "Precipitate DISSOLVES (amphoteric)" }, { reagent: "Aqueous NH₃ (few drops)", result: "White precipitate forms" }, { reagent: "Aqueous NH₃ (excess)", result: "Precipitate DISSOLVES (forms complex ion)" }] },
    { scenario: "Contaminated wine (Cellar)", ion: "SO₄²⁻", realWorld: "Sulfate testing is fundamental in water and beverage quality analysis. Zinc sulfate is highly soluble and deadly at high concentrations. The sulfate connects to the sulfur dioxide gas theme.", tests: [{ reagent: "Dilute HNO₃ (first)", result: "No fizzing — confirms no carbonate interference" }, { reagent: "Ba(NO₃)₂ solution", result: "White precipitate (BaSO₄) — insoluble in dilute HNO₃" }, { reagent: "Key rule", result: "Always acidify FIRST to remove CO₃²⁻, then add Ba(NO₃)₂ to test for SO₄²⁻" }, { reagent: "Connection", result: "Zn²⁺ in tea + SO₄²⁻ in wine = both from zinc sulfate" }] },
    { scenario: "Toxic gas weapon (Conservatory)", ion: "SO₂", realWorld: "SO₂ is a major industrial pollutant and a cause of acid rain. It is also used as a preservative in wine — but at toxic concentrations it is lethal.", tests: [{ reagent: "Damp blue litmus paper", result: "Turns RED (acidic gas)" }, { reagent: "Acidified KMnO₄ paper", result: "DECOLOURISES (reducing agent)" }, { reagent: "Limewater", result: "No change (distinguishes from CO₂)" }, { reagent: "Key rule", result: "SO₂ vs CO₂: both acidic, but only SO₂ decolourises KMnO₄" }] },
  ],
},
{
  id: "thornfield", title: "The Thornfield Tragedy", caseNumber: "#2025-0215",
  subtitle: "A chemical weapon in the greenhouse. Three contaminated sources. One deadly mix.",
  coverIcon: "🌿", difficulty: "Advanced",
  victim: { name: "Sir Reginald Thornfield", summary: "Found dead in the sealed greenhouse at 6:45 AM on Saturday 15 February 2025 by head housekeeper Clara Ashford. Sir Reginald was slumped in a chair with a ceramic dish containing white crystalline residue nearby. The dish showed signs of heating. The ventilation was deliberately blocked. Cause of death: acute respiratory failure from toxic gas exposure, combined with prior poisoning." },
  suspects: [
    { id: "clara", name: "Clara Ashford", title: "The Housekeeper", portrait: "👩‍🦰", color: "#e11d48", guilty: true, connection: "Head housekeeper with complete access to all household cleaning products, kitchen supplies, and storage areas. Maintains greenhouse fertilizers including ammonium chloride for plants. Also handles metal cleaning supplies. Former chemistry lab technician.", motive: "Sir Reginald discovered Clara embezzling £40,000+ from household accounts. He was filing criminal charges Monday. Clara faced prison.", alibi: "Claims she was cleaning the east wing all morning. No witnesses. Security footage shows her near greenhouse at 6:15 AM." },
    { id: "marsh", name: "Dr. Helena Marsh", title: "The Physician", portrait: "👩‍⚕️", color: "#2563eb", guilty: false, connection: "Medical practice stocks pharmaceutical compounds including calcium carbonate for antacids, sodium hydrogen carbonate for indigestion, and iron(II) sulfate for anemia treatment. Had prescribed Sir Reginald medication Friday afternoon. Limited time on estate premises.", motive: "None. Professional relationship only.", alibi: "At hospital all morning with multiple witnesses. Hospital records confirm presence until 9:00 AM—well after the death." },
    { id: "thomas", name: "Thomas Thornfield", title: "The Nephew", portrait: "👨‍🎓", color: "#d97706", guilty: false, connection: "Chemistry student at Cambridge with lab access to various compounds including copper(II) sulfate for experiments and lead(II) nitrate for qualitative analysis. Also tinkers with electronics—uses soldering flux for circuit boards. Lives in London. Had visited the estate Thursday afternoon.", motive: "Gambling debts, but Sir Reginald had already agreed to help him on Thursday. Will wasn't being changed.", alibi: "In London all weekend. Multiple friends confirm dinner Friday night and breakfast Saturday morning. Train records support this." },
    { id: "pemberton", name: "Margaret Pemberton", title: "The Solicitor", portrait: "👩‍💼", color: "#16a34a", guilty: false, connection: "Estate solicitor with law degree. Amateur photographer hobby uses sodium thiosulfate for developing photos and silver nitrate for prints. Office visit Friday 2-4 PM — discussed estate finances with Sir Reginald. Briefly in the library and conservatory.", motive: "Professional disagreement over estate management, but working relationship was cordial.", alibi: "Left estate 4 PM Friday, witnessed by butler and driver. Phone records place her in Manchester Friday evening, 180 miles away." },
  ],
  stations: [
    {
      id: "conservatory", title: "The Conservatory", icon: "☕",
      locationDesc: "A bright conservatory where Sir Reginald took afternoon tea. The porcelain teacup still contains residue from Earl Grey tea with what appears to be crystalline sugar at the bottom.",
      policeReport: "SCENE REPORT — CONSERVATORY\n─────────────────────────\nOfficer Kane, 15 Feb, 08:45\n\nSir Reginald's afternoon tea service remains on the glass table. The baron's physician noted Sir Reginald complained of nausea and confusion approximately 30 minutes after tea Friday afternoon.\n\nThe teacup contains crystalline residue at the bottom that resembles sugar. A sample has been collected (SAMPLE D).\n\nContext: These symptoms can indicate salt poisoning from certain water-soluble compounds. Some nitrogen-containing salts are used as fertilizers, in pharmaceuticals as expectorants, and even in soldering flux—they dissolve readily in hot liquids and can be mistaken for sugar.\n\nACTION REQUIRED: Test for toxic cation contamination.",
      objects: [{ id: "vial_d", label: "Vial — SAMPLE D", icon: "🧫", pickup: true }, { id: "bunsen_burner", label: "Bunsen Burner", icon: "🔥", pickup: false }, { id: "litmus_red_nh4", label: "Damp Red Litmus Paper", icon: "🔴", pickup: true }, { id: "litmus_blue_nh4", label: "Damp Blue Litmus Paper", icon: "🔵", pickup: true }],
      reagents: ["NaOH solution", "Aqueous NH₃"],
      reactions: {
        "NaOH solution": { first: { text: "You add a few drops of NaOH solution to the sample. No visible change occurs initially—the solution stays clear. However, you detect a PUNGENT, alkaline smell.", visual: null } },
        "Aqueous NH₃": { first: { text: "You add a few drops of aqueous ammonia to the sample. No visible change occurs—the solution stays clear. You detect a pungent smell, but this is just the ammonia itself, not a reaction product.", visual: null } },
      },
      heating: { requiresReagent: "NaOH solution", result: { text: "You gently warm the mixture over the Bunsen burner. A PUNGENT gas is released. You test it with damp red litmus paper—the paper turns BLUE!", visual: { type: "heating", bubbles: true, gasEmission: true }, gasTest: "litmus_red_nh4" } },
      answer: { accepted: ["NH4+", "NH₄⁺", "ammonium", "ammonium ion"] },
      promptLabel: "What is the name or formula of the cation found in the sample?",
      placeholder: "name or formula like Ca2+",
      hints: ["You added NaOH and detected a pungent smell. This suggests a gas is being released slowly. Try warming the mixture with the Bunsen burner to speed up the reaction, then test the gas with damp red litmus paper.", "The pungent gas that turns red litmus blue is ammonia (NH₃). Which cation produces ammonia gas when warmed with sodium hydroxide solution?", "The answer is ammonium—the ammonium ion, NH₄⁺. When ammonium salts are warmed with NaOH, ammonia gas (NH₃) is released. This is the standard test for NH₄⁺ ions."],
      solvedMessage: "NH₄⁺ confirmed in the tea. Ammonium salts at toxic levels cause metabolic acidosis and neurological symptoms—the tea was deliberately poisoned.",
      evidence: { label: "NH₄⁺ in tea", detail: "Ammonium ions at toxic concentrations in the tea. Soluble ammonium salts can resemble sugar crystals.", icon: "☠️" },
    },
    {
      id: "library", title: "The Library", icon: "📚",
      locationDesc: "Sir Reginald's private library. An opened bottle of mineral water sits on the desk—he reportedly drank from it throughout Friday morning. A sample has been drawn.",
      policeReport: "SCENE REPORT — LIBRARY\n─────────────────────────\nOfficer Kane, 15 Feb, 10:20\n\nAn opened bottle of mineral water was found on Sir Reginald's desk. The baron reportedly drank from this bottle throughout the morning.\n\nThe bottle is labeled as a premium mineral water brand, but the seal integrity is questionable—the cap was loose despite being labeled 'sealed fresh.' A sample has been drawn (SAMPLE E).\n\nContext: Excessive salt intake from contaminated water can cause metabolic acidosis. This is especially dangerous when combined with other toxins.\n\nACTION REQUIRED: Test for anion contamination.",
      objects: [{ id: "vial_e", label: "Vial — SAMPLE E", icon: "🧪", pickup: true }, { id: "bunsen_burner", label: "Bunsen Burner", icon: "🔥", pickup: false }, { id: "litmus_red_lib", label: "Damp Red Litmus Paper", icon: "🔴", pickup: true }, { id: "litmus_blue_lib", label: "Damp Blue Litmus Paper", icon: "🔵", pickup: true }],
      reagents: ["NaOH solution", "Aluminium foil", "Dilute HNO₃", "AgNO₃ solution", "Ba(NO₃)₂ solution", "Dilute HCl", "Limewater"],
      reactions: {
        "NaOH solution": { first: { text: "You add NaOH solution to the mineral water sample. The solution stays clear — no precipitate forms.", visual: null } },
        "Aluminium foil": { first_without_naoh: { text: "You add aluminium foil, but nothing happens. Add NaOH solution first if you intend to test for nitrate.", visual: null, warning: true }, first_with_naoh: { text: "You add aluminium foil to the alkaline solution. The aluminium reacts very slowly at room temperature. You could heat the mixture to see if any gas is released.", visual: null } },
        "Dilute HNO₃": { first: { text: "You add dilute nitric acid to the sample. No fizzing or bubbling occurs—the solution stays clear.", visual: null } },
        "Dilute HCl": { first: { text: "You add dilute hydrochloric acid to the sample. No fizzing or bubbling occurs—the solution stays clear. No reaction observed.", visual: null } },
        "Limewater": { first: { text: "You add limewater to the sample. Nothing happens — no precipitate forms.", visual: null } },
        "AgNO₃ solution": { first_without_acid: { text: "You add AgNO₃ directly without acidifying first. A white precipitate forms—but you cannot be sure this isn't from carbonate ions. You should acidify with dilute HNO₃ first to get a reliable result.", visual: { type: "ppt", color: "#e5e7eb" }, warning: true }, first_with_acid: { text: "You add AgNO₃ solution to the acidified sample. A WHITE precipitate forms immediately and does NOT dissolve in the acid.", visual: { type: "ppt", color: "#e5e7eb" } } },
        "Ba(NO₃)₂ solution": { first: { text: "You add Ba(NO₃)₂ solution. No precipitate forms—the solution stays clear.", visual: null } },
      },
      heating: { requiresReagent: "Aluminium foil", result: { text: "You heat the alkaline mixture with aluminium foil over the Bunsen burner. No pungent gas is produced.", visual: null } },
      answer: { accepted: ["Cl-", "Cl⁻", "chloride", "chloride ion"] },
      promptLabel: "What is the name or formula of the anion found in the mineral water?",
      placeholder: "anion name or formula like I-",
      hints: ["Start systematically — try NaOH with aluminium foil and heat. Does the mixture produce any pungent gas? Then try acidifying with dilute HNO₃ before adding AgNO₃.", "No gas from the NaOH + Al + heat test rules out nitrate. You are looking for an anion that forms a white precipitate with Ag⁺ ions that does not dissolve in dilute nitric acid.", "The answer is chloride—the chloride ion, Cl⁻. Silver chloride (AgCl) is a white precipitate that is insoluble in dilute nitric acid."],
      solvedMessage: "Cl⁻ confirmed at elevated levels in the mineral water. Excessive chloride indicates deliberate contamination with a chloride salt.",
      evidence: { label: "Cl⁻ in water", detail: "Chloride ions at dangerous concentrations. Soluble chloride salts are tasteless when dissolved in water.", icon: "💧" },
    },
    {
      id: "greenhouse", title: "The Greenhouse", icon: "🌿",
      locationDesc: "The sealed greenhouse where Sir Reginald died. A small ceramic dish with white crystalline residue sits near the body. The gases have been captured in a sealed flask.",
      policeReport: "SCENE REPORT — GREENHOUSE\n─────────────────────────\nOfficer Kane, 15 Feb, 07:30\n\nSir Reginald Thornfield was found deceased in the sealed greenhouse at 6:45 AM. The ventilation was deliberately blocked from outside.\n\nA CERAMIC DISH discovered near the body contains yellowish-white crystalline residue with a distinctive pungent smell. The dish appears to have been HEATED—scorch marks visible underneath.\n\nINVESTIGATOR'S NOTE: You found a specific cation in the tea and a specific anion in the water. These ions can combine to form a white crystalline salt. When this type of salt is heated strongly, it decomposes into two gases.\n\nWARNING: The greenhouse atmosphere was lethal. A gas sample has been safely captured.\n\nACTION REQUIRED: Identify the gases present to confirm the chemical weapon used.",
      objects: [{ id: "gas_mixture", label: "Gas Mixture Sample", icon: "🧪", pickup: true }, { id: "litmus_red_seq", label: "Damp Red Litmus Paper", icon: "🔴", pickup: true }, { id: "litmus_blue_first", label: "Damp Blue Litmus Paper", icon: "🔵", pickup: true }, { id: "kmno4_paper", label: "Acidified KMnO₄ Paper", icon: "🟣", pickup: true }, { id: "limewater_tube", label: "Limewater", icon: "🧪", pickup: true }, { id: "splint_burning", label: "Burning Splint", icon: "🔥", pickup: true }, { id: "splint_glowing", label: "Glowing Splint", icon: "✨", pickup: true }],
      reagents: [], reactions: {},
      mixedGas: true,
      gasTests: {
        "litmus_red_seq": { text: "You hold damp RED litmus paper in the gas mixture. The paper turns BLUE. As you continue holding it, the blue colour turns RED again.", visual: { type: "solution", color: "#ef4444" }, detectsGases: ["NH₃", "HCl"] },
        "litmus_blue_first": { text: "You hold damp BLUE litmus paper in the gas mixture. The paper turns RED immediately.", visual: { type: "solution", color: "#ef4444" }, detectsGases: ["HCl"], warning: true, hint: "Try using RED litmus paper first, THEN use blue litmus." },
        "kmno4_paper": { text: "You hold acidified KMnO₄ paper in the gas mixture. No change—the purple color remains. Neither gas affects permanganate.", visual: null },
        "limewater_tube": { text: "You bubble the gas mixture through limewater. No change—the limewater stays clear. Neither gas forms a precipitate with limewater.", visual: null },
        "splint_burning": { text: "You hold a burning splint in the gas mixture. The flame EXTINGUISHES—no 'pop' sound heard." },
        "splint_glowing": { text: "You hold a glowing splint in the gas mixture. The splint does not relight." },
      },
      answer: { accepted: [["NH3","HCl"],["NH₃","HCl"],["ammonia","hydrogen chloride"],["HCl","NH3"],["HCl","NH₃"],["hydrogen chloride","ammonia"]], requiresBoth: true },
      promptLabel: "What TWO gases are present in the mixture? (separate with comma or 'and')",
      placeholder: "e.g. gas A, gas B or gas A and gas B",
      hints: ["Red litmus turned blue, then red again. What does this sequence tell you? Red litmus turned blue = alkaline gas. Blue litmus turned red again = acidic gas. You're looking for TWO gases.", "Think about NH₄⁺ + Cl⁻. If these combine, what compound? What happens when that compound is heated?", "The answers are NH₃ and HCl. NH₄Cl(s) ⇌ NH₃(g) + HCl(g). This thermal decomposition creates both gases."],
      solvedMessage: "NH₃ and HCl confirmed. The killer heated ammonium chloride crystals in the greenhouse, then sealed the ventilation. The thermal decomposition (NH₄Cl ⇌ NH₃ + HCl) created a lethal atmosphere.",
      evidence: { label: "NH₃ + HCl weapon", detail: "Both ammonia and hydrogen chloride gases identified. Heating ammonium chloride crystals produces this toxic gas mixture via thermal decomposition.", icon: "☠️" },
    },
  ],
  accusationGuide: "You found NH₄⁺ in the tea. You found Cl⁻ in the mineral water. You found NH₃ and HCl gases in the greenhouse. Connect the chemistry findings to the suspects' backgrounds, alibis, and access to all three crime scenes.",
  guilty: "Clara Ashford is guilty.\n\nEVIDENCE CHAIN:\n• NH₄⁺ in tea: Ammonium chloride crystals disguised as sugar\n• Cl⁻ in water: Added salt to weaken victim\n• NH₃ + HCl gases: Heated NH₄Cl crystals in greenhouse. Thermal decomposition (NH₄Cl ⇌ NH₃ + HCl) released toxic gases. Ventilation sealed.\n\nMOTIVE: Sir Reginald discovered £40,000+ embezzlement. Criminal charges filed Monday. Clara faced prison.\n\nOPPORTUNITY: Head housekeeper with complete access. Security footage places her at greenhouse 6:15 AM. No alibi.\n\nCHEMISTRY KNOWLEDGE: Former chemistry lab technician. Knew NH₄Cl decomposition produces toxic gases.",
  debrief: [
    { scenario: "Poisoned tea (Conservatory)", ion: "NH₄⁺", realWorld: "Ammonium salt poisoning is a serious toxicological concern. Ammonium chloride can cause metabolic acidosis at high doses. NH₄⁺ testing is essential in clinical and forensic chemistry.", tests: [{ reagent: "NaOH solution (cold)", result: "Pungent smell detected — NH₃ released slowly" }, { reagent: "Heat with Bunsen burner", result: "NH₃ gas released more rapidly" }, { reagent: "Damp red litmus paper", result: "Turns BLUE (alkaline gas confirms NH₃)" }, { reagent: "Key rule", result: "WARMING is essential for NH₄⁺ test — reaction too slow at room temperature" }] },
    { scenario: "Contaminated mineral water (Library)", ion: "Cl⁻", realWorld: "Chloride testing is fundamental in water quality analysis. AgCl precipitation is one of the most reliable anion identification methods in qualitative chemistry.", tests: [{ reagent: "Dilute HNO₃ (first)", result: "No fizz — confirms no carbonate interference" }, { reagent: "AgNO₃ solution", result: "White precipitate (AgCl) — insoluble in dil. HNO₃" }, { reagent: "Key rule", result: "Always acidify with dil. HNO₃ BEFORE adding AgNO₃ to remove carbonate ions" }] },
    { scenario: "Mixed gases (Greenhouse)", ion: "NH₃ + HCl", realWorld: "Heating ammonium chloride produces toxic ammonia and hydrogen chloride gases via thermal decomposition: NH₄Cl(s) ⇌ NH₃(g) + HCl(g). This reversible reaction is used in chemistry demonstrations but is extremely dangerous in enclosed spaces.", tests: [{ reagent: "Red litmus first", result: "Turns BLUE (alkaline NH₃), then RED again (acidic HCl)" }, { reagent: "Blue litmus only", result: "Turns RED (acidic HCl) — misses NH₃ detection" }, { reagent: "KMnO₄ paper", result: "No change — neither gas affects permanganate" }, { reagent: "Connection", result: "NH₄⁺ in tea + Cl⁻ in water = both from NH₄Cl (source compound)" }] },
  ],
},
];

/* ─── Visual helpers ─── */
function VisualTestTube({ liquidLevel=0, liquidColor="transparent", precipitateColor=null, precipitateHeight=0, bubbling=false, animating=null, isHeating=false, airHoleOpen=false, theme="dark" }) {
  const tubeBg = theme === "light" ? "#f0f4f8" : "#0f0f1a";
  const tubeBorder = theme === "light" ? "#94a3b8" : "#4a4a70";
  const tubeShine = theme === "light" ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.13)";
  const bubbleColor = theme === "light" ? "rgba(100,160,220,0.7)" : "rgba(255,255,255,0.6)";
  const bubbleBorder = theme === "light" ? "rgba(100,160,220,0.5)" : "rgba(255,255,255,0.4)";

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"12px", minWidth:120, position:"relative" }}>
      <div style={{ color:S.accent, fontSize:10, fontFamily:"'Courier New',monospace", fontWeight:600, marginBottom:8, letterSpacing:0.5 }}>TEST TUBE</div>
      <div style={{ position:"relative", width:60 }}>
        {isHeating && (
          <div style={{ position:"absolute", bottom:-52, left:"50%", transform:"translateX(-50%)", width:44, height:52, zIndex:20, pointerEvents:"none" }}>
            {airHoleOpen ? (
              <><div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:28, height:38, background:"linear-gradient(to top, #1040cc, #2060ff, #60b0ff, #aad4ff)", borderRadius:"50% 50% 45% 45% / 60% 60% 40% 40%", animation:"flame-flicker 0.12s infinite alternate", filter:"blur(1.5px)" }}/><div style={{ position:"absolute", bottom:3, left:"50%", transform:"translateX(-50%)", width:14, height:22, background:"linear-gradient(to top, #0020aa, #1050ff, #ffffff)", borderRadius:"50% 50% 45% 45% / 60% 60% 40% 40%", animation:"flame-core 0.15s infinite alternate", filter:"blur(0.5px)", zIndex:21 }}/></>
            ) : (
              <><div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:34, height:44, background:"linear-gradient(to top, #ff4500, #ff8c00, #ffd700, #fff7aa)", borderRadius:"50% 50% 45% 45% / 60% 60% 40% 40%", animation:"flame-flicker 0.2s infinite alternate", filter:"blur(2px)" }}/><div style={{ position:"absolute", bottom:2, left:"50%", transform:"translateX(-50%)", width:18, height:28, background:"linear-gradient(to top, #ff6b00, #ffaa00, #ffe066)", borderRadius:"50% 50% 45% 45% / 60% 60% 40% 40%", animation:"flame-flicker 0.25s infinite alternate-reverse", filter:"blur(1px)", zIndex:21 }}/></>
            )}
          </div>
        )}
        <div style={{ position:"relative", width:60, height:120, backgroundColor:tubeBg, border:"2px solid "+tubeBorder, borderRadius:"4px 4px 16px 16px", overflow:"hidden", boxShadow:theme==="light"?"inset 0 2px 8px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.1)":"inset 0 2px 8px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3)" }}>
          {liquidLevel>0 && <div style={{ position:"absolute", bottom:0, left:0, right:0, height:liquidLevel+"%", background:liquidColor==="transparent"||liquidColor==="rgba(255,255,255,0.0)"?"transparent":liquidColor, transition:animating==="settling"?"none":"all 0.6s ease", borderRadius:"0 0 14px 14px", boxShadow:liquidColor==="transparent"||liquidColor==="rgba(255,255,255,0.0)"?"0 0 0 1.5px rgba(0,0,0,0.18)":(theme==="light"?"inset 0 0 0 1.5px rgba(0,0,0,0.13)":"inset 0 0 0 1px rgba(255,255,255,0.08)") }}/>}
          {precipitateColor&&precipitateHeight>0 && <div style={{ position:"absolute", bottom:0, left:"12%", right:"12%", height:precipitateHeight+"%", background:precipitateColor, borderRadius:"40% 40% 0 0 / 50% 50% 0 0", transition:animating==="settling"?"none":"all 0.5s ease", boxShadow:"inset 0 -2px 4px rgba(0,0,0,0.08), 0 0 0 1.5px rgba(0,0,0,0.18)", zIndex:2, animation:animating==="settling"?"precipitate-settle 0.8s ease-out":"none" }}/>}
          {bubbling&&[1,2,3,4,5].map(i=><div key={i} style={{ position:"absolute", bottom:"15%", left:(15+i*12)+"%", width:i%2===0?5:6, height:i%2===0?5:6, borderRadius:"50%", background:bubbleColor, border:"1px solid "+bubbleBorder, animation:"bubble-rise "+(0.8+i*0.15)+"s infinite ease-in", animationDelay:(i*0.12)+"s" }}/>)}
          {liquidLevel>0&&<div style={{ position:"absolute", bottom:liquidLevel+"%", left:"15%", right:"15%", height:"3px", background:"linear-gradient(90deg, transparent, "+tubeShine+", transparent)", borderRadius:"50%", transform:"translateY(-50%)", opacity:0.6 }}/>}
          <div style={{ position:"absolute", top:"12%", left:"6%", width:"22%", height:"35%", background:"linear-gradient(135deg, "+tubeShine+", transparent)", borderRadius:"50%", pointerEvents:"none" }}/>
        </div>
      </div>
      <style>{`
        @keyframes precipitate-settle{0%{transform:translateY(-40px);opacity:0}15%{opacity:0.5}100%{transform:translateY(0);opacity:1}}
        @keyframes bubble-rise{0%{transform:translateY(0) scale(0.5);opacity:0}10%{opacity:0.8}70%{transform:translateY(-75px) scale(1.1);opacity:0.6}100%{transform:translateY(-85px) scale(0.3);opacity:0}}
        @keyframes fade-in{0%{opacity:0}100%{opacity:1}}
        @keyframes flame-flicker{0%{transform:translateX(-50%) scaleY(1) scaleX(1)}100%{transform:translateX(-50%) scaleY(1.08) scaleX(0.95)}}
        @keyframes flame-core{0%{transform:translateX(-50%) scaleY(1)}100%{transform:translateX(-50%) scaleY(1.15)}}
        @keyframes splint-extinguish{0%{opacity:1;transform:scaleY(1);filter:blur(0.5px)}40%{opacity:0.7;transform:scaleY(0.5) scaleX(1.3)}100%{opacity:0;transform:scaleY(0);filter:blur(2px)}}
        @keyframes splint-pop-flash{0%{opacity:0;transform:scale(0.5)}20%{opacity:1;transform:scale(2.2)}60%{opacity:0.8;transform:scale(1.5)}100%{opacity:0;transform:scale(0.8)}}
        @keyframes ember-glow{0%{box-shadow:0 0 4px 2px #ff4500;opacity:0.7}50%{box-shadow:0 0 8px 4px #ff8c00;opacity:1}100%{box-shadow:0 0 4px 2px #ff4500;opacity:0.7}}
        @keyframes relight-burst{0%{opacity:0;transform:translateX(-50%) scale(0.2)}30%{opacity:1;transform:translateX(-50%) scale(1.4)}100%{opacity:1;transform:translateX(-50%) scale(1)}}
        @keyframes splint-sway{0%{transform:rotate(-3deg)}100%{transform:rotate(3deg)}}
        @keyframes droplet-fall-drag{0%{transform:translateY(0) scale(1);opacity:0}20%{opacity:0.8}80%{transform:translateY(40px) scale(0.9);opacity:0.7}100%{transform:translateY(50px) scale(0);opacity:0}}
      `}</style>
    </div>
  );
}

function DraggableReagentBottle({ name, used }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x:0, y:0 });
  const isAluminiumFoil = name === "Aluminium foil";
  const liquidColors = { "NaOH solution":"#22c55e22","Aqueous NH₃":"#eab30822" };
  const liquidColor = liquidColors[name]||"transparent";
  const dropletColor = liquidColor==="transparent"?"#60a5fa77":liquidColor.replace("22","99");
  return (
    <>
      <div draggable onDragStart={e=>{setIsDragging(true);e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("reagent",name)}} onDrag={e=>{if(e.clientX!==0&&e.clientY!==0)setDragPos({x:e.clientX,y:e.clientY})}} onDragEnd={()=>setIsDragging(false)}
        style={{ background:S.card, border:"2px solid "+(used?S.accent:S.borderHi), borderRadius:8, padding:"8px 12px", cursor:isDragging?"grabbing":"grab", transition:"all 0.2s", position:"relative", minWidth:85, opacity:isDragging?0.5:1 }}
        onMouseEnter={e=>e.currentTarget.style.borderColor=S.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=used?S.accent:S.borderHi}>
        {isAluminiumFoil?(
          <div style={{ position:"relative", width:40, height:50, margin:"0 auto 6px", display:"flex", alignItems:"center", justifyContent:"center" }}><div style={{ fontSize:36, lineHeight:1, filter:used?"grayscale(0.5)":"none" }}>🗞️</div></div>
        ):(
          <div style={{ position:"relative", width:40, height:50, margin:"0 auto 6px" }}>
            <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:8, height:12, background:"#ef4444", borderRadius:"50% 50% 0 0" }}/>
            <div style={{ position:"absolute", top:12, left:"50%", transform:"translateX(-50%)", width:30, height:35, background:"#92400e88", borderRadius:"2px 2px 4px 4px", border:"1px solid #78350f", overflow:"hidden" }}>
              <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"70%", background:liquidColor||"#ffffff11", borderRadius:"0 0 3px 3px" }}/>
            </div>
          </div>
        )}
        <div style={{ color:used?S.accent:S.textMuted, fontSize:9, textAlign:"center", fontFamily:"'Courier New',monospace", lineHeight:1.2 }}>{name}</div>
        {used&&<div style={{ color:S.accent, fontSize:8, textAlign:"center", marginTop:2, fontFamily:"'Courier New',monospace" }}>(add excess)</div>}
      </div>
      {isDragging&&dragPos.x>0&&(
        <div style={{ position:"fixed", left:dragPos.x, top:dragPos.y, pointerEvents:"none", zIndex:9999 }}>
          {[0,1,2,3].map(i=><div key={i} style={{ position:"absolute", top:20+i*8, left:-2, width:4, height:7, background:dropletColor, borderRadius:"50% 50% 50% 50% / 30% 30% 70% 70%", animation:"droplet-fall-drag 0.8s ease-in infinite", animationDelay:(i*0.15)+"s", opacity:0.8 }}/>)}
        </div>
      )}
    </>
  );
}

function TestTubeDropZone({ children, onReagentDrop }) {
  const [isOver, setIsOver] = useState(false);
  return (
    <div onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect="move";setIsOver(true)}} onDragLeave={()=>setIsOver(false)} onDrop={e=>{e.preventDefault();setIsOver(false);const r=e.dataTransfer.getData("reagent");if(r&&onReagentDrop)onReagentDrop(r)}}
      style={{ position:"relative", border:isOver?"2px dashed "+S.accent:"2px dashed transparent", borderRadius:8, padding:4, transition:"all 0.2s" }}>
      {children}
      {isOver&&<div style={{ position:"absolute", top:-20, left:"50%", transform:"translateX(-50%)", background:S.accent, color:"#1a1a2e", padding:"4px 8px", borderRadius:4, fontSize:9, fontFamily:"'Courier New',monospace", whiteSpace:"nowrap", fontWeight:600, pointerEvents:"none" }}>Drop here to add reagent</div>}
    </div>
  );
}

function LimewaterSetup({ active=false }) {
  const [phase, setPhase] = useState(0);
  useEffect(()=>{ if(!active)return; const t1=setTimeout(()=>setPhase(1),1000); const t2=setTimeout(()=>setPhase(2),4200); return()=>{clearTimeout(t1);clearTimeout(t2)}; },[active]);
  const tubeColor = phase===0?"rgba(255,255,255,0.06)":phase===1?"rgba(220,225,230,0.92)":"rgba(255,255,255,0.06)";
  const phaseLabel = phase===0?"BEFORE":phase===1?"WHITE PPT":"COLOURLESS";
  const labelColor = phase===1?"#e2e8f0":"#c8a96e";
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"10px 4px" }}>
      <div style={{ color:"#c8a96e", fontSize:9, fontFamily:"'Courier New',monospace", fontWeight:600, marginBottom:6, letterSpacing:0.5 }}>LIMEWATER TEST</div>
      <svg width="170" height="180" viewBox="0 0 170 180" style={{ overflow:"visible" }}>
        <path d="M 42 95 L 20 155 Q 20 162 28 162 L 72 162 Q 80 162 80 155 L 58 95 Z" fill="rgba(255,255,255,0.06)" stroke="#4a4a70" strokeWidth="2"/>
        <rect x="44" y="60" width="14" height="36" rx="2" fill="rgba(255,255,255,0.06)" stroke="#4a4a70" strokeWidth="2"/>
        <rect x="41" y="54" width="20" height="10" rx="3" fill="#c2793a" stroke="#a05a20" strokeWidth="1.5"/>
        <text x="50" y="125" textAnchor="middle" fill={S.textMuted} fontSize="7" fontFamily="'Courier New',monospace">gas</text>
        <path d="M 44 130 L 23 155 Q 23 159 28 159 L 72 159 Q 77 159 77 155 L 56 130 Z" fill="rgba(200,220,255,0.25)"/>
        {active&&[45,55,60,48,53].map((x,i)=><circle key={i} cx={x} cy={145-(i*5)} r="2.5" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" style={{ animation:"bubble-rise-svg 1.2s "+(i*0.25)+"s infinite ease-out" }}/>)}
        <line x1="51" y1="54" x2="51" y2="28" stroke="#8888aa" strokeWidth="3" strokeLinecap="round"/>
        <line x1="51" y1="28" x2="130" y2="28" stroke="#8888aa" strokeWidth="3" strokeLinecap="round"/>
        <line x1="130" y1="28" x2="130" y2="98" stroke="#8888aa" strokeWidth="3" strokeLinecap="round"/>
        {active&&[0,1,2].map(i=><circle key={i} cx="130" cy={92-i*18} r="3" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" style={{ animation:"bubble-rise-svg 1s "+(i*0.35)+"s infinite ease-out" }}/>)}
        <rect x="118" y="75" width="24" height="80" rx="3" fill="rgba(255,255,255,0.05)" stroke="#4a4a70" strokeWidth="2"/>
        <ellipse cx="130" cy="155" rx="12" ry="5" fill="rgba(255,255,255,0.05)" stroke="#4a4a70" strokeWidth="2"/>
        <rect x="120" y={phase===0?105:95} width="20" height={phase===0?50:60} rx="2" fill={tubeColor} style={{ transition:"fill 2s ease-in-out, height 0.8s ease, y 0.8s ease" }}/>
        {phase===1&&[123,128,133,126,131].map((x,i)=><circle key={i} cx={x} cy={115+i*7} r="2.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" opacity="0.95" style={{ animation:"precipitate-settle 0.8s "+(i*0.1)+"s ease-out both" }}/>)}
        <text x="130" y="172" textAnchor="middle" fill="#1a1a1a" fontSize="6.5" fontFamily="'Courier New',monospace">limewater</text>
        <text x="51" y="50" textAnchor="middle" fill="#1a1a1a" fontSize="6.5" fontFamily="'Courier New',monospace">gas</text>
      </svg>
      <div style={{ color:labelColor, fontSize:8, fontFamily:"'Courier New',monospace", fontWeight:600, marginTop:2, transition:"color 0.5s" }}>{phaseLabel}</div>
      <div style={{ display:"flex", gap:4, marginTop:4 }}>{[0,1,2].map(p=><div key={p} style={{ width:6, height:6, borderRadius:"50%", background:phase===p?"#c8a96e":"#333", transition:"background 0.4s" }}/>)}</div>
      <style>{`@keyframes bubble-rise-svg{0%{transform:translateY(0);opacity:0.7}80%{transform:translateY(-22px);opacity:0.5}100%{transform:translateY(-26px);opacity:0}}`}</style>
    </div>
  );
}

function GasTestVisual({ testItem, result, theme="dark" }) {
  const [showingResult, setShowingResult] = useState(false);
  const [phase, setPhase] = useState(0);
  useEffect(()=>{ const t=setTimeout(()=>setShowingResult(true),800); return()=>clearTimeout(t); },[]);
  const getTestLabel = (id) => id?id.replace(/_no3|_nh4|_nh3|_seq|_first/g,'').toUpperCase().replace(/_/g,' '):'';
  const visuals = {
    litmus_red_stays:{ type:"paper", initialColor:"#ef4444", finalColor:"#ef4444", label:"Red (no change)" },
    litmus_red_to_blue:{ type:"paper", initialColor:"#ef4444", finalColor:"#3b82f6", label:"Red → Blue", animate:true },
    litmus_red_sequential:{ type:"paper_sequential", initialColor:"#ef4444", midColor:"#3b82f6", finalColor:"#ef4444", label:"Red → Blue → Red", animate:true, phases:3 },
    litmus_red_bleached:{ type:"paper", initialColor:"#ef4444", finalColor:"#f5f5f5", label:"Red → Bleached white", animate:true },
    litmus_blue_stays:{ type:"paper", initialColor:"#3b82f6", finalColor:"#3b82f6", label:"Blue (no change)" },
    litmus_blue_to_red:{ type:"paper", initialColor:"#3b82f6", finalColor:"#ef4444", label:"Blue → Red", animate:true },
    litmus_blue_bleached:{ type:"paper", initialColor:"#3b82f6", finalColor:"#f5f5f5", label:"Blue → Bleached white", animate:true },
    limewater_white:{ type:"tube", initialColor:"#ffffff08", finalColor:"#e2e8f0", label:"Clear → White precipitate", animate:true },
    limewater_co2:{ type:"tube_co2", label:"Clear → White ppt → Colourless", animate:true },
    limewater_clear:{ type:"tube_clear", label:"Clear (no change)" },
    kmno4_decolorized:{ type:"paper", initialColor:"#a855f7", finalColor:"#f5f5f5", label:"Purple → Decolorized", animate:true },
    kmno4_stays:{ type:"paper", initialColor:"#a855f7", finalColor:"#a855f7", label:"Purple (no change)" },
    splint_burning_extinguished:{ type:"splint", initialColor:"#ff6b00", finalColor:"#555555", label:"Flame extinguished", animate:true, burning:true, extinguished:true },
    splint_burning_pops:{ type:"splint", initialColor:"#ff6b00", finalColor:"#ff2200", label:"Squeaky pop! (H₂)", animate:true, burning:true, pops:true },
    splint_burning_stays:{ type:"splint", initialColor:"#ff6b00", finalColor:"#ff6b00", label:"Flame unchanged", burning:true },
    splint_glowing_relight:{ type:"splint", initialColor:"#cc4400", finalColor:"#ff6b00", label:"Splint RELIGHTS (O₂)", animate:true, glowing:true, relights:true },
    splint_glowing_stays:{ type:"splint", initialColor:"#cc4400", finalColor:"#cc4400", label:"Does not relight", glowing:true },
  };
  const visual = visuals[result]||{ type:"paper", initialColor:"#888", finalColor:"#888", label:result };
  useEffect(()=>{ if(visual.type==="paper_sequential"&&showingResult){ setTimeout(()=>setPhase(1),500); setTimeout(()=>setPhase(2),2500); } },[showingResult,visual.type]);

  if(visual.type==="paper_sequential") {
    const currentColor = phase===0?visual.initialColor:phase===1?visual.midColor:visual.finalColor;
    const phaseLabel = phase===0?"BEFORE":phase===1?"AFTER (1st change)":"AFTER (2nd change)";
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:8, minWidth:100 }}>
        <div style={{ color:S.accent, fontSize:9, fontFamily:"'Courier New',monospace", marginBottom:6, textAlign:"center" }}>{getTestLabel(testItem)}</div>
        <div style={{ fontSize:7, fontFamily:"'Courier New',monospace", color:S.accent, marginBottom:3, fontWeight:600 }}>{phaseLabel}</div>
        <div style={{ width:40, height:60, background:currentColor, border:"2px solid #4a4a70", borderRadius:4, boxShadow:"0 2px 8px rgba(0,0,0,0.3)", transition:"background-color 1.5s ease-in-out" }}/>
        <div style={{ color:S.textMuted, fontSize:8, marginTop:6, textAlign:"center", maxWidth:140 }}>{visual.label}</div>
      </div>
    );
  }
  if(visual.type==="paper") {
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:8, minWidth:100 }}>
        <div style={{ color:S.accent, fontSize:9, fontFamily:"'Courier New',monospace", marginBottom:6, textAlign:"center" }}>{getTestLabel(testItem)}</div>
        {visual.animate&&<div style={{ fontSize:7, fontFamily:"'Courier New',monospace", color:S.accent, marginBottom:3, fontWeight:600, opacity:showingResult?0:1, transition:"opacity 0.8s" }}>BEFORE</div>}
        <div style={{ width:40, height:60, background:showingResult&&visual.animate?visual.finalColor:visual.initialColor, border:"2px solid #4a4a70", borderRadius:4, boxShadow:"0 2px 8px rgba(0,0,0,0.3)", transition:visual.animate?"background-color 2.5s ease-in-out":"none", position:"relative" }}>
          {visual.animate&&showingResult&&<div style={{ position:"absolute", top:-10, left:0, right:0, textAlign:"center", fontSize:7, fontFamily:"'Courier New',monospace", color:S.accent, fontWeight:600, animation:"fade-in 0.5s ease-in" }}>AFTER</div>}
        </div>
        <div style={{ color:S.textMuted, fontSize:8, marginTop:4, textAlign:"center", maxWidth:90 }}>{visual.label}</div>
      </div>
    );
  }
  if(visual.type==="tube_clear") {
    const tubeBg = theme==="light" ? "#f0f4f8" : "#0f0f1a";
    const tubeBorder = theme==="light" ? "#94a3b8" : "#4a4a70";
    const outline = theme==="light" ? "rgba(100,150,200,0.3)" : "rgba(255,255,255,0.12)";
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:8 }}>
        <div style={{ color:S.accent, fontSize:9, fontFamily:"'Courier New',monospace", marginBottom:6 }}>LIMEWATER</div>
        <div style={{ position:"relative", width:50, height:80, background:tubeBg, border:"2px solid "+tubeBorder, borderRadius:"4px 4px 12px 12px", overflow:"hidden", boxShadow:"inset 0 2px 8px rgba(0,0,0,0.08)" }}>
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"70%", background:"transparent", borderTop:"2px solid "+outline, borderRadius:"0 0 10px 10px" }}/>
          <div style={{ position:"absolute", top:"12%", left:"8%", width:"20%", height:"30%", background:theme==="light"?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.08)", borderRadius:"50%", pointerEvents:"none" }}/>
        </div>
        <div style={{ color:S.textMuted, fontSize:8, marginTop:4, textAlign:"center" }}>{visual.label}</div>
      </div>
    );
  }
  if(visual.type==="tube") {
    const tubeBg = theme==="light" ? "#f0f4f8" : "#0f0f1a";
    const tubeBorder = theme==="light" ? "#94a3b8" : "#4a4a70";
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:8 }}>
        <div style={{ color:S.accent, fontSize:9, fontFamily:"'Courier New',monospace", marginBottom:6 }}>LIMEWATER</div>
        {visual.animate&&<div style={{ fontSize:7, fontFamily:"'Courier New',monospace", color:S.accent, marginBottom:3, fontWeight:600, opacity:showingResult?0:1, transition:"opacity 0.8s" }}>BEFORE</div>}
        <div style={{ position:"relative", width:50, height:80, background:tubeBg, border:"2px solid "+tubeBorder, borderRadius:"4px 4px 12px 12px", overflow:"hidden", boxShadow:"inset 0 2px 8px rgba(0,0,0,0.15)" }}>
          {visual.animate&&showingResult&&<div style={{ position:"absolute", top:-10, left:0, right:0, textAlign:"center", fontSize:7, fontFamily:"'Courier New',monospace", color:S.accent, fontWeight:600, zIndex:10, animation:"fade-in 0.5s ease-in" }}>AFTER</div>}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"70%", background:showingResult&&visual.animate?visual.finalColor:visual.initialColor, borderRadius:"0 0 10px 10px", transition:visual.animate?"background-color 3s ease-in-out":"none", boxShadow:showingResult&&visual.animate?"0 0 0 1.5px rgba(0,0,0,0.18)":"0 0 0 1.5px rgba(0,0,0,0.10)" }}/>
        </div>
        <div style={{ color:S.textMuted, fontSize:8, marginTop:4, textAlign:"center" }}>{visual.label}</div>
      </div>
    );
  }
  if(visual.type==="tube_co2") return <LimewaterSetup active={showingResult}/>;
  if(visual.type==="splint") {
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:8, minWidth:110 }}>
        <div style={{ color:S.accent, fontSize:9, fontFamily:"'Courier New',monospace", marginBottom:6, textAlign:"center" }}>{visual.burning?"BURNING SPLINT":"GLOWING SPLINT"}</div>
        {visual.animate&&<div style={{ fontSize:7, fontFamily:"'Courier New',monospace", color:S.accent, marginBottom:3, fontWeight:600, opacity:showingResult?0:1, transition:"opacity 0.8s" }}>BEFORE</div>}
        <div style={{ position:"relative", width:60, height:90, display:"flex", justifyContent:"center" }}>
          <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:7, height:70, background:"linear-gradient(to top, #8B5E3C, #c8a060, #d4a853)", borderRadius:"2px 2px 0 0", animation:"splint-sway 0.6s infinite alternate ease-in-out", transformOrigin:"bottom center" }}/>
          {visual.glowing&&<div style={{ position:"absolute", bottom:64, left:"50%", transform:"translateX(-50%)", width:9, height:9, borderRadius:"50%", background:"#cc4400", animation:"ember-glow 1s infinite alternate", zIndex:5 }}/>}
          {visual.burning&&!showingResult&&(
            <div style={{ position:"absolute", bottom:62, left:"50%", transform:"translateX(-50%)" }}>
              <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:18, height:22, background:"linear-gradient(to top, #ff4500, #ff8c00, #ffd700)", borderRadius:"50% 50% 40% 40% / 60% 60% 40% 40%", animation:"flame-flicker 0.15s infinite alternate", filter:"blur(1px)" }}/>
              <div style={{ position:"absolute", bottom:2, left:"50%", transform:"translateX(-50%)", width:8, height:12, background:"linear-gradient(to top, #1060ff, #60b0ff, #ffffff)", borderRadius:"50% 50% 40% 40% / 60% 60% 40% 40%", animation:"flame-core 0.2s infinite alternate", filter:"blur(0.5px)", zIndex:2 }}/>
            </div>
          )}
          {visual.burning&&!visual.extinguished&&!visual.pops&&showingResult&&(
            <div style={{ position:"absolute", bottom:62, left:"50%", transform:"translateX(-50%)" }}>
              <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:18, height:22, background:"linear-gradient(to top, #ff4500, #ff8c00, #ffd700)", borderRadius:"50% 50% 40% 40% / 60% 60% 40% 40%", animation:"flame-flicker 0.15s infinite alternate", filter:"blur(1px)" }}/>
            </div>
          )}
          {visual.extinguished&&showingResult&&<div style={{ position:"absolute", bottom:62, left:"50%", transform:"translateX(-50%)", width:18, height:22, background:"linear-gradient(to top, #888, #aaa, #ccc)", borderRadius:"50% 50% 40% 40% / 60% 60% 40% 40%", animation:"splint-extinguish 1.2s ease-out forwards", filter:"blur(1px)" }}/>}
          {visual.pops&&showingResult&&<div style={{ position:"absolute", bottom:50, left:"50%", width:50, height:50, background:"radial-gradient(circle, #ffffffcc 0%, #ffcc0088 40%, transparent 70%)", borderRadius:"50%", animation:"splint-pop-flash 0.8s ease-out forwards", zIndex:10 }}/>}
          {visual.relights&&showingResult&&<div style={{ position:"absolute", bottom:60, left:"50%", width:24, height:28, background:"linear-gradient(to top, #ff4500, #ff8c00, #ffd700)", borderRadius:"50% 50% 40% 40% / 60% 60% 40% 40%", animation:"relight-burst 1s ease-out forwards", filter:"blur(1px)", zIndex:6 }}/>}
        </div>
        {visual.animate&&showingResult&&<div style={{ fontSize:7, fontFamily:"'Courier New',monospace", color:S.accent, fontWeight:600, animation:"fade-in 0.5s ease-in", marginTop:2 }}>AFTER</div>}
        <div style={{ color:S.textMuted, fontSize:8, marginTop:4, textAlign:"center", maxWidth:100 }}>{visual.label}</div>
      </div>
    );
  }
  return null;
}

/* ─── UI atoms ─── */
function StyledButton({ children, onClick, variant="primary", style:extraStyle, disabled }) {
  const v = { primary:{ background:"linear-gradient(135deg, "+S.accent+", #a07840)", color:"#1a1a2e", boxShadow:"0 3px 16px "+S.accentDim }, ghost:{ background:"transparent", color:S.accent, border:"1px solid "+S.accent+"55" }, danger:{ background:"linear-gradient(135deg,#dc2626,#991b1b)", color:"#fff", boxShadow:"0 3px 16px #dc262633" } };
  return <button onClick={onClick} disabled={disabled} style={{ padding:"9px 22px", borderRadius:6, border:"none", cursor:disabled?"not-allowed":"pointer", fontFamily:"'Georgia', serif", fontWeight:600, fontSize:13, letterSpacing:0.8, opacity:disabled?0.4:1, transition:"transform 0.15s, opacity 0.15s", ...v[variant], ...extraStyle }} onMouseEnter={e=>!disabled&&(e.currentTarget.style.transform="scale(1.04)")} onMouseLeave={e=>(e.currentTarget.style.transform="scale(1)")}>{children}</button>;
}
function SectionDivider({ label }) {
  return <div style={{ display:"flex", alignItems:"center", gap:10, margin:"18px 0" }}><div style={{ flex:1, height:1, background:S.border }}/><span style={{ color:S.textMuted, fontSize:10, fontFamily:"'Courier New',monospace", letterSpacing:2, textTransform:"uppercase" }}>{label}</span><div style={{ flex:1, height:1, background:S.border }}/></div>;
}
function ObsLog({ entries }) {
  if(!entries.length) return null;
  return (
    <div style={{ background:S.cardAlt, border:"1px solid "+S.border, borderRadius:8, padding:"10px 14px", marginTop:12 }}>
      <div style={{ color:S.textMuted, fontSize:9, fontFamily:"'Courier New',monospace", letterSpacing:1.5, textTransform:"uppercase", marginBottom:7 }}>📝 Observation Log</div>
      {entries.map((e,i)=>{ const text=typeof e==="string"?e:e.text; const color=typeof e==="object"&&e.color?e.color:(i===entries.length-1?S.textPrimary:S.textSecondary); return <div key={i} style={{ display:"flex", gap:7, marginBottom:i<entries.length-1?7:0, alignItems:"flex-start" }}><span style={{ color:S.accent, fontSize:10, marginTop:2 }}>›</span><span style={{ color, fontSize:12.5, lineHeight:1.55 }}>{text}</span></div>; })}
    </div>
  );
}
function SuspectCard({ suspect, isFlipped, onFlip, color }) {
  const s=suspect; const cardColor=color||s.color;
  return (
    <div onClick={onFlip} style={{ background:isFlipped?S.cardAlt:S.card, border:"1px solid "+(isFlipped?cardColor+"55":S.border), borderRadius:10, cursor:"pointer", overflow:"hidden", transition:"border-color 0.25s, background 0.25s", minHeight:120 }} onMouseEnter={e=>e.currentTarget.style.borderColor=cardColor+"88"} onMouseLeave={e=>e.currentTarget.style.borderColor=isFlipped?cardColor+"55":S.border}>
      <div style={{ padding:"10px 12px", display:"flex", alignItems:"center", gap:10, borderBottom:isFlipped?"1px solid "+S.border:"none" }}>
        <div style={{ width:38, height:38, borderRadius:"50%", background:cardColor+"20", border:"2px solid "+cardColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{s.portrait}</div>
        <div style={{ flex:1 }}>
          <div style={{ color:S.textPrimary, fontSize:13, fontWeight:700, fontFamily:"'Georgia',serif" }}>{s.name}</div>
          <div style={{ color:cardColor, fontSize:10, fontFamily:"'Courier New',monospace", letterSpacing:1 }}>{s.title.toUpperCase()}</div>
        </div>
        <span style={{ color:S.textMuted, fontSize:16 }}>{isFlipped?"▲":"▼"}</span>
      </div>
      {isFlipped&&<div style={{ padding:"10px 12px 12px" }}>{[["Connection to Scene",s.connection],["Motive",s.motive],["Alibi",s.alibi]].map(([lbl,txt],i)=><div key={lbl} style={{ marginBottom:i<2?8:0 }}><div style={{ color:S.accent, fontSize:9, fontFamily:"'Courier New',monospace", letterSpacing:1.2, textTransform:"uppercase", marginBottom:3 }}>{lbl}</div><p style={{ color:S.textSecondary, fontSize:11.5, margin:0, lineHeight:1.5 }}>{txt}</p></div>)}</div>}
    </div>
  );
}

/* ╔═══════════════════════════════════════════════════════════╗
   ║  TEACHER DASHBOARD                                        ║
   ╚═══════════════════════════════════════════════════════════╝ */
const ION_LABELS = {
  "Cu2+":"Cu²⁺","Cu²+":"Cu²⁺","copper(II)":"Cu²⁺",
  "Zn2+":"Zn²⁺","zinc":"Zn²⁺",
  "NH4+":"NH₄⁺","ammonium":"NH₄⁺",
  "NO3-":"NO₃⁻","nitrate":"NO₃⁻",
  "SO42-":"SO₄²⁻","sulfate":"SO₄²⁻","sulphate":"SO₄²⁻",
  "Cl-":"Cl⁻","chloride":"Cl⁻",
  "CO2":"CO₂","carbon dioxide":"CO₂",
  "SO2":"SO₂","sulfur dioxide":"SO₂","sulphur dioxide":"SO₂",
  "NH3,HCl":"NH₃+HCl","ammonia,hydrogen chloride":"NH₃+HCl",
};
const CASE_IONS = { 0:["Cu²⁺","NO₃⁻","CO₂"], 1:["Zn²⁺","SO₄²⁻","SO₂"], 2:["NH₄⁺","Cl⁻","NH₃+HCl"] };
const CASE_NAMES = ["The Ashworth Affair","The Blackwood Inheritance","The Thornfield Tragedy"];

function StatCard({ icon, label, value, sub, color="#c2955a" }) {
  return (
    <div style={{ background:S.card, border:"1px solid "+S.border, borderRadius:10, padding:"14px 16px", flex:"1 1 140px" }}>
      <div style={{ fontSize:22, marginBottom:4 }}>{icon}</div>
      <div style={{ color, fontSize:22, fontWeight:700, fontFamily:"'Georgia',serif" }}>{value}</div>
      <div style={{ color:S.textPrimary, fontSize:12, fontWeight:600 }}>{label}</div>
      {sub&&<div style={{ color:S.textMuted, fontSize:11, marginTop:2 }}>{sub}</div>}
    </div>
  );
}

function BarRow({ label, value, max, color, right }) {
  const pct = max>0?Math.round((value/max)*100):0;
  return (
    <div style={{ marginBottom:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
        <span style={{ color:S.textSecondary, fontSize:12 }}>{label}</span>
        <span style={{ color, fontSize:12, fontWeight:600 }}>{right||value}</span>
      </div>
      <div style={{ height:6, background:S.cardAlt, borderRadius:3, overflow:"hidden" }}>
        <div style={{ width:pct+"%", height:"100%", background:color, borderRadius:3, transition:"width 0.6s ease" }}/>
      </div>
    </div>
  );
}

function TeacherDashboard({ onBack }) {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("");
  const [tab, setTab] = useState("overview");

  useEffect(()=>{
    const fetch = async () => {
      const snapshot = await getDocs(collection(db, "students"));
      const all = snapshot.docs.map(d=>d.data());
      all.sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp));
      setStudents(all);
    };
    fetch();
  },[]);

  const filtered = students.filter(s=>
    s.id.toLowerCase().includes(filter.toLowerCase())||
    s.fullName.toLowerCase().includes(filter.toLowerCase())||
    s.class.toLowerCase().includes(filter.toLowerCase())
  );

  const totalSessions = students.length;
  const completedAll = students.filter(s=>(s.casesCompleted||[]).length>=3).length;
  const completionRate = totalSessions>0?Math.round((completedAll/totalSessions)*100):0;

  const ionWrong = {}; const ionTotal = {};
  students.forEach(s=>{
    (s.ionAttempts||[]).forEach(a=>{
      const label = ION_LABELS[a.ion]||a.ion;
      ionWrong[label]=(ionWrong[label]||0)+(a.wrong||0);
      ionTotal[label]=(ionTotal[label]||0)+(a.total||0);
    });
  });
  const ionList = Object.keys(ionWrong).sort((a,b)=>ionWrong[b]-ionWrong[a]);
  const maxWrong = ionList.length>0?Math.max(...ionList.map(k=>ionWrong[k])):1;

  const caseTime = {0:[],1:[],2:[]};
  students.forEach(s=>{
    (s.caseTimes||[]).forEach(t=>{
      if(t.caseIdx>=0&&t.caseIdx<=2&&t.minutes>0) caseTime[t.caseIdx].push(t.minutes);
    });
  });
  const avgTime = (arr)=>arr.length>0?(arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(1):null;

  const classMap = {};
  students.forEach(s=>{
    const cls = s.class||"Unknown";
    if(!classMap[cls]) classMap[cls]={ sessions:0, completed:0, wrongAttempts:0 };
    classMap[cls].sessions++;
    if((s.casesCompleted||[]).length>=3) classMap[cls].completed++;
    classMap[cls].wrongAttempts+=(s.ionAttempts||[]).reduce((sum,a)=>sum+(a.wrong||0),0);
  });
  const classList = Object.entries(classMap).sort((a,b)=>b[1].completed-a[1].completed);

  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const deleteStudent = async (id) => {
    await deleteDoc(doc(db, "students", id));
    setStudents(prev=>prev.filter(s=>s.id!==id));
    setConfirmDelete(null);
  };

  const clearAllData = async () => {
    const snapshot = await getDocs(collection(db, "students"));
    await Promise.all(snapshot.docs.map(d=>deleteDoc(doc(db, "students", d.id))));
    setStudents([]);
    setConfirmClear(false);
  };

  const tabs = [{ id:"overview", label:"Overview" },{ id:"analytics", label:"Analytics" },{ id:"students", label:"Students" }];

  return (
    <div>
      <div style={{ marginBottom:18 }}>
        <button onClick={onBack} style={{ background:"transparent", border:"none", color:S.textMuted, fontSize:11, fontFamily:"'Courier New',monospace", cursor:"pointer", padding:0, marginBottom:10 }}>← Back to Registration</button>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <h2 style={{ margin:"0 0 4px", fontFamily:"'Georgia',serif", fontSize:22, color:S.textPrimary }}>Teacher Dashboard</h2>
            <p style={{ color:S.textMuted, fontSize:12, margin:0 }}>{totalSessions} session{totalSessions!==1?"s":""} recorded</p>
          </div>
          <div>
            {!confirmClear?(
              <button onClick={()=>setConfirmClear(true)} style={{ background:"transparent", border:"1px solid "+S.red+"55", borderRadius:6, padding:"6px 12px", cursor:"pointer", color:S.red, fontSize:11, fontFamily:"'Courier New',monospace", transition:"all 0.2s" }} onMouseEnter={e=>{e.currentTarget.style.background=S.red+"12";}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
                🗑️ Clear All Data
              </button>
            ):(
              <div style={{ display:"flex", alignItems:"center", gap:6, background:S.red+"12", border:"1px solid "+S.red+"44", borderRadius:6, padding:"6px 10px" }}>
                <span style={{ color:S.red, fontSize:11, fontFamily:"'Courier New',monospace" }}>Delete all {totalSessions} records?</span>
                <button onClick={clearAllData} style={{ background:S.red, border:"none", borderRadius:4, padding:"3px 10px", cursor:"pointer", color:"#fff", fontSize:11, fontWeight:700 }}>Yes, delete</button>
                <button onClick={()=>setConfirmClear(false)} style={{ background:"transparent", border:"1px solid "+S.border, borderRadius:4, padding:"3px 10px", cursor:"pointer", color:S.textMuted, fontSize:11 }}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:4, marginBottom:18, borderBottom:"1px solid "+S.border, paddingBottom:0 }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ background:"transparent", border:"none", borderBottom:"2px solid "+(tab===t.id?S.accent:"transparent"), padding:"6px 14px 8px", cursor:"pointer", color:tab===t.id?S.accent:S.textMuted, fontSize:13, fontFamily:"'Georgia',serif", fontWeight:600, transition:"color 0.2s", marginBottom:-1 }}>
            {t.label}
          </button>
        ))}
      </div>
      {tab==="overview"&&(
        <div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
            <StatCard icon="👥" label="Total Sessions" value={totalSessions} sub="unique registrations"/>
            <StatCard icon="✅" label="Completed All 3" value={completionRate+"%"} sub={completedAll+" of "+totalSessions+" students"} color="#22c55e"/>
            <StatCard icon="📚" label="Classes Active" value={classList.length} sub="distinct class groups" color="#3b82f6"/>
            <StatCard icon="⚠️" label="Struggling Ions" value={ionList.length>0?ionList[0]:"—"} sub={ionList.length>0?ionWrong[ionList[0]]+" wrong attempts":"no data yet"} color="#f97316"/>
          </div>
          <div style={{ background:S.cardAlt, border:"1px solid "+S.border, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
            <div style={{ color:S.accent, fontSize:11, fontFamily:"'Courier New',monospace", letterSpacing:1.2, textTransform:"uppercase", marginBottom:12 }}>📊 Case Completion</div>
            {CASE_NAMES.map((name,i)=>{
              const done = students.filter(s=>(s.casesCompleted||[]).includes(i)).length;
              return <BarRow key={i} label={name} value={done} max={totalSessions||1} color={["#c2955a","#3b82f6","#8b5cf6"][i]} right={done+" / "+totalSessions}/>;
            })}
          </div>
          {classList.length>0&&(
            <div style={{ background:S.cardAlt, border:"1px solid "+S.border, borderRadius:10, padding:"14px 16px" }}>
              <div style={{ color:S.accent, fontSize:11, fontFamily:"'Courier New',monospace", letterSpacing:1.2, textTransform:"uppercase", marginBottom:12 }}>🏆 Class Leaderboard</div>
              {classList.slice(0,8).map(([cls,data],i)=>{
                const rate = data.sessions>0?Math.round((data.completed/data.sessions)*100):0;
                return (
                  <div key={cls} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                    <span style={{ color:i===0?"#fbbf24":i===1?"#9ca3af":i===2?"#b45309":S.textMuted, fontSize:14, width:20, textAlign:"center" }}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":(i+1)+"."}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                        <span style={{ color:S.textPrimary, fontSize:13, fontWeight:600 }}>Class {cls}</span>
                        <span style={{ color:S.accent, fontSize:12 }}>{rate}% complete</span>
                      </div>
                      <div style={{ height:5, background:S.card, borderRadius:3, overflow:"hidden" }}>
                        <div style={{ width:rate+"%", height:"100%", background:i===0?"#fbbf24":S.accent, borderRadius:3 }}/>
                      </div>
                      <div style={{ color:S.textMuted, fontSize:10, marginTop:2 }}>{data.sessions+" session"+(data.sessions!==1?"s":"")+" · "+data.wrongAttempts+" wrong attempt"+(data.wrongAttempts!==1?"s":"")}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {tab==="analytics"&&(
        <div>
          <div style={{ background:S.cardAlt, border:"1px solid "+S.border, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
            <div style={{ color:S.accent, fontSize:11, fontFamily:"'Courier New',monospace", letterSpacing:1.2, textTransform:"uppercase", marginBottom:4 }}>🧪 Wrong Attempts by Ion / Gas</div>
            <div style={{ color:S.textMuted, fontSize:11, marginBottom:12 }}>Ions with the most wrong answers — areas needing more revision</div>
            {ionList.length===0?(
              <div style={{ color:S.textMuted, fontSize:12, textAlign:"center", padding:"20px 0" }}>No attempt data yet. Data is recorded as students play.</div>
            ):ionList.map(ion=>(
              <BarRow key={ion} label={ion} value={ionWrong[ion]} max={maxWrong} color="#ef4444" right={ionWrong[ion]+" wrong / "+(ionTotal[ion]||0)+" total"}/>
            ))}
          </div>
          <div style={{ background:S.cardAlt, border:"1px solid "+S.border, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
            <div style={{ color:S.accent, fontSize:11, fontFamily:"'Courier New',monospace", letterSpacing:1.2, textTransform:"uppercase", marginBottom:4 }}>⏱️ Average Time per Case</div>
            <div style={{ color:S.textMuted, fontSize:11, marginBottom:12 }}>Cases with longer average times may need additional class support</div>
            {[0,1,2].map(i=>{
              const avg = avgTime(caseTime[i]);
              const maxT = Math.max(...[0,1,2].map(j=>parseFloat(avgTime(caseTime[j])||0)),1);
              return <BarRow key={i} label={CASE_NAMES[i]} value={avg?parseFloat(avg):0} max={maxT} color={["#c2955a","#3b82f6","#8b5cf6"][i]} right={avg?avg+" min avg":"no data"}/>;
            })}
            <div style={{ color:S.textMuted, fontSize:10, marginTop:8, fontStyle:"italic" }}>⚠️ Timing data is only recorded for sessions that complete a case.</div>
          </div>
          <div style={{ background:S.cardAlt, border:"1px solid "+S.border, borderRadius:10, padding:"14px 16px" }}>
            <div style={{ color:S.accent, fontSize:11, fontFamily:"'Courier New',monospace", letterSpacing:1.2, textTransform:"uppercase", marginBottom:12 }}>🔬 Ion Performance by Case</div>
            {[0,1,2].map(cIdx=>(
              <div key={cIdx} style={{ marginBottom:cIdx<2?16:0 }}>
                <div style={{ color:S.textSecondary, fontSize:12, fontWeight:600, marginBottom:6 }}>{CASE_NAMES[cIdx]}</div>
                {(CASE_IONS[cIdx]||[]).map(ion=>{
                  const wrong = ionWrong[ion]||0;
                  const total = ionTotal[ion]||0;
                  const acc = total>0?Math.round(((total-wrong)/total)*100):null;
                  return (
                    <div key={ion} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6, padding:"6px 10px", background:S.card, borderRadius:6 }}>
                      <span style={{ color:S.accent, fontSize:12, fontFamily:"'Courier New',monospace", fontWeight:700, minWidth:60 }}>{ion}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ height:5, background:S.cardAlt, borderRadius:3, overflow:"hidden" }}>
                          <div style={{ width:(acc||0)+"%", height:"100%", background:acc===null?"#555":acc>=80?"#22c55e":acc>=50?"#f97316":"#ef4444", borderRadius:3 }}/>
                        </div>
                      </div>
                      <span style={{ color:acc===null?S.textMuted:acc>=80?"#4ade80":acc>=50?"#fb923c":"#f87171", fontSize:11, minWidth:70, textAlign:"right" }}>
                        {acc===null?"no data":acc+"% correct"}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==="students"&&(
        <div>
          <input type="text" value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search by name, ID, or class…"
            style={{ width:"100%", background:S.card, border:"1px solid "+S.border, borderRadius:6, padding:"10px 12px", color:S.textPrimary, fontSize:13, outline:"none", boxSizing:"border-box", marginBottom:12 }}/>
          <div style={{ background:S.cardAlt, border:"1px solid "+S.border, borderRadius:10, overflow:"hidden" }}>
            {filtered.length===0?(
              <div style={{ padding:40, textAlign:"center", color:S.textMuted }}>{filter?"No students match your search":"No students registered yet"}</div>
            ):(
              <div style={{ maxHeight:500, overflowY:"auto" }}>
                {filtered.map((student,i)=>(
                  <div key={student.id} style={{ padding:"12px 16px", borderBottom:i<filtered.length-1?"1px solid "+S.border:"none" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:4 }}>
                          <span style={{ color:S.accent, fontSize:13, fontWeight:700, fontFamily:"'Georgia',serif" }}>{student.fullName}</span>
                          <span style={{ color:S.textMuted, fontSize:10, fontFamily:"'Courier New',monospace" }}>({student.displayName})</span>
                        </div>
                        <div style={{ display:"flex", gap:14, fontSize:11, color:S.textSecondary, flexWrap:"wrap" }}>
                          <span>📚 Class: <strong style={{ color:S.textPrimary }}>{student.class}</strong></span>
                          <span>✅ Cases: <strong style={{ color:S.accent }}>{(student.casesCompleted||[]).length}/3</strong></span>
                          <span>🕐 {new Date(student.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      <div style={{ flexShrink:0 }}>
                        {confirmDelete===student.id?(
                          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <span style={{ color:S.red, fontSize:10, fontFamily:"'Courier New',monospace" }}>Delete?</span>
                            <button onClick={()=>deleteStudent(student.id)} style={{ background:S.red, border:"none", borderRadius:4, padding:"3px 8px", cursor:"pointer", color:"#fff", fontSize:10, fontWeight:700 }}>Yes</button>
                            <button onClick={()=>setConfirmDelete(null)} style={{ background:"transparent", border:"1px solid "+S.border, borderRadius:4, padding:"3px 8px", cursor:"pointer", color:S.textMuted, fontSize:10 }}>No</button>
                          </div>
                        ):(
                          <button onClick={()=>setConfirmDelete(student.id)} style={{ background:"transparent", border:"1px solid "+S.red+"44", borderRadius:5, padding:"4px 8px", cursor:"pointer", color:S.red, fontSize:11, transition:"all 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background=S.red+"12"} onMouseLeave={e=>e.currentTarget.style.background="transparent"} title="Delete this student">
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PasswordPrompt({ onSuccess, onCancel }) {
  const [pw, setPw] = useState(""); const [err, setErr] = useState(""); const [shake, setShake] = useState(false);
  const PASS = "csi2025";
  const submit = () => { if(pw===PASS){onSuccess();}else{setErr("❌ Incorrect password");setShake(true);setTimeout(()=>setShake(false),400);setPw("");} };
  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, animation:"fade-in 0.3s ease" }}>
      <div style={{ background:S.card, border:"1px solid "+S.border, borderRadius:10, padding:"24px 28px", maxWidth:400, width:"90%", animation:shake?"shake 0.4s ease":"none" }}>
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <div style={{ fontSize:36, marginBottom:8 }}>🔐</div>
          <h3 style={{ margin:"0 0 6px", fontFamily:"'Georgia',serif", fontSize:18, color:S.textPrimary }}>Teacher Access</h3>
          <p style={{ color:S.textMuted, fontSize:12, margin:0 }}>Enter password to view dashboard</p>
        </div>
        <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Password" autoFocus
          style={{ width:"100%", background:S.cardAlt, border:"1px solid "+S.border, borderRadius:6, padding:"10px 12px", color:S.textPrimary, fontSize:14, outline:"none", boxSizing:"border-box", marginBottom:12, fontFamily:"'Courier New',monospace" }}/>
        {err&&<div style={{ color:S.red, fontSize:11, marginBottom:12, textAlign:"center" }}>{err}</div>}
        <div style={{ display:"flex", gap:8 }}>
          <StyledButton onClick={onCancel} variant="ghost" style={{ flex:1 }}>Cancel</StyledButton>
          <StyledButton onClick={submit} style={{ flex:1 }}>Enter</StyledButton>
        </div>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}`}</style>
    </div>
  );
}

function PhaseRegister({ onRegister, onOpenDashboard }) {
  const [name, setName] = useState(""); const [className, setClassName] = useState(""); const [preferredName, setPreferredName] = useState(""); const [error, setError] = useState(""); const [shake, setShake] = useState(false); const [clickCount, setClickCount] = useState(0); const [showPw, setShowPw] = useState(false);
  const getInitials = (n) => n.trim().split(/\s+/).map(w=>w.charAt(0).toUpperCase()).join("");

  const handleSubmit = async () => {
    if(!name.trim()||!className.trim()||!preferredName.trim()){ setError("⚠️ All fields are required!"); setShake(true); setTimeout(()=>setShake(false),400); return; }
    const baseId = getInitials(name).toLowerCase()+"_"+className.trim().toLowerCase().replace(/\s+/g,"_");
    const displayName = preferredName.trim();
    try {
      let finalId = baseId;
      const existing = await getDoc(doc(db, "students", baseId));
      if(existing.exists()){
        let suffix=2;
        while((await getDoc(doc(db, "students", baseId+"_"+suffix))).exists()) suffix++;
        finalId=baseId+"_"+suffix;
      }
      const data = { fullName:name.trim(), displayName, class:className.trim(), id:finalId, timestamp:new Date().toISOString(), casesCompleted:[], ionAttempts:[], caseTimes:[] };
      await setDoc(doc(db, "students", finalId), data);
      onRegister(data);
    } catch(e) { console.error("Firebase error:", e); setError("⚠️ Error: " + e.message); }
  };

  return (
    <div style={{ animation:shake?"shake 0.4s ease":"none" }}>
      <div onClick={()=>{ const n=clickCount+1; setClickCount(n); if(n>=5){setShowPw(true);setClickCount(0);} }} style={{ position:"absolute", top:10, right:10, width:20, height:20, opacity:0.15, cursor:"pointer", fontSize:14, transition:"opacity 0.2s" }} onMouseEnter={e=>e.currentTarget.style.opacity="0.3"} onMouseLeave={e=>e.currentTarget.style.opacity="0.15"} title="Teacher access">🔑</div>
      {showPw&&<PasswordPrompt onSuccess={()=>{setShowPw(false);onOpenDashboard();}} onCancel={()=>setShowPw(false)}/>}
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:48, marginBottom:8 }}>🔍</div>
        <h2 style={{ margin:"0 0 6px", fontFamily:"'Georgia',serif", fontSize:24, color:S.textPrimary }}>Detective Registration</h2>
        <p style={{ color:S.textSecondary, fontSize:13, margin:0, lineHeight:1.6 }}>Welcome to the Metropolitan Police Forensic Division.<br/>Register to begin your qualitative analysis training.</p>
      </div>
      <div style={{ background:S.cardAlt, border:"1px solid "+S.border, borderRadius:10, padding:"20px 24px", marginBottom:16 }}>
        <div style={{ marginBottom:16 }}>
          <label style={{ display:"block", color:S.accent, fontSize:11, fontFamily:"'Courier New',monospace", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>👤 Full Name</label>
          <div style={{ color:S.textMuted, fontSize:10, marginBottom:5 }}>For teacher tracking purposes only</div>
          <input type="text" value={name} onChange={e=>{setName(e.target.value);setError("");setPreferredName("");}} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} placeholder="e.g., Sarah Chen Li Si"
            style={{ width:"100%", background:S.card, border:"1px solid "+S.border, borderRadius:6, padding:"10px 12px", color:S.textPrimary, fontSize:14, fontFamily:"'Georgia',serif", outline:"none", boxSizing:"border-box" }}/>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ display:"block", color:S.accent, fontSize:11, fontFamily:"'Courier New',monospace", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>📚 Class</label>
          <input type="text" value={className} onChange={e=>{setClassName(e.target.value);setError("");}} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} placeholder="e.g., 4A, 4B, 10C"
            style={{ width:"100%", background:S.card, border:"1px solid "+S.border, borderRadius:6, padding:"10px 12px", color:S.textPrimary, fontSize:14, fontFamily:"'Georgia',serif", outline:"none", boxSizing:"border-box" }}/>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ display:"block", color:S.accent, fontSize:11, fontFamily:"'Courier New',monospace", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>🎯 Preferred Name</label>
          <input type="text" value={preferredName} onChange={e=>{setPreferredName(e.target.value);setError("");}} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} placeholder="e.g. Sarah, Xiao Ming, Wei"
            style={{ width:"100%", background:S.card, border:"1px solid "+S.border, borderRadius:6, padding:"10px 12px", color:S.textPrimary, fontSize:14, fontFamily:"'Georgia',serif", outline:"none", boxSizing:"border-box" }}/>
          <div style={{ color:S.textMuted, fontSize:10, marginTop:4 }}>This is the name shown to you during the game</div>
        </div>
        {error&&<div style={{ background:S.red+"12", border:"1px solid "+S.red+"33", borderRadius:6, padding:"8px 12px", marginBottom:12 }}><div style={{ color:S.red, fontSize:12, lineHeight:1.5 }}>{error}</div></div>}
        <div style={{ background:S.accent+"12", border:"1px solid "+S.accent+"55", borderRadius:6, padding:"10px 12px", marginBottom:16 }}>
          <div style={{ color:S.accent, fontSize:11, lineHeight:1.6, textAlign:"center" }}>
            🔄 <strong>Revisiting?</strong> Just register again with the same name and class to start a fresh attempt.
          </div>
        </div>
        <StyledButton onClick={handleSubmit} style={{ width:"100%" }}>Begin Investigation →</StyledButton>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}`}</style>
    </div>
  );
}

function PhaseCaseSelect({ onSelect, detectiveName, theme }) {
  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:20 }}>
        <div style={{ fontSize:32, marginBottom:6 }}>🔍</div>
        <h2 style={{ margin:"0 0 4px", fontFamily:"'Georgia',serif", fontSize:21, color:S.textPrimary }}>Welcome, Detective {detectiveName}</h2>
        <p style={{ color:S.textSecondary, fontSize:12.5, margin:0 }}>You have been tasked with solving three unsolved murders. Each requires you to identify different ions and gases using qualitative analysis.</p>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {CASES.map((c,i)=>(
          <button key={c.id} onClick={()=>onSelect(i)} style={{ background:S.cardAlt, border:"1px solid "+S.border, borderRadius:10, padding:"14px 16px", cursor:"pointer", textAlign:"left", transition:"border-color 0.2s, background 0.2s" }} onMouseEnter={e=>{e.currentTarget.style.borderColor=S.accent;e.currentTarget.style.background=S.accent+"08";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=S.border;e.currentTarget.style.background=S.cardAlt;}}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
              <div style={{ fontSize:30, flexShrink:0 }}>{c.coverIcon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                  <div style={{ color:S.textPrimary, fontSize:15, fontWeight:700, fontFamily:"'Georgia',serif" }}>{c.title}</div>
                  <div style={{ color:c.difficulty==="Intermediate"?(theme==="dark"?"#60a5fa":"#1d4ed8"):c.difficulty==="Challenging"?(theme==="dark"?"#fb923c":"#b45309"):(theme==="dark"?"#f87171":"#991b1b"), fontSize:9, fontFamily:"'Courier New',monospace", letterSpacing:1, border:"1px solid currentColor", borderRadius:3, padding:"1px 6px" }}>{c.difficulty.toUpperCase()}</div>
                </div>
                <div style={{ color:S.textMuted, fontSize:10, fontFamily:"'Courier New',monospace", marginBottom:4 }}>Case {c.caseNumber}</div>
                <p style={{ color:S.textSecondary, fontSize:12, margin:0, lineHeight:1.5 }}>{c.subtitle}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PhaseIntro({ caseData, onStart, onBack, suspectColors }) {
  const [flipped, setFlipped] = useState(null);
  return (
    <div>
      <button onClick={onBack} style={{ background:"transparent", border:"none", color:S.textMuted, fontSize:11, fontFamily:"'Courier New',monospace", cursor:"pointer", padding:0, marginBottom:10 }}>← Back to case list</button>
      <div style={{ background:S.cardAlt, border:"1px solid "+S.border, borderRadius:10, overflow:"hidden", marginBottom:20 }}>
        <div style={{ background:S.red+"18", borderBottom:"1px solid "+S.red+"33", padding:"8px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ color:S.red, fontSize:11, fontFamily:"'Courier New',monospace", letterSpacing:1.5, fontWeight:700 }}>🚨 CONFIDENTIAL — METROPOLITAN POLICE</span>
          <span style={{ color:S.textMuted, fontSize:10 }}>Case {caseData.caseNumber}</span>
        </div>
        <div style={{ padding:"14px 18px" }}>
          <div style={{ color:S.accent, fontSize:13, fontWeight:700, fontFamily:"'Georgia',serif", marginBottom:6 }}>INITIAL INCIDENT REPORT</div>
          <p style={{ color:S.textSecondary, fontSize:13, margin:0, lineHeight:1.7 }}><strong style={{ color:S.textPrimary }}>Victim:</strong> {caseData.victim.name}<br/><br/>{caseData.victim.summary}</p>
          <div style={{ marginTop:12, padding:"10px 12px", background:S.red+"0a", border:"1px solid "+S.red+"22", borderRadius:6 }}>
            <p style={{ color:S.textSecondary, fontSize:12.5, margin:0, lineHeight:1.6 }}><strong style={{ color:S.red }}>YOUR BRIEFING:</strong> Three crime scenes have been identified. Each contains physical evidence that must be analysed using chemical tests. Collect your findings and build a case to identify the killer.</p>
          </div>
        </div>
      </div>
      <SectionDivider label="Suspect Dossiers — click each card to read"/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:8, marginBottom:20 }}>
        {caseData.suspects.map(s=><SuspectCard key={s.id} suspect={s} isFlipped={flipped===s.id} onFlip={()=>setFlipped(flipped===s.id?null:s.id)} color={suspectColors[s.id]}/>)}
      </div>
      <StyledButton onClick={onStart} style={{ width:"100%" }}>Enter the Crime Scene →</StyledButton>
    </div>
  );
}

function PhaseStation({ station, onSolved, caseIdx, detectiveId, theme }) {
  const [reportOpen, setReportOpen] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [sampleInTube, setSampleInTube] = useState(false);
  const [reagentsAdded, setReagentsAdded] = useState([]);
  const [excessAdded, setExcessAdded] = useState(null);
  const [log, setLog] = useState([]);
  const [solved, setSolved] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [answerInput, setAnswerInput] = useState("");
  const [shake, setShake] = useState(false);
  const [answerError, setAnswerError] = useState("");
  const [gasUsed, setGasUsed] = useState(null);
  const [canisterOpen, setCanisterOpen] = useState(false);
  const [gasTestVisualResult, setGasTestVisualResult] = useState(null);
  const [isHeating, setIsHeating] = useState(false);
  const [airHoleOpen, setAirHoleOpen] = useState(false);
  const [hasHeated, setHasHeated] = useState(false);
  const [litmusUsed, setLitmusUsed] = useState({ red:false, blue:false });
  const [stationStartTime] = useState(Date.now());
  const [visualState, setVisualState] = useState({ liquidLevel:0, liquidColor:"transparent", precipitateColor:null, precipitateHeight:0, bubbling:false, animating:null });

  const MAX_ATTEMPTS = 3;
  const CAPS_MSG = "⚠️ Wrong capitalization! Chemical formulas use element symbols from the Periodic Table. Examples: C (carbon), O (oxygen), N (nitrogen), Cl (chlorine).";
  const isGasStation = !!station.gasTests||!!station.mixedGas;
  const gasContainerId = isGasStation?station.objects[0].id:null;
  const isWellhouseLike = !isGasStation&&station.reagents.includes("Ba(NO₃)₂ solution")&&station.reactions["Ba(NO₃)₂ solution"]&&station.reactions["Ba(NO₃)₂ solution"].first_without_acid;
  const isAgnoFirstStation = !isGasStation&&station.reactions["AgNO₃ solution"]&&station.reactions["AgNO₃ solution"].first_without_acid;
  const gasTestItems = isGasStation?station.objects.filter(o=>o.id!==gasContainerId):[];

  const addLog = useCallback((msg)=>setLog(p=>[...p,msg]),[]);

  const pickUp = (obj) => {
    if(inventory.includes(obj.id)) return;
    setInventory(p=>[...p,obj.id]);
    addLog("You pick up: "+obj.label+".");
    if(isGasStation&&obj.id===gasContainerId) setCanisterOpen(true);
  };

  const getInitialSampleColor = () => {
    if(station.title&&station.title.includes("Kitchen")||station.id==="kitchen") return "#7dd3fc55";
    return "rgba(255,255,255,0.0)";
  };

  const updateVisual = (vd) => {
    if(!vd) return;
    if(vd.type==="ppt"){ setVisualState(v=>({...v,precipitateColor:vd.color,precipitateHeight:25,bubbling:false,animating:"settling"})); setTimeout(()=>setVisualState(v=>({...v,animating:null})),800); }
    else if(vd.type==="solution"){ setVisualState(v=>({...v,precipitateColor:null,precipitateHeight:0,liquidColor:vd.color==="transparent"?"rgba(255,255,255,0.0)":vd.color,bubbling:false,animating:null})); }
    else if(vd.type==="bubbling"){ setVisualState(v=>({...v,precipitateColor:null,precipitateHeight:0,liquidColor:vd.color||"rgba(255,255,255,0.0)",bubbling:true,animating:null})); }
    else if(vd.type==="heating"){ setVisualState(v=>({...v,bubbling:vd.bubbles||false,animating:null})); }
  };

  const addReagent = (reagent) => {
    const isCationReagent = reagent==="NaOH solution"||reagent==="Aqueous NH₃";
    if(isCationReagent&&reagentsAdded.length>0&&!reagentsAdded.includes(reagent)){
      const first=reagentsAdded[0];
      if(first==="NaOH solution"||first==="Aqueous NH₃"){ addLog("⚠️ You cannot mix different reagents in the same test tube! You already added "+first+". Please use a fresh test tube to test with "+reagent+"."); return; }
    }
    if(reagentsAdded.includes(reagent)){
      if(excessAdded===reagent){ addLog("You have already added excess of this reagent."); return; }
      setExcessAdded(reagent);
      const rx=station.reactions[reagent];
      if(rx&&rx.excess){ addLog("Same test tube — "+rx.excess.text); updateVisual(rx.excess.visual); }
      else addLog("Same test tube — You add more "+reagent+" … no further change is observed.");
      return;
    }
    if(isWellhouseLike&&reagent==="Ba(NO₃)₂ solution"&&!reagentsAdded.includes("Dilute HNO₃")){
      setReagentsAdded(p=>[...p,reagent]);
      const rx=station.reactions["Ba(NO₃)₂ solution"].first_without_acid;
      addLog("Fresh test tube with new sample — "+rx.text);
      setVisualState({liquidLevel:60,liquidColor:getInitialSampleColor(),precipitateColor:null,precipitateHeight:0,bubbling:false,animating:null});
      updateVisual(rx.visual); return;
    }
    if(isAgnoFirstStation&&reagent==="AgNO₃ solution"&&!reagentsAdded.includes("Dilute HNO₃")){
      setReagentsAdded(p=>[...p,reagent]);
      const rx=station.reactions["AgNO₃ solution"].first_without_acid;
      addLog("Fresh test tube with new sample — "+rx.text);
      setVisualState({liquidLevel:60,liquidColor:getInitialSampleColor(),precipitateColor:null,precipitateHeight:0,bubbling:false,animating:null});
      updateVisual(rx.visual); return;
    }
    if(reagent==="Aluminium foil"&&station.reactions["Aluminium foil"]&&station.reactions["Aluminium foil"].first_without_naoh&&!reagentsAdded.includes("NaOH solution")){
      setReagentsAdded(p=>[...p,reagent]);
      addLog("⚠️ "+station.reactions["Aluminium foil"].first_without_naoh.text); return;
    }
    setReagentsAdded(p=>[...p,reagent]);
    const rx=station.reactions[reagent];
    const isFresh=reagentsAdded.length===0;
    const prefix=isFresh?"Fresh test tube with new sample — ":"Same test tube — ";
    if(isFresh) setVisualState({liquidLevel:60,liquidColor:getInitialSampleColor(),precipitateColor:null,precipitateHeight:0,bubbling:false,animating:null});
    if(isWellhouseLike&&reagent==="Ba(NO₃)₂ solution"&&reagentsAdded.includes("Dilute HNO₃")){ addLog(prefix+rx.first_with_acid.text); updateVisual(rx.first_with_acid.visual); }
    else if(isAgnoFirstStation&&reagent==="AgNO₃ solution"&&reagentsAdded.includes("Dilute HNO₃")){ addLog(prefix+rx.first_with_acid.text); updateVisual(rx.first_with_acid.visual); }
    else if(reagent==="Aluminium foil"&&reagentsAdded.includes("NaOH solution")&&rx&&rx.first_with_naoh){ addLog(prefix+rx.first_with_naoh.text); updateVisual(rx.first_with_naoh.visual); }
    else if(rx&&rx.first){ addLog(prefix+rx.first.text); updateVisual(rx.first.visual); }
  };

  const heatSample = () => {
    if(!station.heating) return;
    const required=station.heating.requiresReagent;
    const hasRequired=Array.isArray(required)?required.some(r=>reagentsAdded.includes(r)):reagentsAdded.includes(required);
    if(!hasRequired){ addLog("⚠️ You need to add "+(Array.isArray(required)?required.join(" or "):required)+" first before heating."); return; }
    if(required==="Aluminium foil"){
      if(!reagentsAdded.includes("NaOH solution")){ addLog("⚠️ The aluminium won't react properly without NaOH solution to create an alkaline environment. Add NaOH first."); return; }
      if(reagentsAdded.includes("Dilute HNO₃")||reagentsAdded.includes("Dilute HCl")){ addLog("⚠️ You added acid after NaOH, which neutralizes the alkaline conditions. Start with a fresh sample."); return; }
    }
    if(!airHoleOpen){ addLog("🟡 The Bunsen burner is lit but the air hole is CLOSED — the yellow safety flame is too cool. Open the air hole for a hot blue flame."); setIsHeating(true); setTimeout(()=>setIsHeating(false),1800); return; }
    if(isHeating) return;
    setIsHeating(true);
    if(hasHeated){ addLog("🔥 You heat the mixture again..."); setTimeout(()=>{ const r=station.heating.result; if(r){ let t=r.text; if(r.textWithPrecipitate&&r.textWithoutPrecipitate) t=excessAdded?r.textWithoutPrecipitate:r.textWithPrecipitate; addLog(t); } setIsHeating(false); },1500); return; }
    addLog("🔥 You place the test tube over the hot blue Bunsen flame and warm it gently...");
    setTimeout(()=>{
      setHasHeated(true);
      const r=station.heating.result;
      if(r){ let t=r.text; if(r.textWithPrecipitate&&r.textWithoutPrecipitate) t=excessAdded?r.textWithoutPrecipitate:r.textWithPrecipitate; addLog(t); if(r.visual) updateVisual(r.visual); if(r.gasTest&&!litmusUsed.red&&!litmusUsed.blue) setTimeout(()=>addLog("💡 TIP: Test the pungent gas with damp red litmus paper or damp blue litmus paper to observe the color change!"),1500); }
      setIsHeating(false);
    },2500);
  };

  const useLitmus = (color) => {
    if(!hasHeated){ addLog("⚠️ You need to heat the mixture first to release the ammonia gas."); return; }
    if(color==="red"){
      setLitmusUsed(p=>({...p,red:true}));
      addLog("🔴➡️🔵 You hold the damp RED litmus paper near the mouth of the test tube. The paper turns BLUE!");
      setGasTestVisualResult({itemId:"litmus_red_nh4",visualKey:"litmus_red_to_blue",timestamp:Date.now()});
    } else {
      setLitmusUsed(p=>({...p,blue:true}));
      addLog("🔵 You hold the damp BLUE litmus paper near the mouth of the test tube. The paper stays BLUE. Try the red litmus paper for a clearer result!");
      setGasTestVisualResult({itemId:"litmus_blue_nh4",visualKey:"litmus_blue_stays",timestamp:Date.now()});
    }
  };

  const recordAttempt = async (ionKey, usedAllAttempts) => {
    if(!detectiveId) return;
    try {
      const ref = doc(db, "students", detectiveId);
      const snap = await getDoc(ref);
      const data = snap.data();
      if(!data.ionAttempts) data.ionAttempts=[];
      const existing=data.ionAttempts.find(a=>a.ion===ionKey);
      if(existing){ existing.total+=1; if(usedAllAttempts) existing.wrong+=1; }
      else data.ionAttempts.push({ion:ionKey, wrong:usedAllAttempts?1:0, total:1});
      await setDoc(ref, data);
    } catch(e){}
  };

  const recordCaseTime = async (cIdx) => {
    if(!detectiveId) return;
    try {
      const mins=(Date.now()-stationStartTime)/60000;
      const ref = doc(db, "students", detectiveId);
      const snap = await getDoc(ref);
      const data = snap.data();
      if(!data.caseTimes) data.caseTimes=[];
      data.caseTimes.push({caseIdx:cIdx, minutes:parseFloat(mins.toFixed(1))});
      await setDoc(ref, data);
    } catch(e){}
  };

  const useOnGas = (itemId) => {
    setGasUsed(itemId);
    const result=station.gasTests&&station.gasTests[itemId];
    if(!result) return;
    addLog(result.text);
    let visualKey=null;
    if(itemId.includes("litmus_red")){
      if(result.text.includes("turns BLUE")&&result.text.includes("turns RED again")) visualKey="litmus_red_sequential";
      else if(result.text.includes("BLEACH")) visualKey="litmus_red_bleached";
      else if(result.text.includes("turns BLUE")) visualKey="litmus_red_to_blue";
      else visualKey="litmus_red_stays";
    } else if(itemId.includes("litmus_blue")){
      if(result.text.includes("BLEACH")) visualKey="litmus_blue_bleached";
      else if(result.text.includes("turns RED")) visualKey="litmus_blue_to_red";
      else visualKey="litmus_blue_stays";
    } else if(itemId==="limewater_tube"){
      if(result.text.includes("dissolves")||result.text.includes("further bubbling")) visualKey="limewater_co2";
      else if(result.text.includes("white precipitate")) visualKey="limewater_white";
      else visualKey="limewater_clear";
    } else if(itemId.includes("kmno4_paper")){
      visualKey=result.text.includes("DECOLOUR")||result.text.includes("bleach")?"kmno4_decolorized":"kmno4_stays";
    } else if(itemId.includes("splint_burning")){
      if(result.text.includes("EXTINGUISH")||result.text.includes("extinguish")) visualKey="splint_burning_extinguished";
      else if(result.text.includes("squeaky pop")) visualKey="splint_burning_pops";
      else visualKey="splint_burning_stays";
    } else if(itemId.includes("splint_glowing")){
      const tl=result.text.toLowerCase();
      visualKey=tl.includes("does not relight")||tl.includes("not relight")?"splint_glowing_stays":"splint_glowing_relight";
    }
    if(visualKey) setGasTestVisualResult({itemId,visualKey,timestamp:Date.now()});
  };

  const tryUnlock = () => {
    if(!answerInput.trim()) return;
    const input=answerInput.trim();
    const inputLower=input.toLowerCase();
    const inputNoSpaces=input.replace(/\s+/g,"");
    const inputNoSpacesLower=inputNoSpaces.toLowerCase();

    const wrongCaseFormulas=["co2","Co2","cO2","so2","So2","sO2","nh3","Nh3","nH3","hcl","Hcl","hCl"];
    if(wrongCaseFormulas.includes(inputNoSpaces)){
      setAttemptCount(c=>c+1); setShake(true);
      setAnswerError(CAPS_MSG);
      setTimeout(()=>setShake(false),500); return;
    }

    if(station.answer.requiresBoth&&Array.isArray(station.answer.accepted[0])){
      const parts=input.split(/\s*(?:,|and|\+)\s*/i).map(s=>s.trim()).filter(Boolean);
      if(parts.length!==2){
        setAttemptCount(c=>c+1); setWrongCount(c=>c+1); setShake(true);
        setAnswerError("⚠️ You need to identify TWO gases. Separate them with comma or 'and'. "+Math.max(0,3-wrongCount-1)+" attempt"+(Math.max(0,3-wrongCount-1)===1?"":"s")+" remaining");
        setTimeout(()=>setShake(false),500); return;
      }
      const badCaps = parts.some(p=>{
        const pns=p.replace(/\s+/g,"");
        return (pns.toLowerCase()==="nh3"&&pns!=="NH3")||(pns.toLowerCase()==="hcl"&&pns!=="HCl");
      });
      if(badCaps){ setAttemptCount(c=>c+1); setShake(true); setAnswerError(CAPS_MSG); setTimeout(()=>setShake(false),500); return; }
      const normalize=str=>str.replace(/[²³⁺⁻₂₃\s]/g,m=>m==="²"||m==="₂"?"2":m==="³"||m==="₃"?"3":m==="⁺"?"+":m==="⁻"?"-":"");
      const p1=normalize(parts[0]); const p2=normalize(parts[1]);
      if(parts[0].toLowerCase().trim()==="hydrochloric acid"||parts[1].toLowerCase().trim()==="hydrochloric acid"){
        setShake(true); setAnswerError("⚠️ \"Hydrochloric acid\" is HCl dissolved in water. The gas is called \"hydrogen chloride\". Use \"hydrogen chloride\" or \"HCl\".");
        setTimeout(()=>setShake(false),500); return;
      }
      let matchFound=false;
      for(const pair of station.answer.accepted){
        const a1=normalize(pair[0]); const a2=normalize(pair[1]);
        if((p1.toLowerCase()===a1.toLowerCase()&&p2.toLowerCase()===a2.toLowerCase())||(p1.toLowerCase()===a2.toLowerCase()&&p2.toLowerCase()===a1.toLowerCase())){ matchFound=true; break; }
      }
      if(matchFound){
        recordAttempt("NH3,HCl", false);
        recordCaseTime(caseIdx);
        setSolved(true);
        addLog({text:"✓ Correct! Both gases identified: "+parts[0]+" and "+parts[1],color:"#15803d"});
        addLog({text:"🔓 "+station.solvedMessage,color:"#15803d"}); return;
      }
      setAttemptCount(c=>c+1); setWrongCount(c=>c+1);
      if(wrongCount+1>=3){
        recordAttempt("NH3,HCl", true);
        setShake(true); setAnswerError("❌ Maximum attempts reached. The correct answer was: NH₃ and HCl");
        setTimeout(()=>setShake(false),500);
        setSolved(true);
        addLog({text:"✗ Maximum attempts reached. Correct answer: NH₃ and HCl. NH₄Cl(s) ⇌ NH₃(g) + HCl(g)",color:"#ef4444"});
        addLog({text:"🔓 "+station.solvedMessage,color:"#ef4444"}); return;
      }
      const hintMsg=wrongCount+1===1?"💡 Red litmus turned blue, then red again = TWO gases: one alkaline, one acidic.":"💡 Think about NH₄⁺ + Cl⁻. What compound do these form? What happens when you heat it?";
      setShake(true); setAnswerError("❌ Incorrect. "+hintMsg+" "+(3-wrongCount-1)+" attempt"+(3-wrongCount-1===1?"":"s")+" remaining");
      setTimeout(()=>setShake(false),500); return;
    }

    const normalizeSubscripts=s=>s.replace(/[₂₃]/g,m=>m==="₂"?"2":"3");
    const inputNorm=normalizeSubscripts(inputNoSpaces);
    const formulaAccepted=station.answer.accepted.filter(a=>a.includes("+")||a.includes("-")||/^[A-Z][a-z]?\d/.test(a));
    const nameAccepted=station.answer.accepted.filter(a=>!formulaAccepted.includes(a));
    const ionKey=station.answer.accepted[0];

    const correctButWrongCase=formulaAccepted.some(a=>inputNoSpacesLower===a.toLowerCase()&&inputNoSpaces!==a);
    const looksLikeFormulaButLower=/^[a-z][a-z]?\d/.test(inputNorm)&&formulaAccepted.some(a=>inputNorm.toLowerCase()===normalizeSubscripts(a).toLowerCase()&&inputNorm!==normalizeSubscripts(a));

    if(correctButWrongCase||looksLikeFormulaButLower){
      setAttemptCount(c=>c+1); setShake(true);
      setAnswerError(CAPS_MSG);
      setTimeout(()=>setShake(false),500); return;
    }

    if(/^zinc\s*\([ivx]+\)$/i.test(input)||/^zn\s*\([ivx]+\)$/i.test(input)){ setAttemptCount(c=>c+1); setShake(true); setAnswerError("❌ Zinc does NOT use Roman numerals. Write \"zinc\" or \"Zn2+\"."); setTimeout(()=>setShake(false),500); return; }
    if(/^sulf?ate\s*\([ivx]+\)/i.test(input)||/^nitrate\s*\([ivx]+\)/i.test(input)||/^chloride\s*\([ivx]+\)/i.test(input)){ setAttemptCount(c=>c+1); setShake(true); setAnswerError("❌ Anions do not use Roman numerals."); setTimeout(()=>setShake(false),500); return; }
    if(/^ammonium\s*\([ivx]+\)/i.test(input)){ setAttemptCount(c=>c+1); setShake(true); setAnswerError("❌ Ammonium is a cation (NH₄⁺), not a transition metal — it does not use Roman numerals. Write \"ammonium\" or \"NH4+\"."); setTimeout(()=>setShake(false),500); return; }

    const formulaMatch=formulaAccepted.some(a=>{ const an=normalizeSubscripts(a).replace(/[²³⁺⁻]/g,m=>m==="²"?"2":m==="³"?"3":m==="⁺"?"+":"-"); return inputNorm===an; });
    const nameMatch=nameAccepted.some(a=>{ if(/\([IVX]+\)/.test(a)){ const bp=a.match(/\([IVX]+\)/)[0]; if(!input.includes(bp)) return false; const np=a.replace(/\([IVX]+\)/,"").trim(); return inputLower.includes(np.toLowerCase()); } return inputLower.includes(a.toLowerCase()); });
    const partialMatch=station.answer.partialCredit&&station.answer.partialCredit.some(a=>{ const an=normalizeSubscripts(a).replace(/[²³⁺⁻]/g,m=>m==="²"?"2":m==="³"?"3":m==="⁺"?"+":"-"); return inputNorm.toLowerCase()===an.toLowerCase(); });

    if(formulaMatch||nameMatch){
      recordAttempt(ionKey, false);
      recordCaseTime(caseIdx);
      setSolved(true);
      const formatted=station.answer.accepted[0].replace(/2\+/g,"²⁺").replace(/3\+/g,"³⁺").replace(/2-/g,"²⁻").replace(/42-/g,"₄²⁻").replace(/(\d)/g,m=>({2:"₂",3:"₃",4:"₄"}[m]||m));
      addLog({text:"✓ Correct! The answer is: "+formatted,color:"#15803d"});
      addLog({text:"🔓 "+station.solvedMessage,color:"#15803d"});
    } else if(partialMatch){
      setAttemptCount(c=>c+1); setShake(true);
      let msg="❌ Correct element, but check your format.";
      if(/copper\(i+\)/i.test(input)&&!/copper\(II\)/.test(input)) msg="❌ Roman numerals must be UPPERCASE. Write copper(II), not copper(ii).";
      else if(input.includes("+2")||input.includes("2+")) msg="❌ Charge should be written as 2+ (not +2). Use Cu2+ or copper(II).";
      setAnswerError(msg); setTimeout(()=>setShake(false),400);
    } else {
      setAttemptCount(c=>c+1); setWrongCount(c=>c+1);
      let msg="Incorrect answer.";
      if(inputLower==="copper"||inputLower==="iron"||inputLower==="manganese") msg="❌ Transition metals need Roman numerals in brackets! (e.g., copper(II))";
      else if(inputLower.includes("zinc(ii)")||inputLower.includes("aluminium(iii)")) msg="❌ Zinc and aluminium are NOT transition metals — use plain name only!";
      else if((inputLower.includes("copper")&&inputLower.includes("ii")&&!input.includes("("))||(inputLower.includes("iron")&&inputLower.includes("ii")&&!input.includes("("))) msg="❌ Missing brackets! Use copper(II), not copperII.";
      if(attemptCount+1>=MAX_ATTEMPTS){
        recordAttempt(ionKey, true);
        setSolved(true);
        const formatted=station.answer.accepted[0].replace(/2\+/g,"²⁺").replace(/3\+/g,"³⁺").replace(/2-/g,"²⁻").replace(/42-/g,"₄²⁻").replace(/(\d)/g,m=>({2:"₂",3:"₃",4:"₄"}[m]||m));
        addLog({text:"❌ Maximum attempts reached. Correct answer: "+formatted,color:"#dc2626"});
        addLog({text:"🔓 "+station.solvedMessage+" Please revise the tests for this ion/gas!",color:"#dc2626"});
      } else {
        setShake(true); setAnswerError(msg+" "+(MAX_ATTEMPTS-attemptCount-1)+" attempt"+(MAX_ATTEMPTS-attemptCount-1!==1?"s":"")+" remaining.");
        setTimeout(()=>setShake(false),400);
      }
    }
  };

  const hasSample=inventory.includes(station.objects[0]&&station.objects[0].id);
  const canAddReagents=!isGasStation&&sampleInTube;

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
        <span style={{ fontSize:26 }}>{station.icon}</span>
        <div>
          <h2 style={{ margin:0, fontFamily:"'Georgia',serif", fontSize:20, color:S.textPrimary }}>{station.title}</h2>
          <span style={{ color:S.textMuted, fontSize:11, fontFamily:"'Courier New',monospace" }}>EVIDENCE STATION</span>
        </div>
      </div>
      <p style={{ color:S.textSecondary, fontSize:13, margin:"0 0 14px", lineHeight:1.6, fontStyle:"italic" }}>{station.locationDesc}</p>
      <div style={{ marginBottom:14 }}>
        <button onClick={()=>setReportOpen(!reportOpen)} style={{ background:S.red+"12", border:"1px solid "+S.red+"33", borderRadius:6, padding:"7px 14px", cursor:"pointer", color:S.red, fontSize:12, fontFamily:"'Courier New',monospace", letterSpacing:0.8, width:"100%", textAlign:"left", display:"flex", justifyContent:"space-between" }}>
          <span>📄 Scene Report — Officer Wren</span><span>{reportOpen?"▲ close":"▼ read"}</span>
        </button>
        {reportOpen&&<div style={{ background:S.cardAlt, border:"1px solid "+S.border, borderRadius:"0 0 6px 6px", padding:"12px 14px", marginTop:-1 }}><pre style={{ color:S.textSecondary, fontSize:11.5, margin:0, lineHeight:1.7, whiteSpace:"pre-wrap", fontFamily:"'Courier New',monospace" }}>{station.policeReport}</pre></div>}
      </div>
      <SectionDivider label="Interact with the evidence"/>
      <div style={{ background:S.blue+"0e", border:"1px solid "+S.blue+"33", borderRadius:6, padding:"8px 12px", marginBottom:12 }}>
        <div style={{ color:S.blue, fontSize:10, fontFamily:"'Courier New',monospace", letterSpacing:0.5, display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:16 }}>🧪</span>
          <span><strong>Lab Protocol:</strong> Each chemical test uses a fresh sample in a new test tube. Adding excess reagent uses the same test tube.</span>
        </div>
      </div>
      <div style={{ background:S.cardAlt, border:"1px solid "+S.border, borderRadius:10, padding:16, marginBottom:12 }}>
        {!isGasStation&&(
          <div style={{ display:"flex", gap:10, alignItems:"flex-end", flexWrap:"wrap", marginBottom:12 }}>
            {!hasSample?(
              <button onClick={()=>pickUp(station.objects[0])} style={{ background:S.card, border:"2px dashed "+S.borderHi, borderRadius:8, padding:"10px 14px", cursor:"pointer", transition:"border-color 0.2s" }} onMouseEnter={e=>e.currentTarget.style.borderColor=S.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=S.borderHi}>
                <div style={{ fontSize:28, textAlign:"center" }}>{station.objects[0].icon}</div>
                <div style={{ color:S.accent, fontSize:10, textAlign:"center", fontFamily:"'Courier New',monospace", marginTop:3 }}>{station.objects[0].label}</div>
                <div style={{ color:S.textMuted, fontSize:9, textAlign:"center" }}>click to pick up</div>
              </button>
            ):!sampleInTube?(
              <button onClick={()=>{ setSampleInTube(true); setHasHeated(false); setLitmusUsed({red:false,blue:false}); setReagentsAdded([]); setExcessAdded(null); setVisualState({liquidLevel:60,liquidColor:getInitialSampleColor(),precipitateColor:null,precipitateHeight:0,bubbling:false,animating:null}); addLog("You pour the sample into a clean test tube — ready for reagent tests."); }} style={{ background:S.card, border:"2px dashed "+S.accent, borderRadius:8, padding:"10px 14px", cursor:"pointer" }}>
                <div style={{ fontSize:22, textAlign:"center" }}>🧪</div>
                <div style={{ color:S.accent, fontSize:10, textAlign:"center", fontFamily:"'Courier New',monospace", marginTop:3 }}>Pour into test tube</div>
              </button>
            ):(
              <div style={{ display:"flex", gap:8, alignItems:"flex-start", flexWrap:"wrap" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                  <TestTubeDropZone onReagentDrop={addReagent}>
                    <VisualTestTube liquidLevel={visualState.liquidLevel} liquidColor={visualState.liquidColor} precipitateColor={visualState.precipitateColor} precipitateHeight={visualState.precipitateHeight} bubbling={visualState.bubbling} animating={visualState.animating} isHeating={isHeating} airHoleOpen={airHoleOpen} theme={theme}/>
                  </TestTubeDropZone>
                  {log.length>0&&(
                    <div style={{ flex:1, marginTop:12, padding:"10px 12px", background:S.accent+"12", border:"1px solid "+S.accent+"44", borderRadius:8 }}>
                      <div style={{ color:S.accent, fontSize:9, fontFamily:"'Courier New',monospace", letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>🔬 Latest Observation</div>
                      <div style={{ color:S.textPrimary, fontSize:12, lineHeight:1.55 }}>{typeof log[log.length-1]==="string"?log[log.length-1]:log[log.length-1].text}</div>
                    </div>
                  )}
                </div>
                {station.heating&&station.heating.result&&station.heating.result.gasTest&&gasTestVisualResult&&(
                  <div style={{ padding:12, background:S.card, border:"1px solid "+S.accent+"44", borderRadius:8, minWidth:140 }}>
                    <div style={{ color:S.accent, fontSize:10, fontFamily:"'Courier New',monospace", marginBottom:8, textAlign:"center", letterSpacing:1 }}>🔬 TEST RESULT</div>
                    <div style={{ display:"flex", justifyContent:"center" }}><GasTestVisual key={gasTestVisualResult.timestamp} testItem={gasTestVisualResult.itemId} result={gasTestVisualResult.visualKey} theme={theme}/></div>
                  </div>
                )}
              </div>
            )}
            {canAddReagents&&(
              <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginTop:12, padding:"12px", background:S.cardAlt+"88", borderRadius:8, border:"1px solid "+S.border }}>
                <div style={{ width:"100%", color:S.textMuted, fontSize:9, fontFamily:"'Courier New',monospace", textAlign:"center", marginBottom:4 }}>
                  ↓ Drag reagent bottles to test tube ↓<br/>
                  <span style={{ fontSize:8, color:S.accent }}>⚠️ For cation tests: Use ONE reagent only, then add excess of the SAME reagent</span>
                </div>
                {station.reagents.map(r=>{ const added=reagentsAdded.includes(r); return <DraggableReagentBottle key={r} name={r} used={added}/>; })}
                {reagentsAdded.length>0&&(
                  <button onClick={()=>{ setReagentsAdded([]); setExcessAdded(null); setVisualState({liquidLevel:60,liquidColor:getInitialSampleColor(),precipitateColor:null,precipitateHeight:0,bubbling:false,animating:null}); addLog("🧪 Fresh test tube with new sample prepared."); }} style={{ width:"100%", background:S.card, border:"2px dashed "+S.blue, borderRadius:8, padding:"10px 14px", cursor:"pointer", marginTop:8 }} onMouseEnter={e=>e.currentTarget.style.borderColor=S.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=S.blue}>
                    <div style={{ fontSize:20, textAlign:"center" }}>🧪</div>
                    <div style={{ color:S.blue, fontSize:10, textAlign:"center", fontFamily:"'Courier New',monospace", marginTop:3 }}>Use Fresh Test Tube</div>
                  </button>
                )}
                {station.heating&&sampleInTube&&(()=>{ const req=station.heating.requiresReagent; return Array.isArray(req)?req.some(r=>reagentsAdded.includes(r)):reagentsAdded.includes(req); })()&&(
                  <>
                    <button onClick={()=>{ setAirHoleOpen(o=>!o); addLog(airHoleOpen?"🟡 You close the air hole. The flame turns YELLOW — a cool safety flame (~300°C), not suitable for heating.":"🔵 You open the air hole. The flame turns BLUE and roars — a hot flame (~700°C), ready for heating."); }} style={{ width:"100%", background:airHoleOpen?"#1e3a8a":"#78350f", border:"2px solid "+(airHoleOpen?"#3b82f6":"#d97706"), borderRadius:8, padding:"8px 14px", cursor:"pointer", marginTop:8 }}>
                      <div style={{ fontSize:18, textAlign:"center" }}>{airHoleOpen?"🔵":"🟡"}</div>
                      <div style={{ color:"#fff", fontSize:9, textAlign:"center", fontFamily:"'Courier New',monospace", marginTop:2 }}>Air Hole: {airHoleOpen?"OPEN — blue flame (hot)":"CLOSED — yellow flame (cool)"}</div>
                    </button>
                    <button onClick={heatSample} disabled={isHeating} style={{ width:"100%", background:isHeating?"#666":airHoleOpen?"#FF6B35":"#555", border:"2px solid "+(isHeating?"#555":airHoleOpen?"#FF4500":"#888"), borderRadius:8, padding:"10px 14px", cursor:isHeating?"not-allowed":"pointer", marginTop:6, opacity:isHeating?0.6:1 }}>
                      <div style={{ fontSize:20, textAlign:"center" }}>🔥</div>
                      <div style={{ color:"#fff", fontSize:10, textAlign:"center", fontFamily:"'Courier New',monospace", marginTop:3 }}>{isHeating?"Heating...":"Heat with Bunsen Burner"}</div>
                    </button>
                  </>
                )}
                {station.heating&&station.heating.result&&station.heating.result.gasTest&&hasHeated&&(
                  <>
                    <button onClick={()=>useLitmus("red")} style={{ width:"100%", background:"#EF4444", border:"2px solid #DC2626", borderRadius:8, padding:"10px 14px", cursor:"pointer", marginTop:8 }}>
                      <div style={{ fontSize:20, textAlign:"center" }}>🔴</div>
                      <div style={{ color:"#fff", fontSize:10, textAlign:"center", fontFamily:"'Courier New',monospace", marginTop:3 }}>Test with Red Litmus</div>
                    </button>
                    <button onClick={()=>useLitmus("blue")} style={{ width:"100%", background:"#3B82F6", border:"2px solid #2563EB", borderRadius:8, padding:"10px 14px", cursor:"pointer", marginTop:8 }}>
                      <div style={{ fontSize:20, textAlign:"center" }}>🔵</div>
                      <div style={{ color:"#fff", fontSize:10, textAlign:"center", fontFamily:"'Courier New',monospace", marginTop:3 }}>Test with Blue Litmus</div>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        {isGasStation&&!station.mixedGas&&(
          <div>
            <div style={{ display:"flex", gap:10, alignItems:"flex-start", flexWrap:"wrap", marginBottom:12 }}>
              {!canisterOpen?(
                <button onClick={()=>pickUp(station.objects[0])} style={{ background:S.card, border:"2px dashed "+S.borderHi, borderRadius:8, padding:"10px 14px", cursor:"pointer" }} onMouseEnter={e=>e.currentTarget.style.borderColor=S.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=S.borderHi}>
                  <div style={{ fontSize:28, textAlign:"center" }}>{station.objects[0].icon}</div>
                  <div style={{ color:S.accent, fontSize:10, textAlign:"center", fontFamily:"'Courier New',monospace", marginTop:3 }}>{station.objects[0].label}</div>
                  <div style={{ color:S.textMuted, fontSize:9, textAlign:"center" }}>click to open</div>
                </button>
              ):(
                <div style={{ background:S.card, border:"1px solid "+S.red+"44", borderRadius:8, padding:"8px 12px", textAlign:"center" }}>
                  <div style={{ fontSize:24 }}>{station.objects[0].icon}💨</div>
                  <div style={{ color:S.red, fontSize:9, fontFamily:"'Courier New',monospace", marginTop:2 }}>Gas leaking</div>
                </div>
              )}
              {canisterOpen&&<div style={{ flex:1 }}>
                <div style={{ color:S.textMuted, fontSize:9, fontFamily:"'Courier New',monospace", letterSpacing:1, marginBottom:5 }}>FORENSIC KIT — pick up a test item, then click it in your inventory to use on the gas</div>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                  {gasTestItems.map(obj=>{ const picked=inventory.includes(obj.id); return <button key={obj.id} onClick={()=>pickUp(obj)} disabled={picked} style={{ background:picked?S.cardAlt:S.card, border:"1px solid "+(picked?S.textMuted:S.borderHi), borderRadius:6, padding:"5px 8px", cursor:picked?"default":"pointer", opacity:picked?0.45:1, transition:"all 0.2s" }} onMouseEnter={e=>!picked&&(e.currentTarget.style.borderColor=S.accent)} onMouseLeave={e=>!picked&&(e.currentTarget.style.borderColor=S.borderHi)}><span style={{ fontSize:14 }}>{obj.icon}</span><span style={{ color:picked?S.textMuted:S.accent, fontSize:9, marginLeft:4 }}>{obj.label}</span></button>; })}
                </div>
              </div>}
            </div>
            {canisterOpen&&inventory.filter(id=>id!==gasContainerId).length>0&&(
              <div style={{ marginBottom:8 }}>
                <div style={{ color:S.textMuted, fontSize:9, fontFamily:"'Courier New',monospace", letterSpacing:1, marginBottom:4 }}>🎒 INVENTORY — click an item to test it on the gas</div>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                  {inventory.filter(id=>id!==gasContainerId).map(id=>{ const obj=station.objects.find(o=>o.id===id); const used=gasUsed===id; return <button key={id} onClick={()=>useOnGas(id)} style={{ background:used?S.cardAlt:S.accent+"12", border:"1px solid "+(used?S.textMuted:S.accent), borderRadius:6, padding:"5px 10px", cursor:used?"default":"pointer", opacity:used?0.4:1 }}><span style={{ fontSize:13 }}>{obj&&obj.icon}</span><span style={{ color:used?S.textMuted:S.accent, fontSize:10, marginLeft:4, fontWeight:600 }}>{obj&&obj.label}</span>{used&&<span style={{ color:S.textMuted, fontSize:9, marginLeft:4 }}>(used)</span>}</button>; })}
                </div>
              </div>
            )}
            {gasTestVisualResult&&<div style={{ marginTop:12, padding:12, background:S.card, border:"1px solid "+S.accent+"44", borderRadius:8 }}><div style={{ color:S.accent, fontSize:10, fontFamily:"'Courier New',monospace", marginBottom:8, textAlign:"center", letterSpacing:1 }}>🔬 TEST RESULT</div><div style={{ display:"flex", justifyContent:"center" }}><GasTestVisual key={gasTestVisualResult.timestamp} testItem={gasTestVisualResult.itemId} result={gasTestVisualResult.visualKey} theme={theme}/></div></div>}
          </div>
        )}
        {station.mixedGas&&(
          <div>
            <div style={{ color:S.textMuted, fontSize:10, fontFamily:"'Courier New',monospace", letterSpacing:1, marginBottom:8, textAlign:"center" }}>⚗️ TOXIC GAS MIXTURE — Test with forensic kit items</div>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
              <div style={{ background:S.card, border:"2px solid "+S.accent, borderRadius:8, padding:"12px 16px", textAlign:"center", minWidth:180 }}>
                <div style={{ fontSize:32 }}>{station.objects[0].icon}</div>
                <div style={{ color:S.accent, fontSize:12, fontFamily:"'Courier New',monospace", marginTop:4, fontWeight:600 }}>{station.objects[0].label}</div>
                <div style={{ color:S.textMuted, fontSize:9, marginTop:3 }}>Multiple gases present</div>
              </div>
            </div>
            <div style={{ marginBottom:12 }}>
              <div style={{ color:S.textMuted, fontSize:9, fontFamily:"'Courier New',monospace", letterSpacing:1, marginBottom:5 }}>FORENSIC KIT — pick up test items and click them to use</div>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                {gasTestItems.map(obj=>{ const picked=inventory.includes(obj.id); return <button key={obj.id} onClick={()=>pickUp(obj)} disabled={picked} style={{ background:picked?S.cardAlt:S.card, border:"1px solid "+(picked?S.textMuted:S.borderHi), borderRadius:6, padding:"5px 8px", cursor:picked?"default":"pointer", opacity:picked?0.45:1, transition:"all 0.2s" }} onMouseEnter={e=>!picked&&(e.currentTarget.style.borderColor=S.accent)} onMouseLeave={e=>!picked&&(e.currentTarget.style.borderColor=S.borderHi)}><span style={{ fontSize:14 }}>{obj.icon}</span><span style={{ color:picked?S.textMuted:S.accent, fontSize:9, marginLeft:4 }}>{obj.label}</span></button>; })}
              </div>
            </div>
            {inventory.length>0&&<div style={{ marginBottom:8 }}>
              <div style={{ color:S.textMuted, fontSize:9, fontFamily:"'Courier New',monospace", letterSpacing:1, marginBottom:4 }}>🎒 INVENTORY — click test items to use them on the gas mixture</div>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                {inventory.filter(id=>id!=="gas_mixture").map(id=>{ const obj=station.objects.find(o=>o.id===id); const used=gasUsed===id; return <button key={id} onClick={()=>useOnGas(id)} style={{ background:used?S.cardAlt:S.accent+"12", border:"1px solid "+(used?S.textMuted:S.accent), borderRadius:6, padding:"5px 10px", cursor:used?"default":"pointer", opacity:used?0.4:1 }}><span style={{ fontSize:13 }}>{obj&&obj.icon}</span><span style={{ color:used?S.textMuted:S.accent, fontSize:10, marginLeft:4, fontWeight:600 }}>{obj&&obj.label}</span>{used&&<span style={{ color:S.textMuted, fontSize:9, marginLeft:4 }}>(used)</span>}</button>; })}
              </div>
            </div>}
            {gasTestVisualResult&&<div style={{ marginTop:12, padding:12, background:S.card, border:"1px solid "+S.accent+"44", borderRadius:8 }}><div style={{ color:S.accent, fontSize:10, fontFamily:"'Courier New',monospace", marginBottom:8, textAlign:"center", letterSpacing:1 }}>🔬 TEST RESULT</div><div style={{ display:"flex", justifyContent:"center" }}><GasTestVisual key={gasTestVisualResult.timestamp} testItem={gasTestVisualResult.itemId} result={gasTestVisualResult.visualKey} theme={theme}/></div></div>}
          </div>
        )}
      </div>
      <ObsLog entries={log}/>
      {!solved&&(
        <div style={{ marginTop:16, background:S.cardAlt, border:"1px solid "+S.border, borderRadius:8, padding:"12px 14px", animation:shake?"shake 0.4s ease":"none" }}>
          <div style={{ color:S.textMuted, fontSize:10, fontFamily:"'Courier New',monospace", letterSpacing:1, marginBottom:6 }}>🔒 IDENTIFY THE SUBSTANCE</div>
          <div style={{ color:S.textPrimary, fontSize:13, fontFamily:"'Georgia',serif", marginBottom:4 }}>{station.promptLabel}</div>
          <div style={{ background:S.accent+"08", border:"1px solid "+S.accent+"22", borderRadius:4, padding:"6px 8px", marginBottom:8 }}>
            <div style={{ color:S.accent, fontSize:9, fontFamily:"'Courier New',monospace", lineHeight:1.5 }}>💡 You can enter the <strong>name</strong> OR <strong>formula</strong><br/>⚠️ <strong>Formula:</strong> Use element symbols from Periodic Table. Include Roman numerals for transition metals. No spaces!</div>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <input value={answerInput} onChange={e=>setAnswerInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&tryUnlock()} placeholder={station.placeholder}
              style={{ flex:1, background:S.card, border:"1px solid "+S.border, borderRadius:5, padding:"7px 10px", color:S.textPrimary, fontSize:13, outline:"none", fontFamily:"'Courier New',monospace" }}/>
            <StyledButton onClick={tryUnlock} variant="primary" style={{ padding:"7px 16px", fontSize:12 }}>UNLOCK</StyledButton>
          </div>
          {answerError&&<div style={{ color:S.red, fontSize:11, marginTop:5 }}>{answerError}</div>}
        </div>
      )}
      {solved&&<div style={{ marginTop:14 }}><StyledButton onClick={()=>onSolved(station.evidence)} style={{ width:"100%" }}>Pin evidence & continue →</StyledButton></div>}
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}`}</style>
    </div>
  );
}

function PhaseCaseBoard({ caseData, caseBoard, onContinue, isFinal }) {
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <span style={{ fontSize:24 }}>📌</span>
        <div>
          <h2 style={{ margin:0, fontFamily:"'Georgia',serif", fontSize:20, color:S.textPrimary }}>Case Board</h2>
          <span style={{ color:S.textMuted, fontSize:11 }}>{isFinal?"All evidence collected — review before making your accusation":caseBoard.length+" of 3 evidence items pinned"}</span>
        </div>
      </div>
      <div style={{ background:S.cardAlt, border:"1px solid "+S.border, borderRadius:10, padding:16, marginBottom:18, position:"relative", minHeight:140 }}>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", position:"relative", zIndex:1 }}>
          {caseData.stations.map(st=>{ const pinned=caseBoard.find(e=>e.label===st.evidence.label); return (
            <div key={st.id} style={{ flex:"1 1 30%", minWidth:160, background:pinned?S.card:S.card+"88", border:"1px solid "+(pinned?S.accent:S.border), borderRadius:8, padding:"10px 12px", opacity:pinned?1:0.35, transition:"all 0.4s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}><span style={{ fontSize:16 }}>{pinned?pinned.icon:"📍"}</span><span style={{ color:pinned?S.accent:S.textMuted, fontSize:9, fontFamily:"'Courier New',monospace", letterSpacing:1 }}>{st.title.toUpperCase()}</span></div>
              <div style={{ color:pinned?S.textPrimary:S.textMuted, fontSize:12, fontWeight:600, marginBottom:pinned?4:0 }}>{pinned?pinned.label:"— pending —"}</div>
              {pinned&&<div style={{ color:S.textSecondary, fontSize:11, lineHeight:1.5 }}>{pinned.detail}</div>}
            </div>
          ); })}
        </div>
      </div>
      <StyledButton onClick={onContinue} style={{ width:"100%" }} variant={isFinal?"danger":"primary"}>{isFinal?"Proceed to Accusation →":"Continue Investigation →"}</StyledButton>
    </div>
  );
}

function PhaseAccusation({ caseData, onVerdict, onCaseSolved, detectiveId, suspectColors }) {
  const [chosen, setChosen] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [dossierFlipped, setDossierFlipped] = useState(null);
  const [reportsOpen, setReportsOpen] = useState(false);
  const correct=caseData.suspects.find(s=>s.guilty);

  const handleVerdict = async () => {
    if(detectiveId&&chosen===correct.id){
      try{
        const ref = doc(db, "students", detectiveId);
        const snap = await getDoc(ref);
        const data = snap.data();
        const idx=CASES.findIndex(c=>c.id===caseData.id);
        if(idx>=0&&!(data.casesCompleted||[]).includes(idx)){
          data.casesCompleted=[...(data.casesCompleted||[]),idx];
          await setDoc(ref, data);
        }
      }catch(e){}
    }
    onCaseSolved(); onVerdict();
  };

  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:18 }}>
        <span style={{ fontSize:36 }}>⚖️</span>
        <h2 style={{ margin:"6px 0 4px", fontFamily:"'Georgia',serif", fontSize:22, color:S.textPrimary }}>The Accusation</h2>
        <p style={{ color:S.textSecondary, fontSize:13, margin:0 }}>Based on all the evidence, who murdered {caseData.victim.name}?</p>
      </div>
      <div style={{ background:S.cardAlt, border:"1px solid "+S.border, borderRadius:8, padding:"12px 14px", marginBottom:12 }}>
        <div style={{ color:S.accent, fontSize:10, fontFamily:"'Courier New',monospace", letterSpacing:1.5, textTransform:"uppercase", marginBottom:6 }}>🔍 Cross-Reference: Evidence vs Suspects</div>
        <p style={{ color:S.textSecondary, fontSize:12.5, margin:0, lineHeight:1.65 }}>{caseData.accusationGuide}</p>
      </div>
      <div style={{ marginBottom:14 }}>
        <button onClick={()=>setReportsOpen(!reportsOpen)} style={{ background:S.red+"0e", border:"1px solid "+S.red+"33", borderRadius:6, padding:"7px 12px", cursor:"pointer", color:S.red, fontSize:11, fontFamily:"'Courier New',monospace", letterSpacing:0.8, width:"100%", textAlign:"left", display:"flex", justifyContent:"space-between" }}>
          <span>📄 Review Scene Reports</span><span>{reportsOpen?"▲ close":"▼ open"}</span>
        </button>
        {reportsOpen&&<div style={{ marginTop:8, display:"flex", flexDirection:"column", gap:8 }}>
          <div style={{ background:S.card, border:"1px solid "+S.border, borderRadius:8, padding:"10px 12px" }}><div style={{ color:S.accent, fontSize:11, fontFamily:"'Courier New',monospace", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>🚨 INITIAL INCIDENT REPORT</div><pre style={{ color:S.textSecondary, fontSize:10.5, margin:0, lineHeight:1.6, whiteSpace:"pre-wrap", fontFamily:"'Courier New',monospace" }}>{caseData.victim.summary}</pre></div>
          {caseData.stations.map(st=><div key={st.id} style={{ background:S.card, border:"1px solid "+S.border, borderRadius:8, padding:"10px 12px" }}><div style={{ color:S.accent, fontSize:11, fontFamily:"'Courier New',monospace", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>{st.icon} {st.title}</div><pre style={{ color:S.textSecondary, fontSize:10.5, margin:0, lineHeight:1.6, whiteSpace:"pre-wrap", fontFamily:"'Courier New',monospace" }}>{st.policeReport}</pre></div>)}
        </div>}
      </div>
      <div style={{ marginBottom:14 }}>
        <button onClick={()=>setDossierOpen(!dossierOpen)} style={{ background:S.accent+"0e", border:"1px solid "+S.accent+"33", borderRadius:6, padding:"7px 12px", cursor:"pointer", color:S.accent, fontSize:11, fontFamily:"'Courier New',monospace", letterSpacing:0.8, width:"100%", textAlign:"left", display:"flex", justifyContent:"space-between" }}>
          <span>📁 Review Suspect Dossiers</span><span>{dossierOpen?"▲ close":"▼ open"}</span>
        </button>
        {dossierOpen&&<div style={{ marginTop:8, display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:8 }}>{caseData.suspects.map(s=><SuspectCard key={s.id} suspect={s} isFlipped={dossierFlipped===s.id} onFlip={()=>setDossierFlipped(dossierFlipped===s.id?null:s.id)} color={suspectColors[s.id]}/>)}</div>}
      </div>
      {!submitted&&(
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:8, marginBottom:16 }}>
            {caseData.suspects.map(s=>{ const sColor=suspectColors[s.id]; return <button key={s.id} onClick={()=>setChosen(s.id)} style={{ background:chosen===s.id?sColor+"18":S.card, border:"2px solid "+(chosen===s.id?sColor:S.border), borderRadius:8, padding:"10px 12px", cursor:"pointer", textAlign:"left", transition:"all 0.2s" }} onMouseEnter={e=>e.currentTarget.style.borderColor=sColor} onMouseLeave={e=>e.currentTarget.style.borderColor=chosen===s.id?sColor:S.border}><div style={{ display:"flex", alignItems:"center", gap:8 }}><span style={{ fontSize:22 }}>{s.portrait}</span><div><div style={{ color:chosen===s.id?sColor:S.textPrimary, fontSize:13, fontWeight:700 }}>{s.name}</div><div style={{ color:S.textMuted, fontSize:10 }}>{s.title}</div></div></div></button>; })}
          </div>
          <StyledButton onClick={()=>setSubmitted(true)} variant="danger" disabled={!chosen} style={{ width:"100%" }}>🚨 I Accuse {chosen?caseData.suspects.find(s=>s.id===chosen).name:"…"}</StyledButton>
        </>
      )}
      {submitted&&(
        <div style={{ animation:"pinIn 0.5s ease" }}>
          {chosen===correct.id?(
            <div style={{ background:"#14532d", border:"1px solid #22c55e55", borderRadius:10, padding:"22px 20px", textAlign:"center" }}>
              <div style={{ fontSize:44, marginBottom:6 }}>🏆</div>
              <h3 style={{ color:"#4ade80", fontFamily:"'Georgia',serif", fontSize:22, margin:"0 0 10px" }}>CASE SOLVED</h3>
              <p style={{ color:"#86efac", fontSize:13.5, margin:0, lineHeight:1.7 }}>{caseData.guilty}</p>
            </div>
          ):(
            <div style={{ background:"#1f2937", border:"1px solid #ef444455", borderRadius:10, padding:"22px 20px", textAlign:"center" }}>
              <div style={{ fontSize:44, marginBottom:6 }}>❌</div>
              <h3 style={{ color:"#f87171", fontFamily:"'Georgia',serif", fontSize:22, margin:"0 0 10px" }}>WRONG SUSPECT</h3>
              <p style={{ color:"#fca5a5", fontSize:13, margin:"0 0 10px", lineHeight:1.7 }}>{caseData.suspects.find(s=>s.id===chosen).name} is innocent.</p>
              <p style={{ color:"#f87171", fontSize:12.5, margin:0 }}>The killer was <strong>{correct.name}</strong>.</p>
            </div>
          )}
          <StyledButton onClick={handleVerdict} style={{ width:"100%", marginTop:14 }}>View Chemistry Debrief →</StyledButton>
        </div>
      )}
      <style>{`@keyframes pinIn{0%{transform:translateY(-6px);opacity:0}100%{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}

function PhaseDebrief({ caseData, onRestart, onBackToSelect, solvedCases }) {
  const examTips = ["Cu²⁺ vs Zn²⁺: Both give precipitates with NaOH. Cu(OH)₂ is light blue; Zn(OH)₂ is white. KEY: Cu²⁺ dissolves in excess NH₃ only. Zn²⁺ dissolves in excess of BOTH NaOH and NH₃.","NO₃⁻ vs SO₄²⁻ vs Cl⁻: NO₃⁻ = Al + NaOH + heat → NH₃ (red litmus → blue). SO₄²⁻ = Ba(NO₃)₂ → white ppt insoluble in acid. Cl⁻ = AgNO₃ → white ppt insoluble in acid.","⚠️ NO₃⁻ vs NH₄⁺ — COMMONLY CONFUSED! Both tests use NaOH + heat and produce NH₃ gas. KEY DIFFERENCE: NO₃⁻ test REQUIRES aluminium foil. NH₄⁺ test needs NO aluminium (just NaOH + heat).","CO₂ vs SO₂ vs NH₃ + HCl: CO₂ forms white ppt in limewater. SO₂ decolorises KMnO₄ and turns blue litmus red. NH₃ turns red litmus blue. HCl turns blue litmus red.","NH₃ + HCl from NH₄Cl: When red litmus paper was used, it turned BLUE first, then RED. This is because NH₃ has a lower Mr (17) than HCl (36.5), so NH₃ diffuses faster and reaches the litmus paper first — turning it blue. HCl then arrives and turns it red. Always use RED litmus first when testing for this mixture.","⚠️ NH₄Cl decomposition: NH₄Cl ⇌ NH₃ + HCl. Dangerous in enclosed spaces.","Gas tests use damp indicators held NEAR the gas—not dipped into solution."];
  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:18 }}>
        <span style={{ fontSize:36 }}>📋</span>
        <h2 style={{ margin:"6px 0 4px", fontFamily:"'Georgia',serif", fontSize:22, color:S.textPrimary }}>Chemistry Debrief</h2>
        <p style={{ color:S.textSecondary, fontSize:13, margin:0 }}>Review the tests you performed and their real-world significance</p>
      </div>
      {caseData.debrief.map((row,i)=>(
        <div key={i} style={{ background:S.cardAlt, border:"1px solid "+S.border, borderRadius:10, padding:"14px 16px", marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <div style={{ color:S.accent, fontSize:13, fontWeight:700, fontFamily:"'Georgia',serif" }}>{row.scenario}</div>
            <div style={{ background:S.accent+"18", border:"1px solid "+S.accent+"44", borderRadius:4, padding:"2px 8px", color:S.accent, fontSize:11, fontFamily:"'Courier New',monospace", fontWeight:700 }}>{row.ion}</div>
          </div>
          <div style={{ background:S.blue+"14", border:"1px solid "+S.blue+"44", borderRadius:6, padding:"6px 10px", marginBottom:10 }}>
            <span style={{ color:S.blue, fontSize:11 }}>🌍 Real World: {row.realWorld}</span>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11.5 }}>
            <thead><tr style={{ borderBottom:"1px solid "+S.border }}><th style={{ textAlign:"left", padding:"5px 8px", color:S.textMuted, fontFamily:"'Courier New',monospace", fontSize:9, letterSpacing:1, textTransform:"uppercase", fontWeight:600 }}>Reagent / Test</th><th style={{ textAlign:"left", padding:"5px 8px", color:S.textMuted, fontFamily:"'Courier New',monospace", fontSize:9, letterSpacing:1, textTransform:"uppercase", fontWeight:600 }}>Observation</th></tr></thead>
            <tbody>{row.tests.map((t,j)=><tr key={j} style={{ borderBottom:"1px solid "+S.border+"55" }}><td style={{ padding:"5px 8px", color:S.accent, fontWeight:600 }}>{t.reagent}</td><td style={{ padding:"5px 8px", color:S.textSecondary }}>{t.result}</td></tr>)}</tbody>
          </table>
        </div>
      ))}
      {solvedCases.size===3?(
        <div style={{ background:S.accent+"0a", border:"1px solid "+S.accent+"33", borderRadius:8, padding:"12px 14px", marginBottom:16 }}>
          <div style={{ color:S.accent, fontSize:10, fontFamily:"'Courier New',monospace", letterSpacing:1.5, textTransform:"uppercase", marginBottom:7, fontWeight:700 }}>🏆 Master Key Points — All Cases Solved</div>
          {examTips.map((tip,i)=><div key={i} style={{ display:"flex", gap:7, marginBottom:i<examTips.length-1?6:0, alignItems:"flex-start" }}><span style={{ color:S.accent, fontSize:12 }}>✓</span><span style={{ color:S.textSecondary, fontSize:12, lineHeight:1.5 }}>{tip}</span></div>)}
        </div>
      ):(
        <div style={{ background:S.accent+"0a", border:"1px solid "+S.accent+"33", borderRadius:8, padding:"10px 12px", marginBottom:16 }}>
          <div style={{ color:S.accent, fontSize:10, fontFamily:"'Courier New',monospace", letterSpacing:1.5, textTransform:"uppercase", marginBottom:4, fontWeight:700 }}>🔒 Master Key Points Locked</div>
          <p style={{ color:S.textSecondary, fontSize:11.5, margin:0, lineHeight:1.6 }}>Solve all 3 cases to unlock a comprehensive comparison guide. <strong>Cases solved: {solvedCases.size}/3</strong></p>
        </div>
      )}
      <div style={{ display:"flex", gap:8 }}>
        <StyledButton onClick={onBackToSelect} variant="ghost" style={{ flex:1 }}>← All Cases</StyledButton>
        <StyledButton onClick={onRestart} style={{ flex:1 }}>🔄 Replay This Case</StyledButton>
      </div>
    </div>
  );
}

function Notebook({ notes, onChange, theme }) {
  const [open, setOpen] = useState(false);
  const noteBg = theme === "light" ? "#ffffff" : "#1a1710";
  const btnBg = theme === "light" ? "#ffffff" : S.cardAlt;
  return (
    <div style={{ marginTop:18 }}>
      <button onClick={()=>setOpen(!open)}
        style={{ background:btnBg, border:"1px solid "+S.accent+"33", borderRadius:open?"6px 6px 0 0":6, padding:"6px 12px", cursor:"pointer", color:S.accent, fontSize:11, fontFamily:"'Courier New',monospace", letterSpacing:0.8, width:"100%", textAlign:"left", display:"flex", justifyContent:"space-between", transition:"background 0.2s" }}
        onMouseEnter={e=>e.currentTarget.style.background=S.accent+"14"}
        onMouseLeave={e=>e.currentTarget.style.background=btnBg}>
        <span>📓 Detective Notebook {notes.trim()?"("+notes.trim().split("\n").filter(l=>l.trim()).length+" note"+(notes.trim().split("\n").filter(l=>l.trim()).length!==1?"s":"")+")" :""} </span>
        <span>{open?"▲ close":"▼ open"}</span>
      </button>
      {open&&(
        <div style={{ background:noteBg, border:"1px solid "+S.accent+"33", borderTop:"none", borderRadius:"0 0 6px 6px", overflow:"hidden" }}>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, pointerEvents:"none", background:"repeating-linear-gradient(to bottom, transparent, transparent 23px, "+S.accent+"15 23px, "+S.accent+"15 24px)", marginTop:4 }}/>
            <textarea value={notes} onChange={e=>onChange(e.target.value)} placeholder="Jot down your observations, suspects, and deductions here…"
              style={{ width:"100%", minHeight:140, background:"transparent", border:"none", resize:"vertical", padding:"10px 12px", color:S.textPrimary, fontSize:12.5, lineHeight:"24px", fontFamily:"'Georgia',serif", outline:"none", position:"relative", zIndex:1, boxSizing:"border-box" }}/>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState("light");
  S = theme === "light" ? { ...LIGHT } : { ...DARK };
  const [selectedCase, setSelectedCase] = useState(null);
  const [phase, setPhase] = useState("register");
  const [solvedCases, setSolvedCases] = useState(new Set());
  const [caseBoard, setCaseBoard] = useState([]);
  const [fade, setFade] = useState(true);
  const [notes, setNotes] = useState("");
  const [suspectColors, setSuspectColors] = useState({});
  const [detective, setDetective] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const caseData = selectedCase!==null?CASES[selectedCase]:null;

  const go = useCallback((next)=>{ setFade(false); setTimeout(()=>{ setPhase(next); setFade(true); },280); },[]);

  const selectCase = (idx) => {
    setSelectedCase(idx); setCaseBoard([]); setNotes("");
    const shuffled=shuffleArray(SUSPECT_COLORS); const colors={};
    CASES[idx].suspects.forEach((s,i)=>{ colors[s.id]=shuffled[i%shuffled.length]; });
    setSuspectColors(colors); go("intro");
  };

  const pinEvidence = useCallback((evidence)=>{
    setCaseBoard(prev=>prev.find(e=>e.label===evidence.label)?prev:[...prev,evidence]);
    const map={ station0:"board0", station1:"board1", station2:"board2" };
    if(map[phase]) go(map[phase]);
  },[phase]);

  const stationPhases={ station0:0, station1:1, station2:2 };
  const boardPhases={ board0:0, board1:1, board2:2 };
  const boardNext={ board0:"station1", board1:"station2", board2:"accusation" };
  const showNotebook = caseData&&phase!=="select"&&phase!=="debrief";

  let content;
  if(showDashboard){ content=<TeacherDashboard onBack={()=>setShowDashboard(false)}/>; }
  else if(phase==="register"){ content=<PhaseRegister onRegister={d=>{setDetective(d);go("select");}} onOpenDashboard={()=>setShowDashboard(true)}/>; }
  else if(phase==="select"){ content=<PhaseCaseSelect onSelect={selectCase} detectiveName={detective&&detective.displayName||"Detective"} theme={theme}/>; }
  else if(phase==="intro"&&caseData){ content=<PhaseIntro caseData={caseData} onStart={()=>go("station0")} onBack={()=>go("select")} suspectColors={suspectColors}/>; }
  else if(phase in stationPhases&&caseData){ content=<PhaseStation key={phase} station={caseData.stations[stationPhases[phase]]} onSolved={pinEvidence} caseIdx={selectedCase} detectiveId={detective&&detective.id} theme={theme}/>; }
  else if(phase in boardPhases&&caseData){ content=<PhaseCaseBoard caseData={caseData} caseBoard={caseBoard} onContinue={()=>go(boardNext[phase])} isFinal={boardPhases[phase]===2}/>; }
  else if(phase==="accusation"&&caseData){ content=<PhaseAccusation caseData={caseData} onVerdict={()=>go("debrief")} onCaseSolved={()=>setSolvedCases(prev=>new Set([...prev,selectedCase]))} detectiveId={detective&&detective.id} suspectColors={suspectColors}/>; }
  else if(phase==="debrief"&&caseData){ content=<PhaseDebrief caseData={caseData} onRestart={()=>{setCaseBoard([]);setNotes("");go("intro");}} onBackToSelect={()=>{go("select");setTimeout(()=>setSelectedCase(null),300);}} solvedCases={solvedCases}/>; }
  else{ content=<div style={{ textAlign:"center", padding:"20px", color:S.textMuted }}>Loading...</div>; }

  const allPhases=["intro","station0","board0","station1","board1","station2","board2","accusation","debrief"];
  const pct=phase==="select"?0:Math.round((allPhases.indexOf(phase)/(allPhases.length-1))*100);

  return (
    <div style={{ minHeight:"100vh", background:S.bg, color:S.textPrimary, fontFamily:"'Segoe UI',sans-serif", display:"flex", flexDirection:"column", alignItems:"center", padding:"24px 14px 44px", transition:"background 0.3s, color 0.3s" }}>
      <div style={{ width:"100%", maxWidth:700, background:S.card, border:"1px solid "+S.border, borderRadius:16, padding:26, boxShadow:"0 16px 56px "+(theme==="light"?"rgba(0,0,0,0.12)":"rgba(0,0,0,0.55)"), opacity:fade?1:0, transform:fade?"translateY(0)":"translateY(8px)", transition:"opacity 0.28s ease, transform 0.28s ease, background 0.3s, border-color 0.3s", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg, "+S.accent+", "+(theme==="light"?"#c8963a":"#7a5c3a")+", "+S.accent+")" }}/>
        <button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}
          style={{ position:"absolute", top:14, left:14, background:theme==="dark"?"#ffffff14":"#00000010", border:"1px solid "+S.border, borderRadius:20, padding:"4px 10px 4px 8px", cursor:"pointer", display:"flex", alignItems:"center", gap:5, color:S.textMuted, fontSize:11, fontFamily:"'Courier New',monospace", transition:"all 0.2s", zIndex:10 }}
          onMouseEnter={e=>{ e.currentTarget.style.background=theme==="dark"?"#ffffff22":"#00000018"; e.currentTarget.style.color=S.accent; }}
          onMouseLeave={e=>{ e.currentTarget.style.background=theme==="dark"?"#ffffff14":"#00000010"; e.currentTarget.style.color=S.textMuted; }}>
          <span style={{ fontSize:14, lineHeight:1 }}>{theme==="dark"?"☀️":"🌙"}</span>
          <span>{theme==="dark"?"Light mode":"Dark mode"}</span>
        </button>
        <div style={{ textAlign:"center", marginBottom:18, paddingTop:6 }}>
          <div style={{ color:S.textMuted, fontSize:9, fontFamily:"'Courier New',monospace", letterSpacing:3, textTransform:"uppercase", marginBottom:3 }}>Metropolitan Police — Forensic Division</div>
          <h1 style={{ margin:0, fontFamily:"'Georgia',serif", fontSize:24, color:S.textPrimary, letterSpacing:0.5 }}>{caseData?<>Case <span style={{ color:S.accent }}>{caseData.caseNumber}</span></>:<span style={{ color:S.accent }}>CSI Chemistry</span>}</h1>
          <div style={{ color:S.textMuted, fontSize:10, fontFamily:"'Courier New',monospace", letterSpacing:1.5 }}>{caseData?caseData.title.toUpperCase():"QUALITATIVE ANALYSIS TRAINING"}</div>
        </div>
        {phase!=="select"&&<div style={{ marginBottom:18 }}><div style={{ width:"100%", height:3, background:S.cardAlt, borderRadius:2, overflow:"hidden" }}><div style={{ width:pct+"%", height:"100%", background:"linear-gradient(90deg, "+S.accent+", #e8c88a)", borderRadius:2, transition:"width 0.5s cubic-bezier(.4,0,.2,1)" }}/></div></div>}
        {content}
        {showNotebook&&<Notebook notes={notes} onChange={setNotes} theme={theme}/>}
      </div>
    </div>
  );
}