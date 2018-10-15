<template lang="html">
  <div id="feature-points-list" >
    <div
      class=""
      v-if="selectedShape">
      <draggable v-model="featurePoints">
        <div
          class=""
          v-for="(featurePoint, index) in featurePoints"
          :key="featurePoint.id"
        >
          <input
            type="text"
            class="form-control"
            placeholder="Label the feature point"
            :value="featurePoint.label"
            @input.lazy="setFeaturePointLabel($event, featurePoint)"
            @keyup.enter="setFeaturePointlabel($event, featurePoint)"
          >
          <div
            class="input-group-btn"
            @click="deleteFeaturePoint"
          >
            <i class="icon icon-trash-empty"></i>
          </div>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import draggable from "vuedraggable";

export default {
  components: {
    draggable
  },
  computed: {
    ...mapGetters("action-config", {
      "selectedShape": "getSelectedShape",
      "selectedFeaturePoints": "getSelectedFeaturePoints"
    }),

    ...mapGetters("image-store", {
      "getFeaturePointByID": "getFeaturePointByID"
    }),

    featurePoints() {
      return this.selectedFeaturePoints.map(fpID => {
        return this.getFeaturePointByID(fpID);
      });
    }
  },
  methods: {
    ...mapMutations("image-store", {
      "updateFeaturePoint": "updateFeaturePoint"
    }),

    /**
     * Sets the feature point label after a delay
     */
    setFeaturePointLabel(event, featurePoint) {
      // Stop if feature point label hasn't changed
      if (event.target.value === featurePoint.label) return;

      this.updateFeaturePoint({
        pointID: featurePoint.id,
        label: event.target.value
      })
    },

    deleteFeaturePoint() {

    }
  }
}
</script>

<style lang="css">
</style>
