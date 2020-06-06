const socket = new WebSocketClient();
const ingredients = ["egg", "flour", "milk", "sugar", "chocolate", "vanilla", "blueberry"];

let roundNumber = 0;
let startingMoney = 30;
const durations = {
  warmUp: 0,
  round: 0,
  post: 0,
}

let interval;

function updateOffer(data) {
  const agent = data.agent;
  document.getElementById(`offer-${agent}-cost`).innerText = data.cost;
  for (const ingredient in data.ingredients) {
    document.getElementById(`offer-${agent}-${ingredient}`).innerText = data.ingredients[ingredient];
  }
}

function acceptOffer(data) {
  const agent = data.agent;
  const moneyElem = document.getElementById('money');
  moneyElem.innerText = (parseFloat(moneyElem.innerText) - data.cost).toFixed(2);
  document.getElementById(`offer-${agent}-cost`).innerText = 0;
  for (const ingredient in data.ingredients) {
    document.getElementById(`offer-${agent}-${ingredient}`).innerText = 0;

    const elem = document.getElementById(`${ingredient}-have`);
    elem.innerText = parseInt(elem.innerText) + data.ingredients[ingredient];
  }
}

function updateBid(data) {
  const offer = {
    agent: data.seller.toLowerCase(),
    cost: data.bid.price.value,
    ingredients: data.bid.quantity
  };

  console.log(offer);
  console.log(data.bid.type);

  if (data.bid.type === 'SellOffer') {
    updateOffer(offer);
  }
  else if (data.bid.type === 'Accept') {
    acceptOffer(offer);
  }
}

function setUtility(data) {
  const utility = data.utility;
  for (const food in utility) {
    document.getElementById(`utility-${food}-value`).innerText = utility[food].parameters.unitvalue || utility[food].parameters.unitcost;
    for (const supplement in utility[food].parameters.supplement) {
      const params = utility[food].parameters.supplement[supplement].parameters;
      document.getElementById(`utility-${food}-${supplement}-quantity`).innerText = `${params.minQuantity} - ${params.maxQuantity}`;
      document.getElementById(`utility-${food}-${supplement}-value`).innerText = `${params.minValue} - ${params.maxValue}`;
    }
  }
}



function create_chart_data_points(base_cost, initial_increase_x, final_increase_x, initial_increase_y, final_increase_y) {
    return [
        {x: 0, y: base_cost},
        {x: initial_increase_x, y: base_cost},
        {x: initial_increase_x, y: base_cost + initial_increase_y},
        {x: final_increase_x, y: base_cost + final_increase_y},
        {x: final_increase_x + 4, y: base_cost + final_increase_y},
    ]
}

function create_graph(data) {

    const cake_additives = data['cake'].parameters;
    const pancake_additives = data['pancake'].parameters;

    const choc_cake = cake_additives.supplement['chocolate'];
    const choc_pancake = pancake_additives.supplement['chocolate'];
    const vani = cake_additives.supplement['vanilla'];
    const berr = pancake_additives.supplement['blueberry'];

    var data_choc_cake = create_chart_data_points(cake_additives.unitvalue || cake_additives.unitcost,
        choc_cake.parameters.minQuantity, 
        choc_cake.parameters.maxQuantity, 
        choc_cake.parameters.minValue, 
        choc_cake.parameters.maxValue);
    
    var data_choc_pancake = create_chart_data_points(pancake_additives.unitvalue || pancake_additives.unitcost,
        choc_pancake.parameters.minQuantity, 
        choc_pancake.parameters.maxQuantity, 
        choc_pancake.parameters.minValue, 
        choc_pancake.parameters.maxValue);
    
    var data_vani = create_chart_data_points(cake_additives.unitvalue || cake_additives.unitcost,
        vani.parameters.minQuantity, 
        vani.parameters.maxQuantity, 
        vani.parameters.minValue, 
        vani.parameters.maxValue);

    var data_berr = create_chart_data_points(pancake_additives.unitvalue || pancake_additives.unitcost,
        berr.parameters.minQuantity, 
        berr.parameters.maxQuantity, 
        berr.parameters.minValue, 
        berr.parameters.maxValue);


    document.querySelector('div[id="graph-container"]').style.display = 'block';

    var x_min = 0;

    var x_max = Math.max(choc_cake.parameters.maxQuantity, choc_pancake.parameters.maxQuantity, 
                         vani.parameters.maxQuantity, berr.parameters.maxQuantity);

    var y_min = Math.min(cake_additives.unitvalue, 
                         pancake_additives.unitvalue) - 2;
    y_min -= y_min % 5;

    var y_max = Math.round(Math.max(cake_additives.unitvalue, pancake_additives.unitvalue) + 
                                    Math.max(choc_cake.parameters.maxValue, choc_pancake.parameters.maxValue,
                                    vani.parameters.maxValue, berr.parameters.maxValue) + 2);
    y_max = y_max - (y_max % 5) + 5;

    for(food in data) {
        var scatterChart = new Chart(
            document.getElementById(food + "_graph"), 
            {
                type: 'scatter',
                data: {
                    datasets: [
                    {
                        label: 'Chocolate',
                        fill: false,
                        borderColor: "#B22222",
                        backgroundColor: "#B22222",
                        pointBackgroundColor: "#B22222",
                        pointBorderColor: "#B22222",
                        lineTension: 0, 
                        data: (food === 'cake' ? data_choc_cake : data_choc_pancake)
                    },
                    {
                        label: (food === 'cake' ? 'Vanilla' : 'Blueberry'),
                        fill: false,
                        borderColor: "#4682B4",
                        backgroundColor: "#4682B4",
                        pointBackgroundColor: "#4682B4",
                        pointBorderColor: "#4682B4",
                        lineTension: 0, 
                        data: (food === 'cake' ? data_vani : data_berr)
                    }
                ]
                },
                showLine: true,
                options: {
                    hover: {mode: null},
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        fontSize: 10,
                        position: 'top',
                        display: true,
                        text: (food === 'cake' ? 'Cake' : 'Pancake') + ' Value'
                    },
                    legend: {
                        display: false,
                        position: 'bottom',
                    },
                    scales: {
                        xAxes: [{
                            ticks: {
                                min: x_min,
                                max: x_max + 4,
                                maxTicksLimit: 4
                            },
                            scaleLabel: {
                                display: true,
                                fontSize: 10,
                                padding: 0,
                                labelString: "Quantity of Additives"
                            },
                            gridLines: {
                                color: '#888',
                                drawOnChartArea: false
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                min: y_min,
                                max: y_max,
                                autoSkip: false,
                                stepSize: 5,
                                maxTicksLimit: 6
                            },
                            gridLines: {
                                color: '#888',
                                drawOnChartArea: false
                            }
                        }]
                    }
                }
            }
        );
    }
}


