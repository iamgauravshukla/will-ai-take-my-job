'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WillAITakeMyJobSection() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      q: 'How frequently do you perform repetitive, rule-based tasks?',
      options: [
        { text: 'Rarely—most of my work is unique', risk: 15 },
        { text: 'Some days have routine work', risk: 35 },
        { text: 'About half my day is repetitive', risk: 50 },
        { text: 'Most of my work follows patterns', risk: 70 },
      ],
    },
    {
      id: 2,
      q: 'How much creative or strategic thinking does your role require?',
      options: [
        { text: 'Very high—constant problem-solving', risk: 10 },
        { text: 'Significant—regular complex decisions', risk: 30 },
        { text: 'Moderate—some judgment required', risk: 50 },
        { text: 'Minimal—mostly executing plans', risk: 75 },
      ],
    },
    {
      id: 3,
      q: 'How critical is human interaction or relationship-building in your role?',
      options: [
        { text: 'Essential—relationships are core', risk: 10 },
        { text: 'Important—daily interaction needed', risk: 35 },
        { text: 'Moderate—some collaboration', risk: 55 },
        { text: 'Low—mostly independent work', risk: 75 },
      ],
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];

  const handleAnswer = (riskScore: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = riskScore;
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const averageRisk = answers.filter((a) => a !== null).length > 0 
    ? Math.round(answers.filter((a) => a !== null).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) / answers.filter((a) => a !== null).length)
    : 0;

  const getRiskLabel = (risk: number) => {
    if (risk < 30) return { 
      label: 'Low Risk', 
      color: 'emerald', 
      bgColor: 'bg-emerald-50', 
      textColor: 'text-emerald-900',
      borderColor: 'border-emerald-200',
      message: 'Your role demonstrates strong resilience against automation. Focus on continuous skill development to maintain this advantage.'
    };
    if (risk < 50) return { 
      label: 'Medium Risk', 
      color: 'amber', 
      bgColor: 'bg-amber-50', 
      textColor: 'text-amber-900',
      borderColor: 'border-amber-200',
      message: 'Your role has moderate automation risk. Consider developing complementary skills to enhance your value.'
    };
    if (risk < 70) return { 
      label: 'High Risk', 
      color: 'orange', 
      bgColor: 'bg-orange-50', 
      textColor: 'text-orange-900',
      borderColor: 'border-orange-200',
      message: 'Your role faces significant automation pressure. Start building new skills and exploring adjacent opportunities.'
    };
    return { 
      label: 'Very High Risk', 
      color: 'red', 
      bgColor: 'bg-red-50', 
      textColor: 'text-red-900',
      borderColor: 'border-red-200',
      message: 'Your role is highly vulnerable to automation. Urgent action is needed to adapt and upskill.'
    };
  };

  const riskInfo = getRiskLabel(averageRisk);

  return (
    <section className="relative px-6 py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-15 animate-blob-delayed"></div>
      </div>

      <div className="relative z-10 max-w-[992px] mx-auto">
        {/* Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto animate-slideInUp">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-4 w-fit mx-auto">
            <i className="fa-solid fa-robot text-xs"></i>
            <span>Quick Assessment</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-950 mb-4">
            Will AI take your job?
          </h2>
          <p className="text-lg text-slate-600">
            Answer 3 quick questions to get an instant risk assessment. It takes less than a minute.
          </p>
        </div>

        {!showResults ? (
          <div className="rounded-3xl border-2 border-slate-200/60 bg-white p-8 md:p-12 shadow-lg animate-fadeInScale">
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-xs font-semibold text-indigo-600">
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 transition-all duration-500"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-12 space-y-6 animate-slideInUp">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-950">
                {currentQuestion.q}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3" key={`question-${currentQuestionIndex}`}>
              {currentQuestion.options.map((option, optionIndex) => {
                // Explicitly check if this option is selected for the current question
                const isSelected = answers[currentQuestionIndex] === option.risk;
                return (
                  <button
                    key={`option-${currentQuestionIndex}-${optionIndex}`}
                    type="button"
                    onClick={() => handleAnswer(option.risk)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200/60 bg-white hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${isSelected ? 'text-indigo-700' : 'text-slate-900'}`}>
                        {option.text}
                      </span>
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-500' 
                          : 'border-slate-300'
                      }`}>
                        {isSelected && (
                          <i className="fa-solid fa-check text-white text-xs"></i>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Back button */}
            {currentQuestionIndex > 0 && (
              <button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                className="mt-8 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition flex items-center gap-1"
              >
                <i className="fa-solid fa-arrow-left text-xs"></i>
                Back
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-slate-200/60 bg-white p-8 md:p-12 shadow-lg animate-slideInUp">
            {/* Results */}
            <div className="space-y-8">
              {/* Risk Score Display */}
              <div className={`p-8 rounded-2xl border-2 ${riskInfo.borderColor} ${riskInfo.bgColor}`}>
                <div className="mb-8 flex justify-center">
                  <div className="relative w-40 h-40">
                    {/* Circular Progress */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      {/* Background circle */}
                      <circle 
                        cx="60" 
                        cy="60" 
                        r="50" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="6" 
                        opacity="0.1"
                        className={`text-${riskInfo.color}-600`}
                      />
                      {/* Progress circle */}
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeDasharray={`${(averageRisk / 100) * 314.159} 314.159`}
                        strokeLinecap="round"
                        className={`text-${riskInfo.color}-600 transition-all duration-500`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-5xl font-black text-slate-950">{averageRisk}%</span>
                      <span className="text-xs font-semibold text-slate-600 mt-1">Risk Score</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className={`text-2xl font-bold ${riskInfo.textColor} mb-3`}>{riskInfo.label}</h3>
                  <p className={`${riskInfo.textColor} text-sm leading-relaxed`}>
                    {riskInfo.message}
                  </p>
                </div>
              </div>

              {/* CTA Section */}
              <div className="text-center space-y-4">
                <h3 className="text-lg font-bold text-slate-950">Get your full personalized report</h3>
                <p className="text-slate-600 text-sm">
                  See detailed task-level analysis, sector benchmarks, and a 90-day action plan.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/analyze"
                    className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300"
                  >
                    Get Full Analysis
                    <i className="fa-solid fa-arrow-right ml-2"></i>
                  </Link>
                  <button
                    onClick={() => {
                      setCurrentQuestionIndex(0);
                      setAnswers([null, null, null]);
                      setShowResults(false);
                    }}
                    className="inline-flex items-center justify-center h-12 px-8 rounded-full border-2 border-slate-300 bg-white text-slate-900 font-bold text-sm hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
                  >
                    Retake Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
}
