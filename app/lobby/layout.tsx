import DefaultWrapper from "@/components/DefaultWrapper";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return <DefaultWrapper>{children}</DefaultWrapper>;
}
