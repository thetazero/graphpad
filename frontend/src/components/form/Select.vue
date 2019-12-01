<template>
  <div>
    <select>
      <option value="" disabled selected>{{ name }}</option>
      <option :value="o.value" v-for="(o, i) in options" :key="i">{{
        o.name
      }}</option>
    </select>
    <label v-if="label">{{label}}</label>
  </div>
</template>

<script>
export default {
  name: "Select",
  props: ["options", "name", "label"],
  data() {
    return { instance: null };
  },
  mounted() {
    const elems = document.querySelectorAll("select");
    this.instance = window.M.FormSelect.init(elems, {})[0];
    this.instance.wrapper.children[1].children.forEach(e => {
      e.addEventListener("click", () => {
        this.$emit(
          "value",
          this.options[this.instance.el.selectedIndex - 1].value
        );
      });
    });
  }
};
</script>
