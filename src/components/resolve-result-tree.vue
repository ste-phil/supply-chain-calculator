<template>
  <details>
      <summary>
        <img v-for="l in level+1" :key="l" src="/list-images/list-item.png"/>
        <p v-if="perSecondMode"> {{ tree.result.name }}: <strong>{{ Math.round(tree.result.perSecond * 100) / 100 }}</strong>/s</p>
        <p v-if="!perSecondMode"> {{ tree.result.name }}: <strong>{{ Math.round(tree.result.amountFactories * 100) / 100 }}</strong> Factories </p>
      </summary>

      <div v-for="sr in tree.subResults" :key="sr.name" class="indent">
          <!-- <img src="/list-images/list-item.png"/> -->
          <resolve-result-tree :tree="sr" :perSecondMode="perSecondMode" :level="level+1"></resolve-result-tree>
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

    @Prop({ required: true })
    level!: number;
}
</script>

<style scoped>
.indent {
  margin-left: 0px;
}


img {
  border: none;
  display: inline-block;
  width: 24px;
  height: 24px;
}

.root-img {
  height: 20px;
}


details {
  display: inline-block;
  top: 5px;
}

details > div {
  /* height: 23px; */
}

summary {
  height: 18px;
}

summary > p {
  display: inline-block;
  position: relative;
  top: -5px;
  margin: 0;
  padding-left: 25px;
}

/* summary::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 35px;
  height: 24px;
  background-image: url("/list-images/list-item-open.png");
} */

/* 
details > div::before { 
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 24px;
  margin-right: 10px;
  margin-top: 0px;
  background-image: url("/list-images/list-item.png");
  display: inline-block;
}

details > div:first::before { 
  background-image: url("/list-images/list-item-root.png");
}
details > div:last-of-type::before { 
  background-image: url("/list-images/list-item-last.png");
} */

/* 
details > div > details {
  margin-left: 5px;
}

details > div > details[open]::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 24px;
  background-image: url("/list-images/list-item-open.png");
} */


summary {list-style: none}
summary::-webkit-details-marker {display: none; }
summary::marker {display: none; }

</style>