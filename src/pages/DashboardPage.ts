import React, { useState, useMemo, useEffect } from 'react';
import rawRecipes from '../data/recipes.json';
import { RecipeCard } from '../components/RecipeCard';
import { Link } from 'react-router-dom';
import { Search, Users, Clock, Plus } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [pantry, setPantry] = useState<any[]>([]);
  const [servings, setServings] = useState<number>(4);
  const [maxTime, setMaxTime] = useState<number>(90);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('local_pantry');
    if (saved) {
      setPantry(JSON.parse(saved));
    } else {
      const defaultPantry = [
        { id: 'chicken_breast', name_fa: 'سینه مرغ', quantity: 600, unit: 'گرم' },
        { id: 'rice', name_fa: 'برنج', quantity: 1000, unit: 'گرم' },
        { id: 'onion', name_fa: 'پیاز', quantity: 3, unit: 'عدد' },
        { id: 'egg', name_fa: 'تخم مرغ', quantity: 4, unit: 'عدد' },
        { id: 'tomato', name_fa: 'گوجه فرنگی', quantity: 4, unit: 'عدد' },
        { id: 'cooking_oil', name_fa: 'روغن مایع', quantity: 4, unit: 'قاشق' }
      ];
      setPantry(defaultPantry);
      localStorage.setItem('local_pantry', JSON.stringify(defaultPantry));
    }
  }, []);

  const matches = useMemo(() => {
    const pantryMap = new Map(pantry.map(i => [i.id, i.quantity]));

    return rawRecipes.map(recipe => {
      let requiredCount = recipe.ingredients.length;
      let availableCount = 0;
      const missingList: any[] = [];

      recipe.ingredients.forEach(ing => {
        const factor = servings / recipe.default_servings;
        const needed = ing.amount * factor;
        const available = pantryMap.get(ing.id) || 0;

        if (available >= needed) {
          availableCount++;
        } else {
          missingList.push({
            name_fa: ing.name_fa,
            need: Math.round((needed - available) * 10) / 10,
            unit: ing.unit
          });
        }
      });

      const matchPercentage = Math.round((availableCount / requiredCount) * 100);
      return { recipe, matchPercentage, missingList };
    })
    .filter(item => item.recipe.total_time <= maxTime)
    .filter(item => !search.trim() || item.recipe.name_fa.includes(search) || item.recipe.name_en.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [pantry, servings, maxTime, search]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="جستجوی غذا یا مواد اولیه..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
          <Link to="/pantry" className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1">
            <Plus className="w-4 h-4" /> انبار خانه
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-600" />
            <span>نفرات:</span>
            {[1, 2, 4, 6].map(n => (
              <button
                key={n}
                onClick={() => setServings(n)}
                className={`w-6 h-6 rounded-md font-bold ${servings === n ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                {n}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary-600" />
            <span>حداکثر زمان:</span>
            <select
              value={maxTime}
              onChange={e => setMaxTime(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs"
            >
              <option value={30}>۳۰ دقیقه</option>
              <option value={45}>۴۵ دقیقه</option>
              <option value={90}>۱.۵ ساعت</option>
              <option value={180}>نامحدود</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-bold text-slate-800">غذاهای پیشنهادی بر اساس مواد موجود در خانه</h2>
          <span className="text-xs text-slate-400">{matches.length} غذا</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map(m => (
            <RecipeCard key={m.recipe.id} recipe={m.recipe} matchPercentage={m.matchPercentage} missingList={m.missingList} servings={servings} />
          ))}
        </div>
      </div>
    </div>
  );
};