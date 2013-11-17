(function ($, window, document, undefined) {
  var kixxSlides

  $.fn.kixxSlides = kixxSlides = function () {
    var slides = new KixxSlides({$container: this})
    slides.initialize();
    return slides;
  };

  function KixxSlides(opts) {
    this.$container = $(opts.$container[0]);
    this.$current = null;
    this.$slides = this.$container.children();
    this.aspectRatio = opts.aspectRatio || 1.5;
  }

  KixxSlides.fn = KixxSlides.prototype = {
    $container: null,
    $slides: null,
    $current: null,
    aspectRatio: 1.5,

    initialize: function () {
      var width = this.currentWidth()
        , height = Math.floor(width / this.aspectRatio)

      this.$slides.hide();

      this.$container.css({
        position: 'relative'
      , overflow: 'hidden'
      , listStyleType: 'none'
      , padding: 0
      , height: height
      })
    },

    previous: function (opts) {
      opts = opts || {};

      var self = this
        , width = self.currentWidth()
        , inOpts = $.extend({}, opts)
        , outProps = opts.outProps || {left: width + 1}
        , inProps = opts.inProps || {left: 0}
        , complete = refunct(opts, 'complete')
        , $next = this.$previous()
        , hideDone = false
        , showDone = true

      this.containSlide($next.show()).css({
        position: 'absolute'
      , top: 0
      , left: -(width - 1)
      , width: width
      , height: self.currentHeight()
      });

      function maybeComplete(done) {
        if (done.show) {
          showDone = true;
        } else {
          hideDone = true;
        }

        if (hideDone && showDone) {
          self.$current = $next;
          complete();
        }
      }

      opts.complete = function () {
        self.$current.hide();
        maybeComplete({hide: true});
      };

      inOpts.complete = function () {
        maybeComplete({show: true});
      };

      if (this.$current) {
        this.$current.animate(outProps, opts);
      } else {
        maybeComplete({hide: true});
      }

      $next.animate(inProps, inOpts);
    },

    next: function (opts) {
      opts = opts || {};

      var self = this
        , width = self.currentWidth()
        , inOpts = $.extend({}, opts)
        , outProps = opts.outProps || {left: -(width - 1)}
        , inProps = opts.inProps || {left: 0}
        , complete = refunct(opts, 'complete')
        , $next = this.$next()
        , hideDone = false
        , showDone = true

      this.containSlide($next.show()).css({
        position: 'absolute'
      , top: 0
      , left: width + 1
      , width: width
      , height: self.currentHeight()
      });

      function maybeComplete(done) {
        if (done.show) {
          showDone = true;
        } else {
          hideDone = true;
        }

        if (hideDone && showDone) {
          self.$current = $next;
          complete();
        }
      }

      opts.complete = function () {
        self.$current.hide();
        maybeComplete({hide: true});
      };

      inOpts.complete = function () {
        maybeComplete({show: true});
      };

      if (this.$current) {
        this.$current.animate(outProps, opts);
      } else {
        maybeComplete({hide: true});
      }

      $next.animate(inProps, inOpts);
    },

    show: function (id, opts) {
      id = kixxSlides.hashToId(id);
      opts = opts || {};

      var self = this
        , fadeInOpts =  $.extend({}, opts)
        , $next = $('#'+ id)

      opts.complete = function () {
        self.containSlide($next).css({
          position: 'absolute'
        , top: 0
        , left: 0
        , width: self.currentWidth()
        , height: self.currentHeight()
        }).fadeIn(fadeInOpts);

        self.$current = $next;
      };

      if (this.$current) {
        this.$current.fadeOut(opts);
      } else {
        opts.complete();
      }
    },

    $next: function () {
      var i = this.$slides.filter(this.$current).index()
        , next = i + 1

      if (next >= this.$slides.length) return this.$slides.first();
      return $(this.$slides[next]);
    },

    $previous: function () {
      var i = this.$slides.filter(this.$current).index()
        , next = i - 1

      if (next < 0) return this.$slides.last();
      return $(this.$slides[next]);
    },

    currentWidth: function () {
      return this.$container.innerWidth();
    },

    currentHeight: function () {
      return this.$container.innerHeight();
    },

    containSlide: function ($slide) {
      var $inner = $slide.find('img')
        , width = this.currentWidth()
        , height = this.currentHeight()
        , w = +$inner.attr('width')
        , h = +$inner.attr('height')
        , ar = w / h
        , marginLeft = 0
        , marginTop = 0

      if ((w - width) > 0 || (h - height) > 0) {
        if (w/width < h/height) {
          h = height;
          w = h * ar;
        } else {
          w = width;
          h = w / ar;
        }
      }

      if (w < width) {
        marginLeft = (width - w) / 2;
      }
      if (h < height) {
        marginTop = (height - h) / 2;
      }

      $inner.css({
        display: 'block'
      , width: w
      , height: h
      , marginTop: marginTop
      , marginLeft: marginLeft
      })

      return $slide;
    }
  };

  kixxSlides.hashToId = function (str) {
    return str.replace(/^#/, '');
  };

  kixxSlides.noop = function () {};

  function refunct(obj, name) {
    if (arguments.length < 2) {
      return $.isFunction(obj) ? obj : kixxSlides.noop;
    }
    return $.isFunction(obj[name]) ? obj[name] : kixxSlides.noop;
  }

  kixxSlides.KixxSlides = KixxSlides;
  $.kixxSlides = kixxSlides;
}(jQuery, window, document));