import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from './Icon';
import { useAppStore } from '../stores/useAppStore';
import { Subcategory } from '../../shared/types';

export const Sidebar: React.FC = () => {
  const { categories, selectedSubcategoryId, selectSubcategory, getSelectedSubcategory } = useAppStore();
  const selectedSubcategory = getSelectedSubcategory();

  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!openCategory && selectedSubcategory) {
      setOpenCategory(selectedSubcategory.categoryId);
    }
  }, [selectedSubcategory, openCategory]);

  const toggleCategory = (categoryId: string) => {
    setOpenCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const handleSelectSubcategory = useCallback(
    (subcategory: Subcategory | null) => {
      const newSearchParams = new URLSearchParams(searchParams);
      if (subcategory) {
        newSearchParams.set('subcategory', subcategory.id);
        selectSubcategory(subcategory.id);
      } else {
        newSearchParams.delete('subcategory');
        selectSubcategory(null);
      }

      if (location.pathname !== '/') {
        navigate({ pathname: '/', search: newSearchParams.toString() });
      } else {
        setSearchParams(newSearchParams);
      }
    },
    [searchParams, setSearchParams, navigate, location.pathname, selectSubcategory],
  );

  return (
    <aside className="w-80 bg-background border-r p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-8 text-foreground">Gourmet Grove</h1>
      <nav className="flex-1">
        <ul>
          <li
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 mb-4 ${
              !selectedSubcategoryId ? 'bg-accent text-accent-foreground font-semibold' : 'hover:bg-accent'
            }`}
            onClick={() => handleSelectSubcategory(null)}
          >
            <Icon name="fa-solid fa-store" className="w-5 text-center" />
            <span>Tất Cả Sản Phẩm</span>
          </li>

          {categories.map((category) => (
            <li key={category.id} className="mb-2">
              <div
                className="flex justify-between items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-accent"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center gap-3">
                  <Icon name={category.icon || 'fa-solid fa-utensils'} className="w-5 text-center text-muted-foreground" />
                  <span className="font-medium text-foreground">{category.name}</span>
                </div>
                <Icon
                  name={`fa-solid fa-chevron-down transition-transform duration-300 ${openCategory === category.id ? 'rotate-180' : ''}`}
                  className="text-xs text-muted-foreground"
                />
              </div>
              <ul
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openCategory === category.id ? 'max-h-96' : 'max-h-0'
                }`}
              >
                {category.subcategories.map((sub) => (
                  <li
                    key={sub.id}
                    onClick={() => handleSelectSubcategory(sub)}
                    className={`pl-11 pr-3 py-2.5 text-muted-foreground cursor-pointer rounded-lg mt-1 transition-colors duration-200 relative
                      ${
                        selectedSubcategory?.id === sub.id
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'hover:bg-accent hover:text-foreground'
                      }`}
                  >
                    {selectedSubcategory?.id === sub.id && (
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-full"></div>
                    )}
                    {sub.name}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
