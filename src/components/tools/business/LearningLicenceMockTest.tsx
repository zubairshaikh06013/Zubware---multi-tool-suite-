import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  Award,
  BookOpen,
  Volume2,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

interface Question {
  id: number;
  en: string;
  hi: string;
  options_en: [string, string, string, string];
  options_hi: [string, string, string, string];
  correctIndex: number;
}

interface SignQuestion {
  id: number;
  signType: string;
  en: string;
  hi: string;
  options_en: [string, string, string, string];
  options_hi: [string, string, string, string];
  correctIndex: number;
}

// Add more questions here later.
const QUESTION_BANK: Question[] = [
  {
    id: 1,
    en: "What does a flashing red traffic light at an intersection mean?",
    hi: "चौराहे पर टिमटिमाती (लाल) ट्रैफिक लाइट का क्या अर्थ है?",
    options_en: ["Stop completely and proceed when safe", "Drive through without stopping", "Slow down and turn left only", "Wait for green light unconditionally"],
    options_hi: ["पूरी तरह रुकें और सुरक्षित होने पर आगे बढ़ें", "बिना रुके गाड़ी चलाएं", "धीमे हों और केवल बाएं मुड़ें", "सख्त रूप से हरी लाइट का इंतजार करें"],
    correctIndex: 0
  },
  {
    id: 2,
    en: "When driving near a school zone, what is the driver's primary responsibility?",
    hi: "स्कूल क्षेत्र के पास गाड़ी चलाते समय ड्राइवर की मुख्य जिम्मेदारी क्या है?",
    options_en: ["Reduce speed and watch out for children", "Honk continuously to alert students", "Overtake other slow vehicles quickly", "Maintain standard city speed limit"],
    options_hi: ["गति धीमी करें और बच्चों पर ध्यान दें", "छात्रों को सतर्क करने के लिए लगातार हॉर्न बजाएं", "अन्य धीमी गाड़ियों को तेजी से ओवरटेक करें", "सामान्य शहर की गति सीमा बनाए रखें"],
    correctIndex: 0
  },
  {
    id: 3,
    en: "What is the legal minimum age to apply for a Learner's Licence for a motor cycle without gear (up to 50cc)?",
    hi: "बिना गियर वाले मोटर साइकिल (50cc तक) के लिए लर्निंग लाइसेंस आवेदन की न्यूनतम आयु क्या है?",
    options_en: ["16 years", "18 years", "20 years", "15 years"],
    options_hi: ["16 वर्ष", "18 वर्ष", "20 वर्ष", "15 वर्ष"],
    correctIndex: 0
  },
  {
    id: 4,
    en: "What is the validity period of an Indian Learner's Licence?",
    hi: "भारतीय लर्निंग लाइसेंस की वैधता अवधि कितनी होती है?",
    options_en: ["6 months", "1 year", "3 months", "30 days"],
    options_hi: ["6 महीने", "1 साल", "3 महीने", "30 दिन"],
    correctIndex: 0
  },
  {
    id: 5,
    en: "What distance must be maintained as a safe following distance behind another vehicle in good weather?",
    hi: "अच्छे मौसम में किसी अन्य वाहन के पीछे कितनी सुरक्षित दूरी बनाए रखनी चाहिए?",
    options_en: ["2-second rule distance", "1 meter distance", "10 meters regardless of speed", "Car length distance only"],
    options_hi: ["2-सेकंड नियम की दूरी", "1 मीटर की दूरी", "गति की परवाह किए बिना 10 मीटर", "केवल कार की लंबाई के बराबर"],
    correctIndex: 0
  },
  {
    id: 6,
    en: "When are you allowed to overtake a vehicle from its left side?",
    hi: "आपको किसी वाहन को उसकी बाईं ओर से ओवरटेक करने की अनुमति कब होती है?",
    options_en: ["When the front vehicle signals & turns right", "When the road is wide enough anytime", "During heavy traffic jams", "Never under any circumstances"],
    options_hi: ["जब आगे का वाहन सिग्नल देकर दायां मोड़ ले रहा हो", "जब सड़क चौड़ी हो", "भारी ट्रैफिक जाम के दौरान", "किसी भी परिस्थिति में कभी नहीं"],
    correctIndex: 0
  },
  {
    id: 7,
    en: "What should you do when an ambulance or fire service vehicle approaches with siren on?",
    hi: "जब कोई एम्बुलेंस या फायर ब्रिगेड का वाहन सायरन बजाते हुए आए तो आपको क्या करना चाहिए?",
    options_en: ["Allow free passage by drawing to the side", "Speed up to stay ahead of it", "Honk to warn vehicles in front", "Stop immediately in the middle lane"],
    options_hi: ["साइड में होकर उन्हें रास्ता दें", "उनके आगे रहने के लिए गति बढ़ाएं", "आगे के वाहनों को चेतावनी देने के लिए हॉर्न बजाएं", "बीच वाली लेन में तुरंत रुक जाएं"],
    correctIndex: 0
  },
  {
    id: 8,
    en: "What is the punishment for driving under the influence of alcohol for a first offence?",
    hi: "शराब पीकर गाड़ी चलाने पर पहली बार पकड़े जाने पर क्या सजा है?",
    options_en: ["Fine up to ₹10,000 and/or imprisonment up to 6 months", "Simple warning from police", "₹500 fine only", "Suspension of vehicle RC for 5 years"],
    options_hi: ["₹10,000 तक जुर्माना और/या 6 महीने तक की जेल", "पुलिस द्वारा केवल चेतावनी", "केवल ₹500 का जुर्माना", "5 साल के लिए RC का निलंबन"],
    correctIndex: 0
  },
  {
    id: 9,
    en: "What does a continuous solid yellow or white line on the road center mean?",
    hi: "सड़क के बीच में एक लगातार ठोस पीली या सफेद रेखा का क्या अर्थ है?",
    options_en: ["Overtaking & lane changing is strictly prohibited", "You can cross line anytime", "Reserved for two-wheelers only", "Speed limit is 40 km/h"],
    options_hi: ["ओवरटेक करना और लेन बदलना सख्त मना है", "आप कभी भी लाइन पार कर सकते हैं", "केवल दोपहिया वाहनों के लिए आरक्षित", "गति सीमा 40 किमी/घंटा है"],
    correctIndex: 0
  },
  {
    id: 10,
    en: "What requirement must a learner licence holder satisfy while driving a motor vehicle?",
    hi: "लर्निंग लाइसेंस धारक को वाहन चलाते समय किस शर्त का पालन करना अनिवार्य है?",
    options_en: ["Must display red 'L' plates & be accompanied by a valid DL holder", "Can drive completely alone anywhere", "Must carry 2 extra spare tires", "Cannot drive after 6 PM"],
    options_hi: ["लाल 'L' बोर्ड लगाना होगा और वैध DL धारक साथ होना चाहिए", "कहीं भी अकेले गाड़ी चला सकते हैं", "2 अतिरिक्त स्पेयर टायर ले जाने होंगे", "शाम 6 बजे के बाद गाड़ी नहीं चला सकते"],
    correctIndex: 0
  },
  {
    id: 11,
    en: "What is the mandatory position of 'L' plates on a vehicle driven by a learner driver?",
    hi: "लर्नर ड्राइवर द्वारा चलाए जा रहे वाहन पर 'L' प्लेट लगाने की अनिवार्य जगह क्या है?",
    options_en: ["Both front and rear of the vehicle", "Front windshield only", "Rear window only", "On the driver side door"],
    options_hi: ["वाहन के आगे और पीछे दोनों तरफ", "केवल सामने की विंडशील्ड पर", "केवल पीछे की खिड़की पर", "ड्राइवर की तरफ वाले दरवाजे पर"],
    correctIndex: 0
  },
  {
    id: 12,
    en: "Using high beam headlights in heavy fog conditions will:",
    hi: "घने कोहरे में हाई बीम हेडलाइट का उपयोग करने से क्या होगा?",
    options_en: ["Reduce visibility due to light reflection off fog", "Improve visibility significantly", "Alert pedestrians better", "Save vehicle battery power"],
    options_hi: ["कोहरे से रोशनी परावर्तित होकर दृश्यता कम कर देगी", "दृश्यता में काफी सुधार होगा", "पैदल चलने वालों को बेहतर सतर्क करेगा", "वाहन की बैटरी की बचत होगी"],
    correctIndex: 0
  },
  {
    id: 13,
    en: "What should you do if your vehicle breaks down on a highway at night?",
    hi: "यदि आपकी गाड़ी रात में हाईवे पर खराब हो जाए तो क्या करना चाहिए?",
    options_en: ["Turn on hazard lights & place reflective warning triangle", "Turn off all lights to save battery", "Leave vehicle in middle lane and walk away", "Honk continuously until help arrives"],
    options_hi: ["हार्ड वार्निंग लाइटें जलाएं और रिफ्लेक्टिव ट्राएंगल रखें", "बैटरी बचाने के लिए सभी लाइटें बंद कर दें", "गाड़ी को बीच वाली लेन में छोड़कर चले जाएं", "मदद आने तक लगातार हॉर्न बजाएं"],
    correctIndex: 0
  },
  {
    id: 14,
    en: "At an uncontrolled intersection with equal roads, who has the right of way?",
    hi: "समान सड़कों वाले बिना सिग्नल वाले चौराहे पर किसे प्राथमिकता का अधिकार प्राप्त है?",
    options_en: ["Vehicles coming from your right side", "The largest vehicle", "Vehicles coming from your left side", "Whoever honks first"],
    options_hi: ["आपकी दाईं ओर से आने वाले वाहन", "सबसे बड़ा वाहन", "आपकी बाईं ओर से आने वाले वाहन", "जो पहले हॉर्न बजाए"],
    correctIndex: 0
  },
  {
    id: 15,
    en: "What is the maximum number of pillion riders permitted on a two-wheeler in India?",
    hi: "भारत में दोपहिया वाहन पर अधिकतम कितने पीछे बैठने वाले (पिलियन) यात्रियों की अनुमति है?",
    options_en: ["One pillion rider only", "Two pillion riders", "Three pillion riders", "No pillion riders allowed"],
    options_hi: ["केवल एक यात्री", "दो यात्री", "तीन यात्री", "कोई यात्री अनुमत नहीं"],
    correctIndex: 0
  },
  {
    id: 16,
    en: "Wearing a helmet is mandatory for which occupants of a two-wheeler?",
    hi: "दोपहिया वाहन पर हेलमेट पहनना किनके लिए अनिवार्य है?",
    options_en: ["Both rider and pillion passenger", "Rider only", "Pillion passenger only", "Only when driving on highways"],
    options_hi: ["चालक और पीछे बैठने वाले यात्री दोनों के लिए", "केवल चालक के लिए", "केवल पीछे वाले यात्री के लिए", "केवल हाईवे पर गाड़ी चलाते समय"],
    correctIndex: 0
  },
  {
    id: 17,
    en: "When entering a roundabout, who has the right of way?",
    hi: "गोलचक्कर (राउंडअबाउट) में प्रवेश करते समय किसे प्राथमिकता का अधिकार है?",
    options_en: ["Traffic already circulating inside the roundabout", "Traffic entering the roundabout", "Heavy commercial vehicles only", "Fastest moving vehicles"],
    options_hi: ["गोलचक्कर के अंदर पहले से चल रहा ट्रैफिक", "गोलचक्कर में प्रवेश करने वाला ट्रैफिक", "केवल भारी वाणिज्यिक वाहन", "सबसे तेज चलने वाले वाहन"],
    correctIndex: 0
  },
  {
    id: 18,
    en: "What does a blinking yellow signal light indicate?",
    hi: "टिमटिमाती (पीली) सिग्नल लाइट क्या दर्शाती है?",
    options_en: ["Slow down and proceed with caution", "Stop completely until green", "Speed up to clear intersection", "Road is closed ahead"],
    options_hi: ["गति धीमी करें और सावधानी से आगे बढ़ें", "हरा होने तक पूरी तरह रुकें", "चौराहा पार करने के लिए गति बढ़ाएं", "आगे सड़क बंद है"],
    correctIndex: 0
  },
  {
    id: 19,
    en: "What should you do before changing lanes on a multi-lane road?",
    hi: "मल्टी-लेन सड़क पर लेन बदलने से पहले आपको क्या करना चाहिए?",
    options_en: ["Check mirrors, blind spots & give turn indicator signal", "Honk loudly and change immediately", "Flash headlights continuously", "Slow down to a complete stop"],
    options_hi: ["शीशे, ब्लाइंड स्पॉट जांचें और टर्न इंडिकेटर सिग्नल दें", "ज़ोर से हॉर्न बजाएं और तुरंत लेन बदलें", "लगातार हेडलाइट फ्लैश करें", "पूरी तरह रुक जाएं"],
    correctIndex: 0
  },
  {
    id: 20,
    en: "What is the penalty for using a mobile phone while driving a vehicle?",
    hi: "गाड़ी चलाते समय मोबाइल फोन का इस्तेमाल करने पर क्या जुर्माना है?",
    options_en: ["Fine up to ₹5,000 for first offence", "No fine if using speakerphone", "₹100 fine only", "Only warning"],
    options_hi: ["प्रथम अपराध के लिए ₹5,000 तक जुर्माना", "स्पीकरफोन का उपयोग करने पर कोई जुर्माना नहीं", "केवल ₹100 का जुर्माना", "केवल चेतावनी"],
    correctIndex: 0
  },
  {
    id: 21,
    en: "Where is honking or sounding the horn strictly prohibited?",
    hi: "हॉर्न बजाना कहां सख्त वर्जित है?",
    options_en: ["Near hospitals, courts and silent zones", "On national highways", "In residential areas during daytime", "At mountain passes"],
    options_hi: ["अस्पतालों, अदालतों और शांत क्षेत्रों के पास", "राष्ट्रीय राजमार्गों पर", "दिन के समय आवासीय क्षेत्रों में", "पहाड़ी रास्तों पर"],
    correctIndex: 0
  },
  {
    id: 22,
    en: "What is the minimum gap required between obtaining a Learner Licence and appearing for a Permanent DL test?",
    hi: "लर्निंग लाइसेंस प्राप्त करने और स्थायी DL टेस्ट में शामिल होने के बीच न्यूनतम कितना समय अनिवार्य है?",
    options_en: ["30 days", "15 days", "60 days", "6 months"],
    options_hi: ["30 दिन", "15 दिन", "60 दिन", "6 महीने"],
    correctIndex: 0
  },
  {
    id: 23,
    en: "How far away from a fire hydrant should you park your vehicle?",
    hi: "फायर हाइड्रेंट (अग्निशामक नल) से कितनी दूरी पर वाहन पार्क करना चाहिए?",
    options_en: ["At least 3 meters away", "Right in front", "1 meter away", "Distance does not matter"],
    options_hi: ["कम से कम 3 मीटर दूर", "ठीक सामने", "1 मीटर दूर", "दूरी से कोई फर्क नहीं पड़ता"],
    correctIndex: 0
  },
  {
    id: 24,
    en: "When driving downhill on a steep slope, what gear selection is recommended?",
    hi: "खड़ी ढलान पर नीचे की ओर गाड़ी चलाते समय कौन सा गियर उपयुक्त है?",
    options_en: ["Same low gear as driving uphill", "Neutral gear to save fuel", "High gear with clutch pressed", "Top gear with engine off"],
    options_hi: ["वही निचला गियर जो चढ़ाई चढ़ते समय उपयोग होता है", "ईंधन बचाने के लिए न्यूट्रल गियर", "क्लच दबाकर उच्च गियर", "इंजन बंद करके टॉप गियर"],
    correctIndex: 0
  },
  {
    id: 25,
    en: "What document is NOT mandatorily required to be carried while driving in India?",
    hi: "भारत में गाड़ी चलाते समय इनमें से कौन सा दस्तावेज़ ले जाना अनिवार्य नहीं है?",
    options_en: ["Vehicle Purchase Invoice", "Driving Licence / Learner Licence", "Registration Certificate (RC)", "Pollution Under Control (PUC) & Insurance"],
    options_hi: ["वाहन खरीद बिल (इन्वॉयस)", "ड्राइविंग लाइसेंस / लर्निंग लाइसेंस", "पंजीकरण प्रमाण पत्र (RC)", "प्रदूषण नियंत्रण पत्र (PUC) व बीमा"],
    correctIndex: 0
  },
  {
    id: 26,
    en: "What is 'Aquaplaning' (or Hydroplaning)?",
    hi: "'एक्वाप्लेजिंग' (एक्वाप्लेनिंग) क्या है?",
    options_en: ["Tires losing traction on wet roads due to a layer of water", "Engine overheating due to lack of coolant", "Brakes failing due to mud", "Wiper blades failing in heavy rain"],
    options_hi: ["पानी की परत के कारण गीली सड़क पर टायरों का ग्रिप खोना", "कूलेंट की कमी के कारण इंजन का अधिक गर्म होना", "कीचड़ के कारण ब्रेक का फेल होना", "भारी बारिश में वाइपर का खराब होना"],
    correctIndex: 0
  },
  {
    id: 27,
    en: "When approaching a pedestrian zebra crossing where pedestrians are waiting to cross, you must:",
    hi: "जेब्रा क्रॉसिंग के पास पहुंचने पर जहां पैदल यात्री पार करने का इंतजार कर रहे हों, आपको करना चाहिए:",
    options_en: ["Stop before the stop line and let pedestrians cross safely", "Honk loudly so pedestrians clear out", "Speed up to cross before pedestrians step in", "Drive around pedestrians carefully"],
    options_hi: ["स्टॉप लाइन से पहले रुकें और पैदल यात्रियों को सुरक्षित पार करने दें", "ज़ोर से हॉर्न बजाएं ताकि पैदल यात्री हट जाएं", "पैदल यात्रियों के कदम रखने से पहले पार करने के लिए तेजी से जाएं", "पैदल यात्रियों के बगल से बचाकर गाड़ी निकालें"],
    correctIndex: 0
  },
  {
    id: 28,
    en: "What does a double solid white or yellow line in the center of the road mean?",
    hi: "सड़क के बीच में दोहरी ठोस सफेद या पीली रेखा का क्या अर्थ है?",
    options_en: ["Neither direction may cross line to overtake", "Overtaking allowed from right side only", "Overtaking allowed during daytime only", "Speed limit zone begins"],
    options_hi: ["दोनों में से किसी भी दिशा से ओवरटेक करने के लिए रेखा पार नहीं की जा सकती", "केवल दाईं ओर से ओवरटेक की अनुमति है", "केवल दिन में ओवरटेक की अनुमति है", "गति सीमा क्षेत्र शुरू होता है"],
    correctIndex: 0
  },
  {
    id: 29,
    en: "What is the primary purpose of anti-lock braking system (ABS)?",
    hi: "एंटी-लॉक ब्रेकिंग सिस्टम (ABS) का मुख्य उद्देश्य क्या है?",
    options_en: ["Prevents wheel lockup during emergency braking to maintain steering control", "Increases maximum speed of vehicle", "Automatically applies brakes at stop lights", "Reduces tire wear and tear"],
    options_hi: ["आपातकालीन ब्रेकिंग में पहियों को लॉक होने से रोकता है ताकि स्टीयरिंग कंट्रोल बना रहे", "वाहन की अधिकतम गति बढ़ाता है", "रेड लाइट पर अपने आप ब्रेक लगाता है", "टायर की घिसाई कम करता है"],
    correctIndex: 0
  },
  {
    id: 30,
    en: "What is the validity of a Pollution Under Control (PUC) certificate for a new BS6 motor vehicle?",
    hi: "एक नए BS6 मोटर वाहन के लिए प्रदूषण नियंत्रण (PUC) प्रमाण पत्र की वैधता कितनी होती है?",
    options_en: ["1 year from registration date", "6 months", "3 months", "5 years"],
    options_hi: ["पंजीकरण तिथि से 1 वर्ष", "6 महीने", "3 महीने", "5 वर्ष"],
    correctIndex: 0
  },
  {
    id: 31,
    en: "What does a driver extending right hand horizontally outside window indicate?",
    hi: "ड्राइवर द्वारा खिड़की से बाहर दाहिना हाथ सीधा फैलाना क्या दर्शाता है?",
    options_en: ["Intends to turn right", "Intends to stop vehicle", "Intends to turn left", "Asking behind vehicle to overtake"],
    options_hi: ["दाएं मुड़ने का इरादा है", "गाड़ी रोकने का इरादा है", "बाएं मुड़ने का इरादा है", "पीछे वाली गाड़ी को ओवरटेक करने का इशारा है"],
    correctIndex: 0
  },
  {
    id: 32,
    en: "When parking on an uphill road facing upwards with a curb, how should you turn your front wheels?",
    hi: "चढ़ाई वाली सड़क पर ऊपर की ओर मुंह करके पार्क करते समय अगले पहियों को किस दिशा में मोड़ना चाहिए?",
    options_en: ["Away from the curb (towards road center)", "Towards the curb", "Straight parallel to curb", "Direction does not matter"],
    options_hi: ["फुटपाथ (कर्ब) से दूर सड़क की ओर", "फुटपाथ (कर्ब) की ओर", "फुटपाथ के समानांतर सीधा", "दिशा से कोई फर्क नहीं पड़ता"],
    correctIndex: 0
  },
  {
    id: 33,
    en: "What is the Good Samaritan law protecting in road accident cases?",
    hi: "सड़क दुर्घटना के मामलों में 'गुड समैरिटन' (नेक मददगार) कानून किसकी रक्षा करता है?",
    options_en: ["Bystanders who help accident victims from civil or criminal liability", "Accident cause driver from fine", "Insurance companies from claims", "Police officers from duty"],
    options_hi: ["दुर्घटना पीड़ितों की मदद करने वाले लोगों को कानूनी कार्यवाही से सुरक्षा प्रदान करता है", "दुर्घटना करने वाले ड्राइवर को जुर्माने से बचाता है", "बीमा कंपनियों को दावों से बचाता है", "पुलिस अधिकारियों को ड्यूटी से राहत देता है"],
    correctIndex: 0
  },
  {
    id: 34,
    en: "In case of a road accident involving human injury, what is the driver's duty within 24 hours?",
    hi: "मानव चोट वाली सड़क दुर्घटना के मामले में 24 घंटे के भीतर ड्राइवर का क्या कर्तव्य है?",
    options_en: ["Report incident to nearest police station & seek medical aid", "Hide the vehicle in garage", "Negotiate money with victim family", "Leave town immediately"],
    options_hi: ["निकटतम पुलिस स्टेशन में रिपोर्ट दर्ज करें और चिकित्सा सहायता प्रदान कराएं", "वाहन को गैराज में छिपाएं", "पीड़ित परिवार से पैसे का सौदा करें", "तुरंत शहर छोड़ दें"],
    correctIndex: 0
  },
  {
    id: 35,
    en: "What should you do if your driver side tire bursts while driving at 80 km/h?",
    hi: "80 किमी/घंटा की रफ्तार से गाड़ी चलाते समय ड्राइवर साइड का टायर फटने पर क्या करना चाहिए?",
    options_en: ["Grip steering wheel firmly, ease off accelerator & brake gently", "Slam brakes forcefully instantly", "Turn steering wheel sharply to side", "Pull handbrake immediately"],
    options_hi: ["स्टीयरिंग व्हील कसकर पकड़ें, एक्सीलेटर छोड़ें और धीरे से ब्रेक लगाएं", "तुरंत पूरी ताकत से ब्रेक लगाएं", "स्टीयरिंग व्हील को तेजी से मोड़ें", "तुरंत हैंडब्रेक खींचें"],
    correctIndex: 0
  },
  {
    id: 36,
    en: "What is the speed limit for passenger cars on national highways in India unless marked otherwise?",
    hi: "भारत में राष्ट्रीय राजमार्गों पर यात्री कारों की सामान्य गति सीमा कितनी है (यदि अन्यथा न दर्शाया गया हो)?",
    options_en: ["100 km/h", "140 km/h", "60 km/h", "80 km/h"],
    options_hi: ["100 किमी/घंटा", "140 किमी/घंटा", "60 किमी/घंटा", "80 किमी/घंटा"],
    correctIndex: 0
  },
  {
    id: 37,
    en: "What is a 'Blind Spot' on a motor vehicle?",
    hi: "मोटर वाहन में 'ब्लाइंड स्पॉट' (अदृश्य क्षेत्र) क्या होता है?",
    options_en: ["An area around vehicle that cannot be seen directly in side or rear mirrors", "A scratched spot on windshield", "A dark spot on headlight lens", "A broken tail light bulb"],
    options_hi: ["वाहन के आसपास का वह क्षेत्र जो साइड या रियर शीशों में सीधे दिखाई नहीं देता", "विंडशील्ड पर खरोंच का निशान", "हेडलाइट लेंस पर काला धब्बा", "टूटा हुआ टेल लाइट बल्ब"],
    correctIndex: 0
  },
  {
    id: 38,
    en: "Is carrying passengers in a commercial goods vehicle permitted?",
    hi: "क्या वाणिज्यिक मालवाहक वाहन (गुड्स व्हीकल) में यात्रियों को ले जाने की अनुमति है?",
    options_en: ["No, strictly illegal except authorized loader staff", "Yes, if tailgate is closed", "Yes, up to 10 people allowed", "Yes, on local rural roads"],
    options_hi: ["नहीं, अधिकृत लोडर्स के अलावा सख्त गैर-कानूनी है", "हां, यदि पीछे का डाला बंद हो", "हां, 10 लोगों तक की अनुमति है", "हां, स्थानीय ग्रामीण सड़कों पर"],
    correctIndex: 0
  },
  {
    id: 39,
    en: "What does a broken white line in the middle of a two-lane road mean?",
    hi: "दो-लेन वाली सड़क के बीच में टूटी हुई सफेद रेखा का क्या अर्थ है?",
    options_en: ["You may cross or switch lanes to overtake when safe", "You must never cross the line", "One way traffic zone", "Parking permitted on the line"],
    options_hi: ["सुरक्षित होने पर ओवरटेक के लिए लाइन पार कर सकते हैं", "आपको लाइन कभी पार नहीं करनी चाहिए", "वन वे ट्रैफिक जोन", "लाइन पर पार्किंग की अनुमति है"],
    correctIndex: 0
  },
  {
    id: 40,
    en: "Which vehicle gets priority over all other traffic at an intersection?",
    hi: "चौराहे पर किस वाहन को अन्य सभी ट्रैफिक पर प्राथमिकता मिलती है?",
    options_en: ["Fire tender and emergency ambulance", "VIP luxury sedan", "Heavy truck loaded with goods", "City route passenger bus"],
    options_hi: ["फायर ब्रिगेड और आपातकालीन एम्बुलेंस", "वीआईपी लग्जरी सेडान", "सामान से लदा भारी ट्रक", "सिटी रूट पैसेंजर बस"],
    correctIndex: 0
  },
  {
    id: 41,
    en: "When approaching a railway level crossing without a gate or watchman, you must:",
    hi: "बिना फाटक या चौकीदार वाले रेलवे क्रॉसिंग पर पहुंचने पर आपको क्या करना चाहिए?",
    options_en: ["Stop before track, look both sides & proceed only when track is clear", "Drive across fast before train comes", "Honk loudly and cross without stopping", "Follow vehicle in front closely"],
    options_hi: ["पटरी से पहले रुकें, दोनों तरफ देखें और पटरी साफ होने पर ही आगे बढ़ें", "ट्रेन आने से पहले तेजी से पार करें", "ज़ोर से हॉर्न बजाएं और बिना रुके पार करें", "आगे वाले वाहन का कसकर पीछा करें"],
    correctIndex: 0
  },
  {
    id: 42,
    en: "What color lights are legally permitted at the front of a private car?",
    hi: "निजी कार के सामने कानूनी रूप से किस रंग की रोशनी लगाने की अनुमति है?",
    options_en: ["White or Amber yellow lights", "Red lights", "Blue neon lights", "Green flashing lights"],
    options_hi: ["सफेद या एम्बर पीली लाइटें", "लाल लाइटें", "नीली नियॉन लाइटें", "हरी टिमटिमाती लाइटें"],
    correctIndex: 0
  },
  {
    id: 43,
    en: "Why is coasting downhill in Neutral gear dangerous?",
    hi: "ढलान पर न्यूट्रल गियर में गाड़ी चलाना खतरनाक क्यों है?",
    options_en: ["Engine braking power is lost & brakes may overheat and fail", "Engine RPM increases too much", "Tires burst due to low friction", "Headlights flicker"],
    options_hi: ["इंजन ब्रेकिंग पावर खत्म हो जाती है जिससे ब्रेक गर्म होकर फेल हो सकते हैं", "इंजन RPM बहुत बढ़ जाता है", "कम घर्षण से टायर फट जाते हैं", "हेडलाइट्स टिमटिमाने लगती हैं"],
    correctIndex: 0
  },
  {
    id: 44,
    en: "What is the penalty for driving without a valid third-party motor insurance policy?",
    hi: "वैध थर्ड-पार्टी मोटर बीमा के बिना गाड़ी चलाने पर क्या जुर्माना है?",
    options_en: ["Fine up to ₹2,000 and/or imprisonment up to 3 months", "₹100 fine", "Only warnings", "RTO registration renewal"],
    options_hi: ["₹2,000 तक जुर्माना और/या 3 महीने तक की जेल", "₹100 जुर्माना", "केवल चेतावनी", "RTO पंजीकरण नवीनीकरण"],
    correctIndex: 0
  },
  {
    id: 45,
    en: "When taking a U-turn, which signal light must you operate?",
    hi: "यू-टर्न लेते समय आपको किस सिग्नल लाइट का प्रयोग करना चाहिए?",
    options_en: ["Right turn indicator light", "Left turn indicator light", "Hazard light", "No signal needed"],
    options_hi: ["दाएं मोड़ का इंडिकेटर", "बाएं मोड़ का इंडिकेटर", "हार्ड लाइट", "किसी संकेत की आवश्यकता नहीं"],
    correctIndex: 0
  },
  {
    id: 46,
    en: "What should you do when driving in heavy rain conditions?",
    hi: "भारी बारिश के दौरान गाड़ी चलाते समय आपको क्या करना चाहिए?",
    options_en: ["Reduce speed, use low beam & turn on windshield wipers", "Use high beam & double speed", "Drive on road shoulder fast", "Honk non-stop"],
    options_hi: ["गति धीमी करें, लो बीम का प्रयोग करें और वाइपर चालू करें", "हाई बीम और दोगुनी गति का प्रयोग करें", "रोड शोल्डर पर तेजी से चलाएं", "लगातार हॉर्न बजाएं"],
    correctIndex: 0
  },
  {
    id: 47,
    en: "Who has the right of way on a narrow mountain road slope?",
    hi: "संकरी पहाड़ी सड़क की ढलान पर किसे प्राथमिकता का अधिकार प्राप्त है?",
    options_en: ["Vehicle travelling uphill (going upwards)", "Vehicle travelling downhill (going downwards)", "Heavier vehicle", "Faster vehicle"],
    options_hi: ["चढ़ाई चढ़ने वाला वाहन (ऊपर जाने वाला)", "ढलान उतरने वाला वाहन (नीचे जाने वाला)", "भारी वाहन", "तेज चलने वाला वाहन"],
    correctIndex: 0
  },
  {
    id: 48,
    en: "What is the maximum allowed tint percentage for front windshield and rear glass in India?",
    hi: "भारत में फ्रंट विंडशील्ड और रियर ग्लास के लिए स्वीकृत अधिकतम टिंट (कांच का कालापन) कितना है?",
    options_en: ["Minimum 70% Visual Light Transmission (VLT)", "Minimum 30% VLT", "100% pitch dark tint", "Any percentage allowed"],
    options_hi: ["न्यूनतम 70% विज़ुअल लाइट ट्रांसमिशन (VLT)", "न्यूनतम 30% VLT", "100% पूरी तरह काला टिंट", "कोई भी प्रतिशत अनुमत"],
    correctIndex: 0
  },
  {
    id: 49,
    en: "What does zig-zag white road markings painted before a pedestrian crossing mean?",
    hi: "पैदल पार पथ (जेब्रा क्रॉसिंग) से पहले सड़क पर बनी ज़िग-ज़ैग सफेद रेखाओं का क्या अर्थ है?",
    options_en: ["No parking or overtaking zone near crossing", "Speed acceleration zone", "Zig-zag driving zone", "Bus stop loading area"],
    options_hi: ["पार पथ के पास पार्किंग या ओवरटेकिंग सख्त मना है", "गति बढ़ाने का क्षेत्र", "ज़िग-ज़ैग ड्राइविंग क्षेत्र", "बस स्टॉप लोडिंग क्षेत्र"],
    correctIndex: 0
  },
  {
    id: 50,
    en: "What does a solid red traffic signal light mean?",
    hi: "ठोस लाल ट्रैफिक सिग्नल लाइट का क्या अर्थ है?",
    options_en: ["Stop completely behind the stop line", "Proceed slowly if road is clear", "Turn left only without stopping", "Speed up to cross signal"],
    options_hi: ["स्टॉप लाइन के पीछे पूरी तरह रुकें", "सड़क साफ होने पर धीरे-धीरे आगे बढ़ें", "बिना रुके केवल बाएं मुड़ें", "सिग्नल पार करने के लिए तेजी से जाएं"],
    correctIndex: 0
  },
  {
    id: 51,
    en: "If a traffic constable signals you to stop while traffic light is green, what must you do?",
    hi: "यदि ट्रैफिक लाइट हरी हो लेकिन ट्रैफिक पुलिसकर्मी आपको रुकने का इशारा करे तो आपको क्या करना चाहिए?",
    options_en: ["Obey police constable officer signal & stop", "Ignore constable and follow green light", "Honk at constable and proceed", "Turn vehicle around"],
    options_hi: ["पुलिसकर्मी के इशारे का पालन करें और रुकें", "पुलिसकर्मी की अनदेखी करें और हरी लाइट का पालन करें", "पुलिसकर्मी पर हॉर्न बजाकर आगे बढ़ें", "गाड़ी वापस मोड़ लें"],
    correctIndex: 0
  },
  {
    id: 52,
    en: "What is the purpose of rear view mirrors in a vehicle?",
    hi: "वाहन में रियर व्यू मिरर (पीछे देखने वाले शीशे) का उद्देश्य क्या है?",
    options_en: ["To observe rear traffic & ensure safe lane changing", "To check back seat passenger faces", "For decorative appearance", "To reflect headlight glare away"],
    options_hi: ["पीछे का ट्रैफिक देखने और सुरक्षित लेन बदलने के लिए", "पिछली सीट के यात्रियों को देखने के लिए", "सजावटी सुंदरता के लिए", "हेडलाइट की चमक को वापस मोड़ने के लिए"],
    correctIndex: 0
  },
  {
    id: 53,
    en: "When two vehicles meet on a narrow bridge where passing is impossible, who should reverse?",
    hi: "जब दो वाहन ऐसे संकरे पुल पर आ जाएं जहां पास होना असंभव हो तो किसे पीछे हटना चाहिए?",
    options_en: ["Vehicle closest to bridge entrance / exit should yield or reverse", "Lighter vehicle always", "Vehicle coming from south", "No vehicle should move"],
    options_hi: ["जो वाहन पुल के मुहाने के सबसे करीब हो उसे पीछे हटना चाहिए", "हमेशा हल्का वाहन", "दक्षिण से आने वाला वाहन", "किसी वाहन को नहीं हिलना चाहिए"],
    correctIndex: 0
  },
  {
    id: 54,
    en: "What does 'Tailgating' mean in driving?",
    hi: "ड्राइविंग में 'टेलगेटिंग' का क्या अर्थ है?",
    options_en: ["Driving dangerously close behind another vehicle", "Opening vehicle tailgate while moving", "Driving with broken tail lights", "Reversing vehicle into parking"],
    options_hi: ["आगे चल रहे वाहन के बहुत पास सटाकर खतरनाक तरीके से गाड़ी चलाना", "चलते वाहन का पिछला डाला खोलना", "टूटी टेल लाइट के साथ गाड़ी चलाना", "पार्किंग में बैक करना"],
    correctIndex: 0
  },
  {
    id: 55,
    en: "What is the recommended hand position on a steering wheel (clock face analogy)?",
    hi: "स्टीयरिंग व्हील पर हाथों की अनुशंसित स्थिति क्या है (घड़ी की सुइयों की तुलना में)?",
    options_en: ["9 o'clock and 3 o'clock position (or 10 and 2)", "12 o'clock single hand top", "6 o'clock bottom both hands", "One hand on gear shift always"],
    options_hi: ["9 बजे और 3 बजे की स्थिति (या 10 और 2)", "12 बजे ऊपर केवल एक हाथ", "6 बजे नीचे दोनों हाथ", "हमेशा एक हाथ गियर लीवर पर"],
    correctIndex: 0
  },
  {
    id: 56,
    en: "What is the penalty for racing or speed trials on public roads without permission?",
    hi: "बिना अनुमति सार्वजनिक सड़कों पर रेसिंग या रेस ट्रायल करने पर क्या सजा है?",
    options_en: ["Imprisonment up to 1 month and/or fine up to ₹5,000", "₹200 fine", "No penalty", "Tire puncture"],
    options_hi: ["1 महीने तक की जेल और/या ₹5,000 तक जुर्माना", "₹200 जुर्माना", "कोई सजा नहीं", "टायर पंचर"],
    correctIndex: 0
  },
  {
    id: 57,
    en: "When can you switch on your hazard warning flashing lights?",
    hi: "आप अपनी गाड़ी की हार्ड वार्निंग फ्लैशिंग लाइटें कब चालू कर सकते हैं?",
    options_en: ["When vehicle is stranded/broken down or causing obstruction", "While driving fast in rain", "When overtaking in night", "While parking legally"],
    options_hi: ["जब वाहन खराब हो गया हो, रुक गया हो या बाधा बन रहा हो", "बारिश में तेज चलाते समय", "रात में ओवरटेक करते समय", "कानूनी रूप से पार्क करते समय"],
    correctIndex: 0
  },
  {
    id: 58,
    en: "What is the minimum legal age for obtaining a Permanent Driving Licence for Light Motor Vehicle (LMV)?",
    hi: "लाइट मोटर वाहन (LMV कार/जीप) का स्थायी ड्राइविंग लाइसेंस प्राप्त करने की न्यूनतम कानूनी आयु क्या है?",
    options_en: ["18 years", "16 years", "21 years", "25 years"],
    options_hi: ["18 वर्ष", "16 वर्ष", "21 वर्ष", "25 वर्ष"],
    correctIndex: 0
  },
  {
    id: 59,
    en: "What should you do when driving past a stationary public bus stopped at a bus stop?",
    hi: "बस स्टॉप पर खड़ी यात्री बस के पास से गुजरते समय आपको क्या करना चाहिए?",
    options_en: ["Slow down & be prepared for pedestrians stepping out from front of bus", "Overtake at maximum speed honking", "Stop right behind bus until it moves", "Flash high beam continuously"],
    options_hi: ["धीमे हों और बस के आगे से अचानक निकलने वाले पैदल यात्रियों के लिए सतर्क रहें", "ज़ोर से हॉर्न बजाकर अधिकतम गति से आगे निकलें", "बस के हटने तक ठीक पीछे रुकें", "लगातार हाई बीम फ्लैश करें"],
    correctIndex: 0
  },
  {
    id: 60,
    en: "What does 'Yellow Box' junction road marking mean?",
    hi: "चौराहे पर 'येलो बॉक्स' (पीला बॉक्स) सड़क मार्किंग का क्या अर्थ है?",
    options_en: ["Do not enter box unless your exit pathway is clear", "VIP emergency parking box", "Speed acceleration box", "Two-wheeler waiting zone"],
    options_hi: ["बॉक्स में तब तक प्रवेश न करें जब तक आगे निकलने का रास्ता साफ न हो", "वीआईपी इमरजेंसी पार्किंग बॉक्स", "स्पीड एक्सीलरेशन बॉक्स", "दोपहिया वाहन वेटिंग ज़ोन"],
    correctIndex: 0
  },
  {
    id: 1001,
    en: "What should you do when a traffic police officer signals you to stop despite a green light?",
    hi: "हरी बत्ती होने पर भी ट्रैफिक पुलिस रुकने का इशारा करे तो क्या करें?",
    options_en: ["Follow the officer's signal and stop", "Ignore the officer and proceed", "Honk and speed up", "Stop only if other cars stop"],
    options_hi: ["पुलिस के इशारे का पालन करें और रुकें", "पुलिस को अनदेखा करके आगे बढ़ें", "हॉर्न बजाकर तेज चलें", "दूसरी गाड़ियां रुकें तभी रुकें"],
    correctIndex: 0
  },
  {
    id: 1002,
    en: "What is the safest action if you feel sleepy while driving?",
    hi: "गाड़ी चलाते समय नींद आने लगे तो सबसे सुरक्षित क्या है?",
    options_en: ["Stop at a safe place and rest", "Open the window and keep driving", "Increase speed to reach sooner", "Look at your phone to stay awake"],
    options_hi: ["सुरक्षित जगह गाड़ी रोककर आराम करें", "खिड़की खोलकर चलाते रहें", "जल्दी पहुंचने के लिए स्पीड बढ़ाएं", "जागने के लिए फोन देखें"],
    correctIndex: 0
  },
  {
    id: 1003,
    en: "Why should you avoid using your phone while driving?",
    hi: "ड्राइविंग करते समय फोन इस्तेमाल करने से क्यों बचना चाहिए?",
    options_en: ["It distracts attention from the road", "It improves reaction time", "It makes braking easier", "It reduces traffic"],
    options_hi: ["इससे सड़क से ध्यान हट जाता है", "इससे जल्दी रिएक्शन होता है", "इससे ब्रेक लगाना आसान होता है", "इससे ट्रैफिक कम होता है"],
    correctIndex: 0
  },
  {
    id: 1004,
    en: "What should you do when approaching a blind curve?",
    hi: "आगे का रास्ता न दिखने वाले मोड़ पर क्या करना चाहिए?",
    options_en: ["Slow down and stay in your lane", "Overtake quickly", "Drive in the middle of the road", "Turn off headlights"],
    options_hi: ["स्पीड कम करें और अपनी लेन में रहें", "जल्दी से ओवरटेक करें", "सड़क के बीच में चलें", "हेडलाइट बंद कर दें"],
    correctIndex: 0
  },
  {
    id: 1005,
    en: "When should you use your turn indicators?",
    hi: "गाड़ी के इंडिकेटर कब इस्तेमाल करने चाहिए?",
    options_en: ["Before turning or changing lanes", "Only after completing a turn", "Only at night", "Only on highways"],
    options_hi: ["मुड़ने या लेन बदलने से पहले", "मोड़ पूरा होने के बाद", "सिर्फ रात में", "सिर्फ हाईवे पर"],
    correctIndex: 0
  },
  {
    id: 1006,
    en: "What should you do if pedestrians are crossing at a zebra crossing?",
    hi: "जेब्रा क्रॉसिंग पर लोग सड़क पार कर रहे हों तो क्या करें?",
    options_en: ["Stop and allow them to cross safely", "Honk until they move", "Drive around them", "Accelerate before they cross"],
    options_hi: ["रुकें और उन्हें सुरक्षित पार करने दें", "उनके हटने तक हॉर्न बजाएं", "उनके आसपास से गाड़ी निकालें", "उनसे पहले निकलने के लिए स्पीड बढ़ाएं"],
    correctIndex: 0
  },
  {
    id: 1007,
    en: "What is the safest way to drive in heavy rain?",
    hi: "तेज बारिश में सुरक्षित ड्राइविंग कैसे करें?",
    options_en: ["Reduce speed and increase following distance", "Use cruise control at high speed", "Brake sharply at every puddle", "Follow the vehicle ahead very closely"],
    options_hi: ["स्पीड कम करें और आगे वाली गाड़ी से ज्यादा दूरी रखें", "तेज स्पीड पर क्रूज कंट्रोल चलाएं", "हर गड्ढे पर अचानक ब्रेक लगाएं", "आगे वाली गाड़ी के बहुत पास चलें"],
    correctIndex: 0
  },
  {
    id: 1008,
    en: "What should you check before opening a parked car door into traffic?",
    hi: "सड़क किनारे खड़ी कार का दरवाजा खोलने से पहले क्या देखें?",
    options_en: ["Check for approaching vehicles and cyclists", "Open immediately without looking", "Honk before opening", "Only check the rear seat"],
    options_hi: ["पीछे से आ रही गाड़ियां और साइकिल वाले देखें", "बिना देखे तुरंत खोल दें", "खोलने से पहले हॉर्न बजाएं", "सिर्फ पीछे की सीट देखें"],
    correctIndex: 0
  },
  {
    id: 1101,
    en: "Before moving a vehicle from a parked position, what should you do?",
    hi: "खड़ी गाड़ी चलाने से पहले क्या करना चाहिए?",
    options_en: ["Check mirrors, blind spots and signal","Move immediately without checking","Only honk twice","Switch on hazard lights and accelerate"],
    options_hi: ["शीशे और ब्लाइंड स्पॉट देखें, फिर इंडिकेटर दें","बिना देखे तुरंत गाड़ी चलाएं","सिर्फ दो बार हॉर्न बजाएं","हैज़र्ड लाइट जलाकर तेज चलें"],
    correctIndex: 0
  },
  {
    id: 1102,
    en: "What should you do if an emergency vehicle approaches from behind?",
    hi: "पीछे से एम्बुलेंस या फायर ब्रिगेड आए तो क्या करें?",
    options_en: ["Safely give way without blocking traffic","Race ahead of it","Stop abruptly in the middle of the lane","Ignore it if the signal is green"],
    options_hi: ["सुरक्षित तरीके से रास्ता दें","उससे तेज गाड़ी चलाएं","लेन के बीच अचानक रुक जाएं","हरी बत्ती हो तो अनदेखा करें"],
    correctIndex: 0
  },
  {
    id: 1103,
    en: "Why should you wear a seat belt in a car?",
    hi: "कार में सीट बेल्ट क्यों पहननी चाहिए?",
    options_en: ["It reduces injury risk during sudden stops and crashes","It improves fuel mileage","It replaces airbags","It prevents the engine from stalling"],
    options_hi: ["अचानक ब्रेक या हादसे में चोट का खतरा कम होता है","पेट्रोल की बचत होती है","एयरबैग की जरूरत खत्म होती है","इंजन बंद नहीं होता"],
    correctIndex: 0
  },
  {
    id: 1104,
    en: "What should you do when the road is flooded and water depth is unknown?",
    hi: "सड़क पर पानी भरा हो और गहराई पता न हो तो क्या करें?",
    options_en: ["Avoid entering and choose a safer route","Drive fast to create a wave","Follow any vehicle closely","Stop in deep water and restart repeatedly"],
    options_hi: ["पानी में न जाएं और सुरक्षित दूसरा रास्ता चुनें","तेजी से पानी में गाड़ी डालें","किसी भी गाड़ी के बिल्कुल पीछे चलें","गहरे पानी में बार-बार स्टार्ट करें"],
    correctIndex: 0
  },
  {
    id: 1105,
    en: "What is the safe way to approach a sharp bend?",
    hi: "तेज मोड़ के पास सुरक्षित तरीके से कैसे चलें?",
    options_en: ["Slow down before entering the bend","Brake hard in the middle of the bend","Overtake on the bend","Drive on the wrong side for a better view"],
    options_hi: ["मोड़ शुरू होने से पहले स्पीड कम करें","मोड़ के बीच अचानक तेज ब्रेक लगाएं","मोड़ पर ओवरटेक करें","अच्छा दिखने के लिए गलत साइड चलें"],
    correctIndex: 0
  },
  {
    id: 1106,
    en: "What should you do if a tyre loses grip on a wet road?",
    hi: "गीली सड़क पर टायर की पकड़ कम हो जाए तो क्या करें?",
    options_en: ["Ease off the accelerator and steer smoothly","Brake and turn sharply","Accelerate harder","Pull the parking brake"],
    options_hi: ["एक्सीलरेटर धीरे छोड़ें और स्टीयरिंग आराम से संभालें","तेज ब्रेक लगाकर अचानक मोड़ें","और तेज एक्सीलरेटर दबाएं","हैंडब्रेक खींचें"],
    correctIndex: 0
  },
  {
    id: 1107,
    en: "How should you react to a child near the edge of the road?",
    hi: "सड़क किनारे बच्चा दिखे तो क्या करें?",
    options_en: ["Slow down and be ready to stop","Honk continuously and maintain speed","Accelerate to pass quickly","Assume the child will stay still"],
    options_hi: ["स्पीड कम करें और रुकने के लिए तैयार रहें","लगातार हॉर्न बजाकर उसी स्पीड पर चलें","जल्दी निकलने के लिए स्पीड बढ़ाएं","मान लें बच्चा वहीं खड़ा रहेगा"],
    correctIndex: 0
  },
  {
    id: 1108,
    en: "When should you avoid overtaking?",
    hi: "कब ओवरटेक नहीं करना चाहिए?",
    options_en: ["When you cannot clearly see the road ahead","When the road ahead is clear and overtaking is permitted","When traffic is light","When your mirrors are adjusted"],
    options_hi: ["जब आगे की सड़क साफ दिखाई न दे","जब सड़क साफ हो और ओवरटेक की अनुमति हो","जब ट्रैफिक कम हो","जब शीशे सही लगे हों"],
    correctIndex: 0
  }
];

