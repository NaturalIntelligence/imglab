<template  lang="html">
  <div>
    <input
      ref="input"
      type="text"
      :class="autocompleteClass"
      :placeholer="placeholder"
      :value="text"
      @blur="onBlur"
      @click="showSuggestions = true"
      @input="onInput"
      @keydown.up.stop="moveSelection(-1)"
      @keydown.down.stop="moveSelection(1)"
      @keydown.enter="selectSuggestion"
      @keydown.esc="resetState"
    >
    <ul
      ref="suggestions"
      v-show="showSuggestions && suggestions.length"
      :class="autocompleteClass"
    >
      <li
        v-for="(suggestion, index) in suggestions"
        :key="index"
        :class="{ focused: index === selected }"
        @click="selectSuggestion"
        @mouseover="selected = index"
        @mouseout="selected = -1"
      >
        <div>
          {{ suggestion }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { _ } from "../../utils/app";

const debounce = require("lodash.debounce");

export default {
  props: {
    // Used to retrieve suggestions
    list: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // Initial data to display
    value: String,
    placeholder: String,
    autocompleteClass: Array
  },
  data() {
    return {
      text: this.value,
      selected: -1,
      showSuggestions: false,
    }
  },
  computed: {
    suggestions() {
      return this.list.filter(item => item.includes(this.text)) || [];
    },

    debouncedEmitAddEvent() {
      return debounce(this.emitAddEvent, 2000);
    }
  },
  methods: {
    emitAddEvent: function(val) {
      this.$emit("added", val);
    },

    /**
     * Click Handler: Checks if component is out of focus.
     * @param {Event} event - click event
     */
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.debouncedEmitAddEvent.flush();
        this.resetState();
      }
    },

    /**
     * Tab Handler: Checks if component is out of focus.
     * @param {Event} event - click event
     */
    handleTabOutside(event) {
      // When tab is pressed and component is out of scope
      if (event.keyCode === 9 && !this.$el.contains(event.target)) {
        this.debouncedEmitAddEvent.flush();
        this.resetState();
      }
    },

    /**
     * Checks if index is valid
     * @param {Number} index
     */
    isValid(index) {
      return index >= -1 && index < this.suggestions.length;
    },

    /**
     * Selects item based on index position
     */
    moveSelection(step) {
      if (!this.showSuggestions) {
        this.showSuggestions = true;
      }

      let nextPos = this.selected + step;

      if (!this.isValid(nextPos)) return;

      this.selected = nextPos;
    },

    /**
     * Blur event: When input loses focus, flush previous @added events and
     * reset state
     */
    onBlur(event) {
      this.debouncedEmitAddEvent(event.target.value);
      this.resetState();
      this.$nextTick(function() {
        this.debouncedEmitAddEvent.flush();
      })
    },

    /**
     * Sets the text used to filter and show suggestions
     * @param {Event} event
     */
    onInput: function(event) {
      let value = event.target.value;
      if (event.target.value.length) {
        this.showSuggestions = true;
      } else {
        this.showSuggestions = false;
      }
      this.text = event.target.value;
      this.debouncedEmitAddEvent(event.target.value);
    },

    /**
     * Hide suggestion list and reset selected to -1
     */
    resetState() {
      this.selected = -1;
      this.showSuggestions = false;
    },

    /**
     * Sends clicked suggestion via @selected event
     * @param {Event} event - clicked event
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
      this.$emit("selected", val);

      this.resetState();
      this.$refs.input.focus();
    }
  },
  watch: {
    value(val) {
      this.text = val;
    }
  }
}
</script>

<style lang="css" scoped>
  .inline-block {
    display: inline-block;
  }

  .suggestion-box {
    border: 2px solid;
  }

  ul, li {
    padding: 0;
    margin: 0;
  }

  ul {
    list-style: none;
  }

  .focused, li:hover {
    background-color: #03a9f4;
  }
</style>
