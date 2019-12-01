<template>
  <div :class="edit ? 'grey-text' : ''">
    <Person
      v-if="type == 'Person'"
      :data="data"
      :id="id"
      :type="type"
      :edit="edit"
      :edges="edges"
    />
  </div>
</template>

<script>
import Person from "@/components/nodes/Person.vue";
export default {
  name: "NodeViewer",
  props: ["id", "edit", "data", "type", "edges"],
  components: { Person }
};
</script>
