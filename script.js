let movies = [];

fetch("영화상세정보(통합)_1129.csv")
  .then(response => response.text())
  .then(data => {

    const rows = data.split("\n");

    const headers = rows[0].split(",");

    const titleIndex =
      headers.findIndex(h => h.includes("제명"));

    const genreIndex =
      headers.findIndex(h => h.includes("장르"));

    const storyIndex =
      headers.findIndex(h => h.includes("줄거리"));

    rows.slice(1).forEach(row => {

      const cols = row.split(",");

      if(cols.length > titleIndex){

        movies.push({
          title: cols[titleIndex] || "",
          genre: cols[genreIndex] || "",
          story: cols[storyIndex] || ""
        });

      }

    });

    console.log("영화 수:", movies.length);

  });

function recommendMovie(){

  const genre =
    document.getElementById("genre").value;

  const keyword =
    document.getElementById("keyword")
      .value
      .trim();

  let result = movies.filter(movie => {

    const genreMatch =
      !genre ||
      movie.genre.includes(genre);

    const keywordMatch =
      !keyword ||
      movie.story.includes(keyword);

    return genreMatch && keywordMatch;

  });

  result = result.slice(0, 12);

  let html = "";

  if(result.length === 0){

    html = `
      <div class="movie-card">
        <h3>검색 결과 없음</h3>
        <p>조건에 맞는 영화를 찾지 못했습니다.</p>
      </div>
    `;

  }else{

    result.forEach(movie => {

      html += `
        <div class="movie-card">
          <h3>${movie.title}</h3>
          <p><strong>장르</strong> : ${movie.genre}</p>
          <p>${movie.story.substring(0,200)}...</p>
        </div>
      `;

    });

  }

  document.getElementById("results")
    .innerHTML = html;
}
