export enum MealType {
  DESAYUNO = 'Desayuno',
  ALMUERZO = 'Almuerzo',
  MERIENDA = 'Merienda',
  CENA = 'Cena',
}

export interface MenuItem {
  meal: MealType;
  dishName: string;
  description: string;
  calories?: number;
}

export interface DailyMenu {
  id: string;
  date: string;
  items: MenuItem[];
}

export interface RecipeData {
  dishName: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
}