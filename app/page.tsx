import { LoginForm } from "@/components/login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { ClearSession } from "./clear-session";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <ClearSession />
      <header className="flex justify-end">
        <ThemeToggle />
      </header>
      <main>
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}
