<template>
  <router-link
    class="collection-item avatar"
    :to="{ name: 'node', params: { id: data.id } }"
  >
    <!-- <img :src="$pick_icon(data.labels)" class="circle" /> -->
    <i class="material-icons circle">{{ $pick_icon(data.labels) }}</i>
    <span class="title">{{ data.properties.name }}</span
    ><br />
    <span v-if="data.labels.length">
      <a>#{{ data.labels[0] }} </a>
    </span>
  </router-link>
</template>

<script>
export default {
  name: "CollectionItem",
  props: ["data"]
};
</script>
