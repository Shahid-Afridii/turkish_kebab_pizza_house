export const formatPrice = (price, locale = "en-GB", currency = "GBP") => {
  // ✅ Convert price string to a number safely
  const numericPrice =
    typeof price === "string" && price.trim() !== "" ? parseFloat(price) : price;

  // ✅ If price is missing, null, empty, or 0, return "£0.00"
  if (!numericPrice || isNaN(numericPrice)) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(0);
  }

  // ✅ Use `formatToParts()` to control spacing properly
  const formattedParts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).formatToParts(numericPrice);

  // ✅ Manually insert space after the currency symbol
  return formattedParts
    .map((part) => (part.type === "currency" ? `${part.value} ` : part.value))
    .join("");
};
