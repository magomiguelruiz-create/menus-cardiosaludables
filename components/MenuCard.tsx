import React from 'react';
import { MenuItem, MealType } from '../types';
import { Coffee, Sun, Sunset, Moon, ArrowRight, Flame } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
}

const getIcon = (type: MealType) => {
  switch (type) {
    case MealType.DESAYUNO: return <Coffee className="text-amber-600" />;
    case MealType.ALMUERZO: return <Sun className="text-orange-500" />;
    case MealType.MERIENDA: return <Sunset className="text-pink-500" />;
    case MealType.CENA: return <Moon className="text-indigo-500" />;
    default: return <Sun />;
  }
};

const getBgColor = (type: MealType) => {
   switch (type) {
    case MealType.DESAYUNO: return 'bg-amber-50 border-amber-100 hover:border-amber-300';
    case MealType.ALMUERZO: return 'bg-orange-50 border-orange-100 hover:border-orange-300';
    case MealType.MERIENDA: return 'bg-pink-50 border-pink-100 hover:border-pink-300';
    case MealType.CENA: return 'bg-indigo-50 border-indigo-100 hover:border-indigo-300';
    default: return 'bg-white';
  }
};

export const MenuCard: React.FC<MenuCardProps> = ({ item, onClick }) => {
  return (
    <div 
      onClick={() => onClick(item)}
      className={`relative group rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 ${getBgColor(item.meal)}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 font-bold text-stone-700 uppercase tracking-wider text-xs">
          {getIcon(item.meal)}
          {item.meal}
        </div>
        {item.calories && (
          <div className="flex items-center gap-1 text-xs text-stone-500 font-medium bg-white/50 px-2 py-1 rounded-full">
            <Flame size={12} />
            {item.calories} kcal
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-serif font-bold text-stone-900 mb-2 leading-tight group-hover:text-amber-800 transition-colors">
        {item.dishName}
      </h3>
      
      <p className="text-stone-600 text-sm leading-relaxed mb-4">
        {item.description}
      </p>

      <div className="flex items-center text-amber-700 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Ver receta completa <ArrowRight size={16} className="ml-1" />
      </div>
    </div>
  );
};