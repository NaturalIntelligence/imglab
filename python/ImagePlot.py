from PIL import Image, ImageDraw
import sys 

print(sys.argv);

if len(sys.argv) < 3 :
	print("File path need to be passed as 1st argument")
	exit()

im = Image.open(sys.argv[1])

draw = ImageDraw.Draw(im)

try:  
    #fp = open(sys.argv[1])
	with open(sys.argv[2]) as fp:  
   		lines = fp.readlines()
	for line in lines:
		xy = [x.strip() for x in line.split(',')];
		print(xy);
		#draw.point([(float(xy[0]), float(xy[1]))], fill='red')
		draw.ellipse([(float(xy[0])-3, float(xy[1])-3),(float(xy[0])+3, float(xy[1])+3)], fill='red')
	
	del draw	
 	im.save("output.png")
    # do stuff here
finally:  
    fp.close()
    #del draw

# write to stdout