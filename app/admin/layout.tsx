import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/login?next=/admin");
  }

  return <AdminShell email={user.email}>{children}</AdminShell>;
}
