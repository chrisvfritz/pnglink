// pnglink jQuery Plugin
// Copyright (c) 2013 Chris Fritz
// Licensed under The MIT License (MIT)

;(function ( $, window, document, undefined ) {

  var pluginName = 'pnglink',
      defaults = {
        instructions: 'Click to download as PNG',
        target: 'self',
        action: '',
        filename: 'image.png'
      };

  function Plugin ( element, options ) {
    this.element = element;
    this.settings = $.extend( {}, defaults, options );
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {
    init: function () {

      var svgContainer = this.element;
      var settings = this.settings;
      var idNum = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
      var linkId = pluginName+'_link_'+idNum;
      var canvasId = pluginName+'_canvas_'+idNum;
      var beforeCanvas = $(svgContainer);


      // wrap the visualization container with an anchor tag unless a separate target was specified
      if (settings.target == 'self') {
        $(svgContainer).wrap('<a href="javascript:;" id="'+linkId+'" class="download-chart-link" title="'+settings.instructions+'"></a>');
        beforeCanvas = $(svgContainer).parent();
      }

      // create a blank canvas for the latest version of the element to be drawn and captured
      beforeCanvas.after('<canvas id="'+canvasId+'" style="display: none;"></canvas>');
      
      // add a form to submit the image to be downloaded if an action has been specified
      if (settings.action != "") {
        var formId = pluginName+'_form_'+idNum;
        beforeCanvas.after('<form action="'+settings.action+'" method="post" id="'+formId+'" style="display: none;"></form>');
      }

      // set the target to the visualization container or an otherwise specified target
      if (settings.target == 'self') {
        var target = '#'+linkId;
      } else {
        target = settings.target;
      }

      // when the target is clicked on...
      $(target).click(function(){
        // draw the visualization in the canvas
        var canvas = document.getElementById(canvasId);
        canvg(canvas, svgContainer.innerHTML);
        // grab a PNG image from the canvas
        var img = canvas.toDataURL("image/png");
        // download the image the easy, but yucky way, if the user hasn't specified an action
        if (settings.action == "") {
          img = img.replace("image/png", "image/octet-stream");
          console.log(img);
          window.location.href = img;
        // if the user has specified an action though, fill in the form and send it off
        } else {
          img = img.substr(img.indexOf(',') + 1).toString();
          $('<input>').attr({
            type: 'hidden',
            name: 'png',
            value: img
          }).appendTo('#'+formId);
          $('<input>').attr({
            type: 'hidden',
            name: 'filename',
            value: settings.filename
          }).appendTo('#'+formId);
          $('#'+formId).submit();
        }
      });
    }
  };

  $.fn[ pluginName ] = function ( options ) {
    return this.each(function() {
        if ( !$.data( this, "plugin_" + pluginName ) ) {
          $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
        }
    });
  };

})( jQuery, window, document );
