# EVENTEES

## AUTHORS

  Sebastian Piaścik
  Sonia Stenzel

## DESCRIPTION

  Web app to manage sport events.
  System enables bringing together people in order to play some sport, 


## REQUIREMENTS

  * baza danych mysql
  * php >=7.1.3
  * composer
  * php artisan
  * npm

## LAUNCHING

  * IN DIRECTORY /API
    $ composer install
    $ php artisan migrate --seed
    $ php -S localhost:8000 -t public

    in another console:
    $ php artisan queue:listen

  * IN DIRECTORY /APP
    $ npm install
    $ npm start
