import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem, RecipeData } from "../types";

// Initialize the client strictly as per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

/**
 * Generates a daily menu avoiding previously suggested dishes.
 */
export const generateDailyMenu = async (recentDishNames: string[]): Promise<MenuItem[]> => {
  const prompt = `
    Genera un menú diario delicioso, saludable y equilibrado para hoy.
    Debe incluir 4 comidas: Desayuno, Almuerzo, Merienda y Cena.
    
    IMPORTANTE: Para asegurar variedad, EVITA REPETIR o sugerir platos muy similares a los siguientes:
    ${recentDishNames.join(', ')}
    
    Sé creativo con los ingredientes y sabores.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      systemInstruction: "Eres un chef experto y nutricionista. Tu objetivo es crear menús variados y apetecibles en español.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            meal: {
              type: Type.STRING,
              enum: ['Desayuno', 'Almuerzo', 'Merienda', 'Cena']
            },
            dishName: {
              type: Type.STRING,
              description: "Nombre creativo y corto del plato"
            },
            description: {
              type: Type.STRING,
              description: "Breve descripción apetitosa de 1 frase"
            },
            calories: {
              type: Type.INTEGER,
              description: "Calorías aproximadas"
            }
          },
          required: ['meal', 'dishName', 'description', 'calories'],
        },
      },
    },
  });

  const jsonText = response.text;
  if (!jsonText) throw new Error("No se recibió respuesta del modelo.");
  
  return JSON.parse(jsonText) as MenuItem[];
};

/**
 * Generates a detailed recipe for a specific dish.
 */
export const generateRecipe = async (dishName: string): Promise<RecipeData> => {
  const prompt = `Genera una receta detallada paso a paso para el plato: "${dishName}".`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      systemInstruction: "Eres un instructor de cocina paciente y claro. Responde siempre en español.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dishName: { type: Type.STRING },
          description: { type: Type.STRING },
          prepTime: { type: Type.STRING, description: "Ej: 15 mins" },
          cookTime: { type: Type.STRING, description: "Ej: 30 mins" },
          servings: { type: Type.INTEGER },
          ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ['dishName', 'description', 'prepTime', 'cookTime', 'ingredients', 'instructions', 'servings'],
      },
    },
  });

  const jsonText = response.text;
  if (!jsonText) throw new Error("No se recibió respuesta de receta.");

  return JSON.parse(jsonText) as RecipeData;
};