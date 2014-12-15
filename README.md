picturecaption
==============

Prolyfill to allow different figcaptions and alt text to be defined for different `<source>` tags within `<picture>`

## Problem

There is currently no way of defining different captions and alt text for the different images defined for the `<picture>` element, should the need arise.

## Solution
This prolyfill suggests a method of solving this by allowing multiple `<figcaption>` tags which use a `data-for` attribute to specify which one of the `<source>` tags elements the caption is for. Additionally, a `data-alt` attribute on the `<source>` tag allows different alt text per source image.

For example:

```html
<figure>
   <picture>
      <source id="town" srcset="images/city-medium.jpg" media="(min-width: 800px)"
              data-alt="A view of the French town of Saumur, with its medieval castle looking down upon the town with a church spire in the right foreground">
      <img src="images/castle.jpg" alt="The medieval castle in Saumur, France">
   </picture>
   <figcaption data-for="town">The town of Saumur in France</figcaption>
   <figcaption>The medieval castle in Saumur, France</figcaption>
</figure>
```

## Usage

Simple include the `picturecaption.min.js` (or `picturecaption.js`) file at the end of your HTML file, before the closing `</body>` tag.

## Known Issues

It's not very stable at the moment as this is the first 'quick and dirty' implementaion of this idea to show how it might work.

1. The `<figcaption>` tags currently must be defined *after* the `<picture>` tag
2. It's not been wildely tested yet
3. Code probably needs refactoring
4. Only works when run on a webserver
