import Link from "next/link";
import { PropsWithChildren } from "react";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { EnvVarWarning } from "./env-var-warning";
import { ModeToggle } from "./theme-toggle";
import HeaderAuth from "@/components/header-auth";

export default function DefaultWrapper({
  centerChildren = false,
  children,
}: { centerChildren?: boolean } & PropsWithChildren) {
  return (
    <main className="min-h-screen flex-1 flex flex-col items-center">
      <div
        className={`flex-1 w-full flex flex-col justify-between ${centerChildren && "items-center"}`}
      >
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-fit">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"} className="text-4xl">
                Spelly
              </Link>
            </div>
            <div className="flex gap-5">
              {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
              <ModeToggle />
            </div>
          </div>
        </nav>
        <div
          className={`flex ${centerChildren ? "flex-col gap-20 max-w-5xl p-5" : "flex-1"}`}
        >
          {children}
        </div>
        {/* <div className="flex-1">{children}</div> */}
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16"></footer>
      </div>
    </main>
  );
}
