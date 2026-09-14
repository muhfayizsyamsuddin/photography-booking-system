import { PublicFooter } from "@/components/public/footer";
import { PublicNavbar } from "@/components/public/navbar";

type PublicLayoutProps = {
  children: React.ReactNode;
};

export default function PublicLayout({
  children,
}: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f3ee]">
      <PublicNavbar />

      <div className="flex-1">
        {children}
      </div>

      <PublicFooter />
    </div>
  );
}