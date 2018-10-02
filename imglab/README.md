# [imglab](http://imglab.ml/)

Web based tool to label images for object. So that they can be used to train dlib or other object detectors.

Or check [downloads](downloads) folder to download OS specific executable to run it offline.

[![first-timers-only](http://img.shields.io/badge/first--timers--only-friendly-blue.svg?style=flat-square)](http://www.firsttimersonly.com/)
[![Bountysource](https://img.shields.io/bountysource/team/imglab/activity.svg)](https://salt.bountysource.com/teams/imglab)

<a href="https://opencollective.com/imglab/donate" target="_blank">
  <img src="https://opencollective.com/imglab/donate/button@2x.png?color=blue" width=200 />
</a>
<a href="https://www.patreon.com/bePatron?u=9531404" data-patreon-widget-type="become-patron-button"><img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patron!" width="200" /></a>
<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KQJAX48SPUKNC"> <img src="https://www.paypalobjects.com/webstatic/en_US/btn/btn_donate_92x26.png" alt="Stubmatic donate button"/></a>
<a href="https://liberapay.com/amitgupta/donate"><img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg"></a>

<div align="center"><img src="img/imglab_logo.png"  width="300px"></div>


> If you're using the old version of imglab please use this [link](https://naturalintelligence.github.io/imglab/old.html)

> If you want to be the maintainer/colaborator of this project/organization, please let me know. There is only one condition that you need to be polite to response any user.

## Features

ImgLab is platform independent, runs directly from browser, and no prerequisite is needed. It requires very less CPU and memory.

The best thing is that you can use 3rd party libraries to **fast annotation process** which eventually saves your effort and time both.

**Other features are**:

* Special attention for dlib users. You can easily adjust the order of parts / landmarks/ featurepoints.
* Opensource and free forever.
* You can draw feature points, shapes (circle, rectangle, polygon). Other shapes like ellipse, line, curves will be added in future on demand. 
* Small project file so it can be shared over the mail. In [निम्न (Nimn)](http://nimn.in) data format
* Multiple formats are supported
  * dlib XML
  * dlib pts
  * Pascal VOC
  * COCO
  * Tenserflow (in plan)
  
**Other silent features are**:

* Drag or resize any annotation shape.
* Select and delete any annotation shape or landmark points.
* Arrange landmark points in specific order my dragging their label up & down, instead of creating them in a particular order.
* Autosave in browser cache. Export to save on disk.
* Hot keys support for easy switch between images, tools, labelling data, or to access other part of the application. Hence it is more convenient and effort saving.
* Set image opacity to highlight annotation shapes and points.
* Tracking lines and mouse coordinates for precise annotation.

## How to use

You can either import a file from a URL or from your computer. You can plot the landmark points by yourself or you can request to face++ API to collect the points which gets automatically plotted on the image (You will need to register on face++ to use the API.). If you feel that the result should be improved, you can drag a point to correct location. Check [Demo video](https://youtu.be/Y-bJo_ylHTw) on Youtube.

### Auto suggestion

![Auto suggestion](img/imglab-autosuggestion.gif)

### Plugins

![Plugins](img/imglab-fpp.gif)

### Different Shapes

![Plugins](img/imglab-polygon.gif)

Check [video](https://youtu.be/Y-bJo_ylHTw) tutorial/demonstration for more detail.

## Showcase your work

Using this library if you build some open database which can help others or just to showcase, please raise an issue or PR.

## Worth to mention

- **[निम्न (NIMN)](https://github.com/nimndata/spec)** : A data format which can save up to 80% network bandwidth and speed up network communication.
- [Stubmatic](https://github.com/NaturalIntelligence/Stubmatic) : Create HTTP mock  services in minutes without code. You can also mock some binary data formats.
- **[अनुमार्गक (anumargak)](https://github.com/NaturalIntelligence/anumargak)** : Amazing fast router for node web servers.

## Contributors

<a href="graphs/contributors"><img src="https://opencollective.com/imglab/contributors.svg?width=890&button=false" /></a>

