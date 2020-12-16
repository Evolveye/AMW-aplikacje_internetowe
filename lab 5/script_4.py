import requests
from bs4 import BeautifulSoup



def script( soup ):
    selector = input( "Podaj selektor CSS, który posłuży do wybrania elementów ze strony: " )

    elements = soup.select( selector )
    print( "Liczba znalezionych elementów: ", len( elements ) )

    if len( elements ) == 0:
        return

    print( "Pierwszy znaleziony element: ", elements[ 0 ] )


    print( "" )
    print( "Menu skryptu:" )
    print( " [1] Wyświetl wszystkie elementy" )
    print( "  - - -" )
    print( " [2] Wybierz wszystkie elementy i wykonaj akcję..." )
    print( " [3] Wybierz konkretny element i wykonaj akcję..." )
    print( "  - - -" )
    print( "  - Inna wartość spowoduje zamknięcie menu" )
    print( "  - - -" )
    print( "" )

    choose = input( "Wprowadź pozycję z menu i zatwierdź enterem: " )

    if choose == "1":
        for element in elements:
            print( element )

    elif choose == "2" or choose == "3":
        if choose == "3":
            index = input( "Podaj indeks elementu do wybrania: " )
            elements = [ elements[ int( index ) ] ]

        print( "Menu skryptu -- co chcesz zrobić z wybranymi elementami:" )
        print( " [1] Podaj atrybuty do wydobycia z elementów" )
        print( " [2] Wyświetl zawartość tekstową elementów" )

        if choose == "3": print( " [3] Przeszukaj w głąb (wywołaj skrypt rekurencyjnie)" )

        print( "  - - -" )
        print( "  - Inna wartość spowoduje zamknięcie menu" )
        print( "  - - -" )

        action = input( "Wprowadź pozycję z menu i zatwierdź enterem: " )

        if action == "1":
            attributes = input( "Wprowadź atrybuty do wydobycia, kolejne oddzielaj spacją: " )

            for i, element in enumerate( elements ):
                extracted_attributes = {}

                for attr in attributes.split( " " ):
                    extracted_attributes[ attr ] = element.get( attr.strip() if attr else "" )

                print( f" [{i}] ", selector, " -> ", extracted_attributes )

        elif action == "2":
            for i, element in enumerate( elements ):
                print( f" [{i}] ", selector, " -> ", element.text )

        elif action == "3" and choose == "3":
            script( elements[ 0 ] )