export default function SimpleFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-white to-slate-50 text-slate-900 px-6 py-12 overflow-hidden border-t border-slate-200">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-10 animate-blob-delayed"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto space-y-8">
        {/* Disclaimer Box */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 backdrop-blur-sm">
          <p className="text-xs text-slate-700 leading-relaxed text-center">
            <strong className="text-indigo-700">Disclaimer:</strong> This tool provides AI-based estimations for informational purposes only. It is not professional career or financial advice. Consult with professionals for personalized guidance.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-xs text-slate-600">
            © {currentYear} Will AI Take My Job? All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
