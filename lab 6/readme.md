# Lab 6

Link: [ai-21717-185ic.herokuapp.com](https://ai-21717-185ic.herokuapp.com/)
    
  - **[/api/v1/](https://ai-21717-185ic.herokuapp.com/api/v1/)** tworzenie postów, brak autoryzacji
  - **/api/v1/:id_posta** Szczegóły posta
  - **[/api/v1/users/](https://ai-21717-185ic.herokuapp.com/api/v1/users/)** -- Tworzenie użytkownika; wymagana autoryzacja
  - **/api/v1/users/:id_usera** -- Podgląd użytkownika
  - **[/api/v1/tasks/](https://ai-21717-185ic.herokuapp.com/api/v1/tasks/)** -- Tworzenie zadania; wymagana autoryzacja
  - **/api/v1/tasks/:id_taska** -- Podgląd zadania

Logować można się na konto administratora podając:
  - login: **admin**
  - hasło: **admin**



## Dodatkowo  



Na stronie głównej widoczny jest licznik odwiedzin.
Zliczenie następuje raz dziennie dla danego użytkownika.
Kliknij [tutaj](https://github.com/Evolveye/aplikacje-internetowe-21717-185ic/blob/master/apps/apps/views.py#L6)
aby zobaczyć funkcję odpowiedizalną za widok z liczniekiem odwiedzin