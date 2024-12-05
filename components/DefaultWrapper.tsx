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
    <main className="flex min-h-screen flex-1 flex-col items-center">
      <div
        className={`flex w-full flex-1 flex-col justify-between ${centerChildren && "items-center"}`}
      >
        <nav className="flex h-fit w-full justify-center border-b border-b-foreground/10">
          <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
            <div className="flex items-center gap-5 font-semibold">
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
          className={`flex ${centerChildren ? "max-w-5xl flex-col gap-20 p-5" : "flex-1"}`}
        >
          {children}
        </div>
        {/* <div className="flex-1">{children}</div> */}
        <footer className="mx-auto flex w-full items-center justify-center gap-8 border-t py-16 text-center text-xs"></footer>
      </div>
    </main>
  );
}
