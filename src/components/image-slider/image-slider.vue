<template lang="html">
  <div class="container-fluid">
    <div class="row align-items-center">
      <div class="col-1">
        <div style="width: 50px; text-align: center; padding: 10px;">
          <label>
            <font-awesome-icon icon="images" style="font-size: 1.5em"></font-awesome-icon>
            <input
              id="browseImages"
              type="file"
              class="filebutton"
              accept="image/*"
              @change="readImageFiles"
              multiple/>
          </label>

          <label>
            <font-awesome-icon :icon="['far', 'folder-open']" style="font-size: 1.5em"></font-awesome-icon>
            <input
              type="file"
              id="image_folder"
              webkitdirectory
              mozdirectory
              msdirectory
              odirectory
              directory
              @change="readImageFiles">
          </label>
        </div>
      </div>
      <div class="col-1">
        <div id="leftpaddle" style="height: 100%; text-align: center;" @click="slideleft">
          <span style="width: 50px; height: 90px;">
            <font-awesome-icon icon="chevron-left" style="font-size: 1.5em"></font-awesome-icon>
          </span>
        </div>
      </div>
      <div class="col-9">
        <div class="photolist-wrapper" style="height:90px; width: 100%; overflow: hidden;">
          <div
            id="photolist"
            class="d-flex align-items-center photolist"
            ref="photolist"
            style="height: 100%;"
          >
              <img
                v-for="(thumbnail, index) in thumbnails"
                class="thumbnail"
                :id="'thumbnail_' + index"
                :key="thumbnail.name + index"
                :src="thumbnail.src"
                :label="thumbnail.name"
                :title= "thumbnail.name"
                :width="thumbnailWidth"
                :data-index="index"
                @click="loadIntoWorkArea(index)">
          </div>
        </div>
      </div>
      <div class="col-1">
        <div id="rightpaddle" style="height: 100%; text-align: center;" @click="slideright">
          <span style="width: 50px; height: 90px;">
            <font-awesome-icon icon="chevron-right" style="font-size: 1.5em"></font-awesome-icon>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { Image as _Image } from '../../models/Image';
import Velocity from 'velocity-animate'

export default {
  props: {
    thumbnailWidth: {
      type: String,
      default: "80px"
    }
  },
  data() {
    return {
      thumbnails: []
    }
  },
  computed: {
    ...mapGetters("image-store", {
      images: "getImages"
    })
  },
  methods: {
    // Map mutations from image-store
    ...mapMutations("image-store", [
      "setImageSelected",
      "addImageToStore"
    ]),

    /**
     * Loads the image dynamically and stores it in the image store
     * @param { _Image } imageData - an Image object from models/Image
     */
    loadImage(imageData) {
      let self = this;
      let image = new Image();
      /**
       * note: we are generating the image dynamically, hence we have to set the
       * onload property before the src.
       */
      image.onload = function() {
        let imageSize = {
          width : this.width,
          height : this.height,
          scaledWidth: this.width,
          scaledHeight: this.height,
          imageScale: 1
        };

        self.addImageToStore({
          src: imageData.src,
          name: imageData.name,
          size: imageSize
        });
      }

      image.src = imageData.src;
    },

    /**
     * Reads file data, loads the image, and stores the image detail in the
     * list of thumbnails
     * @param {File} - native file interface
     */
    readImageFile(file) {
      if (file.type.startsWith("image")) {
        let reader = new FileReader();
        reader.onload = e => {
          let image = new _Image({name: file.name, src: e.target.result});
          this.loadImage(image);
          this.thumbnails.push(image);
        }
        reader.readAsDataURL(file);
      }
    },

    /**
     * Reads a list of files
     * @param {Event} e - native Event interface
     */
    readImageFiles(e) {
      var input = e.srcElement || e.target;
      // note: input.files is an object
      if (input.files && input.files[0]) {
        for (let i = 0; i < input.files.length; i++){
          this.readImageFile(input.files[i]);
        }
      }
    },

    /**
     * Slides the thumbnail preview to the left
     */
    slideleft() {
      if (!this.thumbnails || this.thumbnails.length === 0) return;
      let firstThumbnail = this.thumbnails.shift();
      this.thumbnails.push(firstThumbnail);
    },

    /**
     * Slides the thumbnail preview to the right
     */
    slideright() {
      if (!this.thumbnails || this.thumbnails.length === 0) return;
      let lastThumbnail = this.thumbnails.pop();
      this.thumbnails.unshift(lastThumbnail);
    },

    /**
     * Set the clicked thumbnail as the image selected
     * @param {Number} index - index in the list of thumbnails
     */
    loadIntoWorkArea(index) {
      let imageSelected = this.thumbnails[index];
      this.setImageSelected(imageSelected);
    }
  },
  watch: {
    images(val) {
      this.thumbnails = val;
    }
  }
}
</script>

<style lang="css" scoped>
  input[type='file'] {
    display: none;
  }

  .grey-border{
    border: 1px solid grey;
  }

  .photolist-wrapper {
    position: relative;
    float: left;
    padding: 10px;
    overflow: hidden;
  }

  .photolist-wrapper .photolist {
    position: relative;
  }

  .photolist-wrapper .photolist img {
    padding: 2px;
    margin: 2px;
    cursor: pointer;
    background: #F6F6F6;
    border: 1px solid #666;
    opacity: 0.65;
  }

  .photolist-wrapper .photolist img:hover {
    opacity: 1.0;
    transition: .5s ease;
  }
</style>
