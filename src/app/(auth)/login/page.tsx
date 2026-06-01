import { LoginForm } from "@/features/auth/components/LoginForm";
import { CheckCircle2, Package } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="order-2 md:order-1 flex flex-row lg:flex-col justify-center items-center p-12 bg-linear-to-br from-primary via-indigo-700 to-primary text-white relative overflow-hidden">
        <div className="relative z-10 max-w-xl text-center">
          <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
            <Package className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-6 tracking-tight">
            Bienvenido a <span className="text-indigo-200">StockFlow</span>
          </h1>

          <p className="text-indigo-100 text-lg mb-10 leading-relaxed">
            Sistema de administración de inventarios y flujo de stock. Gestiona el catálogo de productos, registra movimientos de reposición y despacho, y monitorea la evolución del inventario mediante análisis diarios
          </p>
          <div className="space-y-4 text-left inline-block">
            {[
              "Catálogo de productos y gestión de maestros",
              "Registro de entradas (reposición) y salidas (despacho)",
              "Visualización de la evolución diaria del inventario",
              "Control de acceso basado en roles (ADMIN / USER)"
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-indigo-100">
                <CheckCircle2 className="h-5 w-5 text-indigo-300" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="order-1 my-6 p-6 md:order-2 flex flex-col gap-4 md:9-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <h3 className="text-4xl font-bold mb-6 tracking-tight">Inicia sesión</h3>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
