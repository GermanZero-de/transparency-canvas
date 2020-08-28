/**
 * This is a preliminary version written in JavaScript and rendering on the client.
 *
 * This file is currently not licensed for any use unless told otherwise!
 *
 * @file JavaScript for drawing a progress bar-like gauge of the amount of donations received.
 * @author f-do-902 on github
 * @version v0.0.3
 */

// Configurations:

// Define the graphics parameters for different breakpoints here
GERMANZERO_TRANSP_GRAPHICS_PARAMETERS = {
 992: {imgHeight : 86, barHeight: 55, dstText3Right: 12, dstText1Left: 2,
    dstText1Top: 6, dstText1Bottom: 12, txtH: 13, textSize: 14, radius: 10, rName: 'desktop'},
 768: {imgHeight : 68, barHeight: 42, dstText3Right: 10, dstText1Left: 2,
    dstText1Top: 5, dstText1Bottom: 10, txtH: 11, textSize: 11, radius: 8.2, rName: 'tablet'},
 480: {imgHeight : 55, barHeight: 34, dstText3Right: 7, dstText1Left: 2,
    dstText1Top: 3, dstText1Bottom: 6, txtH: 8, textSize: 10.5, radius: 6, rName: 'mobile-landscape'},
 1:   {imgHeight : 48, barHeight: 30, dstText3Right: 6, dstText1Left: 1,
    dstText1Top: 2, dstText1Bottom: 6, txtH: 8, textSize: 10, radius: 5.5, rName: 'mobile-portrait'}
};

// "Business" functions

// "public" function

function gzPbParseData(data) {
  var parts = data.split(";");
  var yr = parts[0];
  var text1 = parts[1];
  var pct = 
   parts[2].length > 5 && parts[2].charAt(0) == "("
    && parts[2].charAt(5) == ")"
     ? 
   getGzPbPercentageOfYear(parts[2].substring(1,5)) : parts[2];
  var text3a = parts[3];
  var text3b = parts[4];
  return { y: yr, innerText: text1, pct : pct, textUpperRight: text3a, textLowerRight: text3b };
}

/**
 * Compares the given year "yr" to the current date. If the given year 
 * is the current year, a value between 0 and 100 is returned, where 
 * 0 is on January 1st and 100 on December 31st 24:00. 
 *
 * If the current year is before the given year, "0" is returned, if 
 * it is after the given year, "100" is returned.
 */
function getGzPbPercentageOfYear(yr) {
   var ret = 0;
   var thisYear = new Date().getFullYear();
   if (yr == thisYear) {
   var newYear = new Date(new Date().getFullYear(), 0, 1).getTime();
   var endOfYear = new Date(new Date().getFullYear()+1,0,1).getTime()-1;
   var yLength = endOfYear - newYear; // Length of year in milliseconds

   var nowInYear = ((new Date().getTime()-newYear)/yLength);

   ret = (nowInYear * 100);
 } else {
   ret = thisYear < yr ? 0 : 100;
 }
 return ret;
}

// "private" function: give the parameters for the current resolution

/**
 * Gets the highest defined window width which is smaller than
 * or equal to the actual window width
 */
function getGzPbGraphicsParameters() {
 var breakPoints = [992, 768, 480, 1];

 var width = window.innerWidth
     || document.documentElement.clientWidth
     || document.body.clientWidth;
 var breakPoint = breakPoints[0];
 for (i = breakPoints.length - 1; i >= 0 ; i--) {
   if (window.matchMedia( "(min-width: "+breakPoints[i]+"px)" ).matches) {
     breakPoint = breakPoints[i];
   }
 }
 return GERMANZERO_TRANSP_GRAPHICS_PARAMETERS[breakPoint];
}

// "private" graphics utility functions

/**
 * Draws the "tip" (the right end) of the
 * progress bar (rounded). If the height parameter is
 * given as "90", the width will be 48; otherwise, it
 * is grown or shrunk by scale
 */
function gzPbDrawProgressTip(ctx, x, y, height, fill, stroke)
{
  var scale = height / 90;
  ctx.beginPath();
  ctx.moveTo(0 + x, 0 + y);

  ctx.lineTo(0 + x, (90 * scale) + y);
  ctx.bezierCurveTo((14.43 * scale) + x, (90.00 * scale) + y,
                    (24.61 * scale) + x, (89.81 * scale) + y,
                    (35.71 * scale) + x, (78.71 * scale) + y);
  ctx.bezierCurveTo((42.79 * scale) + x, (71.64 * scale) + y,
                    (46.88 * scale) + x, (61.98 * scale) + y,
                    (47.00 * scale) + x, (52.00 * scale) + y);
  ctx.bezierCurveTo((47.21 * scale) + x, (33.44 * scale) + y,
                    (47.41 * scale) + x, (18.36 * scale) + y,
                    (30.00 * scale) + x, (6.60 * scale) + y);
  ctx.bezierCurveTo((19.44 * scale) + x, (-0.54 * scale) + y,
                    (11.93 * scale) + x, (0.00 * scale) + y,
                    (0.00 * scale) + x, (0.00 * scale) + y);

  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}

/**
 * Draws a rounded rectangle. If the sharpCornersRight parameter is set, it will
 * not be rounded on the right side.
 */
function gzPbDrawRRect(ctx, x, y, width, height, radius, fill, stroke, sharpCornersRight)
{
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  if (sharpCornersRight) {
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + height);
  } else {
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  }
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}

// functions for handling retina/hidpi displays
function getGzPbDpr() {
  return window.devicePixelRatio || 1;
}

