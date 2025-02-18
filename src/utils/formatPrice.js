export const formatPrice = (price, locale = "en-GB", currency = "EUR") => {
    if (!price || typeof price !== "number" || isNaN(price)) {
      return "No Price Available"; // ✅ Handle invalid/missing price
    }
  
    // ✅ Use `formatToParts()` to control spacing properly
    const formattedParts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).formatToParts(price);
  
    // ✅ Manually insert space after the currency symbol
    return formattedParts
      .map((part) => (part.type === "currency" ? `${part.value} ` : part.value))
      .join("");
  };
  