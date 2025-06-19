import { ProductCardType } from "@/lib/shopify/types";

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

// Utility function to extract size options from products
export const extractSizeOptions = (products: ProductCardType[]) => {
  const sizeSet = new Set<string>();
  
  products.forEach(product => {
    if (product.metafields && Array.isArray(product.metafields)) {
      const sizeMetafield = product.metafields.find(m => m && m.key === "size");
      if (sizeMetafield && sizeMetafield.references && sizeMetafield.references.nodes) {
        sizeMetafield.references.nodes.forEach(node => {
          if (node && node.handle) {
            sizeSet.add(node.handle.toUpperCase());
          }
        });
      }
    }
  });
  
  // Custom sorting for sizes: S, M, L, XL, XXL, etc.
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const sortedSizes = Array.from(sizeSet).sort((a, b) => {
    const indexA = sizeOrder.indexOf(a);
    const indexB = sizeOrder.indexOf(b);
    
    // If both sizes are in the predefined order, sort by their index
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    
    // If only one is in the predefined order, prioritize it
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    
    // If neither is in the predefined order, sort alphabetically
    return a.localeCompare(b);
  });
  
  return sortedSizes.map(size => ({
    value: size.toLowerCase(),
    label: size
  }));
};

// Utility function to extract category options from products
export const extractCategoryOptions = (products: ProductCardType[]) => {
  const categorySet = new Set<string>();
  
  products.forEach(product => {
    if (product.productType) {
      categorySet.add(product.productType);
    }
  });
  
  return Array.from(categorySet).sort().map(category => ({
    value: category.toLowerCase().replace(/\s+/g, "-"),
    label: category
  }));
};

// Utility function to extract gender options from products
export const extractGenderOptions = (products: ProductCardType[]) => {
  const genderSet = new Set<string>();
  
  products.forEach(product => {
    if (product.metafields && Array.isArray(product.metafields)) {
      const genderMetafield = product.metafields.find(m => m && m.key === "target-gender");
      if (genderMetafield && genderMetafield.references && genderMetafield.references.nodes) {
        genderMetafield.references.nodes.forEach(node => {
          if (node && node.handle) {
            const gender = node.handle === "male" ? "Men" : 
                          node.handle === "female" ? "Women" : 
                          node.handle === "unisex" ? "Unisex" : node.handle;
            genderSet.add(gender);
          }
        });
      }
    }
  });
  
  return Array.from(genderSet).sort().map(gender => ({
    value: gender.toLowerCase(),
    label: gender
  }));
};

// Utility function to check if product matches size filter
export const productMatchesSize = (product: ProductCardType, selectedSizes: string[]) => {
  if (selectedSizes.length === 0) return true;
  
  if (!product.metafields || !Array.isArray(product.metafields)) return false;
  
  const sizeMetafield = product.metafields.find(m => m && m.key === "size");
  if (!sizeMetafield || !sizeMetafield.references || !sizeMetafield.references.nodes) return false;
  
  const productSizes = sizeMetafield.references.nodes
    .filter(node => node && node.handle)
    .map(node => node.handle.toUpperCase());
  
  return selectedSizes.some(selectedSize => 
    productSizes.includes(selectedSize.toUpperCase())
  );
};

// Utility function to check if product matches category filter
export const productMatchesCategory = (product: ProductCardType, selectedCategories: string[]) => {
  if (selectedCategories.length === 0) return true;
  
  if (!product.productType) return false;
  
  return selectedCategories.some(selectedCategory => 
    product.productType?.toLowerCase() === selectedCategory.toLowerCase()
  );
};

// Utility function to check if product matches gender filter
export const productMatchesGender = (product: ProductCardType, selectedGenders: string[]) => {
  if (selectedGenders.length === 0) return true;
  
  if (!product.metafields || !Array.isArray(product.metafields)) return false;
  
  const genderMetafield = product.metafields.find(m => m && m.key === "target-gender");
  if (!genderMetafield || !genderMetafield.references || !genderMetafield.references.nodes) return false;
  
  const productGenders = genderMetafield.references.nodes
    .filter(node => node && node.handle)
    .map(node => {
      const gender = node.handle === "male" ? "Men" : 
                    node.handle === "female" ? "Women" : 
                    node.handle === "unisex" ? "Unisex" : node.handle;
      return gender;
    });
  
  return selectedGenders.some(selectedGender => 
    productGenders.includes(selectedGender)
  );
}; 