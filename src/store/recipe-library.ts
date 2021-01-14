import { Recipe, RecipeBookInfo, RecipeInput } from "./entities";
import { RecipeBook } from "./recipe-book";
import { LocalStorageWorker } from "./storage-helper";

const defaultBookName = "default";
const defaultBookDescription = "default description";
const defaultRecipes: Recipe[] = new Array<Recipe>(
    new Recipe("Iron Ore", 1, 1),
    new Recipe("Iron Plate", 3.2, 1, new RecipeInput(1, "Iron Ore")),
    new Recipe("Copper Ore", 1, 1),
    new Recipe("Copper Plate", 3.2, 1, new RecipeInput(1, "Copper Ore")),
    new Recipe("Gears", 0.5, 1, new RecipeInput(1, "Iron Plate")),
    new Recipe("Red Science", 5, 1, new RecipeInput(1, "Gears"), new RecipeInput(1, "Copper Plate"))
);

export class RecipeLibrary {
    private infoStorageKey = "book-infos";
    private recipeStorageKey = "recipe-book-";
    private lastLoadedStorageKey = "last-book";

    private bookInfos!: RecipeBookInfo[];
    
    constructor() {
        this.loadBookInfos();
    }

    loadBookInfos(): void {
        const bookInfos = LocalStorageWorker.get<RecipeBookInfo[]>(this.infoStorageKey);

        this.bookInfos = new Array<RecipeBookInfo>();
        if (!bookInfos) {
            this.addBook(defaultBookName, defaultBookDescription, defaultRecipes);
        }
        else {
            this.bookInfos = bookInfos;
        }
    }
    tryGetBookInfo(name: string): RecipeBookInfo | null {
        const res = this.bookInfos.filter(x => x.name == name);
        if (res.length > 0) return res[0];
        return null;
    }
    getBookInfos(): RecipeBookInfo[] {
        return this.bookInfos;
    }
    updateBookInfo(oldName: string, newData: RecipeBookInfo): void {
        const bi = this.tryGetBookInfo(oldName);
        if (bi == null) throw new Error("Tried to update non existing bookInfo")

        if (oldName != newData.name) {
            const oldRecipes = LocalStorageWorker.get<Recipe[]>(this.recipeStorageKey + oldName);
            this.removeBook(oldName);
            this.addBook(newData.name, newData.desc, oldRecipes);
        }
        bi.name = newData.name;
        bi.desc = newData.desc;
       
        this.saveBookInfos();
    }
    private saveBookInfos(): void {
        LocalStorageWorker.add(this.infoStorageKey, this.bookInfos);
    }

    loadBook(bookName: string): RecipeBook {
        const bookInfo = this.tryGetBookInfo(bookName);
        if (bookInfo == null) throw new Error("RecipeLibrary: Book " + bookName + " not found");
        
        const recipes = LocalStorageWorker.get<Recipe[]>(this.recipeStorageKey + bookInfo.name);
        
        LocalStorageWorker.add(this.lastLoadedStorageKey, bookName);
        return new RecipeBook(bookInfo.name, bookInfo.desc, recipes);
    }

    loadLastBook(): RecipeBook {
        const bookName = LocalStorageWorker.get<string>(this.lastLoadedStorageKey);
        
        //Load the default recipe book
        if (this.tryGetBookInfo(bookName) == null)  {
            return this.loadBook(this.bookInfos[0].name);
        }

        return this.loadBook(bookName);
    }

    saveBook(bookName: string, recipes: Recipe[]): void {
        LocalStorageWorker.add(this.recipeStorageKey + bookName, recipes);
    }

    addBook(bookName: string, desc: string, recipes: Recipe[]): boolean {
        //check if book name already exists
        if (this.tryGetBookInfo(bookName) != null) return false;

        this.bookInfos.splice(0, 0, new RecipeBookInfo(bookName, desc));
        this.saveBook(bookName, recipes);

        LocalStorageWorker.add(this.infoStorageKey, this.bookInfos);
        return true;
    }
    removeBook(bookName: string): void {
        this.bookInfos = this.bookInfos.filter(x => x.name != bookName);
        LocalStorageWorker.add(this.infoStorageKey, this.bookInfos);
        LocalStorageWorker.remove(this.recipeStorageKey + bookName);
    }

    copyBook(bookName: string): string {
        const bi = this.tryGetBookInfo(bookName);
        if (bi == null) throw new Error("Tried to copy non existing book");

        const newBookName = bookName + "_Copy";
        this.addBook(newBookName, bi.desc, this.loadBook(bookName).recipes);
        return newBookName;
    }

    shareBook(bookName: string): void {
        const bi = this.tryGetBookInfo(bookName);
        if (bi == null) throw new Error("Tried to share non existing book");

        const book = this.loadBook(bookName);
        navigator.clipboard.writeText(JSON.stringify(book));
    }

    importBook(bookString: string): string | null {
        try {
            const book = JSON.parse(bookString) as RecipeBook;
            const bookName = book.name + "_Import";

            if (book.name != null && book.desc != null && book.recipes != null) {
                this.addBook(bookName, book.desc, book.recipes);
                return bookName;
            }
            return null;
        }
        catch(e) {
            return null;
        }
    }
}