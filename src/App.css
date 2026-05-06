/* eslint-disable */
import React, { useState, useCallback, useEffect } from "react";
import { db } from "./firebase";
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";

const DARK = {
  bg:"#0b0b14",card:"#141422",cardAlt:"#1a1a2e",border:"#2e2e48",borderHi:"#4a4a70",
  textPrimary:"#eae8e0",textSecondary:"#8a8a9a",textMuted:"#5a5a6a",
  accent:"#c2955a",accentDim:"#c2955a33",red:"#dc2626",green:"#16a34a",blue:"#3b82f6",
};
const LIGHT = {
  bg:"#f0ede8",card:"#ffffff",cardAlt:"#f5f2ee",border:"#d6cfc6",borderHi:"#b8ae9e",
  textPrimary:"#1a1610",textSecondary:"#5a5248",textMuted:"#6b6560",
  accent:"#8a5a18",accentDim:"#8a5a1822",red:"#991b1b",green:"#14532d",blue:"#1d4ed8",
};
let S = {...DARK};

const SUSPECT_COLORS = ["#2563eb","#059669","#d97706","#8b5cf6"];

function shuffleArray(a){const s=[...a];for(let i=s.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[s[i],s[j]]=[s[j],s[i]];}return s;}

const ANION_GUIDE = [
  {step:"Step 1", tip:"Add dilute HNO3 first — removes CO32- ions to avoid false positives."},
  {step:"Step 2", tip:"Add Ba(NO3)2 solution — white ppt insoluble in HNO3 confirms SO42-."},
  {step:"Step 3", tip:"Add AgNO3 solution — white ppt confirms Cl-; yellow ppt confirms I-."},
  {step:"Step 4", tip:"Add NaOH + aluminium foil, then heat — pungent gas turning damp red litmus blue confirms NO3-."},
];

