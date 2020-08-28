/**
 * This is a preliminary version written in JavaScript and rendering on the client.
 *
 * This file is currently not licensed for any use unless told otherwise!
 *
 * @file JavaScript for painting the gauge as soon as fonts are available.
 * @author f-do-902 on github
 * @version v0.0.3
 */

// This function triggers the drawing and redrawing of the gauge.
// WebFonts and JQuery required!
function gzPbDrawRedraw() {

    // Wie weit geht der Balken in den einzelnen Jahren?
    var data1 = gzPbParseData($("#gzPbBars").data().bar1);
    var data2 = gzPbParseData($("#gzPbBars").data().bar2);

    var id2019 = "#progressVar2019";
    var id2020 = "#progressVar2020";

    var canvas1 = setGzPbCanvasSize($(id2019).get(0),
        $(id2019).parent().width(),
        getGzPbGraphicsParameters().imgHeight);
 
    gzPbDrawProgress(data1.y, data1.innerText, data1.textUpperRight,
        data1.textLowerRight, data1.pct, id2019);

    var canvas2 = setGzPbCanvasSize($(id2020).get(0),
        $(id2020).parent().width(),
        getGzPbGraphicsParameters().imgHeight);

    gzPbDrawProgress(data2.y, data2.innerText, data2.textUpperRight,
        data2.textLowerRight, data2.pct, id2020);
 }

 // Problem: In Google Chrome 85.0 on Windows 10, the callback
 // from WebFont.load is not called for some reasons, so
 // we will check if we already have painted the gauge and
 // paint again. If it was painted, but the font was not loaded
 // but now it is, we will also retry.
 function gzPbTryDraw() {
     var hasFont = window.GZPB.paintedWithFont || false;
     var hasFontNow = hasFont || ((document.fonts && document.fonts.check('12px DMSans')) || false);
     hasFontNow = hasFontNow || ((document.fonts && document.fonts.check('12px DM Sans')) || false);
     var paintedOnce = window.GZPB.paintedOnce || false;

     if ((!hasFont && hasFontNow) || (!paintedOnce)) {
         gzPbDrawRedraw();
     }

     window.GZPB.paintedWithFont = hasFontNow;
     window.GZPB.paintedOnce = true;
 }

// Initializes global variable and sets timers
// to check and draw when needed
function gzPbInitDraw() {
     window.GZPB || (window.GZPB = {});
     window.setTimeout(gzPbTryDraw, 1);
     window.setTimeout(gzPbTryDraw, 10);
     window.setTimeout(gzPbTryDraw, 20);
     window.setTimeout(gzPbTryDraw, 50);
     window.setTimeout(gzPbTryDraw, 100);
     window.setTimeout(gzPbTryDraw, 1000);
     window.setTimeout(gzPbTryDraw, 3000);
 }

 // Called when webfonts loaded. Paints the gauge and sets
 // the global variables so that no unnecessary repaint is
 // tried.
function gzPbDrawWhenFontLoaded() {
     gzPbDrawRedraw();
     window.GZPB || (window.GZPB = {});
     window.GZPB.paintedWithFont = true;
     window.GZPB.paintedOnce = true;
 }

 // Load required fonts.
 // This should already be triggered on this page, but we need the
 // "active" hook to render the page as soon as the fonts are loaded.
 // According to some tests, a double "load" call on WebFont does not
 // harm, but who can be sure? (FN)
 WebFont.load({
     google: { families: ['DM Sans', 'DM Sans:Bold'] }, active: gzPbDrawWhenFontLoaded
 });

// Handling of window resizing
(function () {
     // In case of resizing: redraw to fit exactly in
     window.addEventListener('resize', gzPbDrawRedraw, false);
})();

// Setting timers in case WebFont.load didn't call active method
(function () {
        gzPbInitDraw();
})();