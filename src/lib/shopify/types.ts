// lib/shopify/types.ts

// Generic Edge and Node for GraphQL connections
export type Connection<T> = {
  edges: Array<{
    node: T;
  }>;
};

// Basic types for Price and Image
export type MoneyV2 = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
};

// Product Variant types (tetap dibutuhkan untuk menghitung jumlah warna)
export type ProductOption = {
  name: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: MoneyV2;
  compareAtPrice?: MoneyV2;
  selectedOptions: ProductOption[];
  image?: Image;
};

// --- TIPE BARU UNTUK PRODUCT CARD (Lebih Minimal) ---
export type ProductCardType = {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: MoneyV2;
  };
  images: Connection<Image>;
  variants: Connection<Pick<ProductVariant, 'id' | 'title' | 'availableForSale' | 'selectedOptions'>>; // Hanya ambil yang dibutuhkan untuk jumlah warna/varian
  productType?: string;
  // Anda bisa tambahkan properti lain yang relevan untuk kartu produk, misal `productType` jika ingin menampilkan kategori
};

// --- TIPE LENGKAP UNTUK PRODUCT DETAIL ---
export type ProductDetailType = {
  id: string;
  title: string;
  handle: string;
  descriptionHtml: string;
  priceRange: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
  images: Connection<Image>;
  variants: Connection<ProductVariant>; // Ambil semua detail varian
  // Anda bisa tambahkan properti lain yang relevan seperti vendor, productType, tags
};

// Shop type
export type Shop = {
  name: string;
  description?: string;
};

// Add more types as you need them (e.g., Collection, Cart, Customer, etc.)