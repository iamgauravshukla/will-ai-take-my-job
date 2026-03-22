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
      bar: 'bg-accent border-l-[2px] border-ink',
      badge: 'bg-accent text-white border-[2px] border-ink',
      label: 'Very High',
    };
  }

  if (score >= 55) {
    return {
      bar: 'bg-[#E5B25D] border-l-[2px] border-ink',
      badge: 'bg-[#E5B25D] text-ink border-[2px] border-ink',
      label: 'High',
    };
  }

  if (score >= 40) {
    return {
      bar: 'bg-slate-400 border-l-[2px] border-ink',
      badge: 'bg-parchment text-ink border-[2px] border-ink',
      label: 'Medium',
    };
  }

  return {
    bar: 'bg-[#81B69D] border-l-[2px] border-ink',
    badge: 'bg-[#81B69D] text-ink border-[2px] border-ink',
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
      <section className="border-[2px] border-ink bg-ink px-6 py-10 md:px-12 md:py-16 text-parchment overflow-hidden">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <span className="inline-flex border-[2px] border-accent bg-accent text-white px-3 py-1 font-bold uppercase tracking-widest text-xs">
              Role Library
            </span>
            <h1 className="mt-5 max-w-3xl font-display text-5xl md:text-7xl uppercase tracking-tight leading-none text-parchment">
              Explore Job Profiles And AI Risk
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium opacity-80 uppercase tracking-wide">
              Search across the job library, compare roles within the same sector, and open full AI automation reports for any position.
            </p>

            <div className="mt-10 grid gap-4 grid-cols-3 border-y-[2px] border-parchment py-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">Roles Tracked</p>
                <p className="mt-2 font-display text-5xl md:text-6xl text-accent">{jobs.length}</p>
              </div>
              <div className="border-x-[2px] border-parchment px-4 md:px-6">
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">Sectors</p>
                <p className="mt-2 font-display text-5xl md:text-6xl text-accent">{Math.max(0, sectors.length - 1)}</p>
              </div>
              <div className="pl-4 md:pl-6">
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">Avg. Risk</p>
                <p className="mt-2 font-display text-5xl md:text-6xl text-accent">{averageRisk}%</p>
              </div>
            </div>
          </div>

          <div className="border-[2px] border-parchment p-6 md:p-8 bg-ink text-parchment relative">
            <div className="absolute top-0 right-0 p-3">
              <span className="border-[2px] border-parchment px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-parchment text-ink">FILTER</span>
            </div>
            
            <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-6 border-b-[2px] border-parchment pb-2 inline-block">Refine Results</p>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest opacity-80">Search Roles</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Keyword, sector..."
                  className="w-full border-[2px] border-parchment bg-transparent px-4 py-3 text-sm text-parchment placeholder:opacity-50 focus:border-accent focus:outline-none appearance-none"
                  style={{ borderRadius: 0 }}
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-widest opacity-80">Sector</span>
                  <select
                    value={selectedSector}
                    onChange={(event) => setSelectedSector(event.target.value)}
                    className="w-full border-[2px] border-parchment bg-transparent px-4 py-3 text-sm text-parchment focus:border-accent focus:outline-none appearance-none"
                    style={{ borderRadius: 0 }}
                  >
                    {sectors.map((sector) => (
                      <option key={sector} value={sector} className="bg-ink text-parchment">
                        {sector}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-widest opacity-80">Sort Default</span>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as 'title' | 'risk-desc' | 'risk-asc')}
                    className="w-full border-[2px] border-parchment bg-transparent px-4 py-3 text-sm text-parchment focus:border-accent focus:outline-none appearance-none"
                    style={{ borderRadius: 0 }}
                  >
                    <option value="title" className="bg-ink text-parchment">Title A-Z</option>
                    <option value="risk-desc" className="bg-ink text-parchment">Highest Risk First</option>
                    <option value="risk-asc" className="bg-ink text-parchment">Lowest Risk First</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-col gap-6 border-[2px] border-ink bg-parchment p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-60">Status</p>
            <p className="mt-1 font-display text-3xl uppercase tracking-tight leading-none text-ink">
              Showing {filteredJobs.length} Role{filteredJobs.length === 1 ? '' : 's'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {sectors.slice(0, 7).map((sector) => (
              <button
                key={sector}
                type="button"
                onClick={() => setSelectedSector(sector)}
                className={`border-[2px] border-ink px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                  selectedSector === sector
                    ? 'bg-ink text-parchment'
                    : 'bg-transparent text-ink hover:bg-ink/5'
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
                  className="group flex flex-col justify-between border-[2px] border-ink bg-parchment p-6 transition-colors hover:bg-ink hover:text-parchment"
                >
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <p className="text-xs font-bold uppercase tracking-widest max-w-[60%] truncate opacity-60 group-hover:opacity-100">{job.sector}</p>
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest shrink-0 ${riskTone.badge} group-hover:border-parchment group-hover:text-ink`}>
                        {riskTone.label}
                      </span>
                    </div>

                    <h2 className="font-display text-4xl leading-none uppercase tracking-tight text-ink group-hover:text-parchment mb-4">
                      {job.title}
                    </h2>
                    <div className="h-[2px] w-full bg-ink/10 group-hover:bg-parchment/20 mb-4" />
                    <p className="line-clamp-3 text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-90 mb-6 uppercase tracking-wide">
                      {job.description}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <div className="mb-2 flex items-end justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100">Automation Exposure</span>
                      <span className="font-display text-4xl leading-none">{job.automationRisk}%</span>
                    </div>
                    <div className="flex h-3 w-full border-[2px] border-ink bg-transparent group-hover:border-parchment">
                      <div className={`h-full border-r-[2px] border-ink group-hover:border-parchment transition-all ${riskTone.bar.split(' ')[0]}`} style={{ width: `${job.automationRisk}%` }} />
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest group-hover:text-accent">Open Analysis →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="border-[2px] border-ink bg-parchment p-12 text-center">
            <h2 className="font-display text-5xl uppercase tracking-tight mt-2 text-ink">0 Matches Found</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg font-medium opacity-80 uppercase tracking-widest">
              Try a broader title, clear the sector filter, or sort differently to explore more roles.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedSector('All');
                setSortBy('title');
              }}
              className="mt-8 border-[2px] border-ink bg-ink text-parchment px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-accent hover:border-accent transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </>
  );
}