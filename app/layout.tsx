import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { CLIENT } from "@/config/var.config";
import DefaultLayout from "@/components/DefaultLayout";

export const metadata = {
  metadataBase: new URL(CLIENT.projectURL),
  title: "Spelly",
  description: "The best word game to ever be invented",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DefaultLayout>{children}</DefaultLayout>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
