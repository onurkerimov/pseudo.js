# pseudo.js

**pseudo.js** is a plugin that lets you convert `::before` and `::after` pseudo elements to real elements. This way, they become reachable with JavaScript.

## Problem with Pseudo Elements
Let's say you have a document with following CSS and HTML:
```css
div::before { background: red; content: 'Name: '; }
span::before, span::after{ background: blue; }
```
```html
<div>
    <span>John Doe</span>
</div>
```
`::before` and `::after` selectors in above CSS, result in the following HTML:
```html
<div>
    <::before>Name: </::before>
    <span>
        <::before/>
        John Doe
        <::after/>
    </span>
</div>
```
However, these pseudoelements are not reachable with JavaScript. While you can reach `div` element via `document.querySelector('div')`, you **cannot** reach `div::before` element via `document.querySelector('div::before')`.

## Solution

To resolve this issue, **pseudo.js** parses the CSS stylesheet of the document and renders pseudoelements as they are real HTML elements. With  **pseudo.js**, the above example's HTML automatically becomes:
```html
<div>
    <div class="before">Name: </div>
    <span>
        <div class="before"/>
        John Doe
        <div class="after"/>
    </span>
</div>
```
Now, you can reach pseudoelements via following selectors:
| Pseudoelement | Selector |
|--|--|
|  `'div::before'` | `'div > .before'` |
|  `'span::before'` | `'span > .before'` |
|  `'span::after'` | `'span > .after'` |

Also, this plugin appends the following style rules to the `head` tag, while removing `::before` and `::after` related rules from the original stylesheet. With or  without the plugin, the document should look the same.
```html
<style>
    div > .before { background: red; }
    span > .before, span > .after{ background: blue; }
</style>
```
## Example
[This pen](https://codepen.io/onurkerimov/pen/dKNgZY)

## Usage
Simply add `<script src="js/pseudo.js"></script>` to your HTML. When running locally, set up a local host, since this plugin uses `document.styleSheets[i].cssRules` to parse the CSS stylesheet. This variable does not work with a `file:///` request. A `http://` request should be used.


## Browser Compatibility

Works like a charm on Firefox, Chrome, Safari, Opera and Edge. For Internet Explorer 11, there is a version named `pseudo-ie11.js`.

## License

Licensed under the MIT license.