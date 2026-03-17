import React, { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";

import HeroSlider from "../../components/HomeHero/HeroSlider";
import HomeMarqueeBar from "../../../src/components/ui/HomeMarqueeBar";
import ProductCategory from "../productCategory/ProductCategory";
import MenCollection from "../../components/ui/MenCollection";

const WomenCollection = lazy(() => import("../../components/ui/WomenCollection"));
const KidCollection = lazy(() => import("../../components/ui/KidCollection"));
const AccessoriesCollection = lazy(() => import("../../components/ui/AccessoriesCollection"));
const FeaturesBar = lazy(() => import("../../components/FeaturesBar"));
const OurBrands = lazy(() => import("../../components/OurBrands"));
const RecentlyViewed = lazy(() => import("../../components/RecentlyViewed"));

const SectionLoader = () => (
  <div className="py-8 text-center text-sm text-gray-500">Loading...</div>
);

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Zarvila</title>
        <meta name="description" content="M.M trading Center" />
        <meta
          name="keywords"
          content="Bholamart, online store, best deals, top products, daily bestsellers, shop Bholamart, popular categories"
        />
        <link rel="canonical" href="https://www.mmtrading.com/" />
      </Helmet>

      <h1 className="hidden text-lg md:text-3xl font-bold text-center mt-4 text-blue-500">
        Zarvilla - Your Trusted Online Store
      </h1>

      <HeroSlider />
      <HomeMarqueeBar />
      <ProductCategory />
      <MenCollection />

      <Suspense fallback={<SectionLoader />}>
        <WomenCollection />
        <KidCollection />
        <AccessoriesCollection />
        <FeaturesBar />
        <div className="mt-7">
          <OurBrands />
        </div>
        <RecentlyViewed />
      </Suspense>
    </div>
  );
};

export default Home;