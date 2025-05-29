const API_KEY = "ca5f2915d47a49ca9843722b14036a72"
const form = document.getElementById("game-form");
const list = document.getElementById("game-list");
const searchInput = document.getElementById("search-input");
const checkboxResult = document.getElementById("checkbox-result");
const rating = document.getElementById("rating");
const review = document.getElementById("review");



const url = `https://api.rawg.io/api/games?key=${API_KEY}&dates=2022-01-01,2024-01-01&ordering=-added`;

console.log(url, "check")

let games = [];
let nextGameListUrl = null;

function loadGames(url)
{
  fetch(url)
    .then(response => response.json())
    .then(data=> {
      console.log(data)

    })
}

// Load saved games from localStorage
// onload happens as soon as the object is loaded
window.onload = () => {
  // retrieve games array from local storage
  const savedGames = localStorage.getItem("games");
  loadGames(url);
  // if the array exists, stringify it
  if (savedGames) {
    games = JSON.parse(savedGames);
    renderGames();
  }
};

document.getElementById("view-list").addEventListener("click", () => {
  document.getElementById("game-list-section").style.display = "block";
  document.getElementById("add-game-section").style.display = "none";
});

// Listen for input events on the search field
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
  // iterate through the games array
  gamesToRender.forEach((game, index) => {
    // create a list element
    const li = document.createElement("li");
    // set the text content of the object
    
  li.innerHTML = `
  <strong>${game.title}</strong> (${game.platform})<br/>
  My Rating: ${game.rating}/5 &#127775<br/>
  My Review: ${game.review} 
  `;

    // create a delete button for each game
    const delButton = document.createElement("button");
    const gamePlatform = document.createElement("li");

    // set text content of button
    delButton.textContent = "Delete";
    delButton.onclick = () => {
      games.splice(index, 1);
      saveGames();
      renderGames();
    };
    // add delete button to li object
    li.appendChild(delButton);
    // add li object to list
    list.appendChild(li);
  });
}
//show the list of games in localStorage, hide the 'add a game' section
document.getElementById("view-list").addEventListener("click", () => {
  document.getElementById("game-list-section").style.display="block";
  document.getElementById("add-game-section").style.display="none";
});

//show the 'add a game' section, hide the list of games in localStorage
document.getElementById("add-game").addEventListener("click", () => {
  document.getElementById("add-game-section").style.display="block";
  document.getElementById("game-list-section").style.display="none";
});
