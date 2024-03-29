<template>
    <div class="grid">
        <recipe-create-form></recipe-create-form>

        <template>
            <div v-for="vr in getViewRecipes" :key="vr.recipe" > 
                <div v-if="!vr.editMode" :key="vr.recipe.name" class="card">
                    <div class="card-body">
                        <h4 class="card-title">{{ vr.recipe.name }}</h4>
                        <h5 class="card-subtitle"><strong>{{ vr.recipe.outputs[0].amount }}x</strong> in
                            <strong>{{ vr.recipe.time }}</strong> seconds</h5>

                        <div v-if="vr.recipe.inputs.length > 0" class="collapsible">
                            <input :id="'collapsible' + vr.recipe.name" type="checkbox" name="collapsible">
                            <label :for="'collapsible' + vr.recipe.name" style="padding: 0.15rem">Ingredients</label>
                            <div class="collapsible-body">
                                <h6 v-for="input in vr.recipe.inputs" style="margin: 0.15rem" :key="input.recipeName">
                                    <strong>{{ input.amount }}x</strong> {{ input.recipeName }}
                                </h6>
                            </div>
                        </div>

                        <button v-if="isRecipeDeletable(vr)" class="btn-small btn-secondary"
                            style="position: absolute; top: 2px; right: 50px;" @click="deleteEntry(vr)">Delete</button>
                        <button class="btn-small btn-secondary" style="position: absolute; top: 2px; right: 2px;"
                            @click="changeMode(vr)">Edit</button>
                    </div>
                </div>

                <recipe-edit-form 
                    v-if="vr.editMode" 
                    :key="vr.recipe.name" 
                    :recipe="vr.recipe"
                    @submit="vr.editMode = false">
                </recipe-edit-form>
            </div>

        </template>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import StoreMixin from "@/store/store";
import RecipeEditForm from './recipe-edit-form.vue';
import RecipeCreateForm from './recipe-create-form.vue';
import Vue from 'vue'
import { Recipe } from "@/store/entities";

class ViewRecipe {
    constructor(public recipe: Recipe, public editMode: boolean) { }
}

@Component({
    components: {
        RecipeEditForm, RecipeCreateForm
    }
})
export default class RecipeList extends Mixins(StoreMixin) {
    changeMode(vr: ViewRecipe) {
        vr.editMode = !vr.editMode;
    }

    isRecipeDeletable(vr: ViewRecipe) {
        return this.store.book.isRecipeDeletable(vr.recipe);
    }

    deleteEntry(vr: ViewRecipe) {
        this.store.book.deleteRecipe(vr.recipe)
        this.store.saveBook();
    }

    get getViewRecipes() {
        return this.store.book.getRecipes().map((recipe: Recipe) => {
            return Vue.observable(new ViewRecipe(recipe, false))
        })
    }

    mounted() {
        const container = document.querySelector('.grid') as HTMLElement;
        this.animateChildren(container);
    }

    animateChildren(container: HTMLElement) {
        function getFlexItemsInfo(container: HTMLElement): any[] {
            return Array.from(container.children).map((item) => {
                const rect = item.getBoundingClientRect()
                return {
                    element: item,
                    x: rect.left,
                    y: rect.top,
                    width: rect.right - rect.left,
                    height: rect.bottom - rect.top,
                }
            })
        }

        function animateFlexItems(oldFlexItemsInfo: any[],  newFlexItemsInfo: any[]) {
            for (const newFlexItemInfo of newFlexItemsInfo) {
                const oldFlexItemInfo = oldFlexItemsInfo.find(e => e.element == newFlexItemInfo.element);

                if (!oldFlexItemInfo) {
                    continue; 
                }

                const translateX = oldFlexItemInfo.x - newFlexItemInfo.x
                const translateY = oldFlexItemInfo.y - newFlexItemInfo.y
                const scaleX = oldFlexItemInfo.width / newFlexItemInfo.width
                const scaleY = oldFlexItemInfo.height / newFlexItemInfo.height

                newFlexItemInfo.element.animate(
                    [
                        {
                            transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
                        },
                        { 
                            transform: 'none' 
                        },
                    ],
                    {
                        duration: 250,
                        easing: 'ease-out',
                    }
                )
            }
        }
        
        
        let oldFlexItemsInfo = getFlexItemsInfo(container);
        // Callback function to execute when mutations are observed
        const childListMutationCallback = function(mutationsList: any[], observer: any) {
            const newFlexItemsInfo = getFlexItemsInfo(container).slice(1); //slice(1) removes first element
            if (oldFlexItemsInfo) {
                animateFlexItems(oldFlexItemsInfo, newFlexItemsInfo);  
            }
            oldFlexItemsInfo = newFlexItemsInfo;
        };

        new MutationObserver(childListMutationCallback).observe(container, { childList: true });
    }
}
</script>

<style scoped>
.card {
    margin: 10px;
    min-width: 14rem;
    max-width: 20rem;
    min-height: 8.5rem;
}

.grid {
    display: flex;
    flex-flow: row wrap;
    justify-content: start;
    align-items: flex-start;
}
</style>