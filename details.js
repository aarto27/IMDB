const API_KEY = "e6a5d8cd"; // OMDb
const YT_KEY = "AIzaSyBh_SV0zeb4gKlBaAh4PhimMrA1J3Bjxbs";
const detailsDiv = document.getElementById("details");

// 🧱 Show shimmer skeletons while loading
function showDetailsSkeleton() {
  detailsDiv.innerHTML = `
    <div class="details-card skeleton-card">
      <div class="skeleton skeleton-poster details-skeleton-poster"></div>
      <div class="details-info">
        <div class="skeleton skeleton-title" style="width: 60%;"></div>
        <div class="skeleton skeleton-text" style="width: 50%;"></div>
        <div class="skeleton skeleton-text" style="width: 70%;"></div>
        <div class="skeleton skeleton-text" style="width: 90%;"></div>
        <div class="skeleton skeleton-text" style="width: 80%;"></div>
        <div class="skeleton skeleton-text" style="width: 60%;"></div>
        <div class="skeleton skeleton-text short"></div>
        <div class="skeleton skeleton-poster" style="height: 200px; margin-top:20px;"></div>
      </div>
    </div>
  `;
}

async function getMovieDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const imdbID = urlParams.get("id");

  if (!imdbID) {
    detailsDiv.innerHTML = "<p>Movie not found.</p>";
    return;
  }

  showDetailsSkeleton();

  try {
    const res = await fetch(`https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${API_KEY}`);
    const data = await res.json();

    if (data.Response === "False") {
      detailsDiv.innerHTML = "<p>No details available.</p>";
      return;
    }

    const {
      Title,
      Year,
      Poster,
      Genre,
      Actors,
      Plot,
      imdbRating,
      Runtime,
      totalSeasons,
      Type,
      Rated,
      Country,
      Released,
      BoxOffice,
      Awards
    } = data;

    detailsDiv.innerHTML = `
      <div class="details-card fade-in">
        <img src="${Poster !== "N/A" ? Poster : "https://via.placeholder.com/400x600?text=No+Image"}"
             alt="${Title}" class="details-poster" />

        <div class="details-info">
          <h1 class="details-title">${Title}</h1>
          <p><strong>Type:</strong> ${Type === "series" ? "TV Series" : "Movie"}</p>
          <p><strong>Rated:</strong> ${Rated || "N/A"}</p>
          <p><strong>Released:</strong> ${Released || Year}</p>
          <p><strong>Genre:</strong> ${Genre}</p>
          <p><strong>Runtime:</strong> ${Runtime}</p>
          <p><strong>Country:</strong> ${Country || "N/A"}</p>
          <p><strong>IMDb Rating:</strong> ⭐ ${imdbRating}</p>
          <p><strong>Box Office:</strong> ${BoxOffice || "N/A"}</p>
          <p><strong>Awards:</strong> ${Awards || "N/A"}</p>
          <p><strong>Cast:</strong> ${Actors}</p>
          ${Type === "series" && totalSeasons ? `<p><strong>Total Seasons:</strong> ${totalSeasons}</p>` : ""}
          <p class="details-plot"><strong>Plot:</strong> ${Plot}</p>
          <div id="trailer" class="fade-in"></div>
          <button onclick="window.history.back()">⬅ Back</button>
        </div>
      </div>
    `;

    await loadYouTubeTrailer(Title, Year);
  } catch (error) {
    console.error(error);
    detailsDiv.innerHTML = "<p>Failed to load details.</p>";
  }
}

// 🎬 Floating Back Button Animation
const backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", () => {
  backBtn.classList.add("fly-away");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 600);
});

async function loadYouTubeTrailer(title, year) {
  const trailerDiv = document.getElementById("trailer");
  trailerDiv.innerHTML = `
    <div class="skeleton skeleton-poster" style="height: 250px; margin-top: 15px;"></div>
  `;

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        title + " " + year + " official trailer"
      )}&type=video&key=${YT_KEY}&maxResults=1`
    );
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      trailerDiv.innerHTML = `
        <h3 style="margin-top:20px;color:#ffcc00;">🎥 Watch Trailer</h3>
        <iframe width="100%" height="360" 
          src="https://www.youtube.com/embed/${videoId}" 
          frameborder="0" 
          allowfullscreen></iframe>
      `;
    } else {
      trailerDiv.innerHTML = "<p>No trailer found.</p>";
    }
  } catch (error) {
    console.error("YouTube fetch failed:", error);
    trailerDiv.innerHTML = "<p>Unable to load trailer.</p>";
  }
}

getMovieDetails();
