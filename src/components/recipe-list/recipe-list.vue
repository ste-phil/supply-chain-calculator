<template>
<div class="grid">
    <recipe-create-form></recipe-create-form>

    <template v-for="vr in getViewRecipes">
        <div v-if="!vr.editMode" :key="vr.recipe.name" class="card grid-card">
            <div class="card-body">
                <h4 class="card-title">{{vr.recipe.name}}</h4>
                <h5 class="card-subtitle"><strong>{{vr.recipe.amount}}x</strong> in <strong>{{vr.recipe.time}}</strong> seconds</h5>

                <div v-if="vr.recipe.inputs.length > 0" class="collapsible">
                    <input :id="'collapsible' + vr.recipe.name" type="checkbox" name="collapsible">
                    <label :for="'collapsible' + vr.recipe.name" style="padding: 0.15rem">Ingredients</label>
                    <div class="collapsible-body">
                        <h6 v-for="input in vr.recipe.inputs" style="margin: 0.15rem" :key="input.recipeName">
                            <strong>{{input.amount}}x</strong> {{input.recipeName}}
                        </h6>
                    </div>
                </div>

                <button v-if="isRecipeDeletable(vr)" class="btn-small btn-secondary" style="position: absolute; top: 2px; right: 50px;" @click="deleteEntry(vr)">Delete</button>
                <button class="btn-small btn-secondary" style="position: absolute; top: 2px; right: 2px;" @click="changeMode(vr)">Edit</button>
            </div>
        </div>

        <recipe-edit-form :key="vr.recipe.name" v-if="vr.editMode" :recipe="vr.recipe" @submit="vr.editMode = false"  ></recipe-edit-form>
    </template>
</div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import StoreMixin from "@/store/store";
import RecipeEditForm from './recipe-edit-form.vue';
import RecipeCreateForm from './recipe-create-form.vue';
import Vue from 'vue'
import { Recipe } from "@/store/entities";

class ViewRecipe {
    constructor(public recipe: Recipe, public editMode: boolean) {}
}

@Component({
    components: {
        RecipeEditForm, RecipeCreateForm
    }
})
export default class RecipeList extends Mixins(StoreMixin) {
    changeMode(vr: ViewRecipe) {
        vr.editMode = !vr.editMode;
    }

    isRecipeDeletable(vr: ViewRecipe) {
        return this.store.book.isRecipeDeletable(vr.recipe);
    }

    deleteEntry(vr: ViewRecipe) {
        this.store.book.deleteRecipe(vr.recipe)
    }

    get getViewRecipes() {
        return this.store.book.getRecipes().map((recipe: Recipe) =>  {
            return Vue.observable(new ViewRecipe(recipe, false))
        })
    }
}
</script>

<style scoped>
.card {
    float: left;
    margin: 10px;
    min-width: 14rem;
    max-width: 20rem;
    min-height: 8.5rem;
}

.grid {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
}

.grid-card {

}
</style>