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
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

// Quiz data
const quizData = {
  beginner: [
    {
      question: "What is the primary fuel used in most liquid-fueled rockets?",
      options: [
        "Gasoline",
        "Liquid hydrogen",
        "Kerosene",
        "Methane"
      ],
      correctAnswer: 2,
      explanation: "Kerosene (specifically RP-1, a refined form of kerosene) is the primary fuel used in many liquid-fueled rockets, including the SpaceX Falcon 9 and the first stage of the Saturn V. It's valued for its density, stability at room temperature, and relatively high energy content."
    },
    {
      question: "What does 'ISP' stand for in rocket science?",
      options: [
        "Interstellar Propulsion",
        "Internal Space Pressure",
        "Ignition System Protocol",
        "Specific Impulse"
      ],
      correctAnswer: 3,
      explanation: "ISP stands for Specific Impulse, which is a measure of how efficiently a rocket uses propellant. It represents the change in momentum per unit mass of propellant used and is typically measured in seconds."
    },
    {
      question: "Which of these is NOT a major component of a liquid rocket engine?",
      options: [
        "Combustion chamber",
        "Nozzle",
        "Solid fuel grain",
        "Turbopump"
      ],
      correctAnswer: 2,
      explanation: "A solid fuel grain is a component of solid rocket motors, not liquid rocket engines. Liquid rocket engines consist of components like combustion chambers, nozzles, turbopumps, and propellant injectors."
    },
    {
      question: "What is the purpose of a rocket nozzle?",
      options: [
        "To cool the rocket engine",
        "To accelerate exhaust gases and generate thrust",
        "To mix the fuel and oxidizer",
        "To stabilize the rocket during flight"
      ],
      correctAnswer: 1,
      explanation: "The primary purpose of a rocket nozzle is to accelerate the exhaust gases and generate thrust. It converts the high-pressure, high-temperature gas in the combustion chamber into high-velocity exhaust, maximizing the conversion of thermal energy to kinetic energy."
    },
    {
      question: "What term describes the minimum velocity needed to escape Earth's gravitational pull?",
      options: [
        "Terminal velocity",
        "Cruising velocity",
        "Escape velocity",
        "Orbital velocity"
      ],
      correctAnswer: 2,
      explanation: "Escape velocity is the minimum speed needed for an object to escape from a gravitational field without further propulsion. For Earth, this value is approximately 11.2 km/s (25,000 mph)."
    },
    {
      question: "What is the function of gimbaled engines in rockets?",
      options: [
        "To increase fuel efficiency",
        "To control thrust direction and steer the rocket",
        "To prevent engine overheating",
        "To reduce launch pad damage"
      ],
      correctAnswer: 1,
      explanation: "Gimbaled engines can pivot or rotate to change the direction of thrust, allowing for attitude control and steering of the rocket during flight. This is a crucial mechanism for maintaining the desired flight path."
    },
    {
      question: "What term describes the point where a spacecraft's velocity is too low to maintain orbit but too high to land safely?",
      options: [
        "Re-entry corridor",
        "Gravity well",
        "Atmospheric boundary",
        "Terminal descent"
      ],
      correctAnswer: 0,
      explanation: "The re-entry corridor refers to the narrow range of trajectories and velocities where a spacecraft can safely re-enter the atmosphere - not too steep (which would cause excessive heating) and not too shallow (which would cause the craft to skip off the atmosphere)."
    },
    {
      question: "What force counteracts a rocket's weight during launch?",
      options: [
        "Lift",
        "Drag",
        "Thrust",
        "Gravity"
      ],
      correctAnswer: 2,
      explanation: "Thrust is the force that counteracts a rocket's weight during launch. It is produced by the expulsion of high-speed exhaust gases from the rocket engines, following Newton's Third Law of Motion."
    },
    {
      question: "What is a major advantage of multi-stage rockets?",
      options: [
        "They can carry more passengers",
        "They shed mass as fuel is depleted, improving efficiency",
        "They are easier to construct than single-stage rockets",
        "They require less fuel"
      ],
      correctAnswer: 1,
      explanation: "The primary advantage of multi-stage rockets is that they shed mass (empty fuel tanks and engines) as fuel is depleted. This improves efficiency by reducing the amount of dead weight that subsequent stages must accelerate."
    },
    {
      question: "What is the Tsiolkovsky rocket equation used to calculate?",
      options: [
        "Rocket thrust",
        "Engine temperature",
        "Orbital parameters",
        "Change in velocity (delta-v)"
      ],
      correctAnswer: 3,
      explanation: "The Tsiolkovsky rocket equation (or ideal rocket equation) is used to calculate the change in velocity (delta-v) that a rocket can achieve given its mass ratio and exhaust velocity. It's a fundamental equation in spacecraft mission planning."
    },
    {
      question: "What term describes the point in a spacecraft's orbit where it is farthest from Earth?",
      options: [
        "Perigee",
        "Zenith",
        "Apogee",
        "Nadir"
      ],
      correctAnswer: 2,
      explanation: "Apogee is the point in an orbit around Earth where a satellite or spacecraft is farthest from the planet. The closest point is called perigee. For orbits around the Sun, these points are called aphelion and perihelion respectively."
    },
    {
      question: "What is the main advantage of ion propulsion over traditional chemical rockets?",
      options: [
        "Higher thrust",
        "Lower cost",
        "Faster acceleration",
        "Greater fuel efficiency"
      ],
      correctAnswer: 3,
      explanation: "The main advantage of ion propulsion is its extremely high fuel efficiency (specific impulse) compared to chemical rockets. While ion engines produce much less thrust, they can operate for much longer periods, ultimately achieving higher total velocity changes for the same amount of propellant."
    }
  ],
  intermediate: [
    {
      question: "What is the purpose of a regeneratively cooled rocket engine?",
      options: [
        "To use fuel to cool the combustion chamber and nozzle before burning it",
        "To recover heat from the exhaust to increase efficiency",
        "To minimize thermal radiation to nearby spacecraft components",
        "To reuse waste heat to generate electricity"
      ],
      correctAnswer: 0,
      explanation: "Regenerative cooling uses the fuel (or sometimes oxidizer) as a coolant by circulating it through channels around the combustion chamber and nozzle before injecting it for combustion. This both cools the engine components and preheats the propellant, improving performance."
    },
    {
      question: "What phenomenon causes 'pogo oscillation' in liquid-fueled rockets?",
      options: [
        "Uneven burning of solid propellant",
        "Resonant coupling between propellant flow and thrust",
        "Asymmetric thrust from multiple engines",
        "Atmospheric turbulence during ascent"
      ],
      correctAnswer: 1,
      explanation: "Pogo oscillation is caused by a dangerous feedback loop where engine thrust fluctuations create pressure waves in the propellant feed system, which then cause further thrust fluctuations. It's named for its resemblance to the bouncing motion of a pogo stick and can potentially damage or destroy a rocket."
    },
    {
      question: "In a bipropellant rocket engine, what is the 'mixture ratio'?",
      options: [
        "The ratio between main fuel and ignition fuel",
        "The ratio of oxidizer mass to fuel mass",
        "The ratio of liquid to gaseous components",
        "The ratio of thrust to vehicle weight"
      ],
      correctAnswer: 1,
      explanation: "The mixture ratio in a bipropellant rocket engine is the ratio of oxidizer mass to fuel mass. An optimal mixture ratio maximizes performance while considering factors like combustion stability, cooling, and propellant density."
    },
    {
      question: "What is 'ullage' in rocketry?",
      options: [
        "The small amount of residual propellant left in tanks",
        "The intentional space left in propellant tanks",
        "The settling of propellants at the bottom of tanks before engine ignition",
        "The erosion of engine nozzles during operation"
      ],
      correctAnswer: 2,
      explanation: "Ullage in rocketry refers to the maneuver that ensures propellants are properly settled at the bottom of their tanks (near the outlets) before engine ignition. This is especially important in zero-gravity conditions to prevent gas bubbles from entering the feed lines, which could cause engine malfunction."
    },
    {
      question: "What is the primary function of a rocket's payload fairing?",
      options: [
        "To protect the payload from aerodynamic forces and heating during ascent",
        "To connect the payload to the launch vehicle",
        "To provide life support systems for crewed missions",
        "To house the guidance computer and electronics"
      ],
      correctAnswer: 0,
      explanation: "The payload fairing protects satellites and other spacecraft (the payload) from aerodynamic forces, heating, and acoustic loads during the initial phases of launch through the atmosphere. Once the rocket reaches sufficient altitude, the fairing is jettisoned to reduce mass."
    },
    {
      question: "What is the Oberth effect in orbital mechanics?",
      options: [
        "Gravitational assistance from planetary flybys",
        "The efficiency of performing rocket burns at high velocity",
        "The stabilizing effect of spinning a spacecraft",
        "The reduction of drag at higher altitudes"
      ],
      correctAnswer: 1,
      explanation: "The Oberth effect is the increased efficiency gained by performing rocket burns when a spacecraft is at high velocity, typically at the periapsis (closest approach) of an orbit. It occurs because the work done by the rocket engine produces more kinetic energy when the spacecraft is moving faster."
    },
    {
      question: "What is the purpose of a 'hold-down' system on a rocket launch pad?",
      options: [
        "To prevent the rocket from launching during high winds",
        "To restrain the rocket until engines reach full thrust",
        "To attach umbilical cables for pre-launch operations",
        "To absorb sound waves during ignition"
      ],
      correctAnswer: 1,
      explanation: "Hold-down systems restrain the rocket on the launch pad until the engines have ignited and reached full thrust. This allows for verification of proper engine function before release and prevents the rocket from lifting off with insufficient thrust, which could result in a catastrophic failure."
    },
    {
      question: "What does 'TWR' stand for in rocket design?",
      options: [
        "Terminal Weight Reduction",
        "Thrust-to-Weight Ratio",
        "Thermal Work Resistance",
        "Total Waste Recovery"
      ],
      correctAnswer: 1,
      explanation: "TWR stands for Thrust-to-Weight Ratio, which is the ratio of a rocket's thrust to its weight. A TWR greater than 1 is required for a rocket to lift off the ground. Higher TWR values result in greater acceleration."
    },
    {
      question: "What is a 'Hohmann transfer orbit'?",
      options: [
        "An orbit between two planetary bodies",
        "A fuel-efficient orbital transfer between two circular orbits",
        "The path of a spacecraft during aerocapture",
        "A highly eccentric orbit for deep space missions"
      ],
      correctAnswer: 1,
      explanation: "A Hohmann transfer orbit is an elliptical orbit used to transfer a spacecraft between two circular orbits of different radii in the same plane. It's the most fuel-efficient transfer between two circular orbits and requires two engine burns: one to enter the transfer orbit and one to circularize at the destination."
    },
    {
      question: "What is 'staging' in rocket design?",
      options: [
        "The process of preparing a rocket for launch",
        "Discarding parts of the rocket as they become unnecessary during flight",
        "The testing sequence before full production",
        "Incrementally increasing engine thrust during ascent"
      ],
      correctAnswer: 1,
      explanation: "Staging is the design approach where a rocket discards components (stages) that are no longer needed during flight. When the propellant in one stage is exhausted, the empty tanks and engines are jettisoned to reduce mass, allowing the remaining propellant to accelerate the payload more efficiently."
    },
    {
      question: "What is the function of a turbopump in liquid rocket engines?",
      options: [
        "To cool the engine nozzle",
        "To deliver propellants to the combustion chamber at high pressure",
        "To generate electricity for onboard systems",
        "To recirculate unburned fuel"
      ],
      correctAnswer: 1,
      explanation: "Turbopumps in liquid rocket engines deliver propellants (fuel and oxidizer) from the storage tanks to the combustion chamber at very high pressure. They're essential for high-performance engines, allowing higher chamber pressures and thus more efficient combustion than would be possible with tank pressure alone."
    },
    {
      question: "What is the function of a 'reaction control system' (RCS) on a spacecraft?",
      options: [
        "To control the nuclear reaction in RTG power sources",
        "To provide attitude control and small position adjustments",
        "To manage chemical reactions in fuel cells",
        "To regulate internal temperature"
      ],
      correctAnswer: 1,
      explanation: "A reaction control system (RCS) provides attitude control (orientation) and small translational maneuvers for a spacecraft. It typically consists of small thrusters placed at strategic locations around the spacecraft that can be fired briefly to produce rotational or translational motion."
    },
    {
      question: "What is 'mass fraction' in rocket design?",
      options: [
        "The ratio of fuel mass to oxidizer mass",
        "The percentage of the rocket that is made of lightweight materials",
        "The ratio of propellant mass to total rocket mass",
        "The portion of the rocket's mass dedicated to structural components"
      ],
      correctAnswer: 2,
      explanation: "Mass fraction is the ratio of propellant mass to the total initial mass of the rocket. A higher mass fraction generally indicates a more efficient design, as it means more of the rocket's mass is dedicated to propellant rather than structure, engines, and payload."
    },
    {
      question: "What is a 'gravity turn' in rocket launch trajectories?",
      options: [
        "A maneuver to avoid excessive g-forces on the crew",
        "A gradual pitching maneuver that uses gravity to help steer the rocket horizontally",
        "The point where the rocket's trajectory is affected primarily by Earth's gravity",
        "The turn made when returning to Earth for landing"
      ],
      correctAnswer: 1,
      explanation: "A gravity turn is a trajectory optimization technique where, after initial vertical ascent, the rocket initiates a slight pitch maneuver and then stops active steering, allowing gravity to naturally bend the trajectory horizontal as it gains velocity. This is more efficient than maintaining a vertical ascent or using active steering throughout."
    }
  ],
  advanced: [
    {
      question: "What is the 'shower head' injector design used in some rocket engines?",
      options: [
        "A cooling system that sprays water on the exterior of the rocket",
        "A propellant injector with many small orifices distributed across the injector face",
        "A heat shield design that dissipates heat during reentry",
        "A system for equalizing pressure across the combustion chamber"
      ],
      correctAnswer: 1,
      explanation: "The showerhead injector design features numerous small orifices distributed across the injector face, resembling a bathroom showerhead. It provides good propellant atomization and mixing but generally offers lower performance than more advanced designs like coaxial or pintle injectors. It was used in early rocket engines due to its simplicity."
    },
    {
      question: "What is 'film cooling' in rocket engines?",
      options: [
        "Using liquid propellant to form a protective layer along combustion chamber walls",
        "Cooling the engine by exposing it to the cold of space",
        "The process of filming engine tests for later analysis",
        "Using thin metallic films to reflect heat away from sensitive components"
      ],
      correctAnswer: 0,
      explanation: "Film cooling in rocket engines involves injecting a thin layer of cooler propellant (usually fuel) along the walls of the combustion chamber and nozzle. This creates a protective boundary layer that shields the wall material from the extreme temperatures of the combustion gases, reducing heat transfer to the walls."
    },
    {
      question: "What is the 'Isp efficiency' of a rocket engine?",
      options: [
        "The ratio of actual ISP to the theoretical maximum ISP for the propellants",
        "The improvement in ISP at higher altitudes",
        "The ISP normalized for gravitational acceleration",
        "The rate of ISP change with varying mixture ratios"
      ],
      correctAnswer: 0,
      explanation: "ISP efficiency is the ratio of the actual specific impulse achieved by an engine to the theoretical maximum specific impulse possible with those propellants under ideal conditions. It's a measure of how well the engine design approaches ideal performance, with losses coming from factors like incomplete combustion, heat transfer, and non-optimal expansion."
    },
    {
      question: "What is 'chugging' in liquid rocket engines?",
      options: [
        "The sound made by fuel sloshing in partially empty tanks",
        "A low-frequency combustion instability caused by coupling with the feed system",
        "The practice of running engines at partial throttle to save fuel",
        "Vibration caused by uneven thermal expansion of engine components"
      ],
      correctAnswer: 1,
      explanation: "Chugging is a low-frequency combustion instability (typically 10-400 Hz) caused by coupling between the combustion process and the propellant feed system. It results in pressure oscillations that can cause mechanical damage and reduced performance. It's often addressed through feed system design changes or combustion chamber modifications."
    },
    {
      question: "What does 'MR shifting' refer to in bipropellant rocket operation?",
      options: [
        "Moving the magnetic resonance of propellants to improve combustion",
        "Changing the engine's mixture ratio during flight for optimal performance",
        "Shifting the main rocket assembly during construction",
        "Redirecting the magnetic field to protect from radiation"
      ],
      correctAnswer: 1,
      explanation: "MR (Mixture Ratio) shifting refers to deliberately changing the ratio of oxidizer to fuel during flight to optimize performance for different flight regimes. For example, a lower MR might be used at liftoff for higher thrust, while a higher MR might be used later for better specific impulse (efficiency)."
    },
    {
      question: "What is a 'gas generator cycle' in liquid rocket engines?",
      options: [
        "A method for generating breathable gases for life support",
        "An engine cycle where a portion of propellants drive a turbine before being exhausted",
        "The process of gasifying solid propellants",
        "A system for removing gas bubbles from liquid propellants"
      ],
      correctAnswer: 1,
      explanation: "The gas generator cycle is a power cycle for liquid rocket engines where a small portion of the propellants are combusted in a gas generator to drive the turbopumps, with the resulting gas then being exhausted separately from the main combustion chamber. This approach is simpler than closed cycles but has slightly lower efficiency due to the propellant diverted from the main thrust."
    },
    {
      question: "In a staged combustion cycle rocket engine, what is the purpose of the preburner?",
      options: [
        "To preheat the propellants before main combustion",
        "To generate hot gas to drive the turbopumps",
        "To test ignition sequence before main engine start",
        "To burn off impurities in the propellants"
      ],
      correctAnswer: 1,
      explanation: "In a staged combustion cycle engine, the preburner partially combusts a portion of the propellants (usually fuel-rich or oxidizer-rich) to generate hot gas that drives the turbopumps. Unlike in a gas generator cycle, this gas is then routed to the main combustion chamber, allowing for higher efficiency as all propellants contribute to the main thrust."
    },
    {
      question: "What is the 'Q-alpha' constraint in launch vehicle design?",
      options: [
        "A safety factor for structural components",
        "The maximum allowable product of dynamic pressure and angle of attack",
        "A quality assurance metric for propellant purity",
        "The thrust cutoff parameter for stage separation"
      ],
      correctAnswer: 1,
      explanation: "The Q-alpha constraint refers to the maximum allowable product of dynamic pressure (Q) and angle of attack (alpha). It's a critical limitation during ascent to prevent excessive aerodynamic loads on the vehicle structure. Exceeding the Q-alpha limit could result in structural failure or loss of control."
    },
    {
      question: "What is 'POGO suppression' in liquid rocket systems?",
      options: [
        "A method for reducing vertical oscillations in the rocket structure",
        "A technique for minimizing ground vibrations during launch",
        "A system to dampen fuel slosh in tanks",
        "A protocol for gradually reducing thrust before shutdown"
      ],
      correctAnswer: 0,
      explanation: "POGO suppression refers to systems designed to eliminate or reduce POGO oscillations (named for their resemblance to a pogo stick's motion). These dangerous longitudinal vibrations result from coupling between propellant flow, structure, and engine thrust. Suppression methods include accumulators in propellant lines, modified engine mounting, and specialized flow control devices."
    },
    {
      question: "What is the primary benefit of an aerospike nozzle compared to a conventional bell nozzle?",
      options: [
        "Higher thrust at sea level",
        "Better performance across varying altitudes",
        "Simpler manufacturing process",
        "Lower operating temperatures"
      ],
      correctAnswer: 1,
      explanation: "The primary benefit of an aerospike nozzle is its ability to maintain efficient performance across a wide range of altitudes (from sea level to vacuum). Conventional bell nozzles are optimized for a specific altitude and lose efficiency elsewhere. The aerospike achieves this through automatic altitude compensation as the external air pressure interacts with the exhaust plume."
    },
    {
      question: "What is the 'specific energy' of a rocket propellant combination?",
      options: [
        "The energy released per unit mass of propellants",
        "The energy needed to ignite the propellants",
        "The portion of energy converted to thrust",
        "The energy cost of producing the propellants"
      ],
      correctAnswer: 0,
      explanation: "Specific energy refers to the energy released per unit mass of propellants during combustion. Higher specific energy generally correlates with better performance potential (higher specific impulse). Hydrogen/oxygen has one of the highest specific energies among chemical propellants, which is why it's used in high-performance upper stages despite hydrogen's low density."
    },
    {
      question: "What is 'acoustic cavitation' in rocket propellant systems?",
      options: [
        "The use of sound waves to mix propellants",
        "Vibration-induced formation of vapor cavities in liquid propellants",
        "The creation of acoustic chambers for dampening engine noise",
        "The phenomenon of sound traveling through hollow parts of the rocket"
      ],
      correctAnswer: 1,
      explanation: "Acoustic cavitation occurs when pressure oscillations (often from turbopumps or combustion instabilities) cause the local pressure in a liquid propellant to drop below its vapor pressure, forming vapor bubbles. When these bubbles collapse, they can generate extremely high local pressures and temperatures, potentially damaging pump components and feed lines."
    },
    {
      question: "What does 'MCC' stand for in rocket engine design?",
      options: [
        "Multiple Combustion Chambers",
        "Main Control Computer",
        "Main Combustion Chamber",
        "Mission Control Center"
      ],
      correctAnswer: 2,
      explanation: "MCC stands for Main Combustion Chamber, which is the primary component where propellants mix and burn in a liquid rocket engine. It must withstand extreme temperatures and pressures while providing the optimal environment for efficient combustion. The hot gases from the MCC then accelerate through the nozzle to produce thrust."
    },
    {
      question: "What is a 'turbine blade root stress margin' in rocket engine design?",
      options: [
        "The safety factor for turbine blade attachment points",
        "The minimum distance between turbine blades and the housing",
        "The tolerance for manufacturing imperfections in turbine components",
        "The difference between blade angles at the hub versus the tip"
      ],
      correctAnswer: 0,
      explanation: "Turbine blade root stress margin refers to the safety factor in the design of turbine blade attachment points (roots) to the turbine disk. It's a critical parameter in turbopump design, as the roots experience extreme centrifugal forces during operation. Insufficient margin could lead to catastrophic turbine failure and engine loss."
    }
  ],
  expert: [
    {
      question: "What principle underlies the operation of an expander cycle rocket engine?",
      options: [
        "Using atmospheric pressure expansion for additional thrust",
        "Heating fuel in cooling channels to drive turbines before combustion",
        "Expanding combustion gases through multiple nozzles",
        "Using propellant expansion during phase changes for cooling"
      ],
      correctAnswer: 1,
      explanation: "In an expander cycle engine, cryogenic fuel (typically liquid hydrogen) is first used to cool the combustion chamber and nozzle through cooling channels. The heat absorbed vaporizes and expands the fuel, which is then used to drive the turbopumps before being injected into the combustion chamber. This elegant cycle eliminates the need for a separate gas generator or preburner, but is limited in maximum thrust by the heat transfer capacity."
    },
    {
      question: "What is the primary cause of 'screaming' instability in liquid rocket engines?",
      options: [
        "Resonant acoustic coupling with combustion processes",
        "Metal fatigue creating high-pitched vibrations",
        "Turbulent flow through injector elements",
        "Supersonic flow separation in the nozzle"
      ],
      correctAnswer: 0,
      explanation: "Screaming instability (also called acoustic instability or high-frequency combustion instability) is primarily caused by resonant acoustic coupling between pressure waves and the combustion process in the chamber. These high-frequency instabilities (typically 1-20 kHz) can cause destructive pressure oscillations and heat transfer rates that can destroy an engine in milliseconds if not properly addressed in the design."
    },
    {
      question: "What is the Rayleigh criterion as applied to combustion instability in rocket engines?",
      options: [
        "The maximum allowable chamber pressure fluctuation",
        "The minimum distance between combustion zones to prevent interference",
        "The condition where pressure oscillations are amplified when heat is added in phase with pressure peaks",
        "The threshold of propellant flow rate variation that triggers instability"
      ],
      correctAnswer: 2,
      explanation: "The Rayleigh criterion states that combustion instability is amplified when heat release occurs in phase with pressure oscillations (i.e., more heat is released during pressure peaks). This creates a self-reinforcing cycle: pressure oscillations affect combustion, which then amplifies the pressure oscillations. Understanding this principle is crucial for designing stable combustion systems."
    },
    {
      question: "What concept does 'expansion ratio' refer to in rocket nozzle design?",
      options: [
        "The ratio of exhaust gas volume before and after combustion",
        "The ratio of exit area to throat area in the nozzle",
        "The percentage increase in gas velocity through the nozzle",
        "The ratio of chamber pressure to ambient pressure"
      ],
      correctAnswer: 1,
      explanation: "Expansion ratio in rocket nozzle design refers to the ratio of the nozzle exit area to the throat area. Higher expansion ratios are more efficient in vacuum but can cause flow separation and performance loss if too high for the ambient pressure. For this reason, first stages typically use lower expansion ratios than upper stages designed for vacuum operation."
    },
    {
      question: "What phenomenon is addressed by 'acoustic resonators' in liquid rocket engines?",
      options: [
        "External noise pollution from the launch",
        "High-frequency combustion instabilities",
        "Vibration transmission to the payload",
        "Echo effects in propellant tanks"
      ],
      correctAnswer: 1,
      explanation: "Acoustic resonators (such as Helmholtz resonators, quarter-wave tubes, or acoustic cavities) are passive devices incorporated into rocket combustion chambers to dampen high-frequency combustion instabilities. They work by absorbing energy at specific resonant frequencies that match potential instability modes, effectively preventing these instabilities from growing to destructive levels."
    },
    {
      question: "In bipropellant rocket engine design, what does 'FFC bypass' refer to?",
      options: [
        "A method to bypass turbopumps during engine start",
        "Fuel-Film Cooling bypass used to adjust wall cooling flow",
        "Forced Flow Control for propellant balancing",
        "Final Flight Checkout procedures before launch"
      ],
      correctAnswer: 1,
      explanation: "FFC bypass refers to Fuel-Film Cooling bypass, a system that allows engineers to adjust the amount of fuel directed to film cooling of the combustion chamber walls. This provides flexibility to balance between thermal protection (more cooling flow) and performance (less cooling flow, more fuel for main combustion), optimizing the engine for different operating conditions or mission profiles."
    },
    {
      question: "What is 'coking' in regeneratively cooled rocket engines?",
      options: [
        "The process of using carbon composite materials in nozzle construction",
        "Carbon deposition in cooling channels from fuel decomposition",
        "A manufacturing technique for forming combustion chamber liners",
        "The treatment of propellant tanks with corrosion inhibitors"
      ],
      correctAnswer: 1,
      explanation: "Coking refers to the deposition of carbon residue in cooling channels caused by thermal decomposition of hydrocarbon fuels (like RP-1) at high temperatures. This can restrict coolant flow, reduce cooling efficiency, and lead to engine failure through wall burnthrough. It's a major limitation for regeneratively cooled engines using hydrocarbon fuels and has driven research into coking-resistant channel designs and fuel additives."
    },
    {
      question: "What is 'choked flow' in the context of rocket nozzles?",
      options: [
        "The limiting of propellant flow by injector sizing",
        "The condition where flow reaches sonic velocity at the nozzle throat",
        "Flow disruption caused by excessive expansion in the nozzle",
        "The reduction in flow rate as propellant tanks empty"
      ],
      correctAnswer: 1,
      explanation: "Choked flow occurs when the flow velocity reaches exactly sonic speed (Mach 1) at the nozzle throat. This condition establishes the maximum mass flow rate through the nozzle for given upstream conditions, regardless of downstream pressure (as long as the pressure ratio is above a critical value). This phenomenon is fundamental to rocket nozzle operation and performance calculations."
    },
    {
      question: "What is a 'pintle injector' in rocket engine design?",
      options: [
        "A type of propellant valve that can vary flow rates",
        "An adjustable central element that controls propellant mixing and flow patterns",
        "A mechanism that allows the rocket nozzle to change direction",
        "A device for measuring injection pressure accurately"
      ],
      correctAnswer: 1,
      explanation: "A pintle injector features an adjustable central element (the pintle) that creates an annular flow pattern for propellant mixing. This design, used in engines like SpaceX's Merlin and the Apollo lunar module descent engine, offers excellent combustion stability across wide throttle ranges and simpler manufacturing compared to traditional multi-element injectors, though with some performance trade-offs."
    },
    {
      question: "What is the function of baffles in rocket combustion chambers?",
      options: [
        "To provide structural support for the chamber walls",
        "To increase propellant mixing efficiency",
        "To disrupt pressure waves that could lead to combustion instability",
        "To redirect exhaust flow for thrust vectoring"
      ],
      correctAnswer: 2,
      explanation: "Baffles are rigid projections extending into the combustion chamber from the injector face. Their primary function is to disrupt and break up pressure waves that could otherwise lead to combustion instability. By physically blocking the wave propagation paths, baffles prevent the formation of coherent acoustic modes that could couple with the combustion process."
    },
    {
      question: "What is the 'oxidizer-to-fuel ratio shift' during throttling of liquid rocket engines?",
      options: [
        "The intentional adjustment of mixture ratio to optimize performance",
        "An undesired change in propellant ratio due to different flow resistances",
        "The change in burn rate of solid propellant sections",
        "The transition from primary to secondary oxidizer sources"
      ],
      correctAnswer: 1,
      explanation: "Oxidizer-to-fuel ratio shift is an undesired change in the propellant mixture ratio that occurs during deep throttling of rocket engines. It happens because propellants with different densities and viscosities respond differently to pressure changes in the feed system. This shift can lead to reduced performance, combustion instability, or even engine damage if too extreme."
    },
    {
      question: "What is 'blanching' in the context of rocket nozzle cooling?",
      options: [
        "A manufacturing process to prepare metal surfaces for coating",
        "A pre-launch conditioning of the cooling system",
        "Localized overheating indicated by discoloration of metal surfaces",
        "The application of thermal protective layers"
      ],
      correctAnswer: 2,
      explanation: "Blanching refers to the localized overheating of metal surfaces in regeneratively cooled nozzles, visible as discoloration (often whitish patches, hence the name). It indicates areas where cooling was insufficient, potentially due to cooling channel blockage, unexpected heat flux concentration, or coolant flow problems. While not immediately catastrophic, blanching weakens the material and can lead to failure with continued use."
    },
    {
      question: "What is the difference between a 'fuel-rich' and 'oxidizer-rich' staged combustion cycle?",
      options: [
        "The type of propellant used for regenerative cooling",
        "Which propellant is in excess in the preburner that drives the turbopumps",
        "The propellant that's injected first into the main combustion chamber",
        "Which component has a higher percentage of the total mass flow"
      ],
      correctAnswer: 1,
      explanation: "The difference lies in which propellant is in excess in the preburner that drives the turbopumps. In fuel-rich systems (like the RS-25/SSME), the preburner runs with excess fuel, producing relatively cool, hydrogen-rich gas to drive the turbines. In oxidizer-rich systems (like the RD-180), the preburner runs with excess oxygen, creating extremely challenging materials requirements due to the hot, oxygen-rich environment that can rapidly oxidize metals."
    },
    {
      question: "What is the 'Nyquist stability criterion' as applied to rocket control systems?",
      options: [
        "A method for determining the minimum data sampling rate for telemetry",
        "A graphical technique for assessing closed-loop stability of control systems",
        "The maximum allowable error in guidance calculations",
        "A measurement standard for thrust vectoring accuracy"
      ],
      correctAnswer: 1,
      explanation: "The Nyquist stability criterion is a graphical method for determining whether a closed-loop control system (such as a rocket's guidance system) will be stable. It works by analyzing the open-loop transfer function in the frequency domain, mapping it onto the complex plane, and checking whether the resulting contour encircles a critical point. This approach is particularly valuable for rocket control systems where stability margins are critical for safety."
    }
  ]
};

