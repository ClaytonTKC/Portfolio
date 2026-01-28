import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { TestimonialsPage } from './pages/Testimonials';
import { ContactPage } from './pages/Contact';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLayout } from './components/layout/AdminLayout';
import { ManageProjects } from './pages/admin/ManageProjects';
import { ManageSkills } from './pages/admin/ManageSkills';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import './i18n';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/skills" element={<ManageSkills />} />
            <Route path="/admin/projects" element={<ManageProjects />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
