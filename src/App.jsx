import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import CarManager from './admin/CarManager';
import Inbox from './admin/Inbox';
import ContentEditor from './admin/ContentEditor';
import AdminLayout from './admin/AdminLayout';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Login />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/cars" element={<AdminLayout><CarManager /></AdminLayout>} />
          <Route path="/admin/inbox" element={<AdminLayout><Inbox /></AdminLayout>} />
          <Route path="/admin/content" element={<AdminLayout><ContentEditor /></AdminLayout>} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
