"use client";

export default function Hero() {
  const scrollToWaitlist = () => {
    const element = document.getElementById("waitlist");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen pt-24 pb-20 px-6 bg-dots overflow-hidden">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto relative z-10 text-center pt-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm mb-8" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Now accepting early access signups</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
          <span style={{ color: 'var(--foreground)' }}>Turn Scrolling</span>
          <br />
          <span style={{ color: 'var(--foreground)' }}>Into </span>
          <span className="script-gradient text-5xl md:text-6xl lg:text-7xl">Learning</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ color: 'var(--foreground-muted)' }}>
          AI-powered education made simple. From TikTok-style micro-learning 
          to magical experiences where drawings become living mentors.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center mb-16">
          <button 
            onClick={scrollToWaitlist} 
            className="btn-primary text-base py-4 px-8"
          >
            Get Started
          </button>
        </div>

        {/* Product Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Scrollio Core Card */}
          <div className="card-light p-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Scrollio Core</h3>
                <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>For teens & adults</p>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--foreground-muted)' }}>
              AI-curated vertical feed of short educational videos. Science, tech, psychology, creativity and more.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">Micro-learning</span>
              <span className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">AI-curated</span>
            </div>
          </div>

          {/* Scrollio Kids Card */}
          <div className="card-light p-6 text-left" style={{ borderColor: 'rgba(249, 115, 22, 0.2)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Scrollio Kids</h3>
                <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>For children & families</p>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--foreground-muted)' }}>
              Draw a character, watch it come alive, learn together. A living mentor from imagination.
            </p>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--foreground-muted)' }}>
              <span className="flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-medium">1</span>
                Draw
              </span>
              <span style={{ color: 'var(--card-border)' }}>→</span>
              <span className="flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-medium">2</span>
                Animate
              </span>
              <span style={{ color: 'var(--card-border)' }}>→</span>
              <span className="flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 font-medium">3</span>
                Learn
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
