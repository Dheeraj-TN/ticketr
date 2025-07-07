"use client";

import { Suspense } from "react";
import Spinner from "@/components/Spinner";
import SearchPage from "./SearchPage";

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<Spinner />}>
      <SearchPage />
    </Suspense>
  );
}
