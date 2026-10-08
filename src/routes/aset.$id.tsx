import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Panel, StatusBadge } from "@/components/ui-kit";
import { shortWallet, useStore } from "@/lib/store";

export const Route = createFileRoute("/aset/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Verifikasi ${params.id} — Asset Borrow` },
      { name: "description", content: `Bukti peminjaman dan verifikasi aset ${params.id}.` },
      { property: "og:title", content: `Verifikasi ${params.id} — Asset Borrow` },
      { property: "og:description", content: "Bukti On-Chain simulasi untuk aset organisasi." },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const { assets, requests, logs } = useStore();
  const a = assets.find((x) => x.id === id);
  if (!a) return <AppShell title="Aset tidak ditemukan"><Link to="/admin" className="text-primary">← Kembali ke Dasbor Admin</Link></AppShell>;
  const req = [...requests].reverse().find((r) => r.assetId === id && r.wallet);
  const last = logs.find((l) => l.assetId === id);
  const row = (k: string, v: React.ReactNode) => (
    <div className="flex flex-wrap justify-between gap-2 border-b border-border py-2.5 last:border-0">
      <span className="text-muted-foreground">{k}</span><span className="break-all text-right">{v}</span>
    </div>
  );
  return (
    <AppShell title="Detail Aset / Verifikasi">
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel eyebrow="Data Off-Chain" title={a.nama}>
          <div className="mb-4 grid aspect-video place-items-center rounded-lg bg-surface text-[12px] text-muted-foreground ring-1 ring-border">Placeholder Foto Aset</div>
          <div className="text-[13px]">
            {row("Nama Aset", a.nama)}
            {row("Kategori", a.kategori || "—")}
            {row("Kondisi", a.kondisi)}
            {row("Peminjam", req?.peminjam ?? "—")}
            {row("Telepon", req?.telepon ?? "—")}
          </div>
        </Panel>
        <Panel eyebrow="Bukti On-Chain" title="Bukti Peminjaman">
          <pre className="whitespace-pre-wrap break-all rounded-lg bg-background p-4 text-[13px] leading-7 ring-1 ring-primary/30">
{`Asset ID: ${a.id}
Status: ${a.status}
Verification Hash: ${a.hash ? a.hash.slice(0, 8) + "..." : "—"}
Network: Simulasi Solana Devnet`}
          </pre>
          <div className="mt-4 text-[13px]">
            {row("Status", <StatusBadge status={a.status} />)}
            {row("Hash Lengkap", <span className="text-[11px] text-primary">{a.hash ?? "Belum ada transaksi"}</span>)}
            {row("Wallet", shortWallet(last?.wallet))}
            {row("Timestamp", last?.waktu ?? "—")}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
