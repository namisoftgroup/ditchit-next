export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const SORT_BY = [
  {
    name: "Best",
    value: "best",
  },
  {
    name: "Latest",
    value: "latest",
  },
  {
    name: "Lowest Price",
    value: "lowest",
  },
  {
    name: "Highest Price",
    value: "highest",
  },
  {
    name: "Near By",
    value: "near",
  },
];

export const SHIPPING_METHODS = [
  {
    name: "Local + Shipping",
    value: "both",
  },
  {
    name: "Local",
    value: "local",
  },
  {
    name: "Shipping",
    value: "shipping",
  },
];
