<template>
<div class="card" @click="adding = true;" style="cursor: pointer;">
  <template v-if="!adding" >
    <div class="card-body card-add" style="margin: 0 auto;" >
      <span class="material-icons material-icons-large">add_circle_outline</span>
    </div> 
  </template>

  <template v-if="adding">
    <div class="card-body">
      <input v-model="name" style="margin: 0 0 5px 0; width: 100%;" placeholder="Name"/>
      <input v-model="time" style="margin: 0 0 5px 0; width: 100%;" placeholder="Time (seconds)" type="number"/>
      
      <div class="clearfix">
      <input @keyup="onKeyUpRecipeIn" v-model="selectedInput" placeholder="Select Inputs" list="recipes-create" style="margin: 0 0 5px 0; width: calc(100% - 35px); float:left;">
      <button @click="addSelectedInput" class="btn-small" style="float:left; font-size:19px; ">+</button>
      <datalist id="recipes-create" >
           <option v-for="recipe in store.book.getRecipeOutputs()" :key="recipe.recipeName" :value="recipe.recipeName" :data-id="recipe.recipeName"></option>
      </datalist>
      </div>

      <div v-if="input.length > 0" style="float:none;width:100%;">
        <label class="header-border">Ingredients</label>
        <div style="padding: 10px; background-color:var(--white-dark-light-80)">
            <ingredient-list-item v-for="ingredient in input" :key="ingredient.recipeName" :ingredient="ingredient" @ingredient-amount-modify="modifyInputAmount(ingredient, $event)"></ingredient-list-item>
        </div>
      </div>
      <br/>

      <hr><br>
      <fieldset v-if="output.length <= 1" class="form-group">
        <label for="paperSwitch7" class="paper-switch-label">Has multiple outputs</label>
        <label class="paper-switch">
          <input id="paperSwitch7" name="paperSwitch7" type="checkbox" v-model="hasMultipleOutputs"/>
          <span class="paper-switch-slider round"></span>
        </label>
      </fieldset>
      <div v-if="hasMultipleOutputs">
        <div class="clearfix">
        <input @keyup="onKeyUpRecipeOut" v-model="selectedOutput" placeholder="Enter Ouput" list="recipes-create" style="margin: 0 0 5px 0; width: calc(100% - 35px); float:left;">
        <button @click="addSelectedOutput" class="btn-small" style="float:left; font-size:19px; ">+</button>
        </div>
      </div>
      <div v-if="!hasMultipleOutputs">
        <input v-model="amount" style="margin: 0 0 5px 0; width: 100%;" placeholder="Output (amount)" type="number"/>
      </div>

      <div v-if="output.length > 1" style="float:none;width:100%;">
        <label class="header-border">Outputs</label>
        <div style="padding: 10px; background-color:var(--white-dark-light-80)">
            <ingredient-list-item v-for="ingredient in output" :key="ingredient.recipeName" 
              :ingredient="ingredient" 
              @ingredient-amount-modify="modifyOutputAmount(ingredient, $event)">
            </ingredient-list-item>
        </div>
      </div>
      <br/>

      <button @click.stop="cancel()" style="width: 50%;" class="btn-danger">Cancel</button>
      <button @click.stop="submit()" style="width: 50%;" class="btn-secondary">Save</button>
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

  output = new Array<RecipeInput>();
  selectedOutput = "";
  hasMultipleOutputs = false;

  submit() {
    if (
      this.name != "" && 
      this.time != "" &&
      this.hasMultipleOutputs || (this.amount != "") &&
      !this.hasMultipleOutputs || (this.output.length > 0 && this.output[0].amount > 0)
     ) {
      this.store.book.addRecipe(
        this.name,
        Number(this.time),
        Number(this.amount),
        this.output,
        this.input
      );

      this.store.saveBook();
      this.clearFields();
      this.adding = false;
    }
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
    this.output = [];
  }

  addSelectedInput() {
    const recipe = this.store.book.findRecipe(this.selectedInput);
    if (recipe == null) return;

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

  addSelectedOutput() {
    const recipeName = this.selectedOutput;
    for (let i = 0; i < this.output.length; i++) {
      if (this.output[i].recipeName == recipeName) {
        this.output[i].amount++;
        this.selectedInput = "";
        return;
      }
    }

    this.output.push(new RecipeInput(1, recipeName));

    //Clear current selection
    this.selectedOutput = "";
  }

  modifyInputAmount(ing: RecipeInput, amount: number) {
    if (ing.amount + amount > 0) ing.amount += amount;
    else this.input.splice(this.input.indexOf(ing), 1)
  }

  modifyOutputAmount(ing: RecipeInput, amount: number) {
    if (ing.amount + amount > 0) ing.amount += amount;
    else this.output.splice(this.input.indexOf(ing), 1)
  }


  onKeyUpRecipeIn(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.addSelectedInput();
    }
  }

  onKeyUpRecipeOut(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.addSelectedOutput();
    }
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
