# transparency-canvas

This project aims to provide graphic functions to render a donation progress bar using HTML-Canvas and JavaScript. 
It shall in addition provide some "business logic" functions. 

## Usage

Include this file via the usual HTML means into the web page. 

Call the functions declared as "public" in the comments. 

As JavaScript in the versions supported by some of the current web browsers does not provide visibility scopes as in 
Java (nota bene: it _does_ provide closures), all functions are named with `GzPb` as a part of the name (meaning 
_GermanZero progress bar_). 

**TODO** change to a closure to separate from other code

## Changelog

### v0.0.3
* Copied the logic to trigger the rendering into this project as it is less trivial 
  to start painting on the canvas in all browsers than expected.
* Planning to embed a minified version of the script instead of delivering it via 
  jsdelivr CDN - added a minification action

### v0.0.2 
* Renders better on HiDPI displays
* The business function to get the "time progress" of the year has been rewritten 
  to recieve a year to which the current date should be compared, so it returns 
  0 if the given year has still to come and 100 if the given year is already over:
    ```javascript
    function getGzPbPercentageOfYear(yr) 
    ```
* Added a business function which can parse CSV like strings (semicolon separated) 
  into the data which are needed to draw the bars, e. g. 
  `2020;673.000 €;(2020);Ziel:;€3,848 Mio` where the `(2020)` means "get the 
  current date and check where it is in the year of 2020 according to 
  `getGzPbPercentageOfYear` (the other values are fixed values) or 
  `2019;;27;Erreicht:;€482.886,73` with a fixed bar width of 27% and no 
  text inside the bar (the two semicolons following each other with no text 
  in between):
    ```javascript
    function gzPbParseData(data)
    ```
  The `data` string is currently taken from the extra data on the embedded 
  custom element with the two attributes `data-bar1` and `data-bar2`.

### v0.0.1
* Contains a function to get the "time" progress of the current year:
    ```javascript
    function getGzPbPercentageOfCurrentYear()
    ```
* Does not render well on HiDPI/Retina displays


### 2020-07-25 13:17 CEST
Initial import

## Open issues
* Not yet tested 
* Flickering when loading
* How to deliver? Is jsdelivr.net or something similar okay?
* Font size and font smoothing?
* Does the original graphics designer agree with this implemenation?
* Licence?
* Easier way to update the texts and percentages?
* and lots more
