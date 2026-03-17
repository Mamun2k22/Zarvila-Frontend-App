// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "./HeroSection.css";

// export default function HeroSlider() {
//   const [slides, setSlides] = useState([]);

//   // backend base url (production এ env দিয়ে দিবেন)
//   const API_BASE = import.meta.env.VITE_APP_SERVER_URL || "http://localhost:5000";

//   useEffect(() => {
//     const fetchBanners = async () => {
//       try {
//         const res = await fetch(`${API_BASE}api/banners`);
//         const data = await res.json();

//         // backend returns: [{ _id, imageUrl, title, ... }]
//         const mapped = (Array.isArray(data) ? data : []).map((b) => ({
//           id: b._id,
//           img: b.imageUrl?.startsWith("http")
//             ? b.imageUrl
//             : `${API_BASE}${b.imageUrl.startsWith("/") ? "" : "/"}${b.imageUrl}`,
//           to: b.to || "/shop-category",
//           title: b.title || "",
//         }));

//         setSlides(mapped);
//       } catch (err) {
//         console.error("Banner fetch error:", err);
//         setSlides([]);
//       }
//     };

//     fetchBanners();
//   }, []);

//   const NextArrow = ({ onClick }) => (
//     <button className="hero-arrow hero-arrow--next hidden md:flex" onClick={onClick} aria-label="Next">›</button>
//   );
//   const PrevArrow = ({ onClick }) => (
//     <button className="hero-arrow hero-arrow--prev hidden md:flex" onClick={onClick} aria-label="Prev">‹</button>
//   );

//   const settings = {
//     dots: true,
//     infinite: slides.length > 1,
//     speed: 500,
//     fade: true,
//     autoplay: slides.length > 1,
//     autoplaySpeed: 3200,
//     pauseOnHover: false,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//     responsive: [
//       { breakpoint: 640, settings: { fade: false, speed: 380, arrows: false } }
//     ]
//   };

//   // banners empty হলে slider render না করলেও হবে
//   if (!slides.length) return null;

//   return (
//     <div className="hero-full">
//       <Slider {...settings}>
//         {slides.map((s, i) => (
//           <div key={s.id} className="hero-slide">
//             <Link to={s.to} aria-label={s.title || `Banner ${i + 1}`}>
//               <img
//                 src={s.img}
//                 alt={s.title || `Banner ${i + 1}`}
//                 className="hero-img"
//                 loading={i === 0 ? "eager" : "lazy"}
//                 sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
//               />
//             </Link>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState, memo } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HeroSection.css";

function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = useMemo(
    () =>
      (import.meta.env.VITE_APP_SERVER_URL || "http://localhost:5000").replace(
        /\/$/,
        ""
      ),
    []
  );

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/banners`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch banners: ${res.status}`);
        }

        const data = await res.json();

        const mapped = (Array.isArray(data) ? data : []).map((b) => ({
          id: b._id,
          img: b.imageUrl?.startsWith("http")
            ? b.imageUrl
            : `${API_BASE}${b.imageUrl?.startsWith("/") ? "" : "/"}${b.imageUrl || ""}`,
          to: b.to || "/shop-category",
          title: b.title || "",
        }));

        if (isMounted) {
          setSlides(mapped);
          setLoading(false);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Banner fetch error:", err);
        }
        if (isMounted) {
          setSlides([]);
          setLoading(false);
        }
      }
    };

    fetchBanners();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [API_BASE]);

  const NextArrow = memo(({ onClick }) => (
    <button
      type="button"
      className="hero-arrow hero-arrow--next hidden md:flex"
      onClick={onClick}
      aria-label="Next"
    >
      ›
    </button>
  ));

  const PrevArrow = memo(({ onClick }) => (
    <button
      type="button"
      className="hero-arrow hero-arrow--prev hidden md:flex"
      onClick={onClick}
      aria-label="Previous"
    >
      ‹
    </button>
  ));

  const settings = useMemo(
    () => ({
      dots: true,
      infinite: slides.length > 1,
      speed: 400,
      fade: false,
      autoplay: slides.length > 1,
      autoplaySpeed: 3500,
      pauseOnHover: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      lazyLoad: "ondemand",
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      responsive: [
        {
          breakpoint: 640,
          settings: {
            arrows: false,
            speed: 320,
          },
        },
      ],
    }),
    [slides.length]
  );

  if (loading) {
    return (
      <div className="hero-full animate-pulse bg-gray-100">
        <div className="h-full w-full bg-gray-200" />
      </div>
    );
  }

  if (!slides.length) return null;

  return (
    <section className="hero-full" aria-label="Homepage banners">
      <Slider {...settings}>
        {slides.map((s, i) => (
          <div key={s.id} className="hero-slide">
            <Link to={s.to} aria-label={s.title || `Banner ${i + 1}`}>
              <img
                src={s.img}
                alt={s.title || `Banner ${i + 1}`}
                className="hero-img"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "low"}
                decoding="async"
                sizes="100vw"
              />
            </Link>
          </div>
        ))}
      </Slider>
    </section>
  );
}

export default memo(HeroSlider);