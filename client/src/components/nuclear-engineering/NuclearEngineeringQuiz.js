import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ScienceIcon from '@mui/icons-material/Science';

// Quiz data
const quizData = {
  beginner: [
    {
      question: "What particle is responsible for carrying the electromagnetic force?",
      options: [
        "Neutron",
        "Proton",
        "Photon",
        "Neutrino"
      ],
      correctAnswer: 2,
      explanation: "The photon is the force carrier (gauge boson) of the electromagnetic force. It is a massless particle responsible for electromagnetic interactions between charged particles."
    },
    {
      question: "Which of the following is NOT a type of radiation produced by nuclear processes?",
      options: [
        "Alpha particles",
        "Beta particles",
        "X-rays",
        "Sound waves"
      ],
      correctAnswer: 3,
      explanation: "Sound waves are mechanical waves that require a medium to propagate, not a form of nuclear radiation. The three main types of nuclear radiation are alpha particles (helium nuclei), beta particles (electrons/positrons), and gamma rays (high-energy photons). X-rays are also electromagnetic radiation but typically originate from electron transitions rather than nuclear processes."
    },
    {
      question: "What is the primary fuel used in most commercial nuclear reactors today?",
      options: [
        "Natural uranium",
        "Enriched uranium",
        "Plutonium",
        "Thorium"
      ],
      correctAnswer: 1,
      explanation: "Enriched uranium (uranium with an increased concentration of U-235, typically 3-5%) is the primary fuel used in most commercial nuclear reactors today. Natural uranium contains only 0.7% U-235, which is insufficient for sustaining a chain reaction in light water reactors."
    },
    {
      question: "What is the purpose of a moderator in a nuclear reactor?",
      options: [
        "To absorb excess neutrons",
        "To slow down fast neutrons",
        "To prevent radiation leakage",
        "To control the temperature of the core"
      ],
      correctAnswer: 1,
      explanation: "A moderator slows down (or moderates) fast neutrons to thermal energies, which increases the probability of neutron capture and fission in U-235. Common moderators include water, heavy water (D₂O), and graphite."
    },
    {
      question: "What does the term 'half-life' refer to in nuclear physics?",
      options: [
        "The time it takes for a radioactive material to decay completely",
        "The time it takes for half of a radioactive material to decay",
        "The time a radioactive material remains dangerous",
        "Half the operational life of a nuclear reactor"
      ],
      correctAnswer: 1,
      explanation: "Half-life is the time required for exactly half of the radioactive atoms in a sample to decay. It is a characteristic property of each radioactive isotope and ranges from fractions of a second to billions of years, depending on the isotope."
    },
    {
      question: "Which component in a nuclear power plant directly generates electricity?",
      options: [
        "Reactor core",
        "Steam generator",
        "Turbine-generator",
        "Cooling tower"
      ],
      correctAnswer: 2,
      explanation: "The turbine-generator directly generates electricity in a nuclear power plant. The reactor core produces heat, which is used to generate steam (either directly or via steam generators), and this steam drives the turbine that is connected to an electrical generator."
    },
    {
      question: "Which of the following best describes nuclear fission?",
      options: [
        "Combining light nuclei to form a heavier nucleus",
        "Splitting a heavy nucleus into lighter nuclei",
        "The emission of radiation from an unstable nucleus",
        "The capture of a neutron by a stable nucleus"
      ],
      correctAnswer: 1,
      explanation: "Nuclear fission is the process of splitting a heavy nucleus (like uranium-235 or plutonium-239) into two or more lighter nuclei, accompanied by the release of neutrons, gamma rays, and a large amount of energy. This is the process that powers current nuclear reactors."
    },
    {
      question: "What is the primary cooling medium used in Pressurized Water Reactors (PWRs)?",
      options: [
        "Heavy water (D₂O)",
        "Ordinary water (H₂O)",
        "Liquid sodium",
        "Carbon dioxide gas"
      ],
      correctAnswer: 1,
      explanation: "Pressurized Water Reactors (PWRs) use ordinary water (H₂O) as both coolant and moderator. The water is kept under high pressure (about 155 bar) to prevent boiling while operating at high temperatures (around 315°C)."
    },
    {
      question: "Which of the following nuclear processes releases the most energy per unit mass?",
      options: [
        "Alpha decay",
        "Beta decay",
        "Nuclear fission",
        "Nuclear fusion"
      ],
      correctAnswer: 3,
      explanation: "Nuclear fusion releases the most energy per unit mass of any nuclear process. The fusion of light elements (such as hydrogen isotopes) into heavier elements (such as helium) can release nearly four times more energy per unit mass than nuclear fission."
    },
    {
      question: "What is the primary function of control rods in a nuclear reactor?",
      options: [
        "To generate additional neutrons",
        "To absorb neutrons and control the reaction rate",
        "To provide structural support for fuel assemblies",
        "To increase the efficiency of heat transfer"
      ],
      correctAnswer: 1,
      explanation: "Control rods absorb neutrons to control the rate of the nuclear chain reaction. By inserting or withdrawing control rods, operators can decrease or increase the reactor power. Control rods are typically made of neutron-absorbing materials such as boron, cadmium, or hafnium."
    },
    {
      question: "What is the main purpose of a containment building in a nuclear power plant?",
      options: [
        "To protect the reactor from external weather conditions",
        "To improve the plant's aesthetic appearance",
        "To prevent the release of radioactive materials in the event of an accident",
        "To house administrative offices and control rooms"
      ],
      correctAnswer: 2,
      explanation: "The primary purpose of a containment building is to prevent the release of radioactive materials to the environment if an accident occurs. The containment building is typically a steel-lined concrete structure designed to withstand internal pressure and seal in radioactive materials."
    },
    {
      question: "Which isotope is commonly used in nuclear medicine for diagnostic imaging?",
      options: [
        "Uranium-235",
        "Plutonium-239",
        "Technetium-99m",
        "Radon-222"
      ],
      correctAnswer: 2,
      explanation: "Technetium-99m is the most widely used radioisotope in nuclear medicine for diagnostic imaging. It emits gamma rays that can be detected by gamma cameras, has a short half-life of about 6 hours (minimizing patient radiation exposure), and can be attached to various chemicals to target specific organs or tissues."
    },
    {
      question: "What is the difference between radiation and radioactivity?",
      options: [
        "They are different terms for the same phenomenon",
        "Radiation is the energy or particles emitted, while radioactivity is the process of unstable atoms decaying",
        "Radiation only refers to light waves, while radioactivity refers to particle emission",
        "Radiation is harmless, while radioactivity is always dangerous"
      ],
      correctAnswer: 1,
      explanation: "Radiation refers to the energy or particles that are emitted from a source, while radioactivity is the property or process by which unstable atomic nuclei spontaneously decompose, emitting radiation in the process. A material is radioactive if it contains unstable nuclei that undergo radioactive decay."
    },
    {
      question: "What is the typical thermal efficiency of a nuclear power plant?",
      options: [
        "10-20%",
        "30-35%",
        "50-60%",
        "80-90%"
      ],
      correctAnswer: 1,
      explanation: "Nuclear power plants typically operate at thermal efficiencies of around 30-35%. This is similar to coal-fired power plants but lower than modern combined-cycle natural gas plants. The efficiency is limited by thermodynamic principles and the relatively low steam temperatures used to ensure safety and material longevity."
    },
    {
      question: "What is the fuel commonly arranged in within a nuclear reactor core?",
      options: [
        "Fuel pellets",
        "Fuel pebbles",
        "Fuel assemblies",
        "Fuel plates"
      ],
      correctAnswer: 2,
      explanation: "In most commercial nuclear reactors, fuel is arranged in fuel assemblies. These typically consist of fuel rods (zirconium alloy tubes containing uranium fuel pellets) arranged in a square or hexagonal array. A typical pressurized water reactor might contain 150-200 fuel assemblies, each with 200-300 fuel rods."
    },
    {
      question: "What is the primary reason for using zirconium alloys as fuel cladding in nuclear reactors?",
      options: [
        "Low cost and easy manufacturing",
        "High melting point",
        "Low neutron absorption cross-section",
        "Resistance to radiation damage"
      ],
      correctAnswer: 2,
      explanation: "Zirconium alloys are primarily used as fuel cladding because of their low neutron absorption cross-section, which allows more neutrons to participate in the chain reaction. They also have good corrosion resistance in high-temperature water and adequate mechanical properties."
    },
    {
      question: "Which nuclear reactor design uses graphite as a moderator and carbon dioxide as a coolant?",
      options: [
        "Pressurized Water Reactor (PWR)",
        "Boiling Water Reactor (BWR)",
        "Advanced Gas-cooled Reactor (AGR)",
        "Pressurized Heavy Water Reactor (PHWR)"
      ],
      correctAnswer: 2,
      explanation: "The Advanced Gas-cooled Reactor (AGR) uses graphite as a moderator and carbon dioxide gas as a coolant. This design was developed in the United Kingdom as a successor to the earlier Magnox reactors and operates at higher temperatures and higher thermal efficiencies than water-cooled reactors."
    },
    {
      question: "What is the purpose of a spent fuel pool at a nuclear power plant?",
      options: [
        "To store and cool irradiated fuel after removal from the reactor",
        "To clean contaminated equipment",
        "To prepare new fuel for insertion into the reactor",
        "To conduct experimental research on radiation effects"
      ],
      correctAnswer: 0,
      explanation: "Spent fuel pools are used to store and cool fuel assemblies after they're removed from the reactor. The water provides both cooling (removing decay heat) and radiation shielding. Typically, fuel remains in these pools for at least 5-10 years before potential transfer to dry cask storage."
    },
    {
      question: "What is meant by 'Generation IV' in nuclear reactor design?",
      options: [
        "The fourth reactor built at a specific power plant site",
        "A theoretical concept that hasn't been developed yet",
        "Advanced reactor designs with enhanced safety and efficiency features",
        "Reactors that produce fourth-generation nuclear fuels"
      ],
      correctAnswer: 2,
      explanation: "Generation IV refers to a set of advanced nuclear reactor designs currently under development. These designs aim to improve safety, sustainability, efficiency, and proliferation resistance compared to current (Generation II and III) reactors. Examples include the Molten Salt Reactor, Sodium-cooled Fast Reactor, and Very High Temperature Reactor."
    },
    {
      question: "What is the purpose of 'burnable poisons' in nuclear reactor fuel?",
      options: [
        "To reduce the toxicity of nuclear waste",
        "To increase the fuel's energy output",
        "To compensate for reactivity decrease over the fuel cycle",
        "To prevent fuel melting in accident scenarios"
      ],
      correctAnswer: 2,
      explanation: "Burnable poisons (like gadolinium or boron) are incorporated into some fuel elements to compensate for the high initial reactivity of fresh fuel. They 'burn up' (absorb neutrons and convert to non-absorbing isotopes) gradually as the fuel depletes, helping maintain relatively constant reactivity throughout the fuel cycle and allowing for longer periods between refueling."
    },
    {
      question: "What is the role of a neutron reflector in a nuclear reactor?",
      options: [
        "To reflect radiation away from operators",
        "To bounce neutrons back into the core to improve efficiency",
        "To slow down fast neutrons",
        "To prevent neutron-induced corrosion of the vessel"
      ],
      correctAnswer: 1,
      explanation: "A neutron reflector surrounds the reactor core and reflects neutrons that would otherwise escape back into the core. This improves fuel utilization, reduces critical mass requirements, and helps flatten the neutron flux distribution across the core. Common reflector materials include beryllium, graphite, and water."
    },
    {
      question: "What is the primary reason for using zirconium alloys as fuel cladding in nuclear reactors?",
      options: [
        "High melting point",
        "Low cost",
        "Low neutron absorption cross-section",
        "Good thermal conductivity"
      ],
      correctAnswer: 2,
      explanation: "Zirconium alloys are used as fuel cladding primarily due to their low neutron absorption cross-section, which allows more neutrons to remain available for the fission chain reaction. They also have good corrosion resistance in high-temperature water environments and adequate mechanical properties for containing the fuel and fission products."
    },
    {
      question: "What is the difference between a nuclear chain reaction and radioactive decay?",
      options: [
        "Chain reactions release more energy, while decay is more dangerous",
        "Chain reactions involve fission events triggering more fissions, while decay is spontaneous",
        "Chain reactions only occur in reactors, while decay only occurs in waste",
        "Chain reactions produce neutrons, while decay produces only gamma rays"
      ],
      correctAnswer: 1,
      explanation: "A nuclear chain reaction is a process where neutrons released in fission trigger additional fission events, creating a self-sustaining reaction. In contrast, radioactive decay is a spontaneous process where unstable nuclei emit radiation to reach a more stable state. Chain reactions can be controlled and are the basis of nuclear power, while decay occurs at a fixed rate determined by the radioisotope's half-life."
    },
    {
      question: "What is the purpose of shielding in nuclear facilities?",
      options: [
        "To prevent nuclear fuel from melting",
        "To reduce radiation exposure to personnel and the environment",
        "To increase the efficiency of the chain reaction",
        "To protect against external attacks"
      ],
      correctAnswer: 1,
      explanation: "Shielding in nuclear facilities is designed to reduce radiation exposure to personnel and the environment. Different materials are used to attenuate different types of radiation: high-density materials like lead or concrete for gamma rays, hydrogen-rich materials like water or polyethylene for neutrons, and thin layers of dense materials for beta particles."
    },
    {
      question: "What is 'enrichment' in the context of nuclear fuel?",
      options: [
        "The process of increasing uranium's energy content",
        "Adding nutrients to uranium to improve its quality",
        "Increasing the concentration of uranium-235 relative to uranium-238",
        "Adding burnable poisons to fresh fuel"
      ],
      correctAnswer: 2,
      explanation: "Enrichment is the process of increasing the concentration of the fissile isotope uranium-235 relative to the more abundant uranium-238. Natural uranium contains only 0.7% U-235, but most commercial reactors require 3-5% U-235 to sustain a chain reaction. Enrichment technologies include gaseous diffusion, gas centrifuge, and newer laser-based methods."
    },
    {
      question: "What is the main function of a steam generator in a nuclear power plant?",
      options: [
        "To generate steam directly from nuclear fission",
        "To transfer heat from the primary coolant to produce steam in the secondary loop",
        "To remove excess steam from the reactor core",
        "To generate power for the plant's internal consumption"
      ],
      correctAnswer: 1,
      explanation: "In a Pressurized Water Reactor (PWR), the steam generator transfers heat from the high-pressure, radioactive primary coolant to the non-radioactive secondary loop, producing steam to drive the turbine. This design creates a barrier between the radioactive and non-radioactive parts of the plant, enhancing safety by preventing the release of radioactive materials to the environment."
    },
    {
      question: "What is the purpose of 'boron' in PWR primary coolant?",
      options: [
        "To prevent coolant from becoming radioactive",
        "To inhibit corrosion of the primary system",
        "To control reactivity by absorbing neutrons",
        "To improve heat transfer properties of water"
      ],
      correctAnswer: 2,
      explanation: "Boron (in the form of boric acid) is dissolved in the primary coolant of PWRs to control reactivity by absorbing neutrons. By adjusting boron concentration, operators can control long-term reactivity changes over the fuel cycle. This chemical shim complements control rods, allowing for more uniform power distribution and fewer control rod movements during operation."
    },
    {
      question: "What is the purpose of a cooling tower at a nuclear power plant?",
      options: [
        "To cool the reactor core directly",
        "To condense spent steam from the turbine back into water",
        "To reduce radioactivity in the primary coolant",
        "To provide emergency cooling during accidents"
      ],
      correctAnswer: 1,
      explanation: "Cooling towers at nuclear power plants dissipate waste heat from the power conversion cycle by cooling the condenser water that has condensed steam from the turbine. They prevent thermal pollution of natural water bodies by transferring heat to the atmosphere rather than discharging hot water directly to lakes or rivers. Cooling towers are part of the tertiary loop and don't interact with radioactive systems."
    },
    {
      question: "What is the main difference between a Pressurized Water Reactor (PWR) and a Boiling Water Reactor (BWR)?",
      options: [
        "PWRs use uranium fuel, while BWRs use plutonium",
        "PWRs have higher power output than BWRs",
        "In PWRs, water in the primary loop doesn't boil; in BWRs, it does",
        "PWRs have containment buildings, while BWRs don't"
      ],
      correctAnswer: 2,
      explanation: "The key difference between PWRs and BWRs is that in PWRs, water in the primary cooling loop (in contact with the core) is kept under pressure to prevent boiling, and a separate secondary loop generates steam. In BWRs, water is allowed to boil directly in the core, and the resulting steam is sent directly to the turbine. Both use similar fuel and have containment buildings."
    },
    {
      question: "What is the purpose of a nuclear fuel pellet's central void?",
      options: [
        "To reduce the amount of uranium needed",
        "To allow for fuel expansion and accommodate fission gases",
        "To create a path for control rod insertion",
        "To allow coolant to flow through the fuel"
      ],
      correctAnswer: 1,
      explanation: "The central void (or 'plenum') in nuclear fuel pellets provides space to accommodate thermal expansion of the fuel and the buildup of fission gases released during operation. Without this void, excessive pressure could build up inside the fuel rod, potentially leading to cladding failure. The void also helps reduce the centerline temperature of the fuel by decreasing the conduction path length."
    },
    {
      question: "What are the three primary 'barriers' designed to prevent radioactive release in nuclear power plants?",
      options: [
        "Containment building, reactor vessel, and turbine building",
        "Fuel cladding, reactor coolant system, and containment building",
        "Control rods, coolant, and concrete shielding",
        "Fuel enrichment, waste storage, and site boundary"
      ],
      correctAnswer: 1,
      explanation: "Nuclear power plants use a 'defense in depth' approach with three primary barriers to prevent radioactive release: 1) the fuel cladding, which contains the fuel and fission products; 2) the reactor coolant system pressure boundary, including the reactor vessel; and 3) the containment building, designed to contain radioactive materials if the first two barriers fail."
    },
    {
      question: "What is 'background radiation'?",
      options: [
        "Radiation emitted by electronic devices",
        "Naturally occurring radiation from cosmic rays, soil, and the human body",
        "Residual radiation from past nuclear weapons tests",
        "Low-level radiation leakage from nuclear facilities"
      ],
      correctAnswer: 1,
      explanation: "Background radiation refers to naturally occurring radiation present in the environment from sources such as cosmic rays from space, terrestrial radiation from minerals in soil and building materials, and internal radiation from naturally radioactive elements in the human body (like potassium-40). The average person receives about 3.1 mSv annually from natural background radiation."
    },
    {
      question: "What is the primary fuel in most commercial fusion reactor designs?",
      options: [
        "Uranium-235 and Plutonium-239",
        "Deuterium and Tritium",
        "Thorium-232",
        "Helium-3 and Hydrogen-1"
      ],
      correctAnswer: 1,
      explanation: "Most commercial fusion reactor designs plan to use deuterium (²H) and tritium (³H) as fuel. This combination has the highest reaction cross-section at achievable temperatures. Deuterium can be extracted from seawater, while tritium is radioactive with a short half-life and would need to be bred in the reactor using lithium. The fusion of these isotopes produces helium, a neutron, and significant energy."
    },
    {
      question: "What is the function of the 'biological shield' in a nuclear reactor?",
      options: [
        "To shield marine life from reactor heat discharge",
        "To protect plant workers from radiation exposure",
        "To prevent biological contamination of the reactor core",
        "To contain biological research specimens near the reactor"
      ],
      correctAnswer: 1,
      explanation: "The biological shield is a thick layer of dense material (usually concrete, sometimes with steel or lead) that surrounds the reactor vessel to protect plant workers and equipment from radiation exposure. It attenuates both neutron and gamma radiation that escapes the reactor vessel. The biological shield is distinct from the containment structure, which serves to prevent release of radioactive materials to the environment."
    },
    {
      question: "What is the difference between 'contamination' and 'irradiation'?",
      options: [
        "Contamination is from natural sources, irradiation is artificial",
        "Contamination affects only living tissue, irradiation affects any material",
        "Contamination involves radioactive material on/in an object, irradiation is exposure to radiation without material transfer",
        "Contamination is temporary, irradiation causes permanent changes"
      ],
      correctAnswer: 2,
      explanation: "Contamination occurs when radioactive material is deposited on or incorporated into an object or person. The object becomes a radiation source. Irradiation is exposure to radiation without the transfer of radioactive material, like getting an X-ray. An irradiated person is not radioactive, but a contaminated person is both irradiated by and a source of radiation."
    },
    {
      question: "What does ALARA stand for in radiation protection?",
      options: [
        "Automatic Level Adjustment for Radiation Areas",
        "As Low As Reasonably Achievable",
        "Acceptable Limits for Radiation Absorption",
        "Alarm Levels for Accidental Radiation Alerts"
      ],
      correctAnswer: 1,
      explanation: "ALARA stands for 'As Low As Reasonably Achievable.' It's a fundamental principle in radiation protection that aims to minimize radiation doses and releases of radioactive materials. While recognizing that some radiation exposure may be necessary, ALARA requires making every reasonable effort to minimize exposure, taking into account economic and social factors."
    },
    {question: "What is the purpose of a biological shield in a nuclear reactor?",
      options: [
        "To protect reactor components from biological contaminants",
        "To reduce radiation exposure to personnel and the environment",
        "To prevent the release of radioactive biological agents",
        "To support microbial decomposition of nuclear waste"
      ],
      correctAnswer: 1,
      explanation: "A biological shield is a thick barrier (typically concrete, sometimes with steel or lead) surrounding a nuclear reactor that reduces radiation levels outside the shield to safe levels for personnel. It primarily attenuates gamma radiation and neutrons that escape the reactor vessel, allowing workers to safely operate in adjacent areas."
    },
    {
      question: "What is the difference between boiling water reactors (BWRs) and pressurized water reactors (PWRs)?",
      options: [
        "BWRs use boiling water as coolant, while PWRs use pressurized gas",
        "BWRs allow water to boil in the core, while PWRs maintain water under pressure to prevent boiling",
        "BWRs operate at lower temperatures than PWRs",
        "BWRs use enriched uranium, while PWRs use natural uranium"
      ],
      correctAnswer: 1,
      explanation: "The key difference is that in BWRs, water is allowed to boil directly in the reactor core, and the resulting steam drives the turbine. In PWRs, the primary coolant (water) is kept under high pressure to prevent boiling, and heat is transferred to a secondary loop where steam is generated in steam generators. This design difference means PWRs have two separate water loops, while BWRs have only one."
    },
    {
      question: "What is the function of a neutron source in reactor startup?",
      options: [
        "To provide a reliable source of neutrons to initiate the chain reaction",
        "To absorb excess neutrons during initial criticality",
        "To calibrate neutron detection instruments",
        "To enhance neutron moderation in new fuel"
      ],
      correctAnswer: 0,
      explanation: "A neutron source provides a reliable supply of neutrons during reactor startup. Without an artificial source, reactors would rely solely on spontaneous fission or cosmic rays for initial neutrons, making startups unpredictable. Common neutron sources include mixtures of beryllium with alpha-emitting materials (like americium) that produce neutrons through (α,n) reactions."
    }
  ],
  intermediate: [
    {
      question: "What is the delayed neutron fraction in a nuclear reactor?",
      options: [
        "The fraction of neutrons that arrive with a delay after fission",
        "The fraction of neutrons that leak from the reactor core",
        "The fraction of neutrons that cause additional fissions",
        "The fraction of neutrons absorbed by control rods"
      ],
      correctAnswer: 0,
      explanation: "The delayed neutron fraction (often denoted by β) is the fraction of neutrons that are not released immediately during fission but with a delay due to the decay of fission products. This fraction (about 0.65% for U-235) is crucial for reactor control, as it extends the neutron generation time and makes the reactor easier to control."
    },
    {
      question: "In a nuclear reactor, what does the term 'poisoning' refer to?",
      options: [
        "The release of toxic chemicals from nuclear fuel",
        "The accumulation of neutron-absorbing fission products",
        "Damage to fuel rods from excessive heat",
        "Radiation leakage outside the containment"
      ],
      correctAnswer: 1,
      explanation: "In reactor physics, 'poisoning' refers to the accumulation of neutron-absorbing fission products that reduce reactivity. The most significant example is xenon-135, which has a very high neutron absorption cross-section and can cause xenon poisoning that affects reactor operation after power changes."
    },
    {
      question: "What is the difference between prompt and delayed criticality?",
      options: [
        "Prompt criticality relies only on prompt neutrons, while delayed criticality includes delayed neutrons",
        "Prompt criticality occurs immediately, while delayed criticality takes hours to achieve",
        "Prompt criticality happens at higher power levels, delayed at lower levels",
        "Prompt criticality relates to research reactors, delayed to power reactors"
      ],
      correctAnswer: 0,
      explanation: "Prompt criticality means the reactor would be critical using only prompt neutrons (neutrons released immediately during fission). This is an unsafe condition leading to a rapid power excursion. Normal reactor operation relies on delayed criticality, where both prompt and delayed neutrons are needed for criticality, allowing for controllable operation."
    },
    {
      question: "What is the purpose of a Reactor Pressure Vessel (RPV)?",
      options: [
        "To create pressure needed for the nuclear reaction to occur",
        "To contain the reactor core and primary coolant under pressure",
        "To generate steam for the turbine",
        "To provide radiation shielding for workers"
      ],
      correctAnswer: 1,
      explanation: "The Reactor Pressure Vessel (RPV) contains the reactor core and primary coolant under high pressure. It's a critical safety barrier that prevents the release of radioactive materials and allows the coolant to operate at high temperatures without boiling in pressurized water reactors."
    },
    {
      question: "Which of the following is a characteristic of a fast neutron reactor?",
      options: [
        "It uses a moderator to slow down neutrons",
        "It has a lower power density than thermal reactors",
        "It can use natural uranium as fuel",
        "It can breed more fissile material than it consumes"
      ],
      correctAnswer: 3,
      explanation: "Fast neutron reactors can breed more fissile material than they consume by converting fertile materials (like U-238) into fissile isotopes (like Pu-239). Unlike thermal reactors, fast reactors operate without moderators, maintain higher neutron energies, and typically use higher-enriched fuels or plutonium."
    },
    {
      question: "What is the significance of the neutron multiplication factor (k) in reactor physics?",
      options: [
        "It measures how many neutrons are produced per fission event",
        "It indicates how many times the core must be refueled annually",
        "It determines whether a reactor's power is increasing, stable, or decreasing",
        "It calculates the efficiency of electricity generation"
      ],
      correctAnswer: 2,
      explanation: "The neutron multiplication factor (k) indicates whether a reactor is subcritical (k < 1), critical (k = 1), or supercritical (k > 1). It represents the ratio of neutrons in one generation to those in the previous generation, determining whether the chain reaction is dying out, maintaining steady-state, or growing."
    },
    {
      question: "What is the difference between contamination and irradiation in radiation protection?",
      options: [
        "Contamination refers to external radiation, irradiation to internal radiation",
        "Contamination involves radioactive material on or in a person, irradiation is exposure to radiation without material transfer",
        "Contamination affects objects, irradiation affects people",
        "Contamination is short-term exposure, irradiation is long-term exposure"
      ],
      correctAnswer: 1,
      explanation: "Contamination occurs when radioactive material is deposited on or incorporated into a person's body or objects. Irradiation is exposure to radiation (like gamma rays) without the transfer of radioactive material. A contaminated person is irradiated, but an irradiated person is not necessarily contaminated."
    },
    {
      question: "What is the significance of the void coefficient in reactor design?",
      options: [
        "It measures the change in reactivity as coolant forms voids or bubbles",
        "It calculates the required void space in containment structures",
        "It determines the maximum allowable empty space in fuel pellets",
        "It quantifies the effect of control rod voids on neutron absorption"
      ],
      correctAnswer: 0,
      explanation: "The void coefficient measures how reactor reactivity changes when voids (bubbles) form in the coolant. A positive void coefficient means reactivity increases with void formation (potentially destabilizing), while a negative void coefficient decreases reactivity (self-stabilizing). The Chernobyl reactor had a positive void coefficient, which contributed to its accident."
    },
    {
      question: "In nuclear reactor terminology, what is a 'scram'?",
      options: [
        "A scheduled maintenance shutdown",
        "An emergency shutdown by rapid insertion of control rods",
        "A controlled power reduction procedure",
        "A containment isolation event"
      ],
      correctAnswer: 1,
      explanation: "A 'scram' is an emergency reactor shutdown achieved by rapidly inserting control rods into the core to stop the nuclear chain reaction. It's a safety measure triggered automatically by abnormal conditions or manually by operators when necessary."
    },
    {
      question: "Which property of zirconium alloys makes them widely used as fuel cladding in water-cooled reactors?",
      options: [
        "High thermal conductivity",
        "Low neutron absorption cross-section",
        "Resistance to radiation damage",
        "Low cost and abundant supply"
      ],
      correctAnswer: 1,
      explanation: "Zirconium alloys are used as fuel cladding primarily because of their low neutron absorption cross-section, which means they don't significantly reduce neutron flux in the reactor. They also have good corrosion resistance in high-temperature water and adequate mechanical properties, though they're neither the best thermal conductors nor the cheapest materials available."
    },
    {
      question: "What is the function of the pressurizer in a Pressurized Water Reactor?",
      options: [
        "To increase the thermal efficiency of the steam cycle",
        "To cool the reactor coolant before it enters the steam generator",
        "To control and maintain primary coolant system pressure",
        "To pressurize the containment during accident conditions"
      ],
      correctAnswer: 2,
      explanation: "The pressurizer maintains and controls the pressure in the primary coolant system of a PWR. It contains both water and steam phases, with electric heaters and water spray systems that can increase or decrease pressure as needed. This ensures the primary coolant remains liquid throughout the system, preventing boiling in the core."
    },
    {
      question: "What is meant by 'defense in depth' in nuclear safety?",
      options: [
        "The practice of building reactors underground for protection",
        "Multiple, redundant safety systems and barriers to prevent accidents and mitigate consequences",
        "Having multiple operators monitor the reactor at all times",
        "Designing reactors to withstand military attacks"
      ],
      correctAnswer: 1,
      explanation: "Defense in depth is a fundamental safety principle involving multiple independent and redundant layers of protection, so if one layer fails, others remain effective. These layers include physical barriers (fuel cladding, pressure vessel, containment) and diverse safety systems, ensuring that no single failure can lead to a major release of radioactive material."
    },
    {
      question: "What is the primary coolant used in a Boiling Water Reactor (BWR)?",
      options: [
        "Heavy water (D₂O)",
        "Light water (H₂O)",
        "Liquid sodium",
        "Helium gas"
      ],
      correctAnswer: 1,
      explanation: "Light water (ordinary water, H₂O) is used as both coolant and moderator in a Boiling Water Reactor. Unlike in PWRs, the water is allowed to boil in the core, creating steam that directly drives the turbine. This simplifies the design by eliminating the need for steam generators but requires radiation shielding around the turbine."
    },
    {
      question: "What is the purpose of a neutron reflector in a nuclear reactor?",
      options: [
        "To shield operators from neutron radiation",
        "To redirect escaped neutrons back into the core to improve fuel utilization",
        "To moderate fast neutrons to thermal energies",
        "To absorb excess neutrons during shutdown"
      ],
      correctAnswer: 1,
      explanation: "A neutron reflector surrounds the reactor core and reflects neutrons that would otherwise escape back into the core. This improves fuel utilization, reduces critical mass requirements, and helps flatten the neutron flux distribution. Common reflector materials include beryllium, graphite, and water."
    },
    {
      question: "What is the primary advantage of heavy water (D₂O) as a moderator compared to light water?",
      options: [
        "It has a higher boiling point, allowing higher operating temperatures",
        "It absorbs fewer neutrons, enabling the use of natural uranium fuel",
        "It has better heat transfer properties, improving thermal efficiency",
        "It provides better radiation shielding for operators"
      ],
      correctAnswer: 1,
      explanation: "Heavy water absorbs significantly fewer neutrons than light water because deuterium has a much lower neutron absorption cross-section than hydrogen. This allows heavy water reactors (like CANDU) to achieve criticality with natural uranium (0.7% U-235) without enrichment, which was historically important for countries without uranium enrichment capabilities."
    },
    {
      question: "What is the 'six-factor formula' used for in reactor physics?",
      options: [
        "Calculating fuel enrichment requirements",
        "Determining control rod positions",
        "Calculating the effective neutron multiplication factor",
        "Estimating reactor power output"
      ],
      correctAnswer: 2,
      explanation: "The six-factor formula calculates the effective neutron multiplication factor (k) by multiplying six independent factors: the reproduction factor (η), the fast fission factor (ε), the fast non-leakage probability (Pf), the resonance escape probability (p), the thermal non-leakage probability (Pt), and the thermal utilization factor (f). It separates the complex neutronics of a reactor into distinct physical processes for analysis."
    },
    {
      question: "What is 'xenon poisoning' and why is it significant for reactor operation?",
      options: [
        "Radiation sickness caused by xenon gas leaks",
        "Corrosion of fuel cladding by xenon isotopes",
        "Accumulation of xenon-135 that absorbs neutrons and affects reactivity",
        "Release of toxic xenon compounds during fuel failure"
      ],
      correctAnswer: 2,
      explanation: "Xenon poisoning refers to the accumulation of xenon-135 (a fission product with an extremely high neutron absorption cross-section) in an operating reactor. After a power reduction, xenon-135 continues to accumulate from iodine-135 decay, causing a temporary decrease in reactivity that can prevent restart for several hours. This phenomenon complicates load-following operations and was a factor in the Chernobyl accident."
    },
    {
      question: "What is a 'loss of coolant accident' (LOCA) in a nuclear reactor?",
      options: [
        "Gradual evaporation of coolant during normal operation",
        "Accidental discharge of coolant to the environment",
        "A breach in the reactor cooling system causing coolant to escape",
        "Failure of cooling water pumps during a power outage"
      ],
      correctAnswer: 2,
      explanation: "A loss of coolant accident (LOCA) occurs when there is a breach in the reactor cooling system that allows coolant to escape faster than makeup systems can replace it. This is a serious accident scenario that could lead to core overheating and fuel damage if emergency cooling systems don't function properly. Nuclear plants have multiple emergency systems designed to prevent core damage during a LOCA."
    },
    {
      question: "What is the primary purpose of emergency core cooling systems (ECCS) in nuclear plants?",
      options: [
        "To cool the containment building during accidents",
        "To prevent core damage during loss of normal cooling",
        "To reduce pressure in the reactor during transients",
        "To cool spent fuel during refueling operations"
      ],
      correctAnswer: 1,
      explanation: "Emergency Core Cooling Systems (ECCS) are designed to prevent core damage during accidents where normal cooling is compromised, particularly during a loss of coolant accident (LOCA). These systems typically include multiple redundant and diverse cooling methods, such as high-pressure injection, accumulators, and low-pressure long-term cooling systems."
    },
    {
      question: "What is 'burnup' in the context of nuclear fuel?",
      options: [
        "The temperature at which nuclear fuel begins to melt",
        "The measure of energy extracted from nuclear fuel",
        "The process of burning away impurities in fresh fuel",
        "The rate of fission product buildup in the reactor core"
      ],
      correctAnswer: 1,
      explanation: "Burnup is a measure of the energy extracted from nuclear fuel, typically expressed in gigawatt-days per metric ton of uranium (GWd/tU). It represents how much of the original fissile material has been 'burned' through nuclear reactions. Higher burnup means more efficient fuel utilization but also leads to greater fuel cladding stress and fission product inventory."
    },
    {
      question: "What is a 'breed and burn' reactor concept?",
      options: [
        "A reactor that alternates between power production and shutdown periods",
        "A reactor where fertile material is converted to fissile material and then used for energy production",
        "A reactor design that uses both fission and fusion processes",
        "A temporary reactor used to start up larger commercial reactors"
      ],
      correctAnswer: 1,
      explanation: "A 'breed and burn' reactor concept refers to designs where fertile material (like U-238) is converted to fissile material (like Pu-239) in situ and then 'burned' (undergoes fission) without reprocessing. This allows for very efficient use of uranium resources, potentially extracting up to 60 times more energy from the same amount of uranium compared to conventional once-through fuel cycles."
    },
    {
      question: "What is the purpose of a containment spray system in a nuclear power plant?",
      options: [
        "To spray water on hot components during normal operation",
        "To clean contaminated air in the containment during normal operation",
        "To reduce containment pressure and remove radionuclides during accidents",
        "To prevent corrosion of metallic components"
      ],
      correctAnswer: 2,
      explanation: "Containment spray systems are emergency safety features that activate during accidents to reduce pressure and temperature inside the containment building. The sprays also remove airborne radioactive particles and soluble gases like iodine from the containment atmosphere. This helps maintain containment integrity and reduces potential radioactive releases to the environment."
    },
    {
      question: "What is the difference between a homogeneous and heterogeneous reactor core?",
      options: [
        "Homogeneous cores use a single fuel type, while heterogeneous use multiple fuel types",
        "Homogeneous cores have uniform power distribution, while heterogeneous have varying power levels",
        "Homogeneous cores have fuel and moderator mixed together, while heterogeneous have them physically separated",
        "Homogeneous cores are small research reactors, while heterogeneous are large power reactors"
      ],
      correctAnswer: 2,
      explanation: "In a homogeneous reactor, the fuel and moderator are mixed together in a single phase (often as a solution or slurry). In a heterogeneous reactor, the fuel and moderator are physically separated, with fuel typically in discrete elements surrounded by moderator. Most commercial power reactors are heterogeneous designs with solid fuel elements, which offer advantages in heat removal and operational control."
    },
    {
      question: "What is 'load following' in the context of nuclear power plants?",
      options: [
        "Monitoring the weight load on structural components",
        "Adjusting reactor power output to match varying electricity demand",
        "Following a prescribed loading sequence for new fuel",
        "Meeting the baseload power requirements of the grid"
      ],
      correctAnswer: 1,
      explanation: "Load following refers to the ability of a power plant to adjust its output to match varying electricity demand throughout the day. While many nuclear plants traditionally operate as baseload units at constant power, some designs and operating strategies allow nuclear plants to operate in load-following mode, changing power levels to accommodate daily or seasonal changes in electricity demand."
    },
    {
      question: "What is the primary function of a pressurizer in a Pressurized Water Reactor?",
      options: [
        "To generate steam for the turbine",
        "To filter radioactive contaminants from the coolant",
        "To control and maintain pressure in the primary coolant system",
        "To pressurize the containment building during accidents"
      ],
      correctAnswer: 2,
      explanation: "The pressurizer maintains and controls the pressure in the primary coolant system of a PWR. It contains both water and steam phases, with electric heaters that can increase pressure by creating more steam, and spray systems that can decrease pressure by condensing steam. This ensures the primary coolant remains in a liquid state throughout the reactor cooling system despite high temperatures."
    },
    {
      question: "What is the 'reactivity temperature coefficient' in nuclear reactors?",
      options: [
        "The rate at which reactor temperature changes with power",
        "How much reactivity changes with temperature variations",
        "The coefficient used to calculate maximum operating temperature",
        "The temperature at which a reactor becomes critical"
      ],
      correctAnswer: 1,
      explanation: "The reactivity temperature coefficient describes how reactor reactivity changes with temperature variations. A negative coefficient (which is desirable) means reactivity decreases as temperature increases, providing an inherent safety mechanism. This occurs through effects like Doppler broadening in fuel and density changes in the moderator. A negative coefficient helps stabilize reactor operation by counteracting power excursions through natural feedback."
    },
    {
      question: "What is 'fuel shuffling' in nuclear reactors?",
      options: [
        "Mixing different types of fuel in the same assembly",
        "Relocating fuel assemblies to different positions during refueling",
        "The vibration of fuel elements during operation",
        "Transporting spent fuel to reprocessing facilities"
      ],
      correctAnswer: 1,
      explanation: "Fuel shuffling is the practice of relocating fuel assemblies to different positions in the core during refueling outages. Partially burned fuel from high-flux regions is moved to lower-flux regions, while fresh fuel is placed in high-flux regions. This optimizes fuel utilization, flattens power distribution, and extends cycle length by positioning each assembly where its remaining reactivity can be best utilized."
    },
    {
      question: "What is the 'effective delayed neutron fraction' (βeff) in reactor physics?",
      options: [
        "The fraction of neutrons that are delayed versus prompt",
        "The fraction of delayed neutrons that effectively cause fission",
        "The fraction of delayed neutrons weighted by their effectiveness in causing fission",
        "The fraction of time a reactor operates in the delayed critical state"
      ],
      correctAnswer: 2,
      explanation: "The effective delayed neutron fraction (βeff) is the fraction of delayed neutrons weighted by their importance in causing fission compared to prompt neutrons. It's slightly different from the physical delayed neutron fraction because delayed neutrons are typically born at lower energies and therefore have different effectiveness in causing fission. This parameter is crucial for reactor control and safety analysis."
    },
    {
      question: "What is 'subcooled boiling' in a nuclear reactor cooling system?",
      options: [
        "Cooling the reactor below operating temperature during shutdown",
        "Formation of steam bubbles at the heated surface while bulk fluid remains below saturation temperature",
        "Using subcooled water to condense steam in the pressurizer",
        "The cooling process used in spent fuel pools"
      ],
      correctAnswer: 1,
      explanation: "Subcooled boiling occurs when steam bubbles form at heated surfaces (like fuel cladding) while the bulk coolant remains below its saturation temperature. These bubbles may condense when they detach and encounter cooler fluid. This phenomenon is important in thermal-hydraulic analysis because it affects heat transfer coefficients, flow patterns, and potentially reactivity in boiling water reactors."
    },
    {
      question: "What is a 'rod drop accident' in a nuclear reactor?",
      options: [
        "Physical dropping of a fuel rod during handling",
        "Unintentional insertion of a control rod causing power decrease",
        "Unintentional withdrawal or ejection of a control rod causing power excursion",
        "Mechanical failure causing a control rod to drop out of position"
      ],
      correctAnswer: 2,
      explanation: "A rod drop (or rod ejection) accident refers to the unintentional rapid withdrawal or ejection of a control rod, which inserts positive reactivity causing a power excursion. This might result from mechanical failure or control system malfunction. It's one of the design basis accidents analyzed for safety, with acceptance criteria for fuel damage and energy deposition to ensure containment integrity is maintained."
    },
    {
      question: "What is 'neutron fluence' in the context of reactor pressure vessel embrittlement?",
      options: [
        "The rate at which neutrons penetrate the vessel wall",
        "The total number of neutrons that have passed through a unit area over time",
        "The energy of neutrons striking the vessel wall",
        "The ability of neutrons to cause fission in the vessel material"
      ],
      correctAnswer: 1,
      explanation: "Neutron fluence is the time-integrated neutron flux, representing the total number of neutrons that have passed through a unit area over time. In reactor pressure vessels, high-energy neutron fluence causes embrittlement by creating lattice defects that reduce the material's ductility and increase its ductile-to-brittle transition temperature. This is a limiting factor in plant lifetime and is carefully monitored through surveillance programs."
    },
    {
      question: "What is a 'reactivity insertion accident' in a nuclear reactor?",
      options: [
        "Adding too much reactive chemical to the primary coolant",
        "An accident caused by incorrect fuel loading",
        "An event where positive reactivity is added to the core faster than it can be controlled",
        "Inserting too many control rods simultaneously"
      ],
      correctAnswer: 2,
      explanation: "A reactivity insertion accident is an event where positive reactivity is added to the core more rapidly than it can be controlled by normal means, potentially leading to a power excursion. Causes might include control rod withdrawal errors, boron dilution, cold water injection, or control rod ejection. These accidents are analyzed in safety assessments to ensure protective systems can mitigate consequences."
    },
    {
      question: "What is 'departure from nucleate boiling' (DNB) in a nuclear reactor?",
      options: [
        "The transition from single-phase to two-phase flow in the core",
        "When steam bubbles merge to form an insulating film on fuel rods, reducing heat transfer",
        "The point when boiling begins in a PWR pressure vessel",
        "When coolant flow reverses direction due to steam formation"
      ],
      correctAnswer: 1,
      explanation: "Departure from Nucleate Boiling (DNB) is a heat transfer phenomenon where steam bubbles on a heated surface (fuel cladding) coalesce to form an insulating vapor film, drastically reducing heat transfer efficiency. This can lead to a rapid increase in cladding temperature and potential fuel damage. The DNBR (DNB Ratio) is a critical safety parameter that indicates the margin to this condition."
    },
    {
      question: "What is the purpose of a 'post-accident sampling system' in a nuclear power plant?",
      options: [
        "To monitor environmental radiation after an accident",
        "To determine the extent of core damage and radioactive content in plant fluids",
        "To test the structural integrity of components after an accident",
        "To sample soil and water near the plant after a radiation release"
      ],
      correctAnswer: 1,
      explanation: "A post-accident sampling system allows operators to safely obtain and analyze samples of reactor coolant and containment atmosphere following an accident. The samples help determine the extent of core damage, radionuclide concentrations, and chemical conditions, which guide accident management strategies and public protective actions. These systems are designed to function in high radiation environments with minimal personnel exposure."
    },
    {
      question: "What is 'decay heat' in nuclear reactors?",
      options: [
        "Heat generated by the decomposition of reactor structural materials",
        "Heat released by radioactive decay of fission products after shutdown",
        "The gradual reduction in reactor temperature during cooldown",
        "Heat lost to the environment during normal operation"
      ],
      correctAnswer: 1,
      explanation: "Decay heat is the heat produced by the radioactive decay of fission products after a reactor is shut down. Even though the fission chain reaction has stopped, this decay continues to generate significant heat (initially about 7% of full power, decreasing over time). Removing decay heat is a critical safety function, as failure to do so can lead to core damage, as demonstrated in accidents like Fukushima."
    },
    {
      question: "What is 'reactivity feedback' in nuclear reactors?",
      options: [
        "The process of measuring reactivity changes using instrument feedback",
        "Reports from operators about reactor response to control inputs",
        "Automatic changes in reactivity due to changes in operating conditions",
        "The time delay between control rod movement and power change"
      ],
      correctAnswer: 2,
      explanation: "Reactivity feedback refers to automatic changes in reactivity resulting from changes in operating conditions like temperature, pressure, or void fraction. Negative feedback mechanisms (like Doppler broadening and moderator temperature effects) are crucial for reactor stability and safety, as they tend to counteract power increases. Positive feedback mechanisms, if dominant, can make a reactor unstable."
    },
    {
      question: "What is 'steam binding' in emergency core cooling systems?",
      options: [
        "The binding of steam generator tubes by excessive steam pressure",
        "Formation of steam that prevents coolant from reaching the core",
        "A design feature that uses steam to drive emergency cooling pumps",
        "The condition where steam mixes with emergency coolant"
      ],
      correctAnswer: 1,
      explanation: "Steam binding is a phenomenon where steam forms in the upper regions of a reactor cooling system and prevents liquid coolant from reaching the core. This can occur during certain accident scenarios when emergency core cooling water comes into contact with hot surfaces and flashes to steam. Steam binding can significantly reduce the effectiveness of emergency cooling systems and is an important consideration in safety analyses."
    },
    {
      question: "What is a 'station blackout' in a nuclear power plant?",
      options: [
        "A total loss of AC power to the station, including offsite power and emergency generators",
        "A deliberate shutdown of all electrical systems for maintenance",
        "An unplanned reactor trip that causes a regional power blackout",
        "A loss of lighting in the control room and emergency facilities"
      ],
      correctAnswer: 0,
      explanation: "A station blackout (SBO) is the complete loss of both offsite AC power and emergency onsite AC power (backup diesel generators). This is a serious condition as many critical safety systems rely on AC power. Plants have coping strategies for SBO including battery-powered DC systems, alternate AC sources, and passive cooling methods. The Fukushima accident in 2011 demonstrated the severe consequences of an extended station blackout."
    },
    {
      question: "What is the 'point kinetics equation' used for in nuclear engineering?",
      options: [
        "Calculating the critical point of nuclear fuel",
        "Determining the exact location of neutron generation",
        "Modeling the time-dependent behavior of reactor power",
        "Computing the kinetic energy of fission fragments"
      ],
      correctAnswer: 2,
      explanation: "The point kinetics equation is a simplified mathematical model that describes the time-dependent behavior of reactor power in response to reactivity changes. It treats the reactor as a 'point' (spatially uniform) and accounts for both prompt and delayed neutrons. While it neglects spatial effects, it provides reasonably accurate results for many transients and is widely used in reactor control system design and safety analyses."
    },
    {
      question: "What is the 'hot channel factor' in nuclear reactor thermal design?",
      options: [
        "The temperature of the hottest coolant channel in the reactor",
        "A measure of how much hotter the most severely heated channel is compared to the average",
        "The ratio of hot to cold leg temperatures",
        "The factor used to calculate the heat capacity of a heated channel"
      ],
      correctAnswer: 1,
      explanation: "The hot channel factor (or peaking factor) is a measure of how much hotter the most severely heated fuel channel is compared to the core average. It accounts for manufacturing tolerances, operational variations, and design uncertainties. Nuclear plants maintain margins to safety limits by ensuring that even the hot channel remains below critical heat flux conditions during normal operation and anticipated operational occurrences."
    },
    {
      question: "What is 'reflector peak' in a nuclear reactor?",
      options: [
        "The point of maximum neutron reflection in the core",
        "A power spike caused by control rod movement",
        "The increased neutron flux near the interface between the core and reflector",
        "The peak temperature in the reflector material"
      ],
      correctAnswer: 2,
      explanation: "The reflector peak is a localized increase in neutron flux (and power density) that occurs near the interface between the reactor core and the reflector. It happens because neutrons that would otherwise escape are reflected back into the core, causing higher reaction rates in fuel elements near the boundary. This phenomenon must be accounted for in power distribution calculations and thermal margin assessments."
    },
    {
      question: "What is the 'source term' in nuclear accident analysis?",
      options: [
        "The initial neutron source strength required for reactor startup",
        "The location where the accident originated within the plant",
        "The amount and isotopic composition of radioactive material released to the environment",
        "The mathematical term in the neutron diffusion equation that represents the source"
      ],
      correctAnswer: 2,
      explanation: "In nuclear accident analysis, the 'source term' refers to the amount, type, and timing of radioactive material released to the environment during an accident. It includes information about radionuclide composition, release rates, chemical forms, particle sizes, and release pathways. The source term is a crucial input for assessing potential radiation doses and environmental impacts."
    },
    {
      question: "What is meant by 'subcooled boiling' in thermal hydraulics?",
      options: [
        "Water that is below its boiling point but still evaporating due to pressure reduction",
        "Localized boiling at heated surfaces while the bulk fluid remains below saturation temperature",
        "A cooling technique to keep water below its boiling point during upset conditions",
        "The condensation of steam when it encounters surfaces below the saturation temperature"
      ],
      correctAnswer: 1,
      explanation: "Subcooled boiling occurs when the heat flux at a surface is high enough to form vapor bubbles locally, even though the bulk fluid temperature is below its saturation point. This phenomenon is important in PWR cores, where nucleate boiling enhances heat transfer without developing into film boiling, which would reduce heat transfer efficiency and potentially lead to fuel damage."
    },
    {
      question: "What is the 'prompt jump approximation' in reactor kinetics?",
      options: [
        "The assumption that prompt neutrons equilibrate instantly after a reactivity change",
        "A method for estimating reactor power during a positive reactivity insertion",
        "The immediate power increase following control rod ejection",
        "A technique for measuring prompt neutron lifetime"
      ],
      correctAnswer: 0,
      explanation: "The prompt jump approximation is a simplification used in reactor kinetics that assumes prompt neutrons reach equilibrium instantly after a reactivity change (compared to the longer timescale of delayed neutron precursors). This allows the separation of fast and slow response components, simplifying the solution of reactor kinetics equations for reactivity changes below prompt criticality."
    },
    {
      question: "What is a 'decay ratio' in boiling water reactor stability analysis?",
      options: [
        "The ratio of decayed isotopes to original isotopes after shutdown",
        "The fraction of power generated by decay heat versus fission",
        "The ratio of successive amplitude peaks in power oscillations",
        "The proportion of neutrons that decay before causing fission"
      ],
      correctAnswer: 2,
      explanation: "In BWR stability analysis, the decay ratio is the ratio of successive amplitude peaks in power oscillations. A decay ratio less than 1.0 indicates damped oscillations that will eventually die out (stable), while a decay ratio greater than 1.0 indicates divergent oscillations (unstable). Regulatory guidelines typically require BWRs to operate with sufficient margin to instability, with decay ratios below 0.8."
    }
  ],
  advanced: [
    {
      question: "What phenomenon caused the positive reactivity excursion in the Chernobyl accident?",
      options: [
        "Control rod ejection",
        "Steam explosion",
        "Positive void coefficient combined with positive graphite coefficient",
        "Loss of external power supply"
      ],
      correctAnswer: 2,
      explanation: "The Chernobyl accident was primarily caused by the RBMK reactor's positive void coefficient combined with a positive graphite coefficient. As coolant water vaporized, it increased reactivity rather than decreasing it. When control rods with graphite tips were inserted from fully withdrawn positions, they initially displaced water with graphite (a better moderator), temporarily increasing reactivity before the absorber sections entered the core - a design flaw called the 'positive scram effect'."
    },
    {
      question: "Which of the following best describes the concept of 'defense in depth' in nuclear safety?",
      options: [
        "Using multiple armed security personnel at nuclear facilities",
        "Constructing reactors underground for physical protection",
        "Implementing multiple independent safety systems and barriers",
        "Developing detailed emergency response procedures"
      ],
      correctAnswer: 2,
      explanation: "Defense in depth is a fundamental nuclear safety principle that involves implementing multiple independent and redundant layers of protection, so if one layer fails, others remain effective. These include physical barriers (fuel cladding, pressure vessel, containment) and diverse safety systems. The concept recognizes that no single safety feature should be relied upon exclusively."
    },
    {
      question: "What is the 'fuel burn-up' in a nuclear reactor?",
      options: [
        "The temperature at which nuclear fuel melts",
        "The point at which fuel rods catch fire",
        "The measure of energy extracted from nuclear fuel",
        "The rate at which fuel is consumed"
      ],
      correctAnswer: 2,
      explanation: "Fuel burn-up is a measure of the energy extracted from nuclear fuel, typically expressed in gigawatt-days per metric ton of uranium (GWd/tU). It represents how much of the original fissile material has been 'burned' through nuclear reactions. Higher burn-up means more efficient fuel utilization but also leads to greater fuel cladding stress and fission product inventory."
    },
    {
      question: "Which neutron energy range is most effective for causing fission in U-235?",
      options: [
        "Fast neutrons (>1 MeV)",
        "Epithermal neutrons (1 eV - 1 MeV)",
        "Thermal neutrons (<0.025 eV)",
        "The fission cross-section is the same for all energies"
      ],
      correctAnswer: 2,
      explanation: "Thermal neutrons (<0.025 eV, corresponding to room temperature) are most effective at causing fission in U-235. The fission cross-section for U-235 is much higher (about 500 barns) for thermal neutrons than for fast neutrons (about 1-2 barns). This is why most commercial reactors use moderators to thermalize neutrons."
    },
    {
      question: "What is the main purpose of the containment building in a nuclear power plant?",
      options: [
        "To shield operators from radiation during normal operation",
        "To house the turbine and electrical generation equipment",
        "To contain radioactive materials in case of an accident",
        "To provide structural support for the reactor vessel"
      ],
      correctAnswer: 2,
      explanation: "The primary purpose of the containment building is to prevent the release of radioactive materials to the environment in case of an accident. Modern containments are designed to withstand internal pressures from steam releases, contain radioactive materials, shield against radiation, and sometimes provide protection against external hazards like aircraft impacts."
    },
    {
      question: "What is the main difference between deterministic and probabilistic safety analyses in nuclear engineering?",
      options: [
        "Deterministic analyses consider worst-case scenarios, while probabilistic analyses assess the likelihood of different accident sequences",
        "Deterministic analyses are for research reactors, probabilistic for power reactors",
        "Deterministic analyses use computer models, probabilistic rely on operational experience",
        "Deterministic analyses are conducted before construction, probabilistic during operation"
      ],
      correctAnswer: 0,
      explanation: "Deterministic safety analyses examine specific accident scenarios (often worst-case) to ensure safety systems can prevent or mitigate consequences, regardless of probability. Probabilistic safety analyses (PSA) quantify the likelihood of different accident sequences and their consequences, identifying risk contributors. Modern safety approaches use both: deterministic to ensure adequate safety margins and probabilistic to optimize safety resources toward the most significant risks."
    },
    {
      question: "What is meant by 'breeding ratio' in breeder reactors?",
      options: [
        "The ratio of thermal to fast neutrons",
        "The ratio of new fissile material produced to fissile material consumed",
        "The ratio of energy output to energy input",
        "The ratio of fissions caused by delayed versus prompt neutrons"
      ],
      correctAnswer: 1,
      explanation: "The breeding ratio is the ratio of new fissile material produced (through conversion of fertile material like U-238 to Pu-239) to fissile material consumed in the reactor. A breeding ratio greater than 1 means the reactor produces more fissile material than it consumes, theoretically enabling a sustainable fuel cycle with improved uranium resource utilization."
    },
    {
      question: "Which of the following best explains the concept of 'negative temperature coefficient' in reactor design?",
      options: [
        "The reactor becomes less efficient as temperature increases",
        "The reactor produces less power as temperature increases",
        "Reactivity decreases as fuel and moderator temperature increase",
        "The control system reduces power when temperature rises too high"
      ],
      correctAnswer: 2,
      explanation: "A negative temperature coefficient means that as reactor temperature increases, reactivity decreases automatically. This provides inherent safety and stability, as any unintended temperature rise (from excess power) causes a reduction in reactivity that counteracts the original disturbance. It comes from physical effects like Doppler broadening in fuel and density reduction in moderators."
    },
    {
      question: "What is the primary reason for using heavy water (D₂O) instead of light water (H₂O) in some reactor designs?",
      options: [
        "To achieve higher power density",
        "To use natural uranium without enrichment",
        "To increase thermal efficiency",
        "To reduce radioactive waste production"
      ],
      correctAnswer: 1,
      explanation: "Heavy water is primarily used because it has a much lower neutron absorption cross-section than light water, allowing reactors to achieve criticality with natural uranium (0.7% U-235) without enrichment. Light water reactors require enriched uranium (3-5% U-235) because ordinary hydrogen absorbs too many neutrons. This design choice was particularly important for countries that lacked uranium enrichment technology."
    },
    {
      question: "In a nuclear power plant, what is the purpose of the pressurizer in a PWR system?",
      options: [
        "To increase the efficiency of heat transfer to the steam generators",
        "To pressurize the containment building during accidents",
        "To maintain primary coolant pressure and compensate for volume changes",
        "To increase the boiling point of the secondary coolant"
      ],
      correctAnswer: 2,
      explanation: "The pressurizer maintains primary coolant pressure and compensates for volume changes in a PWR. It contains both water and steam phases in equilibrium, with heaters and spray systems to raise or lower pressure as needed. This ensures the primary coolant remains liquid throughout the system despite temperature changes, preventing boiling in the core while allowing efficient heat transfer to the secondary system."
    },
    {
      question: "What is xenon poisoning in nuclear reactors?",
      options: [
        "Physical damage to fuel rods from xenon gas buildup",
        "Temporary decrease in reactor power due to xenon-135 absorption of neutrons",
        "Radiation sickness in operators exposed to xenon isotopes",
        "Corrosion of primary coolant system components by xenon"
      ],
      correctAnswer: 1,
      explanation: "Xenon poisoning refers to the buildup of xenon-135, which has an extremely high neutron absorption cross-section, in an operating reactor. After a power reduction, xenon-135 (produced from iodine-135 decay) continues to accumulate, causing a temporary decrease in reactivity that can make restart difficult for several hours. This phenomenon complicates load-following operations and played a role in the Chernobyl accident."
    },
    {
      question: "What is the principle behind the operation of a Sodium-cooled Fast Reactor (SFR)?",
      options: [
        "Using sodium as a moderator to slow down neutrons",
        "Utilizing fast neutrons for fission and liquid sodium as coolant",
        "Heating sodium to very high temperatures to improve thermal efficiency",
        "Generating hydrogen through sodium-water reactions"
      ],
      correctAnswer: 1,
      explanation: "Sodium-cooled Fast Reactors (SFRs) utilize fast neutrons without moderation for the fission chain reaction, while using liquid sodium as the coolant. Sodium's excellent heat transfer properties allow efficient cooling without slowing neutrons. These reactors can breed new fuel and potentially transmute long-lived waste, but present challenges including sodium's chemical reactivity with water and air."
    },
    {
      question: "What is the purpose of a spent fuel pool at a nuclear power plant?",
      options: [
        "To clean and refurbish used fuel for reinsertion",
        "To store and cool spent fuel assemblies after removal from the reactor",
        "To extract remaining uranium from used fuel",
        "To dilute radioactive materials before disposal"
      ],
      correctAnswer: 1,
      explanation: "Spent fuel pools store and cool fuel assemblies after they're removed from the reactor. The water provides both cooling (removing decay heat) and radiation shielding. Typically, fuel remains in these pools for at least 5-10 years before potential transfer to dry cask storage. The pools are designed with multiple cooling systems, radiation monitoring, and are typically housed in robust structures."
    },
    {
      question: "What is the significance of the 'iodine pit' in reactor operation?",
      options: [
        "A corrosion problem caused by iodine isotopes in the primary coolant",
        "A depression in reactivity occurring approximately 9 hours after shutdown",
        "A facility for capturing radioactive iodine released during accidents",
        "The location where iodine filters are installed in the ventilation system"
      ],
      correctAnswer: 1,
      explanation: "The iodine pit refers to a period of minimum reactivity occurring about 9 hours after reactor shutdown, caused by the decay of iodine-135 into xenon-135 (a strong neutron absorber). While iodine-135 decays (half-life ~6.7 hours), xenon-135 continues to build up faster than it decays (half-life ~9.2 hours) until reaching equilibrium. This can prevent reactor restart for several hours after shutdown."
    },
    {
      question: "What are 'passive safety systems' in advanced nuclear reactor designs?",
      options: [
        "Systems that only activate during passive operation modes",
        "Safety systems that operate without operator intervention or active components",
        "Backup systems that remain passive until emergency situations",
        "Simplified safety systems that require less maintenance"
      ],
      correctAnswer: 1,
      explanation: "Passive safety systems are designed to function without operator intervention, AC power, or active components like pumps. They rely on natural forces such as gravity, natural circulation, convection, or stored energy in batteries or compressed gases. These systems can provide cooling, pressure control, or containment functions during accidents, enhancing plant safety by reducing reliance on human actions and active components that could fail."
    },
    {
      question: "What is 'flow-induced vibration' in nuclear reactor components?",
      options: [
        "Vibration of control rods when coolant flow adjusts reactor power",
        "Mechanical vibration caused by coolant flow across or along structural components",
        "A technique used to test coolant flow patterns during startup",
        "Vibration of fuel assemblies that improves neutron moderation"
      ],
      correctAnswer: 1,
      explanation: "Flow-induced vibration is a mechanical vibration caused by coolant flow across or along structural components in the reactor. It can result from fluid-elastic instability, vortex shedding, turbulent buffeting, or acoustic resonance. If not properly managed, it can lead to fatigue failure of components such as steam generator tubes, fuel rods, or in-core instrumentation. Advanced analysis and testing are performed to prevent such failures."
    },
    {
      question: "What is a 'large break LOCA' in nuclear safety analysis?",
      options: [
        "Rupture of a large spent fuel container",
        "Complete severance of a main coolant pipe",
        "Major breach in the containment building",
        "Failure of a large safety valve"
      ],
      correctAnswer: 1,
      explanation: "A large break Loss-Of-Coolant Accident (LOCA) refers to a complete severance or equivalent major rupture of a primary coolant pipe, resulting in rapid loss of coolant inventory. This design basis accident causes rapid depressurization, coolant flashing to steam, and potential core uncovery within seconds. Emergency Core Cooling Systems must activate quickly to prevent fuel damage. It's one of the most challenging accidents from a thermal-hydraulic perspective."
    },
    {
      question: "What is the 'thermal margin' in nuclear reactor operation?",
      options: [
        "The temperature difference between the coolant and its boiling point",
        "The reserve capacity of the cooling system beyond normal needs",
        "The distance between operating parameters and safety limits",
        "The minimum temperature that must be maintained to prevent embrittlement"
      ],
      correctAnswer: 2,
      explanation: "Thermal margin refers to the distance between actual operating parameters and safety limits established to prevent fuel damage. Parameters like Departure from Nucleate Boiling Ratio (DNBR) or Critical Power Ratio (CPR) quantify this margin. Maintaining adequate thermal margin ensures that even during transients or accidents, the core remains sufficiently cooled and fuel integrity is preserved. This margin is continuously monitored during operation."
    },
    {
      question: "What is 'anticipated transient without scram' (ATWS) in nuclear safety?",
      options: [
        "A normal operational transient that doesn't require shutdown",
        "An expected power fluctuation that stabilizes without intervention",
        "An anticipated operational occurrence combined with failure of the reactor protection system",
        "A transient caused by withdrawal of control rods"
      ],
      correctAnswer: 2,
      explanation: "Anticipated Transient Without Scram (ATWS) refers to an expected operational occurrence (like loss of feedwater, load rejection, etc.) combined with a failure of the reactor protection system to automatically shut down the reactor. This beyond-design-basis event could lead to serious consequences, prompting regulatory requirements for diverse protection systems and analyses demonstrating acceptable outcomes even without immediate scram."
    },
    {
      question: "What is the 'alpha-to-beta transformation' in uranium fuel?",
      options: [
        "The change from alpha particles to beta particles during radioactive decay",
        "A crystalline phase transformation that occurs at high temperatures",
        "The conversion of uranium oxide to uranium metal in fuel processing",
        "The transformation from alpha emitters to beta emitters in spent fuel"
      ],
      correctAnswer: 1,
      explanation: "The alpha-to-beta transformation is a crystalline phase change in uranium metal from the orthorhombic alpha phase to the tetragonal beta phase, occurring at about 668°C. This transformation involves a significant volume change and anisotropic growth that can cause distortion and cracking in uranium metal fuel. This limitation led to the adoption of uranium dioxide (UO₂) as the preferred fuel form for most commercial reactors."
    },
    {
      question: "What is 'crud' in the context of nuclear reactor operation?",
      options: [
        "Carbon residue from decomposed lubricating oils",
        "Corrosion products that circulate in the primary coolant and deposit on fuel surfaces",
        "Control rod unintended drop events",
        "Contaminated reactor undercooling deposits"
      ],
      correctAnswer: 1,
      explanation: "In nuclear engineering, 'crud' (sometimes explained as Chalk River Unidentified Deposits, after their first observation) refers to corrosion products that circulate in the primary coolant and deposit on fuel cladding surfaces. These deposits can affect heat transfer, cause localized corrosion, become activated in the neutron flux creating additional radiation sources, and potentially contribute to axial power shifts during operation (crud-induced power shift or CIPS)."
    },
    {
      question: "What is a 'multigroup approximation' in neutron transport theory?",
      options: [
        "Dividing reactor operations staff into multiple specialized groups",
        "Categorizing nuclear accidents into different severity groups",
        "Dividing the continuous neutron energy spectrum into discrete energy groups",
        "Analyzing multiple groups of fission products separately"
      ],
      correctAnswer: 2,
      explanation: "The multigroup approximation in neutron transport theory involves dividing the continuous neutron energy spectrum into discrete energy groups, with average nuclear properties defined for each group. This transforms the continuous-energy transport equation into a set of coupled equations for each energy group. The approximation makes complex neutron transport problems computationally tractable while still capturing the essential physics of neutron slowing down and interactions."
    },
    {
      question: "What is 'Critical Heat Flux' (CHF) in nuclear thermal hydraulics?",
      options: [
        "The minimum heat flux needed to initiate nuclear fission",
        "The heat flux at which fuel pellets begin to melt",
        "The heat flux that initiates boiling in the coolant",
        "The heat flux beyond which there is a sudden deterioration in heat transfer efficiency"
      ],
      correctAnswer: 3,
      explanation: "Critical Heat Flux (CHF) represents the thermal limit beyond which there is a sudden deterioration in heat transfer efficiency due to the transition from nucleate boiling to film boiling. When this occurs on fuel rod surfaces, cladding temperatures can rise rapidly (departure from nucleate boiling in PWRs or dryout in BWRs), potentially leading to fuel damage. Maintaining margin to CHF is a fundamental safety requirement in reactor design and operation."
    },
    {
      question: "What is a 'Regional Overpower Protection' system in CANDU reactors?",
      options: [
        "A system that limits power in specific geographic regions of the electrical grid",
        "An emergency power reduction system that affects only one region of the core",
        "A protection system using in-core detectors to prevent localized power excursions",
        "A backup power supply system for different regions of the plant"
      ],
      correctAnswer: 2,
      explanation: "Regional Overpower Protection (ROP) is a safety system in CANDU reactors that uses in-core detectors to monitor and protect against localized power excursions that could lead to fuel damage. The core is divided into zones with dedicated detectors, and the system will trigger a reactor trip if power in any zone exceeds safety limits. This is particularly important in large cores where power distribution can vary significantly across different regions."
    },
    {
      question: "What is 'plutonium high burning' reactor concept?",
      options: [
        "A reactor designed to produce high-grade weapons plutonium",
        "A reactor that burns highly enriched plutonium fuel",
        "A reactor designed to maximize plutonium consumption rather than breeding",
        "A high-temperature reactor that burns plutonium more efficiently"
      ],
      correctAnswer: 2,
      explanation: "Plutonium high burning (or high consumption) reactor concepts aim to maximize plutonium consumption rather than breeding more plutonium. These designs typically use fuel configurations and neutron spectra that favor fission over capture in plutonium isotopes, reducing the net plutonium inventory. Such concepts are of interest for plutonium disposition programs and can contribute to reducing stockpiles of weapons-grade plutonium."
    },
    {
      question: "What is the 'neutron wave' concept in advanced reactor designs?",
      options: [
        "A wave of neutron density that travels through the core during power changes",
        "A standing wave pattern of neutron flux in the moderator",
        "A traveling wave of breeding and burning that moves through the fuel over time",
        "A neutron pulse technique used to measure reactor kinetics"
      ],
      correctAnswer: 2,
      explanation: "The neutron wave concept (or traveling wave reactor) involves a wave of breeding and burning that slowly moves through the fuel over time. Starting with a small active region of fissile material surrounded by fertile material (like U-238), the neutrons breed new fuel (Pu-239) just ahead of the burning region, creating a self-sustaining wave that gradually progresses through the core over many years, potentially allowing decades of operation without refueling."
    },
    {
      question: "What is 'temperature limited operation' in nuclear reactors?",
      options: [
        "Operating a reactor at reduced power during high ambient temperatures",
        "A mode where reactor power is automatically controlled based on temperature feedback",
        "Operation limited by specific component temperature constraints",
        "An emergency cooling mode activated at high temperature conditions"
      ],
      correctAnswer: 2,
      explanation: "Temperature limited operation refers to reactor operation where specific component temperature limits become the constraining factor for power output. This might involve fuel centerline temperature, cladding temperature, coolant temperature, or pressure vessel temperature limits. Rather than being limited by neutronics or thermal-hydraulic margins, the plant cannot operate at higher power without exceeding temperature limits on critical components."
    },
    {
      question: "What is 'differential worth curve' for control rods?",
      options: [
        "The difference in monetary value between different types of control rods",
        "The differential equation describing control rod motion",
        "A curve showing how control rod reactivity worth varies with insertion position",
        "The change in rod worth as a function of burnup"
      ],
      correctAnswer: 2,
      explanation: "A differential worth curve shows how a control rod's reactivity worth (expressed as reactivity per unit length) varies with its position in the core. The worth is typically highest near the core center where neutron flux is greatest and decreases toward the periphery. This curve is crucial for reactor operation, as it determines how sensitively the reactor will respond to control rod movements at different insertion depths."
    },
    {
      question: "What is the primary function of a core catcher in advanced reactor designs?",
      options: [
        "To catch dropped fuel assemblies during refueling operations",
        "To contain and cool molten corium in case of a severe accident",
        "To collect debris that might block coolant channels",
        "To support the weight of the reactor core"
      ],
      correctAnswer: 1,
      explanation: "A core catcher is a safety feature in advanced reactor designs designed to contain, spread, and cool molten core material (corium) in the event of a severe accident with reactor pressure vessel failure. By preventing corium-concrete interaction and ensuring coolability, it helps prevent containment breach and significant radioactive release. This feature has been implemented in designs like the EPR and VVER-1200."
    },
    {
      question: "In LOCA analysis for nuclear plants, what does the term 'PCT' stand for and why is it important?",
      options: [
        "Primary Coolant Temperature - the operating temperature of the coolant",
        "Peak Cladding Temperature - the maximum temperature reached by fuel cladding",
        "Pressure Containment Test - a pre-operational test of the containment",
        "Planned Cooling Time - the scheduled duration of refueling outages"
      ],
      correctAnswer: 1,
      explanation: "PCT stands for Peak Cladding Temperature, which is the highest temperature reached by the fuel cladding during a Loss-of-Coolant Accident (LOCA). It's a critical safety parameter with regulatory limits (typically 1204°C/2200°F in the US) to prevent excessive cladding oxidation, embrittlement, and potential failure. Demonstration that PCT remains below limits is essential for licensing and safety analysis."
    },
    {
      question: "What is the difference between 'safety-related' and 'non-safety-related' systems in nuclear power plants?",
      options: [
        "Safety-related systems are operated by licensed operators, non-safety-related systems by technicians",
        "Safety-related systems are designed to prevent accidents, non-safety-related systems to mitigate consequences",
        "Safety-related systems are subject to stringent quality assurance requirements and regulatory oversight",
        "Safety-related systems are inside containment, non-safety-related systems are outside"
      ],
      correctAnswer: 2,
      explanation: "Safety-related systems are those essential for safely shutting down the reactor, maintaining it in a safe shutdown condition, or preventing/mitigating accident consequences. They are subject to stringent quality assurance requirements, environmental qualification, redundancy criteria, and regular testing. Non-safety-related systems, while important for operation, do not require the same level of regulatory oversight or design requirements."
    },
    {
      question: "What is the 'decay heat fraction' in a nuclear reactor and why is it important?",
      options: [
        "The percentage of heat generated by radioactive decay rather than fission after shutdown",
        "The percentage of heat lost through containment structures",
        "The percentage of fuel that decays during normal operation",
        "The percentage of radioactive isotopes that produce heat during decay"
      ],
      correctAnswer: 0,
      explanation: "The decay heat fraction is the percentage of the reactor's rated thermal power that continues to be generated after shutdown due to radioactive decay of fission products. Immediately after shutdown, decay heat is typically about 7% of full power, decreasing to about 1% after an hour and 0.5% after a day. Managing this decay heat is crucial for preventing fuel damage following shutdown, as demonstrated by accidents like Fukushima."
    },
    {
      question: "What distinguishes a Molten Salt Reactor (MSR) from conventional solid-fuel reactors?",
      options: [
        "It operates at much higher temperatures",
        "It uses liquid fuel dissolved in a molten salt coolant",
        "It requires highly enriched uranium fuel",
        "It uses multiple small modular cores instead of one large core"
      ],
      correctAnswer: 1,
      explanation: "The defining characteristic of a Molten Salt Reactor (MSR) is the use of liquid fuel dissolved in a molten salt mixture that serves as both fuel medium and primary coolant. This contrasts with conventional reactors using solid fuel elements. MSRs offer potential advantages including online refueling, atmospheric pressure operation, inherent passive safety features, and potential for thorium fuel cycle implementation."
    },
    {
      question: "What is 'reactivity insertion rate' and why is it limited in reactor designs?",
      options: [
        "The speed at which new fuel is added during refueling operations",
        "The rate at which positive reactivity can be added to the core by control systems",
        "The rate at which reactor power increases during startup",
        "The rate at which xenon builds up after shutdown"
      ],
      correctAnswer: 1,
      explanation: "Reactivity insertion rate is the rate at which positive reactivity can be added to the reactor by control systems (primarily control rod withdrawal). It is strictly limited in reactor designs and operating procedures to ensure that any power increases occur slowly enough for negative temperature feedback to counteract the increase and for safety systems to respond if needed. Excessive reactivity insertion rates contributed to accidents like Chernobyl and SL-1."
    },
    {
      question: "What is a 'Station Blackout' (SBO) in nuclear power plants?",
      options: [
        "A deliberate shutdown of all station equipment for maintenance",
        "Loss of all AC power including both offsite power and emergency diesel generators",
        "A complete failure of the instrumentation and control systems",
        "The blocking of cooling water intakes by debris or ice"
      ],
      correctAnswer: 1,
      explanation: "A Station Blackout (SBO) is the complete loss of both offsite AC power and emergency onsite AC power (typically from diesel generators). This condition leaves only battery-powered DC systems operational for a limited time. SBO is a significant safety concern as it compromises cooling systems, and was a key factor in the Fukushima accident. Modern plants have additional measures like backup generators and passive cooling systems to mitigate SBO consequences."
    },
    {
      question: "What is 'anticipated transient without scram' (ATWS)?",
      options: [
        "A planned reactor shutdown without using control rods",
        "A predicted operational occurrence with failure of the reactor protection system",
        "A reactor startup without neutron source installation",
        "A power reduction sequence that doesn't trigger safety systems"
      ],
      correctAnswer: 1,
      explanation: "Anticipated Transient Without Scram (ATWS) refers to an expected operational occurrence (like loss of feedwater or load rejection) combined with a failure of the reactor protection system to automatically shut down (scram) the reactor. This scenario is considered in safety analyses because it can lead to more severe consequences than anticipated transients with successful scram. Special ATWS mitigation systems are required in many reactor designs."
    },
    {
      question: "What is the difference between 'best-estimate' and 'conservative' approaches in safety analysis?",
      options: [
        "Best-estimate uses average values while conservative uses worst-case values",
        "Best-estimate uses computerized models while conservative uses manual calculations",
        "Best-estimate uses realistic models with uncertainty quantification, while conservative uses deliberate pessimistic assumptions",
        "Best-estimate is used for new designs while conservative is used for existing plants"
      ],
      correctAnswer: 2,
      explanation: "Best-estimate approaches use realistic physical models and input parameters, coupled with uncertainty quantification to establish confidence levels in the results. Conservative approaches deliberately use pessimistic assumptions and models that overestimate adverse consequences. Modern safety analysis often employs best-estimate plus uncertainty (BEPU) methodology, which provides more realistic assessments while maintaining appropriate safety margins."
    },
    {
      question: "What is meant by 'diversity and defense-in-depth' in nuclear safety?",
      options: [
        "Using multiple identical safety systems in different locations within the plant",
        "Training staff from diverse backgrounds and providing multi-layer management",
        "Using different technologies and multiple independent barriers to prevent accidents and mitigate consequences",
        "Diversifying nuclear fuel suppliers and maintaining depth in spent fuel storage"
      ],
      correctAnswer: 2,
      explanation: "Diversity and defense-in-depth involve using different technologies (diversity) and multiple independent barriers and systems (defense-in-depth) to prevent accidents and mitigate consequences. Diversity helps prevent common-cause failures, while defense-in-depth ensures that multiple barriers must fail before significant consequences occur. This approach includes physical barriers (fuel, cladding, vessel, containment) and diverse safety systems with redundancy."
    }
  ],
  expert: [
    {
      question: "What is the significance of the 1/v law in neutron absorption cross-sections?",
      options: [
        "Cross-sections are proportional to neutron velocity",
        "Cross-sections are inversely proportional to neutron velocity",
        "Cross-sections are proportional to the square root of neutron energy",
        "Cross-sections oscillate with changing neutron velocity"
      ],
      correctAnswer: 1,
      explanation: "The 1/v law states that for many nuclides, neutron absorption cross-sections are inversely proportional to neutron velocity (or equivalently, inversely proportional to the square root of energy). This is why thermal neutrons (slower) have higher absorption probabilities than fast neutrons for many isotopes, including key absorbers like B-10, which follows this law closely over a wide energy range."
    },
    {
      question: "What is the 'point of adding heat' (POAH) in a nuclear reactor startup?",
      options: [
        "The power level at which measurable heat output begins",
        "The point at which operators must switch from nuclear to thermal instruments",
        "The power level where negative temperature coefficients become effective",
        "The temperature at which water begins to boil in the core"
      ],
      correctAnswer: 2,
      explanation: "The Point of Adding Heat (POAH) is the power level at which the reactor's negative temperature coefficients become effective in reactor control. Below this point, changes in reactivity primarily depend on control rod positioning, while above it, temperature feedback effects become increasingly important. This transition point is significant during reactor startup and is typically in the range of 10⁻⁴% to 10⁻³% of rated power."
    },
    {
      question: "What is a 'Watt fission spectrum' in nuclear physics?",
      options: [
        "The energy distribution of neutrons emitted during nuclear fission",
        "The power density distribution in a reactor named after James Watt",
        "The heat transfer coefficient spectrum in steam generators",
        "The frequency distribution of fission events in a given time period"
      ],
      correctAnswer: 0,
      explanation: "The Watt fission spectrum is a mathematical representation of the energy distribution of neutrons emitted during nuclear fission. Named after physicist Eugene Watt, it describes the probability of neutrons being emitted with various energies. This spectrum is crucial for reactor physics calculations, shielding design, and criticality safety analyses, as the energy of neutrons greatly affects their interaction probabilities with different materials."
    },
    {
      question: "What are 'Dancoff factors' in nuclear engineering calculations?",
      options: [
        "Correction factors for shadow effects between fuel lumps in lattice calculations",
        "Parameters used to calculate thermal hydraulic performance",
        "Scaling factors for radiation detector efficiency",
        "Constants used in neutron diffusion approximations"
      ],
      correctAnswer: 0,
      explanation: "Dancoff factors are correction factors that account for the shadowing or self-shielding effects between neighboring fuel elements in a reactor lattice. They quantify how neutrons that leave one fuel element may enter another without passing through the moderator, which affects resonance absorption calculations. Accurate Dancoff factors are important for precise determination of resonance escape probability and effective multiplication factor calculations."
    },
    {
      question: "What is the 'adjoint flux' in reactor physics calculations?",
      options: [
        "The neutron flux in regions adjacent to the core",
        "The importance function representing the contribution of neutrons to future fission events",
        "The flux of delayed neutrons following prompt neutron emission",
        "The thermal flux measured at symmetric positions around the core"
      ],
      correctAnswer: 1,
      explanation: "The adjoint flux (or adjoint function) represents the importance of neutrons at different positions, energies, and directions with respect to sustaining the chain reaction. Mathematically, it's the solution to the adjoint of the neutron transport equation. It's crucial for reactor control theory, perturbation calculations, detector placement optimization, and variance reduction techniques in Monte Carlo simulations."
    },
    {
      question: "Which phenomenon explains why reactors can experience xenon-induced spatial power oscillations?",
      options: [
        "Differences in control rod insertion depths across the core",
        "Local power changes affecting xenon production and burnout rates differently across the core",
        "Uneven cooling due to flow distribution problems",
        "Manufacturing variations in fuel enrichment"
      ],
      correctAnswer: 1,
      explanation: "Xenon-induced spatial oscillations occur because local power changes affect xenon production and burnout rates differently. If power increases in one region, xenon initially builds up (from iodine decay), then burns out. Adjacent regions experience the opposite effect, creating out-of-phase xenon concentrations. In large cores, this can lead to power swinging from one region to another with a period of about 15-30 hours unless properly controlled."
    },
    {
      question: "What principle underlies the operation of a homogeneous reactor?",
      options: [
        "Fuel and moderator are uniformly mixed in a single phase",
        "All fuel rods are identical in enrichment and configuration",
        "The neutron flux is flattened across the core",
        "The reactor is designed with perfect radial symmetry"
      ],
      correctAnswer: 0,
      explanation: "In a homogeneous reactor, the fuel and moderator are uniformly mixed in a single phase, typically as a liquid solution or slurry. This contrasts with heterogeneous designs (like most power reactors) where fuel and moderator are physically separate. Homogeneous reactors offer advantages in simplified fuel processing and inherent safety features but present challenges in containing the radioactive fluid and managing corrosion."
    },
    {
      question: "What is the 'six-factor formula' used to calculate in reactor physics?",
      options: [
        "The six major components of reactor operating costs",
        "The six stages of the nuclear fuel cycle",
        "The six parameters that determine the effective multiplication factor",
        "The six key isotopes in spent fuel"
      ],
      correctAnswer: 2,
      explanation: "The six-factor formula calculates the effective neutron multiplication factor (k) by multiplying six independent factors: the reproduction factor (η), the fast fission factor (ε), the fast non-leakage probability (Pf), the resonance escape probability (p), the thermal non-leakage probability (Pt), and the thermal utilization factor (f). It separates the complex neutronics of a reactor into distinct physical processes for analysis."
    },
    {
      question: "What is the primary advantage of the Integral Fast Reactor (IFR) design?",
      options: [
        "Lower construction costs compared to LWRs",
        "Higher thermal efficiency",
        "Closed fuel cycle with pyroprocessing for waste reduction",
        "Simplified safety systems requiring less maintenance"
      ],
      correctAnswer: 2,
      explanation: "The primary advantage of the Integral Fast Reactor (IFR) design is its closed fuel cycle with on-site pyroprocessing. This allows recycling of actinides, significantly reducing long-lived waste while improving uranium utilization. The IFR also featured passive safety systems and used metal fuel with liquid sodium coolant, demonstrating inherent safety during tests at EBR-II where it survived loss of coolant flow and loss of heat sink without scram."
    },
    {
      question: "What is the main challenge in developing fusion reactors compared to fission reactors?",
      options: [
        "Achieving sufficiently high temperatures to overcome electrostatic repulsion between nuclei",
        "Finding appropriate neutron moderators",
        "Preventing nuclear criticality excursions",
        "Managing long-lived radioactive waste"
      ],
      correctAnswer: 0,
      explanation: "The main challenge in fusion reactor development is achieving and maintaining the extremely high temperatures (100+ million °C) needed to overcome the electrostatic repulsion between positively charged nuclei. This requires sophisticated confinement systems (magnetic or inertial) and has prevented sustained net-energy-producing fusion reactions despite decades of research. Additional challenges include plasma stability, materials that can withstand intense neutron flux, and tritium breeding."
    },
    {
      question: "Which phenomenon is described by the Nordheim-Fuchs model in reactor kinetics?",
      options: [
        "Steady-state neutron flux distribution",
        "Prompt criticality excursion and self-limitation",
        "Xenon poisoning after shutdown",
        "Control rod worth during insertion"
      ],
      correctAnswer: 1,
      explanation: "The Nordheim-Fuchs model describes the behavior of a prompt criticality excursion and its self-limitation. It models how a reactor with prompt supercriticality experiences a rapid power rise that's eventually terminated by negative reactivity feedback (typically from temperature increases). The model predicts the energy release, peak power, and temperature rise during such excursions, which has been important for safety analyses of research reactors and criticality accidents."
    },
    {
      question: "What distinguishes a pebble bed reactor from conventional reactor designs?",
      options: [
        "It uses spherical fuel elements that are continuously circulated through the core",
        "It uses pebble-shaped moderator elements surrounding conventional fuel rods",
        "It relies on small 'pebbles' of neutron reflector material to enhance efficiency",
        "It employs a bed of catalyst pebbles to remove impurities from the coolant"
      ],
      correctAnswer: 0,
      explanation: "Pebble bed reactors use spherical fuel elements ('pebbles') containing TRISO fuel particles within a graphite matrix. These pebbles are continuously circulated through the core during operation, allowing online refueling without shutdown. This design offers advantages in passive safety (high thermal capacity, negative temperature coefficient) and operational flexibility, but presents challenges in fuel handling complexity and potential dust generation."
    },
    {
      question: "What is the significance of the Doppler effect in nuclear reactor safety?",
      options: [
        "It changes the frequency of radiation emitted from the core",
        "It broadens resonance absorption peaks in fuel as temperature increases",
        "It affects the velocity of delayed neutron precursors",
        "It alters the energy spectrum of neutrons leaking from the reactor"
      ],
      correctAnswer: 1,
      explanation: "The Doppler effect in reactor physics refers to the broadening of resonance absorption peaks in fuel isotopes (particularly U-238) as temperature increases. This increases neutron capture at resonance energies, providing an immediate negative reactivity feedback mechanism that's crucial for reactor stability and safety. Unlike other feedback mechanisms, the Doppler effect occurs directly in the fuel and acts promptly, helping limit power excursions before they become dangerous."
    },
    {
      question: "What is the significance of the neutron window in accelerator-driven systems (ADS)?",
      options: [
        "A physical window that separates the accelerator from the subcritical core",
        "The energy range where neutrons are most effective for transmutation",
        "The timeframe when the accelerator beam is active during operation",
        "The viewing port that allows monitoring of neutron production"
      ],
      correctAnswer: 0,
      explanation: "In accelerator-driven systems, the neutron window is the physical barrier (typically made of a material like an alloy of lead-bismuth) that separates the vacuum environment of the accelerator from the subcritical core environment while allowing the high-energy particle beam to pass through. This component faces extreme engineering challenges including radiation damage, thermal stress, and corrosion, and is often considered one of the critical technological limitations for ADS implementation."
    },
    {
      question: "What is the difference between deterministic and Monte Carlo methods in nuclear reactor simulations?",
      options: [
        "Deterministic methods solve the transport equation directly, while Monte Carlo methods track individual particle histories probabilistically",
        "Deterministic methods are used for transient analysis, while Monte Carlo methods are only for steady-state calculations",
        "Deterministic methods work only for thermal reactors, while Monte Carlo methods are used for fast reactors",
        "Deterministic methods simulate normal operation, while Monte Carlo methods simulate accident conditions"
      ],
      correctAnswer: 0,
      explanation: "Deterministic methods (like discrete ordinates or diffusion theory) numerically solve the neutron transport or diffusion equations by discretizing space, energy, and angle. In contrast, Monte Carlo methods simulate the random walks of individual neutrons through the geometry, using probability distributions for interactions. Monte Carlo provides exact geometry representation and continuous energy treatment but requires high computational resources to reduce statistical uncertainty."
    },
    {
      question: "What is the Wigner energy release phenomenon in graphite-moderated reactors?",
      options: [
        "Energy generated directly by beta decay of impurities in graphite",
        "Spontaneous release of stored energy from radiation damage in graphite crystal structure",
        "Heat generated when graphite burns in contact with air during accidents",
        "Energy from neutron-carbon reactions in graphite"
      ],
      correctAnswer: 1,
      explanation: "Wigner energy (or Wigner effect) is the release of stored energy that occurs when neutron-irradiated graphite is heated above its irradiation temperature. Neutron bombardment displaces carbon atoms from their lattice positions, storing potential energy. This energy can be released spontaneously if the graphite reaches a critical temperature, potentially causing rapid temperature excursions. This phenomenon contributed to the 1957 Windscale fire in the UK."
    },
    {
      question: "In the realm of nuclear fuel cycle analysis, what does 'SWU' stand for and what does it represent?",
      options: [
        "Standard Waste Unit - a measure of nuclear waste radioactivity",
        "Separative Work Unit - a measure of the effort required for uranium enrichment",
        "Safe Working Uranium - the maximum uranium concentration safe for handling",
        "Surface Water Uptake - the contamination level in cooling water"
      ],
      correctAnswer: 1,
      explanation: "SWU stands for Separative Work Unit, a measure of the effort required in uranium enrichment processes. It quantifies the amount of isotope separation work performed to enrich uranium, regardless of the specific enrichment technology used. The SWU concept is important in fuel cycle economics and non-proliferation analysis, as it helps determine enrichment facility capacity and enrichment costs."
    },
    {
      question: "What is the significance of the 'n,2n' reaction in nuclear systems?",
      options: [
        "It's the primary reaction for uranium fission",
        "It leads to tritium production in fusion blankets",
        "It converts uranium-238 to plutonium-239",
        "It results in neutron multiplication and increased neutron economy"
      ],
      correctAnswer: 3,
      explanation: "In an (n,2n) reaction, a high-energy neutron interacts with a nucleus, causing the emission of two lower-energy neutrons. This reaction is important for neutron multiplication and improved neutron economy in fast reactors and fusion systems. Materials like beryllium and lead exhibit significant (n,2n) cross-sections and are used as neutron multipliers in blanket designs for fusion reactors and some research reactors."
    },
    {
      question: "What is 'neutron importance' in reactor physics?",
      options: [
        "The percentage of neutrons that cause fission",
        "The relative contribution of neutrons at different positions and energies to sustaining the chain reaction",
        "The ability of neutrons to penetrate shielding materials",
        "The neutron flux at the center of the reactor core"
      ],
      correctAnswer: 1,
      explanation: "Neutron importance is a measure of the relative contribution of neutrons at specific positions, energies, and directions to the sustainable chain reaction. It characterizes how valuable a neutron is to maintaining criticality, considering its probability of causing future fissions. Neutron importance varies throughout the reactor and is used in reactor control theory, adjoint calculations, and perturbation theory for reactivity calculations."
    },
    {
      question: "In the context of radiation protection, what is the meaning of 'committed dose'?",
      options: [
        "The annual dose limit committed to by regulatory authorities",
        "The total dose expected to be received from an external source over a lifetime",
        "The integrated dose to an organ or tissue over a specified time period following intake of radioactive material",
        "The dose a facility commits to keep workers below"
      ],
      correctAnswer: 2,
      explanation: "Committed dose is the integrated radiation dose to an organ or tissue over a specified time period (typically 50 years for adults or 70 years for children) following the intake of radioactive material. It accounts for continued exposure from radionuclides retained in the body, considering their biological half-lives and metabolic behavior. This concept is crucial for radiation protection since internal contamination can lead to prolonged exposure."
    },
    {
      question: "What is the 'prompt jump approximation' in reactor kinetics?",
      options: [
        "An approximation that neglects delayed neutrons in transient analysis",
        "A method for rapidly increasing reactor power during startup",
        "A technique for approximating control rod worth during rapid insertion",
        "The theoretical maximum power increase rate in a prompt critical reactor"
      ],
      correctAnswer: 0,
      explanation: "The prompt jump approximation is a mathematical simplification used in reactor kinetics that assumes prompt neutrons reach equilibrium almost instantaneously following a reactivity change, while delayed neutron precursors respond more slowly. This allows separating the kinetics equations into fast (prompt) and slow (delayed) components, simplifying the analysis of reactor transients. The approximation is valid for reactivity changes below prompt criticality."
    },
    {
      question: "What is the 'inhour equation' in reactor kinetics?",
      options: [
        "An equation relating reactor period to reactivity",
        "A formula for calculating hourly power variations",
        "The time-dependent neutron diffusion equation",
        "The relationship between reactor power and control rod position"
      ],
      correctAnswer: 0,
      explanation: "The inhour equation relates reactor period (the time for power to increase by a factor of e) to reactivity. It accounts for both prompt and delayed neutron effects, incorporating the delayed neutron fraction and decay constants for different precursor groups. The equation is used for reactor control and safety analyses, particularly for calculating how quickly power will change for a given reactivity insertion."
    },
    {
      question: "What phenomenon does 'self-shielding' refer to in nuclear reactor physics?",
      options: [
        "Automatic activation of containment isolation during accidents",
        "The ability of reactor materials to absorb their own radiation damage",
        "Reduction in neutron flux in the interior of fuel or absorber materials",
        "Reactor design features that provide inherent protection against external hazards"
      ],
      correctAnswer: 2,
      explanation: "Self-shielding refers to the reduction in neutron flux (and thus reaction rate) in the interior of a material due to absorption in the outer layers. This is particularly important for strong neutron absorbers and for resonance absorption in U-238. Self-shielding effects must be carefully accounted for in reactor physics calculations, as they significantly impact neutron economy, power distribution, and isotopic depletion rates."
    },
    {
      question: "What is a 'Monte Carlo N-Particle' (MCNP) code used for in nuclear engineering?",
      options: [
        "Simulating control rod movement sequences",
        "Modeling particle interactions and transport using statistical methods",
        "Monitoring neutron population in operating reactors",
        "Calculating optimal fuel loading patterns"
      ],
      correctAnswer: 1,
      explanation: "MCNP is a general-purpose Monte Carlo code that models the random walk and interactions of particles (neutrons, photons, electrons) through matter using statistical methods. It can model complex 3D geometries with exact representation and continuous-energy cross sections. MCNP is widely used for reactor physics calculations, shielding design, criticality safety, detector design, and medical physics applications."
    },
    {
      question: "What does the 'Lewis number' represent in thermal-hydraulic analyses of nuclear systems?",
      options: [
        "The ratio of thermal diffusivity to mass diffusivity",
        "The dimensionless number relating neutron population to thermal power",
        "The coefficient used to calculate radiation heat transfer in reactor cores",
        "The number of heat transfer tubes required in a steam generator"
      ],
      correctAnswer: 0,
      explanation: "The Lewis number is the ratio of thermal diffusivity to mass diffusivity, representing the relative rates of heat and mass transfer in a fluid. In nuclear thermal-hydraulics, it's particularly important for analyzing phenomena involving both heat and mass transfer, such as condensation, evaporation, and hydrogen distribution in containment during severe accidents. It helps determine whether thermal or concentration gradients dominate in transport processes."
    },
    {
      question: "What is 'Shannon entropy' as applied to nuclear criticality calculations?",
      options: [
        "A measure of the randomness of fission event timing",
        "The uncertainty in neutron cross-section data",
        "A measure of neutron population distribution convergence in Monte Carlo simulations",
        "The information content in nuclear decay chains"
      ],
      correctAnswer: 2,
      explanation: "In nuclear criticality calculations using Monte Carlo methods, Shannon entropy is used to assess the convergence of the fission source (neutron population) distribution. By dividing the geometry into cells and calculating the information-theoretic entropy of the source distribution, analysts can determine when the simulation has adequately converged. This is crucial for ensuring reliable results, especially in loosely coupled systems where convergence can be slow."
    },
    {
      question: "What is the 'Bateman equation' used for in nuclear engineering?",
      options: [
        "Calculating reactor kinetics during transients",
        "Determining shielding requirements for different radiation types",
        "Modeling radioactive decay chains and buildup of daughter products",
        "Analyzing stress distributions in reactor pressure vessels"
      ],
      correctAnswer: 2,
      explanation: "The Bateman equations describe the time-dependent concentrations of nuclides in a radioactive decay chain. They account for both the decay of parent nuclides and the production from precursors. These equations are essential for nuclear fuel cycle analysis, spent fuel characterization, activation product calculations, and radiological assessments. While the general form can be complex for long chains, simplified versions are often applied to specific problems."
    },
    {
      question: "What is 'burnup credit' in spent nuclear fuel management?",
      options: [
        "A financial credit given to utilities for highly burned fuel",
        "Taking credit for reduced reactivity of spent fuel due to fissile depletion and poison buildup",
        "The heat generation reduction credited in cooling system design",
        "Crediting utilities for burning plutonium in mixed oxide fuel"
      ],
      correctAnswer: 1,
      explanation: "Burnup credit refers to accounting for the reduced reactivity of spent nuclear fuel (due to fissile isotope depletion and neutron absorber buildup) in criticality safety analyses. Traditional approaches conservatively assumed fresh fuel composition, but burnup credit allows for more realistic assessments, enabling more efficient spent fuel storage, transport, and disposal while maintaining safety margins. It requires sophisticated depletion calculations and extensive validation."
    },
    {
      question: "What is 'modal analysis' in nuclear reactor structural dynamics?",
      options: [
        "Analysis of different operational modes of a reactor",
        "A method for analyzing vibration modes and natural frequencies of structures",
        "A technique for categorizing reactor accident modes",
        "Analysis of different neutron energy modes in the core"
      ],
      correctAnswer: 1,
      explanation: "Modal analysis in structural dynamics is a technique used to determine the vibration characteristics (natural frequencies, mode shapes, and damping factors) of structures under dynamic loading. In nuclear plants, it's critical for evaluating how components respond to seismic events, flow-induced vibrations, or operational transients. It helps ensure that resonant frequencies are avoided during normal operation and that structures can withstand design basis events."
    },
    {
      question: "What is the 'depletion defect' in nuclear reactor calculations?",
      options: [
        "The loss of computational accuracy over long depletion calculations",
        "The design flaw that leads to accelerated depletion in certain regions",
        "The difference between predicted and actual fuel depletion rates",
        "The negative reactivity introduced by fuel depletion and fission product buildup"
      ],
      correctAnswer: 3,
      explanation: "The depletion defect refers to the negative reactivity introduced by fuel depletion and fission product buildup during reactor operation. As fissile material is consumed and neutron absorbers accumulate, the core becomes less reactive. This reactivity deficit must be compensated for in the initial core design by incorporating excess reactivity (through higher enrichment, burnable absorbers, etc.) to achieve the desired cycle length."
    },
    {
      question: "What does the 'Sievert integral' calculate in radiation shielding analysis?",
      options: [
        "The total radiation dose in Sieverts received by workers",
        "The line-of-sight integral of gamma ray attenuation through shields",
        "The cumulative effect of different radiation types weighted by their biological effectiveness",
        "The integral of radiation streaming through shield penetrations"
      ],
      correctAnswer: 1,
      explanation: "The Sievert integral (or exposure buildup factor) is used in gamma ray shielding calculations to account for scattered radiation. It represents the line-of-sight integral of gamma ray attenuation through a shield, accounting for both primary (unscattered) and secondary (scattered) radiation. This approach helps properly size radiation shields, as considering only primary radiation would significantly underestimate dose rates behind the shield."
    },
    {
      question: "What is 'pin cell homogenization' in reactor physics calculations?",
      options: [
        "A manufacturing process to ensure uniform distribution of uranium in fuel pins",
        "A computational technique that smears fuel, gap, and cladding into equivalent homogeneous materials",
        "The physical mixing of different materials in experimental fuel pins",
        "A quality control measure to verify uniform fuel enrichment"
      ],
      correctAnswer: 1,
      explanation: "Pin cell homogenization is a computational technique in reactor physics that replaces the heterogeneous structure of a fuel pin (fuel, gap, cladding) with equivalent homogeneous materials that preserve reaction rates. This simplification allows more efficient whole-core calculations while maintaining adequate accuracy. It typically involves detailed transport calculations at the pin level to generate homogenized cross-sections for use in larger-scale models."
    },
    {
      question: "What is 'subcritical multiplication' in nuclear systems?",
      options: [
        "The increase in neutron population when a subcritical system approaches criticality",
        "A technique for extracting energy from subcritical assemblies",
        "The mathematical formula for calculating subcritical reactivity",
        "The process of breeding fissile material in subcritical blankets"
      ],
      correctAnswer: 0,
      explanation: "Subcritical multiplication refers to the increase in neutron population when an external neutron source is present in a subcritical system. As the system approaches criticality (k approaches 1), the multiplication factor M = 1/(1-k) grows larger, amplifying the source neutrons. This phenomenon is the basis for subcritical reactivity measurements, startup neutron monitoring, and accelerator-driven subcritical system operation."
    },
    {
      question: "What is the 'Nordheim-Fuchs model' used for in nuclear engineering?",
      options: [
        "Modeling reactor behavior during control rod movements",
        "Analyzing prompt criticality excursions",
        "Calculating neutron absorption in fuel rods",
        "Predicting staff radiation dose during normal operation"
      ],
      correctAnswer: 1,
      explanation: "The Nordheim-Fuchs model is a simplified analytical model used to analyze the behavior of prompt critical excursions and their self-limitation due to negative temperature feedback. It predicts the power trace, energy release, and maximum temperature during such events. While simplified, it provides important insights into criticality safety and accident analysis, particularly for research reactors, criticality accidents, and pulse reactors."
    },
    {
      question: "What is 'mesh refinement study' in nuclear computational modeling?",
      options: [
        "Improving the quality of metal wire meshes in fuel assemblies",
        "Analyzing the effect of mesh size on computational accuracy and convergence",
        "A study of radiation shielding effectiveness of different mesh materials",
        "Refinement of containment spray mesh patterns for optimal coverage"
      ],
      correctAnswer: 1,
      explanation: "A mesh refinement study systematically analyzes how computational solution accuracy depends on the spatial discretization (mesh) used. By performing calculations with progressively finer meshes, engineers can establish convergence behavior, estimate discretization error, and determine the appropriate mesh density for achieving desired accuracy. This is crucial in safety-critical nuclear simulations involving neutronics, thermal-hydraulics, or structural mechanics."
    },
    {
      question: "What is a 'Bonner sphere spectrometer' used for in nuclear engineering?",
      options: [
        "Measuring the energy spectrum of neutrons",
        "Analyzing spherical fuel pellet properties",
        "Determining the sphericity of containment structures",
        "Testing bond strength between fuel and cladding"
      ],
      correctAnswer: 0,
      explanation: "A Bonner sphere spectrometer is an instrument used to measure neutron energy spectra. It consists of a thermal neutron detector surrounded by moderating polyethylene spheres of different diameters. Each sphere configuration has different response functions to neutrons of various energies. By measuring counts with different sphere sizes and applying unfolding algorithms, the neutron energy spectrum can be determined, which is important for radiation protection and shielding design."
    },
    {
      question: "What is the 'Westcott formalism' in reactor physics?",
      options: [
        "A method for calculating control rod worth",
        "A technique for core flux mapping",
        "A formalism for calculating reaction rates in non-ideal neutron spectra",
        "A standard for emergency planning zones around nuclear plants"
      ],
      correctAnswer: 2,
      explanation: "The Westcott formalism is a method for calculating reaction rates in non-ideal neutron spectra, particularly when the spectrum deviates from a pure Maxwellian distribution. It introduces correction factors (the 'g' and 's' factors) to account for epithermal neutron contributions. This formalism is particularly important for accurate activation analysis, dosimetry, and neutron detector calibration in research reactors and neutron irradiation facilities."
    },
    {
      question: "What is the significance of the 'conversion ratio' in fast breeder reactors?",
      options: [
        "The ratio of thermal energy to electrical energy",
        "The ratio of new fissile material produced to fissile material consumed",
        "The ratio of fast neutrons to thermal neutrons",
        "The efficiency of converting depleted uranium to reactor fuel"
      ],
      correctAnswer: 1,
      explanation: "The conversion ratio (CR) is the ratio of new fissile material produced to fissile material consumed during reactor operation. When CR > 1, the reactor is a breeder, producing more fissile material than it consumes. Fast reactors can achieve breeding by converting fertile U-238 to fissile Pu-239. This parameter is crucial for evaluating fuel sustainability and the potential for closing the nuclear fuel cycle."
    },
    {
      question: "What are 'threshold detectors' in neutron measurements?",
      options: [
        "Detectors that only activate after receiving a threshold radiation dose",
        "Materials that undergo detectable reactions only with neutrons above specific energy thresholds",
        "Instruments that trigger emergency responses when radiation exceeds safety thresholds",
        "Monitoring devices that must exceed electronic noise thresholds to register counts"
      ],
      correctAnswer: 1,
      explanation: "Threshold detectors are materials that undergo detectable nuclear reactions (typically activation) only with neutrons above specific energy thresholds. By using a set of materials with different energy thresholds, the neutron energy spectrum can be unfolded. Examples include S-32, In-115, and Ni-58, which respond primarily to fast neutrons. These detectors are important for reactor dosimetry, criticality accident dosimetry, and fusion neutronics measurements."
    },
    {
      question: "What is the 'Beta-effective' parameter in reactor kinetics?",
      options: [
        "The percentage of electrons emitted during fission product decay",
        "The effective delayed neutron fraction adjusted for neutron importance",
        "The efficiency of beta particle detection in radiation monitoring",
        "The coefficient used to calculate beta radiation doses from spent fuel"
      ],
      correctAnswer: 1,
      explanation: "Beta-effective (βeff) is the effective delayed neutron fraction that accounts for both the actual fraction of delayed neutrons and their relative importance to the chain reaction compared to prompt neutrons. It's typically larger than the actual delayed neutron fraction because delayed neutrons are emitted at lower energies where they're more likely to cause fission. This parameter is crucial for reactor control and safety analyses."
    },
    {
      question: "What is 'fuel shuffling' in nuclear reactors?",
      options: [
        "The rapid vibration of fuel pellets inside fuel rods during operation",
        "The rearrangement of fuel assemblies to optimize burnup and power distribution",
        "The mixing of different fuel types in a single core loading",
        "The rotation of fuel rods to ensure even irradiation"
      ],
      correctAnswer: 1,
      explanation: "Fuel shuffling is the strategic rearrangement of partially spent fuel assemblies within the reactor core during refueling outages. By moving fuel assemblies from high-power to low-power regions (and vice versa), operators can flatten the power distribution, improve fuel utilization, and extend cycle length. Advanced shuffling strategies are determined using sophisticated core design codes that optimize both safety parameters and economic performance."
    }
  ]
};

