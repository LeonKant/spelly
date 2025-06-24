"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import { signOutAction } from "@/actions/form";
import { useIsMobile } from "@/hooks/use-mobile";
import { ModeToggle } from "../theme-toggle";
import { ClientSettingsDialog } from "../settings/ClientSettingsDialog";
import {
  Sheet,
  SheetClose,
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
export function NavBarSheet({ signedIn, userName }: Props) {
  const isMobile = useIsMobile();

  if (isMobile === undefined) {
    return;
  }

  const HeaderButtons = ({
    withSheetClose = false,
  }: {
    withSheetClose?: boolean;
  }) => {
    const [SheetCloseWrapper, sheetCloseWrapperProps] = withSheetClose
      ? [
          SheetClose,
          {
            asChild: true,
            className:
              "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary underline-offset-4 hover:underline",
          },
        ]
      : //                    Typescript BS
        [Button, { variant: "link" as "link" }];
    return (
      <div
        className={`flex ${isMobile ? "flex-col gap-3" : "items-center gap-2"}`}
      >
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
        <SheetCloseWrapper {...sheetCloseWrapperProps}>
          <Link href="/rules">Rules</Link>
        </SheetCloseWrapper>
        <ModeToggle />
      </div>
    );
  };

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Menu />
        </SheetTrigger>
        <SheetContent className="px-12 py-16">
          <SheetHeader className="hidden">
            <SheetTitle>Site User Settings</SheetTitle>
            <SheetDescription>
              Sign in, sign out, view settings, and create an account here.
            </SheetDescription>
          </SheetHeader>
          <HeaderButtons withSheetClose />
        </SheetContent>
      </Sheet>
    );
  }

  return <HeaderButtons />;
}
