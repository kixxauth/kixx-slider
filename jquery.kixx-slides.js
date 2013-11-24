(function ($, window, document, undefined) {
  var kixxSlides

  $.fn.kixxSlides = kixxSlides = function (opts) {
    opts = opts || {};
    opts.$container = this;

    var slides = new KixxSlides(opts)
    slides.initialize(opts);

    return slides;
  };

  function KixxSlides(opts) {
    this.$container = $(opts.$container[0]);
    this.$current = null;
    this.$slides = this.$container.children();
  }

  KixxSlides.fn = KixxSlides.prototype = {
    $container: null,
    $slides: null,
    $current: null,

    initialize: function (opts) {
      var aspectRatio = opts.aspectRatio || 1.5

      this.$slides.hide();

      this.$container.css({
        position: 'relative'
      , overflow: 'hidden'
      , listStyleType: 'none'
      , padding: 0
      , height: Math.floor(this.currentWidth() / aspectRatio)
      })

      if (opts.initial) {
        this.show(opts.initial);
      }
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
        , showDone = false

      if ($next.data('kixxSlidesOpen')) {
        complete(this.$current, this.$current);
        return;
      }

      $next.css({
        position: 'absolute'
      , top: 0
      , left: -(width - 1)
      , width: width
      , height: self.currentHeight()
      , display: 'block'
      });
      this.containSlide($next);

      function maybeComplete(done) {
        if (done.show) {
          showDone = true;
        } else {
          hideDone = true;
        }

        if (hideDone && showDone) {
          var $from = self.$current
          if (self.$current) {
            self.$current.data('kixxSlidesOpen', false);
          }
          $next.data('kixxSlidesOpen', true);
          self.$current = $next;
          complete($from, $next);
        }
      }

      opts.complete = function () {
        self.$current.hide();
        maybeComplete({hide: true});
      };

      inOpts.complete = function () {
        maybeComplete({show: true});
      };

      this.$current.animate(outProps, opts);
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
        , showDone = false

      if ($next.data('kixxSlidesOpen')) {
        complete(this.$current, this.$current);
        return;
      }

      $next.css({
        position: 'absolute'
      , top: 0
      , left: width + 1
      , width: width
      , height: self.currentHeight()
      , display: 'block'
      });
      this.containSlide($next);

      function maybeComplete(done) {
        if (done.show) {
          showDone = true;
        } else {
          hideDone = true;
        }

        if (hideDone && showDone) {
          var $from = self.$current
          self.$current.data('kixxSlidesOpen', false);
          $next.data('kixxSlidesOpen', true);
          self.$current = $next;
          complete($from, $next);
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
        , complete = refunct(opts, 'complete')

      if ($next.data('kixxSlidesOpen')) {
        complete(this.$current, this.$current);
        return;
      }

      opts.complete = function () {
        $next.css({
          position: 'absolute'
        , top: 0
        , left: 0
        , width: self.currentWidth()
        , height: self.currentHeight()
        }).fadeIn(fadeInOpts);

        self.containSlide($next)

        if (self.$current) {
          self.$current.data('kixxSlidesOpen', false);
        }
        $next.data('kixxSlidesOpen', true);
        var $from = self.$current
        self.$current = $next;
        complete($from, $next);
      };

      if (this.$current) {
        this.$current.fadeOut(opts);
      } else {
        opts.complete();
      }
    },

    destroy: function () {
      if(this.$current) {
        this.$current.hide().data('kixxSlidesOpen', false);
        this.$current = null;
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
        , usedHeight = 0
        , h = +$inner.outerHeight(true)
        , w = +$inner.outerWidth(true)
        , ar = w / h
        , marginLeft = 0
        , marginTop = 0
      if ($inner.data('kixxSlidesContainerWidth') == width || $inner.data('kixxSlidesContainerHeight') == height) {
        return $slide;
      }
      $inner.data('kixxSlidesContainerWidth', width);
      $inner.data('kixxSlidesContainerHeight', height);

      $inner.siblings().each(function () {
        usedHeight += $(this).outerHeight(true);
      });

      height = height - usedHeight;

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