export type Connection<T> = {
    edges: Array<{
        node: T;
    }>;
};

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

export type MetafieldReference = {
    id: string;
    handle: string;
    field?: {
        value: string;
    };
};

export type Metafield = {
    key: string;
    references: {
        nodes: MetafieldReference[];
    };
};

export type ProductCardType = {
    id: string;
    title: string;
    handle: string;
    priceRange: {
        minVariantPrice: MoneyV2;
    };
    images: Connection<Image>;
    variants: Connection<
        Pick<ProductVariant, "id" | "title" | "availableForSale" | "selectedOptions">
    >;
    productType?: string;
    metafields?: (Metafield | null)[];
};

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
    variants: Connection<ProductVariant>;
};

export type Shop = {
    name: string;
    description?: string;
};

export type Collection = {
    id: string;
    title: string;
    handle: string;
    description?: string;
    image?: Image;
};
