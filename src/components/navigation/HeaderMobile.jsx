import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import settingsApi from "../../hooks/settingsApi.jsx";
import {
  FiSearch,
  FiMenu,
  FiX,
  FiUser,
  FiChevronDown,
  FiShoppingCart,
  FiChevronLeft,
} from "react-icons/fi";

function HeaderMobile({
  cart,
  user,
  categories = [],
  mobileMenue = [],
  searchTerm,
  setSearchTerm,
  searchResults = [],
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeInnermenue, setActiveInnermenue] = useState(null);
  const [openResults, setOpenResults] = useState(false);

  const [siteLogo, setSiteLogo] = useState("");
  const [siteBrand, setSiteBrand] = useState("Zarvila");

  const nav = useNavigate();
  const inputRef = useRef(null);

  const baseBtn =
    "inline-flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const iconBtn =
    baseBtn +
    " w-10 h-10 bg-white/90 border border-gray-200 active:scale-[.98]";

  const cartCount = Array.isArray(cart) ? cart.length : 0;

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await settingsApi.fetchPublicSettings();
        const data = res?.data || {};
        if (!alive) return;

        setSiteLogo(data.logoUrl || "");
        setSiteBrand(data.brandName || "Zarvila");
      } catch (e) {
        // fail silently
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const resolvedLogo = useMemo(() => {
    if (!siteLogo) return "";

    return /^(https?:)?\/\//i.test(siteLogo.trim())
      ? siteLogo.trim()
      : `${settingsApi.API_BASE}${siteLogo}`;
  }, [siteLogo]);

  useEffect(() => {
    if (!isSearchOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;
    const t = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
    return () => clearTimeout(t);
  }, [isSearchOpen]);

  useEffect(() => {
    const q = searchTerm?.trim();
    if (!q) {
      setOpenResults(false);
      return;
    }

    if (isSearchOpen) {
      setOpenResults(true);
    }
  }, [searchTerm, isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setOpenResults(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSearchOpen]);

  const onCloseSearch = () => {
    setIsSearchOpen(false);
    setOpenResults(false);
  };

  const onType = (val) => {
    setSearchTerm(val);

    if (!val.trim()) {
      setOpenResults(false);
    }
  };

  const onSubmitSearch = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;

    onCloseSearch();
    nav(`/search?q=${encodeURIComponent(q)}`);
  };

  const goToProduct = (id) => {
    onCloseSearch();
    setSearchTerm("");
    nav(`/product-details/${id}`);
  };

  const onAccountClick = () => {
    if (user) {
      nav("/dashboard/profile");
    } else {
      nav("/login");
    }
  };

  const handleMenuItemClick = (item) => {
    if (item.name === "Home") {
      setIsMenuOpen(false);
      nav("/");
      return;
    }

    if (item.name === "Contact") {
      setIsMenuOpen(false);
      nav("/contact");
      return;
    }
  };

  return (
    <div className="md:hidden block">
      <div className="relative py-3">
        <div className="flex justify-between items-center gap-2 w-full px-3.5">
          <button
            type="button"
            onClick={() => setIsMenuOpen((p) => !p)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className={iconBtn}
          >
            {isMenuOpen ? (
              <FiX className="text-gray-700 text-xl" />
            ) : (
              <FiMenu className="text-gray-700 text-xl" />
            )}
          </button>

          <Link
            to="/"
            aria-label="Go to home"
            className="flex items-center justify-center w-[140px] sm:w-[160px] -ml-1"
          >
            {resolvedLogo ? (
              <img
                className="h-8 w-full object-contain"
                src={resolvedLogo}
                alt={siteBrand}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/placeholder.png";
                }}
              />
            ) : (
              <span className="text-black font-semibold tracking-wide text-sm truncate">
                {siteBrand}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
              className={iconBtn}
            >
              <FiSearch className="text-gray-700 text-xl" />
            </button>

            <Link
              to="/dashboard/cart"
              aria-label="Cart"
              className={iconBtn + " relative"}
            >
              <FiShoppingCart className="text-gray-700 text-xl" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 h-4 min-w-4 px-1 rounded-full bg-emerald-600 text-[10px] text-white flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={onAccountClick}
              aria-label={user ? "Go to profile" : "Login"}
              className={iconBtn + " overflow-hidden"}
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                  loading="lazy"
                />
              ) : (
                <FiUser className="text-gray-700 text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mobile-menue w-full p-3 bg-white border-t border-slate-200 z-[60]">
          <ul className="flex flex-col gap-2 font-roboto">
            {mobileMenue.map((item, index) => {
              const isAllCat = item.name === "All Category";
              const isOpen = activeInnermenue === index;

              return (
                <li key={item.name || index}>
                  <button
                    type="button"
                    onClick={() => {
                      if (isAllCat) {
                        setActiveInnermenue((p) => (p === index ? null : index));
                      } else {
                        handleMenuItemClick(item);
                      }
                    }}
                    className="group w-full flex items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm font-semibold text-slate-900 hover:bg-indigo-50 hover:text-indigo-700 active:border-indigo-200"
                  >
                    <span className="flex items-center gap-2">
                      {item.icon ? (
                        <img
                          className="h-5 w-5"
                          src={item.icon}
                          alt=""
                          loading="lazy"
                        />
                      ) : (
                        <span className="h-5 w-5 rounded bg-slate-200" />
                      )}
                      <span className="text-base">{item.name}</span>
                    </span>

                    {isAllCat && (
                      <FiChevronDown
                        className={`text-lg transition-transform ${
                          isOpen ? "rotate-180 text-indigo-700" : "text-slate-500"
                        }`}
                      />
                    )}
                  </button>

                  {isAllCat && isOpen && (
                    <div className="mobile-nav-inner-menue mt-3 pl-1">
                      <ul className="grid grid-cols-2 gap-3">
                        {categories.map((category) => (
                          <li
                            key={category._id || category.name}
                            className="rounded-md hover:bg-indigo-50 transition"
                          >
                            <Link
                              to={`/category/${category.name}`}
                              onClick={() => {
                                setIsMenuOpen(false);
                                setActiveInnermenue(null);
                              }}
                              className="flex items-center gap-2 px-2 py-2"
                            >
                              {category.image && (
                                <img
                                  className="h-4 w-4 object-contain"
                                  src={category.image}
                                  alt=""
                                  loading="lazy"
                                />
                              )}
                              <span className="text-sm text-gray-700 font-medium">
                                {category.name}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <form onSubmit={onSubmitSearch} className="flex items-center gap-3 p-3">
            <button
              aria-label="Close search"
              type="button"
              onClick={onCloseSearch}
              className={baseBtn + " w-10 h-10"}
            >
              <FiChevronLeft className="text-2xl" />
            </button>

            <div className="flex items-center gap-2 w-full border border-gray-300 rounded-lg px-3 py-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for items…"
                className="flex-1 text-[15px] text-gray-800 outline-none"
                value={searchTerm}
                onChange={(e) => onType(e.target.value)}
                aria-label="Search products"
              />
              <button type="submit" aria-label="Search" className="p-1">
                <FiSearch className="text-gray-500 text-xl" />
              </button>
            </div>
          </form>

          <div className="px-3 pb-4">
            {openResults && (
              <MobileSearchResults
                results={searchResults}
                searchTerm={searchTerm}
                onSelect={goToProduct}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const MobileSearchResults = React.memo(function MobileSearchResults({
  results = [],
  searchTerm,
  onSelect,
}) {
  const items = Array.isArray(results) ? results.slice(0, 20) : [];

  if (!searchTerm?.trim()) return null;

  if (!items.length) {
    return <div className="px-1 py-2 text-sm text-gray-500">No results</div>;
  }

  return (
    <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 overflow-hidden">
      {items.map((p) => (
        <li
          key={p._id}
          className="flex items-center gap-3 px-3 py-2 active:bg-gray-100"
          onClick={() => onSelect(p._id)}
          role="button"
        >
          <img
            src={
              Array.isArray(p.productImage)
                ? p.productImage[0] || "/placeholder.png"
                : p.productImage || "/placeholder.png"
            }
            alt={p.productName}
            className="w-12 h-12 rounded object-cover border"
            loading="lazy"
          />
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-gray-800 truncate">
              {p.productName}
            </p>
            {p.price != null && (
              <p className="text-xs text-gray-500 truncate">৳ {p.price}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
});

export default React.memo(HeaderMobile);