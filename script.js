const API_KEY = "ca5f2915d47a49ca9843722b14036a72"
const form = document.getElementById("game-form");
const list = document.getElementById("game-list");
const searchInput = document.getElementById("search-input");
const checkboxResult = document.getElementById("checkbox-result");
const rating = document.getElementById("rating");
const review = document.getElementById("review");
const gameSearch = document.getElementById("game-search")

let games = [];
let nextGameListUrl = null;

// Load saved games from localStorage
// onload happens as soon as the object is loaded
window.onload = () => {
  // retrieve games array from local storage
  const savedGames = localStorage.getItem("games");
  // if the array exists, stringify it
  if (savedGames) {
    games = JSON.parse(savedGames);
    renderGames();
  }
};

function loadGames(url) {
  fetch(url)
    .then(response => response.json())
    .then(data=> {
      const results = data.results;
      results.forEach(game => {
        console.log(game.name);
        console.log(game.background_image);
      });

    })
    .catch(error => {
      console.error("Error fetching data:", error);
});
};

// Listen for input events on the search field in 'view-games'
searchInput.addEventListener("input", (e) => {
  // Get the current input value, trim whitespace, and convert to lowercase
  const query = e.target.value.trim().toLowerCase();
  console.log("Query:", query); // Log the search query for debugging

  // Filter the games list based on whether the title or platform includes the query
  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(query) ||     // Match title
    game.platform.toLowerCase().includes(query)     // Match platform
  );
  console.log("Filtered games:", filteredGames); // Log the filtered results

  // Re-render the list using the filtered games
  renderGames(filteredGames);
});

// display rawg api search results
document.getElementById("rawg-api-search").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("game-search").value.trim();
  // const platform = document.getElementById("platforms").value;
  const url = buildApiUrl(title);

  // fetch data from the API
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log("results from RAWG:", data.results);
      const resultsContainer = document.getElementById("search-results");
      resultsContainer.innerHTML="";

      data.results.forEach((game) => {
      const gameDiv = createGameResultElement(game);
      resultsContainer.appendChild(gameDiv);
      console.log(gameDiv)
    });
    })
    .catch(err => console.error("Error fetching from RAWG API:", err));
});

