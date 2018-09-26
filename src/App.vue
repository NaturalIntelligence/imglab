<template>
  <div class="">
    <div class="container-fluid">
      <div id="menubar" class="row overlay-color align-items-center" style="height: 50px;">
        <div class="col-3 col-sm-2 col-md-1 col-xl-1 no-pl">
          <!-- <menu-dropdown></menu-dropdown> -->
        </div>
        <div class="col-6 col-sm-6 col-md-7 col-xl-7 text-center">
          <!-- form-inline input-group -->
          <div class="row justify-content-center align-content-center">
            <a href="https://github.com/NaturalIntelligence/imglab">
    						<img src="./assets/imglab_logo.png" height="48px" style="margin-top: 2px">
    					</a>
            <span style="font-size: 2em; margin-top:5px;">Img Lab</span>
          </div>
        </div>
        <div class="col-3 col-sm-4 col-md-4 col-xl-4">
          <div class="form-inline flex-row-reverse float-right">
            <a class="btn btn-info" onclick="javascript:displayDonationPrompt()" style="margin: 0px 10px;">Donate</a>
            <!-- <shortcuts class="d-none d-md-block"></shortcuts>
            <plugins-menu class="d-none d-md-block"></plugins-menu> -->
          </div>
        </div>

      </div>
      <!-- End of Menubar -->
    </div>
    <div class="flex-row">
      <div class="d-flex flex-row" style="height: calc(100vh - 50px);">
        <div id="toolbar" class="d-flex flex-column overlay-color grey-border">
          <!-- <toolbox tools="labelling"></toolbox> -->
          <!-- <toolbox class="mt-auto toolbox-border-top" tools="canvas"></toolbox> -->
        </div>
        <div class="d-flex flex-column base-color" style="width: 100vw">
          <div>
            <!-- <actionbar></actionbar> -->
          </div>
          <div>
            <workarea></workarea>
          </div>
          <div class="grey-border mt-auto" style="height: 100px; width: 100%; margin: 0px 2px;">
            <image-slider thumbnail-width="90px" class="mt-auto"></image-slider>
          </div>
        </div>
        <div id="sidebar" class="p-2 overlay-color grey-border" style="width: 350px;">
          <!-- <label-panel></label-panel> -->
        </div>
      </div>

      <div id="snackbar"></div>
      <!-- <plugin-window></plugin-window> -->
    </div>
  </div>
</template>

<script>
import WorkArea from './components/workarea';
import ImageSlider from './components/image-slider/image-slider';

export default {
  components: {
    'workarea': WorkArea,
    'image-slider': ImageSlider
  }
};
</script>

<style>
</style>
