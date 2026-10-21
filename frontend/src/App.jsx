import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import AppLayout from './components/AppLayout.jsx';

import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';

import CustomerDashboard from './pages/customer/CustomerDashboard.jsx';
import CustomerPolicies from './pages/customer/CustomerPolicies.jsx';
import CustomerClaims from './pages/customer/CustomerClaims.jsx';
import CustomerPayments from './pages/customer/CustomerPayments.jsx';
import ProductCatalog from './pages/customer/ProductCatalog.jsx';

import OfficerQueue from './pages/officer/OfficerQueue.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';

import AgentDashboard from './pages/agent/AgentDashboard.jsx';

function ProtectedRoute({ roles, children }) {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(auth.role)) return <Navigate to="/" replace />;
  return children;
}

function HomeRedirect() {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" replace />;
  switch (auth.role) {
    case 'ADMIN': return <Navigate to="/admin" replace />;
    case 'CLAIMS_OFFICER': return <Navigate to="/officer/queue" replace />;
    case 'AGENT': return <Navigate to="/agent" replace />;
    default: return <Navigate to="/customer" replace />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<AppLayout />}>
            <Route path="/" element={<HomeRedirect />} />

            <Route path="/customer" element={
              <ProtectedRoute roles={['CUSTOMER']}><CustomerDashboard /></ProtectedRoute>
            } />
            <Route path="/customer/products" element={
              <ProtectedRoute roles={['CUSTOMER']}><ProductCatalog /></ProtectedRoute>
            } />
            <Route path="/customer/policies" element={
              <ProtectedRoute roles={['CUSTOMER']}><CustomerPolicies /></ProtectedRoute>
            } />
            <Route path="/customer/claims" element={
              <ProtectedRoute roles={['CUSTOMER']}><CustomerClaims /></ProtectedRoute>
            } />
            <Route path="/customer/payments" element={
              <ProtectedRoute roles={['CUSTOMER']}><CustomerPayments /></ProtectedRoute>
            } />

            <Route path="/officer/queue" element={
              <ProtectedRoute roles={['CLAIMS_OFFICER', 'ADMIN']}><OfficerQueue /></ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/products" element={
              <ProtectedRoute roles={['ADMIN']}><AdminProducts /></ProtectedRoute>
            } />

            <Route path="/agent" element={
              <ProtectedRoute roles={['AGENT']}><AgentDashboard /></ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
