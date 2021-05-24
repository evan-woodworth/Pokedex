# Pokedex

A personalized database of all known pokemon. Keep track of the pokemon that you've caught, and view basic information about all pokemon!

[Poke-track via Heroku](https://poke-track.herokuapp.com/)

[Pokedex Github Repository](https://github.com/evan-woodworth/Pokedex)

## User Stories

As a user, I want to:

- Be able to view a list of all pokemon:
  - In a given game
  - Of a given type
  - In my collection
  - As a whole
- Be able to view details about the base version of a pokemon:
  - Various stats
  - An image of what they look like
  - Starting moves
  - Evolution chain
  - Elemental properties (types)
- Feel like I'm using a pokedex:
  - Relevant graphics
  - Menu system layout
  - Adapted to a webpage layout

## Restful Routing table

 Verb | URL | Action | Description
 ----------- | ----------- | ----------- | -----------
 GET | / | Index (Read) | Main display
 GET | /auth/login | login (Read) | Log in screen
 GET | /auth/signup | signup (Read) | Sign up screen for new account
 GET | /auth/logout | logout (Read) | Log out of current account
 POST | /auth/login | login (Create) | Log in to an existing account
 POST | /auth/signup | signup (Create) | Sign up and log in
 GET | /pokemon | display (Read) | display pokemon information
 GET | /pokemon/collection | display (Read) | display collected pokemon
 GET | /filter/:toggle/:value | display (read) | display filtered pokemon
 GET | /pokemon/:id | display (Read) | display specific pokemon information
 POST | /pokemon/ | Create (Create) | add pokemon to collection by id
 DELETE | /pokemon/ | Delete (Remove) | remove a pokemon from user's collection
 PUT | /pokemon/ | Update (update) | change a user's profile picture to that of the currently viewed pokemon

## Entity Relationship Diagram

![ERD](./img/Pokedex-ERD.jpeg)




