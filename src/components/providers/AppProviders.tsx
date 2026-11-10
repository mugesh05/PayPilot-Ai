"use client";

import React from "react";
import { FintechStoreProvider } from "@/lib/store/useFintechStore";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <FintechStoreProvider>{children}</FintechStoreProvider>;
}
