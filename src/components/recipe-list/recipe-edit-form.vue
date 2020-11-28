<template>
  <div class="card" style="width: 100%; margin:10px 0 10px 0;">
    <div class="card-body">
      <input v-model="name" style="margin: 0 0 5px 0; width: 100%;" placeholder="Name"/>
      <input v-model="time" style="margin: 0 0 5px 0; width: 100%;" placeholder="Time (seconds)" type="number"/>
      <input v-model="amount" style="margin: 0 0 5px 0; width: 100%;" placeholder="Amount" type="number"/>
      
      <div class="clearfix">
        <input v-model="selectedInput" placeholder="Select Inputs" list="recipes-create" style="margin: 0 0 5px 0; width: calc(100% - 35px); float:left;">
        <button @click="addSelectedInput" class="btn-small" style="float:left; font-size:19px; ">+</button>
        <datalist id="recipes-create" >
            <option v-for="recipe in repository.getRecipes()" :key="recipe" :value="recipe.name" :data-id="recipe.id"></option>
        </datalist>
      </div>

      <div v-if="input.length > 0" style="float:none;width:100%;">
        <hr >
        <label class="border">Ingredients</label>
        <div style="padding: 10px; background-color:var(--white-dark-light-80)">
            <ingredient-list-item v-for="ingredient in input" :key="ingredient" :ingredient="ingredient" @ingredient-amount-modify="modifiyIngredientAmount(ingredient, $event)"></ingredient-list-item>
        </div>
      </div>
      <br/>

      <button @click="cancel()" style="width: 50%;" class="btn-danger">Cancel</button>
      <button @click="save()" style="width: 50%;" class="btn-secondary">Save</button>
    </div>
  </div>
</template>

<script>
import IngredientListItem from './ingredient-list-item.vue';

export default {
  name: "recipe-edit-form",
  emits: ["save", "cancel"],
  props: ["recipe"],
  components: {
    "ingredient-list-item" : IngredientListItem
  },
  data() {
    return {
      name: this.recipe.name,
      time: this.recipe.time,
      amount: this.recipe.amount,
      input: this.recipe.input,
      selectedInput: "",
    };
  },
  methods: {
    save() {
      if (this.name != "" && this.time != "" && this.amount != "") {
        this.$emit("save", {
          id: this.recipe.id,
          name: this.name,
          time: this.time,
          amount: this.amount,
          input: this.input
        });
      }

      this.clearFields();
    },
    cancel() {
      this.clearFields();
      this.$emit("cancel");
    },
    clearFields() {
      this.name = "";
      this.time = "";
      this.amount = "";
      this.input = [];
    },
    findRecipeName(recipeId) {
      return this.repository.findRecipe(recipeId).name;
    },
    addSelectedInput() {
      let recipe = this.$data.repository.findRecipeByName(this.selectedInput);

      for (let i = 0; i < this.input.length; i++) {
        if (this.input[i].recipeId == recipe.id) {
          this.input[i].amount++;
          this.selectedInput = "";
          return;
        }
      }

      this.input.push({recipeId: recipe.id, amount: 1, name: recipe.name})

      //Clear current selection
      this.selectedInput = "";
    },
    modifiyIngredientAmount(ing, amount) {
      if (ing.amount + amount > 0) ing.amount += amount;
      else this.input.splice(this.input.indexOf(ing), 1)
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.clearfix:after {
  content: "";
  clear: both;
  display: table;
}

.border {
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
