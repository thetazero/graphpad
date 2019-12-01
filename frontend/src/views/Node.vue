<template>
  <div class="card maincard">
    <button
      class="btn btn-floating circle edit-btn"
      @click="
        save(edit);
        edit = !edit;
        foundNodes = [];
        addConnectionType = null;
      "
    >
      <i class="material-icons" v-if="!edit">edit</i>
      <i class="material-icons" v-if="edit">cancel</i>
    </button>
    <NodeViewer
      class="card-content"
      :id="id"
      :edit="edit"
      :data="data"
      :type="type"
      :edges="edges"
    ></NodeViewer>
    <div class="card-action row">
      <div class="row" v-if="edit">
        <Select
          class="col s12 l4 m6"
          label="Connection type"
          :options="options"
          :name="'type'"
          @value="
            e => {
              this.addConnectionType = e;
              this.findNode();
            }
          "
        />
        <div v-if="addConnectionType != null" class="col s12 l6 m8">
          <input
            :placeholder="`Select ${posEdges[addConnectionType].to}`"
            type="text"
            @input="findNode()"
            v-model="newQuery"
          />
          <ul class="collection">
            <a
              class="collection-item"
              v-for="(data, i) in foundNodes"
              :key="i"
              @click="linkNodes(data.id)"
            >
              <span class="title">{{ data.properties.name }}</span>
            </a>
            <a
              class="collection-item"
              v-if="!foundNodes.length"
              @click="createLinkRedirect()"
            >
              <span class="title"
                >Create {{ posEdges[addConnectionType].to }} "{{
                  newQuery
                }}"</span
              >
            </a>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NodeViewer from "@/components/NodeViewer.vue";
import Select from "@/components/form/Select.vue";
export default {
  name: "Node",
  data() {
    return {
      id: this.$route.params.id,
      edit: false,
      data: null,
      type: null,
      edges: null,
      addConnectionType: null,
      options: [],
      posEdges: [],
      newQuery: null,
      foundNodes: []
    };
  },
  created() {
    this.load();
  },
  methods: {
    save(yes) {
      if (!yes) return;
      console.log("saving...");
      console.log(this.data);
      this.$store
        .dispatch("updateNode", {
          id: this.id,
          data: this.data
        })
        .then(res => {
          console.log(`theoretically sent:`, res);
          console.log(`should have sent`, this.data);
        });
    },
    load() {
      this.$store.getters.nodeById(this.id).then(res => {
        this.data = res.properties;
        this.type = res.labels[0];
        this.posEdges = this.$store.getters.getPossibleEdges(this.type);
        this.options = this.posEdges.map((e, i) => {
          return {
            value: i,
            name: this.type == e.from ? e.name : e.revname
          };
        });
      });
      this.$store.getters.edgesById(this.id).then(res => (this.edges = res));
    },
    async findNode() {
      this.foundNodes = (
        await this.$store.getters.getTypedNodesQuery({
          query: this.newQuery,
          type: this.posEdges[this.addConnectionType].to
        })
      ).filter(e => {
        return e.id != this.id;
      });
    },
    async linkNodes(to) {
      console.log(this.id, to);
      await this.$store.dispatch("linkNodes", {
        from: this.id,
        to,
        type: this.posEdges[this.addConnectionType].name
      });
      this.edges = await this.$store.getters.edgesById(this.id);
    },
    clearAddData() {
      this.posEdges = [];
      this.foundNodes = [];
      this.newQuery = "";
    },
    async createLinkRedirect() {
      let id = await this.$store.dispatch("createNode", {
        type: this.posEdges[this.addConnectionType].to,
        name: this.newQuery
      });
      this.linkNodes(id)
      this.$router.push({ name: "node", params: { id } });
    }
  },
  watch: {
    $route(to) {
      this.data = null;
      this.id = to.params.id;
      this.edit = false;
      this.clearAddData();
      this.load();
    }
  },
  components: { NodeViewer, Select }
};
</script>

<style>
.edit-btn {
  position: absolute !important;
  right: 3px;
  top: 3px;
}
</style>
