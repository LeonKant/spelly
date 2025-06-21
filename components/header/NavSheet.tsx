"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import { signOutAction } from "@/actions/form";
import { useIsMobile } from "@/hooks/use-mobile";
import { ModeToggle } from "../theme-toggle";
import { ClientSettingsDialog } from "../settings/ClientSettingsDialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Menu } from "lucide-react";

interface Props {
  signedIn: boolean;
  userName: string | null;
}
export function SiteSettings({ signedIn, userName }: Props) {
  const isMobile = useIsMobile();

  const HeaderButtons = () => (
    <div className={`flex ${isMobile ? "flex-col" : "items-center"} gap-4`}>
      {signedIn ? (
        <>
          {userName || "USERNAME error! (try refreshing page)"}
          <form action={signOutAction}>
            <Button type="submit" variant={"outline"} className="w-full">
              Sign out
            </Button>
          </form>
          {userName && <ClientSettingsDialog username={userName} />}
        </>
      ) : (
        <>
          <Button asChild size="sm" variant={"outline"}>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm" variant={"default"}>
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </>
      )}
      <Button variant={"link"}>
        <Link href="/rules">Rules</Link>
      </Button>
      <ModeToggle />
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button className="bg-inherit [&_svg]:size-9" variant="link">
            <Menu />
          </Button>
        </SheetTrigger>
        {/* &_svg]:size-9 for 'x' button */}
        <SheetContent className="px-4 py-16">
          <SheetHeader className="hidden">
            <SheetTitle>Site User Settings</SheetTitle>
            <SheetDescription>
              Sign in, sign out, view settings, and create an account here.
            </SheetDescription>
          </SheetHeader>
          <HeaderButtons />
        </SheetContent>
      </Sheet>
    );
  }

  return <HeaderButtons />;
}
