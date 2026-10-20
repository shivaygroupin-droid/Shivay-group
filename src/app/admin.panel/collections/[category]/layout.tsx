export function generateStaticParams() {
  return [
    { category: "houses" },
    { category: "apartments" },
    { category: "penthouses" },
    { category: "commercial" },
    { category: "plots" }
  ];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}