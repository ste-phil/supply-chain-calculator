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

    addRecipe(name: string, time: number, amount: number, outputs: RecipeInput[], inputs: RecipeInput[]) {
        if (this.recipeNameExists(name)) return;
        if (outputs.length == 0 && amount > 0) {
            this.recipes.splice(0, 0, Recipe.CreateSingleOutput(name, time, amount, ...inputs));
            return;
        }
        else {
            this.recipes.splice(0, 0, Recipe.CreateMultipleOutput(name, time, outputs, inputs));
        }
    }

    updateRecipe(oldRecipe: Recipe, name: string, time: number, amount: number, inputs: RecipeInput[]) {
        if (oldRecipe.name != name && this.recipeNameExists(name)) return false;

        const i = this.recipes.indexOf(oldRecipe)
        this.recipes[i].name = name;
        this.recipes[i].time = time;
        // this.recipes[i].amount = amount;
        this.recipes[i].inputs = inputs;
    }

    getRecipes(): Recipe[] {
        return this.recipes;
    }

    getRecipeOutputs(): RecipeInput[] {
        const recipeOuts = new Array<RecipeInput>();
        
        for (let i = 0; i < this.recipes.length; i++) {
            for (let j = 0; j < this.recipes[i].outputs.length; j++) {
                const recipeInOut = this.recipes[i].outputs[j];

                if (recipeOuts.filter(x => x.recipeName == recipeInOut.recipeName).length == 0) {
                    recipeOuts.push(this.recipes[i].outputs[j])
                }
            }
        }
        

        return recipeOuts;
    }

    findRecipe(name: string): Recipe | null {
        const filtered = this.recipes.filter(x => x.name == name);
        if (filtered.length > 0) return filtered[0]; 
        return null;
    }

    findRecipesWithOutputRecipe(name: string): Recipe[] {
        return this.recipes.filter(x => x.outputs.filter(x => x.recipeName == name).length > 0)
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
