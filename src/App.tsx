import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard, OrganizationPage, DataPage } from './pages';

// ใช้ base path จาก vite config สำหรับ GitHub Pages
const basename = import.meta.env.BASE_URL;

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/organization" element={<OrganizationPage />} />
        <Route path="/data" element={<DataPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
