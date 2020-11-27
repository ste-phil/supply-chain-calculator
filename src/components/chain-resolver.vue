<template>
  <div class="paper">
    <chain-input-form @resolve-requested='resolveRequested'></chain-input-form>
  </div>
  <hr>

  <div class="paper">
    <chain-calculator :request='request'></chain-calculator>
  </div>
</template>

<script>
import ChainInputForm from './chain-input-form.vue'
import ChainCalculator from './chain-calculator.vue'

export default {
  name: 'chain-resolver',
  data() { 
    return {
        request: null
    } 
  },
  components: {
    ChainInputForm,
    ChainCalculator
  },
  methods: {
    resolveRequested(request) {
        this.request = request;
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