// Traffic Sign Question Bank
const SIGN_QUESTION_BANK: SignQuestion[] = [
  {
    id: 1,
    signType: "stop",
    en: "What does this traffic sign mean?",
    hi: "इस यातायात संकेत का क्या अर्थ है?",
    options_en: ["STOP completely", "Give Way", "No Entry", "Hospital ahead"],
    options_hi: ["पूरी तरह रुकें (STOP)", "रास्ता दें (Give Way)", "प्रवेश निषेध (No Entry)", "अस्पताल आगे है"],
    correctIndex: 0
  },
  {
    id: 2,
    signType: "no_entry",
    en: "What does this circular sign with a white horizontal bar mean?",
    hi: "सफेद क्षैतिज पट्टी वाले इस गोल संकेत का क्या अर्थ है?",
    options_en: ["NO ENTRY for all vehicles", "One Way Road", "No Parking Zone", "End of Restrictions"],
    options_hi: ["सभी वाहनों के लिए प्रवेश निषेध (NO ENTRY)", "एकतरफा सड़क", "नो पार्किंग क्षेत्र", "प्रतिबंध समाप्त"],
    correctIndex: 0
  },
  {
    id: 3,
    signType: "no_parking",
    en: "What does this blue circular sign with a red border & diagonal line mean?",
    hi: "लाल सीमा और तिरछी रेखा वाले इस नीले गोल संकेत का क्या अर्थ है?",
    options_en: ["NO PARKING", "No Stopping", "Speed Limit 50", "Compulsory Ahead"],
    options_hi: ["पार्किंग निषेध (NO PARKING)", "रुकना मना है", "गति सीमा 50", "आगे जाना अनिवार्य"],
    correctIndex: 0
  },
  {
    id: 4,
    signType: "no_overtaking",
    en: "What does this sign showing crossed-out cars mean?",
    hi: "काटे गए दो कारों वाले इस संकेत का क्या अर्थ है?",
    options_en: ["NO OVERTAKING", "Two-way Traffic", "No Vehicles Allowed", "Car Wash Station"],
    options_hi: ["ओवरटेकिंग निषेध (NO OVERTAKING)", "दोतरफा ट्रैफिक", "वाहन वर्जित", "कार वाश स्टेशन"],
    correctIndex: 0
  },
  {
    id: 5,
    signType: "no_horn",
    en: "What does this crossed-out horn symbol mean?",
    hi: "काटे गए हॉर्न के प्रतीक का क्या अर्थ है?",
    options_en: ["NO HONKING / Silence Zone", "Sound Horn Compulsory", "Music Allowed Zone", "Loud Siren Zone"],
    options_hi: ["हॉर्न बजाना मना है / शांत क्षेत्र", "हॉर्न बजाना अनिवार्य", "संगीत अनुमत क्षेत्र", "तेज सायरन क्षेत्र"],
    correctIndex: 0
  },
  {
    id: 6,
    signType: "u_turn_prohibited",
    en: "What does this inverted U-arrow crossed out sign mean?",
    hi: "काटे गए उल्टे U-तीर वाले इस संकेत का क्या अर्थ है?",
    options_en: ["U-TURN PROHIBITED", "Turn Left Only", "Roundabout Ahead", "Right Turn Prohibited"],
    options_hi: ["यू-टर्न निषेध (U-TURN PROHIBITED)", "केवल बाएं मुड़ें", "आगे गोलचक्कर है", "दायां मोड़ निषेध"],
    correctIndex: 0
  },
  {
    id: 7,
    signType: "pedestrian_crossing",
    en: "What does this blue square sign with a walking figure on stripes mean?",
    hi: "स्ट्राइप्स पर पैदल चलते चित्र वाले नीले वर्गाकार संकेत का क्या अर्थ है?",
    options_en: ["PEDESTRIAN CROSSING (Zebra Crossing)", "Pedestrians Prohibited", "Jogging Park", "Footpath End"],
    options_hi: ["पैदल पार पथ (जेब्रा क्रॉसिंग)", "पैदल यात्री वर्जित", "जॉगिंग पार्क", "फुटपाथ समाप्त"],
    correctIndex: 0
  },
  {
    id: 8,
    signType: "school_ahead",
    en: "What does this triangular sign with school children figures mean?",
    hi: "स्कूल के बच्चों वाले त्रिकोणीय संकेत का क्या अर्थ है?",
    options_en: ["SCHOOL AHEAD - Slow down", "Children Playground", "Pedestrian Zone", "No Entry for School Bus"],
    options_hi: ["आगे स्कूल है - गति धीमी करें", "बच्चों का खेल मैदान", "पैदल यात्री क्षेत्र", "स्कूल बस प्रवेश निषेध"],
    correctIndex: 0
  },
  {
    id: 9,
    signType: "hospital",
    en: "What does this blue sign with a Red Cross & 'H' letter mean?",
    hi: "लाल क्रॉस और 'H' अक्षर वाले नीले संकेत का क्या अर्थ है?",
    options_en: ["HOSPITAL ahead", "Hotel / Restaurant", "Helipad Zone", "Highway Junction"],
    options_hi: ["आगे अस्पताल (HOSPITAL) है", "होटल / रेस्तरां", "हेलीपैड क्षेत्र", "हाईवे जंक्शन"],
    correctIndex: 0
  },
  {
    id: 10,
    signType: "speed_limit_50",
    en: "What does a circular sign with red border & number '50' inside mean?",
    hi: "लाल बॉर्डर और अंदर '50' नंबर वाले गोल संकेत का क्या अर्थ है?",
    options_en: ["MAXIMUM SPEED LIMIT 50 km/h", "Minimum Speed 50 km/h", "Distance to City 50 km", "Route Number 50"],
    options_hi: ["अधिकतम गति सीमा 50 किमी/घंटा", "न्यूनतम गति 50 किमी/घंटा", "शहर की दूरी 50 किमी", "रूट नंबर 50"],
    correctIndex: 0
  },
  {
    id: 11,
    signType: "give_way",
    en: "What does this inverted red triangle sign mean?",
    hi: "उल्टे लाल त्रिभुज वाले इस संकेत का क्या अर्थ है?",
    options_en: ["GIVE WAY to oncoming / crossing traffic", "Stop Completely", "Danger Ahead", "Narrow Road"],
    options_hi: ["रास्ता दें (GIVE WAY)", "पूरी तरह रुकें", "आगे खतरा है", "संकीर्ण सड़क"],
    correctIndex: 0
  },
  {
    id: 12,
    signType: "narrow_bridge",
    en: "What does this triangular sign with narrowing parallel lines mean?",
    hi: "समानंतर संकरी रेखाओं वाले त्रिकोणीय संकेत का क्या अर्थ है?",
    options_en: ["NARROW BRIDGE AHEAD", "Road Construction", "Slippery Road", "Steep Descent"],
    options_hi: ["आगे संकीर्ण पुल (Narrow Bridge) है", "सड़क निर्माण कार्य", "फिसलन भरी सड़क", "तीव्र ढलान"],
    correctIndex: 0
  }
];

