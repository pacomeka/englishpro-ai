import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 pb-20 md:pb-0 md:pl-64">
        <main className="max-w-2xl mx-auto px-4 py-6">
          <Outlet />
        </main>
      </div>
      <Navbar />
    </div>
  );
}
