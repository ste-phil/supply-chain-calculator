<template>
<div>
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
</div>
</template>

<script lang="ts">
import { Recipe } from "@/store/entities";
import StoreMixin from "@/store/store";
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";

class ResolveResult {
  constructor(public name: string, public amountFactories: number, public perSecond: number) {}
}

@Component({})
export default class ChainCalculator extends Mixins(StoreMixin) {
  itemsPerSecondsMode = true;
  results: Array<ResolveResult> = [];

  @Prop({required: true})
  request: any;

  @Watch("request")
  requestChanged(newVal: any) {
    const requiredResourcesDict = {};

    const recipe = this.store.book.findRecipe(newVal.recipeName);
    const makeAmount = newVal.amount;

    this.resolveRequirements(requiredResourcesDict, recipe, makeAmount);
    this.prepareResults(requiredResourcesDict);
  }

  resolveRequirements(requiredResourcesDict: any, recipe: Recipe, makeAmount: number) {
    for (let i = 0; i < recipe.inputs.length; i++) {
      const subRecipe = this.store.book.findRecipe(recipe.inputs[i].recipeName);
      if (subRecipe == null) throw new Error("Couldn`t find input recipe with the name: " + recipe.inputs[i].recipeName + " for the recipe: " + recipe.name)
      
      const requiredSubAmount = (makeAmount * subRecipe.amount) / recipe.time; //required items per second

      if (!requiredResourcesDict[subRecipe.name])
        requiredResourcesDict[subRecipe.name] = 0;
      requiredResourcesDict[subRecipe.name] += requiredSubAmount;

      if (subRecipe.inputs.length > 0)
        this.resolveRequirements(
          requiredResourcesDict,
          subRecipe,
          requiredSubAmount
        );
    }
  }

  prepareResults(requiredRecourcesDict: any) {
    this.results = new Array<ResolveResult>();

    for (const recipeName in requiredRecourcesDict) {
      const recipe = this.store.book.findRecipe(recipeName);

      this.results.push(new ResolveResult(
        recipe.name,
        requiredRecourcesDict[recipe.name] * recipe.time,
        requiredRecourcesDict[recipe.name]
      ));
    }

    // this.results.reverse();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
