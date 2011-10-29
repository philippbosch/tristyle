BACKEND_URL = "data.json"

document.addEventListener 'touchmove', (event) ->
    event.preventDefault()
    window.scroll 0,0
    return false

$.getJSON BACKEND_URL, (data) ->
    for flap in ['top', 'middle', 'bottom']
        do (flap) ->
            slides = []
            
            for p in data.products[flap]
                slides.push """<div class="product" data-price="#{p.price}"><img src="#{p.image}" alt="#{p.name}" class="photo" /></div>"""
            
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
                
                $priceTag.anim scale: 0, opacity: 0, .2, 'linear', ->
                    $priceTag.find('.value').text $activeProduct.data 'price'
                    $priceTag.anim scale: 1, opacity: 1, .5, 'cubic-bezier(.17,.67,.24,1)'
                    
                    # cubic-bezier(.17,.67,.24,2) would be nicer but does not work correctly
                    # on mobile safari (https://bugs.webkit.org/show_bug.cgi?id=45761)
                
                for i in [0..2]
                    upcoming = carousel.masterPages[i].dataset.upcomingPageIndex
                    
                    if upcoming != carousel.masterPages[i].dataset.pageIndex
                        el = carousel.masterPages[i].querySelector 'span'
                        el.innerHTML = slides[upcoming]
            
            carousel.__flip()