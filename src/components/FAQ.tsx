"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Scrollio?",
    answer: "Scrollio is an AI-powered learning platform with two experiences: Scrollio Core for teens and adults (a TikTok-style micro-learning feed), and Scrollio Kids (where children's drawings become living mentors that guide them through interactive stories)."
  },
  {
    question: "How does Scrollio Kids work?",
    answer: "Children draw any character they imagine, and our AI transforms that drawing into a 3D animated mentor. This mentor then guides them through personalized learning adventures, stories, and activities based on their interests."
  },
  {
    question: "Is Scrollio safe for children?",
    answer: "Absolutely! Scrollio Kids is designed with safety as a priority. All content is age-appropriate, there's no direct messaging or social features, and parents have full visibility into what their children explore through our parent dashboard."
  },
  {
    question: "How does the AI Teacher feature work?",
    answer: "Teachers upload a short video of themselves, provide a topic, and our AI generates a complete lesson script. The AI then lip-syncs the video to match the script, allowing teachers to create unlimited personalized lessons without re-recording."
  },
  {
    question: "When will Scrollio launch?",
    answer: "We're currently in development and accepting early access signups. Join our waitlist to be among the first to experience Scrollio when we launch our beta."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! When we launch, we'll offer a free trial so you can experience Scrollio before committing. Early waitlist members will also receive exclusive benefits and extended trial periods."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-6 bg-dots">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'var(--foreground)', lineHeight: '1.3', overflow: 'visible' }}>
            Frequently Asked{" "}
            <span className="script-gradient">Questions</span>
          </h2>
          <p style={{ color: 'var(--foreground-muted)' }}>
            Find answers to common questions about Scrollio
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="card-light overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold pr-4" style={{ color: 'var(--foreground)' }}>{faq.question}</span>
                <svg
                  className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  style={{ color: 'var(--foreground-muted)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-6 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
