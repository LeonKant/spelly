import DefaultWrapper from "@/components/DefaultWrapper";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DefaultWrapper centerChildren>
      <div className="max-w-7xl flex flex-col gap-12 items-start">
        {children}
      </div>
    </DefaultWrapper>
  );
}
