import requests
from bs4 import BeautifulSoup



def script( soup ):
    images = soup.select( "img" )
    print( "Liczba obrazków: ", len( images ) )

    for image in images:
        alt = image.get( "alt" )
        alt = alt.strip() if alt is not None else ""

        src = image.get( "src" )
        src = src.strip() if src is not None else ""

        print( { "alt":alt, "src":src } )