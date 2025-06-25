import { cn } from "@/utils/cn";
import { PropsWithChildren } from "react";

interface Props {
  className?: string;
}
export function PageTemplate({
  className = "",
  children,
}: Props & PropsWithChildren) {
  return <div className={cn(`flex flex-col py-5`, className)}>{children}</div>;
}
