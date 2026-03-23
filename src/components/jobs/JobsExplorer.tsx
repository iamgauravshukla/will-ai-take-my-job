'use client';

import Link from 'next/link';
import { useDeferredValue, useMemo, useState } from 'react';

type JobListItem = {
  _id: string;
  title: string;
  sector: string;
  slug: string;
  description: string;
  automationRisk: number;
};

type JobsExplorerProps = {
  jobs: JobListItem[];
};

function getRiskTone(score: number) {
  if (score >= 70) {
    return {
      bar: 'bg-red-500',
      badge: 'bg-red-100 text-red-700',
      label: 'Very High',
    };
  }

  if (score >= 55) {
    return {
      bar: 'bg-amber-500',
      badge: 'bg-amber-100 text-amber-700',
      label: 'High',
    };
  }

  if (score >= 40) {
    return {
      bar: 'bg-slate-500',
      badge: 'bg-slate-100 text-slate-700',
      label: 'Medium',
    };
  }

  return {
    bar: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700',
    label: 'Low',
  };
}

export default function JobsExplorer({ jobs }: JobsExplorerProps) {
  const [query, setQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [sortBy, setSortBy] = useState<'title' | 'risk-desc' | 'risk-asc'>('title');
  const deferredQuery = useDeferredValue(query);

  const sectors = useMemo(() => {
    const values = new Set<string>();

    for (const job of jobs) {
      if (job.sector) {
        values.add(job.sector);
      }
    }

    return ['All', ...Array.from(values).sort((left, right) => left.localeCompare(right))];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    const nextJobs = jobs.filter((job) => {
      const matchesSector = selectedSector === 'All' || job.sector === selectedSector;

      if (!matchesSector) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [job.title, job.sector, job.description].some((value) => value.toLowerCase().includes(normalizedQuery));
    });

    nextJobs.sort((left, right) => {
      if (sortBy === 'risk-desc') {
        return right.automationRisk - left.automationRisk || left.title.localeCompare(right.title);
      }

      if (sortBy === 'risk-asc') {
        return left.automationRisk - right.automationRisk || left.title.localeCompare(right.title);
      }

      return left.title.localeCompare(right.title);
    });

    return nextJobs;
  }, [deferredQuery, jobs, selectedSector, sortBy]);

  const averageRisk = Math.round(
    jobs.reduce((sum, job) => sum + job.automationRisk, 0) / Math.max(1, jobs.length)
  );

  return (
    <>
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-6 py-10 text-white shadow-2xl shadow-slate-300/30 md:px-10 md:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_38%),radial-gradient(circle_at_left,_rgba(99,102,241,0.22),_transparent_42%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
              Role Library
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-white md:text-5xl">
              Explore job risk profiles with search, sector context, and deeper role-by-role analysis.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Search across the job library, compare roles within the same sector, and open full AI automation reports for any position.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Roles tracked</p>
                <p className="mt-2 text-3xl font-black text-white">{jobs.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Sectors</p>
                <p className="mt-2 text-3xl font-black text-white">{Math.max(0, sectors.length - 1)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Avg. risk</p>
                <p className="mt-2 text-3xl font-black text-white">{averageRisk}%</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Quick filters</p>

            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">Search roles</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search title, sector, or description"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-300 focus:outline-none"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">Sector</span>
                  <select
                    value={selectedSector}
                    onChange={(event) => setSelectedSector(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white focus:border-amber-300 focus:outline-none"
                  >
                    {sectors.map((sector) => (
                      <option key={sector} value={sector} className="bg-slate-900 text-white">
                        {sector}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">Sort by</span>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as 'title' | 'risk-desc' | 'risk-asc')}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white focus:border-amber-300 focus:outline-none"
                  >
                    <option value="title" className="bg-slate-900 text-white">Title A-Z</option>
                    <option value="risk-desc" className="bg-slate-900 text-white">Highest risk first</option>
                    <option value="risk-asc" className="bg-slate-900 text-white">Lowest risk first</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-lg shadow-slate-200/50 md:flex-row md:items-center md:justify-between md:p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Browse faster</p>
            <p className="mt-2 text-xl font-bold text-slate-900">
              {filteredJobs.length} role{filteredJobs.length === 1 ? '' : 's'} match your current filters.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {sectors.slice(0, 7).map((sector) => (
              <button
                key={sector}
                type="button"
                onClick={() => setSelectedSector(sector)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedSector === sector
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white'
                }`}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        {filteredJobs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredJobs.map((job) => {
              const riskTone = getRiskTone(job.automationRisk);

              return (
                <Link
                  key={job._id}
                  href={`/jobs/${job.slug}`}
                  className="group rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/60"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{job.sector}</p>
                      <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900 transition group-hover:text-indigo-700">
                        {job.title}
                      </h2>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${riskTone.badge}`}>
                      {riskTone.label}
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{job.description}</p>

                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-500">Automation exposure</span>
                      <span className="font-bold text-slate-900">{job.automationRisk}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full ${riskTone.bar}`} style={{ width: `${job.automationRisk}%` }} />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between text-sm">
                    <span className="font-semibold text-indigo-600">Open full analysis</span>
                    <span className="text-slate-400 transition group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center shadow-sm shadow-slate-200/60">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">No matches</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">No roles fit the current search yet.</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Try a broader title, clear the sector filter, or sort differently to explore more roles.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedSector('All');
                setSortBy('title');
              }}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>
    </>
  );
}