import { PageTemplate } from "@/components/PageTemplate";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageTemplate className="items-center">
      <div className="flex max-w-7xl flex-col items-start gap-12">
        {children}
      </div>
    </PageTemplate>
  );
}
