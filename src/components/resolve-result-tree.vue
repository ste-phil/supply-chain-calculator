<template>
  <ul :class="{closed: !visible}" v-if="tree.subResults != null">
      <div class="border border-primary" @click="visible = !visible; " :class="{collabsable: tree.subResults.length > 0}">
        <div v-if="perSecondMode"> 
          <p>{{ tree.result.name }}</p>
          <p><strong>{{ Math.round(tree.result.perSecond * 100) / 100 }}</strong>/s</p>
        </div>
        <div v-if="!perSecondMode"> 
          <p>{{ tree.result.name }}</p>
          <p><strong>{{ Math.round(tree.result.amountFactories * 100) / 100 }}</strong> Factories </p>
        </div>
      </div>

      <li v-for="sr in tree.subResults" :key="sr.result.name" :class="{closed: !visible}" ref="el" >
        <resolve-result-tree :tree="sr" :perSecondMode="perSecondMode" :level="level+1"></resolve-result-tree>
      </li>
  </ul>
</template>

<script lang="ts">
import { ResolveResultTree } from "@/store/calculator";
import { Component, Prop} from "vue-property-decorator";
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

    visible = this.level == 0 ? true : false;
    isAnimating = false;
}
</script>

<style scoped>

ul {
  margin: 0 0 0 30px;
  padding: 0 0 0 0;
  list-style: none;
  position: relative;
}

ul::before {
  content: "";
  display: block;
  width: 0px;
  position: absolute;
  top: 5px;
  bottom: 0;
  left: 10px;
  background: white;
  z-index: 1;
  border-left: 1px solid white;
}

ul.closed::before {
  border-left: none;
}

ul > div {
  position: relative;
  background-color: #41403e;
  margin-right: auto;
  padding: 0 24px 0 24px;
  min-width: 400px;
  max-width: 400px;
  z-index: 2;
}

ul > div > div {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

li {
  line-height: 14px;
  margin: 0;
  padding: 28px 0 0 0;
  position: relative;
  z-index: 2;

  transition: all 0.3s;
}

li::before{
  border-top: 1px solid;
  content: "";
  display: block;
  height: 100%;
  
  position: absolute;
  left: 0px;
  top: 55px;
  width: 30px;
  margin-left: 11px;
}

li:last-child::before {
  background: #41403e;
  bottom: 0;
  left: -1px;
  height: auto;
  top: 55px;
}

li.closed {
  transform: translateX(-400px) scale(0);
  height: 0;
  padding: 0;
}

.collabsable {
  cursor: pointer;
  transition: all .3s;
}

.collabsable:hover {
  background-color: white;
  color: black;
}

.collabsable:active {
  transform: scale(0.9);
}

</style>