export function generateStaticParams() {
  return [
    { category: "houses" },
    { category: "apartments" },
    { category: "commercial" },
    { category: "plots" },
    { category: "rent-resale" }
  ];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}