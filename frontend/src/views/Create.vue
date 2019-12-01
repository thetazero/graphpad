<template>
  <div class="card maincard">
    <div class="card-content">
      <h3>Create Note</h3>
      <div class="row">
        <div class="col s12 l4 m8">
          <select>
            <option value="" disabled selected>Select Note Type</option>
            <option value="Person">Person</option>
            <option value="School">School</option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col s12 l4 m8">
          <input
            :placeholder="`Name of ${type}`"
            id="first_name"
            type="text"
            class="validate"
            v-model="name"
          />
        </div>
      </div>
    </div>
    <div class="card-action center">
      <button class="btn red" @click="create">create</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Create",
  data() {
    return {
      data: null,
      type: "Note",
      name: ""
    };
  },
  mounted() {
    const elems = document.querySelectorAll("select");
    let thing = window.M.FormSelect.init(elems, {})[0];
    this.data = thing;
    console.log(this.data, elems);
    setInterval(this.updateData, 50);
  },
  methods: {
    updateData() {
      this.type = ["Note", "Person", "School"][this.data.el.selectedIndex];
    },
    create() {
      this.$store
        .dispatch("createNode", {
          type: this.type,
          name: this.name
        })
        .then(id => {
          this.$router.push({ name: "node", params: { id } });
        });
    }
  }
};
</script>

<style></style>
