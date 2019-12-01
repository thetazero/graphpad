<template>
  <div>
    <ul class="collection">
      <CollectionItem v-for="item in nodes" :key="item.id" :data="item" />
    </ul>
    <!-- <div v-for="item in _nodes" :key="item.id">
      {{ item }}
    </div> -->
  </div>
</template>

<script>
import CollectionItem from "@/components/CollectionItem.vue";
export default {
  name: "NodeCollection",
  props: ["nodes"],
  data() {
    return {
      theNodes: this.nodes
    };
  },
  components: { CollectionItem }
};
</script>
