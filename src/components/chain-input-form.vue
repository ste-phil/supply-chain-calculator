<template>
<div>
  <div class="form-group">
    <label for="request.name">Recipe to make</label>
    <input v-model="request.name" placeholder="Select Recipe" list="recipes" />
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
    <label for="request.amount">Amount (per second)</label>
    <input v-model="request.amount" type="number"/>
  </div>
  <button @click="tryRequest">Calculate</button>
</div>
</template>

<script lang="ts">
import StoreMixin from '@/store/store';
import { Component, Emit, Mixins } from 'vue-property-decorator';

@Component({})
export default class ChainInputForm extends Mixins(StoreMixin) {
  request = {
    name: "",
    amount: 1,
  };

  @Emit("resolve-requested") 
  resolveRequested(data: any): boolean {
    if (data.name && data.amount) return true;
    return false;
  }

  tryRequest() {
    if (this.request.name && this.request.amount > 0)
      this.$emit("resolve-requested", {
        recipeName: this.request.name,
        amount: this.request.amount,
      });
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
