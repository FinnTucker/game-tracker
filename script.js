const form = document.getElementById("game-form");
const list = document.getElementById("game-list");

let games = [];

// Load saved games from localStorage
window.onload = () => {
  const savedGames = localStorage.getItem("games");
  if (savedGames) {
    games = JSON.parse(savedGames);
    renderGames();
  }
};

// Handle form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const platform = document.getElementById("platform").value;

  const game = { title, platform };
  games.push(game);
  saveGames();
  renderGames();
  form.reset();
});

// Save to localStorage
function saveGames() {
  localStorage.setItem("games", JSON.stringify(games));
}

// Display games on the page
function renderGames() {
  list.innerHTML = ""; // clear the list
  games.forEach((game, index) => {
    const li = document.createElement("li");
    li.textContent = `${game.title} (${game.platform})`;

    const delButton = document.createElement("button");
    delButton.textContent = "Delete";
    delButton.onclick = () => {
      games.splice(index, 1);
      saveGames();
      renderGames();
    };

    li.appendChild(delButton);
    list.appendChild(li);
  });
}
