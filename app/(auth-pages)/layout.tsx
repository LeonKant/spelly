import DefaultWrapper from "@/components/DefaultWrapper";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DefaultWrapper centerChildren>
      <div className="flex max-w-7xl flex-col items-start gap-12">
        {children}
      </div>
    </DefaultWrapper>
  );
}
