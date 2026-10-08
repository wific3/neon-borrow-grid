import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Btn, Panel, StatusBadge } from "@/components/ui-kit";
import { shortHash, shortWallet, useStore } from "@/lib/store";

export const Route = createFileRoute("/peminjam")({
  head: () => ({
    meta: [
      { title: "Dasbor Peminjam — Asset Borrow" },
      {
        name: "description",
        content: "Lihat permintaan, tanda tangani perjanjian, dan riwayat peminjaman.",
      },
      { property: "og:title", content: "Dasbor Peminjam — Asset Borrow" },
      {
        property: "og:description",
        content: "Tanda tangani perjanjian peminjaman aset secara simulasi.",
      },
    ],
  }),
  component: Borrower,
});

function Borrower() {
  const { requests, assets, signRequest } = useStore();
  const [signed, setSigned] = useState<string | null>(null);
  const name = (id: string) => assets.find((a) => a.id === id)?.nama ?? id;
  const pending = requests.filter((r) => r.status === "Menunggu");
  const history = requests.filter((r) => r.status !== "Menunggu");

  return (
    <AppShell title="Dasbor Peminjam">
      {signed && (
        <div className="mb-5 rounded-lg bg-primary/10 px-4 py-3 text-[13px] text-primary ring-1 ring-primary/30">
          Perjanjian berhasil ditandatangani (simulasi). Hash:{" "}
          <span className="break-all">{signed}</span>
        </div>
      )}
      <Panel
        eyebrow="Permintaan Masuk"
        title="Menunggu Tanda Tangan"
        right={
          <span className="text-[11px] text-muted-foreground">{pending.length} permintaan</span>
        }
      >
        {pending.length === 0 ? (
          <p className="text-[13px] text-muted-foreground">Tidak ada permintaan baru.</p>
        ) : (
          <div className="space-y-3">
            {pending.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center gap-3 rounded-lg bg-surface px-4 py-3 ring-1 ring-border"
              >
                <span className="rounded bg-primary/15 px-2 py-0.5 text-[11px] text-primary">
                  {r.id}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px]">{name(r.assetId)}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {r.assetId} · diajukan {r.tanggal}
                  </div>
                </div>
                <Btn onClick={() => setSigned(signRequest(r.id))}>Tanda Tangani Perjanjian</Btn>
              </div>
            ))}
          </div>
        )}
      </Panel>
      <Panel className="mt-5" eyebrow="Bukti On-Chain" title="Riwayat Peminjaman">
        <div className="overflow-x-auto rounded-lg ring-1 ring-border">
          <table className="w-full min-w-[620px] text-left text-[13px]">
            <thead>
              <tr className="bg-surface text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Aset</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Wallet</th>
                <th className="px-4 py-2.5 font-medium">Hash</th>
                <th className="px-4 py-2.5 font-medium">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3">
                    <Link to="/aset/$id" params={{ id: r.assetId }} className="hover:text-primary">
                      {name(r.assetId)}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{shortWallet(r.wallet)}</td>
                  <td className="px-4 py-3 text-[11px] text-primary">{shortHash(r.hash)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.waktu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </AppShell>
  );
}
