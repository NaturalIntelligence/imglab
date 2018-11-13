<template  lang="html">
  <div>
    <input
      ref="input"
      type="text"
      :class="autocompleteClass"
      :placeholer="placeholder"
      :value="text"
      @blur="onInputBlur"
      @click="showSuggestions = true"
      @input="onInput"
      @keydown.up.stop="moveSelection(-1)"
      @keydown.down.stop="moveSelection(1)"
      @keydown.enter="selectSuggestion"
      @keydown.esc="resetState"
    >
    <ul
      v-show="showSuggestions && suggestions.length"
      class="list-style"
      ref="suggestions"
      tabindex="-1"
      :class="autocompleteClass"
      @mouseleave="selected = -1"
    >
      <li
        v-for="(suggestion, index) in suggestions"
        class="list-item-style"
        :key="index"
        :class="{ focused: index === selected }"
        @click="selectSuggestion"
        @mouseenter="selected = index"
      >
        <div>
          {{ suggestion }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
const debounce = require("lodash.debounce");

/**
 * Custom autocomplete component. Allows a list of suggested values to be
 * passed into the component. Toggle "filter" flag to either filter the list or
 * to display the whole list of suggestions. Allows placeholder and value to be
 * passed in as the default placeholder and initial value of autocomplete
 * component.
 */
export default {
  props: {
    // Apply styles listed in the array of classes
    autocompleteClass: Array,
    /**
     * Set filter to false to disable filtering list by input tag value
     * @default true
     */
    filter: {
      type: Boolean,
      default: true
    },
    /**
     * List of recommended values
     * @default []
     */
    list: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // Initial input tag placeholder
    placeholder: {
      type: String,
      default: ""
    },
    // Initial input tag value
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      // Input tag text
      text: this.value,
      // Selected item index from list
      selected: -1,
      // Toggle suggestion list
      showSuggestions: false
    };
  },
  computed: {
    /**
     * Returns a filtered list of suggestion
     */
    suggestions() {
      if (!this.filter) return this.list;
      return this.list.filter(item => item.includes(this.text));
    },

    /**
     * Debounce emitAddEvent is added here to allow method to be flushed
     */
    debouncedEmitAddEvent() {
      return debounce(this.emitAddEvent, 2000);
    }
  },
  methods: {
    /**
     * Emits add event. Should not be used by itself.
     * @param {String} val - selected string value
     */
    emitAddEvent: function(val) {
      /**
       * Emits an added event with the current input value
       * @param {String} val - current input value
       */
      this.$emit("added", val);
    },

    /**
     * Checks if index is valid
     * @param {Number} index - list item index
     * @return {Boolean} true if valid; false otherwise
     */
    isValid(index) {
      return index >= -1 && index < this.suggestions.length;
    },

    /**
     * Selects item based on index position
     * @param {Number} step - increment from current position by #step
     */
    moveSelection(step) {
      this.showSuggestions = true;

      let nextPos = this.selected + step;

      if (!this.isValid(nextPos)) return;

      this.selected = nextPos;
    },

    /**
     * Sets the text used to filter and show suggestions
     * @param {Event} event - input event
     */
    onInput(event) {
      let value = event.target.value;
      if (event.target.value.length) {
        this.showSuggestions = true;
      } else {
        this.showSuggestions = false;
      }
      this.text = value;
      this.debouncedEmitAddEvent(value);
    },

    /**
     * Blur event: When input loses focus, check if component also loses focus,
     * flush previous `added` events and reset state if true; stop otherwise
     * @param {Event} event - blur event
     */
    onInputBlur(event) {
      // Input blur due to component being clicked, stop
      if (this.$el.contains(event.relatedTarget)) {
        return;
      }
      // Input blur due to outside component being clicked, reset state
      this.resetState();
      this.debouncedEmitAddEvent.flush();
    },

    /**
     * Hide suggestion list and reset selected position to -1
     */
    resetState() {
      this.selected = -1;
      this.showSuggestions = false;
    },

    /**
     * Sends clicked suggestion via `selected` event
     * @param {Event} event - click event
     */
    selectSuggestion(event) {
      // Necessary to maintain input focus
      event.preventDefault();

      let index = this.selected;
      if (!this.isValid(index)) return;

      // Pressed enter without a valid selection, flush and continue
      if (index === -1) {
        this.debouncedEmitAddEvent.flush();
        this.resetState();
        return;
      }

      // Cancel previous add event and emit selected event
      this.debouncedEmitAddEvent.cancel();

      let val = this.suggestions[index];
      this.text = val;
      /**
       * Emits selected event if successful
       * @param {String} val - selected text
       */
      this.$emit("selected", val);

      this.resetState();
      this.$refs.input.focus();
    }
  },
  watch: {
    value(val) {
      // Set text value if there are any changes
      this.text = val;
    }
  }
};
</script>

<style lang="css" scoped>
  .inline-block {
    display: inline-block;
  }

  .suggestion-box {
    border: 2px solid;
  }

  .list-style {
    list-style: none;
    position: relative;
    z-index: 999;
    padding: 0;
    margin: 0;
  }

  .list-item-style {
    padding: 4px 20px;
    background-color: white;
    border: 1px solid black;
  }

  .focused {
    background-color: #03a9f4;
  }
</style>
