<template>
<div>
  <div class="form-group">
    <label for="request.name">Recipe to make</label>
    <input v-model="request.name" placeholder="Select Recipe" list="recipes" style="width: 100%"/>
    <datalist id="recipes">
      <option
        v-for="recipe in store.book.getRecipes()"
        :key="recipe.name"
        :value="recipe.name"
        :data-id="recipe.name"
      ></option>
    </datalist>
  </div>
  <div class="form-group">
    <label v-if="perSecondMode" for="request.amount">Amount (per second)</label>
    <label v-if="!perSecondMode" for="request.amount">Amount (per building)</label>
      <div>
        <label class="btn-flip" for="input-toggle">
          <input v-model="perSecondMode" id="input-toggle" type="checkbox"/>
          <div class="btn-flip-wrapper">
            <div class="btn-flip-front btn-icon-inline"><span class="material-icons">house</span></div>
            <div class="btn-flip-back  btn-icon-inline"><span class="material-icons">access_time</span></div>
          </div>
        </label>
        <input v-model="request.amount" type="number" style="display: inline; width: calc(100% - 48px)"/>
      </div>
  </div>
  <button @click="tryRequest" class="btn-primary">Calculate</button>
</div>
</template>

<script lang="ts">
import StoreMixin from '@/store/store';
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator';
import { CalculationRequest } from "@/store/calculator";

@Component({})
export default class ChainInputForm extends Mixins(StoreMixin) {
  request = {
    name: "",
    amount: 1,
  };
  perSecondMode = true;

  @Emit("resolve-requested") 
  resolveRequested(data: CalculationRequest): boolean {
    if (data.recipe && data.amountPerSecond) return true;
    return false;
  }

  tryRequest() {
    if (this.request.name && this.request.amount > 0) {
      const recipe = this.store.book.findRecipe(this.request.name);
      const request = this.perSecondMode ? CalculationRequest.fromPerSecond(recipe, this.request.amount) : CalculationRequest.fromFactories(recipe, this.request.amount);
      this.$emit("resolve-requested", request);
    }
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.btn-flip {
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  display: inline-block;
  transition: color 0.5s ease;
  
  cursor: pointer;
}

.btn-flip input {
  display: none;
}

.btn-flip input:checked + .btn-flip-wrapper {  
  transform: rotateX(180deg);
}

.btn-flip .btn-flip-wrapper {
  transition: transform 0.5s cubic-bezier(0.775, 0.07, 0.575, 0.995);
  transform-style: preserve-3d;
  position: relative;
}

.btn-flip:hover {
  color: var(--secondary);
  /* background: var(--primary); */
}

.btn-flip .btn-flip-front {
  backface-visibility: hidden;
  z-index: 2;
  transform: rotateX(0deg);
  position: absolute;

  border: 2px solid #41403e;
  border-color: var(--primary);
  border-bottom-left-radius: 15px 255px;
  border-bottom-right-radius: 225px 15px;
  border-top-left-radius: 255px 15px;
  border-top-right-radius: 15px 225px;
}

.btn-flip .btn-flip-back {
  backface-visibility: hidden;
  transform: rotateX(-180deg);
  position: relative;

  border: 2px solid #41403e;
  border-color: var(--primary);
  border-bottom-left-radius: 15px 255px;
  border-bottom-right-radius: 225px 15px;
  border-top-left-radius: 255px 15px;
  border-top-right-radius: 15px 225px;
}

</style>
