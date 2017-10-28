# imglab
Web based tool to label images for object. So that they can be used to train dlib or other object detectors.


# How to use
You can either import a file from a URL or from your computer. You can plot the landmark points by yourself or you can request to face++ API to collect the points which gets automatically plotted on the image (You will need to register on face++ to use the API.). If you feel that the result should be improved, you can drag a point to correct location.



# TO DO
* refactor
* load points from a file
* export to file (ptn,xml,fpp)
* export to dlib compatible file
* Send selected image file to the API
* warn user on image switch when label is empty
* Image scalling
* filter for (un)labelled images
* Delete all points of a box
* load data from ptn, xml file. 
* Tool to draw points in straight line (eg nose, chin, eyebrows' center)
* API compatible landmark label
* Show dlib, face++ specific point schemes
* show face++ labeles instead of automatic number
* show warning when use try to load images if there is any labelled image already loaded.
* 
* draw the line between landmark points