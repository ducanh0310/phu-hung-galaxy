
import React, { useState } from 'react';
import { Category, Subcategory } from '../../shared/types';
import { Icon } from './Icon';

interface SidebarProps {
  categories: Category[];
  selectedSubcategory: Subcategory | null;
  onSelectSubcategory: (subcategory: Subcategory | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ categories, selectedSubcategory, onSelectSubcategory }) => {
  const [openCategory, setOpenCategory] = useState<string | null>(categories[0]?.id || null);

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(prev => (prev === categoryId ? null : categoryId));
  };

  return (
    <aside className="w-64 bg-white h-full p-4 flex-shrink-0 shadow-lg flex flex-col">
      <div className="flex items-center gap-3 mb-8 px-2">
        <Icon name="fa-solid fa-seedling" className="text-3xl text-green-600" />
        <h1 className="text-2xl font-bold text-slate-800">Gourmet Grove</h1>
      </div>
      <nav className="flex-1">
        <ul>
          <li
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 mb-4 ${
                !selectedSubcategory ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-slate-100'
              }`}
              onClick={() => onSelectSubcategory(null)}
            >
              <Icon name="fa-solid fa-store" className="w-5 text-center" />
              <span>Tất Cả Sản Phẩm</span>
          </li>

          {categories.map(category => (
            <li key={category.id} className="mb-2">
              <div
                className="flex justify-between items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-slate-100"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center gap-3">
                  <Icon name={category.icon} className="w-5 text-center text-green-600" />
                  <span className="font-semibold text-slate-700">{category.name}</span>
                </div>
                <Icon
                  name={`fa-solid fa-chevron-down transition-transform duration-300 ${openCategory === category.id ? 'rotate-180' : ''}`}
                  className="text-xs text-slate-400"
                />
              </div>
              <ul className={`overflow-hidden transition-all duration-300 ease-in-out ${openCategory === category.id ? 'max-h-96' : 'max-h-0'}`}>
                {category.subcategories.map(sub => (
                  <li
                    key={sub.id}
                    onClick={() => onSelectSubcategory(sub)}
                    className={`pl-11 pr-3 py-2.5 text-slate-600 cursor-pointer rounded-lg mt-1 transition-colors duration-200 relative
                      ${selectedSubcategory?.id === sub.id
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'hover:bg-slate-100 hover:text-slate-800'
                      }`}
                  >
                    {selectedSubcategory?.id === sub.id && <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-1 bg-green-500 rounded-full"></div>}
                    {sub.name}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 bg-slate-100 rounded-lg text-center mt-4">
        <p className="text-sm text-slate-600">© 2024 Gourmet Grove</p>
        <p className="text-xs text-slate-400 mt-1">Giao hàng tận tâm, vị ngon trọn vẹn.</p>
      </div>
    </aside>
  );
};