function startRound() {
  if (interval) {
    clearInterval(interval);
  }

  document.getElementById('money').textContent = startingMoney;
  document.querySelector('input[name="cakes"]').value = 0;
  document.getElementById('cake-additives').innerHTML = '';
  document.querySelector('input[name="pancakes"]').value = 0;
  document.getElementById('pancake-additives').innerHTML = '';
  document.getElementById('offer-celia-cost').textContent = 0;
  document.getElementById('offer-watson-cost').textContent = 0;

  const ingredients = ['egg', 'flour', 'milk', 'sugar', 'chocolate', 'vanilla', 'blueberry'];
  for (const ingredient of ingredients) {
    document.getElementById(`${ingredient}-required`).textContent = 0;
    document.getElementById(`${ingredient}-have`).textContent = 0;
    document.getElementById(`${ingredient}-need`).textContent = 0;
    document.getElementById(`offer-celia-${ingredient}`).textContent = 0;
    document.getElementById(`offer-watson-${ingredient}`).textContent = 0;
    document.getElementById(`${ingredient}-need`).classList.remove('sufficient', 'insufficient');
  }
}

function setRoundMetadata(data) {
  roundNumber = data.roundNumber;
  startingMoney = data.humanBudget.value;
  durations.warmUp = parseInt(data.durations.warmUp);
  durations.round = parseInt(data.durations.round);
  durations.post = parseInt(data.durations.post);

  startRound();
}

function updateIngredientsNeeds(data) {
  if (!data.rationale) {
    for (const ingredient of ingredients) {
      document.getElementById(`${ingredient}-required`).textContent = 0;
      const elem = document.getElementById(`${ingredient}-need`);
      elem.classList.remove('insufficient');
      elem.classList.add('sufficient');
      elem.innerText = '0';
    }
    return;
  }

  for (const ingredient of ingredients) {
    const rationale = data.rationale[ingredient];
    document.getElementById(`${ingredient}-required`).textContent = rationale.need;
    const elem = document.getElementById(`${ingredient}-need`);
    if (!rationale) {
      elem.classList.remove('sufficient');
      elem.classList.remove('insufficient');
      continue;
    }
    if (rationale.need > rationale.have) {
      elem.classList.add('insufficient');
      elem.classList.remove('sufficient');
    }
    else {
      elem.classList.remove('insufficient');
      elem.classList.add('sufficient');
    }

    elem.innerText = Math.max(0, rationale.need - rationale.have);
  }
}

document.querySelector('input[name="cakes"]').addEventListener('change', (event) => {
  const value = event.target.value;
  const additives = document.getElementById('cake-additives');
  const old = additives.children.length;
  if (value < old) {
    for (let i = 0; i < (old - value); i++) {
      additives.children[additives.children.length-1].remove();
    }
  }
  else if (value > old) {
    for (let i = (old + 1); i <= value; i++) {
      const elem = document.createElement('tr');
      elem.className = 'allocationElem';
      elem.innerHTML = `
<td colspan="2">
  <h4>Cake ${i} Additives</h4>
  <table style="margin-left: 0;">
      <tr style="display: inline-block; width: 180px;">
          <td>Chocolate (oz)</td>
          <td><input class="allocationInput" type="number" name="cakes-${i}-chocolate" value="0" min="0" /></td>
      </tr>
      <tr style="display: inline-block; width: 180px;">
          <td>Vanilla (tsp)</td>
          <td><input class="allocationInput" type="number" name="cakes-${i}-vanilla" value="0" min="0" /></td>
      </tr>
  </table>
</td>
    `;
      additives.appendChild(elem);
    }
  }
});

