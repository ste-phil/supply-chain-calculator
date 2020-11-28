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

                <button class="btn-small btn-secondary" style="position: absolute; top: 0; right: 0;" @click="changeMode(vr)">Edit</button>
            </div>
        </div>

        <recipe-create-form v-if="vr.editMode"></recipe-create-form>
    </div>

    
</template>

<script>
import { reactive } from 'vue';
import RecipeCreateForm from './recipe-create-form/recipe-create-form.vue';

export default {
    name: "recipe-list",
    props: [],
    components: {
        "recipe-create-form": RecipeCreateForm
    },
    methods: {
        findRecipeName(recipeId) {
            return this.$data.repository.findRecipe(recipeId).name;
        },
        changeMode(vr) {
            vr.editMode = !vr.editMode;
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