import React, { useEffect, useMemo, useState, memo } from "react";
import { Link } from "react-router-dom";

function AccessoriesCollection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseURL = useMemo(
    () => (import.meta.env.VITE_APP_SERVER_URL || "http://localhost:5000").replace(/\/$/, ""),
    []
  );

  useEffect(() => {
    let alive = true;

    const fetchAccessoriesProducts = async () => {
      try {
        const res = await fetch(`${baseURL}/api/products/public/home/accessories?limit=12`);
        const json = await res.json();

        const list = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json?.products)
          ? json.products
          : [];

        if (!alive) return;
        setProducts(list);
      } catch (err) {
        console.error("Error loading accessories collection:", err);
        if (!alive) return;
        setProducts([]);
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    fetchAccessoriesProducts();

    return () => {
      alive = false;
    };
  }, [baseURL]);

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-gray-100 via-gray-200 to-blue-100 py-7 px-5">
        <div className="max-w-full mx-auto text-center px-0 xl:px-3">
          <div className="h-7 w-60 mx-auto bg-gray-300 rounded animate-pulse mb-3" />
          <div className="h-5 w-72 mx-auto bg-gray-200 rounded animate-pulse mb-8" />

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 mt-2 md:mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-md overflow-hidden shadow">
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
        <h2 className="text-2xl font-semibold mb-2">Accessories Collection</h2>
        <p className="text-gray-800 mb-8">Grab these new items before they are gone!</p>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 mt-2 md:mt-8">
          {Array.isArray(products) &&
            products.map((product, index) => {
              const regularPrice = Number(product?.regularPrice || 0);
              const sellPrice = Number(product?.price || 0);
              const showStrike = regularPrice > sellPrice;

              const firstImage =
                Array.isArray(product?.productImage) && product.productImage.length > 0
                  ? product.productImage[0]
                  : "/placeholder.png";

              const isPriorityImage = index < 2;

              return (
                <article
                  key={product?._id}
                  className="bg-white rounded-md overflow-hidden shadow relative group hover:shadow-lg transition-shadow duration-300"
                >
                  <Link to={`/product-details/${product?._id}`} className="block h-full">
                    <div className="relative overflow-hidden">
                      <span className="absolute top-2 right-2 z-10 bg-teal-400 text-white text-xs font-semibold px-2 py-1 rounded">
                        NEW
                      </span>

                      <img
                        src={firstImage}
                        alt={product?.productName || "Product"}
                        className="w-full h-64 object-cover"
                        loading={isPriorityImage ? "eager" : "lazy"}
                        fetchPriority={isPriorityImage ? "high" : "low"}
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/placeholder.png";
                        }}
                      />

                      <div className="absolute bottom-0 py-2 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-all duration-300 bg-black/80">
                        <span className="w-full text-white font-semibold transition-colors duration-200">
                          Add to Cart
                        </span>
                      </div>
                    </div>

                    <div className="md:p-2 p-1.5 text-center">
                      <h3 className="text-sm font-normal md:font-medium text-gray-800 mb-1 line-clamp-2 min-h-[40px]">
                        {product?.productName}
                      </h3>

                      <div className="flex justify-center items-center gap-2">
                        {showStrike && (
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
          <Link to="/accessories">
            <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors duration-200">
              VIEW ALL
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default memo(AccessoriesCollection);