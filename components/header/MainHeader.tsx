import Link from "next/link";
import HeaderServerAuth from "@/components/HeaderServerAuth";

export default function MainHeader() {
  return (
    <nav className="flex h-fit w-full justify-center border-b border-b-foreground/10">
      <div className="flex w-full max-w-5xl items-center justify-between p-3 px-12 text-sm">
        <div className="flex items-center gap-5 font-semibold">
          <Link href={"/"} className="text-4xl">
            Spelly
          </Link>
        </div>
        <HeaderServerAuth />
      </div>
    </nav>
  );
}
