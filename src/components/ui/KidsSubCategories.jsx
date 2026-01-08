import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const withBase = (path) => {
  const base = import.meta.env.VITE_APP_SERVER_URL || "";
  const needsSlash = base.endsWith("/") ? "" : "/";
  return `${base}${needsSlash}${String(path).replace(/^\/+/, "")}`;
};

// LEFT arrow icon
const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 text-gray-700"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

// RIGHT arrow icon
const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 text-gray-700"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

// generic image container
const ImgIcon = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    className="w-16 h-16 md:w-48 md:h-40 object-cover"
  />
);

const VISIBLE_SUB_TILES = 6; // একসাথে ৬টা

const KidsSubCategories = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [subTiles, setSubTiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subsLoading, setSubsLoading] = useState(true);
  const [activeSubId, setActiveSubId] = useState(null);

  // visible window start index
  const [startIndex, setStartIndex] = useState(0);

  // 👉 সব Kids products
  useEffect(() => {
    const fetchAllKidsProducts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_APP_SERVER_URL}api/products/public/home/kids?all=true`
        );
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setAllProducts(list);
        setProducts(list); // শুরুতে সব show
      } catch (err) {
        console.error("Error loading kids products:", err);
        setAllProducts([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllKidsProducts();
  }, []);

  // 👉 Kids subcategories (dynamic tiles)
  useEffect(() => {
    const fetchKidsSubs = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_APP_SERVER_URL}api/subcategories`
        );
        const data = await res.json();

        const kidsSubs = (Array.isArray(data) ? data : []).filter(
          (sub) => sub.parentCategory?.name === "Kids"
        );

        setSubTiles(kidsSubs);
      } catch (err) {
        console.error("Error loading kids subcategories:", err);
        setSubTiles([]);
      } finally {
        setSubsLoading(false);
      }
    };

    fetchKidsSubs();
  }, []);

  // index safe রাখতে
  useEffect(() => {
    const maxStart = Math.max(0, subTiles.length - VISIBLE_SUB_TILES);
    if (startIndex > maxStart) setStartIndex(0);
  }, [subTiles, startIndex]);

  const visibleSubs = subTiles.slice(
    startIndex,
    startIndex + VISIBLE_SUB_TILES
  );

  const hasPrev = startIndex > 0;
  const hasNext = startIndex + VISIBLE_SUB_TILES < subTiles.length;

  const handleNext = () => {
    if (!hasNext) return;
    setStartIndex((prev) => {
      const next = prev + VISIBLE_SUB_TILES;
      const maxStart = subTiles.length - VISIBLE_SUB_TILES;
      return next > maxStart ? maxStart : next;
    });
  };

  const handlePrev = () => {
    if (!hasPrev) return;
    setStartIndex((prev) => {
      const next = prev - VISIBLE_SUB_TILES;
      return next < 0 ? 0 : next;
    });
  };

  const handleSubClick = (sub) => {
    setActiveSubId(sub._id);

    const filtered = allProducts.filter(
      (p) => Array.isArray(p.categories) && p.categories.includes(sub._id)
    );

    setProducts(filtered);
  };

  return (
    <>
      {/* উপরের Kids subcategory strip */}
      <div className="w-full bg-white py-6">
        <div className="max-w-full xl:px-8 mx-auto flex flex-col md:flex-row items-start md:items-center justify-center gap-4">
          {/* Left Title */}
          <div className="w-full md:w-1/5 text-left">
            <h2 className="text-xl font-bold tracking-wide text-gray-900 uppercase text-center md:text-start">
              Kids Shop
            </h2>
          </div>

          {/* Tiles container */}
          <div className="relative w-full md:w-4/5">
            {/* left circular arrow */}
            {hasPrev && !subsLoading && (
              <button
                type="button"
                onClick={handlePrev}
                className="hidden md:flex items-center justify-center
                           absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2
                           h-10 w-10 rounded-full bg-white shadow-md border border-gray-200
                           cursor-pointer hover:bg-gray-50 hover:shadow-lg z-10"
              >
                <ArrowLeftIcon />
              </button>
            )}

            {/* right circular arrow */}
            {hasNext && !subsLoading && (
              <button
                type="button"
                onClick={handleNext}
                className="hidden md:flex items-center justify-center
                           absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
                           h-10 w-10 rounded-full bg-white shadow-md border border-gray-200
                           cursor-pointer hover:bg-gray-50 hover:shadow-lg z-10"
              >
                <ArrowRightIcon />
              </button>
            )}

            {/* ৬টা টাইলের grid */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-0 px-4 md:px-0">
              {subsLoading ? (
                [...Array(VISIBLE_SUB_TILES)].map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center animate-pulse"
                  >
                    <div className="h-40 md:h-48 w-full flex items-center justify-center border border-gray-200 bg-gray-50" />
                    <p className="mt-3 h-3 w-16 bg-gray-200 rounded" />
                  </div>
                ))
              ) : (
                visibleSubs.map((sub) => {
                  const isActive = activeSubId === sub._id;
                  return (
                    <button
                      key={sub._id}
                      type="button"
                      onClick={() => handleSubClick(sub)}
                      className="flex flex-col items-center text-center focus:outline-none"
                    >
                      <div
                        className={`h-40 md:h-48 w-full flex items-center justify-center border transition ${
                          isActive
                            ? "border-gray-800"
                            : "border-gray-200 hover:border-gray-600"
                        }`}
                      >
                        <ImgIcon
                          src={withBase(sub.image || "")}
                          alt={sub.name}
                        />
                      </div>

                      <p className="mt-3 text-xs md:text-[13px] font-medium font-manrope text-gray-800 uppercase tracking-wide">
                        {sub.name}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* নিচে Kids products (filtered / all) */}
      <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-blue-100 py-10">
        <div className="max-w-full xl:px-8 mx-auto">
          <h3 className="text-2xl font-semibold mb-6 text-center md:text-left">
            All Kid&apos;s Products
          </h3>

          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-10 text-gray-600">
              No products found for this category.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4 md:px-0">
              {products.map((product) => {
                const oldPrice = product.price;
                const newPrice =
                  product.discount && product.discount > 0
                    ? Math.round(
                        oldPrice - (oldPrice * product.discount) / 100
                      )
                    : oldPrice;

                const firstImage =
                  Array.isArray(product.productImage) &&
                  product.productImage.length > 0
                    ? product.productImage[0]
                    : "";

                return (
                  <Link
                    to={`/product-details/${product._id}`}
                    key={product._id}
                    className="bg-white rounded-md overflow-hidden shadow relative group hover:shadow-lg transition-shadow duration-300 block"
                  >
                    <div className="relative overflow-hidden">
                      {product.discount > 0 && (
                        <span className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                          {product.discount}%
                        </span>
                      )}

                      <span className="absolute top-2 right-2 z-10 bg-teal-400 text-white text-xs font-semibold px-2 py-1 rounded">
                        NEW
                      </span>

                      <img
                        src={firstImage}
                        alt={product.productName}
                        className="w-full h-64 object-cover"
                      />

                      <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-all duration-300 bg-black bg-opacity-80">
                        <button
                          className="w-full py-2 text-white font-semibold hover:bg-gray-800 transition-colors duration-200"
                          onClick={(e) => e.preventDefault()}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>

                    <div className="md:p-2 p-1.5 text-center">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">
                        {product.productName}
                      </h4>
                      <div className="flex justify-center items-center gap-2">
                        {product.discount > 0 && (
                          <div className="text-gray-500 line-through text-xs">
                            Tk. {oldPrice}
                          </div>
                        )}
                        <div className="text-red-600 font-semibold text-sm">
                          Tk. {newPrice}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default KidsSubCategories;
