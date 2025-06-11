const CATEGORY_ORDER = [
  "outer",
  "top",
  "bottom",
  "accessories"
];

export function getProductCategory(product: any): string {
  return (product.productType || "others").toLowerCase().trim();
}

export function sortProductsByCategory(products: any[]) {
  return [...products].sort((a, b) => {
    const catA = getProductCategory(a);
    const catB = getProductCategory(b);
    const idxA = CATEGORY_ORDER.indexOf(catA);
    const idxB = CATEGORY_ORDER.indexOf(catB);
    return (idxA === -1 ? CATEGORY_ORDER.length : idxA) - (idxB === -1 ? CATEGORY_ORDER.length : idxB);
  });
} 