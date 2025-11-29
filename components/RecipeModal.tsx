import React from 'react';
import { X, Clock, Users, ChefHat } from 'lucide-react';
import { RecipeData } from '../types';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: RecipeData | null;
  isLoading: boolean;
  dishName: string;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ 
  isOpen, 
  onClose, 
  recipe, 
  isLoading,
  dishName 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex justify-between items-start bg-amber-50">
          <div className="pr-8">
            <h3 className="text-2xl font-bold text-stone-800 font-serif">
              {isLoading ? `Preparando receta para: ${dishName}...` : recipe?.dishName}
            </h3>
            {!isLoading && recipe && (
              <p className="text-stone-600 mt-1 italic">{recipe.description}</p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white rounded-full hover:bg-stone-100 transition-colors shadow-sm text-stone-500 hover:text-red-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <ChefHat className="animate-bounce text-amber-500" size={48} />
              <p className="text-stone-500 animate-pulse">Consultando el libro de recetas...</p>
            </div>
          ) : recipe ? (
            <div className="space-y-8">
              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm font-medium text-stone-600">
                <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-full">
                  <Clock size={16} />
                  <span>Prep: {recipe.prepTime}</span>
                </div>
                <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-full">
                  <ChefHat size={16} />
                  <span>Cocción: {recipe.cookTime}</span>
                </div>
                <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-full">
                  <Users size={16} />
                  <span>{recipe.servings} Porciones</span>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h4 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2 border-b border-amber-100 pb-2">
                  <span className="text-2xl">🥕</span> Ingredientes
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-stone-700">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 shrink-0"></span>
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2 border-b border-amber-100 pb-2">
                  <span className="text-2xl">🍳</span> Instrucciones
                </h4>
                <div className="space-y-4">
                  {recipe.instructions.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-amber-100 text-amber-800 font-bold rounded-full text-sm">
                        {idx + 1}
                      </span>
                      <p className="text-stone-700 mt-1 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
             <div className="text-center text-red-500">
               No se pudo cargar la receta. Inténtalo de nuevo.
             </div>
          )}
        </div>
        
        {/* Footer */}
        {!isLoading && (
            <div className="p-4 border-t border-stone-100 bg-stone-50 flex justify-end">
                <button 
                    onClick={onClose}
                    className="px-6 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors font-medium"
                >
                    Cerrar Receta
                </button>
            </div>
        )}
      </div>
    </div>
  );
};