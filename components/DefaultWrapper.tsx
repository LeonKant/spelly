import Link from "next/link";
import { PropsWithChildren } from "react";
import MainHeader from "./header/MainHeader";
import { cn } from "@/utils/cn";

export default function DefaultWrapper({
  centerChildren = false,
  children,
  innerClassName = "",
}: { innerClassName?: string; centerChildren?: boolean } & PropsWithChildren) {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center">
      <div
        className={`flex w-full flex-1 flex-col justify-between ${centerChildren ? "items-center" : ""}`}
      >
        <MainHeader />
        <div
          className={cn(
            `flex p-5 px-12 ${centerChildren ? "max-w-5xl flex-col" : "flex-1"}`,
            innerClassName,
          )}
        >
          {children}
        </div>
        <footer className="mx-auto flex w-full items-center justify-center gap-2 border-t py-16 text-center text-xs">
          <Link href={"/privacy"} className="underline">
            Privacy Policy
          </Link>{" "}
          &middot;
          <Link href={"/terms"} className="underline">
            Terms of Service
          </Link>
        </footer>
      </div>
    </main>
  );
}
