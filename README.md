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

### 2020-07-25 17:15 CEST
As I understand, the progress bar for the current year is supposed to show how far the year has progressed, i. e. it 
should show "zero" on January 1st and "full width" on December 31st. So a "business method" which returns the point 
in the current year of the current date is added: 

```javascript
function getGzPbPercentageOfCurrentYear()
```

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
