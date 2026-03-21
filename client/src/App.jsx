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
    <div style={{ minHeight: '100vh', background: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 24, height: 24, border: '2.5px solid #CAF0F8', borderTopColor: '#0077B6', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

/**
 * App layout wrapper with sidebar and topbar.
 */
const AppLayout = ({ title }) => (
  <div style={{ display: 'flex', minHeight: '100vh', background: '#F0F9FF' }}>
    <Sidebar />
    <div style={{ flex: 1, marginLeft: 220, display: 'flex', flexDirection: 'column' }}>
      <Topbar title={title} />
      <main className="page-content custom-scrollbar" style={{ flex: 1, paddingTop: 56, padding: '72px 24px 24px', overflowY: 'auto' }}>
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
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 4, borderBottom: '1.5px solid #CAF0F8', paddingBottom: 0 }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '8px 16px', fontSize: 13, fontWeight: 500, border: 'none',
            background: 'transparent', cursor: 'pointer', borderRadius: '8px 8px 0 0',
            color: tab === t.id ? '#0077B6' : '#90E0EF',
            borderBottom: tab === t.id ? '2px solid #0077B6' : '2px solid transparent',
            transition: 'color 0.2s',
          }}>
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
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 4, borderBottom: '1.5px solid #CAF0F8' }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '8px 16px', fontSize: 13, fontWeight: 500, border: 'none',
            background: 'transparent', cursor: 'pointer', borderRadius: '8px 8px 0 0',
            color: tab === t.id ? '#0077B6' : '#90E0EF',
            borderBottom: tab === t.id ? '2px solid #0077B6' : '2px solid transparent',
            transition: 'color 0.2s',
          }}>
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
