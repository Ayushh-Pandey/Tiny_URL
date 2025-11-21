import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CodeStats from './pages/CodeStats';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link to="/" className="font-bold text-xl">tiny-url</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/code/:code" element={<CodeStats />} />
        </Routes>
      </main>

      <footer className="text-center text-xs text-gray-500 py-6">Built with ❤️</footer>
    </div>
  );
}
