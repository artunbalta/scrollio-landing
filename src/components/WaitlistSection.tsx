"use client";

import { useState, FormEvent } from "react";
import { supabase } from "@/lib/supabase";

interface FormData {
  name: string;
  email: string;
  role: string;
  message: string;
}

export default function WaitlistSection() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    role: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('waitlist')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            message: formData.message
          }
        ]);

      if (supabaseError) {
        throw supabaseError;
      }

      // Send welcome email
      try {
        await fetch("/api/send-welcome-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            toEmail: formData.email,
            name: formData.name,
            role: formData.role,
          }),
        });
        console.log("Welcome email sent successfully");
      } catch (emailErr) {
        console.error("Welcome email sending failed:", emailErr);
        // Don't fail the whole process if email fails
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", role: "", message: "" });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="waitlist" className="py-24 px-6 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                Join the <span className="gradient-text">Scrollio</span> waitlist.
              </h2>
              
              <p className="text-lg text-[#9090a0] leading-relaxed">
                We&apos;re building something special — whether you&apos;re a curious learner, a parent seeking 
                meaningful screen time, or an educator looking for engaging tools. Sign up for early access 
                and be among the first to experience Scrollio.
              </p>
              
              <p className="text-[#9090a0]">
                Limited beta spots available for learners, families, and schools.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Priority access to first beta</h4>
                  <p className="text-sm text-[#9090a0]">Be among the first to try Scrollio</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Direct line to founding team</h4>
                  <p className="text-sm text-[#9090a0]">Share feedback, shape the product</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Influence features and story packs</h4>
                  <p className="text-sm text-[#9090a0]">Help us build what matters most</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="card-glass p-8">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold">Thank you!</h3>
                <p className="text-[#9090a0]">
                  We&apos;ve added you to the waitlist. We&apos;ll be in touch soon with updates on Scrollio.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                >
                  Submit another response
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="input-field"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="input-field"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    I am a... <span className="text-orange-400">*</span>
                  </label>
                  <select
                    id="role"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="input-field cursor-pointer"
                  >
                    <option value="" disabled>Select an option</option>
                    <option value="learner">Learner (Teen / Adult)</option>
                    <option value="parent">Parent</option>
                    <option value="school">School / Educator</option>
                    <option value="partner">Potential Partner</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message <span className="text-[#9090a0]">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what interests you about Scrollio..."
                    className="input-field resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Join the waitlist"}
                </button>

                <p className="text-xs text-center text-[#9090a0]">
                  By signing up, you agree to receive updates about Scrollio. 
                  No spam, unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
