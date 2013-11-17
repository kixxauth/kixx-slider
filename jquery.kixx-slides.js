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

    previous: function () {
    },

    next: function () {
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

      console.log('AR', ar)
      if ((w - width) > 0 || (h - height) > 0) {
        if (w/width < h/height) {
          console.log('match height', height, h)
          h = height;
          w = h * ar;
          console.log('width', w)
        } else {
          console.log('match width', width, w)
          w = width;
          h = w / ar;
          console.log('height', h)
        }
      }

      if (w < width) {
        marginLeft = (width - w) / 2;
      }
      if (h < height) {
        marginTop = (height - h) / 2;
      }

      console.log($inner.length)
      console.log({
        display: 'block'
      , width: w
      , height: h
      , marginTop: marginTop
      , marginLeft: marginLeft
      })

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

  function refunct(obj, name) {
    if (arguments.length < 2) {
      return $.isFunction(obj) ? obj : kixxModal.noop;
    }
    return $.isFunction(obj[name]) ? obj[name] : kixxModal.noop;
  }

  kixxSlides.KixxSlides = KixxSlides;
  $.kixxSlides = kixxSlides;
}(jQuery, window, document));