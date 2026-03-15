// src/pages/KidsCollection.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const KidCollection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseURL = import.meta.env.VITE_APP_SERVER_URL; // e.g. http://localhost:5000/

  // ✅ dynamic header states
  const [sectionTitle, setSectionTitle] = useState("Kid's Collection");
  const [subtitles, setSubtitles] = useState([
    "Comfort meets style for the little ones!",
    "Play-ready favorites!",
    "Cute + comfy picks!",
  ]);
  const [subIndex, setSubIndex] = useState(0);

  // helper: safe parse list
  const pickList = (data) =>
    Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.products)
      ? data.products
      : [];

  // 1) kids section title/subtitles from backend
  useEffect(() => {
    const fetchKidsSectionSettings = async () => {
      try {
        const res = await fetch(`${baseURL}api/home-section-settings/kids`);
        const json = await res.json();

        const doc = json?.data;
        if (doc?.sectionTitle) setSectionTitle(doc.sectionTitle);

        const list = Array.isArray(doc?.subtitles) ? doc.subtitles : [];
        const activeSortedTexts = list
          .filter((s) => s?.isActive !== false && (s?.text || "").trim())
          .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
          .map((s) => s.text);

        if (activeSortedTexts.length >= 1) setSubtitles(activeSortedTexts);
      } catch (err) {
        console.error("Error loading kids section settings:", err);
      }
    };

    fetchKidsSectionSettings();
  }, [baseURL]);

  // 2) subtitle carousel auto rotate ✅ (ONLY ONCE)
  useEffect(() => {
    if (!subtitles?.length || subtitles.length <= 1) return;

    const t = setInterval(() => {
      setSubIndex((p) => (p + 1) % subtitles.length);
    }, 2500);

    return () => clearInterval(t);
  }, [subtitles]);

  // 3) kids products fetch
  useEffect(() => {
    const fetchKidsProducts = async () => {
      try {
        const res = await fetch(`${baseURL}api/products/public/home/kids?limit=12`);
        const json = await res.json();
        setProducts(pickList(json));
      } catch (err) {
        console.error("Error loading kids collection:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKidsProducts();
  }, [baseURL]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-blue-100 min-h-screen py-7 px-5">
      <div className="max-w-full mx-auto text-center px-0 xl:px-3">
        <h2 className="text-2xl font-semibold mb-2">{sectionTitle}</h2>

        {/* subtitle */}
        <div className="w-full flex justify-center mb-8">
          <div className="relative h-7 md:h-8 overflow-hidden w-full max-w-xl">
            <div
              className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${subIndex * 100}%)` }}
            >
              {subtitles.map((text, i) => (
                <div
                  key={i}
                  className="w-full flex-shrink-0 flex items-center justify-center"
                >
                  <p className="text-gray-800">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 mt-2 md:mt-8">
          {products.map((product) => {
            const regularPrice = Number(product?.regularPrice || 0);
            const sellPrice = Number(product?.price || 0);
            const showDiscountStyle = regularPrice > sellPrice;

            const firstImage =
              Array.isArray(product?.productImage) && product.productImage.length > 0
                ? product.productImage[0]
                : "";

            return (
              <div
                key={product._id}
                className="bg-white rounded-md overflow-hidden shadow relative group hover:shadow-lg transition-shadow duration-300"
              >
                <Link to={`/product-details/${product._id}`} className="block h-full">
                  <div className="relative overflow-hidden">
                    <span className="absolute top-2 right-2 z-10 bg-teal-400 text-white text-xs font-semibold px-2 py-1 rounded">
                      NEW
                    </span>

                    <img
                      src={firstImage}
                      alt={product.productName}
                      className="w-full h-64 object-cover"
                    />

                    <div className="absolute bottom-0 py-2 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-all duration-300 bg-black bg-opacity-80">
                      <Link
                        to={`/product-details/${product._id}`}
                        className="w-full text-white font-semibold transition-colors duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Add to Cart
                      </Link>
                    </div>
                  </div>

                  <div className="md:p-2 p-1.5 text-center">
                    <h3 className="text-sm font-normal md:font-medium text-gray-800 mb-1">
                      {product.productName}
                    </h3>

                    <div className="flex justify-center items-center gap-2">
                      {showDiscountStyle && (
                        <div className="text-gray-500 line-through text-xs">
                          Tk. {regularPrice}
                        </div>
                      )}
                      <div className="text-red-600 font-semibold text-sm">
                        Tk. {sellPrice}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* View All button */}
        <Link to={"/kidsub"}>
          <div className="mt-8">
            <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors duration-200">
              VIEW ALL
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default KidCollection;