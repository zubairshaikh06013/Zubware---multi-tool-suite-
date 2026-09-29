import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface HowToStep {
  title: string;
  desc: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface ToolUpdate {
  howTo: HowToStep[];
  faq: FaqItem[];
}

export const BATCH_5_TOOLS: Record<string, ToolUpdate> = {
  'percentage-calculator': {
    howTo: [
      {
        title: "Select Percentage Mode",
        desc: "Choose from four calculation modes: find X% of Y, determine what percentage X is of Y, calculate percentage increase or decrease, or find percentage difference."
      },
      {
        title: "Enter Numerical Values",
        desc: "Type your base numbers and percentage values into the designated input fields for your chosen calculation mode."
      },
      {
        title: "View & Copy Calculated Result",
        desc: "Review the instant real-time calculation displayed with full decimal precision and copy the result to your clipboard."
      }
    ],
    faq: [
      {
        question: "How do I calculate what percentage one number is of another?",
        answer: "Use Mode 2 ('X is what % of Y'). The calculator divides X by Y and multiplies the quotient by 100 to yield the exact percentage share."
      },
      {
        question: "How does the percentage increase and decrease mode work?",
        answer: "Mode 3 subtracts the initial value X from the final value Y, divides the difference by X, and multiplies by 100. Positive results indicate a percentage increase, while negative numbers represent a percentage drop."
      },
      {
        question: "What is the difference between percentage change and percentage difference?",
        answer: "Percentage change (Mode 3) tracks relative growth or drop from an initial starting point X to Y. Percentage difference (Mode 4) compares two independent values against their mutual average (|X - Y| / ((X + Y) / 2) * 100)."
      },
      {
        question: "Does the calculator support decimal numbers and negative values?",
        answer: "Yes. You can enter positive or negative decimal numbers into any input field; calculations update dynamically on every keystroke."
      },
      {
        question: "Are my calculation numbers transmitted to a remote server?",
        answer: "No. All arithmetic operations are performed locally in your browser memory using JavaScript floating-point math."
      }
    ]
  },

  'age-calculator': {
    howTo: [
      {
        title: "Select Date of Birth",
        desc: "Pick your birth date using the calendar picker or enter year, month, and day."
      },
      {
        title: "Choose Target Date",
        desc: "Leave the target date set to today's date to calculate current age, or select a past or future date to determine age at a specific milestone."
      },
      {
        title: "Review Exact Age Breakdown",
        desc: "Inspect your exact chronological age in years, months, and days, total elapsed hours and minutes, and the countdown to your next birthday."
      }
    ],
    faq: [
      {
        question: "How does the age calculator handle leap years and varying month lengths?",
        answer: "The algorithm calculates elapsed years and months first, then computes remaining days by referencing the exact calendar day count of the preceding month (including 29 days in February during leap years)."
      },
      {
        question: "Can I calculate how old I will be on a future date?",
        answer: "Yes. Adjust the 'Age at Date' field to any future date. The tool computes your exact age in years, months, and days on that selected future milestone."
      },
      {
        question: "What detailed time units are included in the age breakdown?",
        answer: "In addition to primary years, months, and days, the calculator displays total completed months, total elapsed weeks, total calendar days, total hours, minutes, and seconds."
      },
      {
        question: "How is the next birthday countdown determined?",
        answer: "The tool projects your birth month and day onto the current or upcoming calendar year and calculates the exact remaining months and days until your next anniversary."
      },
      {
        question: "Is my personal birth date saved or tracked?",
        answer: "No. Your birth date is processed entirely within your local browser session and is never uploaded or saved to external databases."
      }
    ]
  },

  'emi-calculator': {
    howTo: [
      {
        title: "Enter Loan Principal Amount",
        desc: "Input your total desired loan or mortgage borrowing amount."
      },
      {
        title: "Set Interest Rate & Tenure",
        desc: "Specify the annual interest rate percentage and your repayment duration in years."
      },
      {
        title: "Review Monthly EMI & Amortization",
        desc: "Inspect your fixed monthly EMI, total interest payable over the loan life, and review the year-by-year amortization schedule."
      }
    ],
    faq: [
      {
        question: "Which mathematical formula is used to calculate monthly EMI?",
        answer: "The calculator uses the standard reducing-balance EMI formula: E = [P × r × (1 + r)^n] / [(1 + r)^n - 1], where P is principal, r is monthly interest rate (annual rate / 12 / 100), and n is total monthly installments (tenure in years × 12)."
      },
      {
        question: "How does changing loan tenure affect my monthly EMI and total interest?",
        answer: "A longer tenure lowers your monthly payment by spreading repayments over more months, but significantly increases the cumulative interest paid to the lender."
      },
      {
        question: "Does the calculated EMI include bank processing fees, insurance, or taxes?",
        answer: "No. The calculator estimates the pure principal and interest payment. Bank-specific origination fees, mortgage insurance (PMI), stamp duty, and local taxes must be added separately."
      },
      {
        question: "What information does the yearly amortization schedule show?",
        answer: "The schedule details the beginning balance, total principal repaid, interest paid to the lender, and closing loan balance for each individual year of the loan term."
      },
      {
        question: "Are loan interest rates fixed or floating in this calculator?",
        answer: "The tool assumes a constant fixed interest rate over the full tenure. For floating rate loans, recalculate whenever your lender adjusts the benchmark interest rate."
      }
    ]
  },

  'discount-calculator': {
    howTo: [
      {
        title: "Enter Original Price",
        desc: "Type the sticker or list price of the product or service before any discounts."
      },
      {
        title: "Set Discount & Sales Tax Rates",
        desc: "Input the percentage discount being offered and enter your applicable local sales tax rate."
      },
      {
        title: "View Final Price & Net Savings",
        desc: "Review the discounted subtotal, total dollar amount saved, sales tax added, and the final checkout price."
      }
    ],
    faq: [
      {
        question: "How is the final checkout price calculated with discount and sales tax?",
        answer: "The calculator first subtracts the discount percentage from the original price to find the discounted subtotal. It then applies your sales tax percentage to that discounted price to determine the final amount due."
      },
      {
        question: "Can I use the tool if there is no sales tax?",
        answer: "Yes. Simply set the sales tax field to 0% to calculate pure markdown savings and post-discount price."
      },
      {
        question: "How are cents and rounding handled in the discount calculation?",
        answer: "Calculations maintain full precision internally and format results to standard two decimal currency places (cents) for accurate shopping estimates."
      },
      {
        question: "Can I calculate stacked discounts (such as 20% off plus an extra 10% coupon)?",
        answer: "This tool calculates single percentage markdowns. For stacked store discounts with secondary coupon codes, use the Sale Price Calculator tool."
      },
      {
        question: "Does this tool support different world currencies?",
        answer: "Yes. The mathematical percentages apply identically regardless of whether your values are in Dollars, Euros, Pounds, Rupees, or Yen."
      }
    ]
  },

  'currency-calculator': {
    howTo: [
      {
        title: "Enter Starting Amount",
        desc: "Type the numeric cash amount you wish to convert."
      },
      {
        title: "Select Base & Target Currencies",
        desc: "Choose your source currency (e.g. USD, EUR, GBP, INR) and your target conversion currency from the dropdown menus."
      },
      {
        title: "View Converted Value & Adjust Rates",
        desc: "Inspect the converted amount immediately, or open rate settings to override baseline exchange rates with custom bank rates."
      }
    ],
    faq: [
      {
        question: "Which currencies are supported by this calculator?",
        answer: "The tool supports major world currencies including US Dollar (USD), Euro (EUR), British Pound (GBP), Indian Rupee (INR), Canadian Dollar (CAD), Australian Dollar (AUD), Japanese Yen (JPY), Swiss Franc (CHF), and Singapore Dollar (SGD)."
      },
      {
        question: "Can I customize or update the exchange rates?",
        answer: "Yes. Clicking the Settings button allows you to input custom live bank or bureau de change rates against USD, which are saved in your local browser storage."
      },
      {
        question: "Does the calculator include credit card foreign transaction fees?",
        answer: "No. The tool computes pure exchange parity. Banks and card issuers typically add a 1% to 3.5% foreign transaction fee or exchange markup above mid-market rates."
      },
      {
        question: "Can I invert the conversion with one click?",
        answer: "Yes. Click the Swap button between the currency selectors to instantly reverse source and target currencies."
      },
      {
        question: "Can I use this currency converter offline without internet access?",
        answer: "Yes. Because default baseline rates are stored locally in the application, conversions execute instantaneously without requiring active network requests."
      }
    ]
  },

  'tip-calculator': {
    howTo: [
      {
        title: "Enter Bill Subtotal",
        desc: "Input the pre-tip total amount from your dining, delivery, or service receipt."
      },
      {
        title: "Choose Tip Percentage & Group Size",
        desc: "Select a standard tip preset (10%, 15%, 18%, 20%, 25%) or enter custom percentage, and input the number of people splitting."
      },
      {
        title: "Inspect Tip Total & Per-Person Split",
        desc: "Review total tip amount, overall grand total, and the exact individual payment share per person."
      }
    ],
    faq: [
      {
        question: "How is the individual split calculated for dining groups?",
        answer: "The tool calculates total bill plus tip, then divides both the total check and the tip amount equally by the number of people entered in the party size field."
      },
      {
        question: "Should I calculate the tip on the pre-tax or post-tax bill amount?",
        answer: "Standard etiquette recommends tipping on the pre-tax food and beverage subtotal. However, you can enter whichever subtotal is printed on your receipt."
      },
      {
        question: "What tip percentages are standard for restaurant dining?",
        answer: "In North America, 15% to 18% is standard for adequate service, 20% for good service, and 22% to 25% for exceptional hospitality. The preset buttons provide fast access to these tiers."
      },
      {
        question: "Can I enter a custom tip percentage outside the presets?",
        answer: "Yes. You can type any custom percentage value into the tip percentage box for specialized tipping scenarios."
      },
      {
        question: "Does the calculator handle uneven penny splits?",
        answer: "Results are calculated with full decimal precision and formatted to standard two decimal places for clear payment settlement."
      }
    ]
  },

  'number-to-words': {
    howTo: [
      {
        title: "Enter Numeric Digits",
        desc: "Type or paste any positive or negative integer or decimal number into the input field."
      },
      {
        title: "Select Numbering System & Currency",
        desc: "Choose International (Millions/Billions) or Indian (Lakhs/Crores) format, select an optional currency (USD, INR, EUR, GBP), and pick letter case."
      },
      {
        title: "Copy Formatted Words String",
        desc: "Review the generated English text representation and click Copy to transfer the words to your clipboard for checks or legal documents."
      }
    ],
    faq: [
      {
        question: "What is the difference between International and Indian numbering systems?",
        answer: "The International system groups digits by thousands (Thousands, Millions, Billions, Trillions). The Indian numbering system groups by Hundreds, Thousands, Lakhs (100,000), and Crores (10,000,000)."
      },
      {
        question: "How does the tool format currency amounts for check writing?",
        answer: "When a currency is selected (such as USD or INR), the integer portion is labeled with the primary currency (e.g. 'Dollars' or 'Rupees') and decimal digits are formatted as fractional units (e.g. 'Cents' or 'Paise') followed by 'Only'."
      },
      {
        question: "Can I convert decimal fractions and cents into words?",
        answer: "Yes. Decimal inputs (such as 1234.56) are accurately parsed into full words for both the integer portion and the fractional decimal components."
      },
      {
        question: "Which letter casing options are available for the output?",
        answer: "You can toggle output between Title Case ('One Hundred'), Sentence Case ('One hundred'), ALL UPPERCASE ('ONE HUNDRED'), and all lowercase ('one hundred')."
      },
      {
        question: "What is the maximum number size supported for conversion?",
        answer: "The tool handles numbers up to quadrillions in the International system and Arab/Kharab in the Indian numbering system without arithmetic overflow."
      }
    ]
  },

  'words-to-number': {
    howTo: [
      {
        title: "Type or Paste Number Words",
        desc: "Input natural English number words (e.g. 'two million three hundred forty-five thousand')."
      },
      {
        title: "Automatic Text Parsing",
        desc: "The parser cleans punctuation, handles hyphenated compound words, and aggregates numeric scales."
      },
      {
        title: "Copy Converted Number Digits",
        desc: "View the converted plain integer string and localized comma-separated format, and copy the result with one click."
      }
    ],
    faq: [
      {
        question: "Which number scales are supported by the words-to-number parser?",
        answer: "The parser recognizes standard English scales from units (zero to nine), teens, tens (twenty to ninety), hundreds, thousands, millions, billions, and trillions."
      },
      {
        question: "Does the parser handle hyphenated words like 'twenty-five'?",
        answer: "Yes. Hyphens are automatically normalized, allowing compound words like 'forty-two' or 'ninety-nine' to be parsed accurately."
      },
      {
        question: "Can the parser process phrases with the word 'and' (such as 'one hundred and twenty')?",
        answer: "Yes. Connecting words such as 'and' are recognized as conversational syntax and filtered cleanly during numerical evaluation."
      },
      {
        question: "What output formats are generated from the words?",
        answer: "The tool generates both a raw numeric digit string (e.g. 1500000) for formulas and a localized comma-formatted display (e.g. 1,500,000) for reading clarity."
      },
      {
        question: "Are my entered phrases uploaded to an external server?",
        answer: "No. The natural language string parsing algorithm runs entirely in your local browser memory."
      }
    ]
  },

  'roman-numeral-converter': {
    howTo: [
      {
        title: "Select Conversion Direction",
        desc: "Choose Number to Roman to convert Arabic digits (e.g. 2026), or Roman to Number to convert Roman numerals (e.g. MMXXVI)."
      },
      {
        title: "Enter Value in Active Field",
        desc: "Type an integer between 1 and 3999 or valid Roman numeral symbols (I, V, X, L, C, D, M)."
      },
      {
        title: "View Converted Result & Breakdown",
        desc: "Inspect the converted numeral, read the step-by-step additive value breakdown, and copy the result."
      }
    ],
    faq: [
      {
        question: "What is the valid numerical range for Roman numeral conversion?",
        answer: "Standard classical Roman numerals support integers from 1 up to 3999 (MMMCMXCIX). Numbers 4000 and above traditionally required vinculum overlines not supported in standard ASCII text."
      },
      {
        question: "How do subtractive notation rules work in Roman numerals?",
        answer: "Smaller value numerals placed before larger ones indicate subtraction: I before V (4) or X (9); X before L (40) or C (90); and C before D (400) or M (900)."
      },
      {
        question: "What does the calculation breakdown show?",
        answer: "The tool displays an additive decomposition showing how each individual symbol contributes to the overall sum (for example, MMXXIV = 1000 + 1000 + 10 + 10 + 4 = 2024)."
      },
      {
        question: "Can I enter lowercase Roman letters like 'mmxxiv'?",
        answer: "Yes. The parser accepts lowercase and uppercase characters automatically and normalizes them into valid uppercase Roman notation."
      },
      {
        question: "Why is there no Roman numeral for zero?",
        answer: "Classical Romans did not have a numeral symbol for zero; they used the Latin word 'nulla' (meaning none) when referring to an absence of quantity."
      }
    ]
  },

  'loan-calculator': {
    howTo: [
      {
        title: "Enter Loan & Mortgage Parameters",
        desc: "Input your loan principal balance, annual interest rate percentage, and loan term in years."
      },
      {
        title: "Add Optional Extra Monthly Payments",
        desc: "Enter an additional monthly payment amount to test how extra principal payments accelerate debt payoff."
      },
      {
        title: "Analyze Payoff Timeline & Amortization",
        desc: "Review your base monthly payment, total interest saved, years cut off your mortgage, and yearly amortization table."
      }
    ],
    faq: [
      {
        question: "How do extra monthly payments reduce my total mortgage interest?",
        answer: "Extra payments go directly toward reducing loan principal balance. Because monthly interest is calculated on remaining balance, lowering principal accelerates amortization and reduces total interest owed."
      },
      {
        question: "How is the base monthly payment calculated?",
        answer: "The calculator uses standard monthly amortization: M = P[r(1+r)^n] / [(1+r)^n - 1], where P is loan amount, r is monthly rate, and n is total months."
      },
      {
        question: "Does this mortgage calculator include property taxes and homeowner insurance?",
        answer: "This tool calculates principal and interest (P&I). Escrow items like property taxes, home insurance, and HOA dues vary by municipality and should be budgeted alongside P&I."
      },
      {
        question: "Can I see how many years an extra payment cuts off my loan?",
        answer: "Yes. When you enter an extra monthly payment, the summary card displays the exact number of years and months saved off your original repayment term."
      },
      {
        question: "Can I download or copy the amortization schedule?",
        answer: "Yes. The amortization table displays yearly starting balance, principal paid, interest paid, and end balance across the entire loan lifespan."
      }
    ]
  },

  'roi-calculator': {
    howTo: [
      {
        title: "Select Analysis Tab",
        desc: "Choose ROI & Profit Margin for commercial product pricing, Annualized ROI for investments, or Break-Even for volume planning."
      },
      {
        title: "Input Financial Figures",
        desc: "Enter cost price, selling price, units, overhead expenses, initial investment capital, or fixed costs."
      },
      {
        title: "Inspect Margins & Return Percentages",
        desc: "Review gross profit, net profit margin %, markup %, annualized rate of return, or minimum break-even sales volume."
      }
    ],
    faq: [
      {
        question: "What is the difference between Profit Margin and Markup?",
        answer: "Profit Margin is profit divided by selling price (Profit / Revenue × 100). Markup is profit divided by cost price (Profit / Cost × 100). A product costing $50 and sold for $100 has a 50% margin but a 100% markup."
      },
      {
        question: "How is simple ROI calculated versus Annualized ROI?",
        answer: "Simple ROI is (Net Profit / Initial Investment) × 100. Annualized ROI incorporates investment duration to calculate the compound annual return: [(Final Value / Initial Value)^(1 / Years) - 1] × 100."
      },
      {
        question: "How does the Break-Even analysis work?",
        answer: "Break-even units are calculated by dividing Total Fixed Costs by the Contribution Margin per unit (Selling Price - Variable Cost per unit), showing exact sales needed to cover costs."
      },
      {
        question: "Can I factor in secondary business expenses?",
        answer: "Yes. The commercial mode includes fields for shipping, advertising, packaging, or transaction overhead to determine true net profit."
      },
      {
        question: "Are calculated financial projections stored on any server?",
        answer: "No. All margin calculations, ROI percentages, and break-even tables execute locally in your browser memory."
      }
    ]
  },

  'compound-interest-calculator': {
    howTo: [
      {
        title: "Choose Calculator Mode",
        desc: "Select Compound Interest to project savings growth over time, or CAGR to calculate historical compound annual growth rate."
      },
      {
        title: "Set Principal, Rate & Contributions",
        desc: "Input your starting deposit, monthly addition, expected annual return %, duration in years, and compounding frequency."
      },
      {
        title: "Examine Growth Projection & Yearly Table",
        desc: "Review total accumulated balance, total principal invested, compound interest earned, and the yearly growth schedule."
      }
    ],
    faq: [
      {
        question: "How does compounding frequency affect investment returns?",
        answer: "More frequent compounding (e.g. monthly or daily vs annually) applies interest to newly earned interest sooner, yielding a slightly higher Effective Annual Rate (EAR) and larger final balance."
      },
      {
        question: "What mathematical formula is used for regular monthly contributions?",
        answer: "Future value combines principal compounding A = P(1 + r/n)^(nt) with future value of an annuity series PMT × [((1 + r/n)^(nt) - 1) / (r/n)] adjusted for deposit timing."
      },
      {
        question: "What is CAGR and when should I use it?",
        answer: "Compound Annual Growth Rate (CAGR) measures the geometric mean annual return of an investment over multiple years: CAGR = (End Value / Start Value)^(1 / Years) - 1."
      },
      {
        question: "Does the calculator factor in investment management fees or taxes?",
        answer: "The tool computes gross mathematical compounding. To reflect advisory fees or capital gains taxes, reduce your annual interest rate input accordingly."
      },
      {
        question: "Can I model savings with zero monthly contributions?",
        answer: "Yes. Leave monthly contributions set to 0 to simulate pure lump-sum compound interest on your initial principal deposit."
      }
    ]
  },

  'countdown-calculator': {
    howTo: [
      {
        title: "Enter Event Name",
        desc: "Type a descriptive title for your upcoming occasion, deadline, holiday, or personal milestone."
      },
      {
        title: "Select Target Date & Time",
        desc: "Use the calendar picker to specify the exact future date and time for the countdown."
      },
      {
        title: "Monitor Live Countdown",
        desc: "Watch the animated real-time ticker displaying remaining days, hours, minutes, and seconds, and copy the shareable summary."
      }
    ],
    faq: [
      {
        question: "How accurate is the real-time countdown timer?",
        answer: "The countdown recalculates remaining time every 1,000 milliseconds by comparing your device's system clock against the target timestamp in UTC epoch time."
      },
      {
        question: "What happens when the countdown reaches zero?",
        answer: "When the clock expires, the timer stops ticking and displays a celebratory event completion notice."
      },
      {
        question: "Does the countdown work across different time zones?",
        answer: "The date picker records local device time. When shared or calculated, time differences are computed against your computer's local clock timezone."
      },
      {
        question: "Can I track total days or hours remaining instead of broken-down units?",
        answer: "Yes. The summary statistics panel displays total aggregate calendar days, total hours, and total minutes remaining until the event."
      },
      {
        question: "Is my personal event information saved on a server?",
        answer: "No. The event title and target date run strictly within your client browser session without server communication."
      }
    ]
  },

  'online-stopwatch': {
    howTo: [
      {
        title: "Start Elapsed Timer",
        desc: "Click Start to initiate millisecond-precision stopwatch timing."
      },
      {
        title: "Record Lap & Split Times",
        desc: "Click Lap while running to record individual split times and total cumulative time without pausing the clock."
      },
      {
        title: "Pause, Copy or Reset",
        desc: "Click Pause to halt timing, copy your complete lap history to clipboard, or click Reset to return to zero."
      }
    ],
    faq: [
      {
        question: "What time precision does this digital stopwatch offer?",
        answer: "The stopwatch measures time with centisecond (hundredths of a second, 10ms) display precision using the browser's performance timestamp API."
      },
      {
        question: "What is the difference between Lap Time and Overall Time?",
        answer: "Lap Time measures the specific duration of the single current lap or segment. Overall Time measures cumulative elapsed time since the stopwatch was started."
      },
      {
        question: "Can I copy my recorded lap times?",
        answer: "Yes. Click Copy Laps to export a formatted list of all recorded split times, lap numbers, and total times to your clipboard."
      },
      {
        question: "Does the stopwatch continue running if I switch browser tabs?",
        answer: "Yes. Because elapsed time is calculated from wall-clock timestamps rather than setInterval ticks, background tab throttling does not cause the stopwatch to lose time."
      },
      {
        question: "How are fastest and slowest laps highlighted?",
        answer: "The lap table automatically detects the minimum and maximum lap durations, highlighting your fastest split in green and slowest split in amber."
      }
    ]
  },

  'countdown-timer': {
    howTo: [
      {
        title: "Set Timer Duration",
        desc: "Choose a quick preset (10s, 1m, 5m, 15m, 25m Pomodoro, 1h) or enter custom hours, minutes, and seconds."
      },
      {
        title: "Configure Sound & Alerts",
        desc: "Enable the audio chime sound and grant browser notification permissions for background completion alerts."
      },
      {
        title: "Start & Monitor Progress",
        desc: "Click Start to begin countdown. Watch the circular progress ring and receive an audible alarm when time expires."
      }
    ],
    faq: [
      {
        question: "Will the alarm sound if my browser tab is in the background?",
        answer: "Yes. As long as your browser window remains open and audio is not muted, the Web Audio synthesized chime will play when the timer completes."
      },
      {
        question: "How do desktop notifications work with this timer?",
        answer: "Clicking the Bell icon requests standard browser notification permission. When granted, Zubware sends a desktop notification card when time runs out."
      },
      {
        question: "What is the 25-minute preset used for?",
        answer: "The 25-minute preset corresponds to the standard Pomodoro Technique interval for focused work sprints followed by a short rest break."
      },
      {
        question: "Can I pause and resume the timer midway?",
        answer: "Yes. Click Pause at any time to freeze the countdown, and click Resume to continue from the exact second remaining."
      },
      {
        question: "Can I set multi-hour timers for cooking or studying?",
        answer: "Yes. You can enter any combination of hours (up to 99), minutes (up to 59), and seconds (up to 59) in the custom input fields."
      }
    ]
  },

  'online-clock': {
    howTo: [
      {
        title: "View Current Local Time",
        desc: "Inspect the large real-time digital clock displaying hours, minutes, seconds, and full date."
      },
      {
        title: "Toggle 12-Hour or 24-Hour Format",
        desc: "Switch between standard 12-hour AM/PM format and 24-hour military time."
      },
      {
        title: "Add World Cities to Clock Grid",
        desc: "Search and add international cities (e.g. London, Tokyo, New York, Dubai) to monitor worldwide time zones simultaneously."
      }
    ],
    faq: [
      {
        question: "How does the online clock synchronize its current time?",
        answer: "The clock reads your computer or smartphone's operating system hardware clock, formatted through JavaScript's internationalization (Intl) time APIs."
      },
      {
        question: "How do world city clocks handle daylight saving time (DST)?",
        answer: "The world clock uses IANA timezone identifiers (e.g. America/New_York, Europe/London), which automatically apply regional Daylight Saving Time offsets."
      },
      {
        question: "Can I copy the current timestamp with one click?",
        answer: "Yes. Click the Copy Time button to copy the exact formatted time and date string directly to your clipboard."
      },
      {
        question: "Are my saved world cities preserved between browser visits?",
        answer: "Yes. Your selected world cities and 12/24-hour display preferences are saved in browser local storage for subsequent visits."
      },
      {
        question: "Does this clock consume background battery power?",
        answer: "No. The clock uses lightweight requestAnimationFrame scheduling that updates only once per second with minimal CPU and battery consumption."
      }
    ]
  },

  'time-zone-converter': {
    howTo: [
      {
        title: "Set Origin Date, Time & Zone",
        desc: "Choose your base date, hour, minute, and your starting local time zone."
      },
      {
        title: "Add Target Cities & Time Zones",
        desc: "Select destination cities across North America, Europe, Asia, Australia, and Africa to compare matching local hours."
      },
      {
        title: "Plan Meetings Across Time Zones",
        desc: "Review synchronized time cards with day/night status and working-hours indicators to find ideal meeting windows."
      }
    ],
    faq: [
      {
        question: "How does the time zone converter handle date changes across the International Date Line?",
        answer: "When converting to time zones that cross midnight, the tool displays an explicit '+1 Day' or '-1 Day' badge alongside the target city's calendar date."
      },
      {
        question: "How does the working-hours indicator help meeting planners?",
        answer: "Each destination card highlights whether the converted hour falls within standard business hours (9:00 AM to 5:00 PM), early morning, evening, or nighttime sleep hours."
      },
      {
        question: "Are daylight saving adjustments handled automatically?",
        answer: "Yes. Conversions are processed through standard IANA timezone databases that apply accurate seasonal daylight saving offsets for every selected date."
      },
      {
        question: "Can I swap the origin and destination time zones?",
        answer: "Yes. You can reassign any destination city as your new base timezone with one click to plan return communications."
      },
      {
        question: "Can I copy meeting schedule details to share with attendees?",
        answer: "Yes. Click Copy Summary to copy a formatted multi-city time comparison block ready to paste into calendar invites or emails."
      }
    ]
  },

  'cement-calculator': {
    howTo: [
      {
        title: "Select Unit System & Structure Dimensions",
        desc: "Choose Imperial (feet and inches) or Metric (meters and centimeters) and input the length, width, and thickness of your slab or footing."
      },
      {
        title: "Set Wastage & Concrete Bag Size",
        desc: "Include a safety wastage allowance (typically 5% to 10%) and select your pre-mixed bag size (80lb, 60lb, or 50kg)."
      },
      {
        title: "View Required Bags & Material Volumes",
        desc: "Inspect total concrete volume in cubic yards or cubic meters, total pre-mixed bags needed, or raw sand and gravel component weights."
      }
    ],
    faq: [
      {
        question: "How is total concrete volume calculated from slab dimensions?",
        answer: "For imperial units: Volume (cu ft) = Length (ft) × Width (ft) × [Thickness (in) / 12]. Divide by 27 to obtain Cubic Yards. For metric: Volume (cu m) = Length (m) × Width (m) × [Thickness (cm) / 100]."
      },
      {
        question: "How many 80lb or 60lb bags of concrete make one cubic yard?",
        answer: "One 80-lb bag yields approximately 0.60 cubic feet (requiring 45 bags per cubic yard). One 60-lb bag yields approximately 0.45 cubic feet (requiring 60 bags per cubic yard)."
      },
      {
        question: "Why should I add a wastage factor to my concrete estimate?",
        answer: "Sub-base soil variations, formwork deflection, spillage, and excavation irregularities typically consume 5% to 10% more concrete than theoretical dimensions."
      },
      {
        question: "What is the standard 1:2:3 volumetric concrete mix ratio?",
        answer: "A standard structural concrete mix consists of 1 part Portland cement, 2 parts clean sand, and 3 parts coarse aggregate/gravel by volume, yielding approximately 3,000 PSI strength."
      },
      {
        question: "Can I calculate concrete for post holes and footings?",
        answer: "Yes. Enter the cross-sectional area and depth of your footing into the dimension fields to calculate volume and bag counts for fence posts and deck piers."
      }
    ]
  },

  'wavelength-calculator': {
    howTo: [
      {
        title: "Enter Wave Frequency",
        desc: "Type the frequency value and select the frequency unit (Hz, kHz, MHz, GHz, or THz)."
      },
      {
        title: "Select Wave Medium or Propagation Speed",
        desc: "Choose a medium preset (Light/Radio in vacuum 3×10⁸ m/s, Sound in air 343 m/s, Sound in water, Sound in steel, or enter custom velocity)."
      },
      {
        title: "Review Calculated Wavelength & Period",
        desc: "Inspect the calculated wavelength across meters, millimeters, micrometers, and nanometers, along with wave period in seconds."
      }
    ],
    faq: [
      {
        question: "What mathematical formula relates wavelength, frequency, and wave speed?",
        answer: "Wavelength (λ) is calculated using the wave equation: λ = v / f, where v is wave propagation velocity in meters per second and f is frequency in Hertz."
      },
      {
        question: "What wave speed is used for radio waves and light in a vacuum?",
        answer: "Electromagnetic radiation in a vacuum travels at the constant speed of light: c = 299,792,458 meters per second (~3.0 × 10⁸ m/s)."
      },
      {
        question: "How does the speed of sound differ between air, water, and steel?",
        answer: "Sound travels at approximately 343 m/s in air at 20°C, 1,482 m/s in fresh water, and 5,960 m/s in solid steel due to differences in density and elastic modulus."
      },
      {
        question: "How is wave period calculated from frequency?",
        answer: "Wave period (T) is the reciprocal of frequency: T = 1 / f, representing the exact duration in seconds for one complete wave cycle to pass a fixed point."
      },
      {
        question: "Which electromagnetic spectrum bands are classified by this tool?",
        answer: "The calculator identifies whether electromagnetic inputs fall into Audio, Radio (VLF to EHF), Microwave, Infrared, Visible Light, Ultraviolet, or X-ray bands."
      }
    ]
  },

  'mode-calculator': {
    howTo: [
      {
        title: "Enter or Paste Numbers Dataset",
        desc: "Type or paste your raw numbers separated by commas, spaces, semicolons, or line breaks."
      },
      {
        title: "Statistical Evaluation",
        desc: "The calculator sorts your numbers, tallies frequency distributions, and checks for modal clusters."
      },
      {
        title: "Review Mode, Mean & Median Summary",
        desc: "Inspect the detected mode value(s), frequency count, distribution classification, arithmetic mean, and median."
      }
    ],
    faq: [
      {
        question: "What is the statistical mode of a dataset?",
        answer: "The mode is the number that appears most frequently in a dataset. For example, in the set [2, 4, 4, 7, 9], the mode is 4 with a frequency of 2."
      },
      {
        question: "What is the difference between unimodal, bimodal, and multimodal datasets?",
        answer: "Unimodal datasets have exactly one most frequent value. Bimodal datasets have two distinct values tied for highest frequency. Multimodal datasets have three or more tied modes."
      },
      {
        question: "What happens if every number in the dataset appears only once?",
        answer: "When all values in a dataset appear with equal frequency (frequency = 1), the distribution has no mode, which the tool identifies explicitly."
      },
      {
        question: "Does the mode calculator also provide mean and median?",
        answer: "Yes. In addition to mode, the summary panel displays arithmetic mean (average), median (middle value), minimum, maximum, range, and total sample count."
      },
      {
        question: "Can I paste negative numbers and decimal values?",
        answer: "Yes. The parsing engine recognizes negative values and floating-point decimal numbers separated by any common delimiter."
      }
    ]
  },

  'inductance-calculator': {
    howTo: [
      {
        title: "Enter Solenoid Coil Dimensions",
        desc: "Input coil diameter in millimeters and total winding length in millimeters."
      },
      {
        title: "Specify Turn Count & Core Material",
        desc: "Enter the number of wire turns and set the relative magnetic permeability of the core material (1 for air core)."
      },
      {
        title: "Review Inductance & Wire Length",
        desc: "Inspect calculated inductance in microhenries (μH), millihenries (mH), and approximate wire length needed for construction."
      }
    ],
    faq: [
      {
        question: "Which formula is used to calculate single-layer solenoid inductance?",
        answer: "The calculator uses Wheeler's continuous coil formula: L (μH) = (μr × d² × n²) / (18d + 40ℓ), where d is coil diameter in inches, ℓ is coil length in inches, n is turn count, and μr is relative permeability."
      },
      {
        question: "What is the relative permeability (μr) of an air-core inductor?",
        answer: "Air, wood, plastic, and non-magnetic coil formers have a relative permeability of 1.0. Ferrite or iron cores have much higher values (10 to 1,000+), significantly increasing inductance."
      },
      {
        question: "How does doubling the number of turns affect inductance?",
        answer: "Because turn count is squared in Wheeler's formula (n²), doubling the number of turns quadruples (4x) the resulting inductance if coil dimensions remain similar."
      },
      {
        question: "How is the estimated winding wire length calculated?",
        answer: "Wire length is estimated by multiplying the circumference of a single circular turn (π × diameter) by the total number of turns: Length ≈ n × π × d."
      },
      {
        question: "Are these calculations suitable for high-frequency RF coil design?",
        answer: "Wheeler's formula provides high accuracy (typically within 1%) for single-layer helical solenoids where coil length is greater than 0.4 times coil diameter."
      }
    ]
  },

  'cat-age-calculator': {
    howTo: [
      {
        title: "Enter Cat Age in Years & Months",
        desc: "Input your cat's current chronological age using the years and months number steppers."
      },
      {
        title: "Veterinary Curve Translation",
        desc: "The tool translates feline developmental milestones into equivalent human biological age."
      },
      {
        title: "Review Equivalent Age & Life Stage",
        desc: "Inspect your cat's equivalent human years, life stage classification (Kitten, Junior, Prime, Mature, Senior, Geriatric), and health tips."
      }
    ],
    faq: [
      {
        question: "Why is cat aging not simply 7 human years per calendar year?",
        answer: "Cats mature rapidly in their first two years of life. According to the American Association of Feline Practitioners (AAFP), a 1-year-old cat is biologically comparable to a 15-year-old human, and a 2-year-old cat corresponds to about 24 human years."
      },
      {
        question: "How are cat ages calculated beyond age two?",
        answer: "After reaching full adult maturity at age two (24 human years), each additional calendar year adds approximately 4 human biological years."
      },
      {
        question: "What are the recognized feline life stages?",
        answer: "The AAFP classifies feline stages as: Kitten (0–6 months), Junior (7 months–2 years), Prime (3–6 years), Mature (7–10 years), Senior (11–14 years), and Geriatric (15+ years)."
      },
      {
        question: "Do indoor cats and outdoor cats age differently?",
        answer: "Indoor cats generally enjoy longer life expectancies (often 14–18+ years) compared to outdoor cats due to reduced exposure to traffic, predators, and infectious feline diseases."
      },
      {
        question: "Is this calculator a substitute for professional veterinary advice?",
        answer: "No. This tool provides an educational mathematical estimate based on established veterinary age curves and does not replace regular veterinary checkups."
      }
    ]
  },

  'paint-cost-calculator': {
    howTo: [
      {
        title: "Enter Room Dimensions",
        desc: "Input the length, width, and wall height of the room in feet."
      },
      {
        title: "Specify Openings, Coats & Material Costs",
        desc: "Enter the number of doors and windows to subtract, choose 1 to 3 coats of paint, input paint price per gallon, and toggle primer or labor."
      },
      {
        title: "Review Paint Gallons & Budget Estimate",
        desc: "Inspect net paintable square footage, required paint and primer gallons, paint material cost, estimated labor, and total project budget."
      }
    ],
    faq: [
      {
        question: "How many square feet does one gallon of paint cover?",
        answer: "Standard architectural wall paint covers approximately 350 to 400 square feet per gallon on primed, smooth interior drywall."
      },
      {
        question: "How are door and window cutouts subtracted from total wall area?",
        answer: "Total gross wall area is 2 × (Length + Width) × Height. The calculator subtracts 21 square feet per standard door and 15 square feet per standard window to calculate net paintable surface."
      },
      {
        question: "Should I buy extra paint for touch-ups?",
        answer: "The calculator rounds gallon requirements up to the nearest whole container and applies standard coverage rates so you have adequate volume for touch-ups."
      },
      {
        question: "When should I include a separate primer coat in the calculation?",
        answer: "Toggling primer is recommended when painting bare unpainted drywall, patching large plaster repairs, transitioning from dark to light colors, or sealing porous masonry."
      },
      {
        question: "How is the optional professional labor cost estimated?",
        answer: "When labor is enabled, the tool multiplies your net paintable wall square footage by your custom labor rate per square foot (default $1.75/sq ft)."
      }
    ]
  },

  'density-calculator': {
    howTo: [
      {
        title: "Choose Variable to Solve",
        desc: "Select whether you want to calculate Density (ρ = m/V), Mass (m = ρ × V), or Volume (V = m/ρ)."
      },
      {
        title: "Enter Input Values & Select Units",
        desc: "Type known parameters and select appropriate units (e.g. grams, kilograms, cm³, liters, m³) or pick a common material preset."
      },
      {
        title: "Review Calculated Value & Comparisons",
        desc: "View the computed result in multiple scientific units and compare your material against reference substances like water, steel, and gold."
      }
    ],
    faq: [
      {
        question: "What is the standard formula for physical density?",
        answer: "Density is defined as mass per unit volume: ρ = m / V, where ρ is density, m is total mass, and V is the physical volume occupied by the object."
      },
      {
        question: "What are the common scientific units for measuring density?",
        answer: "Standard metric units are grams per cubic centimeter (g/cm³) and kilograms per cubic meter (kg/m³). In imperial units, pounds per cubic foot (lb/ft³) is standard. (1 g/cm³ = 1,000 kg/m³)."
      },
      {
        question: "What is the reference density of pure water?",
        answer: "Pure liquid water at 4°C has a density of exactly 1.00 g/cm³ (1,000 kg/m³). Substances with density less than 1.0 g/cm³ float in water, while denser materials sink."
      },
      {
        question: "Can I choose from built-in material presets?",
        answer: "Yes. You can select common material presets including Aluminum (2.70 g/cm³), Steel/Iron (7.87 g/cm³), Copper (8.96 g/cm³), Silver (10.49 g/cm³), Gold (19.32 g/cm³), and Concrete (2.40 g/cm³)."
      },
      {
        question: "Does temperature affect material density?",
        answer: "Yes. Most materials expand when heated, increasing volume and slightly decreasing density. The reference presets in this tool represent standard room temperature values (20°C)."
      }
    ]
  },

  'screen-size-calculator': {
    howTo: [
      {
        title: "Enter Diagonal Screen Size",
        desc: "Type the screen diagonal measurement in inches (e.g. 24\", 27\", 32\", 55\", 65\")."
      },
      {
        title: "Select Aspect Ratio & Resolution",
        desc: "Choose an aspect ratio (16:9, 16:10, 21:9, 4:3, 3:2, 19.5:9) and select your display resolution (4K, 1440p, 1080p, Ultrawide, etc.)."
      },
      {
        title: "Review Physical Dimensions & PPI",
        desc: "Inspect calculated width and height in inches and centimeters, total screen display area, and pixel density (PPI)."
      }
    ],
    faq: [
      {
        question: "How are screen width and height calculated from diagonal size?",
        answer: "Using the Pythagorean theorem: Width = Diagonal × [AspectW / √(AspectW² + AspectH²)] and Height = Diagonal × [AspectH / √(AspectW² + AspectH²)]."
      },
      {
        question: "What is Pixels Per Inch (PPI) and why does it matter?",
        answer: "PPI measures pixel density: PPI = √(ResWidth² + ResHeight²) / Diagonal. Higher PPI results in sharper text and finer visual detail, with 100–140 PPI typical for desktop monitors and 220+ PPI for Retina laptops and smartphones."
      },
      {
        question: "Why do ultrawide 21:9 monitors have less height than 16:9 monitors of the same diagonal?",
        answer: "A wider aspect ratio stretches the diagonal horizontally. A 34-inch 21:9 monitor has approximately the same vertical height as a 27-inch 16:9 display, but offers 33% more horizontal desktop space."
      },
      {
        question: "Are dimensions displayed in both inches and centimeters?",
        answer: "Yes. Screen width, height, and diagonal are displayed in both imperial inches and metric centimeters alongside total square area."
      },
      {
        question: "What is dot pitch or pixel pitch?",
        answer: "Dot pitch is the physical distance between the centers of two adjacent pixels (in millimeters): Dot Pitch = 25.4 mm / PPI. Smaller dot pitch indicates a crisper display."
      }
    ]
  },

  'torque-calculator': {
    howTo: [
      {
        title: "Select Calculation Mode",
        desc: "Choose Lever Arm Mode (Force × Distance) for mechanical wrenches and levers, or Motor Mode (Power & RPM) for rotating shafts."
      },
      {
        title: "Enter Mechanical Parameters",
        desc: "Input applied force and lever radius with angle in Lever mode; or input motor power (kW/HP) and rotational speed in RPM in Motor mode."
      },
      {
        title: "Inspect Torque in Multiple Units",
        desc: "Review calculated torque in Newton-meters (N·m), Foot-pounds (ft·lb), Inch-pounds (in·lb), and Kilogram-force meters (kgf·m)."
      }
    ],
    faq: [
      {
        question: "What is the formula for mechanical lever torque?",
        answer: "Torque is calculated by: τ = r × F × sin(θ), where r is the lever arm radius, F is applied force, and θ is the angle between force vector and lever arm (maximum at 90°)."
      },
      {
        question: "How is motor torque calculated from horsepower and RPM?",
        answer: "For electric motors and engines: Torque (N·m) = (9,548.8 × Power in kW) / RPM. In imperial units: Torque (ft·lb) = (5,252 × Horsepower) / RPM."
      },
      {
        question: "Why does torque decrease as motor RPM increases at constant power?",
        answer: "Power is the product of torque and angular velocity (P = τ × ω). If power output is fixed, increasing rotational speed requires torque to drop proportionally."
      },
      {
        question: "How do I convert between Newton-meters (N·m) and Foot-pounds (ft·lb)?",
        answer: "1 Newton-meter equals approximately 0.73756 Foot-pounds. 1 Foot-pound equals approximately 1.3558 Newton-meters. The tool automatically displays all equivalent units simultaneously."
      },
      {
        question: "Does the angle of force affect torque when using a wrench?",
        answer: "Yes. Maximum torque occurs when pulling perpendicular to the wrench handle (90°). Pulling at an angle reduces effective torque by the sine of that angle."
      }
    ]
  },

  'linear-regression-calculator': {
    howTo: [
      {
        title: "Input Data Coordinates",
        desc: "Type or paste paired (X, Y) coordinate points separated by commas, spaces, or line breaks into the data editor."
      },
      {
        title: "Least-Squares Line Calculation",
        desc: "The calculator computes linear regression slope m, y-intercept b, Pearson correlation r, and r² coefficient of determination."
      },
      {
        title: "Predict Y & Copy Regression Stats",
        desc: "Enter any X value to predict its estimated Y outcome along the trendline and copy full regression statistics to clipboard."
      }
    ],
    faq: [
      {
        question: "What is the formula for the linear regression trendline?",
        answer: "The ordinary least-squares line is expressed as y = mx + b, where slope m = [nΣxy - (Σx)(Σy)] / [nΣx² - (Σx)²] and y-intercept b = (Σy - mΣx) / n."
      },
      {
        question: "What does the Pearson correlation coefficient (r) indicate?",
        answer: "Correlation r ranges from -1.0 to +1.0. A value near +1.0 indicates a strong positive linear relationship, -1.0 indicates a strong negative relationship, and 0 indicates no linear correlation."
      },
      {
        question: "What does the R-squared (r²) value represent?",
        answer: "The coefficient of determination (r²) represents the proportion of variance in the dependent variable Y that is predictable from independent variable X (e.g. r² = 0.85 means 85% of variance is explained by the model)."
      },
      {
        question: "Can I use the regression equation to predict unknown values?",
        answer: "Yes. Type any numeric value into the 'Predict Y for X' input box to calculate the exact projected point on the best-fit line."
      },
      {
        question: "What coordinate format should I use when pasting data?",
        answer: "Enter coordinates as paired values (e.g. '1, 2.5' or '1 2.5') with each pair on a new line or separated by semicolons."
      }
    ]
  },

  'loan-eligibility-calculator': {
    howTo: [
      {
        title: "Enter Net Monthly Income & Debts",
        desc: "Input your monthly take-home salary or income, along with your existing monthly loan EMIs and credit commitments."
      },
      {
        title: "Set Loan Terms & DTI Threshold",
        desc: "Specify the expected annual interest rate, proposed tenure in years, and select your bank's maximum allowable DTI/FOIR ratio (e.g. 45% or 50%)."
      },
      {
        title: "Review Maximum Borrowing Capacity",
        desc: "Inspect your estimated maximum loan amount eligibility, maximum permissible monthly EMI, and residual disposable income."
      }
    ],
    faq: [
      {
        question: "What is FOIR or Debt-to-Income (DTI) ratio in loan eligibility?",
        answer: "Fixed Obligation to Income Ratio (FOIR) or Debt-to-Income (DTI) is the maximum percentage of your monthly income lenders permit toward all combined debt payments (typically 40% to 50%)."
      },
      {
        question: "How does existing debt affect my maximum borrowing limit?",
        answer: "Existing monthly loan and credit card EMIs reduce the remaining monthly surplus available for new debt, directly lowering the maximum loan amount a bank will approve."
      },
      {
        question: "How does increasing loan tenure increase eligibility?",
        answer: "A longer tenure lowers the required monthly EMI per dollar borrowed, allowing your available monthly repayment surplus to qualify for a larger principal loan amount."
      },
      {
        question: "Does this calculator guarantee formal loan approval by a bank?",
        answer: "No. This tool provides an estimate based on income and mathematical ratios. Final lender approval depends on credit bureau score (CIBIL/FICO), employment stability, and property collateral valuation."
      },
      {
        question: "Can co-applicant income be added to boost loan eligibility?",
        answer: "Yes. You can enter combined household income into the monthly income field if applying jointly with a spouse or co-borrower."
      }
    ]
  },

  'down-payment-calculator': {
    howTo: [
      {
        title: "Enter Target Purchase Price",
        desc: "Input the expected total price of the home, real estate property, or vehicle you plan to purchase."
      },
      {
        title: "Set Down Payment & Closing Cost Rates",
        desc: "Choose your target down payment percentage (e.g. 3.5%, 5%, 10%, 20%), estimated closing costs (typically 2–4%), and savings timeframe."
      },
      {
        title: "Review Total Upfront Cash Needed",
        desc: "Inspect required down payment cash, estimated closing fees, total cash required at closing, and the monthly savings required to hit your target."
      }
    ],
    faq: [
      {
        question: "Why is a 20% down payment traditionally recommended for home purchases?",
        answer: "Putting 20% down eliminates the requirement for Private Mortgage Insurance (PMI) on conventional loans, lowers your monthly mortgage payment, and reduces total lifetime interest."
      },
      {
        question: "What are typical closing costs on a real estate purchase?",
        answer: "Buyer closing costs typically range between 2% and 5% of the purchase price, covering lender origination fees, appraisal, title search, escrow reserves, and transfer taxes."
      },
      {
        question: "How is the monthly savings target calculated?",
        answer: "The tool subtracts your current saved funds from the total cash needed (down payment + closing costs) and divides the shortfall by your timeframe in months."
      },
      {
        question: "Can I calculate down payments for lower down payment loans like FHA?",
        answer: "Yes. Preset buttons provide quick calculation for low down payment loans including 3.5% (FHA minimum), 5%, 10%, and standard 20% conventional loans."
      },
      {
        question: "Does the calculator account for interest earned on savings deposits?",
        answer: "This tool calculates the direct linear cash required. Any high-yield savings interest earned on your deposits will help you reach your down payment goal even faster."
      }
    ]
  },

  'bond-yield-calculator': {
    howTo: [
      {
        title: "Enter Bond Pricing & Face Value",
        desc: "Input the par face value of the bond (typically $1,000) and its current market trading price."
      },
      {
        title: "Set Coupon Rate & Maturity Duration",
        desc: "Enter the annual coupon interest rate percentage, remaining years to maturity, and payment frequency (annual or semi-annual)."
      },
      {
        title: "Inspect Current Yield & Yield to Maturity",
        desc: "Review annual dollar coupon payment, Current Yield percentage, approximate Yield to Maturity (YTM %), and premium/discount status."
      }
    ],
    faq: [
      {
        question: "What is the difference between Coupon Rate, Current Yield, and YTM?",
        answer: "Coupon Rate is the fixed annual interest percentage paid on face value. Current Yield is annual coupon divided by current market price. Yield to Maturity (YTM) is the total estimated annualized return if held until the bond matures."
      },
      {
        question: "What is the formula used for approximate Yield to Maturity (YTM)?",
        answer: "The tool uses the standard approximation formula: YTM ≈ [C + (F - P) / n] / [(F + P) / 2], where C is annual coupon, F is face value, P is market price, and n is years to maturity."
      },
      {
        question: "What does it mean when a bond trades at a discount or premium?",
        answer: "A bond trades at a discount when market price is below face value (P < F, YTM > Coupon Rate). It trades at a premium when market price exceeds face value (P > F, YTM < Coupon Rate)."
      },
      {
        question: "Does this calculator support semi-annual coupon payments?",
        answer: "Yes. Most US corporate and Treasury bonds pay interest semi-annually; selecting semi-annual frequency splits the annual coupon into two equal distributions per year."
      },
      {
        question: "Does YTM account for reinvestment risk?",
        answer: "YTM assumes that all periodic coupon payments can be reinvested at the same continuous yield rate until maturity."
      }
    ]
  },

  'mileage-calculator': {
    howTo: [
      {
        title: "Select Unit System",
        desc: "Choose US Units (Miles, Gallons, $/gal) or Metric Units (Kilometers, Liters, $/L)."
      },
      {
        title: "Enter Trip Distance & Fuel Used",
        desc: "Input odometer distance traveled, total volume of fuel pumped, and the fuel unit price."
      },
      {
        title: "Review Fuel Economy & IRS Deduction",
        desc: "Inspect calculated MPG and L/100km fuel economy, cost per mile, total trip fuel expense, and IRS business mileage deduction value."
      }
    ],
    faq: [
      {
        question: "How is fuel economy calculated in MPG and L/100km?",
        answer: "In US units: MPG = Distance (miles) / Fuel (gallons). In Metric units: L/100km = [Fuel (liters) × 100] / Distance (kilometers). The tool displays both ratings simultaneously."
      },
      {
        question: "What is the standard IRS business mileage rate?",
        answer: "The default rate is set to the official 2024 IRS standard business mileage rate of $0.67 per mile, which you can adjust if tax authorities update statutory rates."
      },
      {
        question: "How do I accurately calculate my car's true gas mileage?",
        answer: "Fill your tank completely and reset the trip odometer. Drive normally until the tank is partially empty, refill completely, and record the exact gallons pumped and trip mileage."
      },
      {
        question: "How is trip fuel cost per mile calculated?",
        answer: "Cost per mile is calculated by dividing total fuel purchase cost by the distance driven, showing exact out-of-pocket fuel costs per mile."
      },
      {
        question: "Can I use this calculator for diesel and hybrid vehicles?",
        answer: "Yes. The mathematical relationship between distance traveled, liquid fuel volume pumped, and price per unit volume applies to gasoline, diesel, and hybrid cars."
      }
    ]
  },

  'us-income-tax-calculator': {
    howTo: [
      {
        title: "Enter Gross Annual Income",
        desc: "Input your total yearly pre-tax earnings from wages, salaries, and business income."
      },
      {
        title: "Select Filing Status & Deductions",
        desc: "Choose Single, Married Filing Jointly, Married Filing Separately, or Head of Household, and enter pre-tax deductions (401k, HSA, health insurance)."
      },
      {
        title: "Review Federal Tax & FICA Breakdown",
        desc: "Inspect your standard deduction, taxable income, federal income tax brackets, FICA taxes (Social Security & Medicare), and estimated take-home pay."
      }
    ],
    faq: [
      {
        question: "Which tax year and brackets are implemented in this calculator?",
        answer: "This tool implements official 2024 IRS federal income tax brackets (10%, 12%, 22%, 24%, 32%, 35%, and 37%) and 2024 standard deduction amounts across all four filing statuses."
      },
      {
        question: "What are the 2024 standard deduction amounts?",
        answer: "The 2024 standard deductions implemented are: Single ($14,600), Married Filing Jointly ($29,200), Married Filing Separately ($14,600), and Head of Household ($21,900)."
      },
      {
        question: "How are FICA Social Security and Medicare taxes calculated?",
        answer: "Social Security tax is 6.2% on earnings up to the 2024 wage base limit of $168,600. Medicare tax is 1.45% on all earnings, plus an additional 0.9% surtax for high earners above threshold limits."
      },
      {
        question: "What is the difference between Marginal Tax Rate and Effective Tax Rate?",
        answer: "Your Marginal Tax Rate is the highest tax bracket applied to your top dollar of income. Your Effective Tax Rate is the actual blended percentage of total income paid in tax (Total Tax / Gross Income × 100)."
      },
      {
        question: "Does this calculator include state or local income taxes?",
        answer: "No. This tool computes US Federal income tax and federal FICA payroll taxes. State income taxes vary widely by jurisdiction (from 0% in states like Texas and Florida to over 10% in California)."
      }
    ]
  },

  'personal-loan-calculator': {
    howTo: [
      {
        title: "Enter Loan Amount & Interest Rate",
        desc: "Input the requested personal loan borrowing amount and the lender's annual percentage rate (APR)."
      },
      {
        title: "Set Loan Duration & Origination Fee",
        desc: "Select the loan term in months (e.g. 12, 24, 36, 48, 60 months) and enter any upfront origination fee percentage."
      },
      {
        title: "Review Monthly Payment & Net Cash",
        desc: "Inspect your fixed monthly payment, total interest cost, upfront fee deducted, and the net cash actually disbursed to your bank account."
      }
    ],
    faq: [
      {
        question: "What is a personal loan origination fee?",
        answer: "An origination fee is an upfront administrative fee charged by lenders (typically 1% to 8%) deducted directly from your loan proceeds before funds are disbursed."
      },
      {
        question: "How does the origination fee affect net disbursed cash?",
        answer: "If you borrow $10,000 with a 5% origination fee, $500 is deducted upfront and you receive $9,500 in cash, while you repay interest and principal on the full $10,000."
      },
      {
        question: "How is the monthly personal loan installment calculated?",
        answer: "The payment is calculated using standard fixed monthly amortization: EMI = P × r × (1+r)^n / [(1+r)^n - 1], where P is loan principal, r is monthly interest rate, and n is loan term in months."
      },
      {
        question: "Can I pay off my personal loan early to save interest?",
        answer: "Most modern personal loans have no prepayment penalties. Paying extra principal early reduces remaining balance and shortens your repayment period."
      },
      {
        question: "Does this calculator check or affect my credit score?",
        answer: "No. This is a local mathematical planning tool running in your browser; it does not connect to credit bureaus or perform credit inquiries."
      }
    ]
  },

  'sale-price-calculator': {
    howTo: [
      {
        title: "Enter Original Item Price",
        desc: "Input the initial retail sticker price of the merchandise."
      },
      {
        title: "Add Primary Discount & Stacked Coupon",
        desc: "Enter the store markdown percentage (e.g. 25%) and input an additional promo code or store coupon percentage (e.g. 10%)."
      },
      {
        title: "Review Savings & Final Register Price",
        desc: "Review your initial discount, secondary coupon savings, total combined percentage saved, sales tax, and final checkout price."
      }
    ],
    faq: [
      {
        question: "How do stacked discounts calculate (e.g. 25% off plus extra 10% coupon)?",
        answer: "Retailers apply the secondary coupon to the already-discounted price, not the original price. For a $100 item: 25% off = $75, then 10% off $75 = $7.50, resulting in a $67.50 price (32.5% effective savings, not 35%)."
      },
      {
        question: "How does sales tax apply to discounted merchandise?",
        answer: "In most retail jurisdictions, sales tax is assessed on the final discounted price after all coupons have been deducted."
      },
      {
        question: "Can I calculate single-discount sales without a coupon?",
        answer: "Yes. Simply leave the extra coupon percentage field set to 0% to calculate standard single-discount sale prices."
      },
      {
        question: "Does the tool show total combined dollar savings?",
        answer: "Yes. The summary breakdown displays exact dollar savings from the primary discount, additional coupon savings, total combined dollar discount, and net effective percentage saved."
      },
      {
        question: "Are prices formatted with accurate currency rounding?",
        answer: "Yes. All price calculations round to standard two decimal places matching retail cash register checkout totals."
      }
    ]
  },

  'experience-calculator': {
    howTo: [
      {
        title: "Add Employment Records",
        desc: "Add your past and current jobs with company name, job title, start date, and end date."
      },
      {
        title: "Mark Current Position",
        desc: "Toggle 'Currently Working Here' on your active job to calculate ongoing tenure up to today's date."
      },
      {
        title: "Review Total Merged Experience",
        desc: "Inspect your unified professional experience in years, months, and days with overlapping dates merged accurately."
      }
    ],
    faq: [
      {
        question: "How does the experience calculator handle overlapping employment dates?",
        answer: "The algorithm merges intersecting date intervals into continuous calendar spans so overlapping tenures (such as freelancing while employed) are not double-counted in total experience."
      },
      {
        question: "Can I calculate experience for currently active positions?",
        answer: "Yes. Check the 'Currently Working Here' box to automatically calculate tenure from your start date up to the present day."
      },
      {
        question: "How are months and days converted into total years?",
        answer: "The tool calculates full completed calendar years, remaining whole months, and remaining residual days, while also displaying total completed calendar days."
      },
      {
        question: "Can I add multiple historical jobs to my career timeline?",
        answer: "Yes. Click 'Add Position' to enter as many previous employers as needed to construct your complete career chronology."
      },
      {
        question: "Is my resume or job history saved on an external server?",
        answer: "No. All job entries and date calculations reside strictly within your local browser session and are never uploaded to Zubware servers."
      }
    ]
  },

  'notice-period-calculator': {
    howTo: [
      {
        title: "Enter Resignation Date",
        desc: "Select the date you submitted your formal resignation letter to your employer."
      },
      {
        title: "Set Contractual Notice Days",
        desc: "Input your required notice period duration (common presets: 15, 30, 60, or 90 days)."
      },
      {
        title: "Review Last Working Day & Buyout Cost",
        desc: "Inspect your official Last Working Day (LWD) calendar date, remaining days countdown, and optional salary buyout calculation."
      }
    ],
    faq: [
      {
        question: "How is the official Last Working Day (LWD) determined?",
        answer: "The calculator adds your required notice period calendar days directly to your resignation submission date to determine your exact final employment date."
      },
      {
        question: "Does the notice period count calendar days or working days?",
        answer: "Standard corporate employment contracts specify notice periods in total calendar days (including weekends and holidays) unless your specific employment agreement explicitly states business days."
      },
      {
        question: "How does notice period buyout calculation work?",
        answer: "If you leave earlier than your contractual notice, buyout compensation is calculated by dividing monthly salary by 30 to determine daily rate, then multiplying by the shortfall days: Buyout = (Monthly Salary / 30) × Shortfall Days."
      },
      {
        question: "Can I adjust for waived or negotiated shortfall days?",
        answer: "Yes. Enter the number of buyout or waived days to calculate the exact financial recovery or settlement amount between you and your employer."
      },
      {
        question: "What happens if my last working day falls on a weekend or public holiday?",
        answer: "Companies typically treat the preceding Friday or following Monday as the formal physical exit day for returning company assets and exit interviews."
      }
    ]
  },

  'salary-hike-calculator': {
    howTo: [
      {
        title: "Enter Current Salary or CTC",
        desc: "Input your current annual gross Cost to Company (CTC) or base salary."
      },
      {
        title: "Enter Offered New Salary or CTC",
        desc: "Input the new proposed annual compensation offered by your current or new employer."
      },
      {
        title: "Review Percentage Hike & In-Hand Gain",
        desc: "Inspect the absolute annual increment, percentage hike %, and estimated gross monthly paycheck increase."
      }
    ],
    faq: [
      {
        question: "What formula is used to calculate percentage salary hike?",
        answer: "Percentage hike is calculated as: Hike % = [(Offered CTC - Current CTC) / Current CTC] × 100."
      },
      {
        question: "How is the estimated monthly difference calculated?",
        answer: "The tool divides both annual CTC figures by 12 to display current monthly gross, offered monthly gross, and the monthly dollar increment."
      },
      {
        question: "Does the calculated hike reflect net in-hand salary after taxes?",
        answer: "This tool calculates gross CTC increase. Actual net in-hand pay depends on income tax brackets, retirement contributions (401k/PF), and health insurance deductions."
      },
      {
        question: "What is considered a standard salary hike when switching jobs?",
        answer: "In professional industries, typical lateral job switches offer between 15% and 35% hikes depending on skill demand, candidate experience, and market benchmarks."
      },
      {
        question: "Can I use this calculator for hourly wage increases?",
        answer: "Yes. You can enter hourly pay rates directly into the fields; the percentage hike remains mathematically identical whether using hourly, monthly, or annual figures."
      }
    ]
  },

  'ctc-calculator': {
    howTo: [
      {
        title: "Enter Annual Gross CTC",
        desc: "Input your total yearly Cost to Company package as stated on your employment offer letter."
      },
      {
        title: "Configure Component Percentages",
        desc: "Adjust percentage allocations for Basic Salary (typically 40–50%), HRA (typically 20%), and Employee PF (12% of Basic)."
      },
      {
        title: "Review Estimated Monthly Take-Home Pay",
        desc: "Inspect your annual salary breakdown (Basic, HRA, PF, Gratuity) and view your estimated monthly in-hand take-home salary."
      }
    ],
    faq: [
      {
        question: "What is the difference between Cost to Company (CTC) and In-Hand Salary?",
        answer: "CTC is the total annual expense an employer incurs for an employee, including direct salary, retirement contributions (PF), gratuity provisions, and benefits. In-hand salary is the actual net cash deposited into your bank account after deductions."
      },
      {
        question: "How is Provident Fund (PF) deducted from CTC?",
        answer: "Statutory Employee PF deduction is calculated as 12% of Basic Salary. In many corporate CTC structures, an equal 12% employer contribution is also included within the gross CTC package."
      },
      {
        question: "What is the Gratuity component in a CTC structure?",
        answer: "Gratuity is a statutory terminal benefit calculated at approximately 4.81% of Basic Salary (15 days of basic pay for each year of service), payable upon completing 5+ years with the employer."
      },
      {
        question: "Does the estimated monthly in-hand salary include income tax (TDS)?",
        answer: "This tool calculates gross pre-tax in-hand pay after standard statutory retirement deductions. Final take-home pay will vary based on your personal income tax bracket and chosen tax regime."
      },
      {
        question: "Can I customize the Basic and HRA percentage ratios?",
        answer: "Yes. You can adjust the Basic Salary percentage slider (30% to 60%) and HRA percentage to match your employer's specific salary compensation structure."
      }
    ]
  },

  'working-days-calculator': {
    howTo: [
      {
        title: "Select Start and End Dates",
        desc: "Pick your beginning date and conclusion date from the calendar selectors."
      },
      {
        title: "Configure Weekend & Holiday Rules",
        desc: "Toggle whether Saturdays are counted as working days (5-day vs 6-day week) and input your count of public or company holidays."
      },
      {
        title: "Review Net Business Working Days",
        desc: "Inspect total net working days, weekend days excluded, holidays deducted, and total calendar days elapsed."
      }
    ],
    faq: [
      {
        question: "How does the working days calculator exclude weekend days?",
        answer: "The algorithm iterates through each calendar day in the date range; Sundays (and optionally Saturdays) are counted as non-working weekend days and excluded from the net total."
      },
      {
        question: "Can I count Saturdays as normal working days for a 6-day work week?",
        answer: "Yes. Check the 'Include Saturday as Workday' toggle to count Saturdays toward total business days, excluding only Sundays."
      },
      {
        question: "How are public and company holidays accounted for?",
        answer: "Type your number of scheduled company holidays or bank holidays into the holiday deduction field. The tool subtracts them directly from net working days."
      },
      {
        question: "Are start and end dates included in the working days count?",
        answer: "Yes. Both the start date and end date are evaluated inclusively if they fall on valid working business days."
      },
      {
        question: "Can I calculate working days across full calendar years?",
        answer: "Yes. The calculator handles arbitrary date spans across multi-year project schedules, leap years, and quarterly milestone periods."
      }
    ]
  },

  'cgpa-calculator': {
    howTo: [
      {
        title: "Select Grading Scale",
        desc: "Choose between a standard 10.0 grading scale (common in universities and CBSE) or a 4.0 GPA scale."
      },
      {
        title: "Add Semester GPAs & Credits",
        desc: "Enter your GPA and credit weight for each completed academic semester or course module."
      },
      {
        title: "Review Cumulative CGPA & Percentage",
        desc: "Inspect your credit-weighted cumulative CGPA, converted percentage equivalent, total credits earned, and academic class honors."
      }
    ],
    faq: [
      {
        question: "How is credit-weighted Cumulative GPA (CGPA) calculated?",
        answer: "CGPA is calculated by dividing total earned grade points (sum of GPA × Credits for each semester) by total completed credits: CGPA = Σ(GPAᵢ × Creditsᵢ) / Σ(Creditsᵢ)."
      },
      {
        question: "How is CGPA converted to percentage marks on a 10-point scale?",
        answer: "For standard Indian universities and CBSE guidelines, percentage is calculated as: Percentage = CGPA × 9.5. On a 4.0 scale, percentage is computed as (GPA / 4.0) × 100."
      },
      {
        question: "What academic honors divisions are displayed?",
        answer: "The tool classifies results into recognized academic standings: First Class with Distinction (typically CGPA ≥ 7.5 or 75%+), First Class, Second Class, or Pass."
      },
      {
        question: "Can I add or remove semesters easily?",
        answer: "Yes. Use the 'Add Semester' button to append semesters up to a full 4-year or 5-year degree program, or click the trash icon to remove semesters."
      },
      {
        question: "Can I copy my full CGPA academic summary?",
        answer: "Yes. Click Copy Summary to copy your overall CGPA, equivalent percentage, total credits, and semester breakdown to your clipboard."
      }
    ]
  },

  'weight-gain-calculator': {
    howTo: [
      {
        title: "Enter Body Weight & Gender",
        desc: "Input your current body weight in kilograms or pounds and select your gender."
      },
      {
        title: "Choose Daily Physical Activity Level",
        desc: "Select your activity multiplier ranging from Sedentary (desk job) to Very Active (heavy physical training)."
      },
      {
        title: "Review Calorie Surplus & Macronutrients",
        desc: "Inspect your baseline maintenance calories, daily surplus recommendations (Mild +300, Moderate +500, Aggressive +750 kcal), and macro distribution in grams."
      }
    ],
    faq: [
      {
        question: "How are baseline maintenance calories estimated in this calculator?",
        answer: "Maintenance calories are estimated mathematically by multiplying your body weight in kilograms by an established metabolic activity multiplier (33 for sedentary up to 39 for very active training)."
      },
      {
        question: "What daily calorie surplus is recommended for lean weight gain?",
        answer: "A moderate surplus of approximately 300 to 500 calories above maintenance per day is commonly recommended to promote steady lean tissue accretion while minimizing excess fat gain."
      },
      {
        question: "How are daily protein, carbohydrate, and fat macros distributed?",
        answer: "The mathematical model targets protein at approximately 2.0g to 2.2g per kg of body weight for muscle synthesis, dietary fats at 25% to 30% of total calories, and remaining calories allocated to carbohydrates."
      },
      {
        question: "Can I track weight gain progress in pounds as well as kilograms?",
        answer: "Yes. You can enter your body weight in either kilograms or pounds; unit conversions are applied automatically."
      },
      {
        question: "Is this calculator a medical or clinical nutrition diagnosis?",
        answer: "No. This tool provides an informational mathematical estimate based on standard sports nutrition formulas and is not personalized medical advice."
      }
    ]
  },

  'calorie-calculator': {
    howTo: [
      {
        title: "Enter Personal Biometrics",
        desc: "Choose Metric or Imperial units and input your age, gender, weight, and height."
      },
      {
        title: "Select Activity Level & Fitness Goal",
        desc: "Choose your weekly exercise frequency (Sedentary to Athlete) and pick your goal (Maintain, Weight Loss, or Weight Gain)."
      },
      {
        title: "Review BMR, TDEE & Daily Target Calories",
        desc: "Inspect your Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), and exact daily calorie intake target."
      }
    ],
    faq: [
      {
        question: "Which scientific formula is used to calculate Basal Metabolic Rate (BMR)?",
        answer: "The calculator uses the clinically validated Mifflin-St Jeor equation: For men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5. For women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161."
      },
      {
        question: "What is Total Daily Energy Expenditure (TDEE)?",
        answer: "TDEE represents total calories burned in 24 hours combining BMR, physical activity, and food digestion: TDEE = BMR × Activity Multiplier (1.2 for sedentary up to 1.9 for rigorous athlete training)."
      },
      {
        question: "How are calorie deficits and surpluses structured for weight goals?",
        answer: "Mild loss targets a 250 kcal/day deficit (~0.5 lb/week); standard weight loss targets a 500 kcal/day deficit (~1 lb/week); mild weight gain targets a 250–500 kcal/day surplus."
      },
      {
        question: "Does the calculator support both Metric (kg/cm) and Imperial (lbs/ft/in) units?",
        answer: "Yes. Toggle between Metric and Imperial unit systems anytime to input weight in pounds and height in feet and inches."
      },
      {
        question: "Is this calculator a medical diagnosis or diet prescription?",
        answer: "No. This calculator provides an educational mathematical estimate based on standard demographic formulas and is not personalized medical advice."
      }
    ]
  },

  'water-intake-calculator': {
    howTo: [
      {
        title: "Enter Body Weight",
        desc: "Choose Metric (kg) or Imperial (lbs) units and input your current body weight."
      },
      {
        title: "Add Daily Exercise & Climate Conditions",
        desc: "Input daily workout duration in minutes, select your local climate (Moderate, Hot, Very Hot), and indicate pregnancy or nursing status."
      },
      {
        title: "Review Recommended Daily Hydration",
        desc: "Inspect your total daily water target in liters and fluid ounces, glass count, and hourly drinking schedule."
      }
    ],
    faq: [
      {
        question: "What baseline formula determines daily water intake from body weight?",
        answer: "The baseline formula recommends approximately 35 milliliters of water per kilogram of body weight per day (equivalent to about 0.5 to 0.6 fluid ounces per pound)."
      },
      {
        question: "How does physical exercise increase daily water requirements?",
        answer: "The calculator adds approximately 350 milliliters (about 12 fluid ounces) of additional water for every 30 minutes of moderate-to-vigorous exercise to replace sweat loss."
      },
      {
        question: "How do hot climates and pregnancy affect hydration targets?",
        answer: "Hot weather adds 500ml to 1,000ml to offset perspiration. Pregnancy adds 300ml, while breastfeeding adds 700ml to support fluid balance and milk production."
      },
      {
        question: "How many standard drinking glasses does the target represent?",
        answer: "The tool converts your total volume into standard 250ml (8 fl oz) glass equivalents and provides an hourly drinking timetable from morning to evening."
      },
      {
        question: "Is this water calculator suitable for individuals with kidney or cardiac conditions?",
        answer: "No. Individuals with medical fluid restrictions (such as heart failure or kidney disease) must follow their physician's specific hydration directives."
      }
    ]
  },

  'scientific-calculator': {
    howTo: [
      {
        title: "Input Expressions via Keypad or Keyboard",
        desc: "Type numbers, mathematical operators (+, −, ×, ÷), and parentheses using on-screen buttons or your computer keyboard."
      },
      {
        title: "Apply Scientific Functions & Angle Modes",
        desc: "Use trigonometry (sin, cos, tan), logarithms (ln, log), powers (xʸ, x²), roots (√, ∛), and toggle between Radian (RAD) and Degree (DEG) modes."
      },
      {
        title: "Evaluate, Store in Memory & View History",
        desc: "Press Equals (=) or Enter to evaluate, store results in memory registers (M+, MR), and inspect past calculations in the history log."
      }
    ],
    faq: [
      {
        question: "What is the difference between Radian (RAD) and Degree (DEG) mode?",
        answer: "Degree mode measures angles on a 360° circle, where sin(30°) = 0.5. Radian mode measures angles based on radius arc length (2π radians in a circle), where sin(π/6) = 0.5. Click the RAD/DEG badge to toggle."
      },
      {
        question: "How do the calculator memory registers (M+, M-, MR, MC) function?",
        answer: "M+ adds the current result to memory; M- subtracts it; MR (Memory Recall) inserts the stored memory value into your expression; and MC (Memory Clear) resets memory to 0."
      },
      {
        question: "Does the calculator support keyboard shortcuts on desktop computers?",
        answer: "Yes. You can use number keys, standard operators (+, -, *, /), parentheses, Enter for equals, Backspace to delete characters, and Escape to clear the display."
      },
      {
        question: "Are past calculations saved in history?",
        answer: "Yes. Evaluated expressions are automatically saved to your calculation history list in local storage, allowing you to recall past results with one click."
      },
      {
        question: "Which scientific constants and functions are built into the tool?",
        answer: "The calculator includes mathematical constants Pi (π ≈ 3.14159) and Euler's number (e ≈ 2.71828), factorial (x!), inverse trigonometry (asin, acos, atan), natural log (ln), common log (log₁₀), and absolute value (abs)."
      }
    ]
  },

  'unit-converter': {
    howTo: [
      {
        title: "Select Unit Measurement Category",
        desc: "Choose from 8 unit families: Length, Weight & Mass, Temperature, Area, Volume, Speed, Digital Data, or Time."
      },
      {
        title: "Choose Source and Target Units",
        desc: "Pick your originating unit in the 'From' dropdown and your desired destination unit in the 'To' dropdown."
      },
      {
        title: "Input Value & Copy Converted Output",
        desc: "Type any numeric value into the input field to view the instant converted result and click Copy to clipboard."
      }
    ],
    faq: [
      {
        question: "Which measurement categories are supported by the unit converter?",
        answer: "The tool supports 8 categories: Length (mm to miles), Weight & Mass (mg to tons), Temperature (Celsius, Fahrenheit, Kelvin), Area, Volume, Speed (m/s, km/h, mph, knots), Digital Data (Bytes to TB), and Time."
      },
      {
        question: "How are temperature conversions calculated between Celsius and Fahrenheit?",
        answer: "Temperature conversions use precise affine formulas: °F = (°C × 9/5) + 32, °C = (°F - 32) × 5/9, and Kelvin = °C + 273.15, correctly accounting for non-zero baseline offsets."
      },
      {
        question: "Can I swap the source and target units with one click?",
        answer: "Yes. Click the Swap button between the unit selectors to instantly reverse the conversion direction."
      },
      {
        question: "How is conversion decimal precision handled?",
        answer: "Results are calculated with full 64-bit floating-point precision and formatted cleanly, omitting unnecessary trailing zeroes while avoiding rounding distortion."
      },
      {
        question: "Are my conversion values uploaded to a server?",
        answer: "No. All conversion factors and formulas are evaluated entirely within your local browser JavaScript engine."
      }
    ]
  },

  'unix-timestamp-converter': {
    howTo: [
      {
        title: "Choose Conversion Direction",
        desc: "Convert a Unix Epoch timestamp (seconds or milliseconds) into calendar dates, or convert a calendar date into a Unix timestamp."
      },
      {
        title: "Input Timestamp or Pick Date",
        desc: "Type a numeric Unix timestamp or use the date-time picker to specify your target date, hour, minute, and second."
      },
      {
        title: "Inspect UTC, Local Time & Epoch Formats",
        desc: "Review synchronized timestamps in UTC ISO-8601, localized date-time, epoch seconds, and relative time ago."
      }
    ],
    faq: [
      {
        question: "What is a Unix Epoch timestamp?",
        answer: "A Unix timestamp is the total number of seconds that have elapsed since January 1, 1970 at 00:00:00 UTC (the Unix Epoch), widely used in databases, APIs, and operating systems."
      },
      {
        question: "What is the difference between 10-digit and 13-digit Unix timestamps?",
        answer: "10-digit timestamps measure elapsed time in seconds (standard Unix/Linux and Python timestamps). 13-digit timestamps measure time in milliseconds (standard in JavaScript Date.now()). Toggle the 'Milliseconds' switch to convert 13-digit timestamps."
      },
      {
        question: "How does the tool handle daylight saving time and local time zones?",
        answer: "The tool displays your timestamp in both standardized Universal Coordinated Time (UTC) and your computer's local timezone with accurate seasonal daylight saving offsets."
      },
      {
        question: "Can I view a live real-time updating Unix epoch clock?",
        answer: "Yes. The top status panel displays the live current Unix epoch second, which updates every second and can be paused or copied with one click."
      },
      {
        question: "What will happen during the Year 2038 Unix timestamp problem?",
        answer: "The Year 2038 problem affects legacy 32-bit signed integer systems when seconds reach 2,147,483,647 on January 19, 2038. Modern 64-bit systems and this JavaScript tool safely support timestamps billions of years into the future."
      }
    ]
  },

  'reading-time-calculator': {
    howTo: [
      {
        title: "Paste or Type Text Manuscript",
        desc: "Enter or paste your article, speech, essay, or blog post into the text editor, or upload a text file."
      },
      {
        title: "Adjust Words-Per-Minute (WPM) Speed",
        desc: "Use the slider to customize reading speed (default 200 WPM) or review presets for speed readers and speaking presentations."
      },
      {
        title: "Review Reading & Speaking Duration",
        desc: "Inspect total word count, character count, estimated silent reading time, and estimated oral presentation speaking time."
      }
    ],
    faq: [
      {
        question: "What reading speed (WPM) is standard for online articles and blog posts?",
        answer: "The standard average silent reading speed for adults is approximately 200 to 250 words per minute (WPM). Zubware defaults to 200 WPM to provide a conservative, accessible reading time estimate."
      },
      {
        question: "How does speech presentation time differ from silent reading time?",
        answer: "Speaking aloud is significantly slower than reading silently. Speech delivery typically ranges between 130 and 150 WPM to maintain clear articulation, audience pacing, and emphasis."
      },
      {
        question: "How is reading time calculated for articles that take less than a minute?",
        answer: "The calculator breaks down duration into exact minutes and seconds (e.g. '0 min 45 sec') rather than rounding small snippets up to a full minute."
      },
      {
        question: "Does the calculator count words accurately across punctuation and line breaks?",
        answer: "Yes. The text parser splits on whitespace and cleans punctuation marks to count distinct lexical words accurately."
      },
      {
        question: "Is my pasted article or speech text uploaded to an external server?",
        answer: "No. Text parsing, word counting, and reading speed calculations occur 100% locally in your web browser memory."
      }
    ]
  }
};

export function updateBatch5InToolsData() {
  const filePath = path.resolve(__dirname, '../src/data/toolsData.ts');
  let content = fs.readFileSync(filePath, 'utf8');

  let updatedCount = 0;

  for (const [toolId, update] of Object.entries(BATCH_5_TOOLS)) {
    const idRegex = new RegExp(`(\\n\\s*id:\\s*['"]${toolId}['"],)`);
    const match = content.match(idRegex);
    if (!match || match.index === undefined) {
      console.error(`Tool ID not found: ${toolId}`);
      continue;
    }

    const startIndex = match.index;
    const afterId = content.slice(startIndex);
    const endMatch = afterId.match(/\n  \}(,?)/);
    if (!endMatch || endMatch.index === undefined) {
      console.error(`Could not find end of tool object: ${toolId}`);
      continue;
    }

    const toolBlockLength = endMatch.index + endMatch[0].length;
    let toolChunk = afterId.slice(0, toolBlockLength);

    const howToIndent = '    ';
    const howToFormatted = `${howToIndent}howTo: [\n` +
      update.howTo.map(step => 
        `${howToIndent}  { title: ${JSON.stringify(step.title)}, desc: ${JSON.stringify(step.desc)} }`
      ).join(',\n') +
      `\n${howToIndent}]`;

    const faqFormatted = `${howToIndent}faq: [\n` +
      update.faq.map(item =>
        `${howToIndent}  { question: ${JSON.stringify(item.question)}, answer: ${JSON.stringify(item.answer)} }`
      ).join(',\n') +
      `\n${howToIndent}]`;

    if (toolChunk.includes('howTo:')) {
      toolChunk = toolChunk.replace(/\n\s*howTo:\s*\[[\s\S]*?\n\s*\]/, `\n${howToFormatted}`);
    } else {
      if (toolChunk.includes('features:')) {
        const featMatch = toolChunk.match(/\n\s*features:\s*\[[\s\S]*?\],?/);
        if (featMatch && featMatch.index !== undefined) {
          const insertPos = featMatch.index + featMatch[0].length;
          let before = toolChunk.slice(0, insertPos);
          if (!before.endsWith(',')) before += ',';
          toolChunk = before + `\n${howToFormatted},` + toolChunk.slice(insertPos);
        } else {
          toolChunk = toolChunk.replace(/\n  \}(,?)$/, `,\n${howToFormatted}\n  }$1`);
        }
      } else {
        toolChunk = toolChunk.replace(/\n  \}(,?)$/, `,\n${howToFormatted}\n  }$1`);
      }
    }

    if (toolChunk.includes('faq:')) {
      toolChunk = toolChunk.replace(/\n\s*faq:\s*\[[\s\S]*?\n\s*\]/, `\n${faqFormatted}`);
    } else {
      const howToMatch = toolChunk.match(/\n\s*howTo:\s*\[[\s\S]*?\],?/);
      if (howToMatch && howToMatch.index !== undefined) {
        const insertPos = howToMatch.index + howToMatch[0].length;
        let before = toolChunk.slice(0, insertPos);
        if (!before.endsWith(',')) before += ',';
        toolChunk = before + `\n${faqFormatted},` + toolChunk.slice(insertPos);
      } else {
        toolChunk = toolChunk.replace(/\n  \}(,?)$/, `,\n${faqFormatted}\n  }$1`);
      }
    }

    toolChunk = toolChunk.replace(/,(\s*\n\s*\},?)$/, '$1');
    toolChunk = toolChunk.replace(/,\s*,/g, ',');

    content = content.slice(0, startIndex) + toolChunk + content.slice(startIndex + toolBlockLength);
    updatedCount++;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully updated ${updatedCount} Batch 5 tools in toolsData.ts.`);
}

if (process.argv[1] && process.argv[1].endsWith('updateBatch5Tools.ts')) {
  updateBatch5InToolsData();
}
