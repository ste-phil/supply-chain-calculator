<template>
<div class="card">
  <template 
    v-if="!adding" 
    style="cursor: pointer;"
    @click="adding = true;"
  >
    <div class="card-body card-add" style="margin: 0 auto;" >
      <span class="material-icons material-icons-large">add_circle_outline</span>
    </div> 
  </template>

  <template v-if="adding">
    <div class="card-body">
      <input v-model="name" style="margin: 0 0 5px 0; width: 100%;" placeholder="Name"/>
      <input v-model="time" style="margin: 0 0 5px 0; width: 100%;" placeholder="Time (seconds)" type="number"/>
      <input v-model="amount" style="margin: 0 0 5px 0; width: 100%;" placeholder="Amount" type="number"/>
      
      <div class="clearfix">
      <input v-model="selectedInput" placeholder="Select Inputs" list="recipes-create" style="margin: 0 0 5px 0; width: calc(100% - 35px); float:left;">
      <button @click="addSelectedInput" class="btn-small" style="float:left; font-size:19px; ">+</button>
      <datalist id="recipes-create" >
          <option v-for="recipe in store.book.getRecipes()" :key="recipe.name" :value="recipe.name" :data-id="recipe.id"></option>
      </datalist>
      </div>

      <div v-if="input.length > 0" style="float:none;width:100%;">
        <hr >
        <label class="header-border">Ingredients</label>
        <div style="padding: 10px; background-color:var(--white-dark-light-80)">
            <ingredient-list-item v-for="ingredient in input" :key="ingredient.name" :ingredient="ingredient" @ingredient-amount-modify="modifyInputAmount(ingredient, $event)"></ingredient-list-item>
        </div>
      </div>
      <br/>

      <button @click="cancel()" style="width: 50%;" class="btn-danger">Cancel</button>
      <button @click="submit()" style="width: 50%;" class="btn-secondary">Save</button>
    </div>
  </template>
</div>
</template>

<script lang="ts">
import { RecipeInput } from '@/store/entities';
import StoreMixin from '@/store/store';
import Component from 'vue-class-component';
import { Mixins } from 'vue-property-decorator';
import IngredientListItem from './ingredient-list-item.vue';

@Component({
  components: {
    IngredientListItem
  }
})
export default class RecipeCreateForm extends Mixins(StoreMixin) {
  adding = false;
  name = "";
  time = "";
  amount = "";
  input = new Array<RecipeInput>();
  selectedInput = "";

  submit() {
    if (this.name != "" && this.time != "" && this.amount != "") {
      this.store.book.addRecipe(
        this.name,
        Number(this.time),
        Number(this.amount),
        this.input
      );
      this.store.saveBook();

      this.clearFields();
    }
    this.adding = false;
  }
  cancel() {
    this.clearFields();
    this.adding = false;
  }
  clearFields() {
    this.name = "";
    this.time = "";
    this.amount = "";
    this.input = [];
  }
  addSelectedInput() {
    const recipe = this.store.book.findRecipe(this.selectedInput);

    for (let i = 0; i < this.input.length; i++) {
      if (this.input[i].recipeName == recipe.name) {
        this.input[i].amount++;
        this.selectedInput = "";
        return;
      }
    }

    this.input.push(new RecipeInput(1, recipe.name));

    //Clear current selection
    this.selectedInput = "";
  }
  modifyInputAmount(ing: RecipeInput, amount: number) {
    if (ing.amount + amount > 0) ing.amount += amount;
    else this.input.splice(this.input.indexOf(ing), 1)
  }
}

</script>

<style scoped>
.clearfix:after {
  content: "";
  clear: both;
  display: table;
}

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

.card-add {
    display: flex;
    align-items: center;
    margin: 0 auto;
}

</style>
