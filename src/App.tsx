import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard, OrganizationPage, DataPage } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/organization" element={<OrganizationPage />} />
        <Route path="/data" element={<DataPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
