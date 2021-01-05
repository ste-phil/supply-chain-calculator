<template>
<div class="container-custom">
    <div class="col-fill col"> 
        <chain-resolver></chain-resolver>
    </div>
</div>
</template>

<script>
import ChainResolver from '@/components/chain-resolver.vue'


export default {
  name: 'App',
  components: {
    ChainResolver,
  },
  data() {
    return {
      createFormVisible: false
    }
  },
}
</script>

<style scoped>

</style>