document.querySelector('input[name="pancakes"]').addEventListener('change', (event) => {
  const value = event.target.value;
  const additives = document.getElementById('pancake-additives');
  const old = additives.children.length;
  if (value < old) {
    for (let i = 0; i < (old - value); i++) {
      additives.children[additives.children.length-1].remove();
    }
  }
  else if (value > old) {
    for (let i = (old + 1); i <= value; i++) {
      const elem = document.createElement('tr');
      elem.className = 'allocationElem';
      elem.innerHTML = `
<td colspan="2">
  <h4>Pancake ${i} Additives</h4>
  <table style="margin-left: 0;">
    <tr style="display: inline-block; width: 180px;">
      <td>Chocolate (oz)</td>
      <td><input class="allocationInput" type="number" name="pancakes-${i}-chocolate" value="0" min="0" /></td>
    </tr>
    <tr style="display: inline-block; width: 180px;">
      <td>blueberry (packet)</td>
      <td><input class="allocationInput" type="number" name="pancakes-${i}-blueberry" value="0" min="0" /></td>
    </tr>
  </table>
</td>
    `;
      additives.appendChild(elem);
    }
  }
});

$('body').on('change', '.allocationInput', function() {
    var self = this.parentElement.parentElement;

    if(self.nextElementSibling) {
        self.nextElementSibling.childNodes[3].childNodes[0].value = '0';
    } else {
        self.previousElementSibling.childNodes[3].childNodes[0].value = '0';
    }
});

function constructCalculatePayload() {
  const obj = {
    currencyUnit: "USD",
    allocation: {
      products: {
        cake: {
          unit: "each",
          quantity: 0,
          supplement: []
        },
        pancake: {
          unit: "each",
          quantity: 0,
          supplement: []
        }
      }
    },
    ingredients: {
      egg: 0,
      flour: 0,
      milk: 0,
      sugar: 0,
      chocolate: 0,
      vanilla: 0,
      blueberry: 0
    }
  };

  const cakes = parseInt(document.querySelector('input[name="cakes"]').value);
  obj.allocation.products.cake.quantity = cakes;
  for (let i = 1; i <= cakes; i++) {
    obj.allocation.products.cake.supplement.push({
      chocolate: {
        unit: "ounce",
        quantity: parseInt(document.querySelector(`input[name="cakes-${i}-chocolate"]`).value)
      },
      vanilla: {
        unit: "teaspoon",
        quantity: parseInt(document.querySelector(`input[name="cakes-${i}-vanilla"]`).value)
      }
    });
  }

  const pancakes = parseInt(document.querySelector('input[name="pancakes"]').value);
  obj.allocation.products.pancake.quantity = pancakes;
  for (let i = 1; i <= pancakes; i++) {
    obj.allocation.products.pancake.supplement.push({
      blueberry: {
        unit: "packet",
        quantity: parseInt(document.querySelector(`input[name="pancakes-${i}-blueberry"]`).value)
      },
      chocolate: {
        unit: "ounce",
        quantity: parseInt(document.querySelector(`input[name="pancakes-${i}-chocolate"]`).value)
      }
    });
  }

  for (const type in obj.ingredients) {
    obj.ingredients[type] = parseInt(document.getElementById(`${type}-have`).innerText);
  }

  return obj;
}

document.getElementById('calculate-utility').addEventListener('click', () => {
  console.log("boom");
  socket.send({type: 'checkAllocation', payload: constructCalculatePayload()});
});

document.getElementById('save-allocation').addEventListener('click', () => {
  socket.send({type: 'saveAllocation', payload: constructCalculatePayload()});
});

document.getElementById('reset-menu').addEventListener('click', () => {
  startRound();
});

window.addEventListener("load",function(event) {
    setTimeout(() => {
        additive_data = JSON.parse(sessionStorage.getItem('additive_data')) || null;
        if(additive_data !== undefined && additive_data.utility !== undefined) {
            create_graph(additive_data.utility);
        }
    }, 500);
}, false);

socket.onmessage = (msg) => {
  console.log(msg);
  switch (msg.type) {
    case 'setUtility':
      console.log(msg.payload);
      sessionStorage.setItem('additive_data', JSON.stringify(additive_data));
      create_graph(msg.payload.utility);
      break;
    case 'checkAllocationReturn':
      updateIngredientsNeeds(msg.payload.allocation);
      document.getElementById('potential-score').innerText = msg.payload.utility.value || 0;
      break;
    case 'saveAllocationResult':
      if (msg.accepted) {
        document.getElementById('score').textContent = msg.value;
      }
      updateIngredientsNeeds(msg.payload);
      break;
    case 'updateBid':
      updateBid(msg.payload);
      break;
    case 'updateOffer':
      updateOffer(msg.payload);
      break;
    case 'acceptOffer':
      acceptOffer(msg.payload);
      break;
    case 'setRoundMetadata':
      setRoundMetadata(msg.payload);
      break;
  }
};

socket.open("ws://" + location.hostname + ":7040/");
