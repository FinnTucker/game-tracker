const form = document.getElementById("game-form");
const list = document.getElementById("game-list");
const searchInput = document.getElementById("search-input");

let games = [];

// Load saved games from localStorage
window.onload = () => {
  const savedGames = localStorage.getItem("games");
  if (savedGames) {
    games = JSON.parse(savedGames);
    renderGames();
  }
};

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
  const game = { title, platform }; // (Not a tuple — this is an object)

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
  list.innerHTML = ""; // clear the list
  // iterate through the games array
  gamesToRender.forEach((game, index) => {
    // create a list element
    const li = document.createElement("li");
    // set the text content of the object
    li.textContent = `${game.title} (${game.platform})`;

    // create a delete button for each game
    const delButton = document.createElement("button");
    // set text content of button
    delButton.textContent = "Delete";
    delButton.onclick = () => {
      const gameIndex = games.findIndex(g => g.title === game.title && g.platform === game.platform);
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