const CASES = [
{
  id:"ashworth",title:"The Ashworth Affair",caseNumber:"#2025-0118",
  subtitle:"A mysterious poisoning. A locked study. Three deadly sources.",
  coverIcon:"🏚️",difficulty:"Intermediate",
  victim:{name:"Lord Edmund Ashworth",summary:"Found dead in his locked study at 6:14 AM on Saturday 18 January 2025. Door sealed from inside. Half-eaten dinner and open wine on the desk. Cause of death: pending toxicology."},
  suspects:[
    {id:"victoria",name:"Lady Victoria Ashworth",title:"The Wife",portrait:"👩‍🦰",color:"#e11d48",guilty:true,connection:"Runs copper jewellery business. Regularly orders copper(II) compounds for patina finishes. Access to all three scenes.",motive:"",alibi:""},
    {id:"marsh",name:"Dr Henry Marsh",title:"The Family Doctor",portrait:"👨‍⚕️",color:"#2563eb",guilty:false,connection:"Medical practice stocks zinc sulfate, magnesium hydroxide, and aluminium hydroxide.",motive:"",alibi:""},
    {id:"rossi",name:"Chef Elena Rossi",title:"The Cook",portrait:"👩‍🍳",color:"#d97706",guilty:false,connection:"Kitchen uses calcium carbonate for baking, aluminium foil, and iron-fortified flour.",motive:"",alibi:""},
    {id:"cole",name:"James Cole",title:"The Groundskeeper",portrait:"👨‍🌾",color:"#16a34a",guilty:false,connection:"Uses iron(II) sulfate for moss control, potassium carbonate as fertiliser, and magnesium sulfate for plants.",motive:"",alibi:""},
  ],
  stations:[
    {
      id:"kitchen",title:"The Kitchen",icon:"🍽️",
      locationDesc:"A large estate kitchen. A dinner plate with lamb stew residue sits on the counter — Lord Ashworth's last meal.",
      policeReport:"KITCHEN — Sample A collected from dinner plate residue.\n\nThe stew had an unusual green tint. Lord Ashworth complained of a metallic taste.\n\nACTION: Test Sample A for the presence of toxic cations.",
      objects:[{id:"vial_a",label:"Vial — SAMPLE A",icon:"🧫",pickup:true},{id:"bunsen_burner",label:"Bunsen Burner",icon:"🔥",pickup:false}],
      reagents:["NaOH solution","Aqueous NH3"],
      reactions:{
        "NaOH solution":{first:{text:"You add a few drops of NaOH solution. A LIGHT BLUE precipitate forms immediately.",visual:{type:"ppt",color:"#7dd3fc"}},excess:{text:"You add excess NaOH solution. The light blue precipitate does NOT dissolve.",visual:{type:"ppt",color:"#7dd3fc"}}},
        "Aqueous NH3":{first:{text:"You add a few drops of aqueous ammonia. A LIGHT BLUE precipitate forms.",visual:{type:"ppt",color:"#7dd3fc"}},excess:{text:"You add excess ammonia. The light blue precipitate DISSOLVES and the solution turns DARK BLUE.",visual:{type:"solution",color:"#1e3a8a"}}},
      },
      heating:{requiresReagent:["NaOH solution","Aqueous NH3"],result:{textWithPrecipitate:"You warm the mixture. The light blue precipitate remains unchanged.",textWithoutPrecipitate:"You warm the mixture. The dark blue solution remains unchanged.",visual:{type:"heating",bubbles:false}}},
      answer:{accepted:["Cu2+","Cu2+","copper(II)","Copper(II)"],partialCredit:["Cu+2","Cu 2+","copper II","copper 2+","copper(ii)"]},
      promptLabel:"What is the name or formula of the cation found?",
      placeholder:"e.g. copper(II) or Cu2+",
      hints:["Focus on the difference between adding NaOH and NH3 in excess. What happens differently to the precipitate?","The ion produces a light blue precipitate. Check whether it dissolves or stays when you add more reagent.","The answer is copper(II) — Cu2+. Light blue ppt with both NaOH and NH3, but only dissolves in excess NH3 to give dark blue solution."],
      solvedMessage:"Cu2+ confirmed in the food. Copper(II) ions are highly toxic.",
      evidence:{label:"Cu2+ in food",detail:"Copper(II) ions found in the stew.",icon:"☠️"},
    },
    {
      id:"wellhouse",title:"The Well House",icon:"💧",
      locationDesc:"A small stone building housing the estate's private well. The water supplies the kitchen and bathrooms.",
      policeReport:"WELL HOUSE — Sample B collected from the estate well.\n\nThe water shows a faint blue-green tint. Lord Ashworth had recurring stomach pains for two weeks prior.\n\nACTION: Test Sample B for anion contamination.",
      objects:[{id:"vial_b",label:"Vial — SAMPLE B",icon:"🧪",pickup:true},{id:"bunsen_burner",label:"Bunsen Burner",icon:"🔥",pickup:false},{id:"litmus_red_no3",label:"Damp Red Litmus Paper",icon:"🔴",pickup:true},{id:"litmus_blue_no3",label:"Damp Blue Litmus Paper",icon:"🔵",pickup:true}],
      reagents:["NaOH solution","Aluminium foil","Dilute HNO3","AgNO3 solution","Ba(NO3)2 solution","Limewater"],
      isAnionStation:true,
      reactions:{
        "Dilute HNO3":{first:{text:"You add dilute nitric acid. No fizzing — solution stays clear.",visual:null}},
        "Limewater":{first:{text:"You add limewater. Nothing happens — no precipitate forms.",visual:null}},
        "NaOH solution":{first:{text:"You add NaOH solution. The solution stays clear — no precipitate forms.",visual:null}},
        "Aluminium foil":{first_without_naoh:{text:"Nothing happens. Add NaOH solution first to create an alkaline environment.",visual:null,warning:true},first_with_naoh:{text:"You add aluminium foil. The aluminium reacts slowly, producing tiny bubbles. Heat the mixture to speed up the reaction.",visual:{type:"bubbling",bubbles:true,color:"#7dd3fc55"}}},
        "AgNO3 solution":{first:{text:"You add AgNO3 solution. No precipitate forms.",visual:null}},
        "Ba(NO3)2 solution":{first:{text:"You add Ba(NO3)2 solution. No precipitate forms.",visual:null}},
      },
      heating:{requiresReagent:"Aluminium foil",result:{text:"You heat the mixture. Bubbles form vigorously as the aluminium dissolves. A pungent gas is released.",visual:{type:"heating",bubbles:true},gasTest:"litmus_red_no3"}},
      answer:{accepted:["NO3-","NO3-","nitrate","nitrate ion"]},
      promptLabel:"What is the name or formula of the anion found?",
      placeholder:"e.g. nitrate or NO3-",
      hints:["Which tests gave a reaction? Pay attention to the heating step — what was released?","When heated with aluminium in alkaline conditions, a pungent gas was released. What colour did red litmus turn?","The answer is nitrate — NO3-. The test: NO3- + Al + NaOH + heat produces NH3 gas, which turns red litmus blue."],
      solvedMessage:"NO3- confirmed in the well water.",
      evidence:{label:"NO3- in well water",detail:"Nitrate ions at toxic concentrations found in the water.",icon:"💧"},
    },
    {
      id:"study",title:"The Study",icon:"📖",
      locationDesc:"Lord Ashworth's private study. Door locked from inside. Window sealed with tape from inside.",
      policeReport:"STUDY — Door found locked from inside. Window sealed with tape from inside.\n\nA small canister was found behind a bookshelf with its label removed. The air felt unusually heavy upon entry.\n\nACTION: Identify the gas in the canister.",
      objects:[{id:"canister",label:"Sealed Canister",icon:"🛢️",pickup:true},{id:"litmus_red",label:"Damp Red Litmus Paper",icon:"🔴",pickup:true},{id:"litmus_blue",label:"Damp Blue Litmus Paper",icon:"🔵",pickup:true},{id:"limewater_tube",label:"Test Tube of Limewater",icon:"🥛",pickup:true},{id:"splint_burning",label:"Burning Splint",icon:"🕯️",pickup:true},{id:"splint_glowing",label:"Glowing Splint",icon:"✨",pickup:true},{id:"kmno4_paper",label:"Acidified KMnO4 Paper",icon:"🟣",pickup:true}],
      reagents:[],reactions:{},
      gasTests:{
        "litmus_red":{text:"You hold damp red litmus paper near the gas. Nothing happens — the paper stays red.",visual:null},
        "litmus_blue":{text:"You hold damp blue litmus paper near the gas. Nothing obvious happens — the paper stays blue.",visual:null},
        "limewater_tube":{text:"A white precipitate forms in the limewater! On further bubbling, the precipitate dissolves and the solution turns colourless again.",visual:{type:"solution",color:"#d1d5db"}},
        "splint_burning":{text:"You hold a burning splint to the gas. The flame is EXTINGUISHED immediately — no pop sound.",visual:null},
        "splint_glowing":{text:"You hold a glowing splint in the gas. It does NOT relight.",visual:null},
        "kmno4_paper":{text:"You hold acidified KMnO4 paper near the gas. The purple colour does NOT change.",visual:null},
      },
      answer:{accepted:["CO2","CO2","carbon dioxide"]},
      promptLabel:"What is the name or formula of the gas?",
      placeholder:"e.g. CO2 or carbon dioxide",
      hints:["Which test produced a visible change? That is your strongest clue.","The gas causes limewater to form a white precipitate that dissolves on further bubbling.","The answer is CO2. It reacts with limewater to form CaCO3 (white ppt), which dissolves with excess CO2 to form Ca(HCO3)2."],
      solvedMessage:"CO2 confirmed. The canister flooded the sealed study with carbon dioxide.",
      evidence:{label:"CO2 in study",detail:"CO2 canister hidden behind bookshelf. Sealed room caused asphyxiation.",icon:"🛢️"},
    },
  ],
  accusationGuide:"You found Cu2+ in the food, NO3- in the water, and CO2 in the study. Connect the chemistry to the suspects' backgrounds.",
  guilty:"Lady Victoria Ashworth is guilty.\n\nEVIDENCE: Cu2+ in food and NO3- in water — both from copper(II) nitrate. CO2 in sealed study.\n\nMOTIVE: Edmund discovered Victoria's affair and threatened divorce.\n\nCONNECTION: Runs copper jewellery business — orders copper(II) nitrate for patina finishes.",
  debrief:[
    {scenario:"Food poisoning (Kitchen)",ion:"Cu2+",realWorld:"Heavy metal contamination in food is a genuine public health concern. Cu2+ ions are toxic — chronic exposure causes liver damage.",tests:[{reagent:"NaOH (few drops)",result:"Light blue ppt forms"},{reagent:"NaOH (excess)",result:"Ppt does NOT dissolve"},{reagent:"Aqueous NH3 (few drops)",result:"Light blue ppt forms"},{reagent:"Aqueous NH3 (excess)",result:"Ppt DISSOLVES — dark blue solution"}]},
    {scenario:"Water contamination (Well House)",ion:"NO3-",realWorld:"Nitrate contamination of groundwater is a serious environmental concern. The aluminium reduction test is the standard O-Level test for nitrate.",tests:[{reagent:"NaOH solution",result:"Creates alkaline environment"},{reagent:"Aluminium foil",result:"Slow reaction, bubbles form"},{reagent:"Heat with Bunsen",result:"Pungent NH3 gas released"},{reagent:"Damp red litmus",result:"Turns BLUE — confirms NO3- reduced to NH3"}]},
    {scenario:"Sealed room gas (Study)",ion:"CO2",realWorld:"CO2 asphyxiation in sealed spaces is a documented cause of death.",tests:[{reagent:"Limewater",result:"White ppt forms (CaCO3), dissolves with excess"},{reagent:"Burning splint",result:"Flame extinguished (no pop)"},{reagent:"Glowing splint",result:"Does not relight"},{reagent:"Litmus paper",result:"No colour change"}]},
  ],
},
{
  id:"blackwood",title:"The Blackwood Inheritance",caseNumber:"#2025-0203",
  subtitle:"A fatal inheritance. Three contaminated sources. One deadly element.",
  coverIcon:"🏰",difficulty:"Challenging",
  victim:{name:"Mr Oliver Blackwood",summary:"Found dead in his conservatory at 7:02 AM on Sunday 2 February 2025. A cup of herbal tea sat cold on the side table. An open bottle of wine was beside it. Signs suggest respiratory distress combined with acute poisoning."},
  suspects:[
    {id:"harrow",name:"Mr Geoffrey Harrow",title:"The Business Partner",portrait:"👨‍💼",color:"#2563eb",guilty:false,connection:"Uses copper(II) sulfate for wine fining and sulfur dioxide as a preservative.",motive:"",alibi:""},
    {id:"margaret",name:"Lady Margaret Blackwood",title:"The Sister",portrait:"👩‍🦰",color:"#e11d48",guilty:true,connection:"Purchased 5kg zinc sulfate recently. Stores sulfur candles for greenhouse fumigation. Has chemistry background.",motive:"",alibi:""},
    {id:"hale",name:"Mrs Dorothy Hale",title:"The Housekeeper",portrait:"👩‍🏫",color:"#d97706",guilty:false,connection:"Orders sodium carbonate for cleaning, iron(III) chloride for garden paths, and calcium hydroxide for soil.",motive:"",alibi:""},
  ],
  stations:[
    {
      id:"greenhouse",title:"The Greenhouse",icon:"🌿",
      locationDesc:"A large Victorian greenhouse. On a workbench sits a cold cup of herbal tea — a sample has been collected.",
      policeReport:"GREENHOUSE — Sample C collected from herbal tea residue.\n\nOliver had been experiencing nausea and fatigue for two weeks prior to his death.\n\nACTION: Test Sample C for the presence of toxic cations.",
      objects:[{id:"vial_c",label:"Vial — SAMPLE C",icon:"🧫",pickup:true},{id:"bunsen_burner",label:"Bunsen Burner",icon:"🔥",pickup:false}],
      reagents:["NaOH solution","Aqueous NH3"],
      reactions:{
        "NaOH solution":{first:{text:"You add a few drops of NaOH solution. A WHITE precipitate forms immediately.",visual:{type:"ppt",color:"#e2e8f0"}},excess:{text:"You add excess NaOH solution. The white precipitate DISSOLVES completely — colourless solution.",visual:{type:"solution",color:"transparent"}}},
        "Aqueous NH3":{first:{text:"You add a few drops of aqueous ammonia. A WHITE precipitate forms.",visual:{type:"ppt",color:"#e2e8f0"}},excess:{text:"You add excess ammonia. The white precipitate DISSOLVES — colourless solution.",visual:{type:"solution",color:"transparent"}}},
      },
      heating:{requiresReagent:["NaOH solution","Aqueous NH3"],result:{textWithPrecipitate:"You warm the mixture. No change.",textWithoutPrecipitate:"You warm the mixture. No change.",visual:{type:"heating",bubbles:false}}},
      answer:{accepted:["Zn2+","Zn2+","zinc","Zinc"]},
      promptLabel:"What is the name or formula of the cation found?",
      placeholder:"e.g. zinc or Zn2+",
      hints:["Compare what happens with excess NaOH vs excess NH3. Does the precipitate dissolve in both?","The precipitate dissolves in excess of BOTH NaOH and NH3. Which ion behaves this way?","The answer is zinc — Zn2+. Zinc hydroxide is amphoteric and dissolves in both excess NaOH and excess NH3."],
      solvedMessage:"Zn2+ confirmed in the tea.",
      evidence:{label:"Zn2+ in tea",detail:"Zinc ions found in the herbal tea.",icon:"☠️"},
    },
    {
      id:"cellar",title:"The Wine Cellar",icon:"🍷",
      locationDesc:"A stone cellar beneath the manor. An opened bottle of Bordeaux found beside Oliver's body. Sample collected.",
      policeReport:"WINE CELLAR — Sample D collected from an opened wine bottle found beside the body.\n\nThe wine appears darker than usual. The bottle was added to the cellar recently.\n\nACTION: Test Sample D for anion contamination.",
      objects:[{id:"vial_d",label:"Vial — SAMPLE D",icon:"🧪",pickup:true},{id:"bunsen_burner",label:"Bunsen Burner",icon:"🔥",pickup:false},{id:"litmus_red_cellar",label:"Damp Red Litmus Paper",icon:"🔴",pickup:true},{id:"litmus_blue_cellar",label:"Damp Blue Litmus Paper",icon:"🔵",pickup:true}],
      reagents:["NaOH solution","Aluminium foil","Dilute HNO3","Ba(NO3)2 solution","AgNO3 solution","Limewater"],
      isAnionStation:true,
      reactions:{
        "NaOH solution":{first:{text:"You add NaOH solution. The solution stays clear — no precipitate forms.",visual:null}},
        "Aluminium foil":{first_without_naoh:{text:"Nothing happens. Add NaOH solution first.",visual:null,warning:true},first_with_naoh:{text:"You add aluminium foil. Slow reaction at room temperature. Try heating.",visual:null}},
        "Dilute HNO3":{first:{text:"You add dilute nitric acid. No fizzing — solution stays clear.",visual:null}},
        "Limewater":{first:{text:"You add limewater. Nothing happens.",visual:null}},
        "Ba(NO3)2 solution":{first_without_acid:{text:"You add Ba(NO3)2 without acidifying first. A white precipitate forms — but this could be from carbonate ions. Acidify with dilute HNO3 first for a reliable result.",visual:{type:"ppt",color:"#e5e7eb"},warning:true},first_with_acid:{text:"You add Ba(NO3)2 to the acidified sample. A WHITE precipitate forms and does NOT dissolve in acid.",visual:{type:"ppt",color:"#e5e7eb"}}},
        "AgNO3 solution":{first:{text:"You add AgNO3 solution. No precipitate forms.",visual:null}},
      },
      heating:{requiresReagent:"Aluminium foil",result:{text:"You heat the alkaline mixture with aluminium. No pungent gas is produced.",visual:null}},
      answer:{accepted:["SO4 2-","SO42-","sulfate","Sulfate","sulphate","Sulphate"],ionKey:"SO42-"},
      promptLabel:"What is the name or formula of the anion found?",
      placeholder:"e.g. sulfate or SO42-",
      hints:["Try NaOH + Al + heat — does it produce any gas? Then acidify with HNO3 and add Ba(NO3)2.","No gas from the NaOH + Al + heat test rules out nitrate. Look for an anion that forms a white ppt with Ba2+ insoluble in acid.","The answer is sulfate — SO42-. Barium sulfate (BaSO4) is a white precipitate insoluble in dilute HNO3."],
      solvedMessage:"SO42- confirmed in the wine.",
      evidence:{label:"SO42- in wine",detail:"Sulfate ions at abnormal concentrations in the wine.",icon:"🍷"},
    },
    {
      id:"conservatory",title:"The Conservatory",icon:"🌸",
      locationDesc:"Glass-walled conservatory where Oliver was found. Air feels thick and sharp. A flask discovered behind a fern.",
      policeReport:"CONSERVATORY — Oliver found slumped in his armchair. A sealed flask was discovered behind a potted fern with its label scratched off. A sharp, acrid smell was noted upon entry.\n\nACTION: Identify the gas in the flask.",
      objects:[{id:"flask",label:"Sealed Flask",icon:"🫙",pickup:true},{id:"litmus_red",label:"Damp Red Litmus Paper",icon:"🔴",pickup:true},{id:"litmus_blue",label:"Damp Blue Litmus Paper",icon:"🔵",pickup:true},{id:"limewater_tube",label:"Test Tube of Limewater",icon:"🥛",pickup:true},{id:"splint_burning",label:"Burning Splint",icon:"🕯️",pickup:true},{id:"splint_glowing",label:"Glowing Splint",icon:"✨",pickup:true},{id:"kmno4_paper",label:"Acidified KMnO4 Paper",icon:"🟣",pickup:true}],
      reagents:[],reactions:{},
      gasTests:{
        "litmus_red":{text:"Damp red litmus paper stays red — no change.",visual:null},
        "litmus_blue":{text:"Damp blue litmus paper turns RED.",visual:{type:"solution",color:"#ef4444"}},
        "limewater_tube":{text:"Nothing happens — limewater stays clear.",visual:null},
        "splint_burning":{text:"Burning splint is EXTINGUISHED — no pop sound.",visual:null},
        "splint_glowing":{text:"Glowing splint does not relight.",visual:null},
        "kmno4_paper":{text:"Acidified KMnO4 paper DECOLOURISES — bleaches to pale yellow!",visual:{type:"solution",color:"#ca8a04"}},
      },
      answer:{accepted:["SO2","SO2","sulfur dioxide","sulphur dioxide"]},
      promptLabel:"What is the name or formula of the gas?",
      placeholder:"e.g. SO2 or sulfur dioxide",
      hints:["Two tests gave visible changes. What do those two results have in common?","The gas is acidic (turns blue litmus red) and decolourises acidified KMnO4. Which acidic gases are also reducing agents?","The answer is sulfur dioxide — SO2. Acidic gas (turns blue litmus red) and strong reducing agent (decolourises KMnO4)."],
      solvedMessage:"SO2 confirmed. Sulfur dioxide at this concentration is a deadly respiratory irritant.",
      evidence:{label:"SO2 in conservatory",detail:"Flask of sulfur dioxide gas hidden behind a fern.",icon:"🫙"},
    },
  ],
  accusationGuide:"You found Zn2+ in the tea, SO42- in the wine, and SO2 in the conservatory. Connect the chemistry to the suspects.",
  guilty:"Lady Margaret Blackwood is guilty.\n\nEVIDENCE: Zn2+ in tea and SO42- in wine — both from zinc sulfate. SO2 from sulfur candles.\n\nMOTIVE: Gambling debts; Oliver refused to release her inheritance.\n\nCONNECTION: Purchased 5kg zinc sulfate. Sulfur candles from her garden shed produced SO2.",
  debrief:[
    {scenario:"Poisoned tea (Greenhouse)",ion:"Zn2+",realWorld:"Zinc poisoning is a real forensic concern. Zinc salts cause acute organ damage at high doses.",tests:[{reagent:"NaOH (few drops)",result:"White ppt forms"},{reagent:"NaOH (excess)",result:"Ppt DISSOLVES (amphoteric)"},{reagent:"Aqueous NH3 (few drops)",result:"White ppt forms"},{reagent:"Aqueous NH3 (excess)",result:"Ppt DISSOLVES"}]},
    {scenario:"Contaminated wine (Cellar)",ion:"SO42-",realWorld:"Sulfate testing is fundamental in water and beverage quality analysis.",tests:[{reagent:"Dilute HNO3 (first)",result:"No fizzing — confirms no carbonate interference"},{reagent:"Ba(NO3)2 solution",result:"White ppt (BaSO4) — insoluble in HNO3"},{reagent:"Key rule",result:"Always acidify FIRST, then add Ba(NO3)2"}]},
    {scenario:"Toxic gas weapon (Conservatory)",ion:"SO2",realWorld:"SO2 is a major industrial pollutant. At toxic concentrations it is lethal.",tests:[{reagent:"Damp blue litmus",result:"Turns RED (acidic gas)"},{reagent:"Acidified KMnO4",result:"DECOLOURISES (reducing agent)"},{reagent:"Limewater",result:"No change (distinguishes from CO2)"}]},
  ],
},
{
  id:"thornfield",title:"The Thornfield Tragedy",caseNumber:"#2025-0215",
  subtitle:"A chemical weapon in the greenhouse. Three contaminated sources.",
  coverIcon:"🌿",difficulty:"Advanced",
  victim:{name:"Sir Reginald Thornfield",summary:"Found dead in the sealed greenhouse at 6:45 AM on Saturday 15 February 2025. A ceramic dish with white crystalline residue was nearby. Ventilation was deliberately blocked. Cause of death: acute respiratory failure."},
  suspects:[
    {id:"clara",name:"Clara Ashford",title:"The Housekeeper",portrait:"👩‍🦰",color:"#e11d48",guilty:true,connection:"Maintains greenhouse fertilisers including ammonium chloride. Former chemistry lab technician.",motive:"",alibi:""},
    {id:"marsh",name:"Dr. Helena Marsh",title:"The Physician",portrait:"👩‍⚕️",color:"#2563eb",guilty:false,connection:"Stocks calcium carbonate, sodium hydrogen carbonate, and iron(II) sulfate.",motive:"",alibi:""},
    {id:"thomas",name:"Thomas Thornfield",title:"The Nephew",portrait:"👨‍🎓",color:"#d97706",guilty:false,connection:"Chemistry student with lab access to copper(II) sulfate and lead(II) nitrate. Uses soldering flux.",motive:"",alibi:""},
    {id:"pemberton",name:"Margaret Pemberton",title:"The Solicitor",portrait:"👩‍💼",color:"#16a34a",guilty:false,connection:"Amateur photographer using sodium thiosulfate and silver nitrate for developing photos.",motive:"",alibi:""},
  ],
  stations:[
    {
      id:"conservatory",title:"The Conservatory",icon:"☕",
      locationDesc:"Bright conservatory where Sir Reginald took afternoon tea. Crystalline residue found at the bottom of the teacup.",
      policeReport:"CONSERVATORY — Sample D collected from tea residue. Crystalline substance resembling sugar found at the bottom.\n\nSir Reginald complained of nausea and confusion approximately 30 minutes after tea on Friday.\n\nACTION: Test Sample D for the presence of toxic cations.",
      objects:[{id:"vial_d",label:"Vial — SAMPLE D",icon:"🧫",pickup:true},{id:"bunsen_burner",label:"Bunsen Burner",icon:"🔥",pickup:false},{id:"litmus_red_nh4",label:"Damp Red Litmus Paper",icon:"🔴",pickup:true},{id:"litmus_blue_nh4",label:"Damp Blue Litmus Paper",icon:"🔵",pickup:true}],
      reagents:["NaOH solution","Aqueous NH3"],
      reactions:{
        "NaOH solution":{first:{text:"You add a few drops of NaOH solution. No visible change — but you detect a faint pungent smell.",visual:null}},
        "Aqueous NH3":{first:{text:"You add aqueous ammonia. No visible change.",visual:null}},
      },
      heating:{requiresReagent:"NaOH solution",result:{text:"You warm the mixture. A PUNGENT gas is released. Damp red litmus paper turns BLUE!",visual:{type:"heating",bubbles:true,gasEmission:true},gasTest:"litmus_red_nh4"}},
      answer:{accepted:["NH4+","NH4+","ammonium","ammonium ion"]},
      promptLabel:"What is the name or formula of the cation found?",
      placeholder:"e.g. ammonium or NH4+",
      hints:["You added NaOH and detected a pungent smell. Try warming the mixture, then test the gas with damp red litmus paper.","The pungent gas that turns red litmus blue is ammonia. Which cation produces ammonia when warmed with NaOH?","The answer is ammonium — NH4+. Ammonium salts warmed with NaOH release NH3 gas, which turns damp red litmus blue."],
      solvedMessage:"NH4+ confirmed in the tea.",
      evidence:{label:"NH4+ in tea",detail:"Ammonium ions at toxic concentrations. Ammonium salts resemble sugar crystals.",icon:"☠️"},
    },
    {
      id:"library",title:"The Library",icon:"📚",
      locationDesc:"Sir Reginald's private library. An opened bottle of mineral water on the desk — he reportedly drank from it all morning.",
      policeReport:"LIBRARY — Sample E collected from an opened mineral water bottle on Sir Reginald's desk.\n\nThe bottle cap was loose despite being labelled sealed.\n\nACTION: Test Sample E for anion contamination.",
      objects:[{id:"vial_e",label:"Vial — SAMPLE E",icon:"🧪",pickup:true},{id:"bunsen_burner",label:"Bunsen Burner",icon:"🔥",pickup:false},{id:"litmus_red_lib",label:"Damp Red Litmus Paper",icon:"🔴",pickup:true},{id:"litmus_blue_lib",label:"Damp Blue Litmus Paper",icon:"🔵",pickup:true}],
      reagents:["NaOH solution","Aluminium foil","Dilute HNO3","AgNO3 solution","Ba(NO3)2 solution","Limewater"],
      isAnionStation:true,
      reactions:{
        "NaOH solution":{first:{text:"You add NaOH solution. The solution stays clear.",visual:null}},
        "Aluminium foil":{first_without_naoh:{text:"Nothing happens. Add NaOH solution first.",visual:null,warning:true},first_with_naoh:{text:"You add aluminium foil. Slow reaction. Try heating.",visual:null}},
        "Dilute HNO3":{first:{text:"You add dilute nitric acid. No fizzing.",visual:null}},
        "Limewater":{first:{text:"You add limewater. Nothing happens.",visual:null}},
        "AgNO3 solution":{first_without_acid:{text:"You add AgNO3 without acidifying first. A white precipitate forms — but acidify with HNO3 first for a reliable result.",visual:{type:"ppt",color:"#e5e7eb"},warning:true},first_with_acid:{text:"You add AgNO3 to the acidified sample. A WHITE precipitate forms and does NOT dissolve in acid.",visual:{type:"ppt",color:"#e5e7eb"}}},
        "Ba(NO3)2 solution":{first:{text:"You add Ba(NO3)2 solution. No precipitate forms.",visual:null}},
      },
      heating:{requiresReagent:"Aluminium foil",result:{text:"You heat the alkaline mixture with aluminium. No pungent gas is produced.",visual:null}},
      answer:{accepted:["Cl-","Cl-","chloride","chloride ion"]},
      promptLabel:"What is the name or formula of the anion found?",
      placeholder:"e.g. chloride or Cl-",
      hints:["Try NaOH + Al + heat — any gas? Then acidify with HNO3 and try AgNO3.","No gas from the NaOH + Al + heat test rules out nitrate. Look for an anion that forms a white ppt with Ag+ insoluble in acid.","The answer is chloride — Cl-. Silver chloride (AgCl) is a white precipitate insoluble in dilute HNO3."],
      solvedMessage:"Cl- confirmed in the mineral water.",
      evidence:{label:"Cl- in water",detail:"Chloride ions at dangerous concentrations.",icon:"💧"},
    },
    {
      id:"greenhouse",title:"The Greenhouse",icon:"🌿",
      locationDesc:"Sealed greenhouse where Sir Reginald died. A ceramic dish with white crystalline residue near the body.",
      policeReport:"GREENHOUSE — Sir Reginald found slumped in a chair. A ceramic dish with white crystalline residue was found nearby showing signs of heating. Ventilation was deliberately blocked.\n\nACTION: Identify the gas or gases present in the greenhouse.",
      objects:[{id:"gas_mixture",label:"Gas Mixture Sample",icon:"🧪",pickup:true},{id:"litmus_red_seq",label:"Damp Red Litmus Paper",icon:"🔴",pickup:true},{id:"litmus_blue_first",label:"Damp Blue Litmus Paper",icon:"🔵",pickup:true},{id:"kmno4_paper",label:"Acidified KMnO4 Paper",icon:"🟣",pickup:true},{id:"limewater_tube",label:"Limewater",icon:"🧪",pickup:true},{id:"splint_burning",label:"Burning Splint",icon:"🔥",pickup:true},{id:"splint_glowing",label:"Glowing Splint",icon:"✨",pickup:true}],
      reagents:[],reactions:{},
      mixedGas:true,
      gasTests:{
        "litmus_red_seq":{text:"Damp RED litmus paper turns BLUE — then turns RED again.",visual:{type:"solution",color:"#ef4444"},detectsGases:["NH3","HCl"]},
        "litmus_blue_first":{text:"Damp BLUE litmus paper turns RED immediately.",visual:{type:"solution",color:"#ef4444"},warning:true,hint:"Try RED litmus paper first for a clearer sequence of changes."},
        "kmno4_paper":{text:"Acidified KMnO4 paper — no change.",visual:null},
        "limewater_tube":{text:"Limewater stays clear — no change.",visual:null},
        "splint_burning":{text:"Burning splint EXTINGUISHES — no pop."},
        "splint_glowing":{text:"Glowing splint does not relight."},
      },
      answer:{accepted:[["NH3","HCl"],["NH3","HCl"],["ammonia","hydrogen chloride"],["HCl","NH3"],["HCl","NH3"],["hydrogen chloride","ammonia"]],requiresBoth:true},
      promptLabel:"What TWO gases are present? (separate with comma or 'and')",
      placeholder:"e.g. gas A, gas B",
      hints:["Red litmus turned blue, then red again. What does this sequence mean? You are looking for TWO gases — one alkaline, one acidic.","Think about NH4+ and Cl-. What compound do these form? What happens when you heat it strongly?","The answers are NH3 and HCl. NH4Cl(s) decomposes on heating: NH4Cl = NH3 + HCl."],
      solvedMessage:"NH3 and HCl confirmed. Heating ammonium chloride crystals produced this lethal gas mixture.",
      evidence:{label:"NH3 + HCl gases",detail:"Both ammonia and hydrogen chloride identified from thermal decomposition of NH4Cl.",icon:"☠️"},
    },
  ],
  accusationGuide:"You found NH4+ in the tea, Cl- in the water, and NH3 + HCl gases in the greenhouse. Connect the chemistry to the suspects.",
  guilty:"Clara Ashford is guilty.\n\nEVIDENCE: NH4+ in tea + Cl- in water = ammonium chloride. Heated NH4Cl produced NH3 + HCl gases.\n\nMOTIVE: Sir Reginald discovered embezzlement and was filing criminal charges.\n\nCONNECTION: Former chemistry lab technician. Maintains greenhouse fertilisers including ammonium chloride.",
  debrief:[
    {scenario:"Poisoned tea (Conservatory)",ion:"NH4+",realWorld:"Ammonium salt poisoning causes metabolic acidosis at high doses.",tests:[{reagent:"NaOH + heat",result:"NH3 gas released"},{reagent:"Damp red litmus",result:"Turns BLUE (alkaline gas)"},{reagent:"Key rule",result:"Warming is essential — reaction too slow at room temperature"}]},
    {scenario:"Contaminated water (Library)",ion:"Cl-",realWorld:"Chloride testing is fundamental in water quality analysis.",tests:[{reagent:"Dilute HNO3 (first)",result:"No fizz — rules out carbonate"},{reagent:"AgNO3 solution",result:"White ppt (AgCl) — insoluble in HNO3"},{reagent:"Key rule",result:"Always acidify with HNO3 BEFORE adding AgNO3"}]},
    {scenario:"Mixed gases (Greenhouse)",ion:"NH3 + HCl",realWorld:"Heating ammonium chloride: NH4Cl = NH3 + HCl. Extremely dangerous in enclosed spaces.",tests:[{reagent:"Red litmus first",result:"Turns BLUE (NH3), then RED (HCl)"},{reagent:"Blue litmus only",result:"Turns RED — misses NH3"},{reagent:"Connection",result:"NH4+ + Cl- = NH4Cl — source compound"}]},
  ],
},
];

