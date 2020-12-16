import requests
from bs4 import BeautifulSoup



def script( soup ):
    extracted_items = []
    items = soup.select( ".article_main" )

    print( "Liczba elementów: ", len( items ) )

    for item in items:
        title = item.select( "h1" )[ 0 ].text
        date = item.select( ".meta" )[ 0 ].text

        print( { "date":date.strip(), "title":title.strip() } )