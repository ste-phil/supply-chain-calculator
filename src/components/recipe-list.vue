<template>
    <div class="card" style="width: 100%; margin:10px 0 10px 0;" v-for="recipe in repository.getRecipes()" :key="recipe">
        <div class="card-body">
            <h4 class="card-title">{{recipe.name}}</h4>
            <h5 class="card-subtitle"><strong>{{recipe.amount}}x</strong> in <strong>{{recipe.time}}</strong> seconds</h5>
            

            <div v-if="recipe.input.length > 0" class="collapsible">
                <input :id="'collapsible' + recipe.id" type="checkbox" name="collapsible">
                <label :for="'collapsible' + recipe.id" style="padding: 0.15rem">Ingredients</label>
                <div class="collapsible-body">
                    <h6 v-for="input in recipe.input" style="margin: 0.15rem" :key="input">
                        <strong>{{input.amount}}x</strong> {{findRecipeName(input.recipeId)}}
                    </h6>
                </div>
            </div>

            <button class="btn-small btn-secondary" style="position: absolute; top: 0; right: 0;">Edit</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "recipe-list",
    methods: {
        findRecipeName(recipeId) {
            return this.$data.repository.findRecipe(recipeId).name;
        }
    },
}
</script>

<style>

</style>