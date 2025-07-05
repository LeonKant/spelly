import { PageTemplate } from "@/components/PageTemplate";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <PageTemplate className="flex-1 items-center">
      <div className="w-full max-w-5xl flex-1 px-12">{children}</div>
    </PageTemplate>
  );
}
