import { API_URL } from "@/utils/constants";
import { Category } from "@/types/category";

export async function getCategories(): Promise<{ data: Category[] }> {
  const response = await fetch(`${API_URL}/main/categories`, {
    method: "GET",
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error fetching categories:", errorText);
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}
