import { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/common/Sidebar';
import Topbar from './components/common/Topbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Products
import ProductList from './components/products/ProductList';
import ProductForm from './components/products/ProductForm';
import ProductDetail from './components/products/ProductDetail';
import ProductVersionHistory from './components/products/ProductVersionHistory';

// BOM
import BOMList from './components/bom/BOMList';
import BOMForm from './components/bom/BOMForm';
import BOMDetail from './components/bom/BOMDetail';

// ECO
import ECOList from './components/eco/ECOList';
import ECOForm from './components/eco/ECOForm';
import ECODetail from './components/eco/ECODetail';

// Reports
import ECOReport from './components/reports/ECOReport';
import VersionMatrix from './components/reports/VersionMatrix';
import AuditLog from './components/reports/AuditLog';
import ArchivedProducts from './components/reports/ArchivedProducts';

// Settings
import StageManager from './components/settings/StageManager';
import ApprovalRuleManager from './components/settings/ApprovalRuleManager';

/**
 * Protected route — redirects to /login if not authenticated.
 */
const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-6 h-6 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

/**
 * App layout wrapper with sidebar and topbar.
 */
const AppLayout = ({ title }) => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <div className="flex-1 ml-60 flex flex-col">
      <Topbar title={title} />
      <main className="flex-1 pt-16 p-6 custom-scrollbar overflow-y-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

/**
 * Reports page layout — tabs for each report.
 */
const ReportsPage = () => {
  const [tab, setTab] = useState('eco');
  const tabs = [
    { id: 'eco', label: 'ECO Summary' },
    { id: 'versions', label: 'Version Matrix' },
    { id: 'audit', label: 'Audit Log' },
    { id: 'archived', label: 'Archived Records' },
  ];
  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-gray-200 pb-1">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium transition-all rounded-t-lg ${
              tab === t.id ? 'text-indigo-700 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'eco' && <ECOReport />}
      {tab === 'versions' && <VersionMatrix />}
      {tab === 'audit' && <AuditLog />}
      {tab === 'archived' && <ArchivedProducts />}
    </div>
  );
};

/**
 * Settings page layout — tabs for stages and approval rules.
 */
const SettingsPage = () => {
  const [tab, setTab] = useState('stages');
  const tabs = [
    { id: 'stages', label: 'ECO Stages' },
    { id: 'rules', label: 'Approval Rules' },
  ];
  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-gray-200 pb-1">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium transition-all ${
              tab === t.id ? 'text-indigo-700 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'stages' && <StageManager />}
      {tab === 'rules' && <ApprovalRuleManager />}
    </div>
  );
};


const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard */}
        <Route element={<AppLayout title="Dashboard" />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Products */}
        <Route element={<AppLayout title="Products" />}>
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/products/:id/edit" element={<ProductForm />} />
          <Route path="/products/:id/history" element={<ProductVersionHistory />} />
        </Route>

        {/* BOM */}
        <Route element={<AppLayout title="Bills of Materials" />}>
          <Route path="/bom" element={<BOMList />} />
          <Route path="/bom/new" element={<BOMForm />} />
          <Route path="/bom/:id" element={<BOMDetail />} />
          <Route path="/bom/:id/edit" element={<BOMForm />} />
        </Route>

        {/* ECO */}
        <Route element={<AppLayout title="Engineering Change Orders" />}>
          <Route path="/eco" element={<ECOList />} />
          <Route path="/eco/new" element={<ECOForm />} />
          <Route path="/eco/:id" element={<ECODetail />} />
          <Route path="/eco/:id/edit" element={<ECOForm />} />
        </Route>

        {/* Reports */}
        <Route element={<AppLayout title="Reports" />}>
          <Route path="/reports" element={<ReportsPage />} />
        </Route>

        {/* Settings */}
        <Route element={<AppLayout title="Settings" />}>
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
