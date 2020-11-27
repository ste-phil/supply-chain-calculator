<template>
  <fieldset
    class="form-group"
    style="float: right; top: 0; right: 0; cursor: pointer">
    <label class="paper-switch-label">Required Factories</label>
    <label class="paper-switch">
      <input type="checkbox" v-model="itemsPerSecondsMode" />
      <span class="paper-switch-slider round"></span>
    </label>
    <label class="paper-switch-label">Items per seconds</label>
  </fieldset>

  <p>Results:</p>
  <br />
  <div>
    <div v-if="itemsPerSecondsMode">
      <p v-for="result in results" :key="result">
      {{ result.name }}: <strong>{{ Math.round(result.perSecond * 100) / 100 }}</strong>/s
      </p>
    </div>
    <div v-if="!itemsPerSecondsMode">
      <p v-for="result in results" :key="result">
        {{ result.name }}: <strong>{{ Math.round(result.amountFactories * 100) / 100 }}</strong> Factories
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "chain-calculator",
  data() {
    return {
      itemsPerSecondsMode: true,
      results: [],
    };
  },
  props: ["request"],
  watch: {
    request(newVal) {
      let requiredResourcesDict = {};

      let recipe = this.$data.repository.findRecipe(newVal.recipeId);
      let makeAmount = newVal.amount;

      this.resolveRequirements(requiredResourcesDict, recipe, makeAmount);
      this.prepareResults(requiredResourcesDict);
    },
  },
  methods: {
    resolveRequirements(requiredResourcesDict, recipe, makeAmount) {
      for (let i = 0; i < recipe.input.length; i++) {
        let subRecipe = this.$data.repository.findRecipe(recipe.input[i].recipeId);
        let requiredSubAmount = (makeAmount * subRecipe.amount) / recipe.time; //required items per second

        if (!requiredResourcesDict[subRecipe.id])
          requiredResourcesDict[subRecipe.id] = 0;
        requiredResourcesDict[subRecipe.id] += requiredSubAmount;

        if (subRecipe.input.length > 0)
          this.resolveRequirements(
            requiredResourcesDict,
            subRecipe,
            requiredSubAmount
          );
      }
    },
    prepareResults(requiredRecourcesDict) {
      this.results = [];

      for (let recipeId in requiredRecourcesDict) {
        let recipe = this.$data.repository.findRecipe(recipeId);

        this.results.push({
          id: recipeId,
          name: recipe.name,
          amountFactories: requiredRecourcesDict[recipeId] * recipe.time,
          perSecond: requiredRecourcesDict[recipeId],
        });
      }

      this.results.reverse();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
