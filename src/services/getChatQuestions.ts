import { API_URL } from "@/utils/constants";

export async function getQuestions(lang: string): Promise<{
  data: { id: number; title: string }[];
}> {
  const response = await fetch(`${API_URL}/main/questions`, {
    method: "GET",
    headers: {
      lang: lang,
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error fetching questions:", errorText);
    throw new Error("Failed to fetch questions");
  }

  return response.json();
}
