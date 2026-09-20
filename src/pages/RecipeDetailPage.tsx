import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import rawRecipes from '../data/recipes.json';
import { ArrowRight, Clock, Users } from 'lucide-react';

export const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipe, setRecipe] = useState<any>(null);

  const servings = Number(searchParams.get('servings')) || 4;

  useEffect(() => {
    const found = rawRecipes.find(r => r.id === id);
    if (found) setRecipe(found);
  }, [id]);

  if (!recipe) return <div className="p-8 text-center text-xs text-slate-500">در حال بارگذاری...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 mb-2">
        <ArrowRight className="w-4 h-4" /> بازگشت به داشبورد
      </Link>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {recipe.image_url && (
          <img src={recipe.image_url} alt={recipe.name_fa} className="w-full h-56 object-cover" />
        )}

        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-slate-800">{recipe.name_fa}</h1>
              <p className="text-xs text-slate-400">{recipe.name_en}</p>
            </div>
            {recipe.youtube_id && (
              <a
                href={`https://www.youtube.com/watch?v=${recipe.youtube_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1"
              >
                <span>▶ ویدئوی پخت</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-primary-600" /> زمان: {recipe.total_time} دقیقه</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4 text-primary-600" /> نفرات اولیه: {recipe.default_servings}</span>
          </div>

          <div className="flex items-center justify-between border-t border-b border-slate-100 py-3">
            <span className="text-xs font-bold text-slate-700">تغییر تعداد نفرات:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 4, 6, 8].map(n => (
                <button
                  key={n}
                  onClick={() => setSearchParams({ servings: n.toString() })}
                  className={`w-7 h-7 rounded-lg text-xs font-bold ${servings === n ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-bold text-sm text-slate-800 mb-3">مواد لازم برای {servings} نفر:</h2>
            <ul className="space-y-2 text-xs">
              {recipe.ingredients.map((ing: any) => {
                const scaled = Math.round((ing.amount * (servings / recipe.default_servings)) * 10) / 10;
                return (
                  <li key={ing.id} className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-700 font-medium">{ing.name_fa}</span>
                    <span className="font-bold text-primary-700">{scaled} {ing.unit}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-sm text-slate-800 mb-3">مراحل پخت:</h2>
            <ol className="space-y-2 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
              {recipe.steps.map((step: string, idx: number) => (
                <li key={idx} className="p-2 bg-slate-50 rounded-xl">{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
