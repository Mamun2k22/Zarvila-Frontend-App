import React, { useContext, useState } from "react";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import "./PopularProduct.css";
import FourBanner from "../../../../components/FourBanner";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "../../../../hooks/userContext";
import useCart from "../../../../hooks/useCart";
import Swal from "sweetalert2";
import useLoading from "../../../../hooks/useLoading";
import ProductLoader from "../../../../Spinner/ProductLoader";

const PopularProduct = () => {
  const [visibleProducts, setVisibleProducts] = useState(20);
  const { isLoading, showLoader, hideLoader } = useLoading();

  const showMoreProducts = () => {
    setVisibleProducts((prev) => prev + 10);
  };
  const [, refetch] = useCart();
  const { user } = useUser();
  const userId = user?.id;
  // console.log("userId", userId)
  const navigate = useNavigate();

  const {
    data: products = [],
    isLoading: queryLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      showLoader(); // Show loader when query starts
      const response = await fetch(
        `${import.meta.env.VITE_APP_SERVER_URL}api/products/public?limit=60`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      hideLoader(); // Hide loader after query completes
      return data;
    },
    onError: hideLoader,
  });

  const { mutate: addToCart } = useMutation({
    mutationFn: async ({ productId, quantity }) => {
      // Fix the typo in the URL
      const response = await axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}api/cart`,
        {
          productId,
          userId,
          quantity,
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      refetch();

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: "Product has been added to your cart!",
        customClass: {
          popup: "custom-swal-popup height-10",
          icon: "small-icon",
        },
      });
    },
    onError: (error) => {
      console.error("Error adding product to cart:", error);
      refetch().then((result) => {
        if (result.isConfirmed) {
          // navigate("/login");
        }
      });
    },
  });
  const handleAddToCart = (productId) => {
    const quantity = 1;

    // Check if the user is logged in (has a userId)
    if (!userId) {
      Swal.fire({
        icon: "warning",
        title: "Please Login",
        text: "You need to log in to add products to your cart.",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          // Navigate to the login page if the user clicks "Go to Login"
          navigate("/login");
        }
      });
    } else {
      // User is logged in, proceed to add to cart
      addToCart({ productId, quantity });
    }
  };

  const displayedProducts = products;

  // Display global loader if the custom loader or query loader is active
  if (isLoading || queryLoading) return <ProductLoader />;
  if (error) return <div>Error loading products: {error.message}</div>;

  // const productNav = [
  //   {
  //     id: "",
  //     name: "Kitchen",
  //   },
  // ];

  return (
    <>
      <div className="">
     {/* Feature bar */}
<div className="w-full my-6">
  <div className="relative flex items-center">
    {/* Label with gradient */}
    <span className="relative inline-block bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-4 py-1.5 text-sm font-semibold">
      Feature products
      {/* Right angled notch with same gradient */}
      <span
        className="absolute top-0 right-[-12px] h-full w-3 
                   bg-gradient-to-r from-orange-500 to-yellow-400 
                   [clip-path:polygon(0%_0%,100%_50%,0%_100%)]"
        aria-hidden="true"
      />
    </span>

    {/* Horizontal line */}
    <div className="flex-1 h-[1px] bg-gray-300 ml-4"></div>
  </div>
</div>



        <section className="mt-4">
          <div className="grid justify-items-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {displayedProducts.length > 0 ? (
              displayedProducts
                .slice(0, visibleProducts)
                .map((product, index) => (
                  <div
                    key={product._id}
                    className="m-2 md:m-2 lg:m-3
    bg-white border border-gray-200 hover:border-purple-400 
    rounded-xl shadow-md transition-all duration-300"
                  >
                    <div className="relative w-full">
                      {/* বাম পাশে Sale */}
                      <span className="absolute left-0 bg-[#ec5f3b] text-white text-xs font-medium px-5 py-1.5 rounded-tl-xl rounded-br-2xl transition-transform transition-opacity duration-300 hover:opacity-90 z-10">
                        Sale
                      </span>

                      {/* ডান পাশে Active/Stock */}
                      <span className="absolute right-0 bg-[#f38219] text-white text-xs font-medium px-3.5 py-1.5 rounded-tr-xl rounded-bl-2xl transition-transform transition-opacity duration-300 hover:opacity-90 z-10">
                        Active
                      </span>
                    </div>

                    <Link
                      key={product._id}
                      to={`/product-details/${product._id}`}
                    >
                      <div className="overflow-hidden w-full relative mx-auto">
                        <img
                          src={product.productImage}
                          alt={product.productName}
                          class="w-full xl:h-[32vh] xl:w-screen h-[20vh] 2xl:h-[30vh] relative z-0 transition-all duration-500 ease-in rounded rounded-tl-xl"
                        />
                      </div>

                      <div className="px-2 py-1.5 md:px-4 md:py-3">
                        <div>
                          <p className="text-gray-500 text-xs font-roboto">
                            {product.brand || "\u00A0"}{" "}
                            {/* Using Unicode for non-breaking space */}
                          </p>

                          <h2 className=" text-[14px] md:text-[15px] font-normal md:font-medium text-gray-800 mb-0 mt-1 h-[50px] font-poppins">
                            {product.productName.length > 34
                              ? `${product.productName.substring(0, 34)}...`
                              : product.productName || "\u00A0"}
                          </h2>

                          {/* Stars and Rating */}
                          <div className="flex items-center mb-2">
                            <div className="flex items-center gap-1 text-yellow-400">
                              <div className="flex text-yellow-500 text-sm my-1">
                                {[...Array(5)].map((_, i) =>
                                  i < product.rating ? (
                                    <FaStar key={i} />
                                  ) : (
                                    <FaRegStar key={i} />
                                  )
                                )}
                              </div>
                            </div>

                            {/* keep your existing rating text */}
                            <span className="text-gray-500 text-sm ml-2">
                              {(Number(product.rating) || 5).toFixed(1)}
                            </span>
                          </div>

                          {/* <p className="text-sm bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                            By{" "}
                            <span className="bg-gradient-to-r from-[#D425FE] to-[#7E15FC] bg-clip-text text-transparent font-semibold">
                              M M Trading
                            </span>
                          </p> */}
                        </div>
                      </div>
                    </Link>

                    <div className="flex justify-between px-2 md:px-4 pb-2">
                      <div className="flex items-center justify-between gap-2.5 mb-0 md:mb-4">
                        <div className="flex items-center gap-2">
                          {/* Price with big ৳ */}
                          <div className="flex items-baseline font-bold text-gray-800">
                            <span className="text-md text-red-500 mr-1">
                              TP: ৳
                            </span>
                            <span className="text-md">{product.price}</span>
                          </div>

                          {/* Discount badge */}
                          {product.discount && (
                            <span className="text-xs font-medium bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">
                              -{product.discount}%
                            </span>
                          )}
                        </div>

                        {/* Old price */}
                        {product.oldPrice && (
                          <div className="text-sm text-gray-400 line-through">
                            ৳ {product.oldPrice}
                          </div>
                        )}
                      </div>

                      <Link
                        key={product._id}
                        to={`/product-details/${product._id}`}
                        className="hidden sm:block"
                      >
                        {/* add to cart */}
                        <div>
                          <button
                            // onClick={() => handleAddToCart(product._id)}
                            className="font-poppins bg-gradient-to-r from-[#EC4237] to-orange-400 text-white font-light px-2 py-1 rounded-md flex items-center text-sm transform transition-transform duration-300 ease-in-out hover:scale-105 hover:opacity-90"
                          >
                            <HiOutlineShoppingCart className="w-4 h-4 mr-1" />
                            Cart
                          </button>
                        </div>
                      </Link>
                    </div>
                    {/* mobile device */}

                    <Link
                      key={product._id}
                      to={`/product-details/${product._id}`}
                      className="block lg:hidden pb-2.5"
                    >
                      <div className="flex justify-center items-center h-12">
                        {" "}
                        {/* Adjust h-16 or height as needed */}
                        <button className="font-poppins bg-gradient-to-r from-[#f29807] to-[#f87007] text-white font-light px-1.5 py-2 rounded-md flex justify-center items-center text-base transform transition-transform duration-300 ease-in-out hover:scale-105 hover:opacity-90 w-40">
                          <svg
                            className="h-4 w-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 3h18l-1.5 9H4.5L3 3zm6 13a2 2 0 114 0 2 2 0 01-4 0zm10 2a2 2 0 110-4 2 2 0 010 4z"
                            />
                          </svg>
                          Add to cart
                        </button>
                      </div>
                    </Link>
                  </div>
                ))
            ) : (
              <div>No products found</div>
            )}
          </div>

          {/* Show More Button */}
          {visibleProducts < products.length && (
            <div className="flex justify-center items-center mt-5">
              <button
                onClick={showMoreProducts}
                className="px-5 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:bg-green-600 transition"
              >
                Show more
              </button>
            </div>
          )}
        </section>
        {/* <div className="mt-4 2xl:mt-24">
          <FourBanner />
        </div> */}
      </div>
    </>
  );
};

export default PopularProduct;
