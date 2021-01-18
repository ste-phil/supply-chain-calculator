import { Recipe, RecipeInput } from "./entities";

/*recipe-book
    name: string
    desc: string
    recipes: Recipe[]
*/
export class RecipeBook {
    name: string;   //<- PK
    desc: string;
    recipes: Recipe[];

    constructor(name: string, desc: string, recipes: Recipe[]) {
        this.name = name;
        this.desc = desc;
        this.recipes = recipes;
    }

    importRecipes(recipeString: string, mode: string) {
        const importedRecipes = JSON.parse(recipeString);

        if (mode == "override") this.recipes = importedRecipes;
        else if (mode == "extend") this.recipes.push(importedRecipes);
    }

    addRecipe(name: string, time: number, amount: number, inputs: RecipeInput[]) {
        if (this.recipeNameExists(name)) return;

        this.recipes.splice(0, 0, {
            name, 
            time, 
            amount, 
            inputs
        });
    }

    updateRecipe(oldRecipe: Recipe, name: string, time: number, amount: number, inputs: RecipeInput[]) {
        if (oldRecipe.name != name && this.recipeNameExists(name)) return false;

        const i = this.recipes.indexOf(oldRecipe)
        this.recipes[i].name = name;
        this.recipes[i].time = time;
        this.recipes[i].amount = amount;
        this.recipes[i].inputs = inputs;
    }

    getRecipes(): Recipe[] {
        return this.recipes;
    }

    findRecipe(name: string): Recipe | null {
        const filtered = this.recipes.filter(x => x.name == name);
        if (filtered.length > 0) return filtered[0]; 
        return null;
    }

    recipeNameExists(name: string): boolean {
        return this.recipes.filter(x => x.name == name).length ? true : false;
    }

    isRecipeDeletable(recipeToCheck: Recipe): boolean {
        for(let i = 0; i < this.recipes.length; i++) {
            const recipe = this.recipes[i];
            for(let j = 0; j < recipe.inputs.length; j++) {
                const inputRecipeName = recipe.inputs[j].recipeName
                if (inputRecipeName == recipeToCheck.name) return false;
            }
        }

        return true;
    }

    deleteRecipe(recipe: Recipe) {
        this.recipes.splice(this.recipes.indexOf(recipe), 1);
    }
}
