BACKEND_URL = "/data.json"

document.addEventListener 'touchmove', (event) ->
    event.preventDefault()
    window.scroll 0,0
    return false

$.getJSON BACKEND_URL, (data) ->
    for flap in ['top', 'middle', 'bottom']
        do (flap) ->
            slides = []
            
            for p in data.products[flap]
                slides.push """<img src="#{p.image}" alt="#{p.name}" />"""
            
            carousel = new SwipeView '#' + flap, 
                numberOfPages: slides.length
                hastyPageFlip: true
            
            for i in [0..2]
                page = if i==0 then slides.length-1 else i-1
                el = document.createElement 'span'
                el.innerHTML = slides[page]
                carousel.masterPages[i].appendChild el
            
            carousel.onFlip ->
                for i in [0..2]
                    upcoming = carousel.masterPages[i].dataset.upcomingPageIndex
                
                    if upcoming != carousel.masterPages[i].dataset.pageIndex
                        el = carousel.masterPages[i].querySelector 'span'
                        el.innerHTML = slides[upcoming]
