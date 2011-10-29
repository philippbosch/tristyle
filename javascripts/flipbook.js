(function() {
  var BACKEND_URL;
  BACKEND_URL = "data.json";
  document.addEventListener('touchmove', function(event) {
    event.preventDefault();
    window.scroll(0, 0);
    return false;
  });
  $.getJSON(BACKEND_URL, function(data) {
    var flap, _i, _len, _ref, _results;
    _ref = ['top', 'middle', 'bottom'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      flap = _ref[_i];
      _results.push((function(flap) {
        var carousel, el, i, p, page, slides, _j, _len2, _ref2;
        slides = [];
        _ref2 = data.products[flap];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          p = _ref2[_j];
          slides.push("<div class=\"product\" data-price=\"" + p.price + "\"><img src=\"" + p.image + "\" alt=\"" + p.name + "\" /></div>");
        }
        carousel = new SwipeView('#' + flap, {
          numberOfPages: slides.length,
          hastyPageFlip: true
        });
        for (i = 0; i <= 2; i++) {
          page = i === 0 ? slides.length - 1 : i - 1;
          el = document.createElement('span');
          el.innerHTML = slides[page];
          carousel.masterPages[i].appendChild(el);
        }
        carousel.onFlip(function() {
          var $activeProduct, $priceTag, i, upcoming, _results2;
          $activeProduct = $('.swipeview-active .product', this);
          $priceTag = $('.price .value', this);
          $priceTag.text($activeProduct.data('price'));
          _results2 = [];
          for (i = 0; i <= 2; i++) {
            upcoming = carousel.masterPages[i].dataset.upcomingPageIndex;
            _results2.push(upcoming !== carousel.masterPages[i].dataset.pageIndex ? (el = carousel.masterPages[i].querySelector('span'), el.innerHTML = slides[upcoming]) : void 0);
          }
          return _results2;
        });
        return carousel.__flip();
      })(flap));
    }
    return _results;
  });
}).call(this);
