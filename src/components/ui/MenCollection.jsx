import React, { useEffect, useMemo, useState, memo } from "react";
import { Link } from "react-router-dom";

function MenCollection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sectionTitle, setSectionTitle] = useState("Men's Collection");
  const [subtitles, setSubtitles] = useState([
    "Grab these new items before they are gone!",
    "Fresh drops weekly!",
    "Best picks for you!",
  ]);
  const [subIndex, setSubIndex] = useState(0);

  const baseURL = useMemo(
    () => (import.meta.env.VITE_APP_SERVER_URL || "http://localhost:5000").replace(/\/$/, ""),
    []
  );

  useEffect(() => {
    let alive = true;

    const fetchData = async () => {
      try {
        const [settingsRes, productsRes] = await Promise.all([
          fetch(`${baseURL}/api/home-section-settings/men`),
          fetch(`${baseURL}/api/products/public/home/men?limit=12`),
        ]);

        const settingsJson = await settingsRes.json();
        const productsJson = await productsRes.json();

        if (!alive) return;

        const doc = settingsJson?.data;
        if (doc?.sectionTitle) {
          setSectionTitle(doc.sectionTitle);
        }

        const list = Array.isArray(doc?.subtitles) ? doc.subtitles : [];
        const activeSortedTexts = list
          .filter((s) => s?.isActive !== false && (s?.text || "").trim())
          .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
          .map((s) => s.text);

        if (activeSortedTexts.length > 0) {
          setSubtitles(activeSortedTexts);
        }

        const productList = Array.isArray(productsJson)
          ? productsJson
          : Array.isArray(productsJson?.data)
          ? productsJson.data
          : Array.isArray(productsJson?.products)
          ? productsJson.products
          : [];

        setProducts(productList);
      } catch (err) {
        console.error("Error loading men collection:", err);
        if (!alive) return;
        setProducts([]);
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      alive = false;
    };
  }, [baseURL]);

  useEffect(() => {
    if (!subtitles?.length || subtitles.length <= 1) return;

    const timer = setInterval(() => {
      setSubIndex((prev) => (prev + 1) % subtitles.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [subtitles]);

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-gray-100 via-gray-200 to-blue-100 py-7 px-5">
        <div className="max-w-full mx-auto text-center px-0 xl:px-3">
          <div className="h-7 w-48 mx-auto bg-gray-300 rounded animate-pulse mb-3" />
          <div className="h-5 w-72 mx-auto bg-gray-200 rounded animate-pulse mb-8" />

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 mt-2 md:mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-md overflow-hidden shadow"
              >
                <div className="w-full h-64 bg-gray-200 animate-pulse" />
                <div className="p-2 text-center">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-20 mx-auto bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-gray-100 via-gray-200 to-blue-100 py-7 px-5">
      <div className="max-w-full mx-auto text-center px-0 xl:px-3">
        <h2 className="text-2xl font-semibold mb-2">{sectionTitle}</h2>

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

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 mt-2 md:mt-8">
          {products.map((product, index) => {
            const regularPrice = Number(product?.regularPrice || 0);
            const sellPrice = Number(product?.price || 0);
            const showDiscountStyle = regularPrice > sellPrice;

            const firstImage =
              Array.isArray(product?.productImage) && product.productImage.length > 0
                ? product.productImage[0]
                : "/placeholder.png";

            const isPriorityImage = index < 2;

            return (
              <article
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
                      loading={isPriorityImage ? "eager" : "lazy"}
                      fetchPriority={isPriorityImage ? "high" : "low"}
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder.png";
                      }}
                    />

                    <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-all duration-300 bg-black/80 py-2">
                      <span className="w-full text-white font-semibold transition-colors duration-200">
                        Add to Cart
                      </span>
                    </div>
                  </div>

                  <div className="md:p-2 p-1.5 text-center">
                    <h3 className="text-sm font-normal md:font-medium text-gray-800 mb-1 line-clamp-2 min-h-[40px]">
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
              </article>
            );
          })}
        </div>

        <div className="mt-8">
          <Link to="/mensub">
            <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors duration-200">
              VIEW ALL
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default memo(MenCollection);