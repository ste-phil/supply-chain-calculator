import { Recipe } from "./entities";
import { store } from "./store";


export class CalculationRequest {
    private constructor(public recipe: Recipe, public amountPerSecond: number) {}

    public static fromPerSecond(recipe: Recipe, amount: number): CalculationRequest {
        return new CalculationRequest(recipe, amount);
    }

    public static fromFactories(recipe: Recipe, amount: number): CalculationRequest {
        const aps = amount * recipe.outputs[0].amount / recipe.time
        return new CalculationRequest(recipe, aps);
    }
}


export class ResolveResult {
    constructor(public name: string, public amountFactories: number, public perSecond: number) {}
}

export class ResolveResultTree {
    public result: ResolveResult = {} as ResolveResult;
    public subResults: ResolveResultTree[] = [];
}

/*
3/35 für 5 Gelbe (3 Prozessoren alle 35 Sekunden für 5 Gelbe) 			5/35 => 0.14 Gelbe/sec  
=> 0.086 Prozessoren/sec für 5 Gelbe/35 sec (0.14 Gelbe/sec)
=> Wollen = 2
	=> 2 / 0.14 ~ 14
    => Wie viele Prozessoren werden jede Sekunde gebraucht?
  	=> 0.086 Prozessoren/sec * 14 = 1.2 Prozessoren / sec
    
		=> AnzahlFabriken: 1.2 / (1 / 10) = 12 Fabriken
*/

export default class Calculator {
    public static resolveRequirementsTree(request: CalculationRequest): ResolveResultTree {
        const recipe = request.recipe;
        const makeAmount = request.amountPerSecond;

        const reqTree = new ResolveResultTree();
        Calculator.resolveRequirementsTreeIntern(reqTree, recipe, makeAmount);
        return reqTree;
    }

    public static resolveRequirements(request: CalculationRequest): ResolveResult[] {
        const requiredResourcesDict = {} as any;

        const recipe = request.recipe;
        const makeAmount = request.amountPerSecond;
    
        //Add recipe itself to display required factories
        requiredResourcesDict[recipe.name] = makeAmount;

        Calculator.resolveRequirementsIntern(requiredResourcesDict, recipe, makeAmount);
        return Calculator.prepareResults(requiredResourcesDict);
    }


    private static resolveRequirementsTreeIntern(resourceTree: ResolveResultTree, recipe: Recipe, makeAmount: number): void {
        const perSecond = recipe.outputs[0].amount / recipe.time;
        const factor = makeAmount / perSecond;

        resourceTree.result = new ResolveResult(recipe.name, Calculator.getBuildingCount(makeAmount, recipe), makeAmount);
        resourceTree.subResults = new Array<ResolveResultTree>(recipe.inputs.length);

        for (let i = 0; i < recipe.inputs.length; i++) {
            // const subRecipe = store.book.findRecipe(recipe.inputs[i].recipeName);
            const subRecipes = store.book.findRecipesWithOutputRecipe(recipe.inputs[i].recipeName);
            if (subRecipes.length == 0) throw new Error("Couldn`t find any recipes which have as output: " + recipe.inputs[i].recipeName + " for the recipe: " + recipe.name)
            
            resourceTree.subResults[i] = new ResolveResultTree();
            const requiredSubAmount = factor * recipe.inputs[i].amount / recipe.time; //required items per second

            Calculator.resolveRequirementsTreeIntern(
                resourceTree.subResults[i],
                subRecipes[0],
                requiredSubAmount
            );
        }
    }

    private static resolveRequirementsIntern(requiredResourcesDict: any, recipe: Recipe, makeAmount: number): void {
        const perSecond = recipe.outputs[0].amount / recipe.time;
        const factor = makeAmount / perSecond;

        for (let i = 0; i < recipe.inputs.length; i++) {
            const subRecipe = store.book.findRecipe(recipe.inputs[i].recipeName);
            if (subRecipe == null) throw new Error("Couldn`t find input recipe with the name: " + recipe.inputs[i].recipeName + " for the recipe: " + recipe.name)
            
            const requiredSubAmount = factor * recipe.inputs[i].amount / recipe.time; //required items per second

            if (!requiredResourcesDict[subRecipe.name])
                requiredResourcesDict[subRecipe.name] = 0;
            requiredResourcesDict[subRecipe.name] += requiredSubAmount;

            if (subRecipe.inputs.length > 0)
                Calculator.resolveRequirementsIntern(
                    requiredResourcesDict,
                    subRecipe,
                    requiredSubAmount
                );
        }
    }

    private static prepareResults(requiredRecourcesDict: any): ResolveResult[]  {
        const results = new Array<ResolveResult>();
    
        for (const recipeName in requiredRecourcesDict) {
          const recipe = store.book.findRecipe(recipeName)!;
    
          results.push(new ResolveResult(
            recipe.name,
            Calculator.getBuildingCount(requiredRecourcesDict[recipe.name], recipe),
            requiredRecourcesDict[recipe.name]
          ));
        }
    
        // this.results.reverse();
        return results;
    }

    private static getBuildingCount(perSecond: number, recipe: Recipe): number {
        return perSecond * recipe.time / recipe.outputs[0].amount;
    }
}