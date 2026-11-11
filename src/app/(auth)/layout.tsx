import { Logo } from "@/components/layout/logo";
import { SiteFooter } from "@/components/layout/site-footer";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center gap-6 px-4 py-8">
        <Logo />
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
