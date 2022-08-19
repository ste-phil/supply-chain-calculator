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


export class Recipe {
    name: string;   //<- PK
    time: number;
    // amount: number;
    inputs: RecipeInput[];
    outputs: RecipeInput[];

    private constructor(name: string, time: number, outputs: RecipeInput[], inputs: RecipeInput[]) 
    {
        this.name = name;
        this.time = time;
        // this.amount = amount;
        this.inputs = inputs;
        this.outputs = outputs;
    }

    public static CreateMultipleOutput(name: string, time: number, amount: number, outputs: RecipeInput[], inputs: RecipeInput[]): Recipe
    {
        return new Recipe(
            name,
            time,
            outputs,
            inputs
        )
    }

    public static CreateSingleOutput(name: string, time: number, amount: number, ... inputs: RecipeInput[]): Recipe
    {
        return new Recipe(
            name,
            time,
            [new RecipeInput(amount, name)],
            inputs
        )
    }
}



export class RecipeBookInfo {
    constructor(public name: string, public desc: string) {}
}