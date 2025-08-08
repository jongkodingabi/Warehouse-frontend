import { Store, BoxesIcon, Archive, ChartPie } from "lucide-react";

export default function Card() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-5">
        {/* Card 1 */}
        <div className="bg-white rounded-lg shadow-md border p-5">
          <div className="flex justify-between">
            <div>
              <h3 className="text-text font-medium text-sm">Total Barang</h3>
              <p className="text-text font-medium text-xl pt-2.5">20</p>
            </div>
            <div className="bg-primary p-4 rounded-sm text-background">
              <Store className="w-8 h-8" />
            </div>
          </div>
        </div>
        {/* Card 2 */}
        <div className="bg-white rounded-lg shadow-md border p-5">
          <div className="flex justify-between">
            <div>
              <h3 className="text-text font-medium text-sm">Kapasitas Total</h3>
              <p className="text-text font-medium text-xl pt-2.5">50.000</p>
            </div>
            <div className="bg-primary p-4 rounded-sm text-background">
              <BoxesIcon className="w-8 h-8" />
            </div>
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-white rounded-lg shadow-md border p-5">
          <div className="flex justify-between">
            <div>
              <h3 className="text-text font-medium text-sm">
                Kapasitas Terisi
              </h3>
              <p className="text-text font-medium text-xl pt-2.5">38.756</p>
            </div>
            <div className="bg-primary p-4 rounded-sm text-background">
              <Archive className="w-8 h-8" />
            </div>
          </div>
        </div>
        {/* Card 4 */}
        <div className="bg-white rounded-lg shadow-md border p-5">
          <div className="flex justify-between">
            <div>
              <h3 className="text-text font-medium text-sm">Persentase</h3>
              <p className="text-text font-medium text-xl pt-2.5">77.51%</p>
            </div>
            <div className="bg-primary p-4 rounded-sm text-background">
              <ChartPie className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>{" "}
    </>
  );
}
