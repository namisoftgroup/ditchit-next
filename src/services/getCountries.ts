import { CountriesResponse } from "@/types/country";
import { API_URL } from "@/utils/constants";

export async function getCountries(lang:string): Promise<CountriesResponse> {
  const response = await fetch(`${API_URL}/main/countries`, {
    method: "GET",
    headers: {
      lang: lang,
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error fetching categories:", errorText);
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}
