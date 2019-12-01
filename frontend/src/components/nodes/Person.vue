<template>
  <div v-if="data">
    <div class="row">
      <div class="col">
        <i class="material-icons circle grey">{{ $pick_icon([type]) }}</i>
      </div>
      <div class="col">
        <span v-if="!edit">{{ data.name }}</span>
        <input v-if="edit" type="text" placeholder="name" v-model="data.name">
      </div>
    </div>
    <div class="row" v-if="edges&&edges['Born']">
      birthday:
      <ul>
        <li v-for="(p, i) in edges.Born" :key="i">
          <router-link :to="{ name: 'node', params: { id: p.id } }">
            {{ p.name }}
          </router-link>
          {{ p.edge_properties }}
        </li>
      </ul>
    </div>
    <div class="row" v-if="edges&&edges['Knows']">
      knows:
      <ul>
        <li v-for="(p, i) in edges.Knows" :key="i">
          <router-link :to="{ name: 'node', params: { id: p.id } }">
            {{ p.name }}
          </router-link>
          {{ p.edge_properties }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Person",
  props: ["id", "data", "edges", "type", "edit"]
};
</script>

<style scoped>
.circle {
  width: 42px;
  height: 42px;
  line-height: 42px;
  text-align: center;
  font-size: 22px;
  color: white;
}
</style>
