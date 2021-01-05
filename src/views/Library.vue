<template>
  <div class="container-custom">
    <div class="paper">
      <h2 class="header-corner">Library</h2>
      <library-list></library-list>
    </div>

    <div class="paper">
      <h2 class="header-corner">Recipes</h2>
      <recipe-list></recipe-list>
    </div>
  </div>
</template>

<script>
import RecipeList from "@/components/recipe-list/recipe-list.vue"
import LibraryList from "@/components/library-list/library-list.vue"

export default {
  components: {
    RecipeList,
    LibraryList,
  }
}
</script>