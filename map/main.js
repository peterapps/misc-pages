let inputs, regions;

function updateMap() {
  function unpack(rows, key) {
    return rows.map(function(row) {
      return row[key];
    });
  }

  let rows = [];
  regions.features.forEach(feature => {
    rows.push({
      id: feature.id,
      value: Number(inputs[feature.id].value)
    });
  });

  var data = [
    {
      type: "choropleth",
      geojson: regions,
      locations: unpack(rows, "id"),
      z: unpack(rows, "value")
    }
  ];

  var layout = {
    title: document.getElementById("map-title").value,
    height: 500,
    width: 800,
    geo: {
      scope: "usa",
      showlakes: false
    }
  };

  document.getElementById("plotlyDiv").style.display = "block";

  Plotly.newPlot("plotlyDiv", data, layout, { showLink: false });
}

function regionsCallback() {
  let inputsDiv = document.getElementById("inputsDiv");
  inputs = {};
  regions.features.forEach((feature, index) => {
    let regionName = feature.id.replace("_", " ");
    let div = document.createElement("div");
    let span = document.createElement("span");
    span.innerHTML = regionName;
    let input = document.createElement("input");
    input.type = "number";
    input.value = index;
    inputs[feature.id] = input;
    div.appendChild(span);
    div.appendChild(input);
    inputsDiv.appendChild(div);
  });
  let btn = document.createElement("button");
  btn.addEventListener("click", updateMap, false);
  btn.innerHTML = "Update map";
  inputsDiv.appendChild(btn);
  // updateMap();
}

let req = new XMLHttpRequest();
req.onreadystatechange = function() {
  if (this.readyState === 4 && this.status === 200) {
    regions = JSON.parse(this.responseText);
    regionsCallback();
  }
};
req.open("GET", "regions.json", true);
req.send();