function NuclearEngineeringQuiz() {
  const [difficulty, setDifficulty] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // State for jump to question
  const [jumpToQuestionValue, setJumpToQuestionValue] = useState('');
  const [showJumpInput, setShowJumpInput] = useState(false);
  
  // Handle difficulty selection
  const handleSelectDifficulty = (level) => {
    setDifficulty(level);
    resetQuiz();
  };
  
  // Reset quiz state
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setQuizCompleted(false);
    setShowExplanation(false);
    setJumpToQuestionValue('');
    setShowJumpInput(false);
  };
  
  // Handle jump to question
  const handleJumpToQuestion = () => {
    const questionNumber = parseInt(jumpToQuestionValue);
    if (!isNaN(questionNumber) && questionNumber >= 1 && questionNumber <= quizData[difficulty].length) {
      setCurrentQuestion(questionNumber - 1);
      setSelectedAnswer(null);
      setAnswered(false);
      setShowExplanation(false);
      setJumpToQuestionValue('');
      setShowJumpInput(false);
    }
  };
  
  // Handle answer selection
  const handleAnswerSelect = (event) => {
    if (!answered) {
      setSelectedAnswer(parseInt(event.target.value));
    }
  };
  
  // Submit answer
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setAnswered(true);
    
    // Check if answer is correct
    const correctAnswerIndex = quizData[difficulty][currentQuestion].correctAnswer;
    if (selectedAnswer === correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
    
    setShowExplanation(true);
  };
  
  // Go to next question
  const handleNextQuestion = () => {
    if (currentQuestion < quizData[difficulty].length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };
  
  // Restart quiz
  const handleRestartQuiz = () => {
    resetQuiz();
  };
  
  // Change difficulty
  const handleChangeDifficulty = () => {
    setDifficulty(null);
    resetQuiz();
  };
  
  // Calculate performance based on score
  const calculatePerformance = () => {
    const percentage = (score / quizData[difficulty].length) * 100;
    
    if (percentage >= 80) {
      return {
        message: "Excellent! You have a strong understanding of nuclear engineering concepts.",
        color: "success"
      };
    } else if (percentage >= 60) {
      return {
        message: "Good job! You have a solid grasp of the basics.",
        color: "info"
      };
    } else {
      return {
        message: "Keep learning! Review the explanations to strengthen your knowledge.",
        color: "warning"
      };
    }
  };

  // Render difficulty selection screen
  if (!difficulty) {
    return (
      <Box>
        <Typography variant="h5" align="center" gutterBottom>
          Nuclear Engineering Knowledge Quiz
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" paragraph sx={{ mb: 4 }}>
          Test your knowledge of nuclear physics, reactor technology, and radiation science.
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Box sx={{ maxWidth: 700, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Select Difficulty Level:
            </Typography>
            
            <Grid container spacing={3}>
              <DifficultyCard 
                title="Beginner"
                description="Basic concepts of nuclear physics, reactor components, and radiation"
                onSelect={() => handleSelectDifficulty('beginner')}
                color="#4caf50"
              />
              
              <DifficultyCard 
                title="Intermediate"
                description="Reactor physics, safety systems, and operational parameters"
                onSelect={() => handleSelectDifficulty('intermediate')}
                color="#2196f3"
              />
              
              <DifficultyCard 
                title="Advanced"
                description="Complex reactor behavior, safety analysis, and engineering design principles"
                onSelect={() => handleSelectDifficulty('advanced')}
                color="#ff9800"
              />
              
              <DifficultyCard 
                title="Expert"
                description="Specialized topics in reactor kinetics, fuel cycle technology, and advanced reactor concepts"
                onSelect={() => handleSelectDifficulty('expert')}
                color="#f44336"
              />
            </Grid>
          </Box>
        </Box>
      </Box>
    );
  }
  
  // Render quiz completion screen
  if (quizCompleted) {
    const performance = calculatePerformance();
    
    return (
      <Box>
        <Paper elevation={3} sx={{ maxWidth: 700, mx: 'auto', p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <EmojiEventsIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Quiz Completed!
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              Your Score: {score}/{quizData[difficulty].length} ({Math.round((score / quizData[difficulty].length) * 100)}%)
            </Typography>
            
            <Alert severity={performance.color} sx={{ mt: 2, mb: 3 }}>
              {performance.message}
            </Alert>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
              <Button 
                variant="contained"
                color="primary"
                onClick={handleRestartQuiz}
              >
                Restart Quiz
              </Button>
              <Button 
                variant="outlined"
                onClick={handleChangeDifficulty}
              >
                Change Difficulty
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  }
  
  // Get current question data
  const questionData = quizData[difficulty][currentQuestion];
  
  // Render quiz questions
  return (
    <Box>
      <Paper elevation={3} sx={{ maxWidth: 700, mx: 'auto', p: 4, borderRadius: 2 }}>
        {/* Progress indicator */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Question {currentQuestion + 1} of {quizData[difficulty].length}
              </Typography>
              {!showJumpInput ? (
                <Button 
                  size="small" 
                  onClick={() => setShowJumpInput(true)} 
                  sx={{ ml: 1, minWidth: 'auto', p: '2px 5px' }}
                >
                  Jump
                </Button>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                  <input
                    type="number"
                    min="1"
                    max={quizData[difficulty].length}
                    value={jumpToQuestionValue}
                    onChange={(e) => setJumpToQuestionValue(e.target.value)}
                    style={{ 
                      width: '40px', 
                      padding: '4px',
                      marginRight: '4px',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                  <Button 
                    size="small" 
                    onClick={handleJumpToQuestion}
                    disabled={!jumpToQuestionValue}
                    sx={{ minWidth: 'auto', p: '2px 5px' }}
                  >
                    Go
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => setShowJumpInput(false)}
                    sx={{ minWidth: 'auto', p: '2px 5px', ml: 1 }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
            <Chip 
              label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} 
              color={
                difficulty === 'beginner' ? 'success' : 
                difficulty === 'intermediate' ? 'primary' : 
                difficulty === 'advanced' ? 'warning' :
                'error'
              }
              size="small"
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(currentQuestion / quizData[difficulty].length) * 100} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
        
        {/* Question */}
        <Typography variant="h6" gutterBottom>
          {questionData.question}
        </Typography>
        
        {/* Answer options */}
        <FormControl component="fieldset" sx={{ width: '100%', my: 2 }}>
          <RadioGroup
            value={selectedAnswer === null ? '' : selectedAnswer.toString()}
            onChange={handleAnswerSelect}
          >
            {questionData.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={index.toString()}
                control={<Radio />}
                label={option}
                disabled={answered}
                sx={{
                  p: 1,
                  borderRadius: 1,
                  ...(answered && index === questionData.correctAnswer && {
                    bgcolor: 'success.light',
                  }),
                  ...(answered && selectedAnswer === index && selectedAnswer !== questionData.correctAnswer && {
                    bgcolor: 'error.light',
                  }),
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>
        
        {/* Explanation (shown after answering) */}
        {showExplanation && (
          <Alert 
            severity={selectedAnswer === questionData.correctAnswer ? "success" : "error"}
            icon={selectedAnswer === questionData.correctAnswer ? <CheckCircleIcon /> : <ErrorIcon />}
            sx={{ mt: 2, mb: 3 }}
          >
            <Typography variant="subtitle2" gutterBottom>
              {selectedAnswer === questionData.correctAnswer ? "Correct!" : "Incorrect"}
            </Typography>
            <Typography variant="body2">
              {questionData.explanation}
            </Typography>
          </Alert>
        )}
        
        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          {!answered ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextQuestion}
            >
              {currentQuestion < quizData[difficulty].length - 1 ? "Next Question" : "See Results"}
            </Button>
          )}
          
          <Button
            variant="text"
            color="inherit"
            onClick={handleChangeDifficulty}
          >
            Exit Quiz
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

// Helper component for difficulty cards
function DifficultyCard({ title, description, onSelect, color }) {
  return (
    <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, px: 1, mb: 2 }}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderTop: `4px solid ${color}`,
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: 4
          }
        }}
        onClick={onSelect}
      >
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

// Helper component for grid layout
function Grid({ container, item, children, spacing, xs, md, ...props }) {
  return (
    <Box
      sx={{
        ...(container && {
          display: 'flex',
          flexWrap: 'wrap',
          mx: spacing ? -spacing / 8 : 0
        }),
        ...(item && {
          ...(xs && { width: `${(xs / 12) * 100}%` }),
          ...(md && { 
            '@media (min-width: 900px)': {
              width: `${(md / 12) * 100}%`
            }
          })
        }),
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

export default NuclearEngineeringQuiz;
