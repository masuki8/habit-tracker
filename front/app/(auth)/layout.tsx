import Header from "@/components/header";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col gap-15 my-15 items-center">
        <h1>Habit Tracker</h1>
        {children}
      </main>
    </>
  );
}
