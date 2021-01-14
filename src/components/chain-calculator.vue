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
    const requiredResourcesDict = {} as any;

    const recipe = this.store.book.findRecipe(newVal.recipeName);
    const makeAmount = newVal.amount;

    requiredResourcesDict[recipe.name] = makeAmount;

    this.resolveRequirements(requiredResourcesDict, recipe, makeAmount);
    this.prepareResults(requiredResourcesDict);
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

  resolveRequirements(requiredResourcesDict: any, recipe: Recipe, makeAmount: number) {
    const perSecond = recipe.amount / recipe.time;
    const factor = makeAmount / perSecond;

    for (let i = 0; i < recipe.inputs.length; i++) {
      const subRecipe = this.store.book.findRecipe(recipe.inputs[i].recipeName);
      if (subRecipe == null) throw new Error("Couldn`t find input recipe with the name: " + recipe.inputs[i].recipeName + " for the recipe: " + recipe.name)
      
      const requiredSubAmount = factor * recipe.inputs[i].amount / recipe.time; //required items per second

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
        requiredRecourcesDict[recipe.name] * recipe.time / recipe.amount,
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
