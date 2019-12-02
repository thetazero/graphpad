<template>
  <div class="home">
    <NodeCollection v-bind:nodes="nodes"></NodeCollection>
  </div>
</template>

<script>
// @ is an alias to /src
import NodeCollection from "@/components/NodeCollection.vue";
export default {
  name: "home",
  data() {
    return {
      nodes: []
    };
  },
  created() {
    this.$store.getters.getNodes().then(data => (this.nodes = data));
  },
  components: { NodeCollection }
};
</script>
