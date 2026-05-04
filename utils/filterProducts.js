function filterProducts(products, query) {
  let filteredProducts = [...products];
  const { category, price } = query;

  if (category && category !== "all") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === category,
    );
  }

  if (price && price !== "all") {
    filteredProducts = filteredProducts.filter((product) => {
      if (price === "under-100") return product.price < 100;
      if (price === "100-500") return product.price >= 100 && product.price <= 500;
      if (price === "above-500") return product.price > 500;
      return true;
    });
  }

  return filteredProducts;
}

module.exports = filterProducts;
