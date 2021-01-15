<template>
  <details>
      <summary>
        <!-- <img src="/list-images/list-item-root.png" class="root-img"/> -->
        <template v-if="perSecondMode"> {{ tree.result.name }}: <strong>{{ Math.round(tree.result.perSecond * 100) / 100 }}</strong>/s</template>
        <template v-if="!perSecondMode"> {{ tree.result.name }}: <strong>{{ Math.round(tree.result.amountFactories * 100) / 100 }}</strong> Factories </template>
      </summary>

      <div v-for="sr in tree.subResults" :key="sr.name" class="indent">
          <!-- <img src="/list-images/list-item.png"/> -->
          <resolve-result-tree :tree="sr" :perSecondMode="perSecondMode"></resolve-result-tree>
      </div>
  </details>
</template>

<script lang="ts">
import { ResolveResult, ResolveResultTree } from "@/store/calculator";
import { Component, Prop } from "vue-property-decorator";
import Vue from 'vue'

@Component({
    name: "resolve-result-tree"
})
export default class ResolveResultTreeComponent extends Vue {

    @Prop({ required: true })
    tree!: ResolveResultTree;

    @Prop({ required: true })
    perSecondMode!: boolean;
}
</script>

<style scoped>
.indent {
    padding-left: 20px;
}
/* 
img {
    border: none;
    display: inline-block;
}

.root-img {
    height: 20px;
}

summary {
    display: inline-block;
    position: relative;
    top: -5px;
}

details > div:first::before { 
  content: "";
  width: 20px;
  height: 24px;
  background-image: url("/list-images/list-item-root.png");
  display: inline-block;
}


details > div::before { 
  content: "";
  position: relative;
  width: 20px;
  height: 24px;
  margin-right: 10px;
  background-image: url("/list-images/list-item.png");
  display: inline-block;
}

details > div:last-of-type::before { 
  content: "";
  width: 20px;
  height: 24px;
  background-image: url("/list-images/list-item-last.png");
  display: inline-block;
}


details {
    display: inline-block;
}

summary {list-style: none}
summary::-webkit-details-marker {display: none; } */

</style>