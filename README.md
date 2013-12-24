# pnglink

**pnglink** allows dynamic content, created by libraries like [D3.js](http://d3js.org/), to be downloaded as a PNG snapshot with a single click. 

I love using D3.js to code up amazing, auto-updating visualizations of my data. There's only one problem. Users always seem to want a download button to a regular, old image format they can paste into a report. I thought of explaining that images like PNGs were static and our content was dynamic. I almost encouraged them to just take a screenshot and crop it.

I like a challenge though.

And so this is the collection of unappreciatedly elaborate hacks I've been using to achieve what most users assume should be simple, now tied up in a neat, jQuery plugin bow.

## Simple Usage

pnglink has two dependencies. jQuery, obviously, and canvg.js, both of which you should include before pnglink. 

```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
<script src="js/canvg.js"></script> <!-- Download @ https://code.google.com/p/canvg/downloads/list -->
<script src="js/jquery.pnglink.js"></script>
```

Then you'll need a container for your visualization, which you'll likely already have if you're using D3.js.

```html
<div id="visualization_container"></div>
```

**IMPORTANT STYLING NOTE**: Since we'll be taking a snapshot of the SVG, any styling applied to objects within the SVG from outside of it (e.g. from an included stylesheet or external style tag) will not be applied to the generated PNG. That means you'll want to style your visualizations explicitly from within the SVG. Below is an example with D3.js.

This is good and will work:

```javascript
var text = vis.selectAll("text")
	    .data(d3.range(n))
	  .enter().append("svg:text")
	    .attr("font-weight","bold")
	    .attr("font-size",16)
	    .attr("fill","#333")
	    .text(function(d, i) { return labels[i]; });
```

This is bad and will fail:

```html
<style>
text {
  font-weight: bold;
  font-size: 16;
  fill: #333;
}
</style>
```

And then to download a PNG file when you click on a visualization, you just need one line:

```javascript
$('#visualization_container').pnglink();
```

That's it! One serious limitation of the "simple usage" though, is you can't specify a filename and each browser will handle that situation differently (e.g. Chrome just downloads a file called "download" with no extension and Firefox shows the user a scary-looking preview of the file contents as text). A solution may soon be on the horizon with the HTML5 download attribute, but [support right now is incredibly spotty](http://caniuse.com/#feat=download).

For a 100% optimal solution, see the advanced usage below.

## Advanced Usage

### Specify a filename

In order to specify a filename, we have to take things server-side unfortunately. You'll need to create an action on the server that you can submit a form to.

In Ruby on Rails, that action will look like this:

```ruby
send_data Base64.decode64(params[:png]), type: 'image/png', disposition: 'attachment', filename: params[:filename]
```

In PHP, it'll look like this:

```php
header('Content-type: image/png');
header('Content-Disposition: attachment; filename="' . $_POST['filename'] . '"');
$file = base64_decode(str_replace(' ', '+', $_POST['png']));
echo $file;
```

(I'd be happy to include other languages/frameworks if someone wants to submit a pull request.)

Now when you call pnglink, you can specify the filename and action with something like this:

```javascript
var filename = $('#visualization_container').attr('pngname');
$('#visualization_container').pnglink({
  action: 'http://yoursite.com/download-png', // or 'http://yoursite.com/download-png.php'
  filename: filename
});
```

### Make clicking on a separate element trigger the image download

If you need users to be able to interact with your visualizations through clicks, you'll probably want a separate "Download as PNG" button elsewhere on your page. Not a problem.

```javascript
$('#visualization_container').pnglink({
  target: '#my_download_button'
});
```

### Change the hover tooltip instructions

If you don't like the default tooltip instructions ("Click to download as PNG"), you can change it to whatever you want. It should be noted though that this option only takes effect when not specifying a separate target.

```javascript
$('#visualization_container').pnglink({
  instructions: 'Click on the chart to download a copy'
});
```
