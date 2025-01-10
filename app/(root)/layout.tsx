import Footer from "@/components/Footer";
import Header from "@/components/Header";
import getUserInfo from "@/hooks/getUserInfo";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserInfo();
  return (
    <main className="w-full min-h-screen bg-gray-100 flex flex-col">
      <Header user={user} />
      <div className="flex-1">{children}</div>
      <Footer />
    </main>
  );
}
