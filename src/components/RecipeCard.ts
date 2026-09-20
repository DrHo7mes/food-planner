import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, CheckCircle2, ShoppingBag } from 'lucide-react';

interface Props {
  recipe: any;
  matchPercentage: number;
  missingList: any[];
  servings: number;
}

export const RecipeCard: React.FC<Props> = ({ recipe, matchPercentage, missingList, servings }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition">
      <div>
        {recipe.image_url && (
          <div className="relative h-44 w-full bg-slate-100">
            <img src={recipe.image_url} alt={recipe.name_fa} className="w-full h-full object-cover" />
            <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full border ${
              matchPercentage >= 75 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {matchPercentage}٪ موجودی
            </span>
          </div>
        )}

        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-base text-slate-800">{recipe.name_fa}</h3>
            {recipe.youtube_id && (
              <a
                href={`https://www.youtube.com/watch?v=${recipe.youtube_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[11px] font-bold border border-red-200"
              >
                <span>▶ یوتیوب</span>
              </a>
            )}
          </div>
          <p className="text-[11px] text-slate-400">{recipe.name_en}</p>

          <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{recipe.total_time} دقیقه</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{servings} نفر</span>
            <span className="flex items-center gap-1 font-bold text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" />{matchPercentage}٪</span>
          </div>

          {missingList.length > 0 ? (
            <div className="p-2 rounded-xl bg-slate-50 text-xs text-slate-600 space-y-0.5">
              <span className="font-semibold text-amber-600 flex items-center gap-1">
                <ShoppingBag className="w-3 h-3" /> نیاز به خرید:
              </span>
              <p className="truncate text-slate-500">
                {missingList.map((m: any) => `${m.name_fa} (${m.need} ${m.unit})`).join('، ')}
              </p>
            </div>
          ) : (
            <div className="p-1.5 bg-emerald-50 text-emerald-700 text-xs rounded-xl font-medium">
              ✅ تمام مواد در انبار موجود است!
            </div>
          )}
        </div>
      </div>

      <div className="p-4 pt-0">
        <Link
          to={`/recipe/${recipe.id}?servings=${servings}`}
          className="w-full block text-center py-2 bg-primary-50 hover:bg-primary-600 hover:text-white text-primary-700 font-semibold text-xs rounded-xl transition"
        >
          مشاهده دستور و مقادیر برای {servings} نفر
        </Link>
      </div>
    </div>
  );
};