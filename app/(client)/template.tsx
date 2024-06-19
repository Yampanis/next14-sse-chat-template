import GlobalNav from '@components/ui/global-nav';

export default async function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-full flex-col">
      <GlobalNav />
      {children}
    </div>
  );
}
