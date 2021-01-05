<template>
    <div>
        <label style="margin: 0.15rem"><strong>{{ingredient.amount}}x</strong> {{ingredient.recipeName}}</label>
        <button class="btn-small action-btn" @click="$emit('ingredient-amount-modify', 1)">+</button>
        <button class="btn-small action-btn" @click="$emit('ingredient-amount-modify', -1)">-</button>
    </div>
</template>

<script lang="ts">
// export default {
//     emits:["ingredient-amount-modify"],
//     props: ["ingredient"],
// }

import { RecipeInput } from "@/store/entities";
import { Component, Emit, Prop } from "vue-property-decorator";
import Vue from 'vue'

@Component({})
export default class IngredientListItem extends Vue {
    @Prop({required: true})
    ingredient!: RecipeInput;

    @Emit("ingredient-amount-modify")
    ingredientAmountModify(amount: number) {
        return;
    }
}

</script>

<style scoped>
label {
    font-size: .8rem;
    font-family: Patrick Hand SC,sans-serif;
}

button {
    float: right;
    height: 28px;
    line-height: 0px;
}

div {
    height: 30px;
}
</style>