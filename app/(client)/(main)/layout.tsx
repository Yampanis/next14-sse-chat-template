export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex size-full min-h-screen grow flex-col items-center p-8">
      <div className="container mx-auto h-full px-4 py-8">{children}</div>
    </main>
  );
}
