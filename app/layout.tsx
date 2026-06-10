import type { Metadata } from "next";
import { Archivo, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/lib/progress";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const body = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-jb",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "dbt onboarding · WNL Analytics",
    template: "%s · dbt onboarding",
  },
  description:
    "A practical course for SQL analysts joining the WNL dbt-analytics project: layers, refs, tests, git and your first pull request. Not an official dbt Labs product.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="grain min-h-full">
        <ProgressProvider>
          <Header />
          <div className="mx-auto flex max-w-7xl">
            <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 border-r border-line lg:block">
              <Sidebar />
            </aside>
            <main className="min-w-0 flex-1">{children}</main>
          </div>
          <footer className="border-t border-line py-6 text-center font-mono text-[11px] text-ink-faint">
            Built by the WNL Analytics team · dbt™ is a trademark of dbt Labs, Inc. — this
            guide is a community resource, not an official dbt product.
          </footer>
        </ProgressProvider>
      </body>
    </html>
  );
}