function getGzPbBsr(canvas) {
  var ctx = canvas.getContext("2d");
  return ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;
}

// "public" function called from website

/**
 * Sets up a canvas to look good on hidpi/retina
 */
function setGzPbCanvasSize(canvas, baseW, baseH) {
  var ratio = getGzPbDpr() / getGzPbBsr(canvas);
  canvas.width = baseW * ratio;
  canvas.height = baseH * ratio;
  canvas.style.width = baseW + "px";
  canvas.style.height = baseH + "px";
  canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
  return canvas;
}

/**
 * Draws a a progress bar-like gauge of the amount of donations received on an html canvas.
 * Serves mainly as a proof of concept for evaluationg layout issues etc. and as a template
 * to be translated to another programming language which will probably run on a server
 * and deliver images
 */
function gzPbDrawProgress(text1, text2, text3a, text3b, pPercentage, canvasId) {

  var width = $(canvasId).width();
  var height = $(canvasId).height();
  var canvas = $(canvasId).get(0);
  var ctx = canvas.getContext("2d");


  var graphicsParameters = getGzPbGraphicsParameters();

  var fontSize = graphicsParameters.textSize;
  var baseFont = "pt DMSans, 'DM Sans', Arial";
  var font = fontSize + baseFont;
  var font2 = (fontSize - 1.5) + baseFont;
  var font3 = (fontSize + 1.0) + baseFont;

  ctx.font = "bold " + font;

  // Genug Platz rechts reservieren
  var spaceNeededRight = ctx.measureText("€ 482.886,73").width;
  if (text3a) {
    var altSpaceNr1 = ctx.measureText(text3a).width;
    spaceNeededRight = (spaceNeededRight > altSpaceNr1) ?
      spaceNeededRight : altSpaceNr1;
  }
  if (text3b) {
    var altSpaceNr2 = ctx.measureText(text3b).width;
    spaceNeededRight = (spaceNeededRight > altSpaceNr2) ?
      spaceNeededRight : altSpaceNr2;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);


  var progressBarTotalWidth = width -
   (spaceNeededRight + graphicsParameters.dstText3Right);

  // graues round rect zeichnen
  ctx.fillStyle = "#eaeaea";
  gzPbDrawRRect(ctx, 0, height - graphicsParameters.barHeight, progressBarTotalWidth,
   graphicsParameters.barHeight, graphicsParameters.radius, true, false);

  // Breite der Balkenspitze berechnen
  var barTipScale = (graphicsParameters.barHeight / 90);
  var barTipWidth = barTipScale * 48;

  // Gesamtbreite des inneren ("markierten") Balkens
  var realPct = (pPercentage / 100) > 1 ? 1 : (pPercentage / 100);
  var innerBarWidth = realPct * progressBarTotalWidth;

  // Markierten Balken zeichnen
  ctx.fillStyle = "#ffc80c";
  gzPbDrawRRect(ctx, 0, height - graphicsParameters.barHeight,
   innerBarWidth - barTipWidth + 3,
   graphicsParameters.barHeight, graphicsParameters.radius, true, false, true);

  // Spitze dran
  gzPbDrawProgressTip(ctx, innerBarWidth - barTipWidth, height - graphicsParameters.barHeight,
    graphicsParameters.barHeight, true, false);

  // Bei 100% ganz ausfüllen
  if (realPct >= 1.00) {
  ctx.fillStyle = "#ffc80c";
  gzPbDrawRRect(ctx, 0, height - graphicsParameters.barHeight,
   progressBarTotalWidth,
   graphicsParameters.barHeight, graphicsParameters.radius, true, false);
  }

  // Kontext wechseln: Etwas antialiasing
  ctx = canvas.getContext("2d", {alpha: false});
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Text 1 darstellen ("Jahr")
  ctx.fillStyle = "#000000";
  ctx.textBaseline = "top";
  ctx.font = "bold " + font3;
  ctx.fillText(text1, graphicsParameters.dstText1Left, graphicsParameters.dstText1Top);

  // Text 2 darstellen ("Erreicht")
  ctx.font = "bold " + font2;
  var spaceNeededText2 = ctx.measureText(text2).width;

  // Text 2 ins gelbe, wenn's geht...
  var text2x = innerBarWidth - (barTipWidth + spaceNeededText2);
  // sonst rechts vom gelben, wenn's geht...
  text2x = text2x < 0 ? innerBarWidth : text2x;
  // sonst ganz nach links
  text2x = text2x + spaceNeededText2 <= progressBarTotalWidth ?
    text2x : 2;
  // Jetzt vertikal positionieren
  text2y = (height - graphicsParameters.barHeight)
               + (graphicsParameters.barHeight / 2)
               + 3;

  ctx.textBaseline = "middle";
  ctx.fillText(text2, text2x, text2y);

  // Text 3 darstellen ("Ziel")
  ctx.font = font;
  var xText3 = progressBarTotalWidth + graphicsParameters.dstText3Right;
  var text3BoxHeight = graphicsParameters.barHeight / 2;
  var yOffset = graphicsParameters.rName === 'desktop' ? 2 : 0;
  var yText3a = (height - graphicsParameters.barHeight) + (text3BoxHeight / 2) + yOffset;
  var yText3b = (height - graphicsParameters.barHeight) + text3BoxHeight + (text3BoxHeight / 2) - yOffset;

  ctx.font = font;
  ctx.fillText(text3a, xText3, yText3a);
  ctx.font = "bold " + font;
  // ctx.fillText(graphicsParameters.rName, xText3, yText3b);
  ctx.fillText(text3b, xText3, yText3b);
}
