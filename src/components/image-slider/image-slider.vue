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
        <div class="photolist-wrapper" style="width: 100%; overflow: hidden;">
          <div id="photolist" class="photolist d-flex align-items-center" ref="photolist">
            <!-- <transition-group
              name="list"
              :css="false"
              @before-enter="beforeEnter"
              @enter="enter"
              @leave="leave"> -->
              <img
                class="thumbnail"
                v-for="(thumbnail, index) in thumbnails"
                :id="'thumbnail_' + index"
                :key="thumbnail.name + index"
                :src="thumbnail.src"
                :label="thumbnail.name"
                :title="thumbnail.name"
                :width="thumbnailWidth"
                :data-index="index"
                @click="loadIntoWorkArea(index)">
            <!-- </transition-group> -->
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
import { mapMutations } from 'vuex';
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
      thumbnails: [],
      currentIndex: 0,
      dummy: [1,2,3,4,5,6]
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
      this.thumbnails.push(firstThumbnail);
    },

    slideright() {
      let lastThumbnail = this.thumbnails.pop();
      this.thumbnails.unshift(lastThumbnail);
    },

    loadIntoWorkArea(index) {
      let imageSelected = this.thumbnails[index];
      this.setImageSelected(imageSelected);
    },

    beforeEnter(el) {
      el.style.opacity = 0;
      el.style.height = 0;
    },

    enter(el, done) {
      let delay = el.dataset.index * 150;
      setTimeout(function() {
        Velocity(
          el,
          { opacity: 1, height: 100 + "%" },
          { complete: done }
        )
      }, delay);
    },

    leave(el, done) {
      let delay = el.dataset.index * 150;
      setTimeout(function() {
        Velocity(
          el,
          { opacity: 0, height: 0 },
          { complete: done }
        )
      }, delay);
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
