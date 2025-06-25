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
import { Fragment } from "react";

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
          },
        ]
      : [Fragment, {}];

    const buttonData: { label: string; href: string }[] = [
      ...(!signedIn
        ? [
            { label: "Sign In", href: "/sign-in" },
            { label: "Sign Up", href: "/sign-up" },
          ]
        : []),
      { label: "Rules", href: "/rules" },
    ];

    return (
      <div
        className={`flex ${isMobile ? "flex-col gap-3" : "items-center gap-2"}`}
      >
        {signedIn && (
          <div className="px-3">
            {userName || "USERNAME error! (try refreshing page)"}
          </div>
        )}
        {buttonData.map(({ label, href }, ind) => (
          <SheetCloseWrapper
            {...sheetCloseWrapperProps}
            key={`nav-bar-sheet-button-${ind}`}
          >
            <Button asChild size="sm" variant="ghost">
              <Link href={href}>{label}</Link>
            </Button>
          </SheetCloseWrapper>
        ))}
        {signedIn && (
          <>
            {userName && <ClientSettingsDialog username={userName} />}
            <form action={signOutAction}>
              <Button type="submit" variant="ghost" className="w-full">
                Sign out
              </Button>
            </form>
          </>
        )}
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
