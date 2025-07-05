import { PageTemplate } from "@/components/PageTemplate";
import { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <PageTemplate className="items-center">
      <div className="flex max-w-7xl flex-col items-start gap-12">
        {children}
      </div>
    </PageTemplate>
  );
}
