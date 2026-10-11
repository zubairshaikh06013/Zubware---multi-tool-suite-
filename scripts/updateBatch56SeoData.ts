import * as fs from 'fs';
import * as path from 'path';

interface HowToStep {
  title: string;
  desc: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface ToolSeoEntry {
  howTo: HowToStep[];
  faq: FaqItem[];
}

export const BATCH_5_6_UPGRADES: Record<string, ToolSeoEntry> = {
  // ==========================================
  // BATCH 5: 17 DESIGN & UTILITY TOOLS
  // ==========================================
  'contrast-checker': {
    howTo: [
      {
        title: "Pick or Input Foreground Color",
        desc: "Enter a 6-digit hex color code or use the color picker to select your text or UI element color."
      },
      {
        title: "Pick or Input Background Color",
        desc: "Enter the hex color code or use the picker to set your card, button, or page background."
      },
      {
        title: "Review Calculated Contrast Ratio",
        desc: "Inspect the mathematical contrast ratio calculated from 1:1 up to 21:1 based on standard sRGB relative luminance."
      },
      {
        title: "Verify WCAG 2.1 Compliance Levels",
        desc: "Check real-time pass/fail indicators across Normal Text AA (4.5:1), Normal Text AAA (7:1), Large Text AA (3:1), and UI Components (3:1)."
      },
      {
        title: "Test Live Preview & Swap Colors",
        desc: "Preview typography legibility on the interactive sample card and click Swap Colors to test inverse color schemes."
      }
    ],
    faq: [
      {
        question: "How is the WCAG color contrast ratio calculated?",
        answer: "The contrast ratio is calculated using the W3C formula (L1 + 0.05) / (L2 + 0.05), where L1 is the relative luminance of the lighter color and L2 is the relative luminance of the darker color, yielding values from 1:1 (zero contrast) to 21:1 (black on white)."
      },
      {
        question: "What is the difference between WCAG AA and AAA compliance?",
        answer: "WCAG Level AA requires a minimum contrast of 4.5:1 for normal text and 3:1 for large text (18pt or 14pt bold). Level AAA represents the enhanced accessibility standard, requiring 7:1 for normal text and 4.5:1 for large text."
      },
      {
        question: "What qualifies as 'Large Text' under WCAG guidelines?",
        answer: "Large text is defined as at least 18pt (24px) regular font weight, or at least 14pt (approximately 18.66px) bold font weight. Because larger strokes are easier to read, lower contrast ratios are permitted."
      },
      {
        question: "Does this contrast checker evaluate graphical user interface components?",
        answer: "Yes. Under WCAG 2.1 Success Criterion 1.4.11 (Non-text Contrast), user interface components such as button borders, active form input outlines, and icons must achieve at least a 3:1 contrast ratio against adjacent backgrounds."
      },
      {
        question: "Can an automated contrast check guarantee complete digital accessibility compliance?",
        answer: "No. While color contrast is a critical requirement of WCAG, full compliance also requires semantic HTML, keyboard navigability, screen reader compatibility, focus indicators, and testing across color vision deficiencies."
      },
      {
        question: "Does color contrast apply to disabled buttons and placeholder text?",
        answer: "WCAG 2.1 specifically exempts inactive or disabled user interface components. However, accessible design best practice recommends ensuring form placeholder text achieves at least 4.5:1 contrast for clear readability."
      },
      {
        question: "How does relative luminance account for human eye color perception?",
        answer: "Relative luminance calculates photometric brightness by weighting sRGB color channels (0.2126 Red, 0.7152 Green, 0.0722 Blue) to reflect human retinal sensitivity, which is far more sensitive to green wavelengths than red or blue."
      },
      {
        question: "Can I test semi-transparent (RGBA) colors with this tool?",
        answer: "The contrast checker calculates mathematically precise ratios using 6-digit hex color values. When using semi-transparent colors, calculate the resulting blended hex color against the background before testing."
      },
      {
        question: "Why does dark mode require different contrast considerations than light mode?",
        answer: "In dark mode, pure white text (#ffffff) on pitch black (#000000) achieves a 21:1 contrast ratio that can cause visual halation (glowing/fuzziness) for users with astigmatism. Off-white text (#e2e8f0) on dark slate (#0f172a) often provides better reading comfort."
      },
      {
        question: "Are color values or tested palettes saved or sent to any server?",
        answer: "No. All relative luminance calculations, ratio evaluations, and live preview rendering occur completely client-side in your browser."
      },
      {
        question: "Can I use the Contrast Checker on mobile devices and tablets?",
        answer: "Yes. The interface is fully responsive, featuring touch-friendly color pickers and instant contrast calculations on smartphones and tablets."
      }
    ]
  },

  'qr-business-card-generator': {
    howTo: [
      {
        title: "Enter Personal & Contact Details",
        desc: "Fill in your full name, job title, company name, department, phone numbers, and email addresses."
      },
      {
        title: "Add Web & Physical Address Information",
        desc: "Input your personal or corporate website URL, office address, and optional bio or notes."
      },
      {
        title: "Customize QR Dimensions & Visual Styling",
        desc: "Set your target pixel size (180px to 400px), margin padding, foreground color, and background color."
      },
      {
        title: "Select Error Correction Level",
        desc: "Choose between L (7%), M (15%), Q (25%), or H (30%) error correction to guarantee scanning reliability."
      },
      {
        title: "Export Vector SVG, PNG, or Copy vCard Text",
        desc: "Download print-ready vector SVG for business cards, high-resolution PNG for digital sharing, or copy raw vCard text."
      }
    ],
    faq: [
      {
        question: "What is a vCard QR Code and how does it work when scanned?",
        answer: "A vCard QR code encodes structured electronic business card text (vCard 3.0 standard). When scanned with an iPhone or Android camera, the phone automatically prompts the user to save the contact directly into their contacts app without manual typing."
      },
      {
        question: "What is the difference between encoding a vCard vs encoding a website URL?",
        answer: "A URL QR code redirects the scanner to a webpage. A vCard QR code embeds the contact information (name, phone, email, company, address) directly inside the QR symbol itself, functioning offline without requiring an internet connection."
      },
      {
        question: "Which contact fields are supported by this generator?",
        answer: "The generator supports Full Name, Job Title, Company, Department, Work Phone, Mobile Phone, Work Email, Personal Email, Website URL, Physical Street Address, and Notes/Bio."
      },
      {
        question: "Why should I use Vector SVG format for printed business cards?",
        answer: "SVG is an infinitely scalable vector format that will not pixelate or blur at any print resolution. Commercial printers require vector formats to ensure crisp edges at 300+ DPI on luxury card stock."
      },
      {
        question: "What is Error Correction Level and which setting is recommended?",
        answer: "Error correction (Reed-Solomon algorithm) allows the QR code to be scanned even if smudged, creased, or partially obscured. Level M (15% recovery) or Level Q (25% recovery) is ideal for printed business cards."
      },
      {
        question: "Is there a character limit for contact data stored in a business card QR code?",
        answer: "Standard QR codes can store thousands of characters, but dense data creates smaller, more intricate modules that require careful scanning. Keeping bio notes concise ensures quick scanning across all smartphone cameras."
      },
      {
        question: "Do I need a special app to scan the generated QR business card?",
        answer: "No. Modern iOS (iPhone camera app) and Android (Google Lens / native camera) natively recognize vCard QR codes and provide an instant 'Add to Contacts' banner."
      },
      {
        question: "Can I change my contact details after printing the QR code?",
        answer: "Because this creates a direct static vCard QR code with your data stored inside the barcode pattern, printed cards cannot be edited dynamically. Always double-check phone numbers and email spelling before sending cards to print."
      },
      {
        question: "Are my personal contact details stored on Zubware servers?",
        answer: "No. The vCard string generation and QR matrix rendering execute 100% locally in your web browser. No contact information, phone numbers, or emails are transmitted or saved."
      },
      {
        question: "What is the minimum physical size for printing a vCard QR code on a card?",
        answer: "For standard vCard data density, print the QR code at a minimum size of 0.8 x 0.8 inches (20 x 20 mm) with adequate white space margin to ensure seamless optical camera autofocus."
      },
      {
        question: "Does this tool charge any recurring fees or subscription to keep the QR code working?",
        answer: "No. Unlike commercial dynamic QR services that disable codes after free trials, static vCard QR codes generated here never expire and remain functional forever."
      }
    ]
  },

  'unit-converter': {
    howTo: [
      {
        title: "Select Measurement Category",
        desc: "Choose from Length, Mass/Weight, Temperature, Volume, Area, Speed, or Digital Storage."
      },
      {
        title: "Input Value to Convert",
        desc: "Type the numeric value you want to convert into the input field."
      },
      {
        title: "Choose Source & Destination Units",
        desc: "Select your starting unit and target unit from the organized dropdown menus."
      },
      {
        title: "Inspect Instant Conversion Result",
        desc: "Review the calculated output with exact conversion factors and mathematical precision."
      },
      {
        title: "Swap Units or Copy Output",
        desc: "Click the Swap button to reverse the conversion direction or Copy to copy the result to your clipboard."
      }
    ],
    faq: [
      {
        question: "Which measurement categories are supported by this Unit Converter?",
        answer: "The converter supports 7 primary categories: Length (meters, km, miles, feet, inches), Mass/Weight (kg, grams, pounds, ounces), Temperature (Celsius, Fahrenheit, Kelvin), Volume (liters, gallons, cups, cubic meters), Area (sq meters, sq feet, acres, hectares), Speed (m/s, km/h, mph, knots), and Digital Storage (bytes, KB, MB, GB, TB)."
      },
      {
        question: "What is the scientific distinction between mass and weight in unit conversion?",
        answer: "Scientifically, mass is the quantity of matter in an object (measured in kilograms or grams), whereas weight is the gravitational force acting on that mass (measured in Newtons). In everyday commercial conversion, pounds and kilograms are treated as equivalent mass-to-mass standards on Earth."
      },
      {
        question: "How is Temperature converted between Celsius, Fahrenheit, and Kelvin?",
        answer: "Temperature conversions use affine formulas: Fahrenheit = (Celsius * 9/5) + 32; Celsius = (Fahrenheit - 32) * 5/9; Kelvin = Celsius + 273.15. Unlike length or mass, temperature scales have differing zero reference points."
      },
      {
        question: "Does the volume converter use US Customary or Imperial British gallons?",
        answer: "The volume converter uses US Customary units where 1 US Gallon = 3.78541 liters (and 1 US Cup = 236.588 ml), which is standard across North American engineering and consumer packaging."
      },
      {
        question: "How does the Digital Storage converter handle Decimal vs Binary byte prefixes?",
        answer: "The converter follows the standard decimal metric system (1 KB = 1,000 Bytes, 1 MB = 1,000,000 Bytes, 1 GB = 1,000,000,000 Bytes) used by hard drive manufacturers and networking standards."
      },
      {
        question: "How many decimal places of precision does the calculator preserve?",
        answer: "Calculations are performed with high floating-point precision and formatted cleanly to eliminate recurring float rounding anomalies while preserving scientific accuracy."
      },
      {
        question: "Can I convert negative values with this tool?",
        answer: "Yes, negative values are fully supported for temperature scales (such as sub-zero Celsius and Fahrenheit) and differential measurements."
      },
      {
        question: "Does this tool require an internet connection or send data to a server?",
        answer: "No. All conversion factors and mathematical calculations run 100% locally inside your web browser."
      },
      {
        question: "Can I use the Unit Converter on mobile phones and tablets?",
        answer: "Yes. The interface is responsive and touch-optimized for fast lookups on Android and iOS devices."
      },
      {
        question: "What is the conversion factor between kilometers and miles?",
        answer: "1 mile is equal to exactly 1.609344 kilometers. Conversely, 1 kilometer is approximately equal to 0.621371 miles."
      },
      {
        question: "What is the conversion factor between kilograms and pounds?",
        answer: "1 kilogram is internationally defined as approximately 2.20462262 pounds (avoirdupois). Conversely, 1 pound is exactly 0.45359237 kilograms."
      }
    ]
  },

  'percentage-calculator': {
    howTo: [
      {
        title: "Choose Your Calculation Scenario",
        desc: "Select among 4 calculation modes: P% of X, X is what % of Y, Percentage Increase/Decrease, or Add/Subtract %."
      },
      {
        title: "Enter First Value (Base or Percentage)",
        desc: "Input your first number into the designated field with decimal or integer values."
      },
      {
        title: "Enter Second Value (Comparison or Total)",
        desc: "Input the second number to complete the mathematical formula."
      },
      {
        title: "Review Instant Calculation Result",
        desc: "Inspect the calculated output along with the visual indicator of change."
      },
      {
        title: "Examine Step-by-Step Formula & Copy",
        desc: "Read the clear mathematical breakdown showing the exact equation used, and copy the result."
      }
    ],
    faq: [
      {
        question: "What is the mathematical difference between percentage change and percentage points?",
        answer: "Percentage change measures the relative proportional change between two numbers (e.g., from 10% to 15% is a 50% relative increase). Percentage points refer to the simple arithmetic difference between two percentage values (15% minus 10% = 5 percentage points)."
      },
      {
        question: "How do you calculate percentage increase or decrease between two numbers?",
        answer: "The formula is: Percentage Change = ((New Value - Old Value) / |Old Value|) * 100. If the result is positive, it represents an increase; if negative, it represents a decrease."
      },
      {
        question: "How do you find what percentage one number is of another?",
        answer: "Divide the part by the whole and multiply by 100: Percentage = (Part / Whole) * 100. For example, 30 out of 200 is (30 / 200) * 100 = 15%."
      },
      {
        question: "How do you calculate a percentage of a given number?",
        answer: "Multiply the number by the percentage expressed as a decimal: Result = Number * (Percent / 100). For example, 15% of 200 is 200 * 0.15 = 30."
      },
      {
        question: "Why does adding 20% and then subtracting 20% not return to the original number?",
        answer: "Because the base changes. If you start with 100 and add 20%, you get 120. Subtracting 20% of 120 (which is 24) leaves you with 96. Percentage decreases operate on the new, larger base."
      },
      {
        question: "Can percentage increase exceed 100%?",
        answer: "Yes. Any time a value more than doubles, the percentage increase exceeds 100%. For example, an increase from 50 to 150 represents a 200% increase."
      },
      {
        question: "Can percentage decrease exceed 100% in real-world scenarios?",
        answer: "For standard positive quantities (prices, weights, populations), a decrease cannot exceed 100% because reaching zero is a 100% decrease. Exceeding 100% would imply entering negative values."
      },
      {
        question: "How do you reverse calculate original price before a percentage discount?",
        answer: "To find original price from a discounted price: Original Price = Discounted Price / (1 - (Discount% / 100)). For example, if you paid $80 after a 20% discount, the original price was $80 / 0.80 = $100."
      },
      {
        question: "Does this percentage calculator support negative numbers and decimals?",
        answer: "Yes. You can input positive, negative, and decimal values across all four calculation modes."
      },
      {
        question: "Are calculation inputs or financial data stored on any server?",
        answer: "No. All percentage calculations execute purely client-side in your device's browser memory."
      },
      {
        question: "Can I use the Percentage Calculator for grade marks and exam percentages?",
        answer: "Yes. Use the 'X is what % of Y' mode, entering your scored marks in X and total possible marks in Y to find your exact exam percentage."
      }
    ]
  },

  'emi-calculator': {
    howTo: [
      {
        title: "Input Principal Loan Amount",
        desc: "Enter the total loan amount you intend to borrow from a bank or lending institution."
      },
      {
        title: "Set Annual Interest Rate",
        desc: "Enter the lender's annual percentage interest rate (fixed or floating rate basis)."
      },
      {
        title: "Specify Loan Tenure in Years",
        desc: "Input your intended loan repayment duration in years."
      },
      {
        title: "Add Optional Monthly Prepayment",
        desc: "Enter an extra monthly payment amount to test how prepayments accelerate loan payoff and save interest."
      },
      {
        title: "Analyze Monthly EMI & Amortization Schedule",
        desc: "Review your monthly EMI, total interest payable, overall repayment, and year-by-year amortization table."
      }
    ],
    faq: [
      {
        question: "What is an Equated Monthly Installment (EMI) and how is it calculated?",
        answer: "An EMI is a fixed monthly payment made by a borrower to a lender. It is calculated using the standard formula: EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1], where P is Principal, r is monthly interest rate (annual rate / 12 / 100), and n is total months."
      },
      {
        question: "Why is the interest portion higher in early EMI payments and principal higher later?",
        answer: "In early months, the outstanding loan balance is at its peak, so monthly interest charges are highest. As regular monthly payments reduce the principal balance, the monthly interest charge decreases, allowing a larger portion of each payment to amortize principal."
      },
      {
        question: "How does making extra monthly prepayments impact total loan cost?",
        answer: "Extra prepayments directly reduce the principal balance. Because subsequent monthly interest is computed on a smaller outstanding principal, you significantly reduce overall interest paid and shorten the total loan tenure."
      },
      {
        question: "Does this EMI calculator include processing fees, GST, or insurance charges?",
        answer: "No. This tool calculates pure principal and interest repayment. Banks and NBFCs may add one-time processing fees (typically 0.5% - 2%), statutory taxes (such as GST in India), and mandatory loan insurance premiums."
      },
      {
        question: "What is the difference between a Fixed-Rate and Floating-Rate loan?",
        answer: "In a fixed-rate loan, the interest rate and EMI remain constant throughout the tenure. In a floating-rate loan, the rate fluctuates with benchmark indices (such as the RBI repo rate or US Federal Reserve prime rate), causing the EMI or tenure to adjust."
      },
      {
        question: "Can I use this calculator for Home Loans, Car Loans, and Personal Loans?",
        answer: "Yes. The mathematical reducing-balance EMI formula is universal and applies to home mortgages, automobile loans, personal loans, and education loans."
      },
      {
        question: "How do I calculate total interest paid over the entire life of the loan?",
        answer: "Total Interest Paid = (Monthly EMI * Total Months) - Original Principal Loan Amount. The calculator displays this figure automatically."
      },
      {
        question: "What is an Amortization Schedule?",
        answer: "An amortization schedule is an itemized year-by-year or month-by-month table showing each payment's allocation between principal reduction and interest, alongside the remaining loan balance."
      },
      {
        question: "Does this calculator guarantee that a bank will approve my loan?",
        answer: "No. The calculator provides mathematical estimates based on user inputs. Loan approval depends on credit scores (CIBIL/FICO), debt-to-income ratios, employment stability, and underwriting criteria."
      },
      {
        question: "Is my personal loan or financial data stored or transmitted to external servers?",
        answer: "No. All financial calculations occur strictly client-side in your web browser. No personal data or financial figures leave your device."
      },
      {
        question: "What is a good Debt-to-Income (DTI) ratio when planning an EMI?",
        answer: "Most financial advisors recommend keeping total monthly EMI obligations under 40% to 50% of your net monthly income to maintain healthy financial buffers for emergencies and living expenses."
      }
    ]
  },

  'discount-calculator': {
    howTo: [
      {
        title: "Select Currency & Calculation Mode",
        desc: "Choose your preferred currency symbol and toggle between Single Item mode and Shopping Cart mode."
      },
      {
        title: "Input Original Retail Price",
        desc: "Enter the original pre-discount sticker price of the product or service."
      },
      {
        title: "Choose Discount Type (Percentage or Flat)",
        desc: "Select percentage off (% discount) or a flat monetary discount ($ / € / ₹ off)."
      },
      {
        title: "Apply Stacked Discounts & Sales Tax",
        desc: "Optionally add a secondary coupon discount (e.g., extra 10% off) and input local sales tax or VAT percentage."
      },
      {
        title: "Inspect Final Price & Total Savings",
        desc: "Review your final checkout price, total monetary savings, effective discount percentage, and tax breakdown."
      }
    ],
    faq: [
      {
        question: "How do you calculate a percentage discount on an item?",
        answer: "Multiply the original price by the discount percentage divided by 100 to find savings: Savings = Original Price * (Discount% / 100). Subtract savings from the original price to find the final price: Final Price = Original Price - Savings."
      },
      {
        question: "How do stacked or double discounts work (e.g., 20% off plus an extra 10% off)?",
        answer: "Stacked discounts are applied sequentially, not additively. For example, on a $100 item, 20% off reduces the price to $80. The extra 10% discount is applied to $80 ($8 discount), resulting in a final price of $72 (an effective 28% total discount, not 30%)."
      },
      {
        question: "How does sales tax affect the discounted purchase price?",
        answer: "In most jurisdictions, sales tax or VAT is calculated on the discounted sale price, not the original sticker price. Final Checkout Cost = Discounted Price * (1 + (Sales Tax% / 100))."
      },
      {
        question: "What is the difference between a percentage discount and a flat cash discount?",
        answer: "A percentage discount scales proportionally with the price (e.g., 25% off $200 saves $50). A flat discount subtracts a fixed dollar or rupee amount (e.g., $25 off) regardless of total item value."
      },
      {
        question: "How do you calculate the original price if you only know the discounted price?",
        answer: "Original Price = Discounted Price / (1 - (Discount% / 100)). For example, if you paid $75 after a 25% discount, the original price was $75 / 0.75 = $100."
      },
      {
        question: "How is 'Buy One Get One Free' (BOGO) calculated as a percentage discount?",
        answer: "A true 'Buy One, Get One Free' promotion across two identically priced items represents exactly a 50% discount on the total purchase. 'Buy One, Get One 50% Off' represents an effective 25% overall discount."
      },
      {
        question: "Can I use the Shopping Cart mode for multiple products?",
        answer: "Yes. Switch to Cart Mode to enter multiple items with differing individual prices and discount rates to calculate total basket savings."
      },
      {
        question: "Does this calculator support international currencies like INR, EUR, and GBP?",
        answer: "Yes. The tool includes a currency selector supporting USD ($), EUR (€), GBP (£), INR (₹), JPY (¥), CAD, AUD, and more."
      },
      {
        question: "Why do some retail stores calculate sales tax before coupons?",
        answer: "Store policies vary: manufacturer coupons in some US states may be taxable on the pre-coupon amount, whereas store discounts reduce the taxable base. This calculator applies tax to the net sale price."
      },
      {
        question: "Is any shopping or price data sent to a server?",
        answer: "No. All discount, tax, and cart calculations are processed locally inside your web browser."
      },
      {
        question: "Can I use the Discount Calculator on mobile devices while shopping in stores?",
        answer: "Yes. The mobile-responsive interface allows you to quickly calculate clearance rack savings and final register prices directly on your phone."
      }
    ]
  },

  'currency-calculator': {
    howTo: [
      {
        title: "Input Conversion Amount",
        desc: "Type the monetary amount you wish to convert into the amount field."
      },
      {
        title: "Select Base Currency (From)",
        desc: "Choose the starting currency from the organized global currency selector."
      },
      {
        title: "Select Target Currency (To)",
        desc: "Choose the destination currency you want to convert into."
      },
      {
        title: "Inspect Instant Converted Total & Inverse Rate",
        desc: "Review the converted total, the direct exchange rate, and the inverse exchange rate."
      },
      {
        title: "Optionally Customize Exchange Rates",
        desc: "Open Rate Settings to input your bank's specific markup rate or test hypothetical exchange scenarios."
      }
    ],
    faq: [
      {
        question: "How does the Currency Calculator determine exchange rates?",
        answer: "The tool utilizes benchmark reference foreign exchange rates stored in the application. Users can also open Rate Settings to enter customized exchange rates or account for bank foreign transaction spreads."
      },
      {
        question: "Why do actual bank and credit card exchange rates differ from benchmark rates?",
        answer: "Commercial banks, credit card processors, and airport currency booths add a foreign exchange spread (typically 1.5% to 4%) plus international transaction fees above mid-market interbank rates."
      },
      {
        question: "What is the 'Mid-Market Rate' (Interbank Rate)?",
        answer: "The mid-market rate is the midpoint between global wholesale buy and sell rates in international currency markets. It represents the fairest exchange benchmark before retail markups."
      },
      {
        question: "Which global currencies are supported by this calculator?",
        answer: "The calculator supports major international currencies including US Dollar (USD), Euro (EUR), British Pound (GBP), Indian Rupee (INR), Japanese Yen (JPY), Canadian Dollar (CAD), Australian Dollar (AUD), Swiss Franc (CHF), Chinese Yuan (CNY), UAE Dirham (AED), and Singapore Dollar (SGD)."
      },
      {
        question: "Can I swap the source and target currencies quickly?",
        answer: "Yes. Click the Swap button to instantly reverse the conversion direction and inspect the inverse exchange rate."
      },
      {
        question: "Does this tool require an internet connection or send financial data to servers?",
        answer: "No. Conversion calculations run locally in your web browser, allowing immediate lookups without network latency."
      },
      {
        question: "How do I calculate foreign transaction fees on international purchases?",
        answer: "You can adjust the conversion rate in Rate Settings to include your credit card's fee (e.g. adding 3% to the exchange rate) to see the exact cost on your monthly statement."
      },
      {
        question: "Does the calculator support cryptocurrency conversions like Bitcoin?",
        answer: "This tool is focused specifically on major fiat sovereign currencies. Cryptocurrency valuations are not included in this calculator."
      },
      {
        question: "Can I use the Currency Calculator on mobile devices while traveling abroad?",
        answer: "Yes. The tool runs smoothly on mobile browsers, making it ideal for quick price comparisons and travel budgeting on the go."
      },
      {
        question: "What is an Inverse Exchange Rate?",
        answer: "The inverse rate is the reciprocal of the direct exchange rate (1 / Rate). For example, if 1 USD = 0.92 EUR, the inverse rate is 1 EUR = 1.087 USD."
      },
      {
        question: "Can I copy the calculated currency conversion result?",
        answer: "Yes. Click the Copy button next to the result to place the formatted converted total onto your device's clipboard."
      }
    ]
  },

  'loan-calculator': {
    howTo: [
      {
        title: "Input Principal Loan / Mortgage Amount",
        desc: "Enter the total loan amount needed for your home purchase, refinance, or personal borrowing."
      },
      {
        title: "Set Annual Interest Rate",
        desc: "Enter the annual interest rate offered by your mortgage lender or bank."
      },
      {
        title: "Specify Loan Term in Years",
        desc: "Choose your loan repayment term (such as 15 or 30 years for mortgages, or 3 to 7 years for personal loans)."
      },
      {
        title: "Add Extra Monthly Principal Payments",
        desc: "Optionally enter an extra monthly payment to simulate accelerated loan payoff and interest savings."
      },
      {
        title: "Review Monthly Payment & Complete Amortization",
        desc: "Inspect your monthly principal and interest payment, lifetime interest cost, and annual amortization schedule."
      }
    ],
    faq: [
      {
        question: "What is the difference between a 15-year and a 30-year mortgage?",
        answer: "A 30-year mortgage offers lower monthly payments because repayment is spread over a longer period, but incurs significantly higher total interest. A 15-year mortgage has higher monthly payments but saves tens of thousands in lifetime interest and builds equity much faster."
      },
      {
        question: "What is included in a mortgage monthly payment calculation?",
        answer: "This calculator determines the core Principal and Interest (P&I) payment. Full mortgage escrow payments (PITI) also typically include Property Taxes, Homeowners Insurance, and Private Mortgage Insurance (PMI) if down payment is under 20%."
      },
      {
        question: "How does making extra payments accelerate loan payoff?",
        answer: "Extra monthly payments go 100% toward principal reduction. Because interest is calculated on the remaining balance, every extra dollar reduces future compounding interest, shaving years off your repayment timeline."
      },
      {
        question: "What is an Amortization Schedule and how do I read it?",
        answer: "An amortization schedule details each year's payments, showing how much money goes toward paying off the loan balance versus how much is lost to interest charges, along with the ending principal balance."
      },
      {
        question: "Does this loan calculator apply to auto loans and personal loans?",
        answer: "Yes. The mathematical reducing balance formula is identical for auto loans, fixed-rate personal loans, student loans, and home mortgages."
      },
      {
        question: "Can I calculate the exact payoff date of my loan?",
        answer: "Yes. By entering your loan term and any extra payments, the calculator displays the accelerated payoff horizon and total months saved."
      },
      {
        question: "What is Private Mortgage Insurance (PMI) and when does it apply?",
        answer: "In the United States, lenders typically require PMI on conventional loans when the down payment is less than 20% of the home value. PMI is an added monthly fee that protects the lender until you reach 20% home equity."
      },
      {
        question: "Does using this loan calculator impact my credit score?",
        answer: "No. This is an informational client-side mathematical calculator that does not perform credit inquiries or connect to credit reporting bureaus."
      },
      {
        question: "Are loan figures or property details uploaded to any cloud server?",
        answer: "No. All loan amounts, interest rates, and schedule tables are computed locally inside your browser memory."
      },
      {
        question: "What formula is used to calculate monthly mortgage payments?",
        answer: "Payment = P * [r(1 + r)^n] / [(1 + r)^n - 1], where P is Principal, r is the monthly interest rate (annual rate / 12), and n is total monthly payments."
      },
      {
        question: "Can I print or copy the calculated amortization schedule?",
        answer: "Yes. The schedule is rendered in an accessible table format that you can copy or print directly from your browser."
      }
    ]
  },

  'roi-calculator': {
    howTo: [
      {
        title: "Choose Calculator Mode",
        desc: "Select between Margin & Markup, Return on Investment (ROI), or Break-Even Analysis."
      },
      {
        title: "Input Financial Parameters",
        desc: "Enter Cost Price and Selling Price (for Margin), Investment and Revenue (for ROI), or Fixed and Variable Costs (for Break-Even)."
      },
      {
        title: "Inspect Calculated Metrics",
        desc: "Review Profit Margin %, Markup %, Net Profit, ROI %, or Break-Even unit thresholds."
      },
      {
        title: "Examine Financial Formulas",
        desc: "Read the clear mathematical explanations showing the exact differences between margin, markup, and ROI."
      },
      {
        title: "Copy Summary Results",
        desc: "Click the Copy button to copy key financial metrics to your clipboard for business planning."
      }
    ],
    faq: [
      {
        question: "What is the critical difference between Profit Margin and Markup?",
        answer: "Profit Margin is profit divided by Selling Price (Profit / Revenue * 100), measuring how much of every sales dollar is profit. Markup is profit divided by Cost Price (Profit / Cost * 100), measuring the percentage added on top of cost to set the selling price."
      },
      {
        question: "How is Return on Investment (ROI) calculated?",
        answer: "ROI = ((Net Gain from Investment - Initial Investment Cost) / Initial Investment Cost) * 100. A positive percentage indicates profit, while a negative percentage indicates a net loss."
      },
      {
        question: "How is Break-Even Point calculated in business economics?",
        answer: "Break-Even Units = Total Fixed Costs / (Selling Price per Unit - Variable Cost per Unit). Break-Even Revenue = Break-Even Units * Selling Price per Unit. This represents the volume where total revenues equal total costs."
      },
      {
        question: "Why can profit margin never exceed 100% while markup can?",
        answer: "Because profit cannot exceed total revenue (unless cost is negative), profit margin can never reach 100%. In contrast, markup has no ceiling: an item costing $1 sold for $10 has a 900% markup and a 90% profit margin."
      },
      {
        question: "What is a healthy profit margin for retail and ecommerce businesses?",
        answer: "According to industry benchmarks, a 10% net profit margin is considered average, 20% is considered strong, and margins above 20% are high. Gross margins in retail typically range from 30% to 50%."
      },
      {
        question: "Does ROI take into account the time horizon of an investment?",
        answer: "Standard simple ROI does not account for time. For multi-year investments, annualized ROI or Compound Annual Growth Rate (CAGR) should be used to compare investments of differing durations."
      },
      {
        question: "What are Fixed Costs versus Variable Costs in break-even analysis?",
        answer: "Fixed costs remain constant regardless of production volume (e.g., rent, insurance, software subscriptions). Variable costs scale directly with unit production (e.g., raw materials, packaging, transaction fees)."
      },
      {
        question: "Does this calculator distinguish Gross Margin from Net Margin?",
        answer: "The Margin mode calculates Gross Profit Margin based on product cost and selling price. To calculate Net Margin, subtract operating overhead and taxes from gross profit."
      },
      {
        question: "Are financial projections or proprietary pricing figures sent to a server?",
        answer: "No. All formulas and computations execute purely client-side in your web browser. No confidential commercial data is transmitted."
      },
      {
        question: "Can I use custom currency symbols with this calculator?",
        answer: "Yes. The tool allows you to toggle currency symbols including $, €, £, ₹, or ¥."
      },
      {
        question: "Can I use the ROI Calculator for marketing and advertising campaigns (ROAS)?",
        answer: "Yes. By inputting total ad spend as investment cost and attributed revenue as return, you can calculate marketing campaign ROI and Return on Ad Spend (ROAS)."
      }
    ]
  },

  'compound-interest-calculator': {
    howTo: [
      {
        title: "Choose Compound Interest or CAGR Tab",
        desc: "Select the Compound tab to simulate long-term investment growth or the CAGR tab to calculate historical annual returns."
      },
      {
        title: "Input Initial Principal Investment",
        desc: "Enter your starting investment deposit or savings balance."
      },
      {
        title: "Add Monthly Contributions & Interest Rate",
        desc: "Enter optional recurring monthly deposits and the expected annual interest rate percentage."
      },
      {
        title: "Select Compounding Frequency & Years",
        desc: "Choose compounding frequency (Annually, Quarterly, Monthly, or Daily) and investment horizon in years."
      },
      {
        title: "Analyze Growth Trajectory & Final Balance",
        desc: "Inspect your total future value, total contributions, total compound interest earned, and annual growth schedule."
      }
    ],
    faq: [
      {
        question: "What is Compound Interest and how does it differ from Simple Interest?",
        answer: "Simple interest is calculated only on the initial principal. Compound interest calculates interest on both the initial principal and the accumulated interest from prior periods ('interest on interest'), resulting in exponential growth over time."
      },
      {
        question: "What is the Compound Interest formula?",
        answer: "The formula without additional deposits is: A = P * (1 + r/n)^(n*t), where A is future value, P is principal, r is annual interest rate as a decimal, n is compounding frequency per year, and t is time in years."
      },
      {
        question: "What is CAGR (Compound Annual Growth Rate) and how is it calculated?",
        answer: "CAGR represents the annualized rate of geometric return over a period of time: CAGR = ((End Value / Start Value)^(1 / Years)) - 1. It smooths out market fluctuations to show steady annual compounding."
      },
      {
        question: "How does compounding frequency (Monthly vs Annually) impact returns?",
        answer: "More frequent compounding generates higher returns because interest is credited and reinvested sooner. Compounding monthly or daily yields slightly more than annual compounding at the same nominal rate."
      },
      {
        question: "What is the 'Rule of 72' in compound interest?",
        answer: "The Rule of 72 is a quick mental math shortcut to estimate how many years it takes for an investment to double at a fixed rate: Years to Double ≈ 72 / Annual Rate. At 8% return, an investment doubles in about 72 / 8 = 9 years."
      },
      {
        question: "How do monthly contributions amplify compound interest?",
        answer: "Regular monthly contributions continually increase the compounding base. Over decades, regular small deposits often generate far more wealth than a single lump sum because they benefit from dollar-cost averaging and compounding."
      },
      {
        question: "Does this calculator account for inflation or taxes?",
        answer: "This tool calculates nominal gross returns. To estimate real purchasing power, subtract expected inflation (e.g. 2-3%) or capital gains taxes from your estimated annual rate."
      },
      {
        question: "Does historical CAGR guarantee future investment returns?",
        answer: "No. Historical CAGR reflects past performance over a specific period. Past performance does not guarantee future financial market returns."
      },
      {
        question: "Are investment amounts or portfolio figures uploaded to any server?",
        answer: "No. All compound growth simulations and CAGR equations run locally in your browser memory."
      },
      {
        question: "Can I use this calculator for retirement planning (401k, IRA, PPF, SIP)?",
        answer: "Yes. The calculator is ideal for simulating SIP (Systematic Investment Plans), 401(k), IRA, PPF, and mutual fund wealth accumulation over 5 to 40 years."
      },
      {
        question: "What is the difference between Arithmetic Average Return and CAGR?",
        answer: "Arithmetic average return sums all annual returns and divides by the number of years, which exaggerates performance when volatility is present. CAGR accounts for compounding and sequence of returns, reflecting true wealth growth."
      }
    ]
  },

  'countdown-calculator': {
    howTo: [
      {
        title: "Enter Event Name",
        desc: "Type a descriptive title for your target event, holiday, deadline, or milestone."
      },
      {
        title: "Pick Target Date and Time",
        desc: "Use the interactive date and time picker to select the exact moment of the event."
      },
      {
        title: "Inspect Live Time Remaining",
        desc: "Review the dynamic countdown showing exact days, hours, minutes, and seconds remaining."
      },
      {
        title: "Review Alternative Time Units",
        desc: "Inspect total days, total weeks, total hours, and business days until the target date."
      },
      {
        title: "Share or Copy Countdown Summary",
        desc: "Click Copy to copy the formatted countdown summary to your clipboard."
      }
    ],
    faq: [
      {
        question: "How does the Countdown Calculator compute time remaining?",
        answer: "The calculator calculates the millisecond difference between the user's current local device time and the specified target date, breaking down the difference into days, hours, minutes, and seconds."
      },
      {
        question: "How does the tool handle past dates?",
        answer: "If the target date has already occurred, the calculator detects this and displays how many days, hours, and minutes have elapsed since the event passed."
      },
      {
        question: "Does the countdown account for leap years and daylight saving time?",
        answer: "Yes. Because date differences are calculated using the browser's native Date object and UTC epoch timestamps, leap years and local daylight saving time transitions are automatically handled."
      },
      {
        question: "Can I calculate business days remaining until a deadline?",
        answer: "Yes. The tool includes an alternative units panel that calculates working business days (excluding Saturdays and Sundays) until your target date."
      },
      {
        question: "What happens if I change my computer's clock or time zone?",
        answer: "The calculator reads the local system clock provided by your browser. Changing your device clock will alter the calculated remaining time."
      },
      {
        question: "Can I use the Countdown Calculator for exams, weddings, and product launches?",
        answer: "Yes. You can enter any custom event name and future date to track project deadlines, competitive exam dates, vacations, or product launch milestones."
      },
      {
        question: "Does the countdown continue to tick in real-time?",
        answer: "Yes. The counter updates every second in real-time while the page is open."
      },
      {
        question: "Are my event dates or personal schedules saved to any cloud database?",
        answer: "No. All countdown calculations run locally in your web browser. No personal event data is transmitted or stored on external servers."
      },
      {
        question: "Can I copy the countdown summary to paste into an email or messaging app?",
        answer: "Yes. Click the Copy button to copy the event name and remaining time formatted cleanly for easy sharing."
      },
      {
        question: "Can I use this tool on mobile phones and tablets?",
        answer: "Yes. The countdown calculator is fully responsive and supports touch-friendly date selection on iOS and Android devices."
      },
      {
        question: "What is the difference between Countdown Calculator and Countdown Timer?",
        answer: "The Countdown Calculator measures time until a specific future calendar date (e.g. Dec 31, 2026), whereas the Countdown Timer counts down a specific duration of hours, minutes, and seconds (e.g. a 25-minute Pomodoro timer)."
      }
    ]
  },

  'online-stopwatch': {
    howTo: [
      {
        title: "Start the Stopwatch",
        desc: "Click the Start button to begin high-resolution millisecond timing."
      },
      {
        title: "Record Lap Split Times",
        desc: "Click the Lap button while running to record individual split times without stopping the main timer."
      },
      {
        title: "Pause and Resume Timing",
        desc: "Click Pause to freeze elapsed time, and click Resume to continue from the exact millisecond."
      },
      {
        title: "Inspect Fastest & Slowest Laps",
        desc: "Review the lap history table highlighting the fastest lap in green and slowest lap in red."
      },
      {
        title: "Reset Timer or Copy Lap History",
        desc: "Click Reset to clear the timer to zero, or click Copy Laps to copy formatted split times to your clipboard."
      }
    ],
    faq: [
      {
        question: "What is the timing precision of the Zubware Online Stopwatch?",
        answer: "The stopwatch utilizes the browser's high-resolution performance.now() API and requestAnimationFrame, providing millisecond (0.001 second) precision far superior to basic setInterval timers."
      },
      {
        question: "How does the Lap Timing feature work?",
        answer: "Clicking Lap captures the current timestamp. The tool computes both the individual lap duration (time since last lap) and the total cumulative elapsed time, automatically highlighting the fastest and slowest laps."
      },
      {
        question: "Does the stopwatch lose accuracy if I switch browser tabs?",
        answer: "Modern browsers throttle background tab timers to save battery. However, our stopwatch calculates elapsed time by comparing high-resolution delta timestamps against performance.now(), ensuring that when you return to the tab, the displayed time is accurate."
      },
      {
        question: "Can I use the stopwatch for athletic training, track splits, and workouts?",
        answer: "Yes. The high-contrast, responsive interface and lap recording make it ideal for interval training, track runs, swimming splits, and HIIT workouts."
      },
      {
        question: "Can I copy or export recorded lap times?",
        answer: "Yes. Click the Copy Laps button to copy the complete list of lap numbers, split durations, and total times to your clipboard for spreadsheets or training logs."
      },
      {
        question: "Does the stopwatch support keyboard shortcuts?",
        answer: "Yes. You can press the Spacebar to Start/Pause and the 'L' key to record a lap for fast, keyboard-driven operation."
      },
      {
        question: "Does the stopwatch consume battery or send data to servers?",
        answer: "No. The stopwatch runs 100% locally in your web browser with zero server uploads and optimized frame rendering."
      },
      {
        question: "What is the maximum duration the stopwatch can record?",
        answer: "The stopwatch can record continuously for hundreds of hours, displaying hours, minutes, seconds, and milliseconds."
      },
      {
        question: "Is this stopwatch considered laboratory-grade calibration equipment?",
        answer: "While browser timing using performance.now() is accurate to fractions of a millisecond, operating system thread scheduling and hardware display refresh rates mean it should be used for sports, study, and productivity rather than certified scientific laboratory calibration."
      },
      {
        question: "Can I use the Online Stopwatch on an iPhone or Android phone?",
        answer: "Yes. The stopwatch is touch-optimized with large tap targets for seamless use on smartphones and tablets."
      },
      {
        question: "Does the stopwatch continue running if my device goes into deep sleep?",
        answer: "If your operating system enters deep sleep or hibernates, system clocks pause hardware execution. We recommend keeping your display active during active timing sessions."
      }
    ]
  },

  'countdown-timer': {
    howTo: [
      {
        title: "Select Preset or Set Custom Duration",
        desc: "Choose a quick preset (1m, 5m, 15m, 25m Pomodoro) or input custom Hours, Minutes, and Seconds."
      },
      {
        title: "Start the Countdown",
        desc: "Click the Start button to begin counting down to zero with real-time circular visual progress."
      },
      {
        title: "Pause, Resume, or Add Time",
        desc: "Click Pause to pause the timer, Resume to continue, or '+1 Min' to add extra time on the fly."
      },
      {
        title: "Audio Chime & Desktop Notification Alert",
        desc: "When the timer reaches zero, an audio chime sounds and an optional browser notification is triggered."
      },
      {
        title: "Reset or Enter Fullscreen Mode",
        desc: "Click Reset to clear the timer, or toggle Fullscreen mode for distraction-free study and presentations."
      }
    ],
    faq: [
      {
        question: "How does the Countdown Timer alert me when time expires?",
        answer: "The timer triggers an audible chime synthesized locally via the Web Audio API (requiring no external audio file downloads). If permission is granted, it also sends a desktop notification."
      },
      {
        question: "Will the audio alarm work if my browser tab is in the background?",
        answer: "Yes. The Web Audio API synthesizer sounds even when the tab is in the background, provided audio has not been muted in your browser tab settings."
      },
      {
        question: "How do browser notification permissions work for this timer?",
        answer: "The timer requests standard HTML5 Notification permission. When allowed, an alert appears on your operating system desktop when time expires, even if you are working in another application."
      },
      {
        question: "What is the Pomodoro Technique and does this timer support it?",
        answer: "The Pomodoro Technique is a time-management method using 25-minute focused work intervals followed by 5-minute breaks. The timer includes a dedicated 25-minute Pomodoro preset button."
      },
      {
        question: "Does the timer lose seconds if I switch tabs on my computer or phone?",
        answer: "No. The countdown engine tracks actual elapsed system time rather than relying on uncalibrated intervals, ensuring exact second-by-second accuracy when returning to the tab."
      },
      {
        question: "Can I enter custom durations exceeding 24 hours?",
        answer: "Yes. You can enter custom hours, minutes, and seconds for long-running countdowns, cooking, baking, study sessions, or lab procedures."
      },
      {
        question: "Can I use the timer in Fullscreen mode during presentations or classrooms?",
        answer: "Yes. Click the Fullscreen icon to expand the countdown display to fill your entire monitor, making it visible across classrooms and meeting rooms."
      },
      {
        question: "Does the Countdown Timer require an internet connection after loading?",
        answer: "No. Once loaded, the timer is fully functional offline because audio synthesis and timing logic run entirely inside client-side browser memory."
      },
      {
        question: "Are timer sessions or productivity habits tracked on any server?",
        answer: "No. All timer operations execute locally on your device with complete user privacy."
      },
      {
        question: "Can I quickly add extra time without resetting the timer?",
        answer: "Yes. Click the '+1 Min' button while the timer is running or paused to immediately extend the session by 60 seconds."
      },
      {
        question: "Can I use the Countdown Timer on mobile Safari and Chrome?",
        answer: "Yes. The responsive design works smoothly on mobile browsers. Note that mobile operating systems require an initial user tap to allow audio playback."
      }
    ]
  },

  'online-clock': {
    howTo: [
      {
        title: "View Current Local Time & Date",
        desc: "Inspect your precise local time down to seconds, alongside the full day, month, date, and year."
      },
      {
        title: "Toggle 12-Hour (AM/PM) vs 24-Hour Military Time",
        desc: "Switch between 12-hour format with AM/PM indicators and 24-hour military time format with one click."
      },
      {
        title: "Inspect Local Time Zone & UTC Offset",
        desc: "Review your system's detected IANA time zone identifier and current UTC offset."
      },
      {
        title: "Add World Clock Cities",
        desc: "Click Add Clock to select major global cities (New York, London, Tokyo, Paris, Sydney, Mumbai, etc.)."
      },
      {
        title: "Monitor Synchronized Global Times",
        desc: "Track multiple international time zones simultaneously with day/night status indicators."
      }
    ],
    faq: [
      {
        question: "Where does the Online Clock get its time data?",
        answer: "The clock reads the local hardware system time and time zone configuration provided by your device's browser, synchronizing continuously down to the second."
      },
      {
        question: "How accurate is this online clock compared to official atomic clocks?",
        answer: "The clock's accuracy matches your device's internal operating system clock, which is typically synchronized with network time protocol (NTP) servers maintained by Apple, Microsoft, or Google."
      },
      {
        question: "How does the World Clock handle Daylight Saving Time (DST)?",
        answer: "The World Clock utilizes the international IANA Time Zone Database (Intl API) built into modern browsers, which automatically accounts for regional daylight saving time transitions."
      },
      {
        question: "Can I customize the clock between 12-hour and 24-hour display?",
        answer: "Yes. Toggle the 24-Hour button to switch seamlessly between standard 12-hour time (with AM/PM) and 24-hour military time."
      },
      {
        question: "Which global cities can I add to the World Clock panel?",
        answer: "You can add major international financial and business centers including London (GMT/BST), New York (EST/EDT), Tokyo (JST), Paris (CET/CEST), Sydney (AEST/AEDT), Dubai (GST), Mumbai (IST), and Singapore (SGT)."
      },
      {
        question: "Does the World Clock indicate whether it is day or night in other cities?",
        answer: "Yes. Each world clock card features visual day and night indicators so you can quickly see whether business partners or loved ones are in daylight or nighttime."
      },
      {
        question: "Can I remove or reorder world clock cities?",
        answer: "Yes. You can remove any saved city from your world clock panel with a single click."
      },
      {
        question: "Does this clock require an internet connection to keep time?",
        answer: "No. Once loaded in your browser, the clock continues running accurately using your device's internal clock without network access."
      },
      {
        question: "Are my saved world clock preferences sent to any server?",
        answer: "No. Your preferences and saved cities are managed locally in browser state and are never transmitted to external servers."
      },
      {
        question: "Can I use the Online Clock as a full-screen desk clock?",
        answer: "Yes. The large, high-contrast digital typography makes it ideal for keeping open on a secondary monitor or tablet as an aesthetic desk clock."
      },
      {
        question: "What is UTC and how does it relate to local time zones?",
        answer: "Coordinated Universal Time (UTC) is the primary time standard by which the world regulates clocks. Local time zones are expressed as positive or negative offsets from UTC (e.g. New York is UTC-5 or UTC-4, Mumbai is UTC+5:30)."
      }
    ]
  },

  'time-zone-converter': {
    howTo: [
      {
        title: "Select Base Date and Time",
        desc: "Choose the starting date and time you want to convert or schedule a meeting for."
      },
      {
        title: "Select Source Time Zone",
        desc: "Choose your origin time zone (e.g., America/New_York, Europe/London, Asia/Kolkata)."
      },
      {
        title: "Add Destination Time Zones",
        desc: "Add target comparison zones for international team members, clients, or travel destinations."
      },
      {
        title: "Inspect Meeting Overlap & Business Hours",
        desc: "Review synchronized time cards highlighting typical working hours (9 AM - 5 PM) across all cities."
      },
      {
        title: "Copy Formatted Meeting Schedule",
        desc: "Click Copy Times to copy a clear multi-zone meeting invitation summary to your clipboard."
      }
    ],
    faq: [
      {
        question: "How does the Time Zone Converter calculate time across international regions?",
        answer: "The tool uses the browser's native Intl.DateTimeFormat API and the global IANA Time Zone Database to calculate exact local times, UTC offsets, and dates across all global regions."
      },
      {
        question: "Does the converter automatically account for Daylight Saving Time (DST) changes?",
        answer: "Yes. Because calculations are grounded in the IANA time zone database for the exact date entered, seasonal DST transitions (spring forward, fall back) in Europe, North America, and Australasia are automatically factored in."
      },
      {
        question: "How do I identify suitable meeting times across disparate time zones?",
        answer: "The tool visually highlights standard business hours (9:00 AM to 5:00 PM) for each target city, allowing you to quickly spot mutual waking and working hours between international colleagues."
      },
      {
        question: "Does the converter handle half-hour and 45-minute offset time zones?",
        answer: "Yes. Non-integer UTC offset zones such as India Standard Time (UTC+5:30), Iran (UTC+3:30), Nepal (UTC+5:45), and Australian Central Time (UTC+9:30) are calculated with 100% accuracy."
      },
      {
        question: "Can I convert times for past or future calendar dates?",
        answer: "Yes. You can select any date in the calendar picker to test historical times or plan international flights and webinars months in advance."
      },
      {
        question: "What is the difference between Time Zone Abbreviations (EST, EDT) and IANA IDs?",
        answer: "Abbreviations like 'EST' can be ambiguous (e.g. Eastern Standard Time in US vs Australian Eastern Standard Time). IANA identifiers (like 'America/New_York' or 'Australia/Sydney') are globally unique and track historical DST rules."
      },
      {
        question: "Can I copy the converted time schedule for a meeting invitation?",
        answer: "Yes. Click the Copy button to generate a clean, formatted text block listing the meeting time across all selected cities ready to paste into calendar invites or emails."
      },
      {
        question: "Does this tool send schedule information or meeting details to external servers?",
        answer: "No. All time zone conversions and date arithmetic run strictly client-side inside your web browser."
      },
      {
        question: "Can I switch between 12-hour (AM/PM) and 24-hour military time formats?",
        answer: "Yes. The tool features an instant 12h/24h toggle that updates all displayed times simultaneously."
      },
      {
        question: "What happens when a conversion crosses the International Date Line?",
        answer: "The converter displays the exact local calendar date for each city, clearly indicating whether a participant is in 'Today', 'Tomorrow', or 'Yesterday'."
      },
      {
        question: "Can I use the Time Zone Converter on mobile devices?",
        answer: "Yes. The interface is optimized for touchscreen interactions on mobile Safari and Chrome for quick scheduling while traveling."
      }
    ]
  },

  'cement-calculator': {
    howTo: [
      {
        title: "Select Unit System (Metric or Imperial)",
        desc: "Choose Metric (meters, cm, m³) or Imperial (feet, inches, cubic yards) based on your regional construction standards."
      },
      {
        title: "Input Structure Dimensions",
        desc: "Enter Length, Width, and Thickness (Depth) of your planned concrete slab, footing, or driveway."
      },
      {
        title: "Set Wastage Allowance Percentage",
        desc: "Specify recommended contingency wastage (typically 5% to 10%) to account for uneven subgrades and spillage."
      },
      {
        title: "Select Concrete Mix Ratio Grade",
        desc: "Choose standard nominal mix ratios: M15 (1:2:4), M20 (1:1.5:3 general structural), or M25 (1:1:2 high strength)."
      },
      {
        title: "Review Material Quantities & Bag Counts",
        desc: "Inspect total concrete volume, required 50kg cement bags (or 80lb premix bags), sand volume, and coarse gravel aggregate."
      }
    ],
    faq: [
      {
        question: "How do you calculate the volume of concrete needed for a slab?",
        answer: "Concrete Volume = Length * Width * Thickness. In metric, multiplying meters gives cubic meters (m³). In imperial, multiplying dimensions in feet (thickness in feet = inches / 12) gives cubic feet, which is divided by 27 to obtain cubic yards."
      },
      {
        question: "Why does dry concrete material volume need to be 54% greater than wet volume?",
        answer: "When water is added to dry cement, sand, and gravel, the fine particles fill the interstitial voids between coarse aggregates, causing a volumetric shrinkage of roughly 30% to 35%. A dry volume factor of 1.54 is standard in civil engineering calculations."
      },
      {
        question: "What do nominal concrete mix ratios like 1:2:4 and 1:1.5:3 mean?",
        answer: "The ratio represents volumetric proportions of Cement : Sand (Fine Aggregate) : Gravel (Coarse Aggregate). For example, M20 mix (1:1.5:3) uses 1 part cement, 1.5 parts sand, and 3 parts gravel."
      },
      {
        question: "How many 50kg cement bags are in one cubic meter of concrete?",
        answer: "For standard M20 (1:1.5:3) concrete, approximately 8 to 8.4 bags of 50kg cement are required per cubic meter of finished wet concrete, depending on specific gravity and dry volume coefficient."
      },
      {
        question: "How many 80 lb or 60 lb premix bags are needed per cubic yard?",
        answer: "One cubic yard of concrete requires approximately forty-five 60-pound premix bags, or thirty-four 80-pound premix bags of ready-to-use concrete mix."
      },
      {
        question: "Why should I always add 5% to 10% wastage allowance?",
        answer: "Excavations and subgrades are rarely perfectly level, formwork can bow under hydraulic pressure, and spillage occurs during pouring. Ordering without a 10% buffer risks running short mid-pour, creating cold joints."
      },
      {
        question: "Can I calculate concrete for cylindrical columns or round post footings?",
        answer: "For round footings, calculate volume using the cylinder formula: Volume = π * (Radius)² * Depth. For example, a 12-inch diameter sonotube post has a 0.5-foot radius."
      },
      {
        question: "What is the recommended water-to-cement ratio for concrete mixing?",
        answer: "A water-cement ratio of 0.45 to 0.55 by weight is standard. Adding too much water makes concrete easier to pour but drastically reduces final compressive strength and promotes cracking."
      },
      {
        question: "Are calculator outputs guaranteed structural engineering specifications?",
        answer: "No. The calculator provides material estimation guidance. Commercial high-rise structures, bridges, and load-bearing foundations require certified structural engineering mix designs and laboratory slump tests."
      },
      {
        question: "Does this tool send my construction site dimensions to any server?",
        answer: "No. All volumetric and material proportion calculations run 100% locally inside your web browser."
      },
      {
        question: "Can I convert between cubic yards and cubic meters with this tool?",
        answer: "Yes. Toggling the unit system converts all dimensional inputs and outputs between imperial cubic yards and metric cubic meters."
      }
    ]
  },

  'random-letter-generator': {
    howTo: [
      {
        title: "Select Letter Casing",
        desc: "Choose between Uppercase (A-Z), Lowercase (a-z), or Mixed case letters."
      },
      {
        title: "Choose Character Filter",
        desc: "Filter by All 26 alphabet letters, Vowels only (A, E, I, O, U), or Consonants only."
      },
      {
        title: "Set Quantity of Letters",
        desc: "Select how many random letters you wish to generate (from 1 up to 100 letters)."
      },
      {
        title: "Configure Duplicates & Delimiter",
        desc: "Choose whether to allow duplicate letters and pick your separator (Space, Comma, Newline, or None)."
      },
      {
        title: "Generate and Copy Results",
        desc: "Click Generate to pick randomized letters instantly, and click Copy to copy them to your clipboard."
      }
    ],
    faq: [
      {
        question: "How does the Random Letter Generator generate randomized letters?",
        answer: "The tool uses JavaScript's pseudo-random number generator (Math.random()) to select letters with uniform distribution from the specified alphabet subset."
      },
      {
        question: "Is this letter generator cryptographically secure?",
        answer: "This tool is designed for educational exercises, games (such as Scrabble or Boggle), creative writing prompts, and classroom activities. For cryptographic keys or password generation, use our dedicated Password or Passphrase Generator."
      },
      {
        question: "What is the difference between sampling with and without duplicates?",
        answer: "With duplicates allowed (sampling with replacement), the same letter can appear multiple times. Without duplicates (sampling without replacement), each letter is drawn at most once from the 26-letter pool."
      },
      {
        question: "Can I generate only vowels or only consonants?",
        answer: "Yes. You can filter the candidate alphabet to vowels only (A, E, I, O, U) or consonants only (B, C, D, F, G, H, J, K, L, M, N, P, Q, R, S, T, V, W, X, Y, Z)."
      },
      {
        question: "What output delimiters are supported?",
        answer: "You can separate generated letters with spaces, commas, new lines (one per line), or with no delimiter (a continuous string of characters)."
      },
      {
        question: "What is the maximum number of letters I can generate at once?",
        answer: "You can generate up to 100 letters at once when duplicates are allowed, or up to 26 unique letters when duplicates are disallowed."
      },
      {
        question: "Can I use this tool for phonics teaching and word games?",
        answer: "Yes. Teachers and students frequently use it for phonics spelling drills, vocabulary games, Scattergories, anagram solving, and random letter prompts."
      },
      {
        question: "Are generated letters or game prompts sent to any server?",
        answer: "No. All randomization occurs completely client-side in your web browser."
      },
      {
        question: "Can I generate lowercase or mixed case letters?",
        answer: "Yes. You can select Uppercase, Lowercase, or Mixed case (randomly assigning upper or lower case to each letter)."
      },
      {
        question: "Does the generator favor certain letters or have weighted frequencies?",
        answer: "No. The generator uses an unweighted uniform distribution where every available letter has an equal mathematical probability of being selected."
      },
      {
        question: "Can I use the Random Letter Generator on mobile devices?",
        answer: "Yes. The interface is lightweight and responsive for fast random letter drawing on smartphones and tablets."
      }
    ]
  },

  // ==========================================
  // BATCH 6: 6 SECURITY / PRIVACY / PRODUCTIVITY TOOLS
  // ==========================================
  'qr-code-safety-checker': {
    howTo: [
      {
        title: "Upload QR Image, Scan via Camera, or Paste Raw Data",
        desc: "Choose between uploading a saved QR image file, scanning live with your device camera, or pasting decoded text."
      },
      {
        title: "Inspect Decoded Content Safely",
        desc: "View the exact decoded URL or payload in an isolated preview sandbox without auto-executing or opening it."
      },
      {
        title: "Analyze Risk Score & Threat Indicators",
        desc: "Review the heuristic security assessment evaluating protocol safety, domain reputation, and URL shorteners."
      },
      {
        title: "Examine Protocol & Obfuscation Flags",
        desc: "Inspect granular checks for non-standard schemes (javascript:, data:), suspicious TLDs, and IP-address hostnames."
      },
      {
        title: "Copy Decoded URL or Reset Scanner",
        desc: "Safely copy verified destination text or clear the sandbox to scan another QR code."
      }
    ],
    faq: [
      {
        question: "What does the QR Code Safety Checker detect?",
        answer: "The tool performs client-side heuristic inspection of decoded QR payloads, checking for insecure HTTP, malicious URI schemes (javascript:, data:, tel:, sms:), IP-address hostnames, excessive subdomains, known URL shorteners, and credential phishing patterns."
      },
      {
        question: "Can this tool guarantee that a QR code destination is 100% safe?",
        answer: "No automated tool can provide an absolute guarantee of safety. While our scanner identifies structural red flags and phishing patterns, zero-day malware or newly registered phishing domains require ongoing vigilance."
      },
      {
        question: "Why are URL shorteners (like bit.ly or tinyurl) flagged as caution items in QR codes?",
        answer: "URL shorteners conceal the true destination domain until followed. Attackers frequently use shorteners to mask phishing websites or malicious redirect chains."
      },
      {
        question: "Does the safety checker check links against live cloud malware databases?",
        answer: "The checker performs comprehensive local structural and pattern heuristics in your browser to maintain privacy. It does not transmit scanned URLs to third-party reputation databases."
      },
      {
        question: "What is 'Quishing' (QR code phishing)?",
        answer: "Quishing is a social engineering attack where malicious actors replace legitimate QR codes (such as parking meters, restaurant menus, or email login prompts) with rogue QR codes directing victims to credential-harvesting phishing sites."
      },
      {
        question: "Does the scanner automatically open or navigate to the scanned link?",
        answer: "No. The safety scanner deliberately sandboxes the decoded payload, displaying the raw text and destination domain without executing scripts or triggering browser navigation."
      },
      {
        question: "Can I scan physical QR codes using my phone or laptop camera?",
        answer: "Yes. Toggle the Camera tab to activate client-side camera scanning using HTML5 video streams with privacy-preserving local decoding."
      },
      {
        question: "Are scanned QR images or personal links uploaded to any server?",
        answer: "No. All QR image decoding (via jsQR) and URL analysis run 100% locally in your browser memory. No camera feeds, photos, or URLs are ever transmitted."
      },
      {
        question: "What should I do if a QR code is flagged as High Risk or Dangerous?",
        answer: "Do not navigate to the URL. If the QR code was physically placed over a legitimate sticker (such as at a parking kiosk or storefront), notify facility staff of potential tampering."
      },
      {
        question: "Can this tool inspect non-URL QR codes like Wi-Fi credentials or vCards?",
        answer: "Yes. The scanner decodes Wi-Fi configuration strings, vCard contact cards, plain text, and cryptocurrency addresses, displaying their raw parameters safely."
      },
      {
        question: "Why are raw IP addresses (e.g. http://192.168.1.1 or http://45.33.32.156) flagged as dangerous?",
        answer: "Legitimate businesses rarely direct customers to raw IP addresses instead of registered domain names. Attackers use raw IP addresses to bypass standard DNS-based security filters."
      }
    ]
  },

  'typing-speed-test': {
    howTo: [
      {
        title: "Select Test Duration",
        desc: "Choose between 15 seconds (quick sprint), 30 seconds (standard drill), or 60 seconds (formal assessment)."
      },
      {
        title: "Click the Input Area to Begin",
        desc: "Focus the typing input box to initiate the countdown timer automatically on your first keystroke."
      },
      {
        title: "Type the Displayed Passage Accurately",
        desc: "Type words matching the prompt; correct letters turn green while errors are highlighted in red."
      },
      {
        title: "Inspect Net WPM, Gross WPM & Accuracy",
        desc: "Review your calculated Net Words Per Minute, Gross WPM, percentage accuracy, and raw error count."
      },
      {
        title: "Retest or Change Text Passage",
        desc: "Click Restart to beat your previous score or cycle to a new practice paragraph."
      }
    ],
    faq: [
      {
        question: "How is Net WPM (Words Per Minute) calculated?",
        answer: "In standardized typing tests, one 'word' is defined as exactly 5 keystrokes (including letters, punctuation, and spaces). Net WPM = (Total Characters Typed / 5 - Uncorrected Errors) / Time in Minutes."
      },
      {
        question: "What is the difference between Gross WPM and Net WPM?",
        answer: "Gross WPM measures raw typing speed regardless of mistakes: (Total Characters / 5) / Minutes. Net WPM penalizes uncorrected errors, providing the true measure of usable productive typing speed."
      },
      {
        question: "How is typing Accuracy percentage calculated?",
        answer: "Accuracy = (Correct Characters Typed / Total Characters Typed) * 100. Professional typists target an accuracy score of 95% to 98% or higher."
      },
      {
        question: "What is considered an average and a good typing speed?",
        answer: "The average global typing speed is approximately 40 WPM. Speeds between 50 and 65 WPM are considered proficient, 70 to 85 WPM is considered fast, and speeds above 90 WPM place typists in the top tier."
      },
      {
        question: "Does the typing test count spaces and punctuation marks?",
        answer: "Yes. Spaces and punctuation marks count toward the standard 5-character word calculation and must be typed accurately to advance through the passage."
      },
      {
        question: "Can I use backspace to correct typing errors during the test?",
        answer: "Yes. You can use backspace to fix mistakes within the active word before moving on, helping preserve your Net WPM and accuracy."
      },
      {
        question: "Does the timer begin immediately when the page loads?",
        answer: "No. The timer remains paused until you press your first keystroke inside the input field, allowing you to read the passage first."
      },
      {
        question: "Are typing scores or keystrokes transmitted or stored on any server?",
        answer: "No. All keystroke timing, error calculations, and score summaries run 100% locally in your browser memory."
      },
      {
        question: "How can I improve my typing speed and accuracy effectively?",
        answer: "Practice touch typing with proper home-row finger placement (ASDF JKL;), focus on accuracy before speed, avoid looking at the keyboard, and practice daily in short 5-minute sessions."
      },
      {
        question: "Can I take the typing speed test on mobile devices or tablets?",
        answer: "While the test runs on mobile browsers, touchscreen virtual keyboards yield substantially lower WPM than physical tactile desktop keyboards."
      },
      {
        question: "Can I copy my typing score card to share with employers or friends?",
        answer: "Yes. Click the Copy Score button upon completing the test to copy a formatted summary of your WPM, accuracy, and test duration."
      }
    ]
  },

  'file-checksum-verifier': {
    howTo: [
      {
        title: "Select Hash Algorithm",
        desc: "Choose the target cryptographic algorithm: SHA-256 (standard), SHA-1, SHA-512, or MD5."
      },
      {
        title: "Upload or Drop Your File",
        desc: "Select or drag and drop any file from your computer to calculate its cryptographic hash in browser memory."
      },
      {
        title: "Inspect Calculated Checksum",
        desc: "Review the calculated hexadecimal digest generated via the browser's native Web Crypto API."
      },
      {
        title: "Paste Expected Checksum to Compare",
        desc: "Paste the official hash published by the software developer or download provider into the comparison box."
      },
      {
        title: "Verify File Integrity Status",
        desc: "Inspect the instant verification badge: green for an exact match (file intact) or red for a mismatch (file altered)."
      }
    ],
    faq: [
      {
        question: "What is a file checksum and why is it used?",
        answer: "A checksum is a unique fixed-length cryptographic string (hash) generated by running a mathematical algorithm over a file's byte contents. If even a single bit of the file is changed or corrupted during download, the checksum changes completely (the avalanche effect)."
      },
      {
        question: "Does verifying a checksum prove that a file is free of malware?",
        answer: "No. A checksum verifies file integrity (that the downloaded file matches the exact bytes published by the author). If an attacker compromises the author's server and uploads a malicious file alongside its new checksum, the hashes will match. Checksums verify integrity, not inherent safety."
      },
      {
        question: "Which cryptographic hash algorithms are supported by this tool?",
        answer: "The tool supports SHA-256 (industry standard), SHA-512 (high security), SHA-1 (legacy), and MD5 (legacy verification)."
      },
      {
        question: "Why are MD5 and SHA-1 considered cryptographically deprecated?",
        answer: "Researchers have demonstrated practical collision attacks against MD5 and SHA-1 where two different files can produce identical hash values. For security-critical integrity and signatures, modern software relies on SHA-256 or SHA-512."
      },
      {
        question: "Are files uploaded to an external server during hashing?",
        answer: "No. The tool reads files using the browser's FileReader API and computes hashes using client-side WebAssembly and the native Web Crypto API (crypto.subtle.digest). Large ISO files, installers, and documents never leave your computer."
      },
      {
        question: "Is there a file size limit for checking checksums in the browser?",
        answer: "Because hashing occurs in browser memory, files up to several gigabytes can be hashed smoothly on modern computers without uploading."
      },
      {
        question: "Does the hash comparison check case-sensitivity (uppercase vs lowercase)?",
        answer: "The verification comparison is case-insensitive, meaning lowercase and uppercase hexadecimal characters are evaluated identically."
      },
      {
        question: "What should I do if the calculated hash does not match the expected hash?",
        answer: "A mismatch indicates the download is corrupted, incomplete, or was tampered with in transit. Delete the file and re-download from an authentic official mirror."
      },
      {
        question: "Can I copy the calculated hash to my clipboard?",
        answer: "Yes. Click the Copy button next to the calculated hash to copy the hexadecimal digest with one click."
      },
      {
        question: "Does renaming a file change its checksum?",
        answer: "No. Cryptographic hash algorithms evaluate only the file's raw binary data contents, not external filesystem metadata such as the filename or creation timestamp."
      },
      {
        question: "Can I use the Checksum Verifier offline?",
        answer: "Yes. Once the web application is loaded in your browser, the Web Crypto API operates completely offline without internet connectivity."
      }
    ]
  },

  'passphrase-generator': {
    howTo: [
      {
        title: "Select Word Count (Passphrase Length)",
        desc: "Adjust the slider from 3 to 8 words (4 to 5 words recommended for standard balance of memory and entropy)."
      },
      {
        title: "Choose Word Separator",
        desc: "Select your preferred delimiter: Hyphen (-), Underscore (_), Space ( ), Period (.), or None."
      },
      {
        title: "Configure Capitalization & Characters",
        desc: "Toggle word capitalization (TitleCase) and optionally append random numbers or special symbols."
      },
      {
        title: "Generate Diceware Passphrase",
        desc: "Click Generate to draw random words using cryptographically secure browser entropy."
      },
      {
        title: "Inspect Entropy & Copy Passphrase",
        desc: "Review the calculated entropy bits and estimated crack-time resistance, then click Copy."
      }
    ],
    faq: [
      {
        question: "Why are Diceware-style passphrases more secure and memorable than random character passwords?",
        answer: "Random character passwords (like 'k#9X!mP$') are difficult to remember and frequently written down. Passphrases combine several random dictionary words (like 'correct-horse-battery-staple'), creating vast mathematical search spaces that are effortless for humans to type and remember."
      },
      {
        question: "What is Password Entropy and how is it calculated for passphrases?",
        answer: "Entropy measures unpredictable randomness in bits. For a wordlist of size N and a passphrase of W words, entropy is calculated as: Bits = W * log2(N). A 5-word passphrase from a 7,776-word Diceware list provides approximately 65 bits of pure entropy."
      },
      {
        question: "Is this passphrase generator cryptographically secure?",
        answer: "Yes. The generator draws random words using window.crypto.getRandomValues(), the browser's cryptographically secure pseudorandom number generator (CSPRNG), rather than insecure Math.random()."
      },
      {
        question: "How many words should a secure passphrase contain?",
        answer: "According to cybersecurity standards, 4 words (approx. 52 bits of entropy) are suitable for general accounts, 5 to 6 words (65-78 bits) are ideal for password managers and email accounts, and 7+ words are recommended for disk encryption."
      },
      {
        question: "Does adding a number or symbol increase passphrase security?",
        answer: "Yes. Adding numbers and symbols satisfies legacy website password complexity rules and adds additional entropy bits to protect against specialized dictionary attacks."
      },
      {
        question: "Are generated passphrases logged or transmitted to any server?",
        answer: "No. The wordlist and CSPRNG generation execute 100% locally in your web browser. No generated passphrases, keys, or metadata are ever transmitted or saved."
      },
      {
        question: "What wordlist is used to generate the passphrases?",
        answer: "The generator uses a curated EFF-inspired wordlist of familiar, clean English words selected for clarity, easy spelling, and phonetic distinctiveness."
      },
      {
        question: "Can brute-force GPU cracking clusters easily guess a 5-word passphrase?",
        answer: "A 5-word passphrase with 65+ bits of entropy represents over 36 quintillion combinations. Even a supercomputer cluster guessing 100 billion passwords per second would require centuries to exhaust the search space."
      },
      {
        question: "Can I use the Passphrase Generator on mobile devices?",
        answer: "Yes. The tool operates smoothly on mobile Safari and Chrome, allowing you to generate secure master passwords on smartphones and tablets."
      },
      {
        question: "Why is separator choice important in a passphrase?",
        answer: "Separators (like hyphens or periods) break words apart clearly for human reading and prevent dictionary parsers from interpreting adjacent words as a single compound word."
      },
      {
        question: "Can I generate multiple passphrases in a row?",
        answer: "Yes. Click the Generate button repeatedly to roll fresh, cryptographically independent passphrases instantly."
      }
    ]
  },

  'password-strength-checker': {
    howTo: [
      {
        title: "Enter Password in the Input Field",
        desc: "Type or paste the password you wish to evaluate (toggle the eye icon to view or hide characters)."
      },
      {
        title: "Review Instant Strength Score & Level",
        desc: "Inspect the dynamic strength meter categorized as Very Weak, Weak, Fair, Good, or Strong."
      },
      {
        title: "Examine Character Diversity Checks",
        desc: "Verify requirements across length (12+ characters), lowercase, uppercase, numbers, and symbols."
      },
      {
        title: "Inspect Entropy & Estimated Crack Time",
        desc: "Review calculated Shannon entropy bits and estimated offline GPU brute-force crack time."
      },
      {
        title: "Apply Actionable Security Recommendations",
        desc: "Review feedback warnings regarding common patterns, sequential numbers, or repetitive characters."
      }
    ],
    faq: [
      {
        question: "How does the Password Strength Checker evaluate passwords?",
        answer: "The tool evaluates character length, character pool diversity (lowercase, uppercase, numbers, symbols), pattern repetition, sequential characters, and Shannon entropy to estimate resistance against brute-force attacks."
      },
      {
        question: "Is it safe to type my real password into this online tool?",
        answer: "Yes. The strength evaluation runs 100% locally in your web browser using client-side JavaScript. The password is never transmitted over the internet, logged, or saved to any server."
      },
      {
        question: "What is an estimated 'Crack Time' and how is it determined?",
        answer: "Crack time estimates how long a high-performance offline password-cracking rig (testing billions of hashes per second) would take to exhaust the password's search space. It provides a relative benchmark rather than a guarantee."
      },
      {
        question: "Does this tool check passwords against breached database lists?",
        answer: "To ensure absolute privacy and prevent sending your password across the network, this tool performs pure local heuristic analysis and does not query external breach APIs."
      },
      {
        question: "What are common password vulnerabilities flagged by the checker?",
        answer: "Common weaknesses include lengths under 12 characters, predictable keyboard sequences (e.g. 'qwerty', '123456'), repetitive characters (e.g. 'aaa'), and dictionary words."
      },
      {
        question: "Why is password length more important than character complexity?",
        answer: "Length increases entropy exponentially. A 16-character passphrase composed of simple lowercase words is mathematically far harder to crack than an 8-character complex password containing symbols."
      },
      {
        question: "What is a recommended password length for critical accounts?",
        answer: "Cybersecurity authorities (such as NIST) recommend using unique passwords or passphrases of at least 15 to 20 characters for primary email, financial banking, and master password manager accounts."
      },
      {
        question: "What is Shannon Entropy in password security?",
        answer: "Shannon entropy measures the information density and unpredictability of the character sequence in bits. Passwords with higher entropy require larger search spaces to crack."
      },
      {
        question: "Can I use the checker on mobile phones and tablets?",
        answer: "Yes. The interface is responsive and includes a password visibility toggle for easy mobile typing."
      },
      {
        question: "What should I do if my existing password scores as 'Weak'?",
        answer: "Upgrade the password immediately by increasing its length to 16+ characters, turning it into a memorable 4-to-5 word passphrase, or using our Passphrase Generator."
      },
      {
        question: "Why should I avoid reusing passwords across multiple websites?",
        answer: "If one website suffers a data breach, attackers use automated credential-stuffing tools to test leaked passwords across hundreds of other services (email, banking, social media)."
      }
    ]
  },

  'text-encrypt-decrypt': {
    howTo: [
      {
        title: "Select Encrypt or Decrypt Mode",
        desc: "Choose Encrypt to convert plaintext into ciphertext, or Decrypt to restore ciphertext back to plaintext."
      },
      {
        title: "Input Text Content",
        desc: "Paste or type the text you want to secure or the Base64 ciphertext you need to decode."
      },
      {
        title: "Enter Secret Passphrase / Key",
        desc: "Enter a strong secret key known only to you and your authorized recipient."
      },
      {
        title: "Execute Client-Side Cryptographic Operation",
        desc: "Click Encrypt Text or Decrypt Text to process the payload locally in browser memory."
      },
      {
        title: "Copy Output or Clear Sensitive Data",
        desc: "Copy the resulting ciphertext or decrypted plaintext, and click Clear to remove sensitive inputs."
      }
    ],
    faq: [
      {
        question: "How does the Text Encrypt & Decrypt tool protect data?",
        answer: "The tool uses Advanced Encryption Standard (AES) symmetric key cryptography. In Encrypt mode, plaintext is encrypted with your secret key into a Base64-encoded ciphertext. In Decrypt mode, the original plaintext is recovered using the matching secret key."
      },
      {
        question: "What is AES (Advanced Encryption Standard)?",
        answer: "AES is the worldwide standard for symmetric-key block cipher encryption established by the US National Institute of Standards and Technology (NIST) in 2001 and adopted globally for government, banking, and military data security."
      },
      {
        question: "What happens if I lose or forget the secret key?",
        answer: "Because AES is mathematically secure with no administrative backdoors, lost secret keys cannot be recovered. Without the exact matching key, the encrypted ciphertext cannot be decrypted."
      },
      {
        question: "Are my secret keys, passwords, or decrypted text sent to any server?",
        answer: "No. All encryption and decryption operations execute strictly client-side in your web browser. Neither your plaintext, ciphertext, nor secret keys are ever logged or transmitted over the internet."
      },
      {
        question: "What happens if someone enters the wrong secret key during decryption?",
        answer: "If an incorrect key is provided or the ciphertext has been modified or corrupted, the decryption algorithm fails and displays an error without outputting corrupted data."
      },
      {
        question: "Can I safely share the encrypted ciphertext over email or chat?",
        answer: "Yes. The encrypted output is formatted as clean Base64 text that can be safely copied and sent through email, SMS, messaging apps, or stored in public documents."
      },
      {
        question: "How should I share the secret key with my intended recipient?",
        answer: "Always share the secret key through a separate, secure communication channel (out-of-band), such as an encrypted voice call, in-person conversation, or secure messaging app, rather than the same channel used to send the ciphertext."
      },
      {
        question: "Can this tool encrypt files or images?",
        answer: "This tool is optimized for confidential text, notes, passwords, recovery codes, and messages. For file hashing and integrity verification, use our File Checksum Verifier."
      },
      {
        question: "Is there a limit on the length of text I can encrypt?",
        answer: "Because encryption executes locally in browser memory, you can encrypt paragraphs, long letters, and sensitive code snippets spanning thousands of words without limitation."
      },
      {
        question: "Does this tool work completely offline?",
        answer: "Yes. Once the page is loaded, encryption and decryption functions operate fully without an active internet connection."
      },
      {
        question: "Can I use the Text Encrypt & Decrypt tool on mobile devices?",
        answer: "Yes. The interface is fully responsive, featuring a key visibility toggle and quick-copy buttons for easy mobile use."
      }
    ]
  }
};

async function main() {
  const filePath = path.resolve('src/data/toolSeoData.ts');
  let content = fs.readFileSync(filePath, 'utf8');

  for (const [toolId, update] of Object.entries(BATCH_5_6_UPGRADES)) {
    const pattern = `"${toolId}": {`;
    const start = content.indexOf(pattern);
    if (start === -1) {
      console.error(`Key ${toolId} not found in toolSeoData.ts!`);
      continue;
    }

    let depth = 0;
    let end = -1;
    for (let i = start + pattern.length - 1; i < content.length; i++) {
      if (content[i] === '{') depth++;
      else if (content[i] === '}') {
        depth--;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }

    if (end === -1) {
      console.error(`Could not find closing brace for ${toolId}`);
      continue;
    }

    const replacement = `"${toolId}": ${JSON.stringify(update, null, 2)}`;
    content = content.slice(0, start) + replacement + content.slice(end + 1);
    console.log(`Successfully updated ${toolId}!`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Finished updating toolSeoData.ts for Batch 5 and Batch 6!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
