import SideNav from './_components/sidenav';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SideNav />
      <main className="flex-1 flex flex-col gap-6 px-8 py-3 overflow-y-auto">
        <h1 className="text-xl mt-7 w-full">Hello</h1>
        <div>{children}</div>
      </main>
    </>
  );
}
