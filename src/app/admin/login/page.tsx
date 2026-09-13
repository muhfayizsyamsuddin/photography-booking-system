"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Email atau password salah.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee]">
      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex flex-col border-b border-[#d8d2ca] px-6 py-8 lg:justify-between lg:border-b-0 lg:border-r lg:px-12 lg:py-12">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#8b7866]">
              Photography
            </p>

            <p className="mt-1 text-xl font-semibold tracking-tight text-[#171717]">
              Admin
            </p>
          </div>

          <div className="mt-14 max-w-md lg:mt-0">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#8b7866]">
              Management
            </p>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-[#171717] sm:text-5xl">
              Welcome back.
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#6d6963]">
              Sign in to manage bookings, photography packages, and portfolio
              content.
            </p>
          </div>

          <Link
            href="/"
            className="mt-10 self-start border-b border-[#171717] pb-1 text-sm font-medium text-[#171717] transition-opacity hover:opacity-60 lg:mt-0"
          >
            ← Back to website
          </Link>
        </section>

        <section className="flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            <div className="border border-[#d8d2ca] bg-[#fcfaf7]">
              <div className="border-b border-[#d8d2ca] px-5 py-5 sm:px-6">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8b7866]">
                  Admin Access
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#171717]">
                  Sign in
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#6d6963]">
                  Enter your administrator credentials to continue.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6 px-5 py-6 sm:px-6"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    disabled={isLoading}
                    className="mt-2 w-full border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#a39b92] focus:border-[#8b7866] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8b7866]"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="mt-2 w-full border border-[#d8d2ca] bg-[#fcfaf7] px-3 py-2.5 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#a39b92] focus:border-[#8b7866] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {error && (
                  <div className="border border-red-200 bg-red-50 px-3 py-2.5">
                    <p className="text-sm text-red-700">
                      {error}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}