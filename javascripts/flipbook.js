(function() {
  var BACKEND_URL, DECIMAL_SEPARATOR, priceFormat;
  BACKEND_URL = "data.json";
  DECIMAL_SEPARATOR = '.';
  document.addEventListener('touchmove', function(event) {
    event.preventDefault();
    window.scroll(0, 0);
    return false;
  });
  priceFormat = function(price) {
    var maj, min;
    price = parseFloat(price);
    price = Math.round(price * 100) / 100;
    maj = Math.floor(price);
    min = String(Math.round((price - maj) * 100));
    if (min.length === 1) {
      min = min + "0";
    }
    return "" + maj + DECIMAL_SEPARATOR + min;
  };
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
          slides.push("<div class=\"product\" data-price=\"" + p.price + "\">\n    <img src=\"" + p.image + "\" alt=\"" + p.name + "\" class=\"photo\" />\n</div>");
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
          var $activeProduct, $priceTag, $total, currentPrice, currentTotal, i, upcoming, _results2;
          $activeProduct = $('.swipeview-active .product', this);
          $priceTag = $('.price', this);
          $total = $('#total');
          currentPrice = parseFloat($priceTag.find('.value').text().replace(',', '.'));
          currentTotal = parseFloat($total.find('.value').text().replace(',', '.'));
          $priceTag.anim({
            scale: 0,
            opacity: 0
          }, (currentPrice ? .2 : 0), 'linear', function() {
            $priceTag.find('.value').text(priceFormat($activeProduct.data('price')));
            return $priceTag.anim({
              scale: 1,
              opacity: 1
            }, (currentPrice ? .5 : 0), 'cubic-bezier(.17,.67,.24,1)');
          });
          setTimeout(function() {
            var newTotal, p, prices, _k, _len3;
            prices = $('.flap .price .value').pluck('innerHTML');
            newTotal = 0.0;
            for (_k = 0, _len3 = prices.length; _k < _len3; _k++) {
              p = prices[_k];
              newTotal += parseFloat(p);
            }
            if (newTotal !== currentTotal) {
              return $total.find('.value').text(priceFormat(newTotal));
            }
          }, 250);
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
