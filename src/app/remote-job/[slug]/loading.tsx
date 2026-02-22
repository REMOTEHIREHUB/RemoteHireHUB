export default function JobPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8 pb-28 lg:pb-8">
        {/* Back button skeleton */}
        <div className="mb-6 h-10 w-36 rounded-lg bg-gray-200 animate-pulse" />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content skeleton */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header card skeleton */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              {/* Gradient top strip */}
              <div className="h-1.5 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 animate-pulse" />
              <div className="p-6 space-y-5">
                {/* Avatar + title group */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="h-5 w-24 rounded-full bg-green-100 animate-pulse" />
                    <div className="h-8 w-5/6 rounded-lg bg-gray-200 animate-pulse" />
                    <div className="h-7 w-3/5 rounded-lg bg-gray-200 animate-pulse" />
                    <div className="flex items-center gap-2 pt-1">
                      <div className="h-5 w-5 rounded-full bg-gray-100 animate-pulse" />
                      <div className="h-5 w-40 rounded-lg bg-gray-100 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Info chips horizontal row */}
                <div className="flex gap-2">
                  {[88, 110, 96, 104, 80].map((w, i) => (
                    <div
                      key={i}
                      style={{ minWidth: `${w}px`, width: `${w}px` }}
                      className="h-7 rounded-full bg-gray-100 animate-pulse"
                    />
                  ))}
                </div>

                {/* Info grid 2-col on mobile */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
                      <div className="h-9 w-9 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="h-3 w-14 rounded bg-gray-200 animate-pulse" />
                        <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tags row */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  {[80, 96, 112].map((w, i) => (
                    <div key={i} style={{ width: `${w}px` }} className="h-6 rounded-full bg-gray-100 animate-pulse" />
                  ))}
                </div>

                {/* Apply button */}
                <div className="h-12 w-full sm:w-56 rounded-xl bg-blue-100 animate-pulse" />
              </div>
            </div>

            {/* Description card skeleton */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="h-1 bg-blue-100 animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-lg bg-blue-100 animate-pulse" />
                  <div className="h-7 w-44 rounded-lg bg-gray-200 animate-pulse" />
                </div>
                <div className="space-y-2.5 pt-1">
                  {[100, 95, 90, 100, 75, 100, 85, 100, 92, 60, 100, 88].map((w, i) => (
                    <div key={i} style={{ width: `${w}%` }} className="h-4 rounded bg-gray-100 animate-pulse" />
                  ))}
                </div>
              </div>
            </div>

            {/* Requirements card skeleton */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="h-1 bg-green-100 animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-lg bg-green-100 animate-pulse" />
                  <div className="h-7 w-36 rounded-lg bg-gray-200 animate-pulse" />
                </div>
                <div className="space-y-2.5 pt-1">
                  {[100, 85, 90, 70, 80, 95, 78].map((w, i) => (
                    <div key={i} style={{ width: `${w}%` }} className="h-4 rounded bg-gray-100 animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="lg:col-span-1 space-y-6">
            {/* Source card */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-4">
              <div className="h-6 w-28 rounded-lg bg-gray-200 animate-pulse" />
              <div className="h-16 rounded-xl bg-blue-50 animate-pulse" />
              <div className="h-14 rounded-lg bg-gray-100 animate-pulse" />
              <div className="h-11 w-full rounded-xl bg-blue-100 animate-pulse" />
            </div>

            {/* Share card */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-4">
              <div className="h-6 w-32 rounded-lg bg-gray-200 animate-pulse" />
              <div className="flex gap-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                ))}
              </div>
            </div>

            {/* Similar jobs card */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-4">
              <div className="h-6 w-40 rounded-lg bg-gray-200 animate-pulse" />
              {[1, 2, 3].map(i => (
                <div key={i} className="p-3 border border-gray-100 rounded-xl space-y-2.5">
                  <div className="h-4 w-4/5 rounded bg-gray-200 animate-pulse" />
                  <div className="h-3 w-3/5 rounded bg-gray-100 animate-pulse" />
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-20 rounded-full bg-gray-100 animate-pulse" />
                    <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
                  </div>
                </div>
              ))}
              <div className="h-10 w-full rounded-xl bg-gray-100 animate-pulse" />
            </div>

            {/* Alerts card */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-3 text-center">
              <div className="h-10 w-10 rounded-full bg-yellow-100 animate-pulse mx-auto" />
              <div className="h-5 w-32 rounded-lg bg-gray-200 animate-pulse mx-auto" />
              <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
              <div className="h-4 w-4/5 rounded bg-gray-100 animate-pulse mx-auto" />
              <div className="h-10 w-full rounded-xl bg-blue-100 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky apply skeleton */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden z-50 px-4 py-3 bg-white border-t border-gray-200 shadow-2xl">
        <div className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 animate-pulse" />
      </div>
    </div>
  )
}
