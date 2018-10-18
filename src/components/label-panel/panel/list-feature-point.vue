<template lang="html">
  <div
    v-if="selectedShape"
  >
    <p class="mb-2">
      <small>
      Feature Points {{ featurePoints.length }}
      </small>
    </p>

    <div id="feature-points-list">
      <ul id="fpoints-list">
        <li
          class="li-fpoints grey-border">
          <draggable v-model="featurePoints">
            <div
              class=""
              v-for="(fp, index) in featurePoints"
              :key="fp.id"
            >
              <input
                type="text"
                class="form-control"
                placeholder="Label the feature point"
                style="width: 100px;"
                :value="fp.label"
                @change="setFeaturePointLabel($event, fp)"
                @keyup.enter="setFeaturePointLabel($event, fp)"
              >
              <div
                class="input-group-btn"
                @click="deleteFeaturePoint"
              >
                <font-awesome-icon
                  :icon="['far', 'trash-alt']"
                  style="font-size: 1.5em"
                ></font-awesome-icon>
              </div>
            </div>
          </draggable>
        </li>
      </ul>
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
      selectedShape: "getSelectedShape",
      selectedFeaturePoints: "getSelectedFeaturePoints"
    }),

    ...mapGetters("image-store", {
      getFeaturePointByID: "getFeaturePointByID",
      getShapeFeaturePointIDs: "getShapeFeaturePointIDs",
      getShapeFeaturePoints: "getShapeFeaturePoints",
      getFeaturePointByID: "getFeaturePointByID"
    }),

    /**
     * Computed getter and setter
     */
    featurePoints: {
      get() {
        let shapeID = this.selectedShape;
        return shapeID && this.getShapeFeaturePoints(shapeID);
      },
      set(val) {
        let shapeID = this.selectedShape;
        this.updateFeaturePoints({
          shapeID,
          featurePoints: val
        });
      }
    }
  },
  methods: {
    ...mapMutations("image-store", {
      updateFeaturePoint: "updateFeaturePoint",
      updateFeaturePoints: "updateFeaturePoints"
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

<style lang="css" scoped>
  .li-fpoints {
    margin: 5px 0px;
    border-radius: 6px;
    width: 100%;
    list-style: none;
  }

  #fpoints-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
    margin-bottom: 10px;
  }

  #feature-points-list {
    margin-top: 10px;
    overflow-x: hidden;
  }
</style>
