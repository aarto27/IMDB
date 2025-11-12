const API_KEY = "e6a5d8cd";
const detailsDiv = document.getElementById("details");

async function getMovieDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const imdbID = urlParams.get("id");

  if (!imdbID) {
    detailsDiv.innerHTML = "<p>Movie not found.</p>";
    return;
  }

  try {
    const res = await fetch(`https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${API_KEY}`);
    const data = await res.json();

    if (data.Response === "False") {
      detailsDiv.innerHTML = "<p>No details available.</p>";
      return;
    }

    const { Title, Year, Poster, Genre, Actors, Plot, imdbRating, Runtime, totalSeasons, Type } = data;

    detailsDiv.innerHTML = `
      <div class="details-card">
        <img src="${Poster !== "N/A" ? Poster : "https://via.placeholder.com/400x600?text=No+Image"}"
             alt="${Title}" class="details-poster" />
        <div class="details-info">
          <h1 class="details-title">${Title}</h1>
          <p><strong>Type:</strong> ${Type === "series" ? "TV Series" : "Movie"}</p>
          <p><strong>Released:</strong> ${Year}</p>
          <p><strong>Genre:</strong> ${Genre}</p>
          <p><strong>Runtime:</strong> ${Runtime}</p>
          <p><strong>IMDb Rating:</strong> ⭐ ${imdbRating}</p>
          <p><strong>Cast:</strong> ${Actors}</p>
          ${Type === "series" && totalSeasons ? `<p><strong>Total Seasons:</strong> ${totalSeasons}</p>` : ""}
          <p class="details-plot">${Plot}</p>
          <button onclick="window.history.back()">⬅ Back</button>
        </div>
      </div>
    `;
  } catch (error) {
    console.error(error);
    detailsDiv.innerHTML = "<p>Failed to load details.</p>";
  }
}

getMovieDetails();
