const pokeCards = document.getElementsByClassName("pokeCard")
const gameDivs = document.getElementsByClassName("game")
const typeDivs = document.getElementsByClassName("type")

for (const pokeCard of pokeCards) {
    pokeCard.addEventListener("mouseover", ()=>{
        pokeCard.setAttribute('style', 'background-color: #383838;')
    })
    pokeCard.addEventListener("mouseout", ()=>{
        pokeCard.removeAttribute('style')
    })
}
for (const game of gameDivs) {
    game.addEventListener("mouseover", ()=>{
        game.setAttribute('style', 'background-color: rgb(50, 185, 238);')
    })
    game.addEventListener("mouseout", ()=>{
        game.removeAttribute('style')
    })
}
for (const type of typeDivs) {
    type.addEventListener("mouseover", ()=>{
        type.setAttribute('style', 'background-color: rgb(50, 185, 238);')
    })
    type.addEventListener("mouseout", ()=>{
        type.removeAttribute('style')
    })
}