const ION_LABELS = {
  "Cu2+":"Cu2+","copper(II)":"Cu2+","Zn2+":"Zn2+","zinc":"Zn2+",
  "NH4+":"NH4+","ammonium":"NH4+","NO3-":"NO3-","nitrate":"NO3-",
  "SO42-":"SO42-","SO4 2-":"SO42-","sulfate":"SO42-","sulphate":"SO42-",
  "Cl-":"Cl-","chloride":"Cl-","CO2":"CO2","carbon dioxide":"CO2",
  "SO2":"SO2","sulfur dioxide":"SO2","sulphur dioxide":"SO2",
  "NH3,HCl":"NH3+HCl","ammonia,hydrogen chloride":"NH3+HCl",
};
const CASE_IONS = {0:["Cu2+","NO3-","CO2"],1:["Zn2+","SO42-","SO2"],2:["NH4+","Cl-","NH3+HCl"]};
const CASE_NAMES = ["The Ashworth Affair","The Blackwood Inheritance","The Thornfield Tragedy"];

function StyledButton({children,onClick,variant="primary",style:ex,disabled}){
  const v={primary:{background:"linear-gradient(135deg,"+S.accent+",#a07840)",color:"#1a1a2e",boxShadow:"0 3px 16px "+S.accentDim},ghost:{background:"transparent",color:S.accent,border:"1px solid "+S.accent+"55"},danger:{background:"linear-gradient(135deg,#dc2626,#991b1b)",color:"#fff",boxShadow:"0 3px 16px #dc262633"}};
  return <button onClick={onClick} disabled={disabled} style={{padding:"9px 22px",borderRadius:6,border:"none",cursor:disabled?"not-allowed":"pointer",fontFamily:"'Georgia',serif",fontWeight:600,fontSize:13,letterSpacing:0.8,opacity:disabled?0.4:1,transition:"transform 0.15s",...v[variant],...ex}} onMouseEnter={e=>!disabled&&(e.currentTarget.style.transform="scale(1.04)")} onMouseLeave={e=>(e.currentTarget.style.transform="scale(1)")}>{children}</button>;
}

function SectionDivider({label}){
  return <div style={{display:"flex",alignItems:"center",gap:10,margin:"18px 0"}}><div style={{flex:1,height:1,background:S.border}}/><span style={{color:S.textMuted,fontSize:10,fontFamily:"'Courier New',monospace",letterSpacing:2,textTransform:"uppercase"}}>{label}</span><div style={{flex:1,height:1,background:S.border}}/></div>;
}

function ObsLog({entries}){
  if(!entries.length) return null;
  return <div style={{background:S.cardAlt,border:"1px solid "+S.border,borderRadius:8,padding:"10px 14px",marginTop:12}}><div style={{color:S.textMuted,fontSize:9,fontFamily:"'Courier New',monospace",letterSpacing:1.5,textTransform:"uppercase",marginBottom:7}}>📝 Observation Log</div>{entries.map((e,i)=>{const text=typeof e==="string"?e:e.text;const color=typeof e==="object"&&e.color?e.color:(i===entries.length-1?S.textPrimary:S.textSecondary);return <div key={i} style={{display:"flex",gap:7,marginBottom:i<entries.length-1?7:0,alignItems:"flex-start"}}><span style={{color:S.accent,fontSize:10,marginTop:2}}>›</span><span style={{color,fontSize:12.5,lineHeight:1.55}}>{text}</span></div>;})}</div>;
}

function SuspectCard({suspect,isFlipped,onFlip,color}){
  const c=color||suspect.color;
  return <div onClick={onFlip} style={{background:isFlipped?S.cardAlt:S.card,border:"1px solid "+(isFlipped?c+"55":S.border),borderRadius:10,cursor:"pointer",overflow:"hidden",transition:"all 0.25s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=c+"88"} onMouseLeave={e=>e.currentTarget.style.borderColor=isFlipped?c+"55":S.border}>
    <div style={{padding:"10px 12px",display:"flex",alignItems:"center",gap:10,borderBottom:isFlipped?"1px solid "+S.border:"none"}}>
      <div style={{width:38,height:38,borderRadius:"50%",background:c+"20",border:"2px solid "+c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{suspect.portrait}</div>
      <div style={{flex:1}}><div style={{color:S.textPrimary,fontSize:13,fontWeight:700,fontFamily:"'Georgia',serif"}}>{suspect.name}</div><div style={{color:c,fontSize:10,fontFamily:"'Courier New',monospace",letterSpacing:1}}>{suspect.title.toUpperCase()}</div></div>
      <span style={{color:S.textMuted,fontSize:16}}>{isFlipped?"▲":"▼"}</span>
    </div>
    {isFlipped&&<div style={{padding:"10px 12px 12px"}}><div style={{color:S.accent,fontSize:9,fontFamily:"'Courier New',monospace",letterSpacing:1.2,textTransform:"uppercase",marginBottom:3}}>Chemical Connection</div><p style={{color:S.textSecondary,fontSize:11.5,margin:0,lineHeight:1.5}}>{suspect.connection}</p></div>}
  </div>;
}

function VisualTestTube({liquidLevel=0,liquidColor="transparent",precipitateColor=null,precipitateHeight=0,bubbling=false,isHeating=false,airHoleOpen=false,theme="dark"}){
  const tubeBg=theme==="light"?"#f0f4f8":"#0f0f1a";
  const tubeBorder=theme==="light"?"#94a3b8":"#4a4a70";
  return <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"12px",minWidth:120,position:"relative"}}>
    <div style={{color:S.accent,fontSize:10,fontFamily:"'Courier New',monospace",fontWeight:600,marginBottom:8,letterSpacing:0.5}}>TEST TUBE</div>
    <div style={{position:"relative",width:60}}>
      {isHeating&&<div style={{position:"absolute",bottom:-52,left:"50%",transform:"translateX(-50%)",width:44,height:52,zIndex:20,pointerEvents:"none"}}>
        {airHoleOpen?<><div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:28,height:38,background:"linear-gradient(to top, #1040cc, #2060ff, #60b0ff)",borderRadius:"50% 50% 45% 45% / 60% 60% 40% 40%",animation:"flame-flicker 0.12s infinite alternate",filter:"blur(1.5px)"}}/><div style={{position:"absolute",bottom:3,left:"50%",transform:"translateX(-50%)",width:14,height:22,background:"linear-gradient(to top, #0020aa, #1050ff, #ffffff)",borderRadius:"50% 50% 45% 45% / 60% 60% 40% 40%",animation:"flame-core 0.15s infinite alternate",filter:"blur(0.5px)",zIndex:21}}/></>:<><div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:34,height:44,background:"linear-gradient(to top, #ff4500, #ff8c00, #ffd700)",borderRadius:"50% 50% 45% 45% / 60% 60% 40% 40%",animation:"flame-flicker 0.2s infinite alternate",filter:"blur(2px)"}}/><div style={{position:"absolute",bottom:2,left:"50%",transform:"translateX(-50%)",width:18,height:28,background:"linear-gradient(to top, #ff6b00, #ffaa00, #ffe066)",borderRadius:"50% 50% 45% 45% / 60% 60% 40% 40%",animation:"flame-flicker 0.25s infinite alternate-reverse",filter:"blur(1px)",zIndex:21}}/></>}
      </div>}
      <div style={{position:"relative",width:60,height:120,backgroundColor:tubeBg,border:"2px solid "+tubeBorder,borderRadius:"4px 4px 16px 16px",overflow:"hidden",boxShadow:"inset 0 2px 8px rgba(0,0,0,0.4)"}}>
        {liquidLevel>0&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:liquidLevel+"%",background:liquidColor,transition:"all 0.6s ease",borderRadius:"0 0 14px 14px"}}/>}
        {precipitateColor&&precipitateHeight>0&&<div style={{position:"absolute",bottom:0,left:"12%",right:"12%",height:precipitateHeight+"%",background:precipitateColor,borderRadius:"40% 40% 0 0 / 50% 50% 0 0",transition:"all 0.5s ease",zIndex:2,animation:"precipitate-settle 0.8s ease-out"}}/>}
        {bubbling&&[1,2,3,4,5].map(i=><div key={i} style={{position:"absolute",bottom:"15%",left:(15+i*12)+"%",width:i%2===0?5:6,height:i%2===0?5:6,borderRadius:"50%",background:"rgba(255,255,255,0.6)",animation:"bubble-rise "+(0.8+i*0.15)+"s infinite ease-in",animationDelay:(i*0.12)+"s"}}/>)}
        <div style={{position:"absolute",top:"12%",left:"6%",width:"22%",height:"35%",background:"linear-gradient(135deg,rgba(255,255,255,0.13),transparent)",borderRadius:"50%",pointerEvents:"none"}}/>
      </div>
    </div>
    <style>{`@keyframes precipitate-settle{0%{transform:translateY(-40px);opacity:0}100%{transform:translateY(0);opacity:1}}@keyframes bubble-rise{0%{transform:translateY(0) scale(0.5);opacity:0}10%{opacity:0.8}100%{transform:translateY(-85px) scale(0.3);opacity:0}}@keyframes flame-flicker{0%{transform:translateX(-50%) scaleY(1)}100%{transform:translateX(-50%) scaleY(1.08) scaleX(0.95)}}@keyframes flame-core{0%{transform:translateX(-50%) scaleY(1)}100%{transform:translateX(-50%) scaleY(1.15)}}@keyframes fade-in{0%{opacity:0}100%{opacity:1}}`}</style>
  </div>;
}

function DraggableReagentBottle({name,used}){
  const [isDragging,setIsDragging]=useState(false);
  return <div draggable onDragStart={e=>{setIsDragging(true);e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("reagent",name)}} onDragEnd={()=>setIsDragging(false)}
    style={{background:S.card,border:"2px solid "+(used?S.accent:S.borderHi),borderRadius:8,padding:"8px 12px",cursor:isDragging?"grabbing":"grab",transition:"all 0.2s",minWidth:85,opacity:isDragging?0.5:1}}
    onMouseEnter={e=>e.currentTarget.style.borderColor=S.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=used?S.accent:S.borderHi}>
    <div style={{fontSize:28,textAlign:"center"}}>{name==="Aluminium foil"?"🗞️":"🧴"}</div>
    <div style={{color:used?S.accent:S.textMuted,fontSize:9,textAlign:"center",fontFamily:"'Courier New',monospace",lineHeight:1.2}}>{name}</div>
    {used&&<div style={{color:S.accent,fontSize:8,textAlign:"center",marginTop:2,fontFamily:"'Courier New',monospace"}}>(add excess)</div>}
  </div>;
}

function TestTubeDropZone({children,onReagentDrop}){
  const [isOver,setIsOver]=useState(false);
  return <div onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect="move";setIsOver(true)}} onDragLeave={()=>setIsOver(false)} onDrop={e=>{e.preventDefault();setIsOver(false);const r=e.dataTransfer.getData("reagent");if(r&&onReagentDrop)onReagentDrop(r);}}
    style={{position:"relative",border:isOver?"2px dashed "+S.accent:"2px dashed transparent",borderRadius:8,padding:4,transition:"all 0.2s"}}>
    {children}
    {isOver&&<div style={{position:"absolute",top:-20,left:"50%",transform:"translateX(-50%)",background:S.accent,color:"#1a1a2e",padding:"4px 8px",borderRadius:4,fontSize:9,fontFamily:"'Courier New',monospace",whiteSpace:"nowrap",fontWeight:600,pointerEvents:"none"}}>Drop here</div>}
  </div>;
}

function LimewaterSetup({active=false}){
  const [phase,setPhase]=useState(0);
  useEffect(()=>{if(!active)return;const t1=setTimeout(()=>setPhase(1),1000);const t2=setTimeout(()=>setPhase(2),4200);return()=>{clearTimeout(t1);clearTimeout(t2);};},[active]);
  const tubeColor=phase===0?"rgba(255,255,255,0.06)":phase===1?"rgba(220,225,230,0.92)":"rgba(255,255,255,0.06)";
  const phaseLabel=phase===0?"BEFORE":phase===1?"WHITE PPT":"COLOURLESS";
  return <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 4px"}}>
    <div style={{color:"#c8a96e",fontSize:9,fontFamily:"'Courier New',monospace",fontWeight:600,marginBottom:6}}>LIMEWATER TEST</div>
    <svg width="170" height="180" viewBox="0 0 170 180" style={{overflow:"visible"}}>
      <path d="M 42 95 L 20 155 Q 20 162 28 162 L 72 162 Q 80 162 80 155 L 58 95 Z" fill="rgba(255,255,255,0.06)" stroke="#4a4a70" strokeWidth="2"/>
      <rect x="44" y="60" width="14" height="36" rx="2" fill="rgba(255,255,255,0.06)" stroke="#4a4a70" strokeWidth="2"/>
      <rect x="41" y="54" width="20" height="10" rx="3" fill="#c2793a" stroke="#a05a20" strokeWidth="1.5"/>
      <path d="M 44 130 L 23 155 Q 23 159 28 159 L 72 159 Q 77 159 77 155 L 56 130 Z" fill="rgba(200,220,255,0.25)"/>
      <line x1="51" y1="54" x2="51" y2="28" stroke="#8888aa" strokeWidth="3" strokeLinecap="round"/>
      <line x1="51" y1="28" x2="130" y2="28" stroke="#8888aa" strokeWidth="3" strokeLinecap="round"/>
      <line x1="130" y1="28" x2="130" y2="98" stroke="#8888aa" strokeWidth="3" strokeLinecap="round"/>
      <rect x="118" y="75" width="24" height="80" rx="3" fill="rgba(255,255,255,0.05)" stroke="#4a4a70" strokeWidth="2"/>
      <rect x="120" y={phase===0?105:95} width="20" height={phase===0?50:60} rx="2" fill={tubeColor} style={{transition:"fill 2s ease-in-out"}}/>
      {phase===1&&[123,128,133,126,131].map((x,i)=><circle key={i} cx={x} cy={115+i*7} r="2.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" opacity="0.95"/>)}
      <text x="130" y="172" textAnchor="middle" fill="#1a1a1a" fontSize="6.5" fontFamily="'Courier New',monospace">limewater</text>
      <text x="51" y="50" textAnchor="middle" fill="#1a1a1a" fontSize="6.5" fontFamily="'Courier New',monospace">gas</text>
    </svg>
    <div style={{color:phase===1?"#1a1a1a":"#c8a96e",fontSize:8,fontFamily:"'Courier New',monospace",fontWeight:600,marginTop:2}}>{phaseLabel}</div>
    <div style={{display:"flex",gap:4,marginTop:4}}>{[0,1,2].map(p=><div key={p} style={{width:6,height:6,borderRadius:"50%",background:phase===p?"#c8a96e":"#333",transition:"background 0.4s"}}/>)}</div>
  </div>;
}

