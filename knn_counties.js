

var svg = d3.select("svg");
var path = d3.geoPath();
var clickCounter = 0;
//https://unpkg.com/us-atlas@3/counties-10m.json
//https://d3js.org/us-10m.v1.json //<--previous geojson file
d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
       //https://d3js.org/us-10m.v1.json
  //console.log(us)
  if (error) throw error;
  var data = topojson.feature(us, us.objects.counties).features;
  console.log(data)
  svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
    .data(data)
    .enter().append("path")
      .attr("d", path)
      .attr("id", function(d) { return d.id; })
      .attr("data-name", function(d) {try {var county = countyNames.find(({ fips }) => fips === d.id); return county.name } catch (e) {console.log(e, d.id) } })
      .attr("class", "county")
      .attr("onmouseenter", "showCountyName(this);")
      .attr("onmouseleave", "clearCountyName();")
      .attr("onclick", "countClick(); highlightFip(this.id);")
      .attr("fill", "#0d042e");
      

  svg.append("path")
      .attr("class", "county-borders")
      .attr("d", path(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b; })));
});

var locked = false;
function countClick(){
  clickCounter++
  if (clickCounter%2){
    locked = true;
    //remove hover
  }else{
    locked = false;

  }
}

function highlightFip(fip){

  //document.getElementById(fip).style.fill = "green";
  document.querySelectorAll(".county").forEach(function(element) {
    element.style.fill = "#0d042e";
    element.classList.remove("highlight");
  });
  document.getElementById(fip).style.fill = "#e6376b";
  var fips = data.find( ({ county }) => county === fip );
  for(let i = 0; i<fips.neighbors.length; i++){
    let county = document.getElementById(fips.neighbors[i]);
    county.classList.add("highlight");
  }
}

function showCountyName(county){
  var name = county.getAttribute("data-name");
  //console.log(name);
  document.getElementById("county-hovered").innerHTML = "";
  document.getElementById("county-hovered").innerHTML = name;
}
function clearCountyName(){
  document.getElementById("county-hovered").innerHTML = "";
}






