import Link from "next/link";
import { PropsWithChildren } from "react";
import MainHeader from "./header/MainHeader";

export default function DefaultLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center">
      <div className={`flex w-full flex-1 flex-col justify-between`}>
        <MainHeader />
        {children}
        <footer className="mx-auto flex w-full items-center justify-center gap-2 border-t py-8 text-center text-xs">
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
