<template>
    <div>
        <label style="margin: 0.15rem"><strong>{{ingredient.amount}}x</strong> {{ingredient.name}}</label>
        <button class="btn-small action-btn" @click="$emit('ingredient-amount-modify', 1)">+</button>
        <button class="btn-small action-btn" @click="$emit('ingredient-amount-modify', -1)">-</button>
    </div>
</template>

<script>
export default {
    emits:["ingredient-amount-modify"],
    props: ["ingredient"]
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
</style>