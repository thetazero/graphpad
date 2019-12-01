<template>
  <div id="app">
    <nav>
      <div class="nav-wrapper">
        <form>
          <div class="input-field">
            <input
              id="search"
              type="search"
              required
              @focus="show = false"
              @blur="timedUnshow()"
              :value="query"
              @input="e => (query = e.target.value)"
            />
            <label class="label-icon" for="search">
              <i class="material-icons">search</i>
            </label>
            <i class="material-icons select-none" @click="query = ''">close</i>
          </div>
        </form>
      </div>
    </nav>
    <div class="fakenav"></div>
    <NodeCollection
      v-bind:nodes="nodes"
      v-if="!show"
      class="search-out"
    ></NodeCollection>
    <router-view v-if="show" />
    <router-link
      to="/create"
      id="footer"
      class="btn-floating btn-large waves-effect waves-light red add-note scale-transition"
      v-if="!isCreate && show"
    >
      <i class="material-icons">add</i>
    </router-link>
  </div>
</template>

<script>
import NodeCollection from "@/components/NodeCollection.vue";
export default {
  data() {
    return {
      isCreate: false,
      show: true,
      query: "",
      nodes: null,
      allnodes: null
    };
  },
  created() {
    this.$store.getters.getNodes().then(res => {
      this.nodes = res;
      this.allnodes = res;
    });
  },
  mounted() {
    this.isCreate = this.$route.name == "create";
  },
  methods: {
    timedUnshow() {
      window.setTimeout(() => {
        this.show = true;
        this.query = "";
      }, 10);
    }
  },
  watch: {
    $route(to) {
      this.isCreate = to.name == "create";
    },
    query(to) {
      if (to == "") this.nodes = this.allnodes;
      else
        this.$store.getters.getNodesQuery(to).then(res => {
          this.nodes = res;
        });
    }
  },
  components: { NodeCollection }
};
</script>

<style>
.add-note {
  position: fixed !important;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%) !important;
}
body {
  min-height: 100vh;
}
.search-out {
  position: fixed;
  z-index: 1000;
  width: 100vw;
  overflow-y: scroll;
  height: calc(100% - 56px);
  transform: translateY(-7px);
}
nav {
  position: fixed;
  height: 56px;
  top: 0px;
  left: 0px;
  width: 100vw;
  z-index: 10;
}
.fakenav {
  height: 56px;
}
</style>
