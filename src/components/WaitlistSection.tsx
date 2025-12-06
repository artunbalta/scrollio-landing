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
      {/* Background with subtle gradient */}
      <div 
        className="absolute inset-0 rounded-[3rem] mx-4 lg:mx-8"
        style={{ background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.05), rgba(168, 85, 247, 0.05))' }}
      />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <p className="font-script text-xl mb-4" style={{ color: 'var(--accent)' }}>Ready to Transform?</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--foreground)', lineHeight: '1.3', overflow: 'visible' }}>
            Start Your{" "}
            <span className="script-gradient">Scrollio</span>
            {" "}Journey
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)' }}>
            Be among the first to experience the future of learning with Scrollio&apos;s 
            AI-powered platform. Join our waitlist for early access.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}>
              <svg className="w-6 h-6" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Priority Access</h4>
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Be first to try Scrollio</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }}>
              <svg className="w-6 h-6" style={{ color: 'var(--accent-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Direct Feedback</h4>
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Shape the product</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}>
              <svg className="w-6 h-6" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h4 className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Exclusive Perks</h4>
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Special benefits for early users</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="card-light p-8 max-w-xl mx-auto">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Thank you!</h3>
              <p style={{ color: 'var(--foreground-muted)' }}>
                We&apos;ve added you to the waitlist. We&apos;ll be in touch soon with updates.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm font-medium"
                style={{ color: 'var(--accent)' }}
              >
                Submit another response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-lg text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
                  {error}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    Name <span style={{ color: 'var(--accent)' }}>*</span>
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
                  <label htmlFor="email" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    Email <span style={{ color: 'var(--accent)' }}>*</span>
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
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  I am a... <span style={{ color: 'var(--accent)' }}>*</span>
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
                <label htmlFor="message" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  Message <span style={{ color: 'var(--foreground-muted)' }}>(optional)</span>
                </label>
                <textarea
                  id="message"
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what interests you about Scrollio..."
                  className="input-field resize-none"
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed font-script text-lg"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Get Started"}
              </button>

              <p className="text-xs text-center" style={{ color: 'var(--foreground-muted)' }}>
                By signing up, you agree to receive updates about Scrollio. 
                No spam, unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
