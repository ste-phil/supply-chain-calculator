import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { RecipeBook } from './recipe-book';
import { RecipeLibrary } from './recipe-library';

export class Store {
    public library: RecipeLibrary;
    public book: RecipeBook;

    constructor() {
        this.library = new RecipeLibrary();
        this.book = this.library.loadLastBook();
        (window as any).store = this;
    }

    saveBook() {
        this.library.saveBook(this.book.name, this.book.getRecipes());
    }
}

export const store = new Store();

@Component
export default class StoreMixin extends Vue {
    public store: Store = store;
}