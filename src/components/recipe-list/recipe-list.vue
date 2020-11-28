<template>
    <div v-for="vr in getViewRecipes" :key="vr">
        <div v-if="!vr.editMode" class="card" style="width: 100%; margin:10px 0 10px 0;" >
            <div class="card-body">
                <h4 class="card-title">{{vr.recipe.name}}</h4>
                <h5 class="card-subtitle"><strong>{{vr.recipe.amount}}x</strong> in <strong>{{vr.recipe.time}}</strong> seconds</h5>

                <div v-if="vr.recipe.input.length > 0" class="collapsible">
                    <input :id="'collapsible' + vr.recipe.id" type="checkbox" name="collapsible">
                    <label :for="'collapsible' + vr.recipe.id" style="padding: 0.15rem">Ingredients</label>
                    <div class="collapsible-body">
                        <h6 v-for="input in vr.recipe.input" style="margin: 0.15rem" :key="input">
                            <strong>{{input.amount}}x</strong> {{findRecipeName(input.recipeId)}}
                        </h6>
                    </div>
                </div>

                <button v-if="isRecipeDeletable(vr)" class="btn-small btn-secondary" style="position: absolute; top: 2px; right: 50px;" @click="deleteEntry(vr)">Delete</button>
                <button class="btn-small btn-secondary" style="position: absolute; top: 2px; right: 2px;" @click="changeMode(vr)">Edit</button>
            </div>
        </div>

        <recipe-edit-form v-if="vr.editMode" :recipe="vr.recipe" @save="recipeEditSaved($event, vr)"  @cancel="recipeEditCanceled(vr)"></recipe-edit-form>
    </div>

    
</template>

<script>
import { reactive } from 'vue';
import RecipeEditForm from './recipe-edit-form.vue';

export default {
    name: "recipe-list",
    props: [],
    components: {
        "recipe-edit-form": RecipeEditForm
    },
    methods: {
        findRecipeName(recipeId) {
            return this.$data.repository.findRecipe(recipeId).name;
        },
        changeMode(vr) {
            vr.editMode = !vr.editMode;
        },
        recipeEditSaved(editedRecipe, vr) {
            this.$data.repository.updateRecipe(
                vr.recipe,
                editedRecipe.name,
                editedRecipe.time,
                editedRecipe.amount,
                editedRecipe.input
            );

            this.changeMode(vr);
        },
        recipeEditCanceled(vr) {
            this.changeMode(vr);
        },
        isRecipeDeletable(vr) {
            return this.$data.repository.isRecipeDeletable(vr.recipe);
        },
        deleteEntry(vr) {
            this.$data.repository.deleteRecipe(vr.recipe)
        }
    },
    computed: {
        getViewRecipes: function() {
            return this.$data.repository.getRecipes().map(recipe =>  {
                return reactive({recipe, editMode: false})
            })
        }
    }
}
</script>

<style>

</style>