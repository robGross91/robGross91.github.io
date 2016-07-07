## docstring:
## =======================================================
## Created by Robert Gross
## Student number: 20495129
##
## A spirograph is a pattern created by tracing a point
## attached at length (d) to a rotating circle of radius
## r, rotating around a larger circle of radius R.
## By varying these three values we can create many
## different types of spirographs, this program takes in
## user-entered values of R, r and d and produces the
## relevant spirograph by using seperate equations to
## generate each x and y-value and then drawing a line
## between each point. The equations are as follows:
##
## x(t) = (R-r) cos t + dcos(t(R-r)/r)
## y(t) = (R-r) sin t + dsin(t(R-r)/r)
##
## This program has determined the total number of
## t-values by first calculating the number of rotations
## that the small circle will make (determined in
## rotations()) by calculating the greatest common divisor
## between r and R (using Euclid's algorithm) and then
## multiplying this number by 360 (to represent each
## degree in a full rotation of a circle). The program
## enters values of t from 1 to t(max) (at increments of
## 1) into the two above equations to get each point.
##
## Once a list of points has been created, the program
## adjusts each one by a relative to the maximum values
## of each x and y to fit into a fixed coordinate plane
## of 900 x 900.
##
## As each point is calculated a colour is randomised for
## each line to make it more aesthetically pleasing.
##
## This program is interacted with by running main() and
## inputting each value as prompted. If you wish to draw a
## new spirograph, simply click on the spirograph window
## and you will be prompted for new values.
##
## PLEASE NOTE FOR MARKING: I have split the suggested
## functions into smaller functions, these smaller
## functions have all been referred to in the relevant
## methods so they should be straight forward to follow.
## =======================================================
##
## REFERENCES:
##
## http://www.cs.swarthmore.edu/~newhall/cs21/pythondocs/using-graphics.html
## http://en.wikipedia.org/wiki/Spirograph
## http://samjbrenner.com/notes/processing-spirograph/

from graphics import *
import math
import random



def main():
    R, r, d = getInputs()
    print("\n=============================================================================\n")
    draw(getPoints(R, r, d, 360))

def getInputs():

    R = eval(input("Enter the radius of the fixed circle: \n"))
    r = eval(input("Enter the radius of the rolling circle: \n"))
    d = eval(input("Enter the distance of the pen from the centre of the rolling circle: \n"))
    return(R, r, d)


## This will calculate how many rotations the rotating circle makes before repeating the pattern:
def rotation(R, r):
## First calculating gcd: ##
    if (R > r):
        large = R
        
        small = r
    else:
        large = r
        small = R
    while small != 0:
        remainder = large % small
        large, small = small, remainder
## At this point large will be the gcd ##
    return(int(r / large))

def coordinates(R, r, d, points, i):
    coords = []
    xPoint = ((R-r)*(math.cos(math.radians(i)))) + (d * math.cos((math.radians(i)* ((R - r) / r))))
    yPoint = ((R-r)*(math.sin(math.radians(i)))) - (d * math.sin((math.radians(i)* ((R - r) / r))))
    coords = [xPoint, yPoint]
    return (coords)
    

## Prec is the number of points to draw per rotation of the moving circle
## Maybe change prec into an eval(input(" function
def getNumberOfPoints(R, r, prec):
    points = rotation(R,r) * prec
    return (int(points))


## Creates a list of points:
def getPoints(R, r, d, prec):
    pointList = []
    points = getNumberOfPoints(R, r, prec)
    for i in range (points):
        pointList.append(coordinates(R, r, d, points, i)) 
    return (pointList)


def draw(pointList):
    xPointList = []
    yPointList = []
    xMax = 0
    xMin = 0
    yMax = 0
    yMin = 0
## Construction of xPointList and yPointList:
    for j in range (len(pointList)):
        xPointList.append(pointList[j][0])
        yPointList.append(pointList[j][1])
## Determing range of x and y points for graphing:
    for i in range (len(xPointList)):
        if (xPointList[i] > xMax) :
            xMax = xPointList[i]
        if (xPointList[i] < xMin) :
            xMin = xPointList[i]

    for i in range (len(yPointList)):
        if (yPointList[i] > yMax) :
            yMax = yPointList[i]
        if (yPointList[i] < yMin) :
            yMin = yPointList[i]
            
    if math.fabs(xMax) > math.fabs(xMin):
        xFactor = math.fabs(xMax) / 500
        yFactor = math.fabs(xMax) / 500
    else:
        xFactor = math.fabs(xMin) / 500
        yFactor = math.fabs(xMin) / 500
    #yFactor = yMax / 500
## Adjustment of x and y points to fit 800 by 800 graph:
    for i in range (len(xPointList)):
        xPointList[i] = xPointList[i] / xFactor
        yPointList[i] = yPointList[i] / yFactor

## Window of 900 x 900 will be created, coordinates will be 20% larger than
## maximum and minimum points plotted
    win = GraphWin("Spyrograph", 900, 900)
    win.setBackground("black")
    win.setCoords(-600, -600, 600, 600)
    closeText = Text(Point(-380, - 570), "Click anywhere to close and redraw")
    closeText.setTextColor("white")
    closeText.draw(win)

    for j in range (1, (len(xPointList))):
        r = random.randrange(256)
        b = random.randrange(256)
        g = random.randrange(256)
        line = Line(Point(xPointList[j-1],yPointList[j-1]), Point(xPointList[j],yPointList[j]))
        line.setFill(color_rgb(r, g, b))
        line.setWidth(3)
        line.draw(win)

    if win.getMouse():
        win.close()
        if input("\nWould you like to draw another spirograph? (y/n)\n") == "y":
            print("\n")
            main()
        else:
            exit()

main()