function GasTestVisual({testItem,result,theme="dark"}){
  const [showingResult,setShowingResult]=useState(false);
  const [phase,setPhase]=useState(0);
  useEffect(()=>{const t=setTimeout(()=>setShowingResult(true),800);return()=>clearTimeout(t);},[]);
  const visuals={
    litmus_red_stays:{type:"paper",initialColor:"#ef4444",finalColor:"#ef4444",label:"Red (no change)"},
    litmus_red_to_blue:{type:"paper",initialColor:"#ef4444",finalColor:"#3b82f6",label:"Red → Blue",animate:true},
    litmus_red_sequential:{type:"paper_sequential",initialColor:"#ef4444",midColor:"#3b82f6",finalColor:"#ef4444",label:"Red → Blue → Red",animate:true},
    litmus_blue_stays:{type:"paper",initialColor:"#3b82f6",finalColor:"#3b82f6",label:"Blue (no change)"},
    litmus_blue_to_red:{type:"paper",initialColor:"#3b82f6",finalColor:"#ef4444",label:"Blue → Red",animate:true},
    limewater_co2:{type:"tube_co2",label:"Clear → White ppt → Colourless",animate:true},
    limewater_clear:{type:"tube_clear",label:"Clear (no change)"},
    kmno4_decolorized:{type:"paper",initialColor:"#a855f7",finalColor:"#f5f5f5",label:"Purple → Decolorized",animate:true},
    kmno4_stays:{type:"paper",initialColor:"#a855f7",finalColor:"#a855f7",label:"Purple (no change)"},
    splint_burning_extinguished:{type:"splint",label:"Flame extinguished",burning:true,extinguished:true,animate:true},
    splint_glowing_stays:{type:"splint",label:"Does not relight",glowing:true},
  };
  const visual=visuals[result]||{type:"paper",initialColor:"#888",finalColor:"#888",label:result};
  useEffect(()=>{if(visual.type==="paper_sequential"&&showingResult){setTimeout(()=>setPhase(1),500);setTimeout(()=>setPhase(2),2500);}},[showingResult,visual.type]);
  if(visual.type==="paper_sequential"){
    const c=phase===0?visual.initialColor:phase===1?visual.midColor:visual.finalColor;
    return <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:8}}><div style={{color:S.accent,fontSize:9,fontFamily:"'Courier New',monospace",marginBottom:6}}>{testItem.replace(/_/g," ").toUpperCase()}</div><div style={{width:40,height:60,background:c,border:"2px solid #4a4a70",borderRadius:4,transition:"background-color 1.5s ease-in-out"}}/><div style={{color:S.textMuted,fontSize:8,marginTop:6,textAlign:"center"}}>{visual.label}</div></div>;
  }
  if(visual.type==="paper"){
    return <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:8}}><div style={{color:S.accent,fontSize:9,fontFamily:"'Courier New',monospace",marginBottom:6}}>{testItem.replace(/_/g," ").toUpperCase()}</div><div style={{width:40,height:60,background:showingResult&&visual.animate?visual.finalColor:visual.initialColor,border:"2px solid #4a4a70",borderRadius:4,transition:visual.animate?"background-color 2.5s ease-in-out":"none"}}/><div style={{color:S.textMuted,fontSize:8,marginTop:4,textAlign:"center"}}>{visual.label}</div></div>;
  }
  if(visual.type==="tube_co2") return <LimewaterSetup active={showingResult}/>;
  if(visual.type==="tube_clear") return <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:8}}><div style={{color:S.accent,fontSize:9,fontFamily:"'Courier New',monospace",marginBottom:6}}>LIMEWATER</div><div style={{width:50,height:80,background:"#0f0f1a",border:"2px solid #4a4a70",borderRadius:"4px 4px 12px 12px"}}/><div style={{color:S.textMuted,fontSize:8,marginTop:4}}>{visual.label}</div></div>;
  if(visual.type==="splint") return <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:8,minWidth:110}}><div style={{color:S.accent,fontSize:9,fontFamily:"'Courier New',monospace",marginBottom:6}}>{visual.burning?"BURNING SPLINT":"GLOWING SPLINT"}</div><div style={{width:60,height:90,display:"flex",justifyContent:"center",position:"relative"}}><div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:7,height:70,background:"linear-gradient(to top, #8B5E3C, #c8a060)",borderRadius:"2px 2px 0 0"}}/></div><div style={{color:S.textMuted,fontSize:8,marginTop:4,textAlign:"center"}}>{visual.label}</div></div>;
  return null;
}

function StatCard({icon,label,value,sub,color="#c2955a"}){
  return <div style={{background:S.card,border:"1px solid "+S.border,borderRadius:10,padding:"14px 16px",flex:"1 1 140px"}}><div style={{fontSize:22,marginBottom:4}}>{icon}</div><div style={{color,fontSize:22,fontWeight:700,fontFamily:"'Georgia',serif"}}>{value}</div><div style={{color:S.textPrimary,fontSize:12,fontWeight:600}}>{label}</div>{sub&&<div style={{color:S.textMuted,fontSize:11,marginTop:2}}>{sub}</div>}</div>;
}

function BarRow({label,value,max,color,right}){
  const pct=max>0?Math.round((value/max)*100):0;
  return <div style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{color:S.textSecondary,fontSize:12}}>{label}</span><span style={{color,fontSize:12,fontWeight:600}}>{right||value}</span></div><div style={{height:6,background:S.cardAlt,borderRadius:3,overflow:"hidden"}}><div style={{width:pct+"%",height:"100%",background:color,borderRadius:3,transition:"width 0.6s ease"}}/></div></div>;
}

function TeacherDashboard({onBack}){
  const [students,setStudents]=useState([]);
  const [filter,setFilter]=useState("");
  const [tab,setTab]=useState("overview");
  const [selectedStudent,setSelectedStudent]=useState(null);
  const [classFilter,setClassFilter]=useState("");
  const [confirmClear,setConfirmClear]=useState(false);
  const [confirmDelete,setConfirmDelete]=useState(null);

  useEffect(()=>{
    const fetch=async()=>{const snap=await getDocs(collection(db,"students"));const all=snap.docs.map(d=>d.data());all.sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp));setStudents(all);};
    fetch();
  },[]);

  const filtered=students.filter(s=>s.id.toLowerCase().includes(filter.toLowerCase())||s.fullName.toLowerCase().includes(filter.toLowerCase())||s.class.toLowerCase().includes(filter.toLowerCase()));
  const totalSessions=students.length;
  const completedAll=students.filter(s=>(s.casesCompleted||[]).length>=3).length;
  const completionRate=totalSessions>0?Math.round((completedAll/totalSessions)*100):0;

  const ionWrong={};const ionTotal={};
  students.forEach(s=>{(s.ionAttempts||[]).forEach(a=>{const label=ION_LABELS[a.ion]||a.ion;ionWrong[label]=(ionWrong[label]||0)+(a.wrong||0);ionTotal[label]=(ionTotal[label]||0)+(a.total||0);});});
  const ionList=Object.keys(ionWrong).sort((a,b)=>ionWrong[b]-ionWrong[a]);
  const maxWrong=ionList.length>0?Math.max(...ionList.map(k=>ionWrong[k])):1;

  const classMap={};
  students.forEach(s=>{const cls=s.class||"Unknown";if(!classMap[cls])classMap[cls]={sessions:0,completed:0,wrongAttempts:0};classMap[cls].sessions++;if((s.casesCompleted||[]).length>=3)classMap[cls].completed++;classMap[cls].wrongAttempts+=(s.ionAttempts||[]).reduce((sum,a)=>sum+(a.wrong||0),0);});
  const classList=Object.entries(classMap).sort((a,b)=>b[1].completed-a[1].completed);

  const deleteStudent=async(id)=>{await deleteDoc(doc(db,"students",id));setStudents(prev=>prev.filter(s=>s.id!==id));setConfirmDelete(null);};
  const clearAllData=async()=>{const snap=await getDocs(collection(db,"students"));await Promise.all(snap.docs.map(d=>deleteDoc(doc(db,"students",d.id))));setStudents([]);setConfirmClear(false);};

  const tabs=[{id:"overview",label:"Overview"},{id:"analytics",label:"Analytics"},{id:"students",label:"Students"}];

  return <div>
    <div style={{marginBottom:18}}>
      <button onClick={onBack} style={{background:"transparent",border:"none",color:S.textMuted,fontSize:11,fontFamily:"'Courier New',monospace",cursor:"pointer",padding:0,marginBottom:10}}>← Back</button>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><h2 style={{margin:"0 0 4px",fontFamily:"'Georgia',serif",fontSize:22,color:S.textPrimary}}>Teacher Dashboard</h2><p style={{color:S.textMuted,fontSize:12,margin:0}}>{totalSessions} session{totalSessions!==1?"s":""} recorded</p></div>
        <div>{!confirmClear?<button onClick={()=>setConfirmClear(true)} style={{background:"transparent",border:"1px solid "+S.red+"55",borderRadius:6,padding:"6px 12px",cursor:"pointer",color:S.red,fontSize:11,fontFamily:"'Courier New',monospace"}}>🗑️ Clear All</button>:<div style={{display:"flex",alignItems:"center",gap:6,background:S.red+"12",border:"1px solid "+S.red+"44",borderRadius:6,padding:"6px 10px"}}><span style={{color:S.red,fontSize:11}}>Delete all {totalSessions} records?</span><button onClick={clearAllData} style={{background:S.red,border:"none",borderRadius:4,padding:"3px 10px",cursor:"pointer",color:"#fff",fontSize:11,fontWeight:700}}>Yes</button><button onClick={()=>setConfirmClear(false)} style={{background:"transparent",border:"1px solid "+S.border,borderRadius:4,padding:"3px 10px",cursor:"pointer",color:S.textMuted,fontSize:11}}>Cancel</button></div>}</div>
      </div>
    </div>
    <div style={{display:"flex",gap:4,marginBottom:18,borderBottom:"1px solid "+S.border}}>
      {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{background:"transparent",border:"none",borderBottom:"2px solid "+(tab===t.id?S.accent:"transparent"),padding:"6px 14px 8px",cursor:"pointer",color:tab===t.id?S.accent:S.textMuted,fontSize:13,fontFamily:"'Georgia',serif",fontWeight:600,marginBottom:-1}}>{t.label}</button>)}
    </div>
    {tab==="overview"&&<div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:18}}>
        <StatCard icon="👥" label="Total Sessions" value={totalSessions} sub="unique registrations"/>
        <StatCard icon="✅" label="Completed All 3" value={completionRate+"%"} sub={completedAll+" of "+totalSessions} color="#22c55e"/>
        <StatCard icon="📚" label="Classes Active" value={classList.length} sub="distinct groups" color="#3b82f6"/>
        <StatCard icon="⚠️" label="Struggling Ions/Gases" value={ionList.length>0?ionList[0]:"—"} sub={ionList.length>0?ionWrong[ionList[0]]+" wrong attempts":"no data"} color="#f97316"/>
      </div>
      <div style={{background:S.cardAlt,border:"1px solid "+S.border,borderRadius:10,padding:"14px 16px",marginBottom:14}}>
        <div style={{color:S.accent,fontSize:11,fontFamily:"'Courier New',monospace",letterSpacing:1.2,textTransform:"uppercase",marginBottom:12}}>📊 Case Completion</div>
        {CASE_NAMES.map((name,i)=>{const done=students.filter(s=>(s.casesCompleted||[]).includes(i)).length;return <BarRow key={i} label={name} value={done} max={totalSessions||1} color={["#c2955a","#3b82f6","#8b5cf6"][i]} right={done+" / "+totalSessions}/>;})}</div>
      {classList.length>0&&<div style={{background:S.cardAlt,border:"1px solid "+S.border,borderRadius:10,padding:"14px 16px"}}>
        <div style={{color:S.accent,fontSize:11,fontFamily:"'Courier New',monospace",letterSpacing:1.2,textTransform:"uppercase",marginBottom:12}}>🏆 Class Leaderboard</div>
        {classList.slice(0,8).map(([cls,data],i)=>{const rate=data.sessions>0?Math.round((data.completed/data.sessions)*100):0;return <div key={cls} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{color:i===0?"#fbbf24":i===1?"#9ca3af":i===2?"#b45309":S.textMuted,fontSize:14,width:20,textAlign:"center"}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":(i+1)+"."}</span><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{color:S.textPrimary,fontSize:13,fontWeight:600}}>Class {cls}</span><span style={{color:S.accent,fontSize:12}}>{rate}% complete</span></div><div style={{height:5,background:S.card,borderRadius:3,overflow:"hidden"}}><div style={{width:rate+"%",height:"100%",background:i===0?"#fbbf24":S.accent,borderRadius:3}}/></div><div style={{color:S.textMuted,fontSize:10,marginTop:2}}>{data.sessions+" session"+(data.sessions!==1?"s":"")+" · "+data.wrongAttempts+" wrong attempt"+(data.wrongAttempts!==1?"s":"")}</div></div></div>;})}
      </div>}
    </div>}
    {tab==="analytics"&&<div>
      <div style={{background:S.cardAlt,border:"1px solid "+S.border,borderRadius:10,padding:"14px 16px",marginBottom:14}}>
        <div style={{color:S.accent,fontSize:11,fontFamily:"'Courier New',monospace",letterSpacing:1.2,textTransform:"uppercase",marginBottom:4}}>🧪 Wrong Attempts by Ion/Gas</div>
        <div style={{color:S.textMuted,fontSize:11,marginBottom:12}}>Ions with the most wrong answers</div>
        {ionList.length===0?<div style={{color:S.textMuted,fontSize:12,textAlign:"center",padding:"20px 0"}}>No data yet.</div>:ionList.map(ion=><BarRow key={ion} label={ion} value={ionWrong[ion]} max={maxWrong} color="#ef4444" right={ionWrong[ion]+" wrong / "+(ionTotal[ion]||0)+" total"}/>)}
      </div>
      <div style={{background:S.cardAlt,border:"1px solid "+S.border,borderRadius:10,padding:"14px 16px"}}>
        <div style={{color:S.accent,fontSize:11,fontFamily:"'Courier New',monospace",letterSpacing:1.2,textTransform:"uppercase",marginBottom:12}}>🔬 Ion Performance by Case</div>
        {[0,1,2].map(cIdx=><div key={cIdx} style={{marginBottom:cIdx<2?16:0}}><div style={{color:S.textSecondary,fontSize:12,fontWeight:600,marginBottom:6}}>{CASE_NAMES[cIdx]}</div>{(CASE_IONS[cIdx]||[]).map(ion=>{const wrong=ionWrong[ion]||0;const total=ionTotal[ion]||0;const acc=total>0?Math.round(((total-wrong)/total)*100):null;return <div key={ion} style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,padding:"6px 10px",background:S.card,borderRadius:6}}><span style={{color:S.accent,fontSize:12,fontFamily:"'Courier New',monospace",fontWeight:700,minWidth:70}}>{ion}</span><div style={{flex:1}}><div style={{height:5,background:S.cardAlt,borderRadius:3,overflow:"hidden"}}><div style={{width:(acc||0)+"%",height:"100%",background:acc===null?"#555":acc>=80?"#22c55e":acc>=50?"#f97316":"#ef4444",borderRadius:3}}/></div></div><span style={{color:acc===null?S.textMuted:acc>=80?"#4ade80":acc>=50?"#fb923c":"#f87171",fontSize:11,minWidth:70,textAlign:"right"}}>{acc===null?"no data":acc+"% correct"}</span></div>;})}
        </div>)}
      </div>
    </div>}
    {tab==="students"&&<div>
      {selectedStudent?<div>
        <button onClick={()=>setSelectedStudent(null)} style={{background:"transparent",border:"none",color:S.textMuted,fontSize:11,fontFamily:"'Courier New',monospace",cursor:"pointer",padding:0,marginBottom:12}}>← Back to students</button>
        <div style={{background:S.cardAlt,border:"1px solid "+S.border,borderRadius:10,padding:"14px 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><div style={{fontSize:28}}>🕵️</div><div><div style={{color:S.textPrimary,fontSize:16,fontWeight:700,fontFamily:"'Georgia',serif"}}>{selectedStudent.fullName}</div><div style={{color:S.textMuted,fontSize:11}}>Preferred: {selectedStudent.displayName} · Class: {selectedStudent.class}</div></div></div>
          <div style={{marginBottom:12}}><div style={{color:S.accent,fontSize:11,fontFamily:"'Courier New',monospace",textTransform:"uppercase",marginBottom:8}}>Cases Completed</div>{CASE_NAMES.map((name,i)=>{const done=(selectedStudent.casesCompleted||[]).includes(i);return <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,padding:"6px 10px",background:S.card,borderRadius:6}}><span style={{fontSize:14}}>{done?"✅":"⬜"}</span><span style={{color:done?S.textPrimary:S.textMuted,fontSize:12}}>{name}</span></div>;})}</div>
          <div><div style={{color:S.accent,fontSize:11,fontFamily:"'Courier New',monospace",textTransform:"uppercase",marginBottom:8}}>Ion/Gas Performance</div>{(selectedStudent.ionAttempts||[]).length===0?<div style={{color:S.textMuted,fontSize:12}}>No data recorded.</div>:(selectedStudent.ionAttempts||[]).map((a,i)=>{const label=ION_LABELS[a.ion]||a.ion;const correct=a.total-a.wrong;const acc=a.total>0?Math.round((correct/a.total)*100):0;return <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,padding:"6px 10px",background:S.card,borderRadius:6}}><span style={{color:S.accent,fontSize:12,fontFamily:"'Courier New',monospace",fontWeight:700,minWidth:70}}>{label}</span><div style={{flex:1}}><div style={{height:5,background:S.cardAlt,borderRadius:3,overflow:"hidden"}}><div style={{width:acc+"%",height:"100%",background:acc>=80?"#22c55e":acc>=50?"#f97316":"#ef4444",borderRadius:3}}/></div></div><span style={{color:acc>=80?"#4ade80":acc>=50?"#fb923c":"#f87171",fontSize:11}}>{correct}/{a.total} correct</span></div>;})}
          </div>
        </div>
      </div>:<div>
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
          <input type="text" value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search by name, ID, or class…" style={{flex:1,minWidth:160,background:S.card,border:"1px solid "+S.border,borderRadius:6,padding:"10px 12px",color:S.textPrimary,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
          <select value={classFilter} onChange={e=>setClassFilter(e.target.value)} style={{background:S.card,border:"1px solid "+S.border,borderRadius:6,padding:"10px 12px",color:S.textPrimary,fontSize:13,outline:"none",cursor:"pointer"}}>
            <option value="">All Classes</option>
            {[...new Set(students.map(s=>s.class))].sort().map(c=><option key={c} value={c}>Class {c}</option>)}
          </select>
        </div>
        <div style={{background:S.cardAlt,border:"1px solid "+S.border,borderRadius:10,overflow:"hidden"}}>
          {filtered.filter(s=>!classFilter||s.class===classFilter).length===0?<div style={{padding:40,textAlign:"center",color:S.textMuted}}>No students found.</div>:<div style={{maxHeight:500,overflowY:"auto"}}>
            {filtered.filter(s=>!classFilter||s.class===classFilter).map((student,i,arr)=><div key={student.id} onClick={()=>setSelectedStudent(student)} style={{padding:"12px 16px",borderBottom:i<arr.length-1?"1px solid "+S.border:"none",cursor:"pointer",transition:"background 0.2s"}} onMouseEnter={e=>e.currentTarget.style.background=S.accent+"08"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:4}}><span style={{color:S.accent,fontSize:13,fontWeight:700,fontFamily:"'Georgia',serif"}}>{student.fullName}</span><span style={{color:S.textMuted,fontSize:10,fontFamily:"'Courier New',monospace"}}>({student.displayName})</span></div>
                  <div style={{display:"flex",gap:14,fontSize:11,color:S.textSecondary,flexWrap:"wrap"}}><span>Class: <strong style={{color:S.textPrimary}}>{student.class}</strong></span><span>Cases: <strong style={{color:S.accent}}>{(student.casesCompleted||[]).length}/3</strong></span><span>{new Date(student.timestamp).toLocaleString()}</span></div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{color:S.textMuted,fontSize:18}}>›</span>
                  {confirmDelete===student.id?<div style={{display:"flex",alignItems:"center",gap:5}} onClick={e=>e.stopPropagation()}><span style={{color:S.red,fontSize:10}}>Delete?</span><button onClick={e=>{e.stopPropagation();deleteStudent(student.id);}} style={{background:S.red,border:"none",borderRadius:4,padding:"3px 8px",cursor:"pointer",color:"#fff",fontSize:10,fontWeight:700}}>Yes</button><button onClick={e=>{e.stopPropagation();setConfirmDelete(null);}} style={{background:"transparent",border:"1px solid "+S.border,borderRadius:4,padding:"3px 8px",cursor:"pointer",color:S.textMuted,fontSize:10}}>No</button></div>:<button onClick={e=>{e.stopPropagation();setConfirmDelete(student.id);}} style={{background:"transparent",border:"1px solid "+S.red+"44",borderRadius:5,padding:"4px 8px",cursor:"pointer",color:S.red,fontSize:11}} onMouseEnter={e=>e.currentTarget.style.background=S.red+"12"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>🗑️</button>}
                </div>
              </div>
            </div>)}
          </div>}
        </div>
      </div>}
    </div>}
  </div>;
}

