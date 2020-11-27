<template>
  <div class="form-group">
    <label for="recipeName">Recipe to make</label>
    <input v-model="recipeName" placeholder="Select Recipe" list="recipes" />
    <datalist id="recipes">
      <option
        v-for="recipe in repository.getRecipes()"
        :key="recipe"
        :value="recipe.name"
        :data-id="recipe.id"
      ></option>
    </datalist>
  </div>
  <div class="form-group">
    <label for="request.amount">Amount (per second)</label>
    <input v-model="request.amount" type="number"/>
  </div>
  <button @click="tryRequest">Calculate</button>
</template>

<script>
export default {
  name: "chain-input-form",
  data() {
    return {
      recipeName: "",
      request: {
        recipeId: "",
        amount: 1,
      },
    };
  },
  emits: {
    "resolve-requested": (data) => {
      if (data.recipeId && data.amount) return true;
      return false;
    },
  },
  methods: {
    tryRequest() {
      let recipe = this.repository.findRecipeByName(this.recipeName);

      if (recipe && this.request.amount > 0)
        this.$emit("resolve-requested", {
          recipeId: recipe.id,
          amount: this.request.amount,
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
