<template>
  <div class="card" style="width: 100%; margin:10px 0 10px 0;">
    <div class="card-body">
      <input readonly class="disabled" v-model="recipe.name" style="margin: 0 0 5px 0; width: 100%;" placeholder="Name"/>
      <input v-model="recipe.time" style="margin: 0 0 5px 0; width: 100%;" placeholder="Time (seconds)" type="number"/>
      <input v-model="recipe.amount" style="margin: 0 0 5px 0; width: 100%;" placeholder="Amount" type="number"/>
      
      <div class="clearfix">
        <input v-model="selectedInput" placeholder="Select Inputs" list="recipes-create" style="margin: 0 0 5px 0; width: calc(100% - 35px); float:left;">
        <button @click="addSelectedInput" class="btn-small" style="float:left; font-size:19px; ">+</button>
        <datalist id="recipes-create" >
            <option v-for="recipe in store.book.getRecipes()" :key="recipe.name" :value="recipe.name" :data-id="recipe.id"></option>
        </datalist>
      </div>

      <div v-if="recipe.inputs.length > 0" style="float:none;width:100%;">
        <hr >
        <label class="header-border">Ingredients</label>
        <div style="padding: 10px; background-color:var(--white-dark-light-80)">
            <ingredient-list-item v-for="ingredient in recipe.inputs" :key="ingredient.name" :ingredient="ingredient" @ingredient-amount-modify="modifyInputAmount(ingredient, $event)"></ingredient-list-item>
        </div>
      </div>
      <br/>

      <div class="action-bar">
        <button @click="submit()" class="btn-secondary action-bar-item">Save</button>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { RecipeInput, Recipe } from '@/store/entities';
import StoreMixin from '@/store/store';
import { Component, Emit, Mixins, Prop } from 'vue-property-decorator';
import IngredientListItem from './ingredient-list-item.vue';


@Component({
  components: {
    IngredientListItem
  }
})
export default class RecipeEditForm extends Mixins(StoreMixin) {
  selectedInput = "";

  @Prop({required: true})
  recipe!: Recipe;

  @Emit("submit")
  submitted() {
    return;
  }

  submit() {
    if (this.recipe.name != "" && this.recipe.time >= 0 && this.recipe.amount >= 0) {
      this.store.saveBook();
    }

    this.$emit("submit");
  }
  addSelectedInput() {
    const recipe = this.store.book.findRecipe(this.selectedInput);

    for (let i = 0; i < this.recipe.inputs.length; i++) {
      if (this.recipe.inputs[i].recipeName == recipe.name) {
        this.recipe.inputs[i].amount++;
        this.selectedInput = "";
        return;
      }
    }

    this.recipe.inputs.push(new RecipeInput(1, recipe.name));

    //Clear current selection
    this.selectedInput = "";
  }
  modifyInputAmount(ing: RecipeInput, amount: number) {
    if (ing.amount + amount > 0) ing.amount += amount;
    else this.recipe.inputs.splice(this.recipe.inputs.indexOf(ing), 1)
  }
}
</script>

<style>
.header-border {
  color: #41403e;
  color: var(--primary);
  border-bottom: 1px solid #41403e;
  border-bottom-color: var(--muted-light);
  display: inline-block;
  font-weight: 600;
  margin: 0 0 -1px;
  padding: .75rem;
  text-align: center;
  padding: 0.15rem;
  width: 100%;
  border-left: none;
  border-right: none;
  border-radius: 0px;
}

</style>
