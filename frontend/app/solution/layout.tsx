export default function SolutionLayout({
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
