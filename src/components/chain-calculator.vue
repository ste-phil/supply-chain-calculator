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

  <table v-if="listMode"> 
    <tbody v-if="itemsPerSecondsMode">
       <tr v-for="result in resultList" :key="result.name">
        <td >
          {{ result.name }}
        </td>
        <td>
          <strong>{{ Math.round(result.perSecond * 100) / 100 }}</strong> /s
        </td>
      </tr>
      
    </tbody>

    <tbody v-if="!itemsPerSecondsMode">
      <tr v-for="result in resultList" :key="result.name">
        <td>
          {{ result.name }}
        </td>
        <td>
          <strong>{{ Math.round(result.amountFactories * 100) / 100 }}</strong> Factories
        </td>
      </tr>
      
    </tbody>
  </table>

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
  listMode = false;

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
