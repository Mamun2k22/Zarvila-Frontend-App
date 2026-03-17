import React, { useMemo, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

function ProductCategory() {
  const BASE = useMemo(
    () => (import.meta.env.VITE_APP_SERVER_URL || "http://localhost:5000").replace(/\/$/, ""),
    []
  );

  const toAbsoluteUrl = (baseUrl, path) => {
    if (!path) return "/placeholder.png";

    const s = String(path).trim();
    if (/^https?:\/\//i.test(s)) return s;

    const baseClean = String(baseUrl || "").replace(/\/$/, "");
    return s.startsWith("/") ? `${baseClean}${s}` : `${baseClean}/${s}`;
  };

  const {
    data: categories = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/categories`);
      if (!res.ok) throw new Error("Failed to load categories");
      return res.json();
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (isLoading) {
    return (
      <section className="bg-white">
        <div className="max-w-full mx-auto px-4 sm:px-6 xl:px-8 py-4">
          <div className="flex items-center justify-center mb-4">
            <div className="flex-1 flex items-center">
              <span className="h-[1px] w-full bg-gray-300"></span>
              <span className="ml-2 h-2 w-2 rounded-full bg-gray-400"></span>
            </div>

            <div className="mx-6 h-7 w-40 bg-gray-200 rounded animate-pulse" />

            <div className="flex-1 flex items-center">
              <span className="mr-2 h-2 w-2 rounded-full bg-gray-400"></span>
              <span className="h-[1px] w-full bg-gray-300"></span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden aspect-[775/747] bg-gray-200 animate-pulse rounded-sm"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return <div className="py-10 text-center">Error loading categories</div>;
  }

  return (
    <section className="bg-white">
      <div className="max-w-full mx-auto px-4 sm:px-6 xl:px-8 py-4">
        <div className="flex items-center justify-center mb-4">
          <div className="flex-1 flex items-center">
            <span className="h-[1px] w-full bg-gray-300"></span>
            <span className="ml-2 h-2 w-2 rounded-full bg-gray-400"></span>
          </div>

          <h2 className="mx-6 text-xl md:text-2xl font-bold tracking-wide text-gray-900 text-center">
            Top Categories
          </h2>

          <div className="flex-1 flex items-center">
            <span className="mr-2 h-2 w-2 rounded-full bg-gray-400"></span>
            <span className="h-[1px] w-full bg-gray-300"></span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, idx) => {
            const to = `/category/${encodeURIComponent(cat?.slug || cat?.name || "")}`;
            const imgSrc = toAbsoluteUrl(BASE, cat?.image);
            const isPriorityImage = idx < 2;

            return (
              <Link
                key={cat._id || idx}
                to={to}
                className="group relative overflow-hidden aspect-[775/747] rounded-sm"
              >
                <img
                  src={imgSrc}
                  alt={cat?.name || "Category"}
                  loading={isPriorityImage ? "eager" : "lazy"}
                  fetchPriority={isPriorityImage ? "high" : "low"}
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/placeholder.png";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                <span className="absolute left-1/2 -translate-x-1/2 bottom-4 px-3 py-1 rounded-sm text-white text-sm font-medium tracking-wide bg-black/40 backdrop-blur-sm">
                  {cat?.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default memo(ProductCategory);