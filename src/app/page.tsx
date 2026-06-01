import { getProductsAction } from "@/features/productos/actions/product.actions";
import { CardProduct } from "@/features/shop/components/CardProduct";
import Link from "next/link";

export default async function Home() {
  const { products } = await getProductsAction();
  const currentYear = new Date().getFullYear();


  return (
    <div>
      <header className="bg-gray-900 py-4 px-6">
        <p className="text-teal-400 font-bold text-2xl">StockFlow Store</p>
      </header>

      <div className="py-12 px-4 md:p-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {products?.map((p) => (
            <CardProduct
              key={p.id}
              product={p}
            />
          ))}

        </div>
      </div>

      <footer className="bg-gray-900 text-gray-100 py-6">
        <div className="flex flex-col justify-between items-center text-sm max-w-7xl mx-auto md:flex-row">
          <p>© {currentYear} StockFlow Store. Todos los derechos reservados.</p>
          <Link href="/login" className="text-teal-400 mt-2 md:mt-0 hover:underline">
            Acceso Empleados
          </Link>
        </div>
      </footer>
    </div>
  );
}
