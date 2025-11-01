import { useMemo, useState } from "react";
import type { PodcastClip } from "@/data/podcastClips";

const vibeAccent: Record<PodcastClip["vibe"], string> = {
  intense: "from-rose-500/20 via-orange-400/10 to-yellow-500/20 border-rose-400/40",
  inspirational:
    "from-emerald-400/15 via-sky-400/10 to-blue-500/20 border-emerald-300/40",
  playful:
    "from-pink-400/15 via-fuchsia-400/10 to-violet-500/20 border-pink-300/40",
  analytical:
    "from-slate-400/15 via-indigo-400/10 to-cyan-500/20 border-indigo-300/40",
  urgent:
    "from-amber-500/20 via-red-400/10 to-orange-500/20 border-amber-400/40",
};

function hhmmssToSeconds(timestamp: string) {
  const parts = timestamp.split(":").map(Number).reverse();
  return parts.reduce(
    (acc, value, index) => acc + value * Math.pow(60, index),
    0,
  );
}

export function ClipCard({ clip }: { clip: PodcastClip }) {
  const [copied, setCopied] = useState(false);
  const startSeconds = useMemo(
    () => hhmmssToSeconds(clip.hook.timestamp),
    [clip.hook.timestamp],
  );

  const embedUrl = useMemo(
    () =>
      `https://www.youtube.com/embed/${clip.youtubeId}?start=${startSeconds}&rel=0`,
    [clip.youtubeId, startSeconds],
  );

  const handleCopy = () => {
    const payload = [
      `${clip.hook.headline}`,
      `Hook timestamp: ${clip.hook.timestamp}`,
      `Setup: ${clip.hook.setup}`,
      `Payoff: ${clip.hook.payoff}`,
      `Clip Why It Works: ${clip.whyItWorks.join(" | ")}`,
      `Clip Tips: ${clip.clipBuilderTips.join(" | ")}`,
      `Source: ${clip.sourceUrl}`,
    ].join("\n");

    navigator.clipboard
      .writeText(payload)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  return (
    <article
      className={`group flex flex-col gap-6 rounded-3xl border bg-white/80 p-6 shadow-sm shadow-black/5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-white/20 dark:hover:bg-zinc-900/80 lg:flex-row lg:gap-8 ${vibeAccent[clip.vibe]}`}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black lg:w-72">
        <iframe
          className="h-full w-full"
          src={embedUrl}
          title={`${clip.show} — ${clip.episodeTitle}`}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {clip.show}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <header className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            <span>{clip.published}</span>
            <span>•</span>
            <span>{clip.duration}</span>
            <span>•</span>
            <span>{clip.speakers.join(" × ")}</span>
          </div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            {clip.episodeTitle}
          </h2>
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Prime Clip Hook
          </p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {clip.hook.headline}
          </p>
        </header>

        <div className="grid gap-3 text-sm text-zinc-700 dark:text-zinc-300 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-2 rounded-xl bg-white/60 p-3 dark:bg-white/5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Setup
            </h3>
            <p>{clip.hook.setup}</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl bg-white/60 p-3 dark:bg-white/5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Payoff
            </h3>
            <p>{clip.hook.payoff}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {clip.topics.map((topic) => (
            <span
              key={`${clip.id}-${topic}`}
              className="inline-flex items-center rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-600 transition group-hover:border-zinc-300 group-hover:text-zinc-900 dark:border-white/10 dark:bg-white/10 dark:text-zinc-200 dark:group-hover:border-white/30"
            >
              #{topic}
            </span>
          ))}
        </div>

        <div className="grid gap-4 rounded-2xl border border-white/40 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-900/40 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Why it works
            </p>
            <ul className="flex flex-col gap-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {clip.whyItWorks.map((reason) => (
                <li key={reason} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Clip Builder Tips
            </p>
            <ul className="flex flex-col gap-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {clip.clipBuilderTips.map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sky-400" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="flex flex-wrap items-center gap-3">
          <a
            href={clip.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-zinc-700 dark:border-white/20 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Watch Full Episode
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:-translate-y-0.5 hover:border-zinc-500 hover:text-zinc-900 dark:border-white/20 dark:text-zinc-200 dark:hover:border-white/40 dark:hover:text-white"
          >
            {copied ? "Copied!" : "Copy Hook Notes"}
          </button>
          <span className="text-xs uppercase tracking-wide text-zinc-400">
            Hook timestamp: {clip.hook.timestamp}
          </span>
        </footer>
      </div>
    </article>
  );
}
