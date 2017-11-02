# imglab
Web based tool to label images for object. So that they can be used to train dlib or other object detectors.


# How to use
You can either import a file from a URL or from your computer. You can plot the landmark points by yourself or you can request to face++ API to collect the points which gets automatically plotted on the image (You will need to register on face++ to use the API.). If you feel that the result should be improved, you can drag a point to correct location.

[![ImgLab Tutorial](https://img.youtube.com/vi/4yLL21weN8w/0.jpg)](https://www.youtube.com/watch?v=4yLL21weN8w)

# TO DO
* load points from a file
* Image scalling
* API compatible landmark label
* Show dlib, face++ specific point schemes
* show face++ labeles instead of automatic number
* show warning when use try to load images if there is any labelled image already loaded.
* 
* filter for (un)labelled images
* Tool to draw points in straight line (eg nose, chin, eyebrows' center)
* draw the line between landmark points
* Highlight empty button when there is any point in box
* Resizable box
