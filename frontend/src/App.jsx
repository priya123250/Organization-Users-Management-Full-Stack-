import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import OrganizationsPage from './pages/OrganizationsPage';
import OrganizationDetailsPage from './pages/OrganizationDetailsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<OrganizationsPage />} />
            <Route path="/organizations/:id" element={<OrganizationDetailsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
