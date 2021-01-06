<template>
  <div class="clearfix">
    <library-create-form></library-create-form>

    <div v-for="vm in booksViewModel" 
      :key="vm.name" class="card" 
      :class="{'card-selected': vm.bookInfo.name == store.book.name}" 
      style="width: 10rem;"
      @click="selectedBook(vm.bookInfo)"
      @contextmenu.prevent="openContextMenu(vm.bookInfo, $event)"
    >
      <div v-if="!vm.editing" class="card-body">
          <h4 class="card-title">{{vm.bookInfo.name}}</h4>
          <h5 class="card-subtitle">{{vm.bookInfo.desc}}</h5>
          <button class="btn-small btn-secondary btn-corner" @click.stop="startEditModeBookInfo(vm)">Edit</button>
      </div>

      <div v-if="vm.editing">
        <input v-model="vm.newBookInfo.name" style="width: 100%" placeholder="Name"/>
        <input v-model="vm.newBookInfo.desc" style="width: 100%" placeholder="Description"/>
        <div class="action-bar">
          <button class="action-bar-item btn-secondary btn-small" @click.stop="endEditModeBookInfo(vm)">Save</button>
        </div>
      </div>
    </div>

    <vue-context ref="menu" class="border border-primary" style="width: auto">
      <li @click.prevent="deleteBookCM()">
        <i class="material-icons">delete</i>
        Delete
      </li>
      <li @click.prevent="copyBookCM()">
        <i class="material-icons">content_copy</i>
        Copy
      </li>
      <li @click.prevent="shareBookCM()">
        <i class="material-icons">share</i>
        Share
      </li>
    </vue-context>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import StoreMixin from "@/store/store";
import { RecipeBookInfo } from "@/store/entities";
import VueContext from "vue-context";
import LibraryCreateForm from "./library-create-form.vue";
import Vue from "vue";


class LibraryListViewModel {
  constructor(
    public bookInfo: RecipeBookInfo, 
    public editing: boolean, 
    public newBookInfo: RecipeBookInfo | null
  ) {}
}

@Component({
  components: {VueContext, LibraryCreateForm}
})
export default class LibraryList extends Mixins(StoreMixin) {
  isAdding = false;
  bookAdding: RecipeBookInfo = {} as RecipeBookInfo;
  bookEditing!: RecipeBookInfo;
  bookCM!: RecipeBookInfo;  
  
  booksViewModel!: LibraryListViewModel[];

  created() {
    const loadedBook = this.store.book;
    this.booksViewModel = Vue.observable(
      this.store.library.getBookInfos().map((bookInfo: RecipeBookInfo) => { 
        return new LibraryListViewModel(
          bookInfo,
          false,
          null
        );
      })
    );
  }

  addBook(): void {
    const success = this.store.library.addBook(this.bookAdding.name, this.bookAdding.desc, []);
    if (!success) return; //Book not added due to some errors

    const bi = this.store.library.tryGetBookInfo(this.bookAdding.name)!;
    this.booksViewModel.splice(0, 0, new LibraryListViewModel(bi, false, null))
    this.isAdding = !this.isAdding;
  }

  startEditModeBookInfo(vm: LibraryListViewModel): void {
    vm.editing = true;
    vm.newBookInfo = JSON.parse(JSON.stringify(vm.bookInfo));
  }

  endEditModeBookInfo(vm: LibraryListViewModel): void {
    vm.editing = false;
    this.store.library.updateBookInfo(vm.bookInfo.name, vm.newBookInfo!);
    vm.newBookInfo = null;
  }

  selectedBook(bookInfo: RecipeBookInfo): void {
    const selBook = this.store.library.loadBook(bookInfo.name);
    this.store.book = selBook;
  }

  openContextMenu(bookInfo: RecipeBookInfo, event: any): void {
    this.bookCM = bookInfo;
    const menu = this.$refs.menu as any;
    menu.open(event);
  }
  
  deleteBookCM(): void {
    this.store.library.removeBook(this.bookCM.name);
    this.booksViewModel = Vue.observable(this.booksViewModel.filter(x => x.bookInfo.name != this.bookCM.name));
    this.$forceUpdate(); 
  }

  shareBookCM(): void {
    this.store.library.shareBook(this.bookCM.name);
  }

  copyBookCM(): void {
    const newBookName = this.store.library.copyBook(this.bookCM.name);

    const bi = this.store.library.tryGetBookInfo(newBookName);
    if (bi == null) return; //Book not added due to some errors

    this.booksViewModel.splice(0, 0, new LibraryListViewModel(bi, false, null));
    this.$forceUpdate(); 
  }
}
</script>

<style scoped>
  .card {
    margin: 10px;
    float: left;
    cursor: pointer;
    width: 10rem; 
    padding: 0.5rem;
    height: 8rem;
  }

  .card-selected {
    border-color: var(--secondary);
  }

  .card-add {
    display: flex;
    align-items: center;
  }
</style>