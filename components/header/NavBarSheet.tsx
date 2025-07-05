"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Menu } from "lucide-react";
import { HeaderButtons } from "./HeaderButtons";

interface Props {
  signedIn: boolean;
  userName: string | null;
}
export function NavBarSheet({ signedIn, userName }: Props) {
  const isMobile = useIsMobile();

  if (isMobile === undefined) {
    return;
  }

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
          <HeaderButtons
            withSheetClose
            userName={userName}
            signedIn={signedIn}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return <HeaderButtons userName={userName} signedIn={signedIn} />;
}
