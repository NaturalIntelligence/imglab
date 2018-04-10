# imglab
Web based tool to label images for object. So that they can be used to train dlib or other object detectors.

<a href="https://www.patreon.com/bePatron?u=9531404" data-patreon-widget-type="become-patron-button"><img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patron!" width="200" /></a>
<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KQJAX48SPUKNC"> <img src="https://www.paypalobjects.com/webstatic/en_US/btn/btn_donate_92x26.png" alt="Stubmatic donate button"/></a>
<a href="https://liberapay.com/amitgupta/donate"><img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg"></a>

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

### Worth to mention

- **[निम्न (NIMN)](https://github.com/nimndata/spec)** : Schema aware object compression. 60% more compressed than JSON. 40% more compressed than msgpack.
- **[imglab](https://github.com/NaturalIntelligence/imglab)** : Web based tool to label images for object. So that they can be used to train dlib or other object detectors. You can integrate 3rd party libraries for fast labeling.
- [fast-lorem-ipsum](https://github.com/amitguptagwl/fast-lorem-ipsum) : Generate lorem ipsum words, sentences, paragraph very quickly.
- [stubmatic](https://github.com/NaturalIntelligence/Stubmatic) : A stub server to mock behaviour of HTTP(s) / REST / SOAP services. You can also mock msgpack, and nimn format in easy way.
- **[अनुमार्गक (anumargak)](https://github.com/NaturalIntelligence/anumargak)** : Amazinf fast router for node web servers.
- [fastify-xml-body-parser](https://github.com/NaturalIntelligence/fastify-xml-body-parser/) : Fastify plugin / module to parse XML payload / body into JS object using fast-xml-parser.
- [Grapes](https://github.com/amitguptagwl/grapes) : Flexible Regular expression engine (for java) which can be applied on char stream. (under development)
