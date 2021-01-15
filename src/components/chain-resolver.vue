<template>
<div>
  <div class="paper">
    <h2 class="header-corner">Input</h2>
    <chain-input-form @resolve-requested='resolveRequested'></chain-input-form>
  </div>
  <hr>

  <div class="paper">
    <h2 class="header-corner">Results</h2>
    <chain-calculator :request='request'></chain-calculator>
  </div>
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
