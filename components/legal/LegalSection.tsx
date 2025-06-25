import { PropsWithChildren } from "react";

export const LegalSection = ({ children }: PropsWithChildren) => (
  <section
    className={`space-y-4 [&_ul]:list-inside [&_ul]:list-disc [&_ul]:space-y-2`}
  >
    {children}
  </section>
);
