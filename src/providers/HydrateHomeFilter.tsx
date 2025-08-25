"use client";

import { FilterState, useHomeFilter } from "@/features/listing/store";
import { useEffect } from "react";

export default function HydrateHomeFilter({
  initialFilter,
}: {
  initialFilter: FilterState;
}) {
  const { setFilter } = useHomeFilter();

  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter, setFilter]);

  return null;
}
