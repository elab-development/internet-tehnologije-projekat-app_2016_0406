# Opis aplikacije
Aplikacija je kreirana za predmet ITEH na FONu. Tema aplikaci je Document Management System. Aplikacija ima sledece funkcionalnosti
1. registracija
2. login
3. Prikaz svih dokumenata
4. Kreiranje dokumenta
5. brisanje dokumenta
6. preuzimanje dokumenta
7. konvertovanje word fajla u pdf
8. pregled svih komentara
9. kreiranje komentara
10. brisanje komentara
11. azuriranje komentara
12. pregled statistika (admin)
13. izmena korisnickih uloga (admin)



# Koriscen softver
1. VS CODE
2. xampp
3. node js
4. laravel

# POKRETANJE APLIKACIJE 

    cd app
    composer install
    cp .env.example .env
    php artisan key:generate
    php artisan migrate:fresh --seed
    php artisan serve

    cd reactproj
    npm install
    npm start
