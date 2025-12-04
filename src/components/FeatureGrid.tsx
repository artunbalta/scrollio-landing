"use client";

import { useState } from "react";
import TeacherModal from "./TeacherModal";

interface FeatureCardProps {
  id?: string;
  icon: React.ReactNode;
  title: string;
  audience: string;
  description: string;
  highlights: string[];
  gradient: string;
  action?: React.ReactNode;
}

function FeatureCard({ id, icon, title, audience, description, highlights, gradient, action }: FeatureCardProps) {
  return (
    <div id={id} className="card-glass p-8 space-y-6 group h-full scroll-mt-24 flex flex-col">
      <div className={`w-14 h-14 rounded-2xl ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      
      <div>
        <p className="text-sm text-[#9090a0] mb-1">{audience}</p>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      
      <p className="text-[#9090a0] leading-relaxed">{description}</p>
      
      <ul className="space-y-3 flex-1">
        {highlights.map((highlight, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-[#9090a0]">{highlight}</span>
          </li>
        ))}
      </ul>

      {action && (
        <div className="pt-2">
          {action}
        </div>
      )}
    </div>
  );
}

export default function FeatureGrid() {
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  const features: FeatureCardProps[] = [
    {
      id: "for-learners",
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Curiosity-Driven Discovery",
      audience: "For Teens & Adults",
      description: "Scrollio Core transforms idle scrolling into meaningful micro-learning. AI curates your feed based on your interests, goals, and curiosity — from science to psychology, careers to creativity.",
      highlights: [
        "TikTok-style vertical feed of short lessons",
        "AI adapts to your interests and goals",
        "Science, tech, psychology, creativity & more",
        "Learn something new in every scroll"
      ],
      gradient: "bg-gradient-to-br from-indigo-500 to-blue-500"
    },
    {
      id: "for-kids",
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Imagination Comes Alive",
      audience: "For Kids",
      description: "Every child is an artist. Scrollio Kids turns their drawings into living mentors who guide them through magical stories and playful learning adventures.",
      highlights: [
        "Draw any character and watch it come to life",
        "Interactive stories tailored to their interests",
        "Early learning through imagination and play",
        "Safe, engaging, and endlessly creative"
      ],
      gradient: "bg-gradient-to-br from-orange-500 to-amber-500"
    },
    {
      id: "for-families",
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      title: "Screen Time That Matters",
      audience: "For Families",
      description: "Finally, screen time that parents can feel good about. Structured learning moments, safe content, and simple insights into what your kids explore.",
      highlights: [
        "Parent dashboard with activity insights",
        "Age-appropriate, curated content",
        "Structured sessions, not endless scrolling",
        "Build learning habits together"
      ],
      gradient: "bg-gradient-to-br from-orange-400 to-purple-500"
    },
    {
      id: "for-schools",
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "AI Teacher Assistant",
      audience: "For Schools",
      description: "Teachers can create unlimited video lessons using their own face. Just provide a script — AI handles the rest. Perfect for personalized, scalable education.",
      highlights: [
        "Record once, teach infinite topics",
        "AI lip-syncs your video to any script",
        "Create lessons in any language",
        "Perfect for flipped classroom & remote learning"
      ],
      gradient: "bg-gradient-to-br from-emerald-500 to-teal-500"
    }
  ];

  return (
    <section id="features" className="py-24 px-6 bg-grid relative overflow-hidden">
      {/* Background decorative bubbles - lighter */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Designed for{" "}
            <span className="gradient-text">every kind of learner.</span>
          </h2>
          <p className="text-lg text-[#9090a0] leading-relaxed">
            Whether you&apos;re a curious teen, a lifelong learner, a parent seeking meaningful screen time, 
            or a teacher looking for engaging tools — Scrollio adapts to create the perfect learning experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              {...feature}
              action={feature.id === "for-schools" ? (
                <button
                  onClick={() => setIsTeacherModalOpen(true)}
                  className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Try Teacher Mode 🎓
                </button>
              ) : undefined}
            />
          ))}
        </div>
      </div>

      {/* Teacher Modal */}
      <TeacherModal 
        isOpen={isTeacherModalOpen} 
        onClose={() => setIsTeacherModalOpen(false)} 
      />
    </section>
  );
}
