"use client";

import * as React from "react";
import { useUiStore } from "@/shared/store/ui-store";

/**
 * Registers a display label for a specific admin route, so the breadcrumb trail
 * can show a record's title instead of the slug from the URL. `path` is the exact
 * pathname the label applies to.
 */
export function useBreadcrumbLabel(path: string, label: string | undefined): void {
  const setBreadcrumbOverride = useUiStore((s) => s.setBreadcrumbOverride);

  React.useEffect(() => {
    setBreadcrumbOverride(path, label);
    return () => setBreadcrumbOverride(path, undefined);
  }, [path, label, setBreadcrumbOverride]);
}
