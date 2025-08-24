"use server";

import { cookies } from "next/headers";

export async function saveLocationFilters(data: {
  latitude?: string;
  longitude?: string;
  zip_code?: string;
  kilometers?: string;
  address?: string;
  delivery_method?: string;
}) {
  (await cookies()).set("latitude", data.latitude ?? "", { path: "/" });
  (await cookies()).set("longitude", data.longitude ?? "", { path: "/" });
  (await cookies()).set("kilometers", data.kilometers ?? "", { path: "/" });
  (await cookies()).set("zip_code", data.zip_code ?? "", { path: "/" });
  (await cookies()).set("address", data.address ?? "", {
    path: "/",
  });
  (await cookies()).set("delivery_method", data.delivery_method ?? "", {
    path: "/",
  });

  return { success: true };
}
