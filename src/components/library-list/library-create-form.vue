<template>
<div class="card" @click="isAdding = true">
  <template>
    <div v-if="!isAdding" class="card-body card-add">
      <span class="material-icons material-icons-large">add_circle_outline</span>
    </div>
  </template>

  <template class="card">
    <div v-if="isAdding" class="card-body" style="padding: 0">
      <div v-if="modeSelection">
        <button @click="addEmpty()" style="width:100%" class="button button-primary">Empty</button>
        <button @click="importFromClipboard()" style="width:100%" class="button button-primary">Import from clipboard</button>
      </div>

      <div v-if="!modeSelection">
        <input
          v-model="bookAdding.name"
          style="width: 100%"
          placeholder="Name"
        />
        <input
          v-model="bookAdding.desc"
          style="width: 100%"
          placeholder="Description"
        />

        <div class="action-bar">
          <button
            class="action-bar-item btn-danger btn-small"
            @click.stop="isAdding = false">Cancel</button>
          <button
            class="action-bar-item btn-secondary btn-small"
            @click.stop="addBook()">Save</button>
      </div>
    </div>
      
    </div>
  </template>
  
</div>
</template>

<script lang="ts">
import { RecipeBookInfo } from "@/store/entities";
import { RecipeBook } from "@/store/recipe-book";
import StoreMixin from "@/store/store";
import { Component, Emit, Mixins } from "vue-property-decorator";

@Component({})
export default class LibraryCreateForm extends Mixins(StoreMixin) {
  isAdding = false;
  modeSelection = true;
	bookAdding: RecipeBookInfo = {} as RecipeBookInfo;	

  @Emit("added")
  added(newBookName: string) {
    return;
  }

  addEmpty(): void {
    this.modeSelection = false;
  }

  importFromClipboard(): void {
    navigator.clipboard.readText().then(clipText => {
      try {
        const book = JSON.parse(clipText) as RecipeBook;
        const bookName = book.name + "_Import";
        if (book.name != null && book.desc != null && book.recipes != null) {
          this.store.library.addBook(bookName, book.desc, book.recipes);
        }

        this.endAdd(bookName);
      }
      catch(e)
      {
        this.endAdd(null);
      }

    });
  }

	addBook(): void {
    const success = this.store.library.addBook(this.bookAdding.name, this.bookAdding.desc, []);
    if (!success) return; //Book not added due to some errors

    this.endAdd(this.bookAdding.name);
  }

  endAdd(bookName: string | null) {
    this.isAdding = false;
    this.modeSelection = true;

    this.$emit("added", bookName);
  }
}
</script>

<style scoped>
.card-add {
  display: flex;
  align-items: center;
  margin: 0 auto;
}
</style>