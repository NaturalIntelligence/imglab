<template lang="html">
  <div class="">
    <div class="clearfix">
      Attributes
    </div>
    <!-- End of attribute heading -->
    <div
      v-if="shapeAttributes.length"
      class="mb-2"
      id="attributes-list"
    >
      <div
        class="d-flex align-items-start"
        style="margin-top:3px;"
        v-for="(attribute, index) in shapeAttributes"
        :key="index"
      >
        <autocomplete-input
          class="form-text w-40"
          :list="suggestedProperties"
          :value="attribute.property"
          :autocompleteClass="['form-control', 'w-100']"
          @added="updateAttributeProp(attribute, $event)"
          @selected="updateAttributeProp(attribute, $event)"
        >
        </autocomplete-input>
        <autocomplete-input
          class="form-text w-60"
          :list="suggestedValues(attribute.property)"
          :value="attribute.value"
          :autocompleteClass="['form-control', 'w-100']"
          @added="updateAttributeValue(attribute, $event)"
          @selected="updateAttributeValue(attribute, $event)"
        >
        </autocomplete-input>
        <button
          type="button"
          name="button"
          class="btn"
          @click="removeAttribute(index)"
        >
          <font-awesome-icon
            :icon="['far', 'trash-alt']"
            style="font-size: 1.5em;"
          ></font-awesome-icon>
        </button>
      </div>
    </div>
    <!-- End of attribute list -->
    <div class="d-flex align-items-start">
      <autocomplete-input
        class="form-text w-40"
        :value="enterProperty"
        :list="suggestedProperties"
        :autocompleteClass="['form-control', 'w-100']"
        @added="enterProperty = $event"
        @selected="enterProperty = $event"
      >
      </autocomplete-input>
      <autocomplete-input
        class="form-text w-60"
        :value="enterValue"
        :list="suggestedValues(enterProperty)"
        :autocompleteClass="['form-control', 'w-100']"
        @added="enterValue = $event"
        @selected="enterValue = $event"
      >
      </autocomplete-input>
      <button
        type="button"
        name="button"
        class="btn"
        @click="addAttribute"
      >
        <font-awesome-icon
          :icon="['fas', 'plus']"
          style="font-size: 1.5em;"
        ></font-awesome-icon>
      </button>
    </div>
    <!-- End of add attribute -->
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

/**
 * Panel that shows a list of shape attributes. Allows users to add or remove
 * existing attributes.
 */
export default {
  data() {
    return {
      // Property to be added
      enterProperty: "",
      // Value to be added
      enterValue: ""
    };
  },
  computed: {
    ...mapGetters("label-data", {
      suggestedProperties: "getProperties",
      getSuggestedValues: "getValues"
    }),

    ...mapGetters("action-config", {
      selectedShapeID: "getSelectedShape"
    }),

    ...mapGetters("image-store", {
      getShapeAttributes: "getShapeAttributes"
    }),

    /**
     * Return shape attributes
     */
    shapeAttributes() {
      let shapeID = this.selectedShapeID;
      return shapeID && this.getShapeAttributes(shapeID);
    }
  },
  methods: {
    ...mapMutations("label-data", {
      addAttributeToApp: "addAttribute",
      addPropertyToApp: "addProperty",
      addValueToApp: "addValue"
    }),

    ...mapMutations("image-store", {
      addAttributeToShape: "addAttributeToShape",
      removeAttributeFromShape: "removeAttributeFromShape",
      updateAttribute: "updateAttribute"
    }),

    /**
     * Adds an attribute to both shape and store
     */
    addAttribute() {
      this.$nextTick(function() {
        let shapeID = this.selectedShapeID;
        let property = this.enterProperty;
        let value = this.enterValue;

        if (!property || !value) return;

        this.addAttributeToShape({ shapeID, property, value });
        this.addAttributeToApp({ property, value });
        this.enterProperty = "";
        this.enterValue = "";
      });
    },

    /**
     * Remove an attribute from shape based on index
     * @param {Number} index - list item index
     */
    removeAttribute(index) {
      let shapeID = this.selectedShapeID;
      this.removeAttributeFromShape({ shapeID, index });
    },

    /**
     * Returns a list of suggested values for autocompletion
     * @param {String} property - property used for filtering
     * @return {String[]} array of suggested values
     */
    suggestedValues(property) {
      return this.getSuggestedValues(property);
    },

    /**
     * Updates an attribute property when it's changed
     * @param {Attribute} attribute - contains old property-value pair
     * @param {String} newProp - new property
     */
    updateAttributeProp(attribute, newProp) {
      let shapeID = this.selectedShapeID;
      this.updateAttribute({
        shapeID,
        oldProp: attribute.property,
        oldValue: attribute.value,
        newProp,
        newValue: attribute.value
      });
      this.addAttributeToApp({ property: newProp, value: attribute.value });
    },

    /**
     * Update attribute value when it's changed
     * @param {Attribute} attribute - contains old property and value
     * @param {String} newValue - new value
     */
    updateAttributeValue(attribute, newValue) {
      let shapeID = this.selectedShapeID;
      this.updateAttribute({
        shapeID,
        oldProp: attribute.property,
        oldValue: attribute.value,
        newProp: attribute.property,
        newValue: newValue
      });
      this.addAttributeToApp({ property: attribute.property, value: newValue });
    }
  }
};
</script>

<style lang="css" scoped>
  .add-attr {
    background-color: red;
  }

  .border {
    border: 20px solid;
  }

  .w-40 {
    width: 40%;
  }

  .w-60 {
    width: 60%;
  }
</style>
