import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-black text-primary-600 text-lg">
          <Utensils className="w-5 h-5" />
          <span>چی بپزم؟</span>
        </Link>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <Link to="/" className="text-slate-600 hover:text-primary-600">داشبورد</Link>
          <Link to="/pantry" className="text-slate-600 hover:text-primary-600">موجودی خانه</Link>
        </div>
      </div>
    </header>
  );
};
