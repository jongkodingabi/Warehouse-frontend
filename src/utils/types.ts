type Product = {
  id: number;
  namaBarang: string;
  kodeQr: string;
  lineDivisi?: string;
  productionDate?: string;
  stockAwal: number;
  stockSekarang?: number;
};

export type { Product };

type Category = {
  id: number;
  kategori: string;
  status: string;
  created_at: string;
};

export type { Category };

type Divisi = {
  id: number;
  kodedivisi: string;
  divisi: string;
  short: number;
  status: string;
  created_at: string;
};

export type { Divisi };

type Barang = {
  id: number;
  kategori: string[];
  divisi?: string[];
  createdBy?: string[];
  namaBarang: string;
  productionDate: string;
  stockAwal: number;
  stockSekarang: number;
};

export type { Barang };
