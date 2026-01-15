import Layout from "@/components/custom/Layout";

export default function CRMLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Layout>{children}</Layout>;
}
