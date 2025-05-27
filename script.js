const form = document.getElementById("game-form");
const list = document.getElementById("game-list");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const platform = document.getElementById("platform").value;

    const li = document.createElement("li");
    li.textContent = `${title} (${platform})`;
    list.appendChild(li);

    form.reset();
});