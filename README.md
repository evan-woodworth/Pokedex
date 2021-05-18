# Pokedex

A personalized database of all known pokemon.


## User Stories

As a user, I want to:

- Be able to view a list of all pokemon:
  - In a given region
  - In a given game
  - As a whole
- Be able to keep track of the pokemon that I have caught:
  - In a given region
  - In a given game
  - As a whole
- Be able to keep track of badges that I have earned:
  - In a given game
  - As a whole
- Be able to view details about the base version of a pokemon:
  - Various stats
  - An image of what they look like
  - Starting moves
  - Evolution chain
  - Elemental properties, strengths and weaknesses
- Be able to view information:
  - Moves that pokemon can make
  - Berries
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
 POST | /pokemon/collection/:id | Create (Create) | add pokemon to collection by id
 GET | /pokemon/:id | display (Read) | display specific pokemon information
 GET | /region | display (Read) | display region information
 GET | /region/:name | display (Read) | display specific region information
 GET | /move | display (Read) | display move information
 GET | /move/:name | display (Read) | display specific move information
 GET | /game | display (Read) | display game information
 GET | /game/:name | display (Read) | display specific game information


