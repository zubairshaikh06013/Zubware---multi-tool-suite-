import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface HowToStep {
  title: string;
  desc: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Batch2ToolData {
  title: string;
  navTitle: string;
  seoTitle: string;
  description: string;
  features: string[];
  howTo: HowToStep[];
  faq: FaqItem[];
}

export const BATCH_2_TOOLS: Record<string, Batch2ToolData> = {
  // ==========================================
  // DESIGN & UTILITY TOOLS (16 tools)
  // ==========================================
  'tip-calculator': {
    title: 'Tip Calculator — Split Bill & Calculate Gratuity Online',
    navTitle: 'Tip Calculator',
    seoTitle: 'Tip Calculator — Split Bill & Calculate Gratuity Online | Zubware',
    description: 'Calculate tip amounts and split restaurant bills evenly among friends online. Adjust tip percentages and review per-person totals with live calculations.',
    features: [
      'Instant Tip Amount & Total Bill Calculation',
      'Even Bill Splitting Across Any Number of People',
      'Quick-Select Tip Presets (10%, 15%, 18%, 20%, 25%)',
      'Custom Tip Percentage Slider for Precise Gratuity',
      'Real-Time Per-Person Cost Breakdown Display',
      '100% Client-Side In-Browser Calculation'
    ],
    howTo: [
      {
        title: 'Enter Bill Amount',
        desc: 'Input the total pre-tip check amount from your restaurant, café, or service bill.'
      },
      {
        title: 'Choose Tip Percentage',
        desc: 'Select a standard gratuity preset or use the slider to set a custom tip rate.'
      },
      {
        title: 'Set Number of People and Review Totals',
        desc: 'Adjust the group size counter to view total tip, combined bill, and individual cost per person.'
      }
    ],
    faq: [
      {
        question: 'How is the total tip and per-person split calculated?',
        answer: 'The tip is calculated by multiplying the bill amount by your chosen tip percentage. Adding the tip to the bill gives the total amount, which is then divided equally by the number of people in your party.'
      },
      {
        question: 'What is the standard tip percentage in restaurants?',
        answer: 'In the US and Canada, standard restaurant tipping is typically 15% to 20% for good service, with 18% being a common baseline for average dinner service.'
      },
      {
        question: 'Can I calculate custom tip percentages like 12% or 22%?',
        answer: 'Yes. You can enter any custom percentage value or drag the slider to calculate exact custom tip amounts.'
      },
      {
        question: 'Does the calculator run privately without saving my financial details?',
        answer: 'Yes. All calculations happen instantly within your browser with zero data stored or sent to any server.'
      }
    ]
  },

  'number-to-words': {
    title: 'Number to Words Converter — Convert Numbers to Words Online',
    navTitle: 'Number to Words',
    seoTitle: 'Number to Words Converter — Convert Numbers to Words | Zubware',
    description: 'Convert numbers and currency into written English words online. Supports International and Indian numbering systems with audio pronunciation and copy.',
    features: [
      'Converts Numbers into Written English Words Instantly',
      'Dual International (Millions, Billions) & Indian (Lakhs, Crores) Systems',
      'Currency Formats (USD Dollars, INR Rupees, GBP Pounds, EUR Euros)',
      'Built-in Speech Pronunciation via Web Speech API',
      'One-Click Clipboard Copying for Checks and Legal Forms',
      'Handles Large Numbers and Decimal Fractions'
    ],
    howTo: [
      {
        title: 'Type or Paste a Number',
        desc: 'Enter any positive, negative, or decimal number into the converter input.'
      },
      {
        title: 'Select Numbering System and Currency',
        desc: 'Choose between International or Indian numbering systems and pick a currency format if needed.'
      },
      {
        title: 'Copy or Listen to Words',
        desc: 'Click Copy to paste the written words into legal documents or checks, or click Listen to hear pronunciation.'
      }
    ],
    faq: [
      {
        question: 'How do International and Indian numbering systems differ?',
        answer: 'The International system groups digits by thousands (thousands, millions, billions, trillions), whereas the Indian system groups by hundreds after the first thousand (thousands, lakhs, crores).'
      },
      {
        question: 'Can I use this tool to write checks and financial vouchers?',
        answer: 'Yes. Selecting currency mode formats amounts with standard banking text (such as "Five Thousand Dollars and Fifty Cents Only"), suitable for writing official checks.'
      },
      {
        question: 'Does the converter support decimal cents or paise?',
        answer: 'Yes. Decimal numbers are accurately converted into cents, paise, or fractional words based on your selected currency.'
      },
      {
        question: 'Can I hear the words spoken out loud?',
        answer: 'Yes. The built-in audio button uses your browser’s text-to-speech synthesis to pronounce the full converted phrase.'
      }
    ]
  },

  'words-to-number': {
    title: 'Words to Number Converter — Convert Written Words to Numbers Online',
    navTitle: 'Words to Number',
    seoTitle: 'Words to Number Converter — Convert Text to Numbers | Zubware',
    description: 'Convert written English number phrases into numeric digits and formatted numbers online. Parse complex written numbers with instant clipboard copy.',
    features: [
      'Parses Written Number Words into Accurate Numeric Digits',
      'Handles Large Magnitudes (Thousands, Millions, Billions, Trillions)',
      'Supports Decimal Words (e.g. "point five", "and seventy-five hundredths")',
      'Negative Number Phrase Detection (e.g. "minus forty-two")',
      'Displays Standard Formatted & Raw Numeric Outputs',
      '100% In-Browser Natural Language Number Parsing'
    ],
    howTo: [
      {
        title: 'Enter Written Words',
        desc: 'Type or paste number phrases such as "two million three hundred forty-five thousand".'
      },
      {
        title: 'Automatic Real-Time Parsing',
        desc: 'The tool immediately evaluates written words and calculates the equivalent mathematical value.'
      },
      {
        title: 'Copy Digits to Clipboard',
        desc: 'Click Copy to copy the formatted number (with commas) or raw integer to your clipboard.'
      }
    ],
    faq: [
      {
        question: 'Which word formats are recognized by the converter?',
        answer: 'It parses cardinal numbers (one, twenty, hundred), hyphenated compounds (twenty-five), large scale words (million, billion), negative indicators (minus, negative), and decimals (point).'
      },
      {
        question: 'Can it convert spoken transcriptions or voice recognition text into numbers?',
        answer: 'Yes. You can paste speech-to-text transcripts containing spoken numbers to transform them into clean numeric digits.'
      },
      {
        question: 'Does it handle informal phrases like "a hundred" or "a thousand"?',
        answer: 'Yes. Common English phrasing where "a" signifies 1 (such as "a hundred" or "a thousand") is parsed correctly.'
      },
      {
        question: 'Is my input text sent across the internet?',
        answer: 'No. Linguistic parsing runs entirely inside your browser using client-side JavaScript regex and vocabulary tokenization.'
      }
    ]
  },

  'roman-numeral-converter': {
    title: 'Roman Numeral Converter — Convert Numbers to Roman Numerals Online',
    navTitle: 'Roman Numerals',
    seoTitle: 'Roman Numeral Converter — Numbers to Roman Numerals | Zubware',
    description: 'Convert numbers to Roman numerals and Roman numerals to numbers online. Check date translations, historical year charts, and standard notation rules.',
    features: [
      'Bidirectional Arabic to Roman & Roman to Arabic Conversion',
      'Validates Roman Numeral Syntax (Subtractive Notation Rules)',
      'Supports Standard Values from 1 to 3,999 (I to MMMCMXCIX)',
      'Quick Historical Year Presets (Current Year, Milestones, Centuries)',
      'Interactive Roman Numeral Reference Symbols & Values Chart',
      'Instant Conversion with One-Click Clipboard Copying'
    ],
    howTo: [
      {
        title: 'Enter Number or Roman Numeral',
        desc: 'Type standard digits (e.g., 2026) or a Roman numeral string (e.g., MMXXVI).'
      },
      {
        title: 'Review Bidirectional Result',
        desc: 'The tool automatically detects the input format and outputs the corresponding counterpart with syntax validation.'
      },
      {
        title: 'Copy Converted Text',
        desc: 'Click Copy to paste your Roman numeral for tattoos, clock designs, outlines, or book chapters.'
      }
    ],
    faq: [
      {
        question: 'What are the basic Roman numeral symbols and their values?',
        answer: 'The fundamental Roman symbols are I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, and M = 1,000.'
      },
      {
        question: 'How does subtractive notation work in Roman numerals?',
        answer: 'When a smaller symbol precedes a larger one, it is subtracted rather than added. For example, IV is 4 (5 - 1), IX is 9 (10 - 1), and CM is 900 (1000 - 100).'
      },
      {
        question: 'What is the highest number standard Roman numerals can represent?',
        answer: 'In standard classical notation without vinculum overlines, the maximum number is 3,999 (MMMCMXCIX).'
      },
      {
        question: 'Can I convert calendar years like 2026 into Roman numerals?',
        answer: 'Yes. Entering 2026 converts to MMXXVI, which is widely used in copyright notices, movie credits, and graduation plaques.'
      }
    ]
  },

  'coin-flip': {
    title: 'Online Coin Flip Simulator — 3D Heads or Tails Toss Online',
    navTitle: 'Coin Flip',
    seoTitle: 'Online Coin Flip Simulator — 3D Heads or Tails Toss | Zubware',
    description: 'Flip a virtual coin in 3D with realistic physics and sound effects online. Track heads and tails streaks or flip multiple coins for fair decisions.',
    features: [
      'Realistic 3D Animated Coin Toss with Dynamic Lighting',
      'Single and Multi-Coin Modes (Flip 1, 2, 3, 5, or 10 Coins)',
      'Live Statistical Tracker for Total Flips, Heads, Tails & Streaks',
      'Realistic Audio Coin Clink Sound Effects via Web Audio API',
      'Cryptographically Unbiased Random Number Generation',
      'Instant Flip Animation or Immediate Instant-Result Mode'
    ],
    howTo: [
      {
        title: 'Choose Coin Count',
        desc: 'Select whether to flip a single coin or multiple coins at once.'
      },
      {
        title: 'Click Flip Coin',
        desc: 'Click the flip button or tap the coin to trigger the 3D spinning animation.'
      },
      {
        title: 'Review Outcome and Probability Stats',
        desc: 'Observe the Heads or Tails result and monitor your cumulative flip streak and probability percentages.'
      }
    ],
    faq: [
      {
        question: 'Is this coin flip truly fair and 50/50 unbiased?',
        answer: 'Yes. The coin flip simulator uses modern pseudo-random algorithms providing an exact 50% statistical probability for heads and tails over large sample sizes.'
      },
      {
        question: 'Can I flip multiple coins at the same time?',
        answer: 'Yes. You can flip up to 10 coins simultaneously to simulate probability experiments or quickly break ties among group members.'
      },
      {
        question: 'Can I mute the coin flip sound effects?',
        answer: 'Yes. An audio toggle allows you to turn the synthesized coin sound effects on or off at any time.'
      },
      {
        question: 'Does the tool track my flipping history across the session?',
        answer: 'Yes. It maintains a running counter of total flips, heads count, tails count, win percentages, and consecutive streaks.'
      }
    ]
  },

  'name-picker-wheel': {
    title: 'Name Picker Wheel — Random Raffle & Prize Spinner Online',
    navTitle: 'Picker Wheel',
    seoTitle: 'Name Picker Wheel — Random Raffle & Prize Spinner | Zubware',
    description: 'Spin the customizable lucky wheel to pick a random name, winner, or raffle choice online. Enjoy smooth spin animations, sound, and winner celebration.',
    features: [
      'Customizable Wheel Slices with Vibrant Colors and Labels',
      'Bulk Name Input with Comma or Newline List Pasting',
      'Smooth Wheel Deceleration Physics & Ticking Sound Effects',
      'Winner Confetti Celebration Animation & Highlight Modal',
      'Optional "Remove Winner on Draw" Mode for Multi-Round Raffles',
      '100% In-Browser Execution with No Registration Required'
    ],
    howTo: [
      {
        title: 'Add Names or Choices',
        desc: 'Enter names, raffle tickets, team members, or options in the editable slice list.'
      },
      {
        title: 'Click to Spin the Wheel',
        desc: 'Click Spin to initiate the spinning animation and listen to the ticking indicator.'
      },
      {
        title: 'Celebrate and Select Next Winner',
        desc: 'View the winning selection in the celebration pop-up, with the option to remove the winner before spinning again.'
      }
    ],
    faq: [
      {
        question: 'How does the name picker wheel select a winner fairly?',
        answer: 'When you click Spin, the tool generates a random rotational angle with physics-based deceleration. Every slice has an equal chance proportional to its size.'
      },
      {
        question: 'Can I paste a long list of students or raffle entries at once?',
        answer: 'Yes. You can paste lines of names directly into the input area to populate dozens of wheel segments instantly.'
      },
      {
        question: 'Can I eliminate winners after each round so they cannot win twice?',
        answer: 'Yes. Enable the "Remove Winner" setting, and the selected person will be taken off the wheel for subsequent spins.'
      },
      {
        question: 'Is there a limit on how many names I can put on the wheel?',
        answer: 'You can comfortably add dozens of names; the wheel dynamically adjusts slice angles and label typography.'
      }
    ]
  },

  'dice-roller': {
    title: '3D Dice Roller Simulator — Roll Virtual D6, D20 & RPG Dice Online',
    navTitle: 'Dice Roller',
    seoTitle: '3D Dice Roller Simulator — Roll D6, D20 & RPG Dice | Zubware',
    description: 'Roll virtual polyhedral 3D dice for D&D, tabletop RPGs, and board games online. Roll D4, D6, D8, D10, D12, D20, and D100 dice with total score logs.',
    features: [
      'Full Polyhedral RPG Dice Set (D4, D6, D8, D10, D12, D20, D100)',
      'Roll Multiple Dice Simultaneously with Modifier Bonuses (+/-)',
      'Detailed Roll History Log Showing Individual Face Values & Totals',
      'Realistic 3D Tumbling Physics and Rolling Audio Effects',
      'One-Click Quick Roll Buttons for Common D&D Checks',
      'Fair, Cryptographically Random Outcomes in Your Browser'
    ],
    howTo: [
      {
        title: 'Choose Dice Type and Quantity',
        desc: 'Click on D4, D6, D8, D10, D12, D20, or D100 and select how many dice you want to throw.'
      },
      {
        title: 'Add Modifiers (Optional)',
        desc: 'Add bonus points or penalties (+/-) to match your character stats or game rules.'
      },
      {
        title: 'Roll and Inspect Results',
        desc: 'Click Roll to trigger the roll animation and view the sum total alongside individual dice face results.'
      }
    ],
    faq: [
      {
        question: 'Can I roll multiple dice of different types together?',
        answer: 'Yes. You can configure multi-dice combinations like 2d6 + 1d20 with custom modifiers for complex roleplaying checks.'
      },
      {
        question: 'What dice are included for Dungeons & Dragons (D&D)?',
        answer: 'The simulator includes the complete standard seven-dice set: D4, D6, D8, D10, D12, D20, and percentile D100.'
      },
      {
        question: 'Are the virtual dice rolls truly random?',
        answer: 'Yes. Roll outcomes are computed using cryptographically sound random values, ensuring completely unbiased numbers.'
      },
      {
        question: 'Does the tool keep track of my roll history?',
        answer: 'Yes. A scrolling session log records each roll, showing timestamps, dice rolled, modifiers applied, and final totals.'
      }
    ]
  },

  'wavelength-calculator': {
    title: 'Wavelength Calculator — Light & Wave Frequency Online',
    navTitle: 'Wavelength Calc',
    seoTitle: 'Wavelength Calculator — Light & Wave Frequency Online | Zubware',
    description: 'Calculate electromagnetic wavelength, wave frequency, and photon energy online. Explore presets for radio, microwave, visible light, and X-ray bands.',
    features: [
      'Calculates Wavelength (λ), Frequency (f) & Wave Speed (v = c)',
      'Computes Photon Energy (E = hf) in Joules (J) and Electron-Volts (eV)',
      'Electromagnetic Spectrum Presets (Radio, Microwave, Infrared, Visible, UV, X-Ray)',
      'Unit Conversion Across Nanometers, Micrometers, Meters, Hz, MHz, GHz & THz',
      'Color Swatch Display for Frequencies in the Visible Light Spectrum',
      'Precision Scientific Notation and Floating-Point Math'
    ],
    howTo: [
      {
        title: 'Enter Wavelength or Frequency',
        desc: 'Input a known wave value and choose its measurement unit (e.g. 500 nm or 100 MHz).'
      },
      {
        title: 'Select Medium or Wave Speed',
        desc: 'Use the speed of light in vacuum (c) or enter a custom wave propagation velocity.'
      },
      {
        title: 'Review Spectrum Band and Energy',
        desc: 'Inspect the calculated wavelength, frequency, photon energy (eV), and corresponding spectrum classification.'
      }
    ],
    faq: [
      {
        question: 'What is the formula used to calculate wavelength from frequency?',
        answer: 'The wavelength formula is λ = v / f, where λ is wavelength in meters, v is wave velocity (the speed of light c ≈ 3×10^8 m/s in vacuum), and f is wave frequency in Hertz (Hz).'
      },
      {
        question: 'How is photon energy calculated from wavelength or frequency?',
        answer: 'Photon energy is determined by Planck’s equation E = h × f = (h × c) / λ, where h is Planck’s constant (6.626×10^-34 J·s), expressed in Joules or electron-volts (eV).'
      },
      {
        question: 'Does the calculator show visible light colors?',
        answer: 'Yes. When entering wavelengths between approximately 380 nm and 750 nm, the calculator displays the corresponding visible spectrum color (violet to red).'
      },
      {
        question: 'Can I calculate acoustic or sound wave wavelengths?',
        answer: 'Yes. You can enter the speed of sound in air (approximately 343 m/s) as the custom velocity to calculate audio sound wavelengths.'
      }
    ]
  },

  'mode-calculator': {
    title: 'Mode Calculator — Find Statistical Dataset Mode Online',
    navTitle: 'Mode Calculator',
    seoTitle: 'Mode Calculator — Find Statistical Dataset Mode Online | Zubware',
    description: 'Find the statistical mode and frequency counts for any raw numerical or categorical dataset online. Identify unimodal, bimodal, and multimodal values.',
    features: [
      'Calculates Statistical Mode for Numeric & Categorical Data',
      'Detects Unimodal, Bimodal, Multimodal & No-Mode Datasets',
      'Full Frequency Distribution Table with Counts & Percentages',
      'Parses Comma, Space, or Newline-Delimited Value Lists',
      'Summary Metrics for Dataset Size, Unique Items & High Frequency',
      'Instant Calculations with One-Click Clipboard Copying'
    ],
    howTo: [
      {
        title: 'Enter or Paste Dataset',
        desc: 'Input numbers or text categories separated by commas, spaces, or line breaks.'
      },
      {
        title: 'Analyze Distribution',
        desc: 'The tool counts occurrences and identifies the value or values that appear most frequently.'
      },
      {
        title: 'Review Mode and Frequency Table',
        desc: 'Inspect the identified mode value(s) alongside the complete sorted frequency distribution table.'
      }
    ],
    faq: [
      {
        question: 'What is the statistical mode of a dataset?',
        answer: 'The mode is the value that appears with the highest frequency in a data set. A dataset can have one mode (unimodal), two modes (bimodal), multiple modes (multimodal), or no mode if all values appear equally.'
      },
      {
        question: 'What happens if every number in my dataset appears only once?',
        answer: 'When all items have the same frequency of occurrence (such as appearing once each), the dataset has no mode, and the calculator clearly reports "No Mode".'
      },
      {
        question: 'Can this mode calculator handle text or categorical lists?',
        answer: 'Yes. In addition to numbers, you can paste lists of survey responses, colors, or names to find the most frequent categorical answer.'
      },
      {
        question: 'Does the tool show a full frequency distribution table?',
        answer: 'Yes. It displays every unique item sorted by frequency count, showing exact counts and percentage shares.'
      }
    ]
  },

  'inductance-calculator': {
    title: 'Inductance Calculator — Coil Turns & Solenoid Formula Online',
    navTitle: 'Inductance Calc',
    seoTitle: 'Inductance Calculator — Coil Turns & Solenoid Formula | Zubware',
    description: 'Calculate electrical inductance in Henrys, mH, or µH for single-layer air-core coils and solenoids online using Wheeler formulas and coil dimensions.',
    features: [
      'Calculates Inductance for Single-Layer Air-Core Cylindrical Coils',
      'Uses Wheeler’s Standard Empirical Solenoid Equation',
      'Calculates Number of Turns Needed for Target Inductance',
      'Computes Total Wire Length and Aspect Ratio Diagnostics',
      'Supports Metric (mm, cm) and Imperial (Inches, Mils) Dimensions',
      'Ideal for RF Electronics, Antenna Chokes & Inductor Prototyping'
    ],
    howTo: [
      {
        title: 'Enter Coil Dimensions',
        desc: 'Input coil diameter, coil length, and number of wire turns.'
      },
      {
        title: 'Select Units of Measurement',
        desc: 'Choose millimeters, centimeters, or inches for coil dimensions.'
      },
      {
        title: 'Calculate Inductance & Wire Length',
        desc: 'Review the calculated inductance in microhenrys (µH), millihenrys (mH), and total required wire length.'
      }
    ],
    faq: [
      {
        question: 'Which formula is used for calculating air-core coil inductance?',
        answer: 'The calculator uses Wheeler’s approximation formula: L (µH) = (d² × n²) / (18d + 40l), where d is coil diameter in inches, l is coil length in inches, and n is total turns.'
      },
      {
        question: 'Can I calculate the number of turns required to achieve a target inductance?',
        answer: 'Yes. You can enter your desired target inductance, coil diameter, and length to solve for the required turn count.'
      },
      {
        question: 'Does this calculator apply to coils with ferrite or iron cores?',
        answer: 'This specific tool calculates air-core coils (relative magnetic permeability μr ≈ 1). Coils with ferromagnetic cores require multiplying by the core material’s permeability.'
      },
      {
        question: 'Why is coil wire length calculated?',
        answer: 'Knowing the total wire length helps electronics hobbyists and RF designers cut the correct length of magnet wire before winding.'
      }
    ]
  },

  'cat-age-calculator': {
    title: 'Cat Age Calculator — Convert Cat Years to Human Age Online',
    navTitle: 'Cat Age Calc',
    seoTitle: 'Cat Age Calculator — Convert Cat Years to Human Age | Zubware',
    description: 'Convert your cat or kitten age into human equivalent years based on veterinary life stages. Check health milestones and indoor life expectancy tips.',
    features: [
      'Veterinary Life Stage Mapping (Kitten, Junior, Prime, Mature, Senior, Geriatric)',
      'Accurate Dual-Stage Age Curve (1st year = 15 years, 2nd year = 24 years)',
      'Inputs for Cat Age in Both Years and Fractional Months',
      'Veterinary Health Milestone Checklist for Each Life Stage',
      'Indoor vs Outdoor Lifestyle Impact Guidelines',
      'Instant In-Browser Calculation with Pet Care Advice'
    ],
    howTo: [
      {
        title: 'Enter Cat Age in Years and Months',
        desc: 'Use the steppers or input fields to specify your feline companion’s current age.'
      },
      {
        title: 'Review Human Equivalent Age',
        desc: 'See your cat’s equivalent human age calculated using veterinary stage curves.'
      },
      {
        title: 'Read Life Stage Care Recommendations',
        desc: 'Explore specific nutritional, health screening, and dental milestones recommended for your cat’s age group.'
      }
    ],
    faq: [
      {
        question: 'Why is a cat’s age not simply calculated by multiplying by 7?',
        answer: 'Cats mature much faster in their first two years. A 1-year-old cat is roughly equivalent to a 15-year-old human, and a 2-year-old cat is comparable to a 24-year-old human. Each subsequent year adds approximately 4 human years.'
      },
      {
        question: 'What are the main veterinary life stages for domestic cats?',
        answer: 'The American Association of Feline Practitioners (AAFP) defines six stages: Kitten (0-6 months), Junior (7 months - 2 years), Prime (3-6 years), Mature (7-10 years), Senior (11-14 years), and Geriatric (15+ years).'
      },
      {
        question: 'Does being an indoor cat increase life expectancy?',
        answer: 'Yes. Indoor cats typically live 12 to 18 years on average, compared to outdoor cats who face higher risks from traffic, predators, and infectious diseases.'
      },
      {
        question: 'When is a cat considered a senior citizen?',
        answer: 'Veterinarians generally consider cats to enter their senior years around age 11 (equivalent to approximately 60 human years).'
      }
    ]
  },

  'paint-cost-calculator': {
    title: 'Paint Cost Calculator — Room Wall Area & Gallons Needed Online',
    navTitle: 'Paint Cost Calc',
    seoTitle: 'Paint Cost Calculator — Room Wall Area & Gallons Needed | Zubware',
    description: 'Calculate how many gallons or liters of paint you need for interior rooms online. Estimate wall surface area, subtract windows, and compute costs.',
    features: [
      'Calculates Total Wall Surface Area in Square Feet or Square Meters',
      'Automatic Deductions for Standard Doors and Windows',
      'Multi-Coat Support (1, 2, or 3 Coats of Paint)',
      'Computes Paint Volume Needed in Gallons and Liters',
      'Material Cost Estimator Based on Price Per Gallon/Can',
      '100% Client-Side In-Browser Renovation Estimator'
    ],
    howTo: [
      {
        title: 'Enter Room Dimensions',
        desc: 'Input room length, width, and ceiling height in feet or meters.'
      },
      {
        title: 'Set Openings and Number of Coats',
        desc: 'Specify how many doors and windows are in the room, and choose whether you plan to apply 1, 2, or 3 coats.'
      },
      {
        title: 'Review Paint Volume and Budget',
        desc: 'Enter paint can price to view the required number of gallons/cans and total estimated project cost.'
      }
    ],
    faq: [
      {
        question: 'How many square feet does one gallon of paint typically cover?',
        answer: 'A standard gallon of interior wall paint typically covers approximately 350 to 400 square feet with one coat on smooth primed drywall.'
      },
      {
        question: 'How do doors and windows affect the paint calculation?',
        answer: 'Standard doors subtract roughly 20 square feet each, and average windows subtract about 15 square feet each from total wall surface area.'
      },
      {
        question: 'Why should I apply two coats of paint instead of one?',
        answer: 'Two coats ensure even color saturation, cover underlying stains, and provide greater durability against scrubbing and scuffs.'
      },
      {
        question: 'Should I buy a little extra paint beyond the exact calculation?',
        answer: 'Yes. It is standard practice to round up to the next full gallon or add 10% extra for textured walls, touch-ups, and roller absorption.'
      }
    ]
  },

  'density-calculator': {
    title: 'Density Calculator — Mass, Volume & Density Formula Online',
    navTitle: 'Density Calculator',
    seoTitle: 'Density Calculator — Mass, Volume & Density Formula | Zubware',
    description: 'Calculate density, mass, or volume with instant unit conversions online. Compare material reference densities for metals, liquids, and common solids.',
    features: [
      'Solves for Density (ρ = m/V), Mass (m = ρ×V), or Volume (V = m/ρ)',
      'Extensive Unit Support (g/cm³, kg/m³, lb/ft³, g/mL, kg/L)',
      'Built-in Reference Density Library (Gold, Iron, Water, Ice, Air, Wood)',
      'Real-Time Scientific Unit Conversion and Formatting',
      'Step-by-Step Mathematical Formula Display',
      '100% In-Browser Execution for Chemistry and Physics Students'
    ],
    howTo: [
      {
        title: 'Select Calculation Variable',
        desc: 'Choose whether you want to calculate Density, Mass, or Volume.'
      },
      {
        title: 'Enter the Two Known Values',
        desc: 'Input the measurements and select their units (e.g. grams and cubic centimeters).'
      },
      {
        title: 'Review the Calculated Result',
        desc: 'Inspect the resulting value in multiple standard units and compare against common materials.'
      }
    ],
    faq: [
      {
        question: 'What is the standard formula for calculating density?',
        answer: 'Density is defined as mass per unit volume: ρ = m / V, where ρ (rho) is density, m is mass, and V is volume.'
      },
      {
        question: 'What is the density of pure water at standard room temperature?',
        answer: 'Pure liquid water has a density of approximately 1.000 g/cm³ (or 1,000 kg/m³ and 1.000 g/mL) at 4°C.'
      },
      {
        question: 'How do I convert density from g/cm³ to kg/m³?',
        answer: 'To convert from g/cm³ to kg/m³, multiply by 1,000. For example, aluminum has a density of 2.70 g/cm³, which equals 2,700 kg/m³.'
      },
      {
        question: 'Can I find the volume of an object if I know its weight and material?',
        answer: 'Yes. Set the calculator to solve for Volume (V = m / ρ), select your material from the density library, and enter its mass.'
      }
    ]
  },

  'screen-size-calculator': {
    title: 'Screen Size Calculator — Monitor Dimensions, Area & PPI Online',
    navTitle: 'Screen Size Calc',
    seoTitle: 'Screen Size Calculator — Monitor Dimensions, Area & PPI | Zubware',
    description: 'Calculate monitor physical width, height, viewable area, and pixel density (PPI) online from diagonal display size and aspect ratio with zero math.',
    features: [
      'Calculates Physical Screen Width, Height & Total Surface Area',
      'Pixel Density (PPI / Pixels Per Inch) & Dot Pitch Calculations',
      'Aspect Ratio Presets (16:9, 16:10, 21:9 Ultrawide, 32:9 Superwide, 4:3)',
      'Resolution Presets (1080p FHD, 1440p QHD, 4K UHD, 5K, 8K)',
      'Dual Unit Support in Inches and Centimeters',
      'Compare Display Real Estate for Dual-Monitor Setups'
    ],
    howTo: [
      {
        title: 'Enter Diagonal Screen Size',
        desc: 'Type your monitor, laptop, or TV diagonal measurement in inches (e.g. 27" or 34").'
      },
      {
        title: 'Select Aspect Ratio and Resolution',
        desc: 'Choose your aspect ratio (e.g. 16:9) and screen resolution (e.g. 2560×1440).'
      },
      {
        title: 'Review Dimensions and Pixel Density',
        desc: 'Inspect exact physical width, height, surface area in square inches, and pixel density (PPI).'
      }
    ],
    faq: [
      {
        question: 'Why does an ultrawide 34-inch monitor have a different height than a 16:9 34-inch monitor?',
        answer: 'Because diagonal measurements span corner to corner, wider aspect ratios (like 21:9) distribute diagonal length horizontally, resulting in less vertical height and smaller total surface area than a square-ish 16:9 screen of the same diagonal.'
      },
      {
        question: 'What is PPI and why does pixel density matter for monitors?',
        answer: 'PPI (Pixels Per Inch) measures display sharpness. Higher PPI values (like 110+ PPI for desktop monitors or 200+ PPI for laptops) result in crisp text without visible pixelation.'
      },
      {
        question: 'What is the ideal desktop monitor PPI for clear text rendering?',
        answer: 'A density of 100 to 120 PPI is considered the sweet spot for standard desktop viewing distances without requiring OS display scaling.'
      },
      {
        question: 'Can I calculate dimensions in centimeters instead of inches?',
        answer: 'Yes. The calculator toggles seamlessly between Imperial inches and Metric centimeters.'
      }
    ]
  },

  'torque-calculator': {
    title: 'Torque Calculator — Rotational Force, Distance & RPM Online',
    navTitle: 'Torque Calculator',
    seoTitle: 'Torque Calculator — Rotational Force, Distance & RPM | Zubware',
    description: 'Calculate mechanical rotational torque from applied force and lever arm radius or motor power and RPM online. Supports metric and imperial units.',
    features: [
      'Calculates Torque from Lever Arm Distance, Force & Angle (τ = r × F × sin θ)',
      'Calculates Motor Rotational Torque from Horsepower/kW & RPM',
      'Comprehensive Unit Conversion (N·m, ft-lb, in-lb, kgf·m, dyn·cm)',
      'Solves for Any Missing Variable (Torque, Force, Radius, or Power)',
      'Visual Mechanical Diagram and Engineering Formulas',
      'Instant In-Browser Calculations for Automotive and Physics'
    ],
    howTo: [
      {
        title: 'Choose Calculation Mode',
        desc: 'Select whether to calculate torque from mechanical lever force or electric motor power and RPM.'
      },
      {
        title: 'Input Known Values and Angles',
        desc: 'Enter force, lever arm distance, angle of application, or motor power and speed.'
      },
      {
        title: 'Review Torque in N·m and ft-lb',
        desc: 'View calculated rotational torque converted across international engineering units.'
      }
    ],
    faq: [
      {
        question: 'What is the fundamental formula for calculating torque?',
        answer: 'Torque (τ) is calculated as τ = r × F × sin(θ), where r is the lever arm distance, F is the applied force, and θ is the angle between the lever arm and the force vector.'
      },
      {
        question: 'How do you calculate torque from electric motor horsepower and RPM?',
        answer: 'In imperial units, Torque (ft-lb) = (Horsepower × 5,252) / RPM. In metric units, Torque (N·m) = (Power in Watts × 9.5488) / RPM.'
      },
      {
        question: 'How do foot-pounds (ft-lb) convert to Newton-meters (N·m)?',
        answer: '1 foot-pound is approximately equal to 1.3558 Newton-meters (N·m). 1 N·m is equal to approximately 0.7376 ft-lb.'
      },
      {
        question: 'Why does applying force at 90 degrees produce maximum torque?',
        answer: 'Because the sine of 90 degrees equals 1.0 (sin 90° = 1), delivering 100% of the applied force perpendicularly into rotational work.'
      }
    ]
  },

  'linear-regression-calculator': {
    title: 'Linear Regression Calculator — Best Fit Line y = mx + b Online',
    navTitle: 'Linear Regression',
    seoTitle: 'Linear Regression Calculator — Best Fit Line y = mx + b | Zubware',
    description: 'Calculate linear regression equations, slope, y-intercept, and correlation coefficient r online. Generate trendline plots with value predictions.',
    features: [
      'Computes Least Squares Best Fit Line Equation (y = mx + b)',
      'Calculates Slope (m), Y-Intercept (b), and Standard Error',
      'Computes Pearson Correlation (r) & Coefficient of Determination (R²)',
      'Interactive Scatter Plot with Regression Trendline Visualization',
      'Value Prediction Tool to Forecast Y for Any Given X Input',
      'Parses Paired (X, Y) Coordinates from Tables or CSV Paste'
    ],
    howTo: [
      {
        title: 'Enter Paired (X, Y) Data Points',
        desc: 'Type or paste coordinate pairs separated by commas, spaces, or tabs.'
      },
      {
        title: 'Calculate Best-Fit Equation',
        desc: 'The tool computes least-squares regression statistics, slope, intercept, and correlation coefficient.'
      },
      {
        title: 'Review Trendline and Forecast Y',
        desc: 'Inspect the scatter chart and enter new X values to predict expected Y outputs.'
      }
    ],
    faq: [
      {
        question: 'What does the Pearson correlation coefficient (r) indicate?',
        answer: 'The correlation coefficient r ranges from -1 to +1. Values near +1 indicate a strong positive linear relationship, values near -1 indicate a strong negative relationship, and values near 0 indicate no linear correlation.'
      },
      {
        question: 'What is the meaning of the R² (coefficient of determination) value?',
        answer: 'R² measures the proportion of variance in the dependent variable (Y) that is predictable from the independent variable (X). An R² of 0.85 means 85% of variance is explained by the linear model.'
      },
      {
        question: 'Can I use this calculator to predict future values?',
        answer: 'Yes. Use the built-in prediction box to plug in any X value into the resulting y = mx + b equation to calculate the predicted Y value.'
      },
      {
        question: 'How many data points are needed for linear regression?',
        answer: 'You need at least two distinct points to form a line, but 5 or more points are recommended for meaningful statistical correlation.'
      }
    ]
  },

  // ==========================================
  // SECURITY, PRIVACY & PRODUCTIVITY (9 tools)
  // ==========================================
  'barcode-scanner': {
    title: 'Barcode Scanner Online — Scan 1D & 2D Barcodes Free in Browser',
    navTitle: 'Barcode Scanner',
    seoTitle: 'Barcode Scanner Online — Scan 1D & 2D Barcodes Free | Zubware',
    description: 'Scan and decode 1D and 2D barcodes using your device camera or uploaded images online. Read UPC, EAN, Code 128, and QR codes directly in your browser.',
    features: [
      'Real-Time Live Camera Barcode Scanning on Mobile & Desktop',
      'Upload & Decode Image Files (PNG, JPG, WebP)',
      'Supports 1D Barcodes (UPC-A, EAN-13, Code 128, Code 39, ITF)',
      'Supports 2D Barcodes (QR Code, Data Matrix, PDF417)',
      'One-Click Clipboard Copying & Google Product Search Link',
      '100% Client-Side Barcode Recognition with Zero Server Uploads'
    ],
    howTo: [
      {
        title: 'Enable Camera or Upload an Image',
        desc: 'Point your camera at a barcode or drop an image file containing a barcode into the scanner.'
      },
      {
        title: 'Automatic Detection and Decode',
        desc: 'The tool uses hardware-accelerated computer vision to locate and decode the barcode format.'
      },
      {
        title: 'Copy Scanned Data or Search Product',
        desc: 'Copy the numeric code or text to your clipboard, or click Search to look up product information.'
      }
    ],
    faq: [
      {
        question: 'Which barcode formats are supported by this scanner?',
        answer: 'It decodes common retail 1D barcodes (UPC-A, UPC-E, EAN-13, EAN-8), industrial barcodes (Code 128, Code 39, ITF), and 2D matrices (QR codes, Data Matrix).'
      },
      {
        question: 'Can I scan barcodes using my smartphone camera?',
        answer: 'Yes. The scanner works in mobile web browsers (Safari, Chrome, Firefox) using native WebRTC camera streams.'
      },
      {
        question: 'Is my camera video stream or barcode data sent to a server?',
        answer: 'No. Camera frames are processed entirely on your device via client-side Barcode Detection and WebAssembly libraries.'
      },
      {
        question: 'Can I scan a barcode from an image or screenshot saved on my computer?',
        answer: 'Yes. You can drag and drop any image file to read barcodes without needing a webcam.'
      }
    ]
  },

  'calendar-notes': {
    title: 'Calendar Notes — Private Monthly Calendar & Daily Planner Online',
    navTitle: 'Calendar Notes',
    seoTitle: 'Calendar Notes — Private Monthly Calendar & Daily Planner | Zubware',
    description: 'Organize daily tasks and journal notes on an interactive monthly calendar online. Keep notes stored locally in your browser with private offline access.',
    features: [
      'Interactive Full-Month Calendar View with Date Highlighting',
      'Dedicated Daily Journaling & Task Checklist Notes',
      'Visual Activity Dots Indicating Days with Saved Notes',
      'Local Browser Persistence with Zero Account Requirements',
      'Export and Backup Notes to Text or JSON Files',
      '100% Private Offline Execution Protecting Personal Schedules'
    ],
    howTo: [
      {
        title: 'Select a Calendar Date',
        desc: 'Click on any day of the current, past, or future month to open its daily notes panel.'
      },
      {
        title: 'Write Daily Notes and Reminders',
        desc: 'Type meeting notes, daily priorities, journal thoughts, or tasks for that specific date.'
      },
      {
        title: 'Navigate Months and Export Data',
        desc: 'Browse between months with indicator dots showing active notes, and backup your entries anytime.'
      }
    ],
    faq: [
      {
        question: 'Where are my daily calendar notes stored?',
        answer: 'All notes are stored in your web browser’s local storage (LocalStorage). Your entries are never uploaded or synced to external servers.'
      },
      {
        question: 'Will my calendar notes be saved if I close or refresh the tab?',
        answer: 'Yes. Your notes persist automatically in your browser on this device across browser restarts.'
      },
      {
        question: 'Can I export a backup of all my calendar entries?',
        answer: 'Yes. You can export all your notes into a clean JSON or text backup file to transfer or archive your records.'
      },
      {
        question: 'How do I identify which dates have notes attached?',
        answer: 'Dates with saved notes display a visual marker dot on the calendar grid, making it easy to see your active days at a glance.'
      }
    ]
  },

  'clipboard-history': {
    title: 'Clipboard History Manager — Save & Search Copied Snippets Online',
    navTitle: 'Clipboard History',
    seoTitle: 'Clipboard History Manager — Save & Search Snippets | Zubware',
    description: 'Store and organize copied text snippets, code blocks, and templates locally online. Search your personal clipboard history with one-click re-copying.',
    features: [
      'Save and Organize Frequently Used Text Snippets and Code',
      'Instant Real-Time Search Across Snippet Titles & Contents',
      'One-Click Re-Copy to System Clipboard with Visual Toast Feedback',
      'Custom Categorization and Tagging for Quick Access',
      'Local Browser Storage with Import & Export Backup Support',
      'Complete Privacy with Zero Cloud Synchronization'
    ],
    howTo: [
      {
        title: 'Add a Copied Snippet',
        desc: 'Paste any text, email response, code block, or message template into the manager.'
      },
      {
        title: 'Organize and Tag Items',
        desc: 'Assign descriptive titles or category tags so you can find them easily later.'
      },
      {
        title: 'Search and One-Click Copy',
        desc: 'Use the instant search bar to find any saved snippet and click Copy to place it back onto your clipboard.'
      }
    ],
    faq: [
      {
        question: 'Can this tool replace repetitive typing of email replies and code templates?',
        answer: 'Yes. It acts as a personal snippet library where you can keep canned responses, frequently used links, and code snippets ready for instant copying.'
      },
      {
        question: 'Is my clipboard data transmitted across the internet?',
        answer: 'No. Everything stays in your browser’s local storage on your device. No text or snippets are ever transmitted to any server.'
      },
      {
        question: 'Can I search through my saved snippets?',
        answer: 'Yes. The real-time search filter checks snippet titles and text bodies instantly as you type.'
      },
      {
        question: 'How do I backup or transfer my snippets to another device?',
        answer: 'You can export all your saved items into a JSON backup file and import it into another browser anytime.'
      }
    ]
  },

  'daily-planner': {
    title: 'Daily Routine Planner — Morning, Afternoon & Evening Focus Online',
    navTitle: 'Daily Planner',
    seoTitle: 'Daily Routine Planner — Morning, Afternoon & Evening | Zubware',
    description: 'Structure your daily schedule into Morning, Afternoon, and Evening focus blocks online. Track task checkboxes and priorities stored in your browser.',
    features: [
      'Time-Blocked Sections for Morning, Afternoon & Evening Focus',
      'Daily Top 3 Priorities Highlight Card for Goal Alignment',
      'Interactive Checkboxes with Progress Percentage Tracking',
      'Dedicated Notes and Daily Gratitude Journaling Section',
      'Automatic Local Browser Storage for Seamless Daily Routines',
      '100% Private Offline Planning Without Account Sign-In'
    ],
    howTo: [
      {
        title: 'Set Top 3 Daily Priorities',
        desc: 'Define the three most critical goals you want to accomplish today.'
      },
      {
        title: 'Organize Tasks by Time Blocks',
        desc: 'Add morning, afternoon, and evening action items into dedicated time blocks.'
      },
      {
        title: 'Check Off Completed Items',
        desc: 'Mark tasks complete throughout the day and monitor your daily productivity progress.'
      }
    ],
    faq: [
      {
        question: 'Why is time blocking into Morning, Afternoon, and Evening effective?',
        answer: 'Breaking your day into three structured blocks prevents overwhelm, aligns high-energy tasks with morning hours, and gives clear structure to your day.'
      },
      {
        question: 'What is the purpose of setting "Top 3 Priorities"?',
        answer: 'Focusing on three core priorities ensures you achieve your most important outcomes each day even if minor errands get rescheduled.'
      },
      {
        question: 'Will my daily routine planner save my tasks if I close the browser?',
        answer: 'Yes. All daily tasks, priorities, and notes are saved automatically in your browser’s local storage.'
      },
      {
        question: 'Can I clear my tasks at the end of the day to start fresh tomorrow?',
        answer: 'Yes. A one-click reset option allows you to clear completed items or reset the planner for a productive new morning.'
      }
    ]
  },

  'habit-tracker': {
    title: 'Daily Habit Tracker — Build Positive Habits & Track Streaks Online',
    navTitle: 'Habit Tracker',
    seoTitle: 'Daily Habit Tracker — Build Positive Habits & Streaks | Zubware',
    description: 'Track daily habits, build consistent routines, and celebrate streak milestones online. View weekly completion progress stored privately in your browser.',
    features: [
      'Track Unlimited Custom Daily Habits (Health, Work, Learning, Fitness)',
      'Consecutive Day Streak Counters & Longest Streak Records',
      'Weekly Multi-Day Completion Grid Visualization',
      'Daily Completion Percentage Progress Bar',
      'Persistent Local Storage in Browser Without Cloud Accounts',
      'Fast, Intuitive One-Click Check-In Interface'
    ],
    howTo: [
      {
        title: 'Add Your Target Habits',
        desc: 'Create habits you want to cultivate (e.g. Read 20 Mins, Drink Water, Morning Workout).'
      },
      {
        title: 'Check In Daily',
        desc: 'Click each habit’s checkbox every day you complete it to maintain your streak.'
      },
      {
        title: 'Monitor Streaks and Consistency',
        desc: 'Review your 7-day completion grid and watch your consecutive streak counts grow.'
      }
    ],
    faq: [
      {
        question: 'How do habit streaks help build lasting routines?',
        answer: 'Visual streak counters create positive behavioral reinforcement, motivating you to maintain daily consistency and avoid breaking the chain.'
      },
      {
        question: 'How many habits should I track simultaneously?',
        answer: 'Behavioral experts recommend starting with 3 to 5 key habits to build solid momentum before adding additional routines.'
      },
      {
        question: 'Where is my habit history stored?',
        answer: 'All habit definitions, completion checks, and streak records are stored exclusively in your browser’s LocalStorage on this device.'
      },
      {
        question: 'Can I edit or delete habits later?',
        answer: 'Yes. You can edit habit names or delete completed habit goals at any time.'
      }
    ]
  },

  'pomodoro-timer': {
    title: 'Pomodoro Focus Timer — 25-Minute Work & Break Intervals Online',
    navTitle: 'Pomodoro Timer',
    seoTitle: 'Pomodoro Focus Timer — 25-Minute Work & Break Intervals | Zubware',
    description: 'Boost productivity with 25-minute Pomodoro focus intervals and structured breaks online. Features customizable session timers and soothing audio chimes.',
    features: [
      'Standard 25-Minute Focus, 5-Minute Short Break & 15-Minute Long Break',
      'Customizable Interval Durations for Flexible Deep Work Workflows',
      'Pleasant Audio Chime Notifications via Web Audio Synthesis',
      'Circular Countdown Visual Progress Indicator with Pause & Reset',
      'Completed Pomodoro Session Counter Tracking Daily Focus',
      'Zero Ads, Signups, or Disruptions in a Clean Minimalist UI'
    ],
    howTo: [
      {
        title: 'Select a Focus Session',
        desc: 'Start with the classic 25-minute Pomodoro interval or adjust custom minutes.'
      },
      {
        title: 'Focus Without Distraction',
        desc: 'Work on your single primary task until the timer chimes signaling the session end.'
      },
      {
        title: 'Take a Rest and Repeat',
        desc: 'Take a 5-minute short break to refresh. After 4 completed pomodoros, enjoy an extended 15-minute long break.'
      }
    ],
    faq: [
      {
        question: 'What is the Pomodoro Technique and how does it improve productivity?',
        answer: 'Developed by Francesco Cirillo, it uses 25-minute intervals of focused deep work separated by 5-minute breaks to maintain high concentration and prevent mental fatigue.'
      },
      {
        question: 'Can I customize the timer lengths for work and break periods?',
        answer: 'Yes. You can adjust the minutes for focus sessions, short breaks, and long breaks to fit your personal workflow rhythm.'
      },
      {
        question: 'Does the timer play an audible alert when a session ends?',
        answer: 'Yes. It plays a gentle synthesized audio chime when each interval finishes, with an optional mute toggle.'
      },
      {
        question: 'Does the timer continue running if I switch to another tab?',
        answer: 'Yes. The timer updates continuously in background browser tabs and updates the page title with remaining time.'
      }
    ]
  },

  'secure-notes': {
    title: 'Secure Offline Notes — Private Local Browser Notepad Online',
    navTitle: 'Secure Notes',
    seoTitle: 'Secure Offline Notes — Private Local Browser Notepad | Zubware',
    description: 'Write, organize, and pin private notes stored safely in your browser memory online. Search notes instantly and export text with zero cloud storage.',
    features: [
      'Private Browser Notepad with Zero Server Transmission',
      'Instant Full-Text Search Across Note Titles and Bodies',
      'Pin Important Notes to the Top of Your Workspace',
      'Export Notes to TXT Files or Complete JSON Backup',
      'Clean Distraction-Free Markdown-Friendly Writing Canvas',
      'Automatic Local Storage Saving on Every Keystroke'
    ],
    howTo: [
      {
        title: 'Create a New Note',
        desc: 'Click New Note to start drafting thoughts, draft messages, or meeting notes.'
      },
      {
        title: 'Organize and Pin Essentials',
        desc: 'Assign titles, format text, and click the pin icon to keep high-priority notes at the top.'
      },
      {
        title: 'Search or Export Anytime',
        desc: 'Use instant search to retrieve notes and download text backups whenever needed.'
      }
    ],
    faq: [
      {
        question: 'Are my notes stored on any cloud server or database?',
        answer: 'No. Notes are stored exclusively inside your device browser’s local storage. Nobody else can access or view your private notes.'
      },
      {
        question: 'Do I need an account or login to write and save notes?',
        answer: 'No. The notepad is completely serverless and requires no login, email address, or account setup.'
      },
      {
        question: 'Can I export my notes to transfer them to another device?',
        answer: 'Yes. You can export individual notes as text files or download all notes as a JSON backup to import onto another computer.'
      },
      {
        question: 'What happens if I accidentally close the tab while writing?',
        answer: 'Your text saves automatically with every keystroke, so your notes will be right where you left them when you return.'
      }
    ]
  },

  'todo-list': {
    title: 'Todo List & Task Manager — Priority Checklist Online Free',
    navTitle: 'Todo List',
    seoTitle: 'Todo List & Task Manager — Priority Checklist Online | Zubware',
    description: 'Organize daily tasks with priority tags, category filters, and progress tracking online. Manage your personal to-do list stored safely in your browser.',
    features: [
      'Priority Level Tagging (High, Medium, Low Priority)',
      'Custom Task Categorization (Work, Personal, Errands, Projects)',
      'Filter Views for Active, Completed & All Task Items',
      'Visual Progress Bar Indicating Completed Task Percentages',
      'Persistent Local Storage in Browser with One-Click Clear Completed',
      '100% Private Offline Task Management Without Cloud Sync'
    ],
    howTo: [
      {
        title: 'Add a New Task',
        desc: 'Type your task description, select a priority level, and choose a category.'
      },
      {
        title: 'Organize and Filter Tasks',
        desc: 'Filter by priority or active status to focus on your most critical immediate objectives.'
      },
      {
        title: 'Check Off Completed Items',
        desc: 'Check off finished tasks and watch your daily progress bar reach 100%.'
      }
    ],
    faq: [
      {
        question: 'How do priority levels help manage daily task lists?',
        answer: 'Tagging tasks as High, Medium, or Low allows you to focus on urgent items first and filter out less important tasks during busy days.'
      },
      {
        question: 'Is my to-do list saved automatically?',
        answer: 'Yes. All tasks, priority flags, and completion states are stored in your browser’s local storage on this computer.'
      },
      {
        question: 'Can I clear all completed tasks at once?',
        answer: 'Yes. Click "Clear Completed" to tidy up your list and remove checked-off items while keeping active tasks in place.'
      },
      {
        question: 'Do I need to sign up for an account to use this task manager?',
        answer: 'No. The tool is 100% free and ready to use immediately without any sign-up or subscription.'
      }
    ]
  },

  'weekly-planner': {
    title: '7-Day Weekly Planner — Schedule Monday to Sunday Online Free',
    navTitle: 'Weekly Planner',
    seoTitle: '7-Day Weekly Planner — Schedule Monday to Sunday Online | Zubware',
    description: 'Plan your weekly schedule and daily commitments across Monday through Sunday online. Organize weekly tasks and checklists stored locally in your browser.',
    features: [
      '7 Dedicated Columns for Monday Through Sunday Scheduling',
      'Per-Day Task Creation with Checkboxes and Completion Tracking',
      'Weekly Priority Focus Banner for Key Milestones',
      'Week-by-Week Navigation and Historical Review',
      'Automatic Local Browser Storage for Complete Schedule Privacy',
      'Clean Responsive Layout Optimized for Desktop & Mobile'
    ],
    howTo: [
      {
        title: 'Set Your Weekly Priority',
        desc: 'Define the overarching goal or main milestone you want to achieve this week.'
      },
      {
        title: 'Map Tasks Across the 7 Days',
        desc: 'Add appointments, workouts, deadlines, and study sessions under each specific day of the week.'
      },
      {
        title: 'Track Daily Progress and Check Off Items',
        desc: 'Check off tasks as you move through Monday to Sunday to maintain weekly momentum.'
      }
    ],
    faq: [
      {
        question: 'How does a 7-day weekly planner differ from a daily to-do list?',
        answer: 'A weekly planner lets you balance workloads across the entire week, ensuring you don’t overload single days and can easily schedule recurring commitments.'
      },
      {
        question: 'Where is my weekly schedule stored?',
        answer: 'All weekly items and checklists are saved inside your browser’s local storage on your device. Nothing is stored on external cloud servers.'
      },
      {
        question: 'Can I view or plan upcoming weeks in advance?',
        answer: 'Yes. Week navigation buttons let you switch between weeks to plan ahead or review past achievements.'
      },
      {
        question: 'Can I use this planner on a mobile phone or tablet?',
        answer: 'Yes. The layout adapts responsively to smartphones and tablets, allowing easy mobile scheduling on the go.'
      }
    ]
  },

  // ==========================================
  // TEXT & WRITING TOOLS (14 tools)
  // ==========================================
  'reading-time-calculator': {
    title: 'Reading Time Calculator — Estimate Reading Duration Online',
    navTitle: 'Reading Time',
    seoTitle: 'Reading Time Calculator — Estimate Reading Duration | Zubware',
    description: 'Estimate silent reading time and speaking duration for articles, speeches, or scripts online. Calculate total word counts and adjustable reading speeds.',
    features: [
      'Calculates Silent Reading Time (Adjustable Words Per Minute)',
      'Estimates Public Speaking & Presentation Duration (130-150 WPM)',
      'Detailed Text Metrics (Word Count, Character Count, Sentences, Paragraphs)',
      'Adjustable Reading Speed Slider (Slow, Average, Fast Reader)',
      'Readability Score and Average Word Length Analytics',
      'Instant Client-Side Text Processing with Zero Data Logging'
    ],
    howTo: [
      {
        title: 'Paste Text or Script',
        desc: 'Paste your blog post, speech, manuscript, or presentation script into the text analyzer.'
      },
      {
        title: 'Adjust Reading Speed',
        desc: 'Use the default 200–250 WPM average reading rate or customize reading/speaking speeds.'
      },
      {
        title: 'Review Duration Metrics',
        desc: 'View estimated reading time in minutes and seconds alongside comprehensive word count analytics.'
      }
    ],
    faq: [
      {
        question: 'What is the average human reading speed used for calculation?',
        answer: 'The standard silent reading speed for adults is between 200 and 250 words per minute (WPM), with 225 WPM commonly used across digital publishing platforms.'
      },
      {
        question: 'How does speaking duration differ from silent reading time?',
        answer: 'People speak much slower than they read silently. Average public speaking, presentations, and podcast speech run at 130 to 150 words per minute.'
      },
      {
        question: 'Can I use this tool to time speeches and video voiceovers?',
        answer: 'Yes. The speaking time estimate is ideal for pacing conference presentations, YouTube scripts, and commercial voiceovers.'
      },
      {
        question: 'Is my written text or unpublished book manuscript uploaded to a server?',
        answer: 'No. All word counting and time calculations execute locally in your browser memory.'
      }
    ]
  },

  'remove-duplicate-lines': {
    title: 'Remove Duplicate Lines — Deduplicate Text Lists Online Free',
    navTitle: 'Remove Duplicates',
    seoTitle: 'Remove Duplicate Lines — Deduplicate Text Lists Online | Zubware',
    description: 'Remove duplicate lines from text lists, emails, keywords, and code online. Configure case sensitivity and trimming options with instant deduplication.',
    features: [
      'Instant One-Click Line Deduplication for Text & Lists',
      'Case-Sensitive vs Case-Insensitive Matching Toggles',
      'Trim Leading and Trailing Whitespace Before Comparison',
      'Preserve Original Line Order or Sort Output Alphabetically',
      'Detailed Statistics Showing Original, Duplicate & Unique Counts',
      '100% In-Browser Execution for Private Email and Keyword Lists'
    ],
    howTo: [
      {
        title: 'Paste Your Text List',
        desc: 'Input lists of emails, URLs, keywords, or code lines into the editor box.'
      },
      {
        title: 'Choose Deduplication Options',
        desc: 'Toggle case sensitivity, whitespace trimming, and whether to remove empty lines.'
      },
      {
        title: 'Copy Cleaned Unique Lines',
        desc: 'Review the duplicate count removed and copy the deduplicated list with one click.'
      }
    ],
    faq: [
      {
        question: 'How does case sensitivity affect duplicate removal?',
        answer: 'With case sensitivity enabled, "Apple" and "apple" are treated as distinct lines. In case-insensitive mode, they are identified as duplicates and merged.'
      },
      {
        question: 'Can I deduplicate massive email or keyword lists safely?',
        answer: 'Yes. The tool runs in client-side JavaScript, meaning lists with thousands of entries are deduplicated in milliseconds without server limits.'
      },
      {
        question: 'Does the tool preserve the original order of my list?',
        answer: 'Yes. By default it keeps the first occurrence of each unique line in its original order, with an optional toggle to sort alphabetically.'
      },
      {
        question: 'Are my proprietary email lists or keywords uploaded to Zubware servers?',
        answer: 'No. Deduplication executes entirely in your local browser runtime with zero network data transfer.'
      }
    ]
  },

  'remove-empty-lines': {
    title: 'Remove Empty Lines — Strip Blank Lines & Whitespace Online',
    navTitle: 'Remove Empty Lines',
    seoTitle: 'Remove Empty Lines — Strip Blank Lines & Whitespace | Zubware',
    description: 'Remove empty lines, blank spaces, and unnecessary paragraph breaks from text online. Clean up messy text formatting with one-click clipboard copying.',
    features: [
      'Strips All Blank & Empty Lines with a Single Click',
      'Normalize Mode: Compresses Multiple Blank Lines into Single Breaks',
      'Trims Leading & Trailing Whitespace Across All Lines',
      'Handles Windows (CRLF), Unix (LF) & Mac Line Endings',
      'Live Metrics for Lines Removed and Resulting Line Count',
      'Instant In-Browser Text Cleaning with Zero Cloud Logging'
    ],
    howTo: [
      {
        title: 'Paste Text with Blank Lines',
        desc: 'Paste code, copied documents, or articles containing excessive empty lines.'
      },
      {
        title: 'Select Cleaning Rule',
        desc: 'Choose to strip all empty lines completely or compress multiple blank lines into a single neat paragraph break.'
      },
      {
        title: 'Copy Cleaned Text',
        desc: 'Click Copy to take your condensed, cleanly formatted text to your document or code editor.'
      }
    ],
    faq: [
      {
        question: 'What constitutes an "empty line" in this tool?',
        answer: 'An empty line is any line with zero characters or lines containing only whitespace (spaces, tabs, carriage returns) with no visible text.'
      },
      {
        question: 'Can I keep single paragraph breaks while removing triple or quadruple blank lines?',
        answer: 'Yes. Select the "Compress Multiple Blank Lines" option to normalize double or triple line breaks into clean single paragraph spacing.'
      },
      {
        question: 'Can this tool fix messy text copied from PDFs or OCR scanners?',
        answer: 'Yes. It quickly removes the random empty lines and broken paragraphs frequently introduced when copying from PDF files.'
      },
      {
        question: 'Is my text stored anywhere online during cleaning?',
        answer: 'No. All string manipulation takes place locally inside your browser memory.'
      }
    ]
  },

  'sort-lines': {
    title: 'Sort Lines Online — Alphabetical & Numeric Line Sorter Free',
    navTitle: 'Sort Lines',
    seoTitle: 'Sort Lines Online — Alphabetical & Numeric Line Sorter | Zubware',
    description: 'Sort lines of text alphabetically, numerically, by length, or in reverse order online. Organize keyword lists and CSV files with instant text sorting.',
    features: [
      'Alphabetical Sorting (A to Z) & Reverse Alphabetical (Z to A)',
      'Natural Numeric Sorting (Orders 1, 2, 10 Correctly)',
      'Sort by Line Length (Shortest to Longest / Longest to Shortest)',
      'Random Shuffle Mode to Randomize List Order',
      'Case Sensitive / Insensitive Sorting Toggles',
      'Optional Integrated Duplicate Removal While Sorting'
    ],
    howTo: [
      {
        title: 'Paste Text Lines',
        desc: 'Enter a list of items, names, keywords, or data records.'
      },
      {
        title: 'Choose Sort Method',
        desc: 'Select alphabetical, reverse, numeric, length-based, or random shuffle order.'
      },
      {
        title: 'Copy Sorted Output',
        desc: 'Review the newly organized list and copy the sorted lines directly to your clipboard.'
      }
    ],
    faq: [
      {
        question: 'What is natural numeric sorting versus standard alphabetical sorting?',
        answer: 'Standard alphabetical sorting puts "10" before "2" because "1" precedes "2". Natural numeric sorting recognizes numerical values, correctly ordering 1, 2, 3... 10.'
      },
      {
        question: 'Can I randomly shuffle lines to randomize a list?',
        answer: 'Yes. Select Random Shuffle to reorder list items into an unpredictable random sequence using the Fisher-Yates algorithm.'
      },
      {
        question: 'Can I sort lines by character length?',
        answer: 'Yes. You can sort lines from shortest to longest or longest to shortest, which is useful for domain names and SEO keyword grouping.'
      },
      {
        question: 'Are large text files supported?',
        answer: 'Yes. Lists with thousands of lines sort in milliseconds within your browser memory.'
      }
    ]
  },

  'lorem-ipsum-generator': {
    title: 'Lorem Ipsum Generator — Dummy Placeholder Text Online Free',
    navTitle: 'Lorem Ipsum',
    seoTitle: 'Lorem Ipsum Generator — Dummy Placeholder Text Online | Zubware',
    description: 'Generate custom Latin placeholder dummy text by paragraphs, sentences, or word counts online. Copy formatted mock text for design and layout mockups.',
    features: [
      'Generate by Exact Paragraphs, Sentences, or Word Counts',
      'Classic "Lorem ipsum dolor sit amet..." Opening Toggle',
      'Optional HTML Formatting (Wraps Output in <p> Tags)',
      'Generates Natural Latin Vocabulary Distribution',
      'One-Click Clipboard Copying for Web Designers and Developers',
      'Instant Client-Side Generation with Zero Network Delays'
    ],
    howTo: [
      {
        title: 'Select Unit and Quantity',
        desc: 'Choose whether you need paragraphs, sentences, or a specific number of words (e.g. 5 paragraphs).'
      },
      {
        title: 'Configure Options',
        desc: 'Toggle whether to start with the classic "Lorem ipsum" opening or wrap in HTML markup tags.'
      },
      {
        title: 'Copy Placeholder Text',
        desc: 'Click Copy to paste dummy filler text into your Figma, Webflow, or code mockup layouts.'
      }
    ],
    faq: [
      {
        question: 'What is Lorem Ipsum and why is it used in graphic design?',
        answer: 'Lorem Ipsum is standard placeholder dummy text derived from Cicero’s 45 BC Latin treatise. Designers use it because its natural letter distribution prevents viewers from getting distracted by readable content.'
      },
      {
        question: 'Can I generate exact word counts for character-constrained layouts?',
        answer: 'Yes. Switch to Word mode and specify the exact number of words needed for your button, card, or banner design.'
      },
      {
        question: 'Can it output HTML paragraph tags (<p>)?',
        answer: 'Yes. Enabling the HTML tags option automatically wraps each paragraph in `<p>` and `</p>` tags for immediate pasting into code.'
      },
      {
        question: 'Is this dummy text generator free with unlimited use?',
        answer: 'Yes. It generates unlimited filler text instantly in your browser with no sign-ups or limits.'
      }
    ]
  },

  'wide-text-generator': {
    title: 'Wide Text Generator — Fullwidth Aesthetic Vaporwave Font Online',
    navTitle: 'Wide Text',
    seoTitle: 'Wide Text Generator — Fullwidth Aesthetic Vaporwave Font | Zubware',
    description: 'Convert normal text into aesthetic fullwidth vaporwave text and spaced characters online. Copy wide aesthetic typography for social bios and usernames.',
    features: [
      'Converts Text to Unicode Fullwidth Characters (ｆｕｌｌｗｉｄｔｈ)',
      'Aesthetic Spaced Letter Mode (w i d e  t e x t) with Custom Spacing',
      'Universal Unicode Compatibility Across Discord, Twitter, Instagram & TikTok',
      'Real-Time Instant Preview as You Type',
      'One-Click Copy Button with Visual Feedback',
      '100% Client-Side In-Browser Typography Transformer'
    ],
    howTo: [
      {
        title: 'Enter Normal Text',
        desc: 'Type or paste standard words, usernames, or quotes into the input field.'
      },
      {
        title: 'Choose Aesthetic Style',
        desc: 'Select Fullwidth Japanese Zenkaku characters or spaced letter mode.'
      },
      {
        title: 'Copy Aesthetic Text',
        desc: 'Click Copy to use your vaporwave styled text on social media profiles, Discord, or gaming handles.'
      }
    ],
    faq: [
      {
        question: 'What is fullwidth Unicode text (ｗｉｄｅ ｔｅｘｔ)?',
        answer: 'Fullwidth characters originate from CJK (Chinese, Japanese, Korean) computing, where characters occupy the same width as Kanji glyphs. In internet culture, they are popular for vaporwave aesthetics.'
      },
      {
        question: 'Will wide text display properly on phones and social media apps?',
        answer: 'Yes. Because they are standard Unicode characters (U+FF01 to U+FF5E), they render natively across modern operating systems, Discord, Instagram, and TikTok.'
      },
      {
        question: 'Can I use wide text in gaming handles like Steam or Discord?',
        answer: 'Yes. Many gamers use fullwidth characters to create distinctive usernames and Discord nicknames.'
      },
      {
        question: 'Can I adjust the spacing between characters?',
        answer: 'Yes. You can switch to spaced typography mode and adjust the spacing slider for custom text width.'
      }
    ]
  },

  'text-reverser': {
    title: 'Text Reverser — Reverse Words, Letters & Backwards Text Online',
    navTitle: 'Text Reverser',
    seoTitle: 'Text Reverser — Reverse Words, Letters & Backwards Text | Zubware',
    description: 'Reverse text, flip word order, mirror letters backwards, or turn text upside down online. Transform sentences instantly with one-click clipboard copy.',
    features: [
      'Reverse Character Order (Reverses Letters Completely Backwards)',
      'Reverse Word Order (Maintains Letter Spelling, Reverses Sequence)',
      'Flip Text Upside Down Using Unicode Inverted Glyphs',
      'Reverse Each Line Individually for Code and Data Lists',
      'Instant Real-Time Reversal as You Type',
      'One-Click Clipboard Copying with Character Counter'
    ],
    howTo: [
      {
        title: 'Paste Text to Reverse',
        desc: 'Type or paste any phrase, sentence, or list into the input box.'
      },
      {
        title: 'Select Reversal Mode',
        desc: 'Choose to reverse all characters, reverse word order, flip upside down, or reverse lines.'
      },
      {
        title: 'Copy Transformed Text',
        desc: 'Click Copy to use your backwards text for puzzles, social media posts, or coding tests.'
      }
    ],
    faq: [
      {
        question: 'What is the difference between reversing characters and reversing word order?',
        answer: 'Reversing characters inverts every letter ("hello world" becomes "dlrow olleh"), while reversing word order maintains individual word spelling but flips sentence order ("world hello").'
      },
      {
        question: 'How does the upside-down text mode work?',
        answer: 'It maps standard Latin letters to equivalent upside-down Unicode characters (e.g. "a" becomes "ɐ", "e" becomes "ǝ") and reverses character direction.'
      },
      {
        question: 'Can this tool be used for testing palindromes?',
        answer: 'Yes. If a word or phrase produces the exact same string when reversed (ignoring spaces), it is a valid palindrome.'
      },
      {
        question: 'Are my private text inputs uploaded to a remote server?',
        answer: 'No. All string manipulations execute strictly within your browser runtime with zero network requests.'
      }
    ]
  },

  'remove-line-breaks': {
    title: 'Remove Line Breaks — Clean Text & Paragraph Formatter Online',
    navTitle: 'Remove Line Breaks',
    seoTitle: 'Remove Line Breaks — Clean Text & Paragraph Formatter | Zubware',
    description: 'Remove line breaks, carriage returns, and newlines from messy copied text online. Replace breaks with spaces or custom delimiters with instant preview.',
    features: [
      'Strips Hard Line Breaks, Carriage Returns & Newlines (\\n, \\r\\n)',
      'Replaces Line Breaks with Single Spaces, Commas, or Custom Delimiters',
      'Preserves Double Paragraph Breaks Option for Article Formatting',
      'Removes Trailing and Consecutive Whitespace Automatically',
      'Character and Word Count Summary Cards',
      '100% In-Browser Execution for Private Documents and Code'
    ],
    howTo: [
      {
        title: 'Paste Copied Text',
        desc: 'Paste messy text copied from PDF files, emails, or terminal outputs with broken line wraps.'
      },
      {
        title: 'Choose Replacement Delimiter',
        desc: 'Select whether to replace line breaks with spaces, commas, or semicolons, and choose if paragraphs should be preserved.'
      },
      {
        title: 'Copy Formatted Text',
        desc: 'Click Copy to take your seamless, continuous text to Word, Google Docs, or email drafts.'
      }
    ],
    faq: [
      {
        question: 'Why does text copied from PDF files often have awkward line breaks?',
        answer: 'PDFs store text in fixed-width visual layout lines rather than flowing paragraphs. Copying text brings along hard line breaks at the end of every line.'
      },
      {
        question: 'Can I keep paragraph breaks while removing line wraps within paragraphs?',
        answer: 'Yes. Enable the "Preserve Paragraph Breaks" setting to merge single line breaks into flowing sentences while retaining empty lines between paragraphs.'
      },
      {
        question: 'Can I replace line breaks with commas to format spreadsheet lists?',
        answer: 'Yes. Choose "Comma" as the replacement delimiter to convert a vertical list of items into a clean comma-separated list.'
      },
      {
        question: 'Is there any character limit on the text I can clean?',
        answer: 'Because the tool runs in local browser memory, you can clean articles, essays, and legal agreements of any length within seconds.'
      }
    ]
  },

  'text-cleaner': {
    title: 'Text Cleaner — Remove Extra Spaces, Tabs & HTML Tags Online',
    navTitle: 'Text Cleaner',
    seoTitle: 'Text Cleaner — Remove Extra Spaces, Tabs & HTML Tags | Zubware',
    description: 'Clean up messy text by stripping redundant spaces, tabs, HTML tags, and line breaks online. Normalize whitespace and formatting with instant preview.',
    features: [
      'Removes Consecutive Multiple Spaces and Replaces with Single Space',
      'Converts Tabs to Spaces & Trims Leading/Trailing Line Whitespace',
      'Strips HTML, XML & Web Markup Tags from Pasted Content',
      'Normalizes Curly Quotes, Smart Apostrophes & Dashes',
      'Removes Empty Blank Lines and Normalizes Paragraph Spacing',
      'Before & After Character, Word, and Line Reduction Metrics'
    ],
    howTo: [
      {
        title: 'Paste Unformatted or Scraped Text',
        desc: 'Paste text containing HTML tags, irregular spacing, tabs, or strange quotes.'
      },
      {
        title: 'Select Cleaning Rules',
        desc: 'Toggle which cleanup operations to apply (strip HTML, remove extra spaces, trim whitespace).'
      },
      {
        title: 'Copy Cleaned Text',
        desc: 'Review the character savings and copy your pristine, uniformly formatted text.'
      }
    ],
    faq: [
      {
        question: 'What types of formatting noise can this text cleaner remove?',
        answer: 'It removes multiple spaces, converts tab indents, strips HTML/XML tags, removes empty lines, and normalizes smart quotes and em-dashes into standard characters.'
      },
      {
        question: 'Can I strip HTML tags from web pages while keeping the actual text content?',
        answer: 'Yes. The "Strip HTML Tags" option strips all markup elements (like `<div>`, `<p>`, `<a>`) while preserving readable text.'
      },
      {
        question: 'Does this tool fix smart curly quotes for coding?',
        answer: 'Yes. It converts curly quotes (“ ” ‘ ’) into straight ASCII quotation marks (\' and ") that won’t trigger syntax errors in code or JSON.'
      },
      {
        question: 'Are my private documents sent to an external server?',
        answer: 'No. All string cleansing algorithms run strictly in your browser runtime via client-side regex.'
      }
    ]
  },

  'text-repeater': {
    title: 'Text Repeater — Repeat Words & Messages 10,000x Times Online',
    navTitle: 'Text Repeater',
    seoTitle: 'Text Repeater — Repeat Words & Messages 10,000x Online | Zubware',
    description: 'Repeat words, phrases, emojis, or text strings up to 10,000 times online. Choose custom separators, line breaks, or numbering with one-click copying.',
    features: [
      'Repeats Any Word, Phrase, Emoji or String up to 10,000 Times',
      'Custom Delimiters (Newline, Space, Comma, Period, Custom Text)',
      'Optional Sequential Line Numbering (1., 2., 3...)',
      'Instant In-Browser Assembly with No Processing Lag',
      'One-Click Clipboard Copying with Total Character Count',
      'Perfect for Messaging, Stress Testing & Social Media Posts'
    ],
    howTo: [
      {
        title: 'Enter Text to Repeat',
        desc: 'Type any message, word, emoji, or phrase into the text input field.'
      },
      {
        title: 'Set Repetition Count and Delimiter',
        desc: 'Specify how many times to repeat (e.g. 100 or 1,000) and choose your separator (newline, space, comma).'
      },
      {
        title: 'Copy Repeated Message',
        desc: 'Click Copy to take your repeated text string directly to WhatsApp, Discord, or code editors.'
      }
    ],
    faq: [
      {
        question: 'Can I repeat emojis as well as standard text words?',
        answer: 'Yes. You can repeat emojis, symbols, custom strings, or complete multi-line paragraphs up to 10,000 times.'
      },
      {
        question: 'Can I put each repetition on a new line with line numbers?',
        answer: 'Yes. Select the "New Line" separator and toggle "Add Line Numbers" to generate numbered lists automatically.'
      },
      {
        question: 'Will repeating text 1,000 or 10,000 times freeze my browser?',
        answer: 'No. The repeater uses optimized array joining in JavaScript that compiles thousands of repetitions in a fraction of a second.'
      },
      {
        question: 'Is there any limit or payment required?',
        answer: 'No. The tool is 100% free with unlimited generation rounds and zero sign-ups.'
      }
    ]
  },

  'text-splitter': {
    title: 'Text Splitter — Split Text by Delimiter, Lines & Chunks Online',
    navTitle: 'Text Splitter',
    seoTitle: 'Text Splitter — Split Text by Delimiter, Lines & Chunks | Zubware',
    description: 'Split text, lists, and CSV data by delimiter, newline, regex, or character chunk size online. Inspect and copy split text chunks in your browser.',
    features: [
      'Split by Character Delimiter (Comma, Semicolon, Pipe, Space, Tab)',
      'Split by Regex Pattern or Custom String Sequences',
      'Fixed-Length Character Chunk Splitting (e.g. 1,000 Characters Per Chunk)',
      'Live Chunk Counter & Chunk Length Statistics',
      'One-Click Copy Individual Chunks or Export All as List',
      '100% In-Browser Execution for Large Data Files and Logs'
    ],
    howTo: [
      {
        title: 'Paste Text to Split',
        desc: 'Input text, CSV records, comma-separated lists, or long articles.'
      },
      {
        title: 'Choose Splitting Method',
        desc: 'Select whether to split by a delimiter (like comma or newline) or divide into fixed character chunks.'
      },
      {
        title: 'Review and Copy Chunks',
        desc: 'Inspect the segmented pieces and copy individual chunks or the complete split list.'
      }
    ],
    faq: [
      {
        question: 'Why would I split text by fixed character chunks?',
        answer: 'Splitting long texts into chunks (such as 2,000 or 4,000 characters) is useful for pasting text into AI chatbots with prompt size limits or sending long SMS messages.'
      },
      {
        question: 'Can I split comma-separated values (CSV) into separate lines?',
        answer: 'Yes. Set the delimiter to a comma, and the tool will split the list into individual items on separate lines.'
      },
      {
        question: 'Does the tool support custom regular expressions (regex)?',
        answer: 'Yes. You can define custom regex split patterns to handle complex multi-delimiter text structures.'
      },
      {
        question: 'Are my files or text blocks sent to any server?',
        answer: 'No. String segmentation occurs completely within your browser runtime.'
      }
    ]
  },

  'text-joiner': {
    title: 'Text Joiner — Combine Lines with Custom Delimiters Online',
    navTitle: 'Text Joiner',
    seoTitle: 'Text Joiner — Combine Lines with Custom Delimiters | Zubware',
    description: 'Join and merge multiple lines of text with commas, semicolons, tabs, or custom separators online. Concatenate list items with prefix and suffix options.',
    features: [
      'Join Separate Lines into a Single Delimited String',
      'Preset Delimiters: Comma, Comma+Space, Semicolon, Tab, Pipe (|)',
      'Custom String Delimiter Option with Custom Padding',
      'Add Custom Prefix and Suffix to Each Line (e.g. Quotes \'value\')',
      'Optional Empty Line Removal & Whitespace Trimming',
      'Instant Real-Time Concatenation with One-Click Copying'
    ],
    howTo: [
      {
        title: 'Paste Multi-Line List',
        desc: 'Paste a list of items, IDs, emails, or names (one per line).'
      },
      {
        title: 'Select Separator Delimiter',
        desc: 'Choose a delimiter like comma, comma-space (", "), semicolon, or enter a custom separator.'
      },
      {
        title: 'Copy Merged Text',
        desc: 'Review the joined string and click Copy to paste into spreadsheets, SQL IN clauses, or code arrays.'
      }
    ],
    faq: [
      {
        question: 'How do I convert a vertical column of IDs into a SQL IN clause list?',
        answer: 'Paste your list of IDs, choose comma as the delimiter, and set single quotes (\') as the prefix and suffix to output `\'id1\', \'id2\', \'id3\'`.'
      },
      {
        question: 'Can I join text lines with custom text like " AND " or " OR "?',
        answer: 'Yes. You can type any custom word or character sequence into the custom delimiter box.'
      },
      {
        question: 'Can I remove blank lines automatically before joining?',
        answer: 'Yes. The "Ignore Empty Lines" toggle ensures blank rows do not create unwanted double commas or delimiters.'
      },
      {
        question: 'Is my data private when using this tool?',
        answer: 'Yes. All line merging runs in client-side JavaScript inside your browser with zero server logging.'
      }
    ]
  },

  'email-extractor': {
    title: 'Email Extractor — Scrape & Filter Emails from Text Online',
    navTitle: 'Email Extractor',
    seoTitle: 'Email Extractor — Scrape & Filter Emails from Text Online | Zubware',
    description: 'Extract all valid email addresses from raw text, documents, and web source code online. Automatically deduplicate and sort emails with one-click export.',
    features: [
      'Extracts All Valid Email Addresses from Unstructured Text & HTML',
      'Automatic Deduplication of Redundant Email Entries',
      'Sort Extracted Emails Alphabetically (A to Z) or Keep Found Order',
      'Domain Extension Filtering (.com, .org, .edu, .io, custom)',
      'Export Results as Newline-Separated or Comma-Separated Lists',
      '100% In-Browser Execution Safeguarding Contact Data Privacy'
    ],
    howTo: [
      {
        title: 'Paste Raw Text or Source Code',
        desc: 'Paste articles, contact pages, HTML source, or email headers containing email addresses.'
      },
      {
        title: 'Configure Filters and Sorting',
        desc: 'Toggle automatic deduplication, alphabetical sorting, or filter by specific top-level domains.'
      },
      {
        title: 'Copy or Export Unique Emails',
        desc: 'Inspect the list of discovered emails, view total count, and copy clean emails to your clipboard.'
      }
    ],
    faq: [
      {
        question: 'How does the email extractor identify valid email addresses?',
        answer: 'It uses standardized RFC-compliant regular expressions to find email patterns (username@domain.tld) embedded within messy text or HTML code.'
      },
      {
        question: 'Does the tool automatically remove duplicate email addresses?',
        answer: 'Yes. Deduplication is enabled by default, ensuring every extracted email address appears only once in your final list.'
      },
      {
        question: 'Can I filter for specific corporate or academic email domains?',
        answer: 'Yes. You can filter results to display only emails matching specific domain extensions like `.edu` or specific companies.'
      },
      {
        question: 'Are extracted contact lists uploaded or saved anywhere?',
        answer: 'No. All regex parsing executes entirely in your local browser memory to ensure confidential contact lists remain completely private.'
      }
    ]
  },

  'random-text-generator': {
    title: 'Random Text & String Generator — Custom Alphanumeric Strings Online',
    navTitle: 'Random Text',
    seoTitle: 'Random Text Generator — Custom Alphanumeric Strings | Zubware',
    description: 'Generate cryptographically random strings, alphanumeric keys, and dummy text online. Customize string length, character sets, and count in your browser.',
    features: [
      'Generates Cryptographically Secure Random Strings & Tokens',
      'Configurable Character Sets (Uppercase, Lowercase, Numbers, Symbols)',
      'Custom Character Length Slider (1 to 1,000+ Characters)',
      'Generate Multiple Unique Strings Simultaneously (1 to 100 Keys)',
      'Exclude Confusing Characters Option (e.g. 0, O, 1, l, I)',
      'Powered by Web Crypto API for High-Entropy Randomness'
    ],
    howTo: [
      {
        title: 'Choose String Length and Quantity',
        desc: 'Select desired string length (e.g. 16 or 32 characters) and how many strings to generate.'
      },
      {
        title: 'Select Character Sets',
        desc: 'Check boxes for uppercase, lowercase, numbers, or symbols, or define a custom character set.'
      },
      {
        title: 'Generate and Copy Strings',
        desc: 'Click Generate to produce high-entropy strings and copy individual items or the full list.'
      }
    ],
    faq: [
      {
        question: 'How secure are the generated random strings?',
        answer: 'The generator uses the browser’s native `window.crypto.getRandomValues()` API, which provides cryptographically secure pseudo-random numbers suitable for API tokens and temporary keys.'
      },
      {
        question: 'Can I generate strings without ambiguous characters like O, 0, I, and l?',
        answer: 'Yes. You can toggle the "Exclude Ambiguous Characters" option to prevent visually similar characters that cause transcription errors.'
      },
      {
        question: 'Can I generate random strings using only numbers or only hex characters?',
        answer: 'Yes. You can select only numbers for random numeric PINs, or define custom characters (like `0123456789abcdef` for hex hashes).'
      },
      {
        question: 'Are generated strings or keys logged to a server?',
        answer: 'No. Every string is generated on your local CPU and is never transmitted or logged.'
      }
    ]
  }
};

export function updateBatch2() {
  const toolsDataPath = path.resolve(__dirname, '../src/data/toolsData.ts');
  const seoTitlesPath = path.resolve(__dirname, '../src/lib/seoTitles.ts');

  console.log(`[Batch 2] Starting optimization of exactly 39 tools...`);

  // 1. Update seoTitles.ts
  let seoTitlesContent = fs.readFileSync(seoTitlesPath, 'utf8');
  for (const [toolId, data] of Object.entries(BATCH_2_TOOLS)) {
    const regex = new RegExp(`(['"]${toolId}['"]:\\s*['"])([^'"]+)(['"])`);
    if (regex.test(seoTitlesContent)) {
      seoTitlesContent = seoTitlesContent.replace(regex, `$1${data.seoTitle}$3`);
    } else {
      console.warn(`[seoTitles] ${toolId} not found with regex!`);
    }
  }
  fs.writeFileSync(seoTitlesPath, seoTitlesContent, 'utf8');
  console.log(`[Batch 2] Updated src/lib/seoTitles.ts successfully.`);

  // 2. Update toolsData.ts
  let toolsDataContent = fs.readFileSync(toolsDataPath, 'utf8');

  let updatedToolsCount = 0;
  for (const [toolId, data] of Object.entries(BATCH_2_TOOLS)) {
    // Locate the tool object by id
    const idRegex = new RegExp(`(\\n\\s*id:\\s*['"]${toolId}['"],)`);
    const match = toolsDataContent.match(idRegex);
    if (!match || match.index === undefined) {
      console.error(`Tool ID not found in toolsData: ${toolId}`);
      continue;
    }

    const startIndex = match.index;
    const afterId = toolsDataContent.slice(startIndex);
    const endMatch = afterId.match(/\n  \}(,?)/);
    if (!endMatch || endMatch.index === undefined) {
      console.error(`Could not find end of tool object: ${toolId}`);
      continue;
    }

    const toolBlockLength = endMatch.index + endMatch[0].length;
    let toolChunk = afterId.slice(0, toolBlockLength);

    // Update title
    toolChunk = toolChunk.replace(
      /\n\s*title:\s*['"][^'"]*['"],/,
      `\n    title: ${JSON.stringify(data.title)},`
    );

    // Update navTitle
    if (/navTitle:\s*['"][^'"]*['"],/.test(toolChunk)) {
      toolChunk = toolChunk.replace(
        /\n\s*navTitle:\s*['"][^'"]*['"],/,
        `\n    navTitle: ${JSON.stringify(data.navTitle)},`
      );
    }

    // Update description
    toolChunk = toolChunk.replace(
      /\n\s*description:\s*['"][^'"]*['"],/,
      `\n    description: ${JSON.stringify(data.description)},`
    );

    // Update features
    const featuresIndent = '    ';
    const featuresFormatted = `${featuresIndent}features: [\n` +
      data.features.map(f => `${featuresIndent}  ${JSON.stringify(f)}`).join(',\n') +
      `\n${featuresIndent}],`;

    if (/features:\s*\[[\s\S]*?\],/.test(toolChunk)) {
      toolChunk = toolChunk.replace(/features:\s*\[[\s\S]*?\],/, featuresFormatted.trim());
    } else {
      toolChunk = toolChunk.replace(
        /(\n\s*description:\s*['"][^'"]*['"],)/,
        `$1\n${featuresFormatted}`
      );
    }

    // Update howTo
    const howToIndent = '    ';
    const howToFormatted = `${howToIndent}howTo: [\n` +
      data.howTo.map(step => 
        `${howToIndent}  { title: ${JSON.stringify(step.title)}, desc: ${JSON.stringify(step.desc)} }`
      ).join(',\n') +
      `\n${howToIndent}],`;

    if (/howTo:\s*\[[\s\S]*?\],/.test(toolChunk)) {
      toolChunk = toolChunk.replace(/howTo:\s*\[[\s\S]*?\],/, howToFormatted.trim());
    } else {
      toolChunk = toolChunk.replace(
        /(\n\s*features:\s*\[[\s\S]*?\],)/,
        `$1\n${howToFormatted}`
      );
    }

    // Update faq: Notice the safer replacement to ensure complete arrays are replaced cleanly!
    const faqIndent = '    ';
    const faqFormatted = `${faqIndent}faq: [\n` +
      data.faq.map(item => 
        `${faqIndent}  { question: ${JSON.stringify(item.question)}, answer: ${JSON.stringify(item.answer)} }`
      ).join(',\n') +
      `\n${faqIndent}]`;

    // Replace everything from `faq: [` up to the end of the tool object properties before `\n  }`
    if (/faq:\s*\[/.test(toolChunk)) {
      const faqStart = toolChunk.indexOf('faq: [');
      // The end of faq in the tool chunk is right before the trailing `\n  }`
      const beforeClose = toolChunk.lastIndexOf('\n  }');
      toolChunk = toolChunk.slice(0, faqStart) + faqFormatted.trim() + toolChunk.slice(beforeClose);
    } else {
      // Append before closing
      const beforeClose = toolChunk.lastIndexOf('\n  }');
      toolChunk = toolChunk.slice(0, beforeClose) + `,\n${faqFormatted}` + toolChunk.slice(beforeClose);
    }

    // Replace the block back into toolsDataContent
    toolsDataContent = toolsDataContent.slice(0, startIndex) + toolChunk + toolsDataContent.slice(startIndex + toolBlockLength);
    updatedToolsCount++;
  }

  fs.writeFileSync(toolsDataPath, toolsDataContent, 'utf8');
  console.log(`[Batch 2] Updated ${updatedToolsCount} tools in src/data/toolsData.ts.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  updateBatch2();
}
