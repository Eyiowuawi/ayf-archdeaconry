import { BreadcrumbLabel } from "@/shared/layout/breadcrumb-label";
import { PageHeader } from "@/shared/layout/page-header";
import { notFound } from "next/navigation";
import { DevotionalForm } from "@/features/devotionals/components/devotional-form";
import { NoDatabase } from "@/shared/ui/states";
import { adminStore } from "@/features/auth/utils/session";

export async function EditDevotionalPage({ params }: { params: Promise<{ slug: string }> }) {
  const store = await adminStore();
  if (!store)
    return (
      <>
        <PageHeader title="Edit devotional" />
        <NoDatabase />
      </>
    );
  const devotional = await store.getDevotional((await params).slug);
  if (!devotional) notFound();
  return (
    <>
      <BreadcrumbLabel path={`/admin/devotionals/${devotional.slug}`} label={devotional.title} />
      <PageHeader
        title="Edit devotional"
        back={{ href: "/admin/devotionals", label: "All devotionals" }}
      />
      <DevotionalForm devotional={devotional} />
    </>
  );
}
