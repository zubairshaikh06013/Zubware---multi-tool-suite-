export interface HowToStep {
  title: string;
  desc: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ToolUpdate {
  howTo: HowToStep[];
  faq: FaqItem[];
}