function buildApiUrl(title) {
  const url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(title)}`;
  console.log("API URL: ", url);
  return url;
};

function createGameResultElement(game) {
  const gameDiv = document.createElement("div");
  gameDiv.className = "game-result";
  //map game genre results to array genreList
  const genreList = game.genres
    ? game.genres.map(g => g.name) 
    : [];
  console.log(genreList)
  //map game parent platform results to array platformList
  const platformList = game.parent_platforms
    ? game.parent_platforms.map(p => p.platform.name)
    : [];

    gameDiv.innerHTML=`
    <h3>${game.name}</h3>
    <img src="${game.background_image}" alt="${game.name} cover" width="300"/>
    <p>Released: ${game.released || "N/A"}</p>
    <p>Metacritic: ${game.metacritic !== null ? game.metacritic : "N/A"}</p>
    <p>Platforms: ${platformList.join(", ")}</p>
    <p>Genres: ${genreList.join(", ")}</p>
    <button class="add-from-api">Add to My List</button>
    `
    const button = gameDiv.querySelector(".add-from-api");
    button.setAttribute("data-title", game.name);
    button.setAttribute("data-img", game.background_image);
    button.setAttribute("data-platform", JSON.stringify(platformList));
    button.setAttribute("data-metacritic", game.metacritic !== null ? game.metacritic : "N/A");
    button.setAttribute("data-genre", JSON.stringify(genreList));
  
  return gameDiv;
};

//TODO render results from API query search
function renderSearchResults(results) {

};

function createNewGameObject(title, background_image, platform, metacritic, genre) {
  const newGame = {
    title,
    background_image,
    platform: platform.join(", "),
    metacritic: metacritic,
    rating: "Not rated yet",
    review: "Not reviewed yet",
    genre: genre.join(", ")
  };
  return newGame;
};

//add item from api search to user list
document.getElementById("search-results").addEventListener("click", (e) => {
  // if the event target classlist is the add-from-api button
  if (e.target.classList.contains("add-from-api")) {
    // set attributes
    const title = e.target.dataset.title;
    const platform = JSON.parse(e.target.dataset.platform);
    const metacritic = e.target.dataset.metacritic;
    const background_image = e.target.dataset.img;
    const genre = JSON.parse(e.target.dataset.genre);
    //create new game object
    const newGame = createNewGameObject(title, background_image, platform, metacritic, genre);
    console.log(newGame);

    games.push(newGame);
    saveGames();
    renderGames();

    alert(`"${title}" was added to your list.`)
  }
});

// Save to localStorage
function saveGames() {
  localStorage.setItem("games", JSON.stringify(games));
};

function createGameListItem(game) {
  const li = document.createElement("li");
  li.innerHTML = `
  <strong>${game.title}</strong> (${game.platform})<br/>
  ${game.background_image ? `<img src="${game.background_image}" alt="${game.title} cover" width="300"/>` : ""}<br/>
  My Rating: ${game.rating}/5 &#127775<br/>
  My Review: ${game.review} <br/>
  Metascore: ${game.metacritic} <br/>
  Genres: ${game.genre || "N/A"} <br/>
  `;
  return li;
};

// Display user games list
function renderGames(gamesToRender = games) {
  list.innerHTML='';
  gamesToRender.forEach((game, index) => {
    const li = createGameListItem(game);
    bindDeleteButton(li, index);
    bindDetailsButton(li, game);
    list.appendChild(li);
  }); 
};


// creates a 'delete' button element
function createDelButton() {
  // create a delete button for game elements in the list
    const delButton = document.createElement("button");
    // set text content of button
    delButton.textContent = "Delete";
    delButton.classList.add("remove-button");
    return delButton;
};

function bindDeleteButton(li, index) {
  // create a delete button for each game
  const delButton = createDelButton();
  delButton.onclick = () => {
    games.splice(index, 1);
    saveGames();
    renderGames();
  };
  // add delete button to li object
  li.appendChild(delButton);
};

function createdetailsButton() {
 const detailsButton = document.createElement("button");   
 detailsButton.textContent= "Details";
 detailsButton.classList.add("details-button");
 return detailsButton;
};

// this function has too many responsibilities, needs refactoring
function bindDetailsButton(li, game) {
  // create details button
  const detailsButton = createdetailsButton();
  // get span element (close button)
  const span = document.getElementsByClassName("close")[0];
  // when details button clicked, populate modal elements with text content
  detailsButton.onclick = function() {
    const modal = createModal(game);
    modal.style.display="block";
    span.onclick = function() {
      modal.style.display="none";
    };
  };
    li.appendChild(detailsButton);
};

function createModal(game) {
  const modal = document.getElementById("details-modal");
  document.getElementById("modal-title").textContent=game.title;
  document.getElementById("modal-platform").textContent=game.platform;
  document.getElementById("modal-metascore").textContent=game.metacritic;
  const modalImage = document.getElementById("modal-image");
  if (game.background_image) {
    modalImage.src = game.background_image;
    modalImage.alt = `${game.title} cover`;
    modalImage.style.display="block";
  } else {
    modalImage.style.display="none";
  }
  return modal;
};

//show the list of games in localStorage, hide the 'add a game' section
document.getElementById("view-list").addEventListener("click", () => {
  document.getElementById("game-list-section").style.display="block";
  document.getElementById("query-database").style.display="none";
});

//show the 'query RAWG database' section, hide the other sections
document.getElementById("add-game-from-API").addEventListener("click", () => {
  document.getElementById("game-list-section").style.display="none";
  document.getElementById("query-database").style.display="block";
});