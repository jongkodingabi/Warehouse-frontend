"use client";

import { createCategory } from "@/lib/api/category/route";
import { zodResolver } from "@hookform/resolvers/zod";
import { Warehouse, User, Send, Watch } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

const categoryFormSchema = z.object({
  kategori: z.string(),

  status: z.string(),
});

type CategoryFormSchema = z.infer<typeof categoryFormSchema>;

export default function Createkategori() {
  const router = useRouter();
  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
  });

  const handleCreate = async (newCategory: CategoryFormSchema) => {
    try {
      await createCategory(newCategory);
      router.push("/admin/categories");
    } catch (error) {
      console.log(error);
    } finally {
      form.reset();
    }
  };
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-background p-8 border-2 border-secondary rounded-xl shadow-xl">
          <div className="flex items-center justify-center">
            <div className="inline-block bg-primary p-3 rounded-lg text-white mr-2">
              <Warehouse className="w-6 h-6" />
            </div>
            <h1 className="font-semibold text-2xl text-text">
              Warehouse Management
            </h1>
          </div>

          <div className="inline-block mt-6">
            <h1 className="text-center font-medium text-base text-text">
              Welcome Back
            </h1>
            <p className="text-secondary font-medium text-sm mt-2">
              Login untuk melihat apa yang terjadi di gudang hari ini
            </p>
          </div>

          <form className="mt-5" onSubmit={form.handleSubmit(handleCreate)}>
            <div className="mb-5">
              <label
                htmlFor="kategori"
                className="block text-text font-medium text-base mb-2"
              >
                Kategori
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-text/30" />
                </div>
                <input
                  type="text"
                  id="kategori"
                  placeholder="Contoh: Jacket"
                  required
                  {...form.register("kategori")}
                  className="w-full pl-10 pr-3 py-3 bg-background border border-secondary text-text text-lg rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 duration-200 transition-all"
                />
              </div>
              {/* <span style={{ color: "red" }}>
              {form.formState.errors.email?.message}
            </span> */}
            </div>
            <div className="mb-5">
              <label
                htmlFor="kategori"
                className="block text-text font-medium text-base mb-2"
              ></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Watch className="text-text/30" />
                </div>
                <select
                  id="status"
                  required
                  {...form.register("status")}
                  className="w-full pl-10 pr-3 py-3 bg-background border border-secondary text-text text-lg rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 duration-200 transition-all"
                  // {...form.register("password")}
                >
                  <option value="aktif">Aktif</option>
                  <option value="non-aktif">Non Aktif</option>
                </select>
              </div>
              <span style={{ color: "red" }}>
                {/* {form.formState.errors.password?.message} */}
              </span>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center bg-primary rounded-lg py-3 text-white font-semibold text-lg cursor-pointer hover:bg-primary/90 hover:scale-105 active:bg-primary active:scale-95 transition-all duration-300 ease-in-out"
            >
              <Send className="mr-2" />
              Submit
            </button>
          </form>
          {/* {error && (
          <div className="flex items-center gap-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg w-full mt-4 shadow-sm animate-fade-in">
            <span>
              <X className="w-5 h-5" />
            </span>
            <span className="font-medium">
              {errorMessage || "Terjadi kesalahan saat login."}
            </span>
          </div>
        )} */}
        </div>
      </div>
    </>
  );
}
