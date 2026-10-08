import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Panel, StatusBadge } from "@/components/ui-kit";
import { shortHash, shortWallet, useStore } from "@/lib/store";

export const Route = createFileRoute("/auditor")({
  head: () => ({
    meta: [
      { title: "Log Audit — Asset Borrow" },
      { name: "description", content: "Semua hash transaksi dan perubahan status aset." },
      { property: "og:title", content: "Log Audit — Asset Borrow" },
      { property: "og:description", content: "Jejak audit simulasi blockchain untuk peminjaman aset." },
    ],
  }),
  component: Auditor,
});

function Auditor() {
  const { logs } = useStore();
  return (
    <AppShell title="Jejak Audit Aset">
      <Panel eyebrow="Bukti On-Chain" title="Rantai Blok Simulasi" right={<span className="text-[11px] text-muted-foreground">{logs.length} transaksi</span>}>
        <div className="space-y-2">
          {logs.map((l, i) => (
            <div key={l.id} className="grid gap-2 rounded-lg bg-surface px-4 py-3 ring-1 ring-border md:grid-cols-[70px_1fr_110px_120px_150px_130px] md:items-center">
              <span className="w-fit rounded bg-primary/15 px-2 py-0.5 text-[11px] text-primary">#{4800 + logs.length - i}</span>
              <span className="text-[13px]">{l.aksi} — <Link to="/aset/$id" params={{ id: l.assetId }} className="text-muted-foreground hover:text-primary">{l.assetId}</Link></span>
              <span><StatusBadge status={l.status} /></span>
              <span className="text-[11px] text-muted-foreground">{shortWallet(l.wallet)}</span>
              <span className="text-[11px] text-primary" title={l.hash}>{shortHash(l.hash)}</span>
              <span className="text-[11px] text-muted-foreground md:text-right">{l.waktu}</span>
            </div>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}
