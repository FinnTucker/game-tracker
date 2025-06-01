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

function loadGames(url)
{
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
}

document.getElementById("view-list").addEventListener("click", () => {
  document.getElementById("game-list-section").style.display = "block";
  document.getElementById("add-game-section").style.display = "none";
});

// Listen for input events on the search field in 'add-game-section'
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
}

function createGameResultElement(game) {
  const gameDiv = document.createElement("div");
  gameDiv.className = "game-result";

  const platformList = game.parent_platforms
    ? game.parent_platforms.map(p => p.platform.name)
    : [];
    gameDiv.innerHTML=`
    <h3>${game.name}</h3>
    <img src="${game.background_image}" alt="${game.name} cover" width="300"/>
    <p>Released: ${game.released || "N/A"}</p>
    <p>Metacritic: ${game.metacritic !== null ? game.metacritic : "N/A"}</p>
    <p>Platforms: ${platformList.join(", ")}</p>

    <button class='add-from-api'
      data-title='${game.name}'
      data-img="${game.background_image}"
      data-platform='${JSON.stringify(platformList)}'
      data-metacritic="${game.metacritic !== null ? game.metacritic : 'N/A'}"
      >Add to My List</button>
    `;    
  return gameDiv;
}

function renderSearchResults(results) {

}


//add item from api search to user list
document.getElementById("search-results").addEventListener("click", (e) => {
  if (e.target.classList.contains("add-from-api")) {
    const title = e.target.dataset.title;
    const platform = JSON.parse(e.target.dataset.platform);
    const metacritic = e.target.dataset.metacritic;
    const background_image = e.target.dataset.img;

    console.log(title);
    console.log(metacritic);
    console.log(platform)
    console.log(background_image)


    const newGame = {
      title,
      background_image,
      platform: platform.join(", "),
      rating: "Not rated yet",
      review: "Not reviewed yet",
      metacritic: metacritic
    };
    games.push(newGame);
    saveGames();
    renderGames();

    alert(`"${title}" was added to your list.`)
  }
});

// Listen for submit events on the form
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent the form from submitting and reloading the page

  // Get the values input by the user for game title and platform
  const title = document.getElementById("title").value;
  const platform = document.getElementById("platform").value;
  
  // Create a game object using the title and platform
  const game = { 
    title, 
    platform, 
    rating: rating.value,
    review: review.value
  };

  // Add the new game to the games array
  games.push(game);

  // Save the updated games list to localStorage
  saveGames();

  // Render the complete list of games (including the new one)
  renderGames();

  // Clear the input fields in the form
  form.reset();
});

// Save to localStorage
function saveGames() {
  localStorage.setItem("games", JSON.stringify(games));
}

// Display games on the page
function renderGames(gamesToRender = games) {
  list.innerHTML='';
  gamesToRender.forEach((game, index) => {
    const li = createGameListItem(game);
    bindDeleteButton(li, index);
    bindDetailsButton(li, game);
    list.appendChild(li);
  }); 
}

function createGameListItem(game) {
  const li = document.createElement("li");
  li.innerHTML = `
  <strong>${game.title}</strong> (${game.platform})<br/>
  ${game.background_image ? `<img src="${game.background_image}" alt="${game.title} cover" width="300"/>` : ""}<br/>
  My Rating: ${game.rating}/5 &#127775<br/>
  My Review: ${game.review} <br/>
  Metascore: ${game.metacritic} <br/>
  `;
  return li;
}
// creates a 'delete' button element
function createDelButton() {
  // create a delete button for game elements in the list
    const delButton = document.createElement("button");
    // set text content of button
    delButton.textContent = "Delete";
    delButton.classList.add("remove-button");
    return delButton;
}

// binds functionality of delete button to
// delete list item at specified index and reload
// games list
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
}

function createdetailsButton() {
 const detailsButton = document.createElement("button");   
 detailsButton.textContent= "Details";
 detailsButton.classList.add("details-button");
 return detailsButton;
}

function bindDetailsButton(li, game) {
  const detailsButton = createdetailsButton();
  const modal = document.getElementById("edit-modal");
  const span = document.getElementsByClassName("close")[0];
  detailsButton.onclick = function() {
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
  modal.style.display="block";
  }
    span.onclick = function() {
    modal.style.display="none";
  }
    li.appendChild(detailsButton)
}

//show the list of games in localStorage, hide the 'add a game' section
document.getElementById("view-list").addEventListener("click", () => {
  document.getElementById("game-list-section").style.display="block";
  document.getElementById("add-game-section").style.display="none";
  document.getElementById("query-database").style.display="none";
});

//show the 'add a game' section, hide the list of games in localStorage
document.getElementById("add-game").addEventListener("click", () => {
  document.getElementById("add-game-section").style.display="block";
  document.getElementById("game-list-section").style.display="none";
  document.getElementById("query-database").style.display="none";
});

//show the 'query RAWG database' section, hide the other sections
document.getElementById("add-game-from-API").addEventListener("click", () => {
  document.getElementById("add-game-section").style.display="none";
  document.getElementById("game-list-section").style.display="none";
  document.getElementById("query-database").style.display="block";
})