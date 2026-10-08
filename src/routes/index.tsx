import { createFileRoute, Link } from "@tanstack/react-router";
import { SimBanner, WalletButton, Panel } from "@/components/ui-kit";
import { shortWallet, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Asset Borrow — Peminjaman Aset Organisasi Terverifikasi" },
      { name: "description", content: "Lacak peminjaman aset organisasi dengan jejak audit simulasi blockchain." },
      { property: "og:title", content: "Asset Borrow — Peminjaman Aset Terverifikasi" },
      { property: "og:description", content: "Lacak peminjaman aset organisasi dengan jejak audit simulasi blockchain." },
    ],
  }),
  component: Landing,
});

const roles = [
  { to: "/admin", t: "Admin Inventaris", d: "Tambah aset dan buat permintaan peminjaman." },
  { to: "/peminjam", t: "Peminjam (Mahasiswa)", d: "Tanda tangani perjanjian dan lihat riwayat." },
  { to: "/auditor", t: "Auditor", d: "Telusuri hash transaksi dan perubahan status." },
] as const;

function Landing() {
  const { wallet } = useStore();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-md bg-primary/15 ring-1 ring-primary/30"><span className="size-2 rounded-full bg-primary" /></span>
          <span className="font-display text-[15px] font-semibold">Asset Borrow</span>
        </div>
        <WalletButton />
      </header>
      <SimBanner />
      <section className="py-10">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Sistem Peminjaman Aset Organisasi Terverifikasi</div>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
          Setiap peminjaman tercatat. <span className="text-primary">Setiap sengketa terjawab.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
          Asset Borrow membantu admin inventaris dan mahasiswa melacak peminjaman aset dengan jejak audit berbasis hash.
          Data pribadi disimpan Off-chain, sedangkan bukti status disimulasikan On-chain.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <WalletButton />
          {wallet && <span className="text-[12px] text-primary">Terhubung sebagai {shortWallet(wallet)} (simulasi)</span>}
          <Link to="/admin" className="text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">Buka dasbor →</Link>
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        {roles.map((r) => (
          <Link key={r.to} to={r.to} className="rounded-xl bg-card p-5 ring-1 ring-border transition hover:ring-primary/40">
            <h2 className="text-[16px] font-semibold">{r.t}</h2>
            <p className="mt-2 text-[13px] text-muted-foreground">{r.d}</p>
          </Link>
        ))}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Panel eyebrow="Data Off-Chain" title="Disimpan di server organisasi">
          <p className="text-[13px] text-muted-foreground">Foto aset, nama peminjam, nomor telepon, kondisi barang.</p>
        </Panel>
        <Panel eyebrow="Bukti On-Chain" title="Dicatat sebagai bukti (simulasi)">
          <p className="text-[13px] text-muted-foreground">Hash transaksi, status aset, alamat wallet, timestamp.</p>
        </Panel>
      </div>
      <p className="mt-10 text-center text-[11px] text-muted-foreground">Aplikasi tidak pernah meminta private key atau seed phrase.</p>
    </div>
  );
}
