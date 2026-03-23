'use client';

export default function EnhancedHeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 md:pt-32 pb-12 md:pb-20 bg-gradient-to-b from-slate-50 via-white to-indigo-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-indigo-100 rounded-full blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 left-0 w-64 md:w-96 h-64 md:h-96 bg-blue-100 rounded-full blur-3xl opacity-20 animate-blob-delayed"></div>
        <div className="absolute top-1/2 right-1/4 w-56 md:w-80 h-56 md:h-80 bg-indigo-50 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6 md:space-y-8 animate-slideInUp">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-bold uppercase tracking-widest w-fit hover:bg-indigo-100 transition-colors duration-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
              </span>
              AI Career Risk Analysis
            </div>

            {/* Main Heading with Gradient Highlight */}
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 leading-[1.2]">
                Will AI take{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 text-transparent bg-clip-text animate-rotateGradient">your job?</span>
                  {/* Subtle underline */}
                  <div className="absolute -bottom-3 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-300/40 via-blue-300/40 to-transparent rounded-full"></div>
                </span>
              </h1>
            </div>

            {/* Supporting Text - Better Readability */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg animate-slideInUp" style={{ animationDelay: '0.05s' }}>
              Get your personalized automation risk score, sector benchmarks, and a 90-day action plan—all in <span className="font-semibold text-slate-700">just 2 minutes</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
              {/* Primary CTA - Solid */}
              <a
                href="/analyze"
                className="inline-flex items-center justify-center h-12 md:h-14 px-6 md:px-8 rounded-full bg-indigo-600 text-white font-bold text-sm md:text-base hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105 group"
              >
                <span>Start Free Analysis</span>
                <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform hidden sm:inline"></i>
              </a>
              
              {/* Secondary CTA - Outline */}
              <a
                href="/jobs"
                className="inline-flex items-center justify-center h-12 md:h-14 px-6 md:px-8 rounded-full border-2 border-slate-300 bg-white text-slate-900 font-bold text-sm md:text-base hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-300 group"
              >
                <span>Browse Jobs</span>
                <i className="fa-solid fa-briefcase ml-2 group-hover:scale-110 transition-transform hidden sm:inline"></i>
              </a>
            </div>

            {/* Trust Line */}
            <p className="text-xs md:text-sm text-slate-500 pt-2 md:pt-4 animate-slideInUp" style={{ animationDelay: '0.15s' }}>
              <i className="fa-solid fa-star text-amber-400 mr-2"></i>
              Trusted by 10,000+ professionals worldwide
            </p>

            {/* Supporting Points */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 pt-4 md:pt-6 animate-slideInUp text-xs md:text-sm text-slate-600" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <i className="fa-solid fa-check text-xs"></i>
                </div>
                <span>No login required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <i className="fa-solid fa-check text-xs"></i>
                </div>
                <span>100% private & secure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <i className="fa-solid fa-check text-xs"></i>
                </div>
                <span>Takes 2 minutes</span>
              </div>
            </div>
          </div>

          {/* Right Column - Large Animated Chart */}
          <div className="relative h-96 md:h-[500px] lg:h-[600px] animate-slideInDown" style={{ animationDelay: '0.15s' }}>
            {/* Container with soft radial glow */}
            <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-white via-slate-50 to-blue-50 border border-slate-200/50 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500">
              
              {/* Radial Gradient Glow Behind Chart */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-80 h-80 bg-gradient-radial from-indigo-400/8 via-blue-400/4 to-transparent rounded-full blur-3xl"></div>
              </div>

              {/* Main Chart Area */}
              <div className="relative w-full h-full flex items-center justify-center p-8 md:p-12">
                {/* SVG Chart Container */}
                <svg 
                  viewBox="0 0 500 300" 
                  className="w-full h-full" 
                  preserveAspectRatio="xMidYMid meet"
                  style={{ filter: 'drop-shadow(0 10px 30px rgba(99, 102, 241, 0.1))' }}
                >
                  <defs>
                    {/* Gradient for fill under line */}
                    <linearGradient id="chartAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(99, 102, 241, 0.15)" />
                      <stop offset="50%" stopColor="rgba(59, 130, 246, 0.08)" />
                      <stop offset="100%" stopColor="rgba(99, 102, 241, 0.02)" />
                    </linearGradient>

                    {/* Gradient for line */}
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>

                    {/* Animation */}
                    <style>{`
                      @keyframes drawLine {
                        from {
                          stroke-dashoffset: 2000;
                        }
                        to {
                          stroke-dashoffset: 0;
                        }
                      }
                      .animated-chart-line {
                        animation: drawLine 2.5s ease-out forwards;
                        stroke-dasharray: 2000;
                      }
                    `}</style>
                  </defs>

                  {/* Grid background - subtle */}
                  <g stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3">
                    <line x1="40" y1="30" x2="40" y2="250" />
                    <line x1="40" y1="70" x2="480" y2="70" />
                    <line x1="40" y1="110" x2="480" y2="110" />
                    <line x1="40" y1="150" x2="480" y2="150" />
                    <line x1="40" y1="190" x2="480" y2="190" />
                    <line x1="40" y1="230" x2="480" y2="230" />
                    <line x1="40" y1="250" x2="480" y2="250" />
                  </g>

                  {/* Y-axis and X-axis */}
                  <line x1="40" y1="30" x2="40" y2="250" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="40" y1="250" x2="480" y2="250" stroke="#94a3b8" strokeWidth="1.5" />

                  {/* Y-axis labels */}
                  <text x="30" y="35" fontSize="11" fill="#64748b" textAnchor="end">100%</text>
                  <text x="30" y="115" fontSize="11" fill="#64748b" textAnchor="end">50%</text>
                  <text x="30" y="255" fontSize="11" fill="#64748b" textAnchor="end">0%</text>

                  {/* X-axis labels */}
                  <text x="40" y="270" fontSize="11" fill="#64748b" textAnchor="middle">Past</text>
                  <text x="260" y="270" fontSize="11" fill="#64748b" textAnchor="middle">Today</text>
                  <text x="480" y="270" fontSize="11" fill="#64748b" textAnchor="middle">Future</text>

                  {/* Area fill under line */}
                  <path 
                    d="M 40 250 Q 160 200, 260 120 Q 360 80, 480 100 L 480 250 Z"
                    fill="url(#chartAreaGradient)"
                  />

                  {/* Main animated line - smooth curve */}
                  <path
                    d="M 40 250 Q 160 200, 260 120 Q 360 80, 480 100"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animated-chart-line"
                  />

                  {/* Data points with glow */}
                  <circle cx="40" cy="250" r="4" fill="#4f46e5" opacity="0.6" />
                  <circle cx="40" cy="250" r="5.5" fill="none" stroke="#4f46e5" strokeWidth="1" opacity="0.4" />
                  
                  <circle cx="260" cy="120" r="4" fill="#3b82f6" />
                  <circle cx="260" cy="120" r="5.5" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
                  
                  <circle cx="480" cy="100" r="4" fill="#4f46e5" opacity="0.6" />
                  <circle cx="480" cy="100" r="5.5" fill="none" stroke="#4f46e5" strokeWidth="1" opacity="0.4" />
                </svg>
              </div>
            </div>

            {/* Floating Stat Badge 1 - Top Right */}
            <div 
              className="absolute top-8 right-8 md:top-12 md:right-12 animate-float"
              style={{ animationDelay: '0s', animationDuration: '4s' }}
            >
              <div className="p-4 md:p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <i className="fa-solid fa-chart-line text-indigo-600 text-lg"></i>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Tasks Analyzed</p>
                    <p className="text-base md:text-lg font-black text-indigo-600">45M+</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stat Badge 2 - Bottom Left */}
            <div 
              className="absolute bottom-8 left-8 md:bottom-12 md:left-12 animate-float"
              style={{ animationDelay: '1.5s', animationDuration: '5s' }}
            >
              <div className="p-4 md:p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <i className="fa-solid fa-circle-check text-emerald-600 text-lg"></i>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Accuracy</p>
                    <p className="text-base md:text-lg font-black text-emerald-600">98%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stat Badge 3 - Bottom Right (optional) */}
            <div 
              className="absolute bottom-16 right-12 hidden md:block animate-float"
              style={{ animationDelay: '0.8s', animationDuration: '4.5s' }}
            >
              <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <i className="fa-solid fa-briefcase text-blue-600 text-lg"></i>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Jobs Analyzed</p>
                    <p className="text-lg font-black text-blue-600">800+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
