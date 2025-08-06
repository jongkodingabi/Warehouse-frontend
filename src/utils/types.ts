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
