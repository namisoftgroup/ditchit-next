import { CountriesResponse } from "@/types/country";
import { API_URL } from "@/utils/constants";

export async function getCountries(lang: string): Promise<CountriesResponse> {
  const response = await fetch(`${API_URL}/main/countries`, {
    method: "GET",
    headers: {
      lang: lang === "zh" ? "zh-CN" : lang === "pt" ? "pt-BR" : lang,
    },
    next: { revalidate: false },
    // cache: "force-cache",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error fetching countries:", errorText);
    throw new Error("Failed to fetch countries");
  }

  return response.json();
}
