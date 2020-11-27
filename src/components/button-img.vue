<template>
    <button :popover-bottom="popoverText">
        <i :class="icon" style="float:left;margin-right:10px;"></i>
        <label>{{text}}</label>
    </button>
</template>

<script>
export default {
    props: ["icon", "popover-text", "text"],
}
</script>

<style>

</style>