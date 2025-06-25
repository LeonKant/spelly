import { PageTemplate } from "@/components/PageTemplate";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <PageTemplate className="items-center flex-1">
      <div className="max-w-5xl w-full flex-1 px-12">
        {children}
      </div>
    </PageTemplate>
  );
}
