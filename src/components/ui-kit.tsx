import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { shortWallet, useStore, type AssetStatus } from "@/lib/store";

export const SIM_WARNING =
  "Fitur blockchain pada Modul 2 masih berupa simulasi antarmuka dan belum melakukan transaksi nyata.";

export function SimBanner() {
  return (
    <div
      role="alert"
      className="mb-5 flex items-start gap-3 rounded-lg border border-warn/30 bg-warn/10 px-4 py-3"
    >
      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-warn" />
      <p className="text-[13px] leading-relaxed text-warn">{SIM_WARNING}</p>
    </div>
  );
}

const badge: Record<string, string> = {
  Tersedia: "bg-avail/15 text-avail ring-avail/30",
  Dipinjam: "bg-warn/15 text-warn ring-warn/30",
  Dikembalikan: "bg-info/15 text-info ring-info/30",
  Menunggu: "bg-surface text-muted-foreground ring-border",
  Ditandatangani: "bg-primary/15 text-primary ring-primary/30",
  Selesai: "bg-info/15 text-info ring-info/30",
};
export function StatusBadge({ status }: { status: AssetStatus | string }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${badge[status] ?? badge["Menunggu"]}`}
    >
      {status}
    </span>
  );
}

export function Panel({
  eyebrow,
  title,
  right,
  children,
  className = "",
}: {
  eyebrow?: string;
  title?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl bg-card p-5 ring-1 ring-border ${className}`}>
      {(eyebrow || title) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {eyebrow && (
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {eyebrow}
              </div>
            )}
            {title && <h2 className="mt-1 text-[16px] font-semibold">{title}</h2>}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

export function Btn({
  children,
  variant = "primary",
  className = "",
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  const v =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:opacity-90"
      : "bg-surface text-foreground ring-1 ring-border hover:bg-secondary";
  return (
    <button
      {...p}
      className={`rounded-md px-3 py-2 text-[13px] font-medium transition disabled:opacity-40 ${v} ${className}`}
    >
      {children}
    </button>
  );
}

export function WalletButton() {
  const { wallet, connect, disconnect } = useStore();
  return wallet ? (
    <Btn variant="ghost" onClick={disconnect} title="Putuskan Wallet">
      <span className="text-primary">● </span>
      {shortWallet(wallet)}
    </Btn>
  ) : (
    <Btn onClick={connect}>Hubungkan Wallet</Btn>
  );
}

export const inputCls =
  "w-full rounded-md bg-background px-3 py-2 text-[13px] ring-1 ring-border outline-none focus:ring-primary";

const nav = [
  { to: "/admin", label: "Dasbor Admin" },
  { to: "/peminjam", label: "Dasbor Peminjam" },
  { to: "/auditor", label: "Log Audit" },
  { to: "/aset/$id", params: { id: "AST-001" }, label: "Verifikasi Aset" },
] as const;

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const { wallet } = useStore();
  const linkCls =
    "block whitespace-nowrap rounded-md px-3 py-2 text-[13px] text-muted-foreground hover:bg-surface hover:text-foreground";
  const active = { className: "bg-primary/15 !text-primary ring-1 ring-primary/25 font-medium" };
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-border bg-card/60 px-5 py-6 lg:flex">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-md bg-primary/15 ring-1 ring-primary/30">
            <span className="size-2 rounded-full bg-primary" />
          </span>
          <div>
            <div className="font-display text-[15px] font-semibold leading-none">Asset Borrow</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Register Aset
            </div>
          </div>
        </Link>
        <nav className="mt-8 space-y-1">
          {nav.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              {...("params" in n ? { params: n.params } : {})}
              className={linkCls}
              activeProps={active}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-lg bg-surface p-3 ring-1 ring-border">
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Wallet
          </div>
          <div className="mt-1 text-[12px] text-primary">
            {wallet ? shortWallet(wallet) : "Belum terhubung"}
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/" className="font-display font-semibold">
              Asset Borrow
            </Link>
            <WalletButton />
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
            {nav.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                {...("params" in n ? { params: n.params } : {})}
                className={linkCls}
                activeProps={active}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h1 className="text-[22px] font-semibold leading-none">{title}</h1>
              <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-medium text-primary ring-1 ring-primary/25">
                Simulasi
              </span>
            </div>
            <div className="hidden lg:block">
              <WalletButton />
            </div>
          </div>
          <SimBanner />
          {children}
        </main>
      </div>
    </div>
  );
}

export function BarChart({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  return (
    <div>
      <div className="flex h-[112px] items-end gap-2">
        {values.map((v, i) => (
          <div
            key={i}
            className="w-full rounded-t bg-primary/60"
            style={{ height: `${(v / max) * 100}%` }}
            title={`${v} peminjaman`}
          />
        ))}
      </div>
      <div className="mt-2 flex gap-2 text-[10px] text-muted-foreground">
        {days.map((d) => (
          <span key={d} className="w-full text-center">
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}