function PasswordPrompt({onSuccess,onCancel}){
  const [pw,setPw]=useState("");const [err,setErr]=useState("");const [shake,setShake]=useState(false);
  const submit=()=>{if(pw==="csi2025"){onSuccess();}else{setErr("Incorrect password");setShake(true);setTimeout(()=>setShake(false),400);setPw("");}};
  return <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}>
    <div style={{background:S.card,border:"1px solid "+S.border,borderRadius:10,padding:"24px 28px",maxWidth:400,width:"90%",animation:shake?"shake 0.4s ease":"none"}}>
      <div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:36,marginBottom:8}}>🔐</div><h3 style={{margin:"0 0 6px",fontFamily:"'Georgia',serif",fontSize:18,color:S.textPrimary}}>Teacher Access</h3></div>
      <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Password" autoFocus style={{width:"100%",background:S.cardAlt,border:"1px solid "+S.border,borderRadius:6,padding:"10px 12px",color:S.textPrimary,fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:12,fontFamily:"'Courier New',monospace"}}/>
      {err&&<div style={{color:S.red,fontSize:11,marginBottom:12,textAlign:"center"}}>{err}</div>}
      <div style={{display:"flex",gap:8}}><StyledButton onClick={onCancel} variant="ghost" style={{flex:1}}>Cancel</StyledButton><StyledButton onClick={submit} style={{flex:1}}>Enter</StyledButton></div>
    </div>
    <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}`}</style>
  </div>;
}

function PhaseRegister({onRegister,onOpenDashboard}){
  const [name,setName]=useState("");const [className,setClassName]=useState("");const [preferredName,setPreferredName]=useState("");const [error,setError]=useState("");const [shake,setShake]=useState(false);const [clickCount,setClickCount]=useState(0);const [showPw,setShowPw]=useState(false);
  const getInitials=n=>n.trim().split(/\s+/).map(w=>w.charAt(0).toUpperCase()).join("");
  const handleSubmit=async()=>{
    if(!name.trim()||!className.trim()||!preferredName.trim()){setError("All fields are required!");setShake(true);setTimeout(()=>setShake(false),400);return;}
    if(/\d/.test(name)){setError("Full name should not contain numbers!");setShake(true);setTimeout(()=>setShake(false),400);return;}
    const baseId=getInitials(name).toLowerCase()+"_"+className.trim().toLowerCase().replace(/\s+/g,"_");
    const displayName=preferredName.trim();
    try{
      let finalId=baseId;
      const existing=await getDoc(doc(db,"students",baseId));
      if(existing.exists()){let suffix=2;while((await getDoc(doc(db,"students",baseId+"_"+suffix))).exists())suffix++;finalId=baseId+"_"+suffix;}
      const data={fullName:name.trim(),displayName,class:className.trim(),id:finalId,timestamp:new Date().toISOString(),casesCompleted:[],ionAttempts:[],caseTimes:[]};
      await setDoc(doc(db,"students",finalId),data);
      onRegister(data);
    }catch(e){setError("Error: "+e.message);}
  };
  return <div style={{animation:shake?"shake 0.4s ease":"none"}}>
    <div onClick={()=>{const n=clickCount+1;setClickCount(n);if(n>=5){setShowPw(true);setClickCount(0);}}} style={{position:"absolute",top:10,right:10,width:20,height:20,opacity:0.15,cursor:"pointer",fontSize:14}} title="Teacher access">🔑</div>
    {showPw&&<PasswordPrompt onSuccess={()=>{setShowPw(false);onOpenDashboard();}} onCancel={()=>setShowPw(false)}/>}
    <div style={{textAlign:"center",marginBottom:24}}><div style={{fontSize:48,marginBottom:8}}>🔍</div><h2 style={{margin:"0 0 6px",fontFamily:"'Georgia',serif",fontSize:24,color:S.textPrimary}}>Detective Registration</h2><p style={{color:S.textSecondary,fontSize:13,margin:0,lineHeight:1.6}}>Welcome to the Metropolitan Police Forensic Division.</p></div>
    <div style={{background:S.cardAlt,border:"1px solid "+S.border,borderRadius:10,padding:"20px 24px",marginBottom:16}}>
      <div style={{marginBottom:16}}><label style={{display:"block",color:S.accent,fontSize:11,fontFamily:"'Courier New',monospace",letterSpacing:1,textTransform:"uppercase",marginBottom:3}}>👤 Full Name</label><div style={{color:S.textMuted,fontSize:10,marginBottom:5}}>For teacher tracking purposes only</div><input type="text" value={name} onChange={e=>{setName(e.target.value);setError("");}} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} placeholder="e.g. Sarah Chen Li Si" style={{width:"100%",background:S.card,border:"1px solid "+S.border,borderRadius:6,padding:"10px 12px",color:S.textPrimary,fontSize:14,fontFamily:"'Georgia',serif",outline:"none",boxSizing:"border-box"}}/></div>
      <div style={{marginBottom:16}}><label style={{display:"block",color:S.accent,fontSize:11,fontFamily:"'Courier New',monospace",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>📚 Class</label><input type="text" value={className} onChange={e=>{setClassName(e.target.value);setError("");}} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} placeholder="e.g. 4A, 4B" style={{width:"100%",background:S.card,border:"1px solid "+S.border,borderRadius:6,padding:"10px 12px",color:S.textPrimary,fontSize:14,fontFamily:"'Georgia',serif",outline:"none",boxSizing:"border-box"}}/></div>
      <div style={{marginBottom:16}}><label style={{display:"block",color:S.accent,fontSize:11,fontFamily:"'Courier New',monospace",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>🎯 Preferred Name</label><input type="text" value={preferredName} onChange={e=>{setPreferredName(e.target.value);setError("");}} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} placeholder="e.g. Sarah, Xiao Ming" style={{width:"100%",background:S.card,border:"1px solid "+S.border,borderRadius:6,padding:"10px 12px",color:S.textPrimary,fontSize:14,fontFamily:"'Georgia',serif",outline:"none",boxSizing:"border-box"}}/><div style={{color:S.textMuted,fontSize:10,marginTop:4}}>This is the name shown to you during the game</div></div>
      {error&&<div style={{background:S.red+"12",border:"1px solid "+S.red+"33",borderRadius:6,padding:"8px 12px",marginBottom:12}}><div style={{color:S.red,fontSize:12}}>{error}</div></div>}
      <div style={{background:S.accent+"12",border:"1px solid "+S.accent+"55",borderRadius:6,padding:"10px 12px",marginBottom:16}}><div style={{color:S.accent,fontSize:11,textAlign:"center"}}>🔄 Revisiting? Register again with the same name and class to start fresh.</div></div>
      <StyledButton onClick={handleSubmit} style={{width:"100%"}}>Begin Investigation →</StyledButton>
    </div>
    <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}`}</style>
  </div>;
}

