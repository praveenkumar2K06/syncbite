export default function PageSkeletonLoader() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 animate-pulse space-y-6">
      {/* Hero / Header placeholder */}
      <div className="h-10 bg-navy/10 rounded w-1/3" />
      <div className="h-4 bg-navy/10 rounded w-1/2" />

      {/* Cards placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="border-2 border-navy/15 bg-white/50 p-4 space-y-3 h-44 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="h-5 bg-navy/10 rounded w-3/4" />
              <div className="h-3 bg-navy/10 rounded w-1/2" />
            </div>
            <div className="flex justify-between items-center pt-4">
              <div className="h-4 bg-navy/10 rounded w-1/4" />
              <div className="h-8 bg-navy/10 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