function RocketScienceQuiz() {
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
        message: "Excellent! You have a strong understanding of rocket science concepts.",
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
          Rocket Science Knowledge Quiz
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" paragraph sx={{ mb: 4 }}>
          Test your knowledge of rocket propulsion, orbital mechanics, and spacecraft engineering.
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Box sx={{ maxWidth: 700, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Select Difficulty Level:
            </Typography>
            
            <Grid container spacing={3}>
              <DifficultyCard 
                title="Beginner"
                description="Basic concepts of rocketry, orbital mechanics, and spacecraft systems"
                onSelect={() => handleSelectDifficulty('beginner')}
                color="#4caf50"
              />
              
              <DifficultyCard 
                title="Intermediate"
                description="Deeper dive into propulsion systems, mission planning, and spacecraft design"
                onSelect={() => handleSelectDifficulty('intermediate')}
                color="#2196f3"
              />
              
              <DifficultyCard 
                title="Advanced"
                description="Complex rocket engine cycles, launch vehicle design, and advanced orbital maneuvers"
                onSelect={() => handleSelectDifficulty('advanced')}
                color="#ff9800"
              />
              
              <DifficultyCard 
                title="Expert"
                description="Specialized topics in combustion dynamics, propulsion efficiency, and control systems"
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

export default RocketScienceQuiz;