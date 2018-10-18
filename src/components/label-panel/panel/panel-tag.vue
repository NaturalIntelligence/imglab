<template lang="html">
  <div class="tags-wrapper">
    <div
      class="tags"
      v-for="(tag, index) in tags"
      :key="tag"
    >

    </div>
    <label for="tag-input">
      <input
        class="tags"
        type="text"
        name="tag-input"
        @change="addTag"
      >
    </label>
  </div>
</template>

<script>
import { mapGetters, mapMUtations } from "vuex";

export default {
  data() {

  },
  computed: {
    ...mapGetters("label-data", {
      getTags: "getTags"
    }),

    tags() {
      return undefined;
    }
  },
  methods: {
    addTag(event) {
      console.log("adding tag", event.target.value);
    }
  }
}
</script>

<style lang="css">
</style>
