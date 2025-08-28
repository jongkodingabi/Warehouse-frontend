type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  jabatan: {
    id: number;
    name: string;
  };
  divisi: {
    id: number;
    kodedivisi: string;
    divisi: string;
    short: number;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type { User };

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

type CreatedBy = {
  id: number;
  name: string;
  email: string;
  jabatan: {
    id: number;
    name: string;
  };
  divisi: {
    id: number;
    kodedivisi: string;
    divisi: string;
    short: number;
    status: string;
  };
};

type Category = {
  id: number;
  kategori: string;
  status: string;
  createdAt: string;
  createdBy?: CreatedBy;
};

export type { Category, CreatedBy };

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
  kategori: Category;
  divisi: Divisi;
  createdBy: User;
  updatedBy: User;
  namaBarang: string;
  deskripsi: string;
  kodeQr: string;
  lineDivisi: LineDivisi;
  productionDate: string;
  totalStock: number;
  status: string;
  kodeGrp?: string;
};

export type { Barang };

type LineDivisi = {
  id: number;
  divisi: string;
};

type BarangResponse = {
  data: Barang[];
};

type Jabatan = {
  id: number;
  jabatan: string;
  created_at: string;
};

export type { Jabatan };

export type { BarangResponse };

type NotifikasiItem = {
  id: number;
  produk: string;
  kodegrp: string;
  stockSekarang: number;
  kategori: Category;
  divisi: Divisi;
};

type NotifikasiResponse = {
  data: NotifikasiItem[];
};

export type { NotifikasiResponse };
