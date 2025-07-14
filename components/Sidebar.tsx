import React, { useState, useEffect } from 'react';
import { Category, Subcategory } from '../types';
import { Icon } from './Icon';

interface SidebarProps {
  categories: Category[];
  selectedSubcategory: Subcategory | null;
  onSelectSubcategory: (subcategory: Subcategory | null) => void;
  loading: boolean;
  error: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ categories, selectedSubcategory, onSelectSubcategory, loading, error }) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!openCategory && categories.length > 0) {
      setOpenCategory(categories[0].id);
    }
  }, [categories, openCategory]);

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(prev => (prev === categoryId ? null : categoryId));
  };

  if (loading) {
    return (
      <aside className="w-64 bg-white h-full p-4 flex-shrink-0 shadow-lg flex flex-col">
        <div className="flex items-center gap-3 mb-8 px-2">
          <Icon name="fa-solid fa-seedling" className="text-3xl text-green-600" />
          <h1 className="text-2xl font-bold text-slate-800">Gourmet Grove</h1>
        </div>
        <div className="flex-1 space-y-4 animate-pulse">
            <div className="h-12 bg-slate-200 rounded-lg"></div>
            <div className="h-12 bg-slate-200 rounded-lg"></div>
            <div className="h-12 bg-slate-200 rounded-lg"></div>
            <div className="h-12 bg-slate-200 rounded-lg"></div>
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="w-64 bg-white h-full p-4 flex-shrink-0 shadow-lg flex flex-col items-center justify-center text-center">
        <Icon name="fa-solid fa-exclamation-triangle" className="text-4xl text-red-500 mb-4" />
        <h3 className="font-semibold text-red-600">Lỗi tải danh mục</h3>
        <p className="text-sm text-slate-500 mt-1">{error}</p>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-white h-full p-4 flex-shrink-0 shadow-lg flex flex-col">
      <div className="flex items-center gap-3 mb-8 px-2">
        <Icon name="fa-solid fa-seedling" className="text-3xl text-green-600" />
        <h1 className="text-2xl font-bold text-slate-800">Gourmet Grove</h1>
      </div>
      <nav className="flex-1 space-y-4 overflow-y-auto">
        {categories.map(category => (
          <div key={category.id}>
            <button
              className={`flex items-center w-full px-3 py-2 rounded-lg font-semibold text-left transition-colors ${openCategory === category.id ? 'bg-green-50 text-green-700' : 'hover:bg-slate-100'}`}
              onClick={() => toggleCategory(category.id)}
            >
              <Icon name={category.icon} className="mr-3 text-xl" />
              {category.name}
              <span className="ml-auto">
                <Icon name={openCategory === category.id ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'} />
              </span>
            </button>
            {openCategory === category.id && (
              <ul className="pl-8 mt-2 space-y-1">
                {category.subcategories.map(sub => (
                  <li key={sub.id}>
                    <button
                      className={`w-full text-left px-2 py-1 rounded transition-colors ${selectedSubcategory?.id === sub.id ? 'bg-green-100 text-green-800 font-bold' : 'hover:bg-slate-100'}`}
                      onClick={() => onSelectSubcategory(sub)}
                    >
                      {sub.name}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    className={`w-full text-left px-2 py-1 rounded transition-colors ${selectedSubcategory === null ? 'bg-green-50 text-green-700 font-bold' : 'hover:bg-slate-100'}`}
                    onClick={() => onSelectSubcategory(null)}
                  >
                    Tất cả
                  </button>
                </li>
              </ul>
            )}
          </div>
        ))}
      </nav>
      <div className="p-4 bg-slate-100 rounded-lg text-center mt-4">
        <p className="text-sm text-slate-600">© 2024 Gourmet Grove</p>
        <p className="text-xs text-slate-400 mt-1">Giao hàng tận tâm, vị ngon trọn vẹn.</p>
      </div>
    </aside>
  );
};
