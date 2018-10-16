<template lang="html">
  <div id="feature-points-list" >
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
          style="width: 100px;"
          :value="featurePoint.label"
          @change="setFeaturePointLabel($event, featurePoint)"
          @keyup.enter="setFeaturePointLabel($event, featurePoint)"
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
      getFeaturePointByID: "getFeaturePointByID"
    }),

    /**
     * Computed getter and setter
     */
    featurePoints: {
      get() {
        return this.selectedFeaturePoints.map(fpID => {
          return this.getFeaturePointByID(fpID);
        });
      },
      set(val) {
        let featurePointIDs = val.map(featurePoint => {
          return featurePoint.id;
        })
        this.setSelectedElements({ featurePoints: featurePointIDs });
      }
    }
  },
  methods: {
    ...mapMutations("image-store", {
      updateFeaturePoint: "updateFeaturePoint"
    }),

    ...mapMutations("action-config", {
      setSelectedElements: "setSelectedElements"
    }),

    /**
     * Sets the feature point label after a delay
     */
    setFeaturePointLabel(event, featurePoint) {
      // Stop if feature point label hasn't changed
      if (event.target.value === featurePoint.label) return;

      this.updateFeaturePoint({
        pointID: featurePoint.id,
        newLabel: event.target.value
      })
    },

    deleteFeaturePoint() {

    }
  }
}
</script>

<style lang="css">
</style>
