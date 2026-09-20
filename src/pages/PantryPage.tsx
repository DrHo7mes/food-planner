import React, { useState, useEffect } from 'react';
import ingredientsList from '../data/ingredients.json';
import { Trash2, Plus } from 'lucide-react';

export const PantryPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState(ingredientsList[0].id);
  const [quantity, setQuantity] = useState<number>(500);

  useEffect(() => {
    const saved = localStorage.getItem('local_pantry');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const save = (newItems: any[]) => {
    setItems(newItems);
    localStorage.setItem('local_pantry', JSON.stringify(newItems));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const meta = ingredientsList.find(i => i.id === selectedId);
    if (!meta) return;

    const filtered = items.filter(i => i.id !== meta.id);
    const updated = [...filtered, { id: meta.id, name_fa: meta.name_fa, quantity: Number(quantity), unit: meta.unit }];
    save(updated);
  };

  const handleDelete = (id: string) => {
    save(items.filter(i => i.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="font-bold text-base text-slate-800 mb-4">افزودن مواد موجود به انبار خانه</h2>
        <form onSubmit={handleAdd} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-600 mb-1">انتخاب ماده غذایی</label>
            <select
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            >
              {ingredientsList.map(i => (
                <option key={i.id} value={i.id}>{i.name_fa} (واحد: {i.unit})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 mb-1">مقدار موجود</label>
            <input
              type="number"
              min="0.1"
              step="any"
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl flex items-center justify-center gap-1 transition"
          >
            <Plus className="w-4 h-4" /> ذخیره در انبار
          </button>
        </form>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-sm text-slate-800 mb-3">موجودی فعلی خانه ({items.length} قلم)</h3>
        {items.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">انبار خالی است! موادی که در خانه دارید را وارد کنید.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map(item => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">{item.name_fa}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">{item.quantity} {item.unit}</span>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
