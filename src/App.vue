<template>
  <div class="row" style="margin-bottom: 0px;">
      <div class="lg-3 sm-4 col sb2" style="height: 100vh; overflow-y: auto;">
          <div style="height:50px;">
              <button-img @click="createFormVisible = true" style="margin:3px;height:100%;z-index: 1000;" icon="gg-add" text="Add" popover-text="Add new Recipe" popover-position="popover-bottom"></button-img>
              <button-img class="to-clipboard" style="margin:3px;height:100%;z-index: 1000;" icon="gg-export" popover-text="Export Recipe" popover-position="popover-bottom"></button-img>
              <button-img @click="importRecipes()" style="margin:3px;height:100%;z-index: 1000;" icon="gg-import" popover-text="Import Recipe" popover-position="popover-bottom"></button-img>
          </div>

          <create-recipe-form v-model:visible="createFormVisible"></create-recipe-form>

          <recipe-list></recipe-list>
      </div>
      <div class="col-fill col"> 
          <chain-resolver></chain-resolver>
      </div>
  </div>
</template>

<script>
import ChainResolver from './components/chain-resolver.vue'
import CreateRecipeForm from './components/recipe-list/recipe-create-form.vue'
import ButtonImg from './components/button-img.vue'
import RecipeList from './components/recipe-list/recipe-list.vue'


export default {
  name: 'App',
  components: {
    ChainResolver,
    CreateRecipeForm,
    ButtonImg,
    RecipeList
  },
  data() {
    return {
      createFormVisible: false
    }
  },
}
</script>

<style>
@import url('https://unpkg.com/css.gg/icons/all.css');
@import url('https://unpkg.com/papercss@1.8.2/dist/paper.min.css');

.sb1::-webkit-scrollbar {
    width: 15px;
    height: 15px;
}
.sb1::-webkit-scrollbar-track {
border-radius: 10px;
background-color: rgba(255, 255, 255, 0.1);
}
.sb1::-webkit-scrollbar-thumb {
background-image: linear-gradient(45deg, #00aeff, #a68eff);
border-radius: 10px;
    -webkit-box-shadow: rgba(0,0,0,.12) 0 3px 13px 1px;
}

.sb2::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}
.sb2::-webkit-scrollbar-track {
background-color: rgba(255, 255, 255, 0.1);
border-radius: 10px;
}
.sb2::-webkit-scrollbar-thumb {
background-color: #11171a;
border-radius: 10px;
}

[popover-bottom]:after, [popover-top]:after, [popover-left]:after, [popover-right]:after  {
  background: white;
  color: black;
}

</style>
