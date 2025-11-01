"use client";

import { useMemo, useState } from "react";
import { ClipCard } from "@/components/ClipCard";
import { podcastClips } from "@/data/podcastClips";

const allTopics = Array.from(
  new Set(podcastClips.flatMap((clip) => clip.topics)),
).sort((a, b) => a.localeCompare(b));

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeTopics, setActiveTopics] = useState<string[]>([]);

  const filteredClips = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();

    return podcastClips.filter((clip) => {
      const matchesTopics =
        activeTopics.length === 0 ||
        activeTopics.every((topic) => clip.topics.includes(topic));

      if (!matchesTopics) return false;

      if (!lowerQuery) return true;

      const haystack = [
        clip.show,
        clip.episodeTitle,
        clip.speakers.join(" "),
        clip.hook.headline,
        clip.hook.setup,
        clip.hook.payoff,
        clip.whyItWorks.join(" "),
        clip.clipBuilderTips.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(lowerQuery);
    });
  }, [query, activeTopics]);

  const toggleTopic = (topic: string) => {
    setActiveTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((item) => item !== topic)
        : [...prev, topic],
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 via-zinc-50 to-white font-sans text-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-24 pt-16 sm:px-10 lg:px-12">
        <section className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-zinc-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white dark:bg-white dark:text-zinc-950">
            Viral Clip Intelligence
          </span>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            60-second hooks from long-form podcasts that already light up YouTube
            Shorts.
          </h1>
          <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
            Search and filter hand-picked podcast moments with proven hooks,
            timestamps, and creative angles. Clip them fast, add your spin, and ride
            the wave while the topic is still hot.
          </p>
          <div className="flex flex-col gap-6 rounded-3xl border border-zinc-200/80 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-900/60">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex flex-1 items-center gap-3 rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm shadow-sm focus-within:border-zinc-500 focus-within:ring-2 focus-within:ring-zinc-200 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200 dark:focus-within:border-white/30 dark:focus-within:ring-white/10">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Search the vault
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Creators, hooks, emotions..."
                  className="w-full bg-transparent text-base font-medium text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white"
                />
              </label>
              <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                  {filteredClips.length}
                </span>
                ideas ready to clip
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {allTopics.map((topic) => {
                const isActive = activeTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                      isActive
                        ? "border-zinc-900 bg-zinc-900 text-white shadow-sm dark:border-white dark:bg-white dark:text-zinc-900"
                        : "border-zinc-200 bg-white text-zinc-600 hover:-translate-y-0.5 hover:border-zinc-400 hover:text-zinc-900 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-white/30 dark:hover:text-white"
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
              {activeTopics.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTopics([])}
                  className="rounded-full border border-transparent bg-zinc-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-8">
          {filteredClips.map((clip) => (
            <ClipCard key={clip.id} clip={clip} />
          ))}
          {filteredClips.length === 0 && (
            <div className="rounded-3xl border border-dashed border-zinc-300 bg-white/60 p-12 text-center text-sm text-zinc-500 dark:border-white/20 dark:bg-zinc-900/40 dark:text-zinc-300">
              No clips match that combo yet. Try a different hook keyword or reset your
              topic filters.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
