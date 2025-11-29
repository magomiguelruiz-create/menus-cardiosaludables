import React, { useState, useEffect, useCallback } from 'react';
import { generateDailyMenu, generateRecipe } from './services/geminiService';
import { MenuItem, RecipeData } from './types';
import { MenuCard } from './components/MenuCard';
import { RecipeModal } from './components/RecipeModal';
import { Utensils, Sparkles, AlertCircle } from 'lucide-react';

// Key for local storage to persist recent dishes
const HISTORY_KEY = 'chefbot_history';
const MAX_HISTORY = 5 * 4; // 5 days * 4 meals = 20 items to track

const App: React.FC = () => {
  const [currentMenu, setCurrentMenu] = useState<MenuItem[] | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Recipe Modal State
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [isRecipeLoading, setIsRecipeLoading] = useState<boolean>(false);

  // Initial load: check if we have a menu in session or just start clean
  // We won't auto-generate on load to save tokens, user must click.

  const getRecentDishes = (): string[] => {
    try {
      const history = localStorage.getItem(HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (e) {
      return [];
    }
  };

  const saveToHistory = (newItems: MenuItem[]) => {
    try {
      const currentHistory = getRecentDishes();
      const newDishNames = newItems.map(item => item.dishName);
      
      // Combine and slice to keep only the last MAX_HISTORY items
      const updatedHistory = [...newDishNames, ...currentHistory].slice(0, MAX_HISTORY);
      
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

  const handleGenerateMenu = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    setCurrentMenu(null); // Clear current menu for visual effect

    try {
      const history = getRecentDishes();
      console.log("Avoid these recent dishes:", history);
      
      const menu = await generateDailyMenu(history);
      setCurrentMenu(menu);
      saveToHistory(menu);
    } catch (err) {
      console.error(err);
      setError("Hubo un problema al conectar con el Chef IA. Por favor, intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleDishClick = useCallback(async (item: MenuItem) => {
    setSelectedDish(item);
    setRecipe(null); // Reset previous recipe
    setIsRecipeLoading(true);

    try {
      const fetchedRecipe = await generateRecipe(item.dishName);
      setRecipe(fetchedRecipe);
    } catch (err) {
      console.error(err);
      // We handle the error visually inside the modal via the null recipe + loaded state
    } finally {
      setIsRecipeLoading(false);
    }
  }, []);

  const closeRecipeModal = () => {
    setSelectedDish(null);
    setRecipe(null);
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-stone-800">
      {/* Navbar / Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-600">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Utensils size={24} />
            </div>
            <h1 className="text-xl font-serif font-bold tracking-tight text-stone-900">
              ChefBot <span className="text-stone-400 font-sans font-normal text-sm ml-1">| Tu Menú Diario</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <section className="text-center mb-12 space-y-6">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 leading-tight">
            ¿Qué comemos hoy?
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Obtén un plan de comidas completo y personalizado instantáneamente. 
            Nuestra IA asegura que no repitas los menús de los últimos 5 días.
          </p>
          
          <button
            onClick={handleGenerateMenu}
            disabled={isGenerating}
            className={`
              group relative inline-flex items-center gap-3 px-8 py-4 
              bg-stone-900 text-amber-50 rounded-full text-lg font-bold 
              shadow-lg hover:shadow-xl hover:bg-black transition-all transform hover:-translate-y-0.5
              disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
            `}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Diseñando Menú...
              </>
            ) : (
              <>
                <Sparkles size={20} className="text-amber-300" />
                Generar Nuevo Menú
              </>
            )}
          </button>

          {error && (
            <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md mx-auto mt-4">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
        </section>

        {/* Menu Grid */}
        <section>
            {isGenerating && !currentMenu ? (
                // Loading Skeleton
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-64 rounded-xl bg-stone-100 animate-pulse border-2 border-stone-200"></div>
                    ))}
                </div>
            ) : currentMenu ? (
                // Results
                <div className="animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-serif font-bold text-stone-800">Tu Menú del Día</h3>
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Toca un plato para ver la receta</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {currentMenu.map((item, index) => (
                            <MenuCard key={index} item={item} onClick={handleDishClick} />
                        ))}
                    </div>
                </div>
            ) : (
                // Empty State
                <div className="border-2 border-dashed border-stone-200 rounded-3xl p-12 text-center text-stone-400 bg-white/50">
                    <Utensils size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Presiona el botón para descubrir deliciosas opciones para hoy.</p>
                </div>
            )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 text-center text-stone-400 text-sm border-t border-stone-100">
        <p>&copy; {new Date().getFullYear()} ChefBot AI. Buen provecho.</p>
      </footer>

      {/* Modal */}
      <RecipeModal 
        isOpen={!!selectedDish} 
        onClose={closeRecipeModal} 
        recipe={recipe} 
        isLoading={isRecipeLoading}
        dishName={selectedDish?.dishName || ''}
      />
    </div>
  );
};

export default App;