export class Recipe {
    name: string;   //<- PK
    time: number;
    amount: number;
    inputs: RecipeInput[];
    
    constructor(name: string, time: number, amount: number, ... inputs: RecipeInput[]) {
        this.name = name;
        this.time = time;
        this.amount = amount;
        this.inputs = inputs;
    }
}

export class RecipeInput {
    public amount: number;
    public recipeName: string;

    constructor(amount: number, recipeName: string) {
        this.amount = amount;
        this.recipeName = recipeName;
    }


    // static fromRecipeName(amount: number, recipeName: string, book: RecipeBook): RecipeInput {
    //     var recipe = book.findRecipe(recipeName);
    //     return new RecipeInput(amount, recipe);
    // }
}


export class RecipeBookInfo {
    constructor(public name: string, public desc: string) {}
}