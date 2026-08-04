export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex-1 flex flex-col gap-5 my-15 items-center">
      <h1 className="text-3xl">Habit Tracker</h1>
      <div className="bg-[#FCFBFA] rounded-lg px-25 py-10">{children}</div>
    </main>
  );
}
