import { getStore } from "@/lib/db";
import { demoStore } from "@/lib/db/demoStore";

// Serves uploaded fliers. Ids are random UUIDs; files from the demo account are served too,
// so its sample events can show their fliers.
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response("Not found", { status: 404 });
  const file = (await getStore()?.getUpload(id)) ?? (await demoStore.getUpload(id));
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(Buffer.from(file.bytes), {
    headers: {
      "Content-Type": file.type,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
    },
  });
}
