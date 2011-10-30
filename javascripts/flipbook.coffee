BACKEND_URL = "data.json"
DECIMAL_SEPARATOR = '.'

document.addEventListener 'touchmove', (event) ->
    event.preventDefault()
    window.scroll 0,0
    return false

priceFormat = (price) ->
    price = parseFloat price
    price = Math.round(price*100)/100
    maj = Math.floor(price)
    min = String(Math.round((price-maj)*100))
    min = min + "0" if min.length is 1
    return "#{maj}#{DECIMAL_SEPARATOR}#{min}"

$.getJSON BACKEND_URL, (data) ->
    for flap in ['top', 'middle', 'bottom']
        do (flap) ->
            slides = []
            
            for p in data.products[flap]
                slides.push """
                    <div class="product" data-price="#{p.price}">
                        <img src="#{p.image}" alt="#{p.name}" class="photo" />
                    </div>
                """
            
            carousel = new SwipeView '#' + flap, 
                numberOfPages: slides.length
                hastyPageFlip: true
            
            for i in [0..2]
                page = if i==0 then slides.length-1 else i-1
                el = document.createElement 'span'
                el.innerHTML = slides[page]
                carousel.masterPages[i].appendChild el
            
            carousel.onFlip ->
                $activeProduct = $ '.swipeview-active .product', this
                $priceTag = $ '.price', this
                $total = $ '#total'
                currentPrice = parseFloat($priceTag.find('.value').text().replace ',','.')
                currentTotal = parseFloat($total.find('.value').text().replace ',','.')
                
                $priceTag.anim scale: 0, opacity: 0, (if currentPrice then .2 else 0), 'linear', ->
                    $priceTag.find('.value').text priceFormat($activeProduct.data 'price')
                    $priceTag.anim scale: 1, opacity: 1, (if currentPrice then .5 else 0), 'cubic-bezier(.17,.67,.24,1)'
                    
                    # cubic-bezier(.17,.67,.24,2) would be nicer but does not work correctly
                    # on mobile safari (https://bugs.webkit.org/show_bug.cgi?id=45761)
                
                setTimeout ->
                    prices = $('.flap .price .value').pluck 'innerHTML'
                    newTotal = 0.0
                    newTotal += parseFloat(p) for p in prices
                    if newTotal != currentTotal
                        $total.find('.value').text priceFormat(newTotal)
                , 250
                
                for i in [0..2]
                    upcoming = carousel.masterPages[i].dataset.upcomingPageIndex
                    
                    if upcoming != carousel.masterPages[i].dataset.pageIndex
                        el = carousel.masterPages[i].querySelector 'span'
                        el.innerHTML = slides[upcoming]
            
            carousel.__flip()