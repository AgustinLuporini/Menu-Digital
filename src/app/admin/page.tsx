import { Suspense } from "react";
import AdminContent from "@/components/admin/AdminContent";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Suspense fallback={<div className="flex items-center justify-center h-screen text-white">Cargando panel...</div>}>
        {/* YA NO PASAMOS PROPS. El componente se encarga sol */}
        <AdminContent />
      </Suspense>
    </div>
  );
}