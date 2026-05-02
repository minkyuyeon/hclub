import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#070b10] p-4 text-white">
      <Suspense>
        <AuthForm mode="login" />
      </Suspense>
    </main>
  );
}
