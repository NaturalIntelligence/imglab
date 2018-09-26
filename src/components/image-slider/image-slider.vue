<template lang="html">
  <div>
    <div style="width: 50px;  text-align: center; padding: 10px;">
      <label class="btn-bs-file">
        <font-awesome-icon icon="images" style="font-size: 1.5em"></font-awesome-icon>
        <input
          id="browseImages"
          type="file"
          class="filebutton"
          accept="image/*"
          @change="readImageFiles"
          multiple/>
      </label>

      <label class="btn-bs-file">
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

    <div id="leftpaddle" class="align-middle"  style="height: 100%;" @click="slideleft">
      <span style="width: 50px; height: 90px;">
        <i class="icon-left-open" style="font-size: 1.5em"></i>
      </span>
    </div>

    <div class="photolist-wrapper " style="width: calc(100% - 160px); height: 90px;">
      <div id="photolist" class="photolist" ref="photolist">
        <transition-group name="thumnail-list">
          <img
            v-for="(thumbnail, index) in thumbnails"
            :id="'thumbnail_' + index"
            :key="thumbnail.name + index"
            :src="thumbnail.src"
            :label="thumbnail.name"
            :title="thumbnail.name"
            :width="thumbnailWidth"
            @click="loadIntoWorkArea(index)">
        </transition-group>
      </div>
    </div>

    <div id="rightpaddle" class="align-middle"  style="height: 100%;" @click="slideright">
      <span style="width: 50px; height: 90px;">
        <i class="icon-right-open" style="font-size: 1.5em"></i>
      </span>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  props: {
    thumbnailWidth: {
      type: String,
      default: "80px"
    }
  },
  data() {
    return {
      thumbnails: [],
      currentIndex: 0,
    }
  },
  methods: {
    ...mapMutations('image-store', [
      'setImageSelected' // Map this.setImgSelected to this.$store.setImgSelected
    ]),

    readImageFile(f) {
      if (f.type.startsWith("image")) {
        let reader = new FileReader();
        reader.onload = e => {
          let imageData = {
            name : f.name,
            src: e.target.result
          };

          this.loadImage(e.target.result, imageData);
          this.thumbnails.push(imageData);
        }

        reader.readAsDataURL(f);
      }
    },

    loadImage(src, imageData) {
      let self = this;
      let image = new Image();
      image.src = src;

      image.onload = function() {
        let imageSize = {
          width : this.width,
          height : this.height,
          scaledWidth: this.width,
          scaledHeight: this.height,
          imageScale: 1
        };

        self.$store.commit('image-store/addImageToStore', {
          src,
          name: imageData.name,
          size: imageSize});
      }
    },

    readImageFiles(e) {
      var input = e.srcElement || e.target;
      if (input.files && input.files[0]) {
        for (let i = 0; i < input.files.length; i++){
          this.readImageFile(input.files[i]);
        }
      }
    },

    slideleft() {
      let firstThumbnail = this.thumbnails.shift();
      this.thumbnail.push(firstThumbnail);
    },

    slideright() {
      let lastThumbnail = this.thumbnail.pop();
      this.thumbnail.unshift(lastThumbnail);
    },

    loadIntoWorkArea(index) {
      let imageSelected = this.thumbnails[index];
      this.setImageSelected(imageSelected);
    },
  }
}
</script>

<style lang="css" scoped>
  input[type='file'] {
    display: none;
  }

  .thumbnail-list-move {
    transition: transform 1s;
  }
</style>
