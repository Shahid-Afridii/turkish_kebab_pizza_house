import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";

const BRAND_NAME = "Turkish Kebab Pizza House";
const BRAND_PHONE = "02890202800";
const BRAND_ADDRESS = "346 Beersbridge Rd, Belfast";
const BRAND_LOGO = `${window.location.origin}/assets/Mask group.png`;

const seoConfig = {
  "/": {
    title: `Authentic Turkish Kebab & Pizza | ${BRAND_NAME}`,
    description: "Order authentic Turkish kebabs, wood-fired pizzas, wraps and more. Fresh, halal, and delivered hot to your door.",
    keywords: "Turkish kebab, wood-fired pizza, order food online, halal food, food delivery",
  },
  "/cart": {
    title: `Your Cart | ${BRAND_NAME}`,
    description: "Review your selected dishes before checkout.",
    keywords: "food cart, kebab cart, pizza cart, cart review",
  },
  "/checkout": {
    title: `Secure Checkout | ${BRAND_NAME}`,
    description: "Complete your order with secure online payment or cash on delivery. Fast and safe checkout.",
    keywords: "secure checkout, food payment, order confirmation, online food payment",
  },
  "/login": {
    title: `Login to Your Account | ${BRAND_NAME}`,
    description: "Sign in to access your order history, track deliveries, and manage account preferences.",
    keywords: "login, food delivery login, kebab app login, user authentication",
  },
  "/orders": {
    title: `My Orders | ${BRAND_NAME}`,
    description: "Track your food deliveries, view past orders and reorder your favorite dishes.",
    keywords: "order history, reorder Turkish food, pizza order status, food tracking",
  },
  "/info": {
    title: `Restaurant Info | ${BRAND_NAME}`,
    description: "Discover the story behind Turkish Kebab Pizza House — from our passion for Turkish flavors to our dedication to quality and service.",
    keywords: "about Turkish restaurant, kebab pizza story, halal restaurant info, brand story",
  },
  "/privacy-policy": {
    title: `Privacy Policy | ${BRAND_NAME}`,
    description: "Read our privacy policy to understand how we collect, use, and protect your personal data.",
    keywords: "privacy policy, data usage, customer security, food app privacy",
  },
  "/terms": {
    title: `Terms & Conditions | ${BRAND_NAME}`,
    description: "Review our terms and conditions before placing an order or using our website.",
    keywords: "terms and conditions, food order terms, service policies, user agreement",
  },
};

const DynamicSEO = () => {
  const location = useLocation();
  const path = location.pathname;
  const routeSEO = seoConfig[path] || seoConfig["/"];

  const { menu, menuItems, selectedCategoryId } = useSelector((state) => state.menu);

  const { categoryTitle, productTitles } = useMemo(() => {
    const selectedCategory = menu.find((cat) => cat.id === selectedCategoryId);
    const categoryTitle = selectedCategory?.name || "Menu";
    const productTitles = menuItems.map((item) => item.name).join(", ");
    return { categoryTitle, productTitles };
  }, [menu, menuItems, selectedCategoryId]);

  const dynamicTitle =
    path === "/" && productTitles
      ? `${categoryTitle} | ${productTitles} | ${BRAND_NAME}`
      : routeSEO.title;

  const dynamicDesc =
    path === "/" && productTitles
      ? `Try our delicious ${categoryTitle} options like ${productTitles}. Fresh, flavorful, and authentic—only at ${BRAND_NAME}.`
      : routeSEO.description;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: BRAND_NAME,
    telephone: BRAND_PHONE,
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND_ADDRESS,
      addressLocality: "Belfast",
      addressRegion: "NIR",
      postalCode: "BT5",
      addressCountry: "GB",
    },
    image: BRAND_LOGO,
    logo: BRAND_LOGO,
    url: window.location.origin,
    servesCuisine: ["Turkish", "Pizza", "Kebab"],
    priceRange: "$$",
    hasMenu: `${window.location.origin}/#menu`,
    openingHours: "Mo-Su 11:00-23:00",
    sameAs: [
      "https://facebook.com/yourpage",
      "https://instagram.com/yourpage",
      "https://x.com/yourpage"
    ]
  };

  const productListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Menu",
    itemListElement: menuItems.map((item, index) => ({
      "@type": "Product",
      position: index + 1,
      name: item.name,
      description: item.description || `Order ${item.name} now from ${BRAND_NAME}`,
      image: item.image || BRAND_LOGO,
      offers: {
        "@type": "Offer",
        priceCurrency: "GBP",
        price: item.price || "10.00",
        availability: "https://schema.org/InStock",
      },
    })),
  };

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${window.location.origin}/`
      },
      ...(path !== "/" ? [
        {
          "@type": "ListItem",
          position: 2,
          name: routeSEO.title.replace(` | ${BRAND_NAME}`, ""),
          item: `${window.location.origin}${path}`
        }
      ] : [])
    ]
  };

  return (
    <Helmet>
      <title>{dynamicTitle}</title>
      <meta name="title" content={dynamicTitle} />
      <meta name="description" content={dynamicDesc} />
      <meta name="keywords" content={routeSEO.keywords} />
      <meta name="robots" content="index, follow" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="author" content={BRAND_NAME} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <meta property="og:type" content="restaurant" />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:title" content={dynamicTitle} />
      <meta property="og:description" content={dynamicDesc} />
      <meta property="og:image" content={BRAND_LOGO} />
      <meta property="og:site_name" content={BRAND_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={window.location.href} />
      <meta name="twitter:title" content={dynamicTitle} />
      <meta name="twitter:description" content={dynamicDesc} />
      <meta name="twitter:image" content={BRAND_LOGO} />

      <link rel="canonical" href={window.location.href} />
      <link rel="icon" href="/favicon.ico" />
      <link rel="preload" href="/assets/Mask group.png" as="image" />
      <link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      {path === "/" && menuItems.length > 0 && (
        <script type="application/ld+json">{JSON.stringify(productListSchema)}</script>
      )}
      <script type="application/ld+json">{JSON.stringify(breadcrumbList)}</script>
    </Helmet>
  );
};

export default DynamicSEO;
