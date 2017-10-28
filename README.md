# imglab
Web based tool to label images for object. So that they can be used to train dlib or other object detectors.


# How to use
You can either import a file from a URL or from your computer. You can plot the landmark points by yourself or you can request to face++ API to collect the points which gets automatically plotted on the image (You will need to register on face++ to use the API.). If you feel that the result should be improved, you can drag a point to correct location.



# TO DO
* API compatible landmark label
* export to file
* export to dlib compatible file
* draw the line between landmark points
* Send selected image file to the API
* Image scalling
* warn user on image switch when label is empty
* filter for (un)labelled images
* Delete all points of a box
* load data from ptn, xml file. 
* Tool to draw points in straight line (eg nose, chin, eyebrows' center)