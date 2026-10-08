import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, BarChart, Btn, Panel, StatusBadge, inputCls } from "@/components/ui-kit";
import { shortHash, useStore } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Dasbor Admin — Asset Borrow" },
      { name: "description", content: "Kelola aset dan buat permintaan peminjaman." },
      { property: "og:title", content: "Dasbor Admin — Asset Borrow" },
      { property: "og:description", content: "Kelola aset dan buat permintaan peminjaman." },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { assets, requests, addAsset, createRequest, returnAsset } = useStore();
  const [f, setF] = useState({ nama: "", kondisi: "Baik", kategori: "" });
  const tersedia = assets.filter((a) => a.status !== "Dipinjam");
  const [r, setR] = useState({
    assetId: "",
    peminjam: "Budi Mahasiswa (Dummy)",
    telepon: "0812-0000-1111",
  });
  const counts = (s: string) => assets.filter((a) => a.status === s).length;

  return (
    <AppShell title="Dasbor Admin">
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Total Aset", assets.length, "text-foreground"],
          ["Tersedia", counts("Tersedia"), "text-avail"],
          ["Dipinjam", counts("Dipinjam"), "text-warn"],
          ["Dikembalikan", counts("Dikembalikan"), "text-info"],
        ].map(([l, v, c]) => (
          <div key={l as string} className="rounded-xl bg-card p-4 ring-1 ring-border">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{l}</div>
            <div className={`mt-2 font-display text-3xl font-semibold ${c}`}>{v}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Panel
          eyebrow="Data Off-Chain"
          title="Aset & Status"
          right={
            <span className="text-[11px] text-muted-foreground">
              {assets.length} aset terdaftar
            </span>
          }
        >
          <div className="overflow-x-auto rounded-lg ring-1 ring-border">
            <table className="w-full min-w-[560px] text-left text-[13px]">
              <thead>
                <tr className="bg-surface text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Aset</th>
                  <th className="px-4 py-2.5 font-medium">Kondisi</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Hash</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {assets.map((a) => (
                  <tr key={a.id}>
                    <td className="px-4 py-3">
                      <Link to="/aset/$id" params={{ id: a.id }} className="hover:text-primary">
                        {a.nama}
                      </Link>
                      <div className="text-[11px] text-muted-foreground">{a.id}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{a.kondisi}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-4 py-3 text-[11px] text-primary">{shortHash(a.hash)}</td>
                    <td className="px-4 py-3 text-right">
                      {a.status === "Dipinjam" && (
                        <Btn variant="ghost" onClick={() => returnAsset(a.id)}>
                          Tandai Kembali
                        </Btn>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel eyebrow="Aktivitas 7 Hari" title="Peminjaman">
          <BarChart values={[2, 3, 2, 4, 5, 6, 3 + requests.length]} />
        </Panel>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel eyebrow="Off-Chain" title="Tambah Aset Dummy">
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!f.nama) return;
              addAsset(f);
              setF({ nama: "", kondisi: "Baik", kategori: "" });
            }}
          >
            <div className="flex gap-3">
              <div className="grid size-20 shrink-0 place-items-center rounded-lg bg-surface text-[10px] text-muted-foreground ring-1 ring-dashed ring-border">
                Foto
              </div>
              <div className="flex-1 space-y-3">
                <input
                  className={inputCls}
                  placeholder="Nama aset, mis. Mikrofon Shure"
                  value={f.nama}
                  onChange={(e) => setF({ ...f, nama: e.target.value })}
                />
                <input
                  className={inputCls}
                  placeholder="Kategori"
                  value={f.kategori}
                  onChange={(e) => setF({ ...f, kategori: e.target.value })}
                />
              </div>
            </div>
            <select
              className={inputCls}
              value={f.kondisi}
              onChange={(e) => setF({ ...f, kondisi: e.target.value })}
            >
              <option>Baik</option>
              <option>Lecet ringan</option>
              <option>Perlu servis</option>
            </select>
            <Btn type="submit" disabled={!f.nama}>
              Tambah Aset
            </Btn>
          </form>
        </Panel>
        <Panel eyebrow="Alur Peminjaman" title="Buat Permintaan Peminjaman">
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!r.assetId) return;
              createRequest(r.assetId, r.peminjam, r.telepon);
              setR({ ...r, assetId: "" });
            }}
          >
            <select
              className={inputCls}
              value={r.assetId}
              onChange={(e) => setR({ ...r, assetId: e.target.value })}
            >
              <option value="">Pilih aset…</option>
              {tersedia.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.id} — {a.nama}
                </option>
              ))}
            </select>
            <input
              className={inputCls}
              placeholder="Nama peminjam"
              value={r.peminjam}
              onChange={(e) => setR({ ...r, peminjam: e.target.value })}
            />
            <input
              className={inputCls}
              placeholder="Telepon (dummy)"
              value={r.telepon}
              onChange={(e) => setR({ ...r, telepon: e.target.value })}
            />
            <Btn type="submit" disabled={!r.assetId}>
              Kirim Permintaan
            </Btn>
          </form>
        </Panel>
      </div>
    </AppShell>
  );
}
