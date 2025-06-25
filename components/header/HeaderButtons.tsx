import { Fragment } from "react";
import { SheetClose } from "../ui/sheet";
import { signOutAction } from "@/actions/form";
import { Button } from "../ui/button";
import { ModeToggle } from "../theme-toggle";
import { ClientSettingsDialog } from "../settings/ClientSettingsDialog";
import Link from "next/link";

interface Props {
  withSheetClose?: boolean;
  signedIn: boolean;
  userName: string | null;
}
export const HeaderButtons = ({
  withSheetClose = false,
  signedIn,
  userName,
}: Props) => {
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
      className={`flex ${withSheetClose ? "flex-col gap-3" : "items-center gap-2"}`}
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
