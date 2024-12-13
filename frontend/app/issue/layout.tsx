export default function IssueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative h-[95%] overflow-y-clip">
        {children}
    </section>
  );
}
