import { createContext, useContext, useState, type ReactNode } from "react";

export type AssetStatus = "Tersedia" | "Dipinjam" | "Dikembalikan";
export type Asset = {
  id: string;
  nama: string;
  kondisi: string;
  kategori: string;
  status: AssetStatus;
  hash?: string;
};
export type Request = {
  id: string;
  assetId: string;
  peminjam: string;
  telepon: string;
  tanggal: string;
  status: "Menunggu" | "Ditandatangani" | "Selesai";
  hash?: string;
  wallet?: string;
  waktu?: string;
};
export type Log = {
  id: string;
  waktu: string;
  wallet: string;
  hash: string;
  aksi: string;
  assetId: string;
  status: string;
};

export const randHex = (n: number) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join("");
export const genHash = () => "0x" + randHex(40);
export const shortHash = (h?: string) => (h ? `${h.slice(0, 8)}...${h.slice(-4)}` : "—");
export const shortWallet = (w?: string) => (w ? `${w.slice(0, 4)}...${w.slice(-3)}` : "—");
const now = () => new Date().toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" });

const ADMIN_WALLET = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg9pQ";
const BORROWER_WALLET = "9aRbF3kPq2mZxW8yLtN5vC6hJ4dEuS1oGiY7nBQr2kLm";

const AST1_HASH = "0xabc123f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3";
const AST3_HASH = genHash();
const initialAssets: Asset[] = [
  {
    id: "AST-001",
    nama: "Proyektor Epson EB-X500",
    kondisi: "Baik",
    kategori: "Audio Visual",
    status: "Dipinjam",
    hash: AST1_HASH,
  },
  {
    id: "AST-002",
    nama: "Laptop ThinkPad T480",
    kondisi: "Baik",
    kategori: "Komputer",
    status: "Tersedia",
  },
  {
    id: "AST-003",
    nama: "Kamera Canon EOS R",
    kondisi: "Lecet ringan",
    kategori: "Dokumentasi",
    status: "Dikembalikan",
    hash: AST3_HASH,
  },
  {
    id: "AST-004",
    nama: "Speaker Portabel JBL",
    kondisi: "Baik",
    kategori: "Audio Visual",
    status: "Tersedia",
  },
];
const initialRequests: Request[] = [
  {
    id: "REQ-101",
    assetId: "AST-001",
    peminjam: "Budi Mahasiswa (Dummy)",
    telepon: "0812-0000-1111",
    tanggal: "06/10/26",
    status: "Ditandatangani",
    hash: AST1_HASH,
    wallet: BORROWER_WALLET,
    waktu: "06/10/26 09.12",
  },
  {
    id: "REQ-102",
    assetId: "AST-002",
    peminjam: "Budi Mahasiswa (Dummy)",
    telepon: "0812-0000-1111",
    tanggal: "08/10/26",
    status: "Menunggu",
  },
];
const initialLogs: Log[] = [
  {
    id: "L3",
    waktu: "07/10/26 14.03",
    wallet: ADMIN_WALLET,
    hash: AST3_HASH,
    aksi: "Pengembalian aset",
    assetId: "AST-003",
    status: "Dikembalikan",
  },
  {
    id: "L2",
    waktu: "06/10/26 09.12",
    wallet: BORROWER_WALLET,
    hash: AST1_HASH,
    aksi: "Tanda tangan perjanjian",
    assetId: "AST-001",
    status: "Dipinjam",
  },
  {
    id: "L1",
    waktu: "05/10/26 10.15",
    wallet: ADMIN_WALLET,
    hash: genHash(),
    aksi: "Registrasi aset",
    assetId: "AST-001",
    status: "Tersedia",
  },
];

type Store = {
  wallet: string | null;
  connect: () => void;
  disconnect: () => void;
  assets: Asset[];
  requests: Request[];
  logs: Log[];
  addAsset: (a: { nama: string; kondisi: string; kategori: string }) => void;
  createRequest: (assetId: string, peminjam: string, telepon: string) => void;
  signRequest: (id: string) => string;
  returnAsset: (assetId: string) => void;
};
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<string | null>(null);
  const [assets, setAssets] = useState(initialAssets);
  const [requests, setRequests] = useState(initialRequests);
  const [logs, setLogs] = useState(initialLogs);
  const log = (l: Omit<Log, "id" | "waktu" | "wallet" | "hash">, hash = genHash()) => {
    setLogs((p) => [
      { ...l, id: randHex(6), waktu: now(), wallet: wallet ?? ADMIN_WALLET, hash },
      ...p,
    ]);
    return hash;
  };
  const store: Store = {
    wallet,
    connect: () => setWallet(ADMIN_WALLET),
    disconnect: () => setWallet(null),
    assets,
    requests,
    logs,
    addAsset: (a) => {
      const id = `AST-${String(assets.length + 1).padStart(3, "0")}`;
      setAssets((p) => [...p, { ...a, id, status: "Tersedia" }]);
      log({ aksi: "Registrasi aset", assetId: id, status: "Tersedia" });
    },
    createRequest: (assetId, peminjam, telepon) => {
      setRequests((p) => [
        ...p,
        {
          id: `REQ-${100 + p.length + 1}`,
          assetId,
          peminjam,
          telepon,
          tanggal: now().split(" ")[0] ?? "",
          status: "Menunggu",
        },
      ]);
      log({ aksi: "Permintaan peminjaman dibuat", assetId, status: "Menunggu" });
    },
    signRequest: (id) => {
      const r = requests.find((x) => x.id === id)!;
      const hash = genHash();
      const w = wallet ?? BORROWER_WALLET;
      setRequests((p) =>
        p.map((x) =>
          x.id === id ? { ...x, status: "Ditandatangani", hash, wallet: w, waktu: now() } : x,
        ),
      );
      setAssets((p) => p.map((a) => (a.id === r.assetId ? { ...a, status: "Dipinjam", hash } : a)));
      log({ aksi: "Tanda tangan perjanjian", assetId: r.assetId, status: "Dipinjam" }, hash);
      return hash;
    },
    returnAsset: (assetId) => {
      const hash = genHash();
      setAssets((p) =>
        p.map((a) => (a.id === assetId ? { ...a, status: "Dikembalikan", hash } : a)),
      );
      setRequests((p) =>
        p.map((x) =>
          x.assetId === assetId && x.status === "Ditandatangani" ? { ...x, status: "Selesai" } : x,
        ),
      );
      log({ aksi: "Pengembalian aset", assetId, status: "Dikembalikan" }, hash);
    },
  };
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error("StoreProvider hilang");
  return s;
};
