import requests
from bs4 import BeautifulSoup



def script( soup ):
    print( "Element o ID school:", soup.select( "#school" )[ 0 ].text )
    print( "Pierwszy paragraf na stronie:", soup.select( "p" )[ 0 ].text )