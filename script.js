console.log("스크립트 실행됨");
let movies = [];

Papa.parse("영화상세정보(통합)_1129.csv",{

download:true,
header:true,
skipEmptyLines:true,

complete:function(results){

movies = results.data;

const genreSet = new Set();

movies.forEach(movie=>{

const genre =
movie["장르"] || "";

genre
.split(",")
.forEach(g=>{

if(g.trim()){
genreSet.add(g.trim());
}

});

});

const genreSelect =
document.getElementById("genre");

[...genreSet]
.sort()
.forEach(g=>{

const option =
document.createElement("option");

option.value = g;
option.textContent = g;

genreSelect.appendChild(option);

});

console.log(
`${movies.length}개 영화 로드 완료`
);

}

});
function recommendMovie(){

const mood =
document.getElementById("mood").value;

const genre =
document.getElementById("genre").value;

const runtime =
document.getElementById("runtime").value;

let result =
movies.filter(movie=>{

let score = 0;

const keyword =
(movie["키워드"] || "") +
(movie["줄거리"] || "");

if(mood && keyword.includes(mood))
score += 3;

if(
genre &&
(movie["장르"] || "")
.includes(genre)
)
score += 5;

const time =
Number(movie["상영시간"]);

if(runtime==="short" && time<=60)
score += 2;

if(runtime==="middle" &&
time>60 &&
time<=120)
score += 2;

if(runtime==="long" &&
time>120)
score += 2;

movie._score = score;

return score > 0;

});

result.sort(
(a,b)=>b._score-a._score
);

result = result.slice(0,12);

displayResults(result,mood);

}
function displayResults(result,mood){

let html = "";

if(result.length===0){

html=`
<div class="movie-card">
<h3>추천 결과 없음</h3>
<p>다른 조건을 선택해보세요.</p>
</div>
`;

}else{

result.forEach(movie=>{

let keywords =
movie["키워드"] || "";

let firstKeyword =
keywords.split(",")[0]?.trim() || "영화";

let reason = "";

if(mood){
    reason =
    `선택한 '${mood}' 분위기와 관련된 '${firstKeyword}' 요소가 포함되어 있어 추천합니다.`;
}else{
    reason =
    `'${firstKeyword}' 키워드를 중심으로 추천된 작품입니다.`;
}

html += `

<div class="movie-card">

<h3>
${movie["제명"] || "제목 없음"}
</h3>

<div class="info">
📅 ${movie["제작년도"] || "-"}<br>
🌏 ${movie["제작국가"] || "-"}<br>
🎭 ${movie["장르"] || "-"}<br>
⏱ ${movie["상영시간"] || "-"}분<br>
🏢 ${movie["참여사명"] || "-"}
</div>

<p>
<div class="info">
🏷 키워드<br>
${movie["키워드"] || "정보 없음"}
</div>
${(movie["줄거리"] || "")
.substring(0,350)}
...
</p>

<div class="reason">
💡 추천 이유<br>
${reason}
</div>
</div>

`;

});

}

document.getElementById("results")
.innerHTML = html;

}
