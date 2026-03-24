'use client';

export default function TextSliderSection() {
  const items = [
    { icon: 'fa-solid fa-briefcase', text: 'Stay ahead with AI insights' },
    { icon: 'fa-solid fa-chart-line', text: 'Know your competitive advantage' },
    { icon: 'fa-solid fa-bullseye', text: 'Plan your career with confidence' },
    { icon: 'fa-solid fa-rocket', text: 'Adapt faster than the competition' },
    { icon: 'fa-solid fa-chart-bar', text: 'Benchmark against your peers' },
  ];

  // Duplicate items for seamless looping
  const duplicatedItems = [...items, ...items];

  return (
    <section className="relative px-6 py-16 bg-gradient-to-b from-slate-50 to-white overflow-hidden border-y border-slate-200">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-8 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Scrolling Container */}
        <div className="w-full overflow-hidden">
          <div className="flex animate-infiniteScroll">
            {duplicatedItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-8 py-4 flex-shrink-0 whitespace-nowrap"
              >
                <i className={`${item.icon} text-indigo-600 text-2xl`}></i>
                <span className="text-slate-700 font-semibold text-lg">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
