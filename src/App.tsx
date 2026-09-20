import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { PantryPage } from './pages/PantryPage';
import { RecipeDetailPage } from './pages/RecipeDetailPage';

export const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/pantry" element={<PantryPage />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
