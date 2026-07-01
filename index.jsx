import dynamic from "next/dynamic";

const AuditApp = dynamic(() => import("./AuditApp"), { ssr: false });

export default function Home() {
  return <AuditApp />;
}
