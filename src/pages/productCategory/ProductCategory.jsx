import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useLoading from "../../hooks/useLoading";
import Loader from "../../Spinner/Loader";

const ProductCategory = () => {
  const { isLoading, showLoader, hideLoader } = useLoading();
  const BASE = import.meta.env.VITE_APP_SERVER_URL;

  // ✅ build absolute url for images like: "/uploads/.." => "http://localhost:5000/uploads/.."
  const toAbsoluteUrl = (baseUrl, path) => {
    if (!path) return "";
    const s = String(path);
    if (s.startsWith("http://") || s.startsWith("https://")) return s;

    const baseClean = String(baseUrl || "").replace(/\/$/, "");
    if (s.startsWith("/")) return `${baseClean}${s}`;
    return `${baseClean}/${s}`;
  };

  const {
    data: categories = [],
    error,
    isFetching,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      showLoader();
      const res = await fetch(`${BASE}api/categories`);
      const data = await res.json();
      hideLoader();
      return data;
    },
    onError: hideLoader,
  });

  useEffect(() => {
    if (!isFetching) hideLoader();
  }, [isFetching, hideLoader]);

  if (isLoading || isFetching) return <Loader />;
  if (error)
    return <div className="py-10 text-center">Error loading categories</div>;

  return (
    <section className="bg-white">
      <div className=" max-w-full mx-auto px-4 sm:px-6 xl:px-8 py-4">
        {/* header row */}
        <div className="flex items-center justify-center mb-4">
          {/* left widget line */}
          <div className="flex-1 flex items-center">
            <span className="h-[1px] w-full bg-gray-300"></span>
            <span className="ml-2 h-2 w-2 rounded-full bg-gray-400"></span>
          </div>

          {/* center title */}
          <h2 className="mx-6 text-xl md:text-2xl font-bold tracking-wide text-gray-900 text-center">
            Top Categories
          </h2>

          {/* right widget line */}
          <div className="flex-1 flex items-center">
            <span className="mr-2 h-2 w-2 rounded-full bg-gray-400"></span>
            <span className="h-[1px] w-full bg-gray-300"></span>
          </div>
        </div>

        {/* grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, idx) => {
            // ✅ route will use slug if exists, else fallback to name
            const to = `/category/${encodeURIComponent(cat?.slug || cat?.name)}`;

            // ✅ category image absolute
            const imgSrc = toAbsoluteUrl(BASE, cat?.image);

            return (
              <Link
                key={cat._id || idx}
                to={to}
                className="group relative overflow-hidden aspect-[775/747]"
              >
                {/* Image */}
                <img
                  src={imgSrc}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                {/* Label */}
                <span
                  className="absolute left-1/2 -translate-x-1/3 bottom-4 px-3 py-1 
                         rounded-sm text-white text-sm font-medium tracking-wide 
                         bg-black/40 backdrop-blur-sm "
                >
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductCategory;
