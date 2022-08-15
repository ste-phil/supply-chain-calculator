<template>
<div>
  <table class="item-corner-right">
    <tr>
      <td>Required Factories</td>
      <td class="form-group">
        <label class="paper-switch">
          <input type="checkbox" v-model="itemsPerSecondsMode" />
          <span class="paper-switch-slider round"></span>
        </label>
      </td>
      <td>Items per seconds</td>
    </tr>
    <tr>
      <td>Tree</td>
      <td class="form-group">
        <label class="paper-switch">
          <input type="checkbox" v-model="listMode" />
          <span class="paper-switch-slider round"></span>
        </label>
      </td>
      <td>List</td>
    </tr>
  </table>

  <div v-if="listMode"> 
    <div v-if="itemsPerSecondsMode">
      <p v-for="result in resultList" :key="result.name">
      {{ result.name }}: <strong>{{ Math.round(result.perSecond * 100) / 100 }}</strong>/s
      </p>
    </div>
    <div v-if="!itemsPerSecondsMode">
      <p v-for="result in resultList" :key="result.name">
        {{ result.name }}: <strong>{{ Math.round(result.amountFactories * 100) / 100 }}</strong> Factories
      </p>
    </div>
  </div>

  <div v-if="!listMode"> 
    <resolve-result-tree-component :tree="resultTree" :perSecondMode="itemsPerSecondsMode" :level="0"></resolve-result-tree-component>
  </div>
</div>
</template>

<script lang="ts">
import { Recipe } from "@/store/entities";
import StoreMixin from "@/store/store";
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import Calculator, {
  CalculationRequest,
  ResolveResult,
  ResolveResultTree,
} from "@/store/calculator";
import ResolveResultTreeComponent from "@/components/resolve-result-tree.vue";

@Component({
  components: {
    ResolveResultTreeComponent,
  },
})
export default class ChainCalculator extends Mixins(StoreMixin) {
  itemsPerSecondsMode = true;
  listMode = true;

  resultList: Array<ResolveResult> = [];
  resultTree: ResolveResultTree = {} as ResolveResultTree;

  @Prop({ required: true })
  request: CalculationRequest | null = null;

  @Watch("request")
  requestChanged(request: CalculationRequest) {
    this.recalculate();
  }

  @Watch("listMode")
  viewModeChanged(listMode: boolean) {
    this.recalculate();
  }

  recalculate() {
    const request = this.request;
    if (request == null) return;

    if (this.listMode)
      this.resultList = Calculator.resolveRequirements(request);
    else this.resultTree = Calculator.resolveRequirementsTree(request);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.item-corner-right {
  position: relative;
  top: -80px;
  left: calc(100% - 400px);
  width: 400px;
  margin: 0px;
}
</style>