function PhaseCaseSelect({onSelect,detectiveName,theme}){
  return <div>
    <div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:32,marginBottom:6}}>🔍</div><h2 style={{margin:"0 0 4px",fontFamily:"'Georgia',serif",fontSize:21,color:S.textPrimary}}>Welcome, Detective {detectiveName}</h2><p style={{color:S.textSecondary,fontSize:12.5,margin:0}}>Three unsolved murders await. Each requires qualitative analysis to crack the case.</p></div>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {CASES.map((c,i)=><button key={c.id} onClick={()=>onSelect(i)} style={{background:S.cardAlt,border:"1px solid "+S.border,borderRadius:10,padding:"14px 16px",cursor:"pointer",textAlign:"left",transition:"border-color 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=S.accent;e.currentTarget.style.background=S.accent+"08";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=S.border;e.currentTarget.style.background=S.cardAlt;}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:14}}><div style={{fontSize:30,flexShrink:0}}>{c.coverIcon}</div><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}><div style={{color:S.textPrimary,fontSize:15,fontWeight:700,fontFamily:"'Georgia',serif"}}>{c.title}</div><div style={{color:c.difficulty==="Intermediate"?(theme==="dark"?"#60a5fa":"#1d4ed8"):c.difficulty==="Challenging"?(theme==="dark"?"#fb923c":"#b45309"):(theme==="dark"?"#f87171":"#991b1b"),fontSize:9,fontFamily:"'Courier New',monospace",letterSpacing:1,border:"1px solid currentColor",borderRadius:3,padding:"1px 6px"}}>{c.difficulty.toUpperCase()}</div></div><div style={{color:S.textMuted,fontSize:10,fontFamily:"'Courier New',monospace",marginBottom:4}}>Case {c.caseNumber}</div><p style={{color:S.textSecondary,fontSize:12,margin:0,lineHeight:1.5}}>{c.subtitle}</p></div></div>
      </button>)}
    </div>
  </div>;
}

function PhaseIntro({caseData,onStart,onBack,suspectColors}){
  const [flipped,setFlipped]=useState(null);
  return <div>
    <button onClick={onBack} style={{background:"transparent",border:"none",color:S.textMuted,fontSize:11,fontFamily:"'Courier New',monospace",cursor:"pointer",padding:0,marginBottom:10}}>← Back to case list</button>
    <div style={{background:S.cardAlt,border:"1px solid "+S.border,borderRadius:10,overflow:"hidden",marginBottom:20}}>
      <div style={{background:S.red+"18",borderBottom:"1px solid "+S.red+"33",padding:"8px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:S.red,fontSize:11,fontFamily:"'Courier New',monospace",letterSpacing:1.5,fontWeight:700}}>🚨 CONFIDENTIAL — METROPOLITAN POLICE</span><span style={{color:S.textMuted,fontSize:10}}>Case {caseData.caseNumber}</span></div>
      <div style={{padding:"14px 18px"}}><div style={{color:S.accent,fontSize:13,fontWeight:700,fontFamily:"'Georgia',serif",marginBottom:6}}>INITIAL INCIDENT REPORT</div><p style={{color:S.textSecondary,fontSize:13,margin:0,lineHeight:1.7}}><strong style={{color:S.textPrimary}}>Victim:</strong> {caseData.victim.name}<br/><br/>{caseData.victim.summary}</p></div>
    </div>
    <SectionDivider label="Suspect Dossiers — click to reveal chemical connections"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:8,marginBottom:20}}>
      {caseData.suspects.map(s=><SuspectCard key={s.id} suspect={s} isFlipped={flipped===s.id} onFlip={()=>setFlipped(flipped===s.id?null:s.id)} color={suspectColors[s.id]}/>)}
    </div>
    <StyledButton onClick={onStart} style={{width:"100%"}}>Enter the Crime Scene →</StyledButton>
  </div>;
}

function PhaseStation({station,onSolved,caseIdx,detectiveId,theme}){
  const [reportOpen,setReportOpen]=useState(false);
  const [guidedMode,setGuidedMode]=useState(false);
  const [inventory,setInventory]=useState([]);
  const [sampleInTube,setSampleInTube]=useState(false);
  const [reagentsAdded,setReagentsAdded]=useState([]);
  const [excessAdded,setExcessAdded]=useState(null);
  const [log,setLog]=useState([]);
  const [solved,setSolved]=useState(false);
  const [wrongCount,setWrongCount]=useState(0);
  const [attemptCount,setAttemptCount]=useState(0);
  const [answerInput,setAnswerInput]=useState("");
  const [shake,setShake]=useState(false);
  const [answerError,setAnswerError]=useState("");
  const [gasUsed,setGasUsed]=useState(null);
  const [canisterOpen,setCanisterOpen]=useState(false);
  const [gasTestVisualResult,setGasTestVisualResult]=useState(null);
  const [isHeating,setIsHeating]=useState(false);
  const [airHoleOpen,setAirHoleOpen]=useState(false);
  const [hasHeated,setHasHeated]=useState(false);
  const [litmusUsed,setLitmusUsed]=useState({red:false,blue:false});
  const [stationStartTime]=useState(Date.now());
  const [visualState,setVisualState]=useState({liquidLevel:0,liquidColor:"transparent",precipitateColor:null,precipitateHeight:0,bubbling:false,animating:null});

  const MAX_ATTEMPTS=3;
  const CAPS_MSG="Wrong capitalization! Formulas use element symbols from the Periodic Table. E.g. Cu2+, NH4+, NO3-.";
  const isGasStation=!!station.gasTests||!!station.mixedGas;
  const gasContainerId=isGasStation?station.objects[0].id:null;
  const isAnionStation=!!station.isAnionStation;
  const isAgnoFirstStation=!isGasStation&&station.reactions["AgNO3 solution"]&&station.reactions["AgNO3 solution"].first_without_acid;
  const gasTestItems=isGasStation?station.objects.filter(o=>o.id!==gasContainerId):[];

  const addLog=useCallback(msg=>setLog(p=>[...p,msg]),[]);

  const pickUp=obj=>{if(inventory.includes(obj.id))return;setInventory(p=>[...p,obj.id]);addLog("You pick up: "+obj.label+".");if(isGasStation&&obj.id===gasContainerId)setCanisterOpen(true);};

  const getInitialSampleColor=()=>{if(station.id==="kitchen")return "#7dd3fc55";if(station.id==="wellhouse")return "#7dd3fc55";return "rgba(255,255,255,0.0)";};

  const updateVisual=vd=>{
    if(!vd)return;
    if(vd.type==="ppt"){setVisualState(v=>({...v,precipitateColor:vd.color,precipitateHeight:25,bubbling:false,animating:"settling"}));setTimeout(()=>setVisualState(v=>({...v,animating:null})),800);}
    else if(vd.type==="solution"){setVisualState(v=>({...v,precipitateColor:null,precipitateHeight:0,liquidColor:vd.color==="transparent"?"rgba(255,255,255,0.0)":vd.color,bubbling:false}));}
    else if(vd.type==="bubbling"){setVisualState(v=>({...v,precipitateColor:null,precipitateHeight:0,liquidColor:vd.color||"rgba(255,255,255,0.0)",bubbling:true}));}
    else if(vd.type==="heating"){setVisualState(v=>({...v,bubbling:vd.bubbles||false}));}
  };

  const addReagent=reagent=>{
    const isCationReagent=reagent==="NaOH solution"||reagent==="Aqueous NH3";
    if(isCationReagent&&reagentsAdded.length>0&&!reagentsAdded.includes(reagent)){const first=reagentsAdded[0];if(first==="NaOH solution"||first==="Aqueous NH3"){addLog("You cannot mix different cation reagents in the same test tube. Use a fresh test tube.");return;}}
    if(reagentsAdded.includes(reagent)){if(excessAdded===reagent){addLog("Already added excess of this reagent.");return;}setExcessAdded(reagent);const rx=station.reactions[reagent];if(rx&&rx.excess){addLog("Same test tube — "+rx.excess.text);updateVisual(rx.excess.visual);}else addLog("Same test tube — No further change.");return;}
    if(isAnionStation&&reagent==="Ba(NO3)2 solution"&&!reagentsAdded.includes("Dilute HNO3")){setReagentsAdded(p=>[...p,reagent]);const rx=station.reactions["Ba(NO3)2 solution"].first_without_acid;addLog("Fresh test tube — "+rx.text);setVisualState({liquidLevel:60,liquidColor:getInitialSampleColor(),precipitateColor:null,precipitateHeight:0,bubbling:false,animating:null});updateVisual(rx.visual);return;}
    if(isAgnoFirstStation&&reagent==="AgNO3 solution"&&!reagentsAdded.includes("Dilute HNO3")){setReagentsAdded(p=>[...p,reagent]);const rx=station.reactions["AgNO3 solution"].first_without_acid;addLog("Fresh test tube — "+rx.text);setVisualState({liquidLevel:60,liquidColor:getInitialSampleColor(),precipitateColor:null,precipitateHeight:0,bubbling:false,animating:null});updateVisual(rx.visual);return;}
    if(reagent==="Aluminium foil"&&station.reactions["Aluminium foil"]&&station.reactions["Aluminium foil"].first_without_naoh&&!reagentsAdded.includes("NaOH solution")){setReagentsAdded(p=>[...p,reagent]);addLog(station.reactions["Aluminium foil"].first_without_naoh.text);return;}
    setReagentsAdded(p=>[...p,reagent]);
    const rx=station.reactions[reagent];
    const isFresh=reagentsAdded.length===0;
    const prefix=isFresh?"Fresh test tube — ":"Same test tube — ";
    if(isFresh)setVisualState({liquidLevel:60,liquidColor:getInitialSampleColor(),precipitateColor:null,precipitateHeight:0,bubbling:false,animating:null});
    if(isAnionStation&&reagent==="Ba(NO3)2 solution"&&reagentsAdded.includes("Dilute HNO3")){addLog(prefix+rx.first_with_acid.text);updateVisual(rx.first_with_acid.visual);}
    else if(isAgnoFirstStation&&reagent==="AgNO3 solution"&&reagentsAdded.includes("Dilute HNO3")){addLog(prefix+rx.first_with_acid.text);updateVisual(rx.first_with_acid.visual);}
    else if(reagent==="Aluminium foil"&&reagentsAdded.includes("NaOH solution")&&rx&&rx.first_with_naoh){addLog(prefix+rx.first_with_naoh.text);updateVisual(rx.first_with_naoh.visual);}
    else if(rx&&rx.first){addLog(prefix+rx.first.text);updateVisual(rx.first.visual);}
  };

  const heatSample=()=>{
    if(!station.heating)return;
    const required=station.heating.requiresReagent;
    const hasRequired=Array.isArray(required)?required.some(r=>reagentsAdded.includes(r)):reagentsAdded.includes(required);
    if(!hasRequired){addLog("Add the required reagent(s) first before heating.");return;}
    if(required==="Aluminium foil"&&!reagentsAdded.includes("NaOH solution")){addLog("Add NaOH solution first to create an alkaline environment.");return;}
    if(!airHoleOpen){addLog("Air hole is CLOSED — yellow safety flame is too cool. Open the air hole for a hot blue flame.");setIsHeating(true);setTimeout(()=>setIsHeating(false),1800);return;}
    if(isHeating)return;
    setIsHeating(true);
    if(hasHeated){addLog("You heat the mixture again...");setTimeout(()=>{const r=station.heating.result;if(r){let t=r.text;if(r.textWithPrecipitate&&r.textWithoutPrecipitate)t=excessAdded?r.textWithoutPrecipitate:r.textWithPrecipitate;addLog(t);}setIsHeating(false);},1500);return;}
    addLog("You place the test tube over the hot blue Bunsen flame...");
    setTimeout(()=>{
      setHasHeated(true);const r=station.heating.result;
      if(r){let t=r.text;if(r.textWithPrecipitate&&r.textWithoutPrecipitate)t=excessAdded?r.textWithoutPrecipitate:r.textWithPrecipitate;addLog(t);if(r.visual)updateVisual(r.visual);if(r.gasTest&&!litmusUsed.red&&!litmusUsed.blue)setTimeout(()=>addLog("TIP: Test the gas with damp red or blue litmus paper!"),1500);}
      setIsHeating(false);
    },2500);
  };

  const useLitmus=color=>{
    if(!hasHeated){addLog("Heat the mixture first to release the gas.");return;}
    if(color==="red"){setLitmusUsed(p=>({...p,red:true}));addLog("Damp RED litmus paper turns BLUE!");setGasTestVisualResult({itemId:"litmus_red_nh4",visualKey:"litmus_red_to_blue",timestamp:Date.now()});}
    else{setLitmusUsed(p=>({...p,blue:true}));addLog("Damp BLUE litmus paper stays blue. Try red litmus for a clearer result.");setGasTestVisualResult({itemId:"litmus_blue_nh4",visualKey:"litmus_blue_stays",timestamp:Date.now()});}
  };

  const recordAttempt=async(ionKey,usedAllAttempts)=>{
    if(!detectiveId)return;
    try{const ref=doc(db,"students",detectiveId);const snap=await getDoc(ref);const data=snap.data();if(!data.ionAttempts)data.ionAttempts=[];const existing=data.ionAttempts.find(a=>a.ion===ionKey);if(existing){existing.total+=1;if(usedAllAttempts)existing.wrong+=1;}else data.ionAttempts.push({ion:ionKey,wrong:usedAllAttempts?1:0,total:1});await setDoc(ref,data);}catch(e){}
  };

  const recordCaseTime=async cIdx=>{
    if(!detectiveId)return;
    try{const mins=(Date.now()-stationStartTime)/60000;const ref=doc(db,"students",detectiveId);const snap=await getDoc(ref);const data=snap.data();if(!data.caseTimes)data.caseTimes=[];data.caseTimes.push({caseIdx:cIdx,minutes:parseFloat(mins.toFixed(1))});await setDoc(ref,data);}catch(e){}
  };

  const useOnGas=itemId=>{
    setGasUsed(itemId);const result=station.gasTests&&station.gasTests[itemId];if(!result)return;
    addLog(result.text);
    let visualKey=null;
    if(itemId.includes("litmus_red")){if(result.text.includes("turns BLUE")&&result.text.includes("turns RED again"))visualKey="litmus_red_sequential";else if(result.text.includes("turns BLUE"))visualKey="litmus_red_to_blue";else visualKey="litmus_red_stays";}
    else if(itemId.includes("litmus_blue")){if(result.text.includes("turns RED"))visualKey="litmus_blue_to_red";else visualKey="litmus_blue_stays";}
    else if(itemId==="limewater_tube"){if(result.text.includes("dissolves"))visualKey="limewater_co2";else if(result.text.includes("white precipitate"))visualKey="limewater_white";else visualKey="limewater_clear";}
    else if(itemId.includes("kmno4_paper")){visualKey=result.text.includes("DECOLOUR")?"kmno4_decolorized":"kmno4_stays";}
    else if(itemId.includes("splint_burning")){visualKey=result.text.includes("EXTINGUISH")?"splint_burning_extinguished":"splint_burning_stays";}
    else if(itemId.includes("splint_glowing")){visualKey="splint_glowing_stays";}
    if(visualKey)setGasTestVisualResult({itemId,visualKey,timestamp:Date.now()});
  };

  const tryUnlock=async()=>{
    if(!answerInput.trim())return;
    const input=answerInput.trim();const inputLower=input.toLowerCase();const inputNoSpaces=input.replace(/\s+/g,"");const inputNoSpacesLower=inputNoSpaces.toLowerCase();
    const wrongCaseFormulas=["co2","Co2","cO2","so2","So2","sO2","nh3","Nh3","nH3","hcl","Hcl","hCl"];
    if(wrongCaseFormulas.includes(inputNoSpaces)){setAttemptCount(c=>c+1);setShake(true);setAnswerError(CAPS_MSG);setTimeout(()=>setShake(false),500);return;}
    if(station.answer.requiresBoth&&Array.isArray(station.answer.accepted[0])){
      const parts=input.split(/\s*(?:,|and|\+)\s*/i).map(s=>s.trim()).filter(Boolean);
      if(parts.length!==2){setAttemptCount(c=>c+1);setWrongCount(c=>c+1);setShake(true);setAnswerError("Identify TWO gases, separated by comma or 'and'. "+(3-wrongCount-1)+" attempt"+(3-wrongCount-1===1?"":"s")+" remaining");setTimeout(()=>setShake(false),500);return;}
      const normalize=str=>str.replace(/[²³⁺⁻₂₃\s]/g,m=>m==="²"||m==="₂"?"2":m==="³"||m==="₃"?"3":m==="⁺"?"+":m==="⁻"?"-":"");
      const p1=normalize(parts[0]);const p2=normalize(parts[1]);
      let matchFound=false;
      for(const pair of station.answer.accepted){const a1=normalize(pair[0]);const a2=normalize(pair[1]);if((p1.toLowerCase()===a1.toLowerCase()&&p2.toLowerCase()===a2.toLowerCase())||(p1.toLowerCase()===a2.toLowerCase()&&p2.toLowerCase()===a1.toLowerCase())){matchFound=true;break;}}
      if(matchFound){await recordAttempt("NH3,HCl",false);await recordCaseTime(caseIdx);setSolved(true);addLog({text:"Correct! Both gases identified: "+parts[0]+" and "+parts[1],color:"#15803d"});addLog({text:"🔓 "+station.solvedMessage,color:"#15803d"});return;}
      setAttemptCount(c=>c+1);setWrongCount(c=>c+1);
      if(wrongCount+1>=3){await recordAttempt("NH3,HCl",true);setShake(true);setAnswerError("Maximum attempts reached. Correct answer: NH3 and HCl");setTimeout(()=>setShake(false),500);setSolved(true);addLog({text:"Maximum attempts reached. Correct: NH3 and HCl. NH4Cl decomposes to NH3 + HCl on heating.",color:"#ef4444"});addLog({text:"🔓 "+station.solvedMessage,color:"#ef4444"});return;}
      setShake(true);setAnswerError("Incorrect. "+(3-wrongCount-1)+" attempt"+(3-wrongCount-1===1?"":"s")+" remaining");setTimeout(()=>setShake(false),500);return;
    }
    const normalizeSubscripts=s=>s.replace(/[₂₃]/g,m=>m==="₂"?"2":"3");
    const inputNorm=normalizeSubscripts(inputNoSpaces);
    const ionKey=station.answer.ionKey||station.answer.accepted[0];
    const formulaAccepted=station.answer.accepted.filter(a=>a.includes("+")||a.includes("-")||/^[A-Z][a-z]?\d/.test(a));
    const nameAccepted=station.answer.accepted.filter(a=>!formulaAccepted.includes(a));
    const correctButWrongCase=formulaAccepted.some(a=>inputNoSpacesLower===a.toLowerCase()&&inputNoSpaces!==a);
    if(correctButWrongCase){setAttemptCount(c=>c+1);setShake(true);setAnswerError(CAPS_MSG);setTimeout(()=>setShake(false),500);return;}
    const formulaMatch=formulaAccepted.some(a=>{const an=normalizeSubscripts(a).replace(/[²³⁺⁻]/g,m=>m==="²"?"2":m==="³"?"3":m==="⁺"?"+":"-");return inputNorm===an;});
    const nameMatch=nameAccepted.some(a=>{if(/\([IVX]+\)/.test(a)){const bp=a.match(/\([IVX]+\)/)[0];if(!input.includes(bp))return false;const np=a.replace(/\([IVX]+\)/,"").trim();return inputLower.includes(np.toLowerCase());}return inputLower.includes(a.toLowerCase());});
    if(formulaMatch||nameMatch){await recordAttempt(ionKey,false);await recordCaseTime(caseIdx);setSolved(true);addLog({text:"Correct! The answer is: "+station.answer.accepted[0],color:"#15803d"});addLog({text:"🔓 "+station.solvedMessage,color:"#15803d"});}
    else{
      setAttemptCount(c=>c+1);setWrongCount(c=>c+1);
      let msg="Incorrect answer.";
      if(inputLower==="copper"||inputLower==="iron"||inputLower==="manganese")msg="Transition metals need Roman numerals in brackets! e.g. copper(II), iron(II), iron(III)";
      else if(inputLower==="zinc"||inputLower==="aluminium")msg="Zinc and aluminium are NOT transition metals — write just 'zinc' or Zn2+.";
      else if(station.answer.partialCredit&&station.answer.partialCredit.some(a=>inputNoSpacesLower===normalizeSubscripts(a).replace(/[²³⁺⁻]/g,m=>m==="²"?"2":m==="³"?"3":m==="⁺"?"+":"-").toLowerCase())){msg="Correct element, but check your format — e.g. Cu2+, not Cu+2.";}
      if(attemptCount+1>=MAX_ATTEMPTS){await recordAttempt(ionKey,true);setSolved(true);addLog({text:"Maximum attempts reached. Correct: "+station.answer.accepted[0],color:"#dc2626"});addLog({text:"🔓 "+station.solvedMessage+" Please revise this ion/gas!",color:"#dc2626"});}
      else{setShake(true);setAnswerError(msg+" "+(MAX_ATTEMPTS-attemptCount-1)+" attempt"+(MAX_ATTEMPTS-attemptCount-1!==1?"s":"")+" remaining.");setTimeout(()=>setShake(false),400);}
    }
  };

  const hasSample=inventory.includes(station.objects[0]&&station.objects[0].id);
  const canAddReagents=!isGasStation&&sampleInTube;

  return <div>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><span style={{fontSize:26}}>{station.icon}</span><div><h2 style={{margin:0,fontFamily:"'Georgia',serif",fontSize:20,color:S.textPrimary}}>{station.title}</h2><span style={{color:S.textMuted,fontSize:11,fontFamily:"'Courier New',monospace"}}>EVIDENCE STATION</span></div></div>
    <p style={{color:S.textSecondary,fontSize:13,margin:"0 0 14px",lineHeight:1.6,fontStyle:"italic"}}>{station.locationDesc}</p>
    <div style={{marginBottom:14}}>
      <button onClick={()=>setReportOpen(!reportOpen)} style={{background:S.red+"12",border:"1px solid "+S.red+"33",borderRadius:6,padding:"7px 14px",cursor:"pointer",color:S.red,fontSize:12,fontFamily:"'Courier New',monospace",letterSpacing:0.8,width:"100%",textAlign:"left",display:"flex",justifyContent:"space-between"}}>
        <span>📄 Scene Report</span><span>{reportOpen?"▲ close":"▼ read"}</span>
      </button>
      {reportOpen&&<div style={{background:S.cardAlt,border:"1px solid "+S.border,borderRadius:"0 0 6px 6px",padding:"12px 14px",marginTop:-1}}><pre style={{color:S.textSecondary,fontSize:11.5,margin:0,lineHeight:1.7,whiteSpace:"pre-wrap",fontFamily:"'Courier New',monospace"}}>{station.policeReport}</pre></div>}
    </div>
    {isAnionStation&&<div style={{marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:S.cardAlt,border:"1px solid "+S.border,borderRadius:8,padding:"8px 12px"}}>
        <div><div style={{color:S.accent,fontSize:11,fontWeight:700}}>🧭 Guided Mode</div><div style={{color:S.textMuted,fontSize:10}}>Step-by-step hints for anion testing</div></div>
        <button onClick={()=>setGuidedMode(g=>!g)} style={{background:guidedMode?S.accent:"transparent",border:"2px solid "+S.accent,borderRadius:20,padding:"4px 14px",cursor:"pointer",color:guidedMode?"#1a1a2e":S.accent,fontSize:11,fontFamily:"'Courier New',monospace",fontWeight:700,transition:"all 0.2s"}}>{guidedMode?"ON":"OFF"}</button>
      </div>
      {guidedMode&&<div style={{marginTop:8,background:S.accent+"0a",border:"1px solid "+S.accent+"33",borderRadius:8,padding:"10px 14px"}}>
        {ANION_GUIDE.map((g,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:i<ANION_GUIDE.length-1?8:0,alignItems:"flex-start"}}><span style={{color:S.accent,fontFamily:"'Courier New',monospace",fontSize:10,fontWeight:700,minWidth:50,marginTop:1}}>{g.step}</span><span style={{color:S.textSecondary,fontSize:11.5,lineHeight:1.5}}>{g.tip}</span></div>)}
      </div>}
    </div>}
    <SectionDivider label="Interact with the evidence"/>
    <div style={{background:S.cardAlt,border:"1px solid "+S.border,borderRadius:10,padding:16,marginBottom:12}}>
      {!isGasStation&&<div style={{display:"flex",gap:10,alignItems:"flex-end",flexWrap:"wrap",marginBottom:12}}>
        {!hasSample?<button onClick={()=>pickUp(station.objects[0])} style={{background:S.card,border:"2px dashed "+S.borderHi,borderRadius:8,padding:"10px 14px",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor=S.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=S.borderHi}><div style={{fontSize:28,textAlign:"center"}}>{station.objects[0].icon}</div><div style={{color:S.accent,fontSize:10,textAlign:"center",fontFamily:"'Courier New',monospace",marginTop:3}}>{station.objects[0].label}</div><div style={{color:S.textMuted,fontSize:9,textAlign:"center"}}>click to pick up</div></button>
        :!sampleInTube?<button onClick={()=>{setSampleInTube(true);setHasHeated(false);setLitmusUsed({red:false,blue:false});setReagentsAdded([]);setExcessAdded(null);setVisualState({liquidLevel:60,liquidColor:getInitialSampleColor(),precipitateColor:null,precipitateHeight:0,bubbling:false,animating:null});addLog("You pour the sample into a clean test tube — ready for tests.");}} style={{background:S.card,border:"2px dashed "+S.accent,borderRadius:8,padding:"10px 14px",cursor:"pointer"}}><div style={{fontSize:22,textAlign:"center"}}>🧪</div><div style={{color:S.accent,fontSize:10,textAlign:"center",fontFamily:"'Courier New',monospace",marginTop:3}}>Pour into test tube</div></button>
        :<div style={{display:"flex",gap:8,alignItems:"flex-start",flexWrap:"wrap"}}>
          <TestTubeDropZone onReagentDrop={addReagent}>
            <VisualTestTube liquidLevel={visualState.liquidLevel} liquidColor={visualState.liquidColor} precipitateColor={visualState.precipitateColor} precipitateHeight={visualState.precipitateHeight} bubbling={visualState.bubbling} animating={visualState.animating} isHeating={isHeating} airHoleOpen={airHoleOpen} theme={theme}/>
          </TestTubeDropZone>
          {log.length>0&&<div style={{flex:1,marginTop:12,padding:"10px 12px",background:S.accent+"12",border:"1px solid "+S.accent+"44",borderRadius:8}}><div style={{color:S.accent,fontSize:9,fontFamily:"'Courier New',monospace",letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>🔬 Latest Observation</div><div style={{color:S.textPrimary,fontSize:12,lineHeight:1.55}}>{typeof log[log.length-1]==="string"?log[log.length-1]:log[log.length-1].text}</div></div>}
          {station.heating&&station.heating.result&&station.heating.result.gasTest&&gasTestVisualResult&&<div style={{padding:12,background:S.card,border:"1px solid "+S.accent+"44",borderRadius:8,minWidth:140}}><div style={{color:S.accent,fontSize:10,fontFamily:"'Courier New',monospace",marginBottom:8,textAlign:"center"}}>🔬 TEST RESULT</div><div style={{display:"flex",justifyContent:"center"}}><GasTestVisual key={gasTestVisualResult.timestamp} testItem={gasTestVisualResult.itemId} result={gasTestVisualResult.visualKey} theme={theme}/></div></div>}
        </div>}
      </div>}
      {canAddReagents&&<div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:12,padding:"12px",background:S.cardAlt+"88",borderRadius:8,border:"1px solid "+S.border}}>
        <div style={{width:"100%",color:S.textMuted,fontSize:9,fontFamily:"'Courier New',monospace",textAlign:"center",marginBottom:4}}>↓ Drag reagent bottles to test tube ↓<br/><span style={{fontSize:8,color:S.accent}}>For cation tests: use ONE reagent per tube, then add excess of the SAME reagent</span></div>
        {station.reagents.map(r=>{const added=reagentsAdded.includes(r);return <DraggableReagentBottle key={r} name={r} used={added}/>;})  }
        {reagentsAdded.length>0&&<button onClick={()=>{setReagentsAdded([]);setExcessAdded(null);setVisualState({liquidLevel:60,liquidColor:getInitialSampleColor(),precipitateColor:null,precipitateHeight:0,bubbling:false,animating:null});addLog("Fresh test tube prepared.");}} style={{width:"100%",background:S.card,border:"2px dashed "+S.blue,borderRadius:8,padding:"10px 14px",cursor:"pointer",marginTop:8}} onMouseEnter={e=>e.currentTarget.style.borderColor=S.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=S.blue}><div style={{fontSize:20,textAlign:"center"}}>🧪</div><div style={{color:S.blue,fontSize:10,textAlign:"center",fontFamily:"'Courier New',monospace",marginTop:3}}>Use Fresh Test Tube</div></button>}
        {station.heating&&sampleInTube&&(()=>{const req=station.heating.requiresReagent;return Array.isArray(req)?req.some(r=>reagentsAdded.includes(r)):reagentsAdded.includes(req);})()&&<>
          <button onClick={()=>{setAirHoleOpen(o=>!o);addLog(airHoleOpen?"Air hole CLOSED — yellow safety flame (cool).":"Air hole OPEN — blue flame (hot), ready for heating.");}} style={{width:"100%",background:airHoleOpen?"#1e3a8a":"#78350f",border:"2px solid "+(airHoleOpen?"#3b82f6":"#d97706"),borderRadius:8,padding:"8px 14px",cursor:"pointer",marginTop:8}}><div style={{fontSize:18,textAlign:"center"}}>{airHoleOpen?"🔵":"🟡"}</div><div style={{color:"#fff",fontSize:9,textAlign:"center",fontFamily:"'Courier New',monospace",marginTop:2}}>Air Hole: {airHoleOpen?"OPEN — blue flame":"CLOSED — yellow flame"}</div></button>
          <button onClick={heatSample} disabled={isHeating} style={{width:"100%",background:isHeating?"#666":airHoleOpen?"#FF6B35":"#555",border:"2px solid "+(isHeating?"#555":airHoleOpen?"#FF4500":"#888"),borderRadius:8,padding:"10px 14px",cursor:isHeating?"not-allowed":"pointer",marginTop:6,opacity:isHeating?0.6:1}}><div style={{fontSize:20,textAlign:"center"}}>🔥</div><div style={{color:"#fff",fontSize:10,textAlign:"center",fontFamily:"'Courier New',monospace",marginTop:3}}>{isHeating?"Heating...":"Heat with Bunsen Burner"}</div></button>
        </>}
        {station.heating&&station.heating.result&&station.heating.result.gasTest&&hasHeated&&<>
          <button onClick={()=>useLitmus("red")} style={{width:"100%",background:"#EF4444",border:"2px solid #DC2626",borderRadius:8,padding:"10px 14px",cursor:"pointer",marginTop:8}}><div style={{fontSize:20,textAlign:"center"}}>🔴</div><div style={{color:"#fff",fontSize:10,textAlign:"center",fontFamily:"'Courier New',monospace",marginTop:3}}>Test with Damp Red Litmus</div></button>
          <button onClick={()=>useLitmus("blue")} style={{width:"100%",background:"#3B82F6",border:"2px solid #2563EB",borderRadius:8,padding:"10px 14px",cursor:"pointer",marginTop:8}}><div style={{fontSize:20,textAlign:"center"}}>🔵</div><div style={{color:"#fff",fontSize:10,textAlign:"center",fontFamily:"'Courier New',monospace",marginTop:3}}>Test with Damp Blue Litmus</div></button>
        </>}
      </div>}
      {isGasStation&&!station.mixedGas&&<div>
        <div style={{display:"flex",gap:10,alignItems:"flex-start",flexWrap:"wrap",marginBottom:12}}>
          {!canisterOpen?<button onClick={()=>pickUp(station.objects[0])} style={{background:S.card,border:"2px dashed "+S.borderHi,borderRadius:8,padding:"10px 14px",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor=S.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=S.borderHi}><div style={{fontSize:28,textAlign:"center"}}>{station.objects[0].icon}</div><div style={{color:S.accent,fontSize:10,textAlign:"center",fontFamily:"'Courier New',monospace",marginTop:3}}>{station.objects[0].label}</div><div style={{color:S.textMuted,fontSize:9,textAlign:"center"}}>click to open</div></button>
          :<div style={{background:S.card,border:"1px solid "+S.red+"44",borderRadius:8,padding:"8px 12px",textAlign:"center"}}><div style={{fontSize:24}}>{station.objects[0].icon}💨</div><div style={{color:S.red,fontSize:9,fontFamily:"'Courier New',monospace",marginTop:2}}>Gas leaking</div></div>}
          {canisterOpen&&<div style={{flex:1}}><div style={{color:S.textMuted,fontSize:9,fontFamily:"'Courier New',monospace",letterSpacing:1,marginBottom:5}}>FORENSIC KIT — pick up a test item, then click it in your inventory</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{gasTestItems.map(obj=>{const picked=inventory.includes(obj.id);return <button key={obj.id} onClick={()=>pickUp(obj)} disabled={picked} style={{background:picked?S.cardAlt:S.card,border:"1px solid "+(picked?S.textMuted:S.borderHi),borderRadius:6,padding:"5px 8px",cursor:picked?"default":"pointer",opacity:picked?0.45:1}} onMouseEnter={e=>!picked&&(e.currentTarget.style.borderColor=S.accent)} onMouseLeave={e=>!picked&&(e.currentTarget.style.borderColor=S.borderHi)}><span style={{fontSize:14}}>{obj.icon}</span><span style={{color:picked?S.textMuted:S.accent,fontSize:9,marginLeft:4}}>{obj.label}</span></button>;})}</div></div>}
        </div>
        {canisterOpen&&inventory.filter(id=>id!==gasContainerId).length>0&&<div style={{marginBottom:8}}><div style={{color:S.textMuted,fontSize:9,fontFamily:"'Courier New',monospace",letterSpacing:1,marginBottom:4}}>🎒 INVENTORY — click to test on the gas</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{inventory.filter(id=>id!==gasContainerId).map(id=>{const obj=station.objects.find(o=>o.id===id);const used=gasUsed===id;return <button key={id} onClick={()=>useOnGas(id)} style={{background:used?S.cardAlt:S.accent+"12",border:"1px solid "+(used?S.textMuted:S.accent),borderRadius:6,padding:"5px 10px",cursor:used?"default":"pointer",opacity:used?0.4:1}}><span style={{fontSize:13}}>{obj&&obj.icon}</span><span style={{color:used?S.textMuted:S.accent,fontSize:10,marginLeft:4,fontWeight:600}}>{obj&&obj.label}</span>{used&&<span style={{color:S.textMuted,fontSize:9,marginLeft:4}}>(used)</span>}</button>;})}</div></div>}
        {gasTestVisualResult&&<div style={{marginTop:12,padding:12,background:S.card,border:"1px solid "+S.accent+"44",borderRadius:8}}><div style={{color:S.accent,fontSize:10,fontFamily:"'Courier New',monospace",marginBottom:8,textAlign:"center"}}>🔬 TEST RESULT</div><div style={{display:"flex",justifyContent:"center"}}><GasTestVisual key={gasTestVisualResult.timestamp} testItem={gasTestVisualResult.itemId} result={gasTestVisualResult.visualKey} theme={theme}/></div></div>}
      </div>}
      {station.mixedGas&&<div>
        <div style={{color:S.textMuted,fontSize:10,fontFamily:"'Courier New',monospace",letterSpacing:1,marginBottom:8,textAlign:"center"}}>TOXIC GAS MIXTURE — Test with forensic kit items</div>
        <div style={{display:"flex",justifyContent:"center",marginBottom:12}}><div style={{background:S.card,border:"2px solid "+S.accent,borderRadius:8,padding:"12px 16px",textAlign:"center",minWidth:180}}><div style={{fontSize:32}}>{station.objects[0].icon}</div><div style={{color:S.accent,fontSize:12,fontFamily:"'Courier New',monospace",marginTop:4,fontWeight:600}}>{station.objects[0].label}</div><div style={{color:S.textMuted,fontSize:9,marginTop:3}}>Multiple gases present</div></div></div>
        <div style={{marginBottom:12}}><div style={{color:S.textMuted,fontSize:9,fontFamily:"'Courier New',monospace",letterSpacing:1,marginBottom:5}}>FORENSIC KIT — pick up items and click to use</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{gasTestItems.map(obj=>{const picked=inventory.includes(obj.id);return <button key={obj.id} onClick={()=>pickUp(obj)} disabled={picked} style={{background:picked?S.cardAlt:S.card,border:"1px solid "+(picked?S.textMuted:S.borderHi),borderRadius:6,padding:"5px 8px",cursor:picked?"default":"pointer",opacity:picked?0.45:1}} onMouseEnter={e=>!picked&&(e.currentTarget.style.borderColor=S.accent)} onMouseLeave={e=>!picked&&(e.currentTarget.style.borderColor=S.borderHi)}><span style={{fontSize:14}}>{obj.icon}</span><span style={{color:picked?S.textMuted:S.accent,fontSize:9,marginLeft:4}}>{obj.label}</span></button>;})}</div></div>
        {inventory.length>0&&<div style={{marginBottom:8}}><div style={{color:S.textMuted,fontSize:9,fontFamily:"'Courier New',monospace",letterSpacing:1,marginBottom:4}}>🎒 INVENTORY — click to use on the gas mixture</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{inventory.filter(id=>id!=="gas_mixture").map(id=>{const obj=station.objects.find(o=>o.id===id);const used=gasUsed===id;return <button key={id} onClick={()=>useOnGas(id)} style={{background:used?S.cardAlt:S.accent+"12",border:"1px solid "+(used?S.textMuted:S.accent),borderRadius:6,padding:"5px 10px",cursor:used?"default":"pointer",opacity:used?0.4:1}}><span style={{fontSize:13}}>{obj&&obj.icon}</span><span style={{color:used?S.textMuted:S.accent,fontSize:10,marginLeft:4,fontWeight:600}}>{obj&&obj.label}</span>{used&&<span style={{color:S.textMuted,fontSize:9,marginLeft:4}}>(used)</span>}</button>;})}</div></div>}
        {gasTestVisualResult&&<div style={{marginTop:12,padding:12,background:S.card,border:"1px solid "+S.accent+"44",borderRadius:8}}><div style={{color:S.accent,fontSize:10,fontFamily:"'Courier New',monospace",marginBottom:8,textAlign:"center"}}>🔬 TEST RESULT</div><div style={{display:"flex",justifyContent:"center"}}><GasTestVisual key={gasTestVisualResult.timestamp} testItem={gasTestVisualResult.itemId} result={gasTestVisualResult.visualKey} theme={theme}/></div></div>}
      </div>}
    </div>
    <ObsLog entries={log}/>
    {!solved&&<div style={{marginTop:16,background:S.cardAlt,border:"1px solid "+S.border,borderRadius:8,padding:"12px 14px",animation:shake?"shake 0.4s ease":"none"}}>
      <div style={{color:S.textMuted,fontSize:10,fontFamily:"'Courier New',monospace",letterSpacing:1,marginBottom:6}}>🔒 IDENTIFY THE SUBSTANCE</div>
      <div style={{color:S.textPrimary,fontSize:13,fontFamily:"'Georgia',serif",marginBottom:4}}>{station.promptLabel}</div>
      <div style={{background:S.accent+"08",border:"1px solid "+S.accent+"22",borderRadius:4,padding:"6px 8px",marginBottom:8}}><div style={{color:S.accent,fontSize:9,fontFamily:"'Courier New',monospace",lineHeight:1.5}}>Enter the name OR formula. Formulas use Periodic Table symbols. Transition metals need Roman numerals e.g. copper(II).</div></div>
      <div style={{display:"flex",gap:6}}><input value={answerInput} onChange={e=>setAnswerInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&tryUnlock()} placeholder={station.placeholder} style={{flex:1,background:S.card,border:"1px solid "+S.border,borderRadius:5,padding:"7px 10px",color:S.textPrimary,fontSize:13,outline:"none",fontFamily:"'Courier New',monospace"}}/><StyledButton onClick={tryUnlock} variant="primary" style={{padding:"7px 16px",fontSize:12}}>UNLOCK</StyledButton></div>
      {answerError&&<div style={{color:S.red,fontSize:11,marginTop:5}}>{answerError}</div>}
    </div>}
    {solved&&<div style={{marginTop:14}}><StyledButton onClick={()=>onSolved(station.evidence)} style={{width:"100%"}}>Pin evidence & continue →</StyledButton></div>}
    <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}`}</style>
  </div>;
}

function PhaseCaseBoard({caseData,caseBoard,onContinue,isFinal}){
  return <div>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><span style={{fontSize:24}}>📌</span><div><h2 style={{margin:0,fontFamily:"'Georgia',serif",fontSize:20,color:S.textPrimary}}>Case Board</h2><span style={{color:S.textMuted,fontSize:11}}>{isFinal?"All evidence collected — review before accusation":caseBoard.length+" of 3 items pinned"}</span></div></div>
    <div style={{background:S.cardAlt,border:"1px solid "+S.border,borderRadius:10,padding:16,marginBottom:18}}>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        {caseData.stations.map(st=>{const pinned=caseBoard.find(e=>e.label===st.evidence.label);return <div key={st.id} style={{flex:"1 1 30%",minWidth:160,background:pinned?S.card:S.card+"88",border:"1px solid "+(pinned?S.accent:S.border),borderRadius:8,padding:"10px 12px",opacity:pinned?1:0.35,transition:"all 0.4s"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:16}}>{pinned?pinned.icon:"📍"}</span><span style={{color:pinned?S.accent:S.textMuted,fontSize:9,fontFamily:"'Courier New',monospace",letterSpacing:1}}>{st.title.toUpperCase()}</span></div><div style={{color:pinned?S.textPrimary:S.textMuted,fontSize:12,fontWeight:600,marginBottom:pinned?4:0}}>{pinned?pinned.label:"— pending —"}</div>{pinned&&<div style={{color:S.textSecondary,fontSize:11,lineHeight:1.5}}>{pinned.detail}</div>}</div>;})  }
      </div>
    </div>
    <StyledButton onClick={onContinue} style={{width:"100%"}} variant={isFinal?"danger":"primary"}>{isFinal?"Proceed to Accusation →":"Continue Investigation →"}</StyledButton>
  </div>;
}

function PhaseAccusation({caseData,onVerdict,onCaseSolved,detectiveId,suspectColors}){
  const [chosen,setChosen]=useState(null);const [submitted,setSubmitted]=useState(false);const [dossierOpen,setDossierOpen]=useState(false);const [dossierFlipped,setDossierFlipped]=useState(null);const [reportsOpen,setReportsOpen]=useState(false);
  const correct=caseData.suspects.find(s=>s.guilty);
  const handleVerdict=async()=>{
    if(detectiveId&&chosen===correct.id){
      try{const ref=doc(db,"students",detectiveId);const snap=await getDoc(ref);const data=snap.data();const idx=CASES.findIndex(c=>c.id===caseData.id);if(idx>=0&&!(data.casesCompleted||[]).includes(idx)){data.casesCompleted=[...(data.casesCompleted||[]),idx];await setDoc(ref,data);}}catch(e){}
    }
    onCaseSolved();onVerdict();
  };
  return <div>
    <div style={{textAlign:"center",marginBottom:18}}><span style={{fontSize:36}}>⚖️</span><h2 style={{margin:"6px 0 4px",fontFamily:"'Georgia',serif",fontSize:22,color:S.textPrimary}}>The Accusation</h2><p style={{color:S.textSecondary,fontSize:13,margin:0}}>Who murdered {caseData.victim.name}?</p></div>
    <div style={{background:S.cardAlt,border:"1px solid "+S.border,borderRadius:8,padding:"12px 14px",marginBottom:12}}><div style={{color:S.accent,fontSize:10,fontFamily:"'Courier New',monospace",letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>🔍 Cross-Reference</div><p style={{color:S.textSecondary,fontSize:12.5,margin:0,lineHeight:1.65}}>{caseData.accusationGuide}</p></div>
    <div style={{marginBottom:14}}><button onClick={()=>setDossierOpen(!dossierOpen)} style={{background:S.accent+"0e",border:"1px solid "+S.accent+"33",borderRadius:6,padding:"7px 12px",cursor:"pointer",color:S.accent,fontSize:11,fontFamily:"'Courier New',monospace",width:"100%",textAlign:"left",display:"flex",justifyContent:"space-between"}}><span>📁 Review Suspect Dossiers</span><span>{dossierOpen?"▲":"▼"}</span></button>{dossierOpen&&<div style={{marginTop:8,display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:8}}>{caseData.suspects.map(s=><SuspectCard key={s.id} suspect={s} isFlipped={dossierFlipped===s.id} onFlip={()=>setDossierFlipped(dossierFlipped===s.id?null:s.id)} color={suspectColors[s.id]}/>)}</div>}</div>}
    {!submitted&&<><div style={{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:8,marginBottom:16}}>
      {caseData.suspects.map(s=>{const sColor=suspectColors[s.id];return <button key={s.id} onClick={()=>setChosen(s.id)} style={{background:chosen===s.id?sColor+"18":S.card,border:"2px solid "+(chosen===s.id?sColor:S.border),borderRadius:8,padding:"10px 12px",cursor:"pointer",textAlign:"left",transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=sColor} onMouseLeave={e=>e.currentTarget.style.borderColor=chosen===s.id?sColor:S.border}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:22}}>{s.portrait}</span><div><div style={{color:chosen===s.id?sColor:S.textPrimary,fontSize:13,fontWeight:700}}>{s.name}</div><div style={{color:S.textMuted,fontSize:10}}>{s.title}</div></div></div></button>;})  }
    </div><StyledButton onClick={()=>setSubmitted(true)} variant="danger" disabled={!chosen} style={{width:"100%"}}>🚨 I Accuse {chosen?caseData.suspects.find(s=>s.id===chosen).name:"…"}</StyledButton></>}
    {submitted&&<div style={{animation:"pinIn 0.5s ease"}}>
      {chosen===correct.id?<div style={{background:"#14532d",border:"1px solid #22c55e55",borderRadius:10,padding:"22px 20px",textAlign:"center"}}><div style={{fontSize:44,marginBottom:6}}>🏆</div><h3 style={{color:"#4ade80",fontFamily:"'Georgia',serif",fontSize:22,margin:"0 0 10px"}}>CASE SOLVED</h3><p style={{color:"#86efac",fontSize:13.5,margin:0,lineHeight:1.7}}>{caseData.guilty}</p></div>
      :<div style={{background:"#1f2937",border:"1px solid #ef444455",borderRadius:10,padding:"22px 20px",textAlign:"center"}}><div style={{fontSize:44,marginBottom:6}}>❌</div><h3 style={{color:"#f87171",fontFamily:"'Georgia',serif",fontSize:22,margin:"0 0 10px"}}>WRONG SUSPECT</h3><p style={{color:"#fca5a5",fontSize:13,margin:"0 0 10px",lineHeight:1.7}}>{caseData.suspects.find(s=>s.id===chosen).name} is innocent.</p><p style={{color:"#f87171",fontSize:12.5,margin:0}}>The killer was <strong>{correct.name}</strong>.</p></div>}
      <StyledButton onClick={handleVerdict} style={{width:"100%",marginTop:14}}>View Chemistry Debrief →</StyledButton>
    </div>}
    <style>{`@keyframes pinIn{0%{transform:translateY(-6px);opacity:0}100%{transform:translateY(0);opacity:1}}`}</style>
  </div>;
}

function PhaseDebrief({caseData,onRestart,onBackToSelect,solvedCases}){
  const examTips=["Cu2+ vs Zn2+: Both give precipitates with NaOH. Cu(OH)2 is light blue; Zn(OH)2 is white. KEY: Cu2+ dissolves in excess NH3 only. Zn2+ dissolves in excess of BOTH NaOH and NH3.","NO3- vs SO42- vs Cl-: NO3- = Al + NaOH + heat gives NH3 (damp red litmus turns blue). SO42- = Ba(NO3)2 gives white ppt insoluble in acid. Cl- = AgNO3 gives white ppt insoluble in acid.","NO3- vs NH4+ — COMMONLY CONFUSED! Both tests use NaOH + heat and produce NH3. KEY: NO3- test REQUIRES aluminium foil. NH4+ test needs NO aluminium.","CO2 vs SO2 vs NH3+HCl: CO2 turns limewater milky. SO2 decolourises KMnO4 and turns blue litmus red. NH3 turns damp red litmus blue. HCl turns damp blue litmus red.","NH3+HCl from NH4Cl: Red litmus turns BLUE first (NH3 has lower Mr=17, diffuses faster), then RED (HCl arrives). Always use red litmus first.","NH4Cl thermal decomposition: NH4Cl = NH3 + HCl. Dangerous in enclosed spaces.","Gas tests use DAMP indicators held NEAR the gas — not dipped into solution."];
  return <div>
    <div style={{textAlign:"center",marginBottom:18}}><span style={{fontSize:36}}>📋</span><h2 style={{margin:"6px 0 4px",fontFamily:"'Georgia',serif",fontSize:22,color:S.textPrimary}}>Chemistry Debrief</h2><p style={{color:S.textSecondary,fontSize:13,margin:0}}>Review the tests and their significance</p></div>
    {caseData.debrief.map((row,i)=><div key={i} style={{background:S.cardAlt,border:"1px solid "+S.border,borderRadius:10,padding:"14px 16px",marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div style={{color:S.accent,fontSize:13,fontWeight:700,fontFamily:"'Georgia',serif"}}>{row.scenario}</div><div style={{background:S.accent+"18",border:"1px solid "+S.accent+"44",borderRadius:4,padding:"2px 8px",color:S.accent,fontSize:11,fontFamily:"'Courier New',monospace",fontWeight:700}}>{row.ion}</div></div>
      <div style={{background:S.blue+"14",border:"1px solid "+S.blue+"44",borderRadius:6,padding:"6px 10px",marginBottom:10}}><span style={{color:S.blue,fontSize:11}}>Real World: {row.realWorld}</span></div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}><thead><tr style={{borderBottom:"1px solid "+S.border}}><th style={{textAlign:"left",padding:"5px 8px",color:S.textMuted,fontFamily:"'Courier New',monospace",fontSize:9,letterSpacing:1,textTransform:"uppercase",fontWeight:600}}>Reagent / Test</th><th style={{textAlign:"left",padding:"5px 8px",color:S.textMuted,fontFamily:"'Courier New',monospace",fontSize:9,letterSpacing:1,textTransform:"uppercase",fontWeight:600}}>Observation</th></tr></thead><tbody>{row.tests.map((t,j)=><tr key={j} style={{borderBottom:"1px solid "+S.border+"55"}}><td style={{padding:"5px 8px",color:S.accent,fontWeight:600}}>{t.reagent}</td><td style={{padding:"5px 8px",color:S.textSecondary}}>{t.result}</td></tr>)}</tbody></table>
    </div>)}
    {solvedCases.size===3?<div style={{background:S.accent+"0a",border:"1px solid "+S.accent+"33",borderRadius:8,padding:"12px 14px",marginBottom:16}}><div style={{color:S.accent,fontSize:10,fontFamily:"'Courier New',monospace",letterSpacing:1.5,textTransform:"uppercase",marginBottom:7,fontWeight:700}}>🏆 Master Key Points — All Cases Solved</div>{examTips.map((tip,i)=><div key={i} style={{display:"flex",gap:7,marginBottom:i<examTips.length-1?6:0,alignItems:"flex-start"}}><span style={{color:S.accent,fontSize:12}}>✓</span><span style={{color:S.textSecondary,fontSize:12,lineHeight:1.5}}>{tip}</span></div>)}</div>
    :<div style={{background:S.accent+"0a",border:"1px solid "+S.accent+"33",borderRadius:8,padding:"10px 12px",marginBottom:16}}><div style={{color:S.accent,fontSize:10,fontFamily:"'Courier New',monospace",letterSpacing:1.5,textTransform:"uppercase",marginBottom:4,fontWeight:700}}>🔒 Master Key Points Locked</div><p style={{color:S.textSecondary,fontSize:11.5,margin:0,lineHeight:1.6}}>Solve all 3 cases to unlock a comprehensive comparison guide. <strong>Cases solved: {solvedCases.size}/3</strong></p></div>}
    <div style={{display:"flex",gap:8}}><StyledButton onClick={onBackToSelect} variant="ghost" style={{flex:1}}>← All Cases</StyledButton><StyledButton onClick={onRestart} style={{flex:1}}>🔄 Replay</StyledButton></div>
  </div>;
}

function Notebook({notes,onChange,theme}){
  const [open,setOpen]=useState(false);
  const noteBg=theme==="light"?"#ffffff":"#1a1710";
  return <div style={{marginTop:18}}>
    <button onClick={()=>setOpen(!open)} style={{background:theme==="light"?"#ffffff":S.cardAlt,border:"1px solid "+S.accent+"33",borderRadius:open?"6px 6px 0 0":6,padding:"6px 12px",cursor:"pointer",color:S.accent,fontSize:11,fontFamily:"'Courier New',monospace",letterSpacing:0.8,width:"100%",textAlign:"left",display:"flex",justifyContent:"space-between"}} onMouseEnter={e=>e.currentTarget.style.background=S.accent+"14"} onMouseLeave={e=>e.currentTarget.style.background=theme==="light"?"#ffffff":S.cardAlt}>
      <span>📓 Detective Notebook {notes.trim()?"("+notes.trim().split("\n").filter(l=>l.trim()).length+" note"+(notes.trim().split("\n").filter(l=>l.trim()).length!==1?"s":"")+")" :""}</span><span>{open?"▲":"▼"}</span>
    </button>
    {open&&<div style={{background:noteBg,border:"1px solid "+S.accent+"33",borderTop:"none",borderRadius:"0 0 6px 6px",overflow:"hidden"}}><div style={{position:"relative"}}><div style={{position:"absolute",top:0,left:0,right:0,bottom:0,pointerEvents:"none",background:"repeating-linear-gradient(to bottom, transparent, transparent 23px, "+S.accent+"15 23px, "+S.accent+"15 24px)",marginTop:4}}/><textarea value={notes} onChange={e=>onChange(e.target.value)} placeholder="Jot down your observations and deductions here…" style={{width:"100%",minHeight:140,background:"transparent",border:"none",resize:"vertical",padding:"10px 12px",color:S.textPrimary,fontSize:12.5,lineHeight:"24px",fontFamily:"'Georgia',serif",outline:"none",position:"relative",zIndex:1,boxSizing:"border-box"}}/></div></div>}
  </div>;
}

export default function App(){
  const [theme,setTheme]=useState("light");
  S=theme==="light"?{...LIGHT}:{...DARK};
  const [selectedCase,setSelectedCase]=useState(null);
  const [phase,setPhase]=useState("register");
  const [solvedCases,setSolvedCases]=useState(new Set());
  const [caseBoard,setCaseBoard]=useState([]);
  const [fade,setFade]=useState(true);
  const [notes,setNotes]=useState("");
  const [suspectColors,setSuspectColors]=useState({});
  const [detective,setDetective]=useState(null);
  const [showDashboard,setShowDashboard]=useState(false);

  const caseData=selectedCase!==null?CASES[selectedCase]:null;
  const go=useCallback(next=>{setFade(false);setTimeout(()=>{setPhase(next);setFade(true);},280);},[]);

  const selectCase=idx=>{setSelectedCase(idx);setCaseBoard([]);setNotes("");const shuffled=shuffleArray(SUSPECT_COLORS);const colors={};CASES[idx].suspects.forEach((s,i)=>{colors[s.id]=shuffled[i%shuffled.length];});setSuspectColors(colors);go("intro");};
  const pinEvidence=useCallback(evidence=>{setCaseBoard(prev=>prev.find(e=>e.label===evidence.label)?prev:[...prev,evidence]);const map={station0:"board0",station1:"board1",station2:"board2"};if(map[phase])go(map[phase]);},[phase]);

  const stationPhases={station0:0,station1:1,station2:2};
  const boardPhases={board0:0,board1:1,board2:2};
  const boardNext={board0:"station1",board1:"station2",board2:"accusation"};
  const showNotebook=caseData&&phase!=="select"&&phase!=="debrief";
  const allPhases=["intro","station0","board0","station1","board1","station2","board2","accusation","debrief"];
  const pct=phase==="select"?0:Math.round((allPhases.indexOf(phase)/(allPhases.length-1))*100);

  let content;
  if(showDashboard)content=<TeacherDashboard onBack={()=>setShowDashboard(false)}/>;
  else if(phase==="register")content=<PhaseRegister onRegister={d=>{setDetective(d);go("select");}} onOpenDashboard={()=>setShowDashboard(true)}/>;
  else if(phase==="select")content=<PhaseCaseSelect onSelect={selectCase} detectiveName={detective&&detective.displayName||"Detective"} theme={theme}/>;
  else if(phase==="intro"&&caseData)content=<PhaseIntro caseData={caseData} onStart={()=>go("station0")} onBack={()=>go("select")} suspectColors={suspectColors}/>;
  else if(phase in stationPhases&&caseData)content=<PhaseStation key={phase} station={caseData.stations[stationPhases[phase]]} onSolved={pinEvidence} caseIdx={selectedCase} detectiveId={detective&&detective.id} theme={theme}/>;
  else if(phase in boardPhases&&caseData)content=<PhaseCaseBoard caseData={caseData} caseBoard={caseBoard} onContinue={()=>go(boardNext[phase])} isFinal={boardPhases[phase]===2}/>;
  else if(phase==="accusation"&&caseData)content=<PhaseAccusation caseData={caseData} onVerdict={()=>go("debrief")} onCaseSolved={()=>setSolvedCases(prev=>new Set([...prev,selectedCase]))} detectiveId={detective&&detective.id} suspectColors={suspectColors}/>;
  else if(phase==="debrief"&&caseData)content=<PhaseDebrief caseData={caseData} onRestart={()=>{setCaseBoard([]);setNotes("");go("intro");}} onBackToSelect={()=>{go("select");setTimeout(()=>setSelectedCase(null),300);}} solvedCases={solvedCases}/>;
  else content=<div style={{textAlign:"center",padding:"20px",color:S.textMuted}}>Loading...</div>;

  return <div style={{minHeight:"100vh",background:S.bg,color:S.textPrimary,fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",padding:"24px 14px 44px",transition:"background 0.3s,color 0.3s"}}>
    <div style={{width:"100%",maxWidth:700,background:S.card,border:"1px solid "+S.border,borderRadius:16,padding:26,boxShadow:"0 16px 56px "+(theme==="light"?"rgba(0,0,0,0.12)":"rgba(0,0,0,0.55)"),opacity:fade?1:0,transform:fade?"translateY(0)":"translateY(8px)",transition:"opacity 0.28s ease,transform 0.28s ease,background 0.3s,border-color 0.3s",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,"+S.accent+",#a07840,"+S.accent+")"}}/>
      <button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} style={{position:"absolute",top:14,left:14,background:theme==="dark"?"#ffffff14":"#00000010",border:"1px solid "+S.border,borderRadius:20,padding:"4px 10px 4px 8px",cursor:"pointer",display:"flex",alignItems:"center",gap:5,color:S.textMuted,fontSize:11,fontFamily:"'Courier New',monospace",transition:"all 0.2s",zIndex:10}} onMouseEnter={e=>{e.currentTarget.style.color=S.accent;}} onMouseLeave={e=>{e.currentTarget.style.color=S.textMuted;}}><span style={{fontSize:14,lineHeight:1}}>{theme==="dark"?"☀️":"🌙"}</span><span>{theme==="dark"?"Light":"Dark"}</span></button>
      <div style={{textAlign:"center",marginBottom:18,paddingTop:6}}>
        <div style={{color:S.textMuted,fontSize:9,fontFamily:"'Courier New',monospace",letterSpacing:3,textTransform:"uppercase",marginBottom:3}}>Metropolitan Police — Forensic Division</div>
        <h1 style={{margin:0,fontFamily:"'Georgia',serif",fontSize:24,color:S.textPrimary,letterSpacing:0.5}}>{caseData?<>Case <span style={{color:S.accent}}>{caseData.caseNumber}</span></>:<span style={{color:S.accent}}>CSI Chemistry</span>}</h1>
        <div style={{color:S.textMuted,fontSize:10,fontFamily:"'Courier New',monospace",letterSpacing:1.5}}>{caseData?caseData.title.toUpperCase():"QUALITATIVE ANALYSIS TRAINING"}</div>
      </div>
      {phase!=="select"&&<div style={{marginBottom:18}}><div style={{width:"100%",height:3,background:S.cardAlt,borderRadius:2,overflow:"hidden"}}><div style={{width:pct+"%",height:"100%",background:"linear-gradient(90deg,"+S.accent+",#e8c88a)",borderRadius:2,transition:"width 0.5s cubic-bezier(.4,0,.2,1)"}}/></div></div>}
      {content}
      {showNotebook&&<Notebook notes={notes} onChange={setNotes} theme={theme}/>}
    </div>
  </div>;
}