import { createApp, reactive } from 'vue'
import App from './App.vue'
import ClipboardJS from 'clipboard'

new ClipboardJS('.to-clipboard', {
    text: function() {
        return JSON.stringify(repository.getRecipes())
    }
});

let defaultRecipes = [
    {
        id: 6,
        name: "Iron Ore", 
        time: 1,
        amount: 1,
        input: []
    },{
        id: 5,
        name: "Iron Plate", 
        time: 3.2,
        amount: 1,
        input: [{recipeId: 6, amount: 1}]
    },{
        id: 4,
        name: "Copper ore", 
        time: 1,
        amount: 1,
        input: []
    },{
        id: 3,
        name: "Copper Plate", 
        time: 3.2,
        amount: 1,
        input: [{recipeId: 4, amount: 1}]
    },{
        id: 2,
        name: "Gears", 
        time: 0.5,
        amount: 1,
        input: [{recipeId: 5, amount: 2}]
    },{
        id: 1,
        name: "Red Science", 
        time: 5,
        amount: 1,
        input: [{recipeId: 2, amount: 1}, {recipeId: 3, amount: 1}]
    }
];

const repository = {
    state: reactive({
        saveName: "default",
        recipes: []
    }),

    retrieveSavedRecipeNames() {
        return JSON.parse(localStorage.getItem("saves"));
    },
    loadRecipes(saveName) {
        this.state.saveName = saveName;
        this.state.recipes = JSON.parse(localStorage.getItem("recipe-save-" + saveName));
    },
    saveRecipes() {
        localStorage.setItem("recipe-save-" + this.state.saveName, JSON.stringify(this.state.recipes));

        let saves = this.retrieveSavedRecipeNames();
        if (!saves) saves = [];

        saves.push(this.state.saveName);
        localStorage.setItem("saves", JSON.stringify(saves));
    },
    deleteRecipes(saveName) {
        localStorage.setItem("recipe-save-" + saveName, null);

        let saves = this.retrieveSavedRecipeNames();
        if (!saves) saves = [];
        saves = saves.filter(x => x != saveName);

        localStorage.setItem("saves", JSON.stringify(saves));
    },
    importRecipes(recipeString, mode) {
        var importedRecipes = JSON.parse(recipeString);

        if (mode == "override") this.state.recipes = importedRecipes;
        else if (mode == "extend") this.state.recipes.push(importedRecipes);

        this.saveRecipes();
    },
    addRecipe(name, time, amount, input) {
        if (this.recipeNameExists(name)) return;

        this.state.recipes.splice(0, 0, {
            id: this.state.recipes[0].id + 1, 
            name, 
            time, 
            amount, 
            input
        });

        this.saveRecipes();
    },
    updateRecipe(oldRecipe, name, time, amount, input) {
        if (oldRecipe.name != name && this.recipeNameExists(name)) return false;

        let i = this.state.recipes.indexOf(oldRecipe)
        this.state.recipes[i].name = name;
        this.state.recipes[i].time = time;
        this.state.recipes[i].amount = amount;
        this.state.recipes[i].input = input;

        this.saveRecipes();
    },
    getRecipes() {
        return this.state.recipes;
    },
    findRecipe(id) {
        return this.state.recipes.filter(x => x.id == id)[0];
    },
    findRecipeByName(name) {
        return this.state.recipes.filter(x => x.name == name)[0];
    },
    recipeNameExists(name) {
        return this.state.recipes.filter(x => x.name == name).length ? true : false;
    },
    isRecipeDeletable(recipeToCheck) {
        for(let i = 0; i < this.state.recipes.length; i++) {
            let recipe = this.state.recipes[i];
            for(let j = 0; j < recipe.input.length; j++) {
                let inputRecipeId = recipe.input[j].recipeId;
                if (inputRecipeId == recipeToCheck.id) return false;
            }
        }

        return true;
    },
    deleteRecipe(recipe) {
        this.state.recipes.splice(this.state.recipes.indexOf(recipe), 1);

        this.saveRecipes();
    },
    addRecipeMock() {
        this.state.recipes.push({
            name: "Test", 
            id: this.state.recipes[this.state.recipes.length - 1].id + 1,
            time: 23.0,
            amount: 14,
            input: []
        })
    },
}

let savedRecipes = repository.retrieveSavedRecipeNames();
if (!savedRecipes) repository.state.recipes = defaultRecipes;
else repository.loadRecipes(savedRecipes[0]);

createApp(App).mixin({
    data() {
        return {
            repository
        }
    }
}).mount('#app')