// Helper: Fisher-Yates Shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Render SVG Road Signs cleanly
// Randomize both the question order and answer positions for every attempt.
function randomizeAnswerPositions<T extends { options_en: [string, string, string, string]; options_hi: [string, string, string, string]; correctIndex: number }>(question: T): T {
  const order = shuffleArray([0, 1, 2, 3]);
  return {
    ...question,
    options_en: order.map(i => question.options_en[i]) as [string, string, string, string],
    options_hi: order.map(i => question.options_hi[i]) as [string, string, string, string],
    correctIndex: order.indexOf(question.correctIndex)
  };
}

function RenderRoadSign({ signType }: { signType: string }) {
  switch (signType) {
    case 'stop':
      return (
        <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto drop-shadow-md">
          <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="#dc2626" stroke="#ffffff" strokeWidth="3" />
          <text x="50" y="58" fontSize="22" fontWeight="900" fill="#ffffff" textAnchor="middle" fontFamily="sans-serif">STOP</text>
        </svg>
      );
    case 'no_entry':
      return (
        <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto drop-shadow-md">
          <circle cx="50" cy="50" r="45" fill="#dc2626" />
          <rect x="18" y="42" width="64" height="16" fill="#ffffff" rx="2" />
        </svg>
      );
    case 'no_parking':
      return (
        <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto drop-shadow-md">
          <circle cx="50" cy="50" r="45" fill="#1d4ed8" stroke="#dc2626" strokeWidth="8" />
          <text x="50" y="62" fontSize="42" fontWeight="900" fill="#ffffff" textAnchor="middle" fontFamily="sans-serif">P</text>
          <line x1="20" y1="20" x2="80" y2="80" stroke="#dc2626" strokeWidth="8" />
        </svg>
      );
    case 'no_overtaking':
      return (
        <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto drop-shadow-md">
          <circle cx="50" cy="50" r="44" fill="#ffffff" stroke="#dc2626" strokeWidth="8" />
          {/* Car Left Black */}
          <rect x="25" y="40" width="18" height="26" fill="#1e293b" rx="4" />
          {/* Car Right Red */}
          <rect x="55" y="32" width="18" height="26" fill="#dc2626" rx="4" />
          <line x1="22" y1="22" x2="78" y2="78" stroke="#dc2626" strokeWidth="6" />
        </svg>
      );
    case 'no_horn':
      return (
        <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto drop-shadow-md">
          <circle cx="50" cy="50" r="44" fill="#ffffff" stroke="#dc2626" strokeWidth="8" />
          <path d="M25 45 L35 45 L48 35 L48 65 L35 55 L25 55 Z" fill="#1e293b" />
          <path d="M54 40 Q62 50 54 60" fill="none" stroke="#1e293b" strokeWidth="4" />
          <line x1="20" y1="20" x2="80" y2="80" stroke="#dc2626" strokeWidth="7" />
        </svg>
      );
    case 'u_turn_prohibited':
      return (
        <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto drop-shadow-md">
          <circle cx="50" cy="50" r="44" fill="#ffffff" stroke="#dc2626" strokeWidth="8" />
          <path d="M38 65 L38 42 A 12 12 0 0 1 62 42 L62 65" fill="none" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
          <polygon points="32,60 38,72 44,60" fill="#1e293b" />
          <line x1="20" y1="20" x2="80" y2="80" stroke="#dc2626" strokeWidth="7" />
        </svg>
      );
    case 'pedestrian_crossing':
      return (
        <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto drop-shadow-md">
          <rect x="5" y="5" width="90" height="90" fill="#1d4ed8" rx="10" />
          <polygon points="50,12 88,82 12,82" fill="#ffffff" />
          {/* Stripes */}
          <rect x="25" y="70" width="50" height="4" fill="#1e293b" />
          <rect x="28" y="62" width="44" height="4" fill="#1e293b" />
          {/* Walking figure */}
          <circle cx="48" cy="28" r="5" fill="#1e293b" />
          <path d="M48 34 L45 50 L38 62 M45 50 L54 62 M48 38 L40 45 M48 38 L56 45" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'school_ahead':
      return (
        <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto drop-shadow-md">
          <polygon points="50,8 92,85 8,85" fill="#ffffff" stroke="#dc2626" strokeWidth="8" />
          {/* Children figure */}
          <circle cx="42" cy="42" r="4" fill="#1e293b" />
          <path d="M42 46 L40 62 M42 50 L36 58 M42 50 L48 58" stroke="#1e293b" strokeWidth="3" />
          <circle cx="58" cy="48" r="3.5" fill="#1e293b" />
          <path d="M58 52 L56 66 M58 55 L52 62 M58 55 L64 62" stroke="#1e293b" strokeWidth="2.5" />
        </svg>
      );
    case 'hospital':
      return (
        <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto drop-shadow-md">
          <rect x="5" y="5" width="90" height="90" fill="#1d4ed8" rx="10" />
          <rect x="18" y="18" width="64" height="64" fill="#ffffff" rx="6" />
          <text x="35" y="62" fontSize="38" fontWeight="900" fill="#1d4ed8" fontFamily="sans-serif">H</text>
          {/* Red Cross */}
          <rect x="62" y="32" width="16" height="6" fill="#dc2626" />
          <rect x="67" y="27" width="6" height="16" fill="#dc2626" />
        </svg>
      );
    case 'speed_limit_50':
      return (
        <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto drop-shadow-md">
          <circle cx="50" cy="50" r="44" fill="#ffffff" stroke="#dc2626" strokeWidth="8" />
          <text x="50" y="63" fontSize="40" fontWeight="900" fill="#1e293b" textAnchor="middle" fontFamily="sans-serif">50</text>
        </svg>
      );
    case 'give_way':
      return (
        <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto drop-shadow-md">
          <polygon points="50,92 92,15 8,15" fill="#ffffff" stroke="#dc2626" strokeWidth="9" />
        </svg>
      );
    case 'narrow_bridge':
      return (
        <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto drop-shadow-md">
          <polygon points="50,8 92,85 8,85" fill="#ffffff" stroke="#dc2626" strokeWidth="8" />
          <path d="M35 75 L35 55 L42 40 L42 28 M65 75 L65 55 L58 40 L58 28" stroke="#1e293b" strokeWidth="5" fill="none" />
        </svg>
      );
    default:
      return null;
  }
}

export function LearningLicenceMockTest({ onShowToast }: { onShowToast: (msg: string) => void }) {
  // Global Language Toggle state: 'en' | 'hi'
  const [lang, setLang] = useState<'en' | 'hi'>('hi');

  // Mode Selection: 'test' (Mock Test) | 'signs' (Traffic Signs)
  const [activeTab, setActiveTab] = useState<'test' | 'signs'>('test');

  // Mock Test States
  const [testState, setTestState] = useState<'start' | 'in_progress' | 'result'>('start');
  const [timerEnabled, setTimerEnabled] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(900); // 15:00 = 900 seconds
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Scores stay on this device only; no account or paid API required.
  const [scoreHistory, setScoreHistory] = useState<Array<{ date: string; correct: number; total: number }>>(() => {
    try {
      const stored = localStorage.getItem('zubware-ll-score-history-v1');
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed.filter((item: any) => item && typeof item.correct === 'number' && typeof item.total === 'number' && typeof item.date === 'string').slice(0, 20) : [];
    } catch { return []; }
  });

  // Short safety-focused explanations for the newly added practice questions.
  const questionExplanations: Record<number, { hi: string; en: string }> = {
    1001: { hi: 'ट्रैफिक पुलिस के इशारे को मानना जरूरी है, भले ही सिग्नल हरा हो।', en: 'Follow the traffic officer’s directions even if the signal is green.' },
    1002: { hi: 'नींद में ड्राइविंग से हादसे का खतरा बढ़ता है। सुरक्षित जगह रुककर आराम करें।', en: 'Drowsy driving raises crash risk. Pull over safely and rest.' },
    1003: { hi: 'फोन देखने से सड़क पर ध्यान कम हो जाता है और रिएक्शन में देर होती है।', en: 'Phone use distracts you from traffic and slows reactions.' },
    1004: { hi: 'अंधे मोड़ पर सामने से आने वाली गाड़ी नहीं दिख सकती, इसलिए स्पीड कम रखें।', en: 'On blind curves, reduce speed because oncoming traffic may be hidden.' },
    1005: { hi: 'मोड़ने या लेन बदलने से पहले इंडिकेटर देने से दूसरे ड्राइवर सावधान होते हैं।', en: 'Signal before turning or changing lanes to warn other road users.' },
    1006: { hi: 'जेब्रा क्रॉसिंग पर पैदल चलने वालों को सुरक्षित रास्ता दें।', en: 'Give pedestrians safe passage at zebra crossings.' },
    1007: { hi: 'बारिश में सड़क फिसल सकती है और ब्रेक लगाने में ज्यादा दूरी लगती है।', en: 'Wet roads reduce grip and increase stopping distance.' },
    1008: { hi: 'दरवाजा खोलने से पहले पीछे देखें, ताकि साइकिल या गाड़ी से टक्कर न हो।', en: 'Check for approaching cyclists and vehicles before opening the door.' },
    1101: { hi: "गाड़ी आगे बढ़ाने से पहले आसपास देखना और इंडिकेटर देना टक्कर से बचाता है।", en: "Check surroundings and signal before pulling out." },
    1102: { hi: "इमरजेंसी वाहन को बिना अचानक रुकावट पैदा किए रास्ता देना चाहिए।", en: "Make room safely for emergency vehicles without sudden hazards." },
    1103: { hi: "सीट बेल्ट झटके और हादसे में गंभीर चोट का खतरा कम करती है।", en: "Seat belts reduce serious injury in crashes." },
    1104: { hi: "पानी की गहराई और सड़क की हालत पता न हो तो उसमें गाड़ी न डालें।", en: "Avoid floodwater when depth and road conditions are unknown." },
    1105: { hi: "मोड़ से पहले धीमे होने पर गाड़ी पर नियंत्रण बेहतर रहता है।", en: "Slowing before a bend helps maintain control." },
    1106: { hi: "फिसलने पर अचानक ब्रेक या स्टीयरिंग से नियंत्रण और बिगड़ सकता है।", en: "Sudden braking or steering can worsen a skid." },
    1107: { hi: "बच्चे अचानक सड़क पर आ सकते हैं, इसलिए धीमे चलें।", en: "Children may step into the road unexpectedly." },
    1108: { hi: "आगे का रास्ता साफ न दिखे तो ओवरटेक करना खतरनाक है।", en: "Never overtake when you cannot see the road ahead clearly." },
    1: { hi: "टिमटिमाती लाल बत्ती पर पहले पूरी तरह रुकें और रास्ता साफ हो तभी आगे बढ़ें।", en: "A flashing red signal requires a complete stop before proceeding safely." },
    2: { hi: "स्कूल के पास बच्चे अचानक सड़क पर आ सकते हैं, इसलिए धीमे चलें।", en: "Children may enter the road unexpectedly near schools; slow down." },
    3: { hi: "50cc तक की बिना गियर वाली मोटरसाइकिल के लिए 16 साल की आयु वाला विशेष प्रावधान है; बाकी शर्तें भी लागू होती हैं।", en: "A special age provision applies to gearless motorcycles up to 50cc, subject to applicable conditions." },
    4: { hi: "लर्नर लाइसेंस आम तौर पर जारी होने की तारीख से छह महीने के लिए मान्य होता है।", en: "A learner's licence is generally valid for six months." },
    5: { hi: "आगे वाली गाड़ी से समय के हिसाब से दूरी रखें; बारिश में और ज्यादा दूरी चाहिए।", en: "Leave a time-based following gap and increase it in poor conditions." },
    6: { hi: "बाईं ओर से ओवरटेक सामान्य नियम नहीं है; कुछ खास स्थितियों में ही अनुमति होती है।", en: "Overtaking on the left is an exception, not the general rule." },
    7: { hi: "एम्बुलेंस और फायर ब्रिगेड को बिना खतरा पैदा किए रास्ता दें।", en: "Safely yield to emergency vehicles." },
    8: { hi: "शराब पीकर ड्राइविंग गंभीर अपराध है; जुर्माना और सजा मौजूदा कानून के अनुसार तय होते हैं।", en: "Drink-driving is a serious offence; current statutory penalties apply." },
    9: { hi: "लगातार ठोस सड़क रेखा पार करने या ओवरटेक करने पर रोक दर्शाती है; स्थानीय सड़क चिन्ह देखें।", en: "Solid centre lines restrict crossing or overtaking; follow the posted markings." },
    10: { hi: "लर्नर वाहन पर L का निशान और लागू सुपरविजन नियमों का पालन जरूरी है।", en: "Learner drivers must display L markings and follow applicable supervision rules." },
    11: { hi: "लर्नर वाहन पर L निशान आगे और पीछे दिखाई देना चाहिए।", en: "L markings should be visible at the front and rear." },
    12: { hi: "कोहरे में हाई बीम की रोशनी वापस परावर्तित होकर दृश्यता घटा सकती है।", en: "High beams can reflect from fog and worsen visibility." },
    13: { hi: "खराब गाड़ी को सुरक्षित किनारे लगाएं और दूसरे वाहनों को चेतावनी दें।", en: "Move a disabled vehicle safely aside and warn approaching traffic." },
    14: { hi: "बिना सिग्नल वाले चौराहे पर सावधानी से रास्ता दें; संकेत और प्राथमिकता नियम देखें।", en: "At uncontrolled junctions, follow right-of-way rules and proceed cautiously." },
    15: { hi: "दोपहिया वाहन पर चालक के अलावा सामान्यतः सिर्फ एक व्यक्ति बैठ सकता है।", en: "A two-wheeler generally carries only one pillion passenger." },
    16: { hi: "दोपहिया वाहन पर चालक और पीछे बैठने वाले की हेलमेट सुरक्षा जरूरी है; लागू छूट देखें।", en: "Helmets protect riders and pillion passengers; check applicable exemptions." },
    17: { hi: "राउंडअबाउट में पहले से चल रहे ट्रैफिक को रास्ता दें।", en: "Yield to vehicles already circulating in a roundabout." },
    18: { hi: "टिमटिमाती पीली बत्ती पर धीमे होकर सावधानी से आगे बढ़ें।", en: "A flashing amber signal means proceed carefully at reduced speed." },
    19: { hi: "लेन बदलने से पहले शीशे, ब्लाइंड स्पॉट और इंडिकेटर चेक करें।", en: "Check mirrors and blind spots, then signal before changing lanes." },
    20: { hi: "फोन का इस्तेमाल ध्यान भटकाता है और ड्राइविंग के दौरान कानूनी कार्रवाई हो सकती है।", en: "Using a phone distracts drivers and can lead to legal penalties." },
    21: { hi: "जहाँ हॉर्न बजाना मना है, वहाँ साइन बोर्ड और स्थानीय नियम मानें।", en: "Respect no-honking signs and applicable local restrictions." },
    22: { hi: "लर्नर लाइसेंस मिलने के कम से कम 30 दिन बाद स्थायी ड्राइविंग टेस्ट के लिए आवेदन किया जा सकता है।", en: "A permanent driving licence test may generally be taken at least 30 days after learner licence issue." },
    24: { hi: "ढलान पर लो गियर से इंजन ब्रेकिंग मिलती है और गाड़ी पर नियंत्रण बेहतर रहता है।", en: "A lower gear provides engine braking and better downhill control." },
    26: { hi: "टायर और सड़क के बीच पानी की परत बनने से पकड़ कम होने को एक्वाप्लेनिंग कहते हैं।", en: "Aquaplaning occurs when water separates tyres from the road, reducing grip." },
    27: { hi: "जेब्रा क्रॉसिंग पर पैदल चलने वालों को सुरक्षित रास्ता देना जरूरी है।", en: "Yield safely to pedestrians at a zebra crossing." },
    28: { hi: "दो लगातार ठोस सेंटर लाइन आम तौर पर लाइन पार करने और ओवरटेक करने पर रोक दिखाती हैं।", en: "Double solid centre lines generally prohibit crossing or overtaking." },
    29: { hi: "ABS तेज ब्रेकिंग के दौरान पहियों को लॉक होने से रोकने में मदद करता है।", en: "ABS helps prevent wheel lock-up under heavy braking." },
    31: { hi: "हाथ के इशारे दूसरे सड़क उपयोगकर्ताओं को चालक की दिशा बदलने की मंशा बताते हैं।", en: "Hand signals communicate the driver's intended movement." },
    32: { hi: "चढ़ाई पर कर्ब के साथ पार्किंग में पहियों की दिशा गाड़ी के लुढ़कने का जोखिम घटाती है।", en: "Wheel positioning when parked uphill can reduce the risk of rolling." },
    33: { hi: "गुड समैरिटन सुरक्षा का उद्देश्य हादसे में मदद करने वालों को अनावश्यक परेशानी से बचाना है।", en: "Good Samaritan protections encourage people to help crash victims." },
    35: { hi: "टायर फटने पर स्टीयरिंग संभालें, एक्सीलरेटर छोड़ें और अचानक ब्रेक न लगाएं।", en: "After a tyre blowout, steer steadily, ease off the accelerator and avoid sudden braking." },
    37: { hi: "ब्लाइंड स्पॉट वह हिस्सा है जो सामान्य शीशों में साफ नहीं दिखता।", en: "A blind spot is an area not readily visible in normal mirrors." },
    39: { hi: "टूटी सेंटर लाइन को पार करना तभी सुरक्षित है जब सड़क साफ हो और ओवरटेक की अनुमति हो।", en: "Cross a broken centre line only when permitted and safe." },
    40: { hi: "आपातकालीन वाहन को रास्ता देते समय आसपास के ट्रैफिक को भी ध्यान में रखें।", en: "Yield safely to emergency vehicles while watching surrounding traffic." },
    41: { hi: "बिना गेट वाली रेलवे क्रॉसिंग पर रुककर दोनों तरफ देखें और ट्रेन न आने पर ही पार करें।", en: "At an ungated rail crossing, stop, check both ways and cross only when safe." },
    43: { hi: "न्यूट्रल में ढलान उतरने से इंजन ब्रेकिंग खत्म होती है और नियंत्रण घटता है।", en: "Coasting downhill in neutral removes engine braking and reduces control." },
    45: { hi: "यू-टर्न से पहले सही दिशा का इंडिकेटर दें और पीछे-आगे का ट्रैफिक देखें।", en: "Signal your intended turn and check traffic before making a U-turn." },
    46: { hi: "तेज बारिश में स्पीड कम करें, लाइट सही इस्तेमाल करें और आगे वाली गाड़ी से दूरी बढ़ाएं।", en: "In heavy rain, slow down, use appropriate lights and increase following distance." },
    47: { hi: "पहाड़ी सड़क पर प्राथमिकता का नियम और सामने वाली गाड़ी की स्थिति देखकर सुरक्षित रास्ता दें।", en: "On narrow hill roads, follow priority rules and yield safely." },
    49: { hi: "जेब्रा क्रॉसिंग के पास ज़िगज़ैग लाइनें सावधानी और पैदल यात्रियों पर ध्यान देने की चेतावनी हैं।", en: "Zigzag markings near crossings warn drivers to protect pedestrians." },
    50: { hi: "लाल ट्रैफिक सिग्नल का मतलब स्टॉप लाइन से पहले रुकना है।", en: "A steady red signal means stop before the stop line." },
    51: { hi: "ट्रैफिक पुलिस के निर्देश सिग्नल से अलग हों तो पुलिस के निर्देश मानें।", en: "Follow a traffic officer's direction even when it differs from the signal." },
    52: { hi: "रियर-व्यू मिरर पीछे के ट्रैफिक को देखने में मदद करते हैं; ब्लाइंड स्पॉट भी जांचें।", en: "Rear-view mirrors help monitor traffic behind; also check blind spots." },
    54: { hi: "टेलगेटिंग यानी आगे वाली गाड़ी के बहुत करीब चलना, जिससे रुकने का समय कम मिलता है।", en: "Tailgating means following too closely, leaving too little stopping distance." },
    55: { hi: "स्टीयरिंग पर दोनों हाथ आरामदायक और नियंत्रित स्थिति में रखें।", en: "Keep both hands in a comfortable position that maintains steering control." },
    57: { hi: "हैज़र्ड लाइटें खतरे या वाहन की खराबी की चेतावनी के लिए हैं, सामान्य ड्राइविंग में इंडिकेटर की जगह नहीं।", en: "Hazard lights warn of a hazard or breakdown, not a substitute for turn signals." },
    58: { hi: "सामान्य LMV ड्राइविंग लाइसेंस की न्यूनतम उम्र 18 साल है।", en: "The minimum age for a standard light motor vehicle driving licence is 18." },
    59: { hi: "रुकी बस के पास पैदल यात्री अचानक निकल सकते हैं; स्पीड कम रखें।", en: "Pedestrians may emerge around a stopped bus, so slow down." },
    60: { hi: "येलो बॉक्स जंक्शन में तभी जाएं जब आगे निकलने की जगह साफ हो।", en: "Enter a yellow-box junction only when your exit is clear." },
    23: { hi: "फायर हाइड्रेंट के पास पार्किंग से फायर ब्रिगेड का रास्ता और पानी की पहुंच रुक सकती है। स्थानीय पार्किंग नियम देखें।", en: "Parking near a fire hydrant can obstruct emergency access; follow local restrictions." },
    25: { hi: "ड्राइविंग के लिए कौन से दस्तावेज जरूरी हैं, यह वाहन और उपयोग के हिसाब से बदल सकता है।", en: "Required documents depend on vehicle category and use; verify current rules." },
    30: { hi: "PUC सर्टिफिकेट की वैधता वाहन की श्रेणी और लागू उत्सर्जन नियमों पर निर्भर करती है।", en: "PUC validity depends on the vehicle and applicable emissions rules." },
    34: { hi: "चोट वाले हादसे में घायल को मदद देना और कानूनी रिपोर्टिंग जिम्मेदारियां निभाना जरूरी है।", en: "After an injury crash, assist victims and comply with applicable reporting duties." },
    36: { hi: "हाईवे की स्पीड लिमिट सड़क की श्रेणी, संकेत और लागू सरकारी अधिसूचना पर निर्भर करती है।", en: "Speed limits depend on road classification, signs and current notifications." },
    38: { hi: "मालवाहक वाहन में यात्रियों को ले जाने पर लागू वाहन और परमिट नियम देखें।", en: "Passenger carriage in goods vehicles is subject to vehicle and permit rules." },
    42: { hi: "वाहन की आगे की लाइटों का रंग और प्रकार मोटर वाहन नियमों के मुताबिक होना चाहिए।", en: "Front lamp colour and type must comply with applicable motor vehicle rules." },
    44: { hi: "थर्ड-पार्टी बीमा जरूरी है; बिना बीमा ड्राइविंग की सजा और जुर्माना मौजूदा कानून के अनुसार तय होता है।", en: "Third-party insurance is required; current law determines penalties." },
    48: { hi: "विंडस्क्रीन और पीछे के शीशे की दृश्यता के लिए लागू VLT नियम मानें; अनधिकृत फिल्म से बचें।", en: "Follow applicable glass light-transmission rules; avoid unauthorized tint film." },
    53: { hi: "तंग पुल पर पहले सुरक्षा देखें; रास्ता देने का फैसला वाहन की स्थिति और उपलब्ध जगह के हिसाब से करें।", en: "On a narrow bridge, prioritize safety and yield based on available space." },
    56: { hi: "सार्वजनिक सड़क पर बिना अनुमति रेसिंग खतरनाक है और कानूनी कार्रवाई हो सकती है।", en: "Unauthorized racing on public roads is dangerous and punishable." }
  };

  // Traffic Sign Mode States
  const [signTestState, setSignTestState] = useState<'start' | 'in_progress' | 'result'>('start');
  const [signQuestions, setSignQuestions] = useState<SignQuestion[]>([]);
  const [signCurrentIndex, setSignCurrentIndex] = useState<number>(0);
  const [signUserAnswers, setSignUserAnswers] = useState<Record<number, number>>({});
  const [signSelectedOption, setSignSelectedOption] = useState<number | null>(null);

  // Timer Ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic for main test
  useEffect(() => {
    if (testState === 'in_progress' && timerEnabled) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            finishMainTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testState, timerEnabled]);

  // Format seconds into MM:SS
  const formatTimer = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Start Main Test
  const startMainTest = () => {
    const selected = shuffleArray(QUESTION_BANK).slice(0, 15).map(randomizeAnswerPositions);
    setQuestions(selected);
    setCurrentIndex(0);
    setUserAnswers({});
    setSelectedOption(null);
    setTimeLeft(900);
    setTestState('in_progress');
    onShowToast(lang === 'en' ? 'Mock Test Started! 🚦 Good Luck!' : 'मॉक टेस्ट शुरू! 🚦 शुभकामनाएं!');
  };

  // Start a focused practice session containing only missed questions.
  const retryWrongAnswers = () => {
    const missed = questions.filter((q, idx) => userAnswers[idx] !== q.correctIndex);
    if (!missed.length) return;
    setQuestions(shuffleArray(missed).map(randomizeAnswerPositions));
    setCurrentIndex(0);
    setUserAnswers({});
    setSelectedOption(null);
    setTimeLeft(900);
    setTestState('in_progress');
  };

  // Option select main test
  const handleOptionSelect = (optionIdx: number) => {
    setSelectedOption(optionIdx);
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: optionIdx }));
  };

  // Next Question or Finish
  const handleNextQuestion = () => {
    if (selectedOption === null && userAnswers[currentIndex] === undefined) {
      onShowToast(lang === 'en' ? 'Please select an answer to continue!' : 'आगे बढ़ने के लिए उत्तर चुनें!');
      return;
    }

    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedOption(userAnswers[nextIdx] !== undefined ? userAnswers[nextIdx] : null);
    } else {
      finishMainTest();
    }
  };

  const finishMainTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const record = {
      date: new Date().toLocaleDateString(),
      correct: questions.filter((q, idx) => userAnswers[idx] === q.correctIndex).length,
      total: questions.length
    };
    setScoreHistory(prev => {
      const updated = [record, ...prev].slice(0, 20);
      try { localStorage.setItem('zubware-ll-score-history-v1', JSON.stringify(updated)); } catch { /* Storage may be unavailable */ }
      return updated;
    });
    setTestState('result');
    onShowToast(lang === 'en' ? 'Test Completed! Viewing Results.' : 'टेस्ट पूरा हुआ! परिणाम देखें।');
  };

  // Calculate Main Test Score
  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  // Start Sign Test
  const startSignTest = () => {
    const selected = shuffleArray(SIGN_QUESTION_BANK).slice(0, 10).map(randomizeAnswerPositions);
    setSignQuestions(selected);
    setSignCurrentIndex(0);
    setSignUserAnswers({});
    setSignSelectedOption(null);
    setSignTestState('in_progress');
    onShowToast(lang === 'en' ? 'Traffic Signs Test Started!' : 'ट्रैफिक संकेत टेस्ट शुरू!');
  };

  const handleSignOptionSelect = (optionIdx: number) => {
    setSignSelectedOption(optionIdx);
    setSignUserAnswers((prev) => ({ ...prev, [signCurrentIndex]: optionIdx }));
  };

  const handleSignNextQuestion = () => {
    if (signSelectedOption === null && signUserAnswers[signCurrentIndex] === undefined) {
      onShowToast(lang === 'en' ? 'Please select an answer!' : 'कृपया उत्तर का चयन करें!');
      return;
    }

    if (signCurrentIndex < signQuestions.length - 1) {
      const nextIdx = signCurrentIndex + 1;
      setSignCurrentIndex(nextIdx);
      setSignSelectedOption(signUserAnswers[nextIdx] !== undefined ? signUserAnswers[nextIdx] : null);
    } else {
      setSignTestState('result');
      onShowToast(lang === 'en' ? 'Signs Practice Finished!' : 'संकेत टेस्ट समाप्त!');
    }
  };

  const calculateSignScore = () => {
    let score = 0;
    signQuestions.forEach((q, idx) => {
      if (signUserAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  // Render UI strings
  const text = {
    title: lang === 'en' ? 'Learning Licence Mock Test' : 'लर्निंग लाइसेंस मॉक टेस्ट',
    subtitle: lang === 'en'
      ? 'Practice Indian RTO traffic rules, road signs & driving safety questions'
      : 'भारतीय RTO ट्रैफिक नियमों, रोड साइन और ड्राइविंग सेफ्टी प्रश्नों का अभ्यास करें',
    tabTest: lang === 'en' ? '🚦 Mock Test (15 Questions)' : '🚦 मॉक टेस्ट (15 प्रश्न)',
    tabSigns: lang === 'en' ? '🛑 Traffic Signs Practice' : '🛑 ट्रैफिक संकेत प्रैक्टिस',
    timerLabel: lang === 'en' ? 'Optional 15-Minute Timer:' : 'वैकल्पिक 15-मिनट टाइमर:',
    timerOn: lang === 'en' ? 'Timer ON' : 'टाइमर चालू',
    timerOff: lang === 'en' ? 'Timer OFF' : 'टाइमर बंद',
    startTestBtn: lang === 'en' ? 'START MOCK TEST' : 'मॉक टेस्ट शुरू करें',
    startSignBtn: lang === 'en' ? 'START SIGNS PRACTICE' : 'संकेत टेस्ट शुरू करें',
    testRulesHeading: lang === 'en' ? 'Test Rules & Information' : 'टेस्ट नियम और जानकारी',
    rule1: lang === 'en' ? '15 randomly selected questions per test' : 'प्रति टेस्ट 15 यादृच्छिक रूप से चुने गए प्रश्न',
    rule2: lang === 'en' ? '4 options per question with 1 correct answer' : '4 विकल्पों में से 1 सही उत्तर',
    rule3: lang === 'en' ? '9 correct answers required to PASS (60% marks)' : 'पास होने के लिए 9 सही उत्तर (60% अंक) आवश्यक',
    rule4: lang === 'en' ? 'Unlimited retries with fresh randomized questions' : 'नए यादृच्छिक प्रश्नों के साथ असीमित पुनः प्रयास',
    rule5: lang === 'en' ? 'Instant result review with full answer breakdown' : 'उत्तर समीक्षा के साथ त्वरित परिणाम',
    questionOf: (curr: number, total: number) =>
      lang === 'en' ? `Question ${curr} of ${total}` : `प्रश्न ${curr} में से ${total}`,
    nextBtn: lang === 'en' ? 'NEXT QUESTION' : 'अगला प्रश्न',
    finishBtn: lang === 'en' ? 'FINISH TEST' : 'टेस्ट समाप्त करें',
    passTitle: lang === 'en' ? 'PRACTICE TARGET REACHED' : 'प्रैक्टिस का लक्ष्य पूरा हुआ',
    failTitle: lang === 'en' ? 'KEEP PRACTICING' : 'थोड़ी और प्रैक्टिस करें',
    passMsg: lang === 'en'
      ? 'You reached the Zubware practice target of 60%. This is not an official RTO result.'
      : 'आपने Zubware का 60% प्रैक्टिस लक्ष्य पूरा किया है। यह सरकारी RTO का रिजल्ट नहीं है।',
    failMsg: lang === 'en'
      ? 'Review your answers and try again to reach the Zubware 60% practice target.'
      : 'गलत जवाब देखें और Zubware का 60% प्रैक्टिस लक्ष्य पूरा करने के लिए दोबारा कोशिश करें।',
    retryBtn: lang === 'en' ? 'RETRY FRESH TEST' : 'नया टेस्ट शुरू करें',
    reviewHeading: lang === 'en' ? 'Full Test Answer Review' : 'पूरे टेस्ट उत्तर की समीक्षा',
    yourAns: lang === 'en' ? 'Your Answer:' : 'आपका उत्तर:',
    correctAns: lang === 'en' ? 'Correct Answer:' : 'सही उत्तर:',
    correctBadge: lang === 'en' ? 'Correct' : 'सही',
    wrongBadge: lang === 'en' ? 'Incorrect' : 'गलत',
    disclaimerEn:
      'This is an independent practice tool, not a government examination. The 15-question format and 60% target are Zubware practice settings, not official pass criteria. Verify current state-specific requirements with Sarathi and your RTO.',
    disclaimerHi:
      'यह सरकारी परीक्षा नहीं, Zubware का प्रैक्टिस टूल है। 15 सवाल और 60% लक्ष्य सिर्फ इस प्रैक्टिस के लिए हैं, सरकारी पासिंग नियम नहीं। अपने राज्य के असली नियम Sarathi और RTO से चेक करें।'
  };

  const mainScore = calculateScore();
  const signScore = calculateSignScore();

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Top Header & Language Toggle Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-5 rounded-3xl border border-indigo-500/20 bg-indigo-50/40 dark:bg-slate-900/40">
        <div>
          <div className="flex items-center gap-2">
            
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {text.title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {text.subtitle}
          </p>
        </div>

        {/* Bilingual Language Selector */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
          <button
            onClick={() => setLang('en')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              lang === 'en'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              lang === 'hi'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-900 p-1.5 border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => {
            setActiveTab('test');
            setTestState('start');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'test'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>{text.tabTest}</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('signs');
            setSignTestState('start');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'signs'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>{text.tabSigns}</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* MODE 1: MOCK TEST */}
      {/* ========================================================= */}
      {activeTab === 'test' && (
        <>
          {/* 1A. START SCREEN */}
          {testState === 'start' && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-200 dark:border-slate-800 text-center">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-4xl shadow-inner">
                🚦
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {lang === 'en' ? 'Ready to test your driving rules knowledge?' : 'क्या आप ड्राइविंग नियमों का टेस्ट देने के लिए तैयार हैं?'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                  {lang === 'en'
                    ? '15 randomized practice questions based on Indian road traffic regulations, signals & safety guidelines.'
                    : 'भारतीय सड़क यातायात नियमों, संकेतों और सुरक्षा दिशानिर्देशों पर आधारित 15 यादृच्छिक अभ्यास प्रश्न।'}
                </p>
              </div>

              {/* Test Rules List */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left space-y-2.5 max-w-lg mx-auto">
                <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>{text.testRulesHeading}</span>
                </h4>
                <ul className="text-xs sm:text-sm space-y-2 text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span> {text.rule1}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span> {text.rule2}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span> {text.rule3}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span> {text.rule4}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span> {text.rule5}
                  </li>
                </ul>
              </div>

              {/* Timer Toggle Controls */}
              <div className="flex items-center justify-center gap-3 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 max-w-sm mx-auto">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {text.timerLabel}
                </span>
                <button
                  onClick={() => setTimerEnabled(!timerEnabled)}
                  className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all ${
                    timerEnabled
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                  }`}
                >
                  {timerEnabled ? text.timerOn : text.timerOff}
                </button>
              </div>

              {/* Start Button */}
              <button
                onClick={startMainTest}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 mx-auto active:scale-95"
              >
                <span>{text.startTestBtn}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* 1B. IN PROGRESS QUESTION SCREEN */}
          {testState === 'in_progress' && questions.length > 0 && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-200 dark:border-slate-800">
              {/* Question Header & Timer */}
              <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {text.questionOf(currentIndex + 1, 15)}
                  </span>
                  <div className="w-48 sm:w-64 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-300"
                      style={{ width: `${((currentIndex + 1) / 15) * 100}%` }}
                    />
                  </div>
                </div>

                {timerEnabled && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 text-xs font-black font-mono">
                    <Clock className="w-4 h-4 animate-pulse" />
                    <span>{formatTimer(timeLeft)}</span>
                  </div>
                )}
              </div>

              {/* Question Statement */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {lang === 'en' ? questions[currentIndex].en : questions[currentIndex].hi}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3">
                {(lang === 'en' ? questions[currentIndex].options_en : questions[currentIndex].options_hi).map(
                  (opt, oIdx) => {
                    const isSelected = selectedOption === oIdx;
                    const optionLetters = ['A', 'B', 'C', 'D'];
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleOptionSelect(oIdx)}
                        className={`p-4 rounded-2xl border text-left flex items-center gap-3.5 transition-all text-xs sm:text-sm font-semibold active:scale-[0.99] ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-400'
                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900'
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-white text-indigo-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {optionLetters[oIdx]}
                        </span>
                        <span className="flex-1 leading-relaxed">{opt}</span>
                      </button>
                    );
                  }
                )}
              </div>

              {/* Bottom Action */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextQuestion}
                  disabled={selectedOption === null}
                  className={`px-8 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md ${
                    selectedOption !== null
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <span>{currentIndex < 14 ? text.nextBtn : text.finishBtn}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 1C. RESULT SCREEN */}
          {testState === 'result' && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-8 border border-slate-200 dark:border-slate-800 text-center">
              {/* Pass / Fail Header */}
              <div
                className={`p-6 rounded-3xl border space-y-3 ${
                  mainScore / questions.length >= 0.6
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-500/30 text-rose-900 dark:text-rose-200'
                }`}
              >
                <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                  {mainScore / questions.length >= 0.6 ? '🎉' : '❌'}
                </div>
                <h3 className="text-2xl font-black tracking-tight">
                  {mainScore / questions.length >= 0.6 ? text.passTitle : text.failTitle}
                </h3>
                <p className="text-xs sm:text-sm opacity-90 max-w-md mx-auto">
                  {mainScore / questions.length >= 0.6 ? text.passMsg : text.failMsg}
                </p>

                {/* Score Summary Badge */}
                <div className="pt-2">
                  <span className="inline-block px-6 py-2.5 rounded-2xl bg-white dark:bg-slate-900 font-black text-xl sm:text-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    {lang === 'en' ? `Score: ${mainScore} / ${questions.length}` : `अंक: ${mainScore} / ${questions.length}`}
                    <span className="text-xs opacity-60 ml-2 font-semibold">
                      ({Math.round((mainScore / questions.length) * 100)}%)
                    </span>
                  </span>
                </div>
              </div>

              {/* Retry Button */}
              <button
                onClick={startMainTest}
                className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2 mx-auto active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{text.retryBtn}</span>
              </button>

              {questions.some((q, idx) => userAnswers[idx] !== q.correctIndex) && (
                <button onClick={retryWrongAnswers} className="px-7 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-sm">
                  {lang === 'en' ? 'Practice Wrong Answers Again' : 'गलत सवालों की दोबारा प्रैक्टिस करें'}
                </button>
              )}
              {scoreHistory.length > 0 && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-left space-y-3">
                  <h4 className="font-bold text-sm">{lang === 'en' ? 'Your Recent Test Scores' : 'आपके पिछले टेस्ट के स्कोर'}</h4>
                  <div className="space-y-2">
                    {scoreHistory.slice(0, 5).map((entry, idx) => (
                      <div key={idx} className="flex justify-between gap-3 text-xs sm:text-sm">
                        <span>{entry.date}</span>
                        <span className="font-semibold">{entry.correct}/{entry.total} ({Math.round(entry.correct / Math.max(1, entry.total) * 100)}%)</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { setScoreHistory([]); try { localStorage.removeItem('zubware-ll-score-history-v1'); } catch {} }} className="text-xs underline text-slate-500">
                    {lang === 'en' ? 'Clear score history' : 'स्कोर हिस्ट्री मिटाएं'}
                  </button>
                </div>
              )}
              {/* Answer Review Section */}
              <div className="space-y-4 text-left pt-4 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>{text.reviewHeading}</span>
                </h4>

                <div className="space-y-4">
                  {questions.map((q, qIdx) => {
                    const userSelected = userAnswers[qIdx];
                    const isCorrect = userSelected === q.correctIndex;
                    const optionsList = lang === 'en' ? q.options_en : q.options_hi;

                    return (
                      <div
                        key={qIdx}
                        className={`p-4 rounded-2xl border space-y-2 text-xs sm:text-sm ${
                          isCorrect
                            ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800/40'
                            : 'bg-rose-50/30 dark:bg-rose-950/10 border-rose-200 dark:border-rose-800/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-extrabold text-slate-900 dark:text-white leading-snug">
                            {qIdx + 1}. {lang === 'en' ? q.en : q.hi}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {isCorrect ? `✓ ${text.correctBadge}` : `✕ ${text.wrongBadge}`}
                          </span>
                        </div>

                        <div className="space-y-1 font-medium pt-1">
                          <div className={`flex items-start gap-1.5 ${isCorrect ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400'}`}>
                            <span className="font-bold opacity-75">{text.yourAns}</span>
                            <span>{userSelected !== undefined ? optionsList[userSelected] : (lang === 'en' ? 'Unanswered' : 'उत्तर नहीं दिया')}</span>
                          </div>
                          {questionExplanations[q.id] && (
                            <p className="text-xs text-slate-600 dark:text-slate-300 pt-2">
                              <strong>{lang === 'en' ? 'Why: ' : 'क्यों: '}</strong>
                              {questionExplanations[q.id][lang]}
                            </p>
                          )}
                          {!isCorrect && (
                            <div className="flex items-start gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                              <span className="font-bold opacity-75">{text.correctAns}</span>
                              <span>{optionsList[q.correctIndex]}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================= */}
      {/* MODE 2: TRAFFIC SIGNS PRACTICE */}
      {/* ========================================================= */}
      {activeTab === 'signs' && (
        <>
          {/* 2A. SIGN START SCREEN */}
          {signTestState === 'start' && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-200 dark:border-slate-800 text-center">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-4xl shadow-inner">
                🛑
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {lang === 'en' ? 'Traffic Signs Identification Practice' : 'ट्रैफिक संकेत पहचान अभ्यास'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                  {lang === 'en'
                    ? 'Practice 10 mandatory, cautionary and informatory Indian road signs with instant visual feedback.'
                    : 'त्वरित विजुअल फीडबैक के साथ 10 अनिवार्य, चेतावनी और सूचनात्मक भारतीय रोड संकेतों का अभ्यास करें।'}
                </p>
              </div>

              {/* Start Button */}
              <button
                onClick={startSignTest}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 mx-auto active:scale-95"
              >
                <span>{text.startSignBtn}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* 2B. SIGN IN PROGRESS */}
          {signTestState === 'in_progress' && signQuestions.length > 0 && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-200 dark:border-slate-800">
              {/* Question Header */}
              <div className="space-y-1 pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {text.questionOf(signCurrentIndex + 1, signQuestions.length)}
                </span>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${((signCurrentIndex + 1) / signQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Sign Visual Illustration */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-4">
                <RenderRoadSign signType={signQuestions[signCurrentIndex].signType} />
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white text-center">
                  {lang === 'en' ? signQuestions[signCurrentIndex].en : signQuestions[signCurrentIndex].hi}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3">
                {(lang === 'en'
                  ? signQuestions[signCurrentIndex].options_en
                  : signQuestions[signCurrentIndex].options_hi
                ).map((opt, oIdx) => {
                  const isSelected = signSelectedOption === oIdx;
                  const optionLetters = ['A', 'B', 'C', 'D'];
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSignOptionSelect(oIdx)}
                      className={`p-4 rounded-2xl border text-left flex items-center gap-3.5 transition-all text-xs sm:text-sm font-semibold active:scale-[0.99] ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-400'
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900'
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-white text-indigo-600'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {optionLetters[oIdx]}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSignNextQuestion}
                  disabled={signSelectedOption === null}
                  className={`px-8 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md ${
                    signSelectedOption !== null
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <span>
                    {signCurrentIndex < signQuestions.length - 1 ? text.nextBtn : text.finishBtn}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 2C. SIGN RESULT SCREEN */}
          {signTestState === 'result' && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-8 border border-slate-200 dark:border-slate-800 text-center">
              <div className="p-6 rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-500/30 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                  🏆
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {lang === 'en' ? 'Traffic Signs Practice Completed!' : 'ट्रैफिक संकेत अभ्यास पूरा हुआ!'}
                </h3>
                <div>
                  <span className="inline-block px-6 py-2.5 rounded-2xl bg-white dark:bg-slate-900 font-black text-xl sm:text-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400">
                    {lang === 'en' ? `Score: ${signScore} / 10` : `अंक: ${signScore} / 10`}
                  </span>
                </div>
              </div>

              {/* Retry Button */}
              <button
                onClick={startSignTest}
                className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2 mx-auto active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{text.retryBtn}</span>
              </button>

              {/* Sign Answer Review */}
              <div className="space-y-4 text-left pt-4 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>{text.reviewHeading}</span>
                </h4>

                <div className="space-y-4">
                  {signQuestions.map((sq, qIdx) => {
                    const userSelected = signUserAnswers[qIdx];
                    const isCorrect = userSelected === sq.correctIndex;
                    const optionsList = lang === 'en' ? sq.options_en : sq.options_hi;

                    return (
                      <div
                        key={qIdx}
                        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs sm:text-sm ${
                          isCorrect
                            ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800/40'
                            : 'bg-rose-50/30 dark:bg-rose-950/10 border-rose-200 dark:border-rose-800/40'
                        }`}
                      >
                        <div className="shrink-0 scale-75 -my-2">
                          <RenderRoadSign signType={sq.signType} />
                        </div>

                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-extrabold text-slate-900 dark:text-white">
                              {qIdx + 1}. {lang === 'en' ? sq.en : sq.hi}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                                isCorrect
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              }`}
                            >
                              {isCorrect ? `✓ ${text.correctBadge}` : `✕ ${text.wrongBadge}`}
                            </span>
                          </div>

                          <div className="space-y-1 font-medium">
                            <div className={`flex items-start gap-1.5 ${isCorrect ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400'}`}>
                              <span className="font-bold opacity-75">{text.yourAns}</span>
                              <span>{userSelected !== undefined ? optionsList[userSelected] : (lang === 'en' ? 'Unanswered' : 'उत्तर नहीं दिया')}</span>
                            </div>
                            {!isCorrect && (
                              <div className="flex items-start gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                                <span className="font-bold opacity-75">{text.correctAns}</span>
                                <span>{optionsList[sq.correctIndex]}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900 p-4 space-y-2 text-sm">
        <h3 className="font-bold text-slate-900 dark:text-white">
          {lang === 'hi' ? 'ऑफिशियल RTO टेस्ट की तैयारी' : 'Official RTO test preparation'}
        </h3>
        <p className="text-slate-600 dark:text-slate-300">
          {lang === 'hi'
            ? 'यह Zubware का प्रैक्टिस टेस्ट है। असली टेस्ट के सवाल, समय और पासिंग मार्क्स आपके राज्य में अलग हो सकते हैं।'
            : 'This is Zubware practice, not an official exam. Questions, timing and pass criteria can vary by state.'}
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="https://sarathi.parivahan.gov.in/" target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-600 dark:text-indigo-400 underline">
            {lang === 'hi' ? 'सरकारी Sarathi पोर्टल' : 'Official Sarathi portal'}
          </a>
          <a href="https://parivahan.gov.in/parivahan/sites/default/files/DownloadForm/STALL_QB_ENGLISH_NEW.pdf" target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-600 dark:text-indigo-400 underline">
            {lang === 'hi' ? 'सरकारी सैंपल प्रश्न PDF' : 'Official sample question bank'}
          </a>
        </div>
      </div>

      {/* Bottom Legal / Accuracy Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 text-[11px] sm:text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed space-y-1">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{lang === 'en' ? 'Disclaimer' : 'अस्वीकरण'}</span>
        </div>
        <p>{lang === 'en' ? text.disclaimerEn : text.disclaimerHi}</p>
      </div>
    </div>
  );
}
