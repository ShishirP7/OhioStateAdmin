import AdminDashboard from "./components/adminDashboard";
import AdminLayout from "./components/adminLayouts";

export default function Home() {
  return (
    <div>
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    </div>
  );
}
