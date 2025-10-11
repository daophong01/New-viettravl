export default function SkeletonCard() {
  return (
    <div className="rounded-lg border border-black/10 dark:border-white/15 overflow-hidden bg-background animate-pulse">
      <div className="h-40 w-full bg-black/10 dark:bg-white/10" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-black/10 dark:bg-white/10 rounded" />
        <div className="h-3 bg-black/10 dark:bg-white/10 rounded w-2/3" />
        <div className="h-3 bg-black/10 dark:bg-white/10 rounded w-1/2" />
        <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-1/3" />
        <div className="flex justify-between pt-2">
          <div className="h-3 bg-black/10 dark:bg-white/10 rounded w-20" />
          <div className="h-8 bg-black/10 dark:bg-white/10 rounded w-24" />
        </div>
      </div>
    </div>
  );
}