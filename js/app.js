let allPokemon = [];
let tableauFin = [];
const listPoke = document.querySelector('.liste-poke')
const searchInput = document.querySelector('.recherche-poke input');
const form = document.querySelector('.recherche-input button')


//On va fetch les api pokemon
function fetchPokemon(){
    fetch('https://pokeapi.co/api/v2/pokemon?limit=200{id or name}/')
    .then(response => response.json())
    .then((allPoke) => {
        // console.log(allPoke);

        //On sélection chaque élement du tableau pokemon aura fetchPokemonAll
        //On lui passe la valeur courante
        allPoke.results.forEach((pokemon) => {
            fetchPokemonAll(pokemon)
        });
    })
}

fetchPokemon();

function fetchPokemonAll(pokemon) {
    let objPokemon = {} // Créer un objet vide pour y mettre chaque élément sélectionné
    let url = pokemon.url // on choppe l'url de la valeur pokemon
    let namePoke = pokemon.name // on choppe le nom de l'objet pokemon 


    //Avec l'API on cature les données, de l'url
    fetch(url)
    .then(response => response.json())
    .then((pokeData) => {
        //METTRE la phot dans l'objet objPokemon
        objPokemon.pic = pokeData.sprites.front_default;

        //ON va récuperer son type
        objPokemon.type = pokeData.types[0].type.name;
        objPokemon.id = pokeData.id; //Chopper l'id



        fetch(`https://pokeapi.co/api/v2/pokemon-species/${namePoke}/`)
        .then(response => response.json())
        .then((pokeData) => {
           objPokemon.name = pokeData.names[4].name;
           allPokemon.push(objPokemon); //Pousser l'objet créer dans notre tableau

           if(allPokemon.length === 200) {
           
            //On va trier le tableau avec la méthode sort
            //Soit v positive, soit egale, soit inférieur
            tableauFin = allPokemon.sort((a, b) => {

                return a.id - b.id;
            }).slice(0, 21); //ON découpe le tableau de 0-21 avec slice
            createCard(tableauFin);
           }
        })
    })
}


//Créer les cartes

function createCard(arr) {
        for(let i = 0; i < arr.length; i++){

            //On crée un element li
            const carts = document.createElement('li');
            // on va chercher le couleur spécifique à types pour la rendre en Background
            //Ici c'est comme si l'on faisait types[fire]
            let color = arr[i].type;
            //On définit le background de la list et on mets la couleur
            // carts.style.background = 'black';
            //On crée le text
            const txtCart = document.createElement('h5');
            txtCart.innerText = arr[i].name;
            const idCart = document.createElement('p');
            idCart.innerText = `Number # ${arr[i].id}`;
            const imgCart = document.createElement('img')
            imgCart.src = arr[i].pic


            //On append tous nos éléments dans la list LI
            carts.appendChild(imgCart);
            carts.appendChild(txtCart);
            carts.appendChild(idCart);
            
            //On append tous nos éléments dans le UL
            listPoke.appendChild(carts);
            

        }
}
//Scroll infinie

window.addEventListener('scroll', ()=>{

const{scrollTop, scrollHeight, clientHeight} = document.documentElement;

//ScollTop : Scroll depuis top
//ScollHeight scroll total
//ClientHeight : taille de la fenetre

if(clientHeight + scrollTop >= scrollHeight - 20) {
    addPoke(6)
}

})

let index = 21; 

function addPoke(nb) {

    if(index > 200) {
        return
    }
    const arrToAdd = allPokemon.slice(index, index + nb)
    createCard(arrToAdd);
    index += nb;
}


//Recherche
searchInput.addEventListener('keyup', recherche);

function recherche() {
    if(index < 200){
        addPoke(180)
    }

    let filter, allLi, titleValue, allTitles;
    filter = searchInput.value.toUpperCase(); //La valeur de l'input sera toujour en capital
    allLi = document.querySelectorAll('li'); //Selection de tous les li
    allTitles = document.querySelectorAll('li > h5'); //Tous les h5 qui sont dans li

    for (i=0; i < allLi.length; i++) {
        titleValue = allTitles[i].innerText;
        
        //On fait la fonction indexOf, celle-ci renvoi les éléments similaire en terme de nombre
        //Si le nombre est plus de -1 c'est qu'il apparait sur la liste, sinon on le fait display none
        //J'ai inséré filter dans le indexOf(), car c'est la valeur de l'input récupéré et transformé en capital

        if(titleValue.toUpperCase().indexOf(filter) > -1) {
            allLi[i].style.display = 'flex';
        } else {
            allLi[i].style.display = 'none';
            
        }

    }
    
}

// input animation

searchInput.addEventListener('input', function(e){

if(e.target.value !== "") {
    e.target.parentNode.classList.add('active-input')
}

})