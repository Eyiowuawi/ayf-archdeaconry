"use client";

import { useBreadcrumbLabel } from "@/shared/hooks/use-breadcrumb-label";

/** Lets a server-rendered page name its record in the header breadcrumbs. */
export function BreadcrumbLabel({ path, label }: { path: string; label: string }) {
  useBreadcrumbLabel(path, label);
  return null;
}
