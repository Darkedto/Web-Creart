import { NavBar } from '@/components/ui/NavBar';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main style={{ paddingTop: 55 }}>{children}</main>
    </>
  );
}
