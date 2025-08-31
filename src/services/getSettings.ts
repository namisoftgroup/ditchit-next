import { API_URL } from "@/utils/constants";

export type Setting = {
  id: number;
  about_us_text: string;
  privacy_text: string;
  terms_text: string;
  email: string;
  phone: string;
  twitter: string;
};

export async function getSettings(lang: string): Promise<{ data: Setting }> {
  const response = await fetch(`${API_URL}/main/setting`, {
    method: "GET",
    headers: {
      lang: lang,
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error fetching settings:", errorText);
    throw new Error("Failed to fetch settings");
  }

  return response.json();
}
