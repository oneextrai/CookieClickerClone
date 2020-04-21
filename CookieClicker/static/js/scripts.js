/* -- OBJECTS -- */
class Item {
    constructor(name, multiplier, cost, extras) {
        this.name = name; 
        this.multiplier = multiplier;
        this.cost = cost;
        var extras = extras || {};
        this.affects = extras.affects || "persecond";
        this.unlocked = extras.unlocked || false;
        this.tooltip = extras.tooltip || `Increases Cookies Per ${(this.affects == "persecond") ? "Second" : "Click"} by <br />${multiplier} per unit owned.`;
        this.owned = extras.owned || 0;
    }
};

/* -- VARIABLES AND SELECTORS -- */
let cookieCount = cookiesPerSecond = clicks = 0;
let cookieIncrement = 1;
let events = [];
const items = [
    new Item("Cursor", 0.1, 15, {unlocked:true}),
    new Item("Grandma", 1, 100),
    new Item("Farm", 10, 1_100),
    new Item("Mine", 47, 12_000),
]; items.forEach(createItem);
const secondsSubdivision = 8;
const extensions = ["million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion", "undecillion", "duodecillion", "tredecillion", "quattuordecillion", "quindecillion", "sedecillion", "septendecillion", "octodecillion", "novendecillion", "vigintillion", "unvigintillion", "duovigintillion", "tresvigintillion", "quattuorvigintillion", "quinvigintillion", "sesvigintillion", "septemvigintillion", "octovigintillion", "novemvigintillion", "trigintillion", "untrigintillion", "duotrigintillion", "trestrigintillion", "quattuortrigintillion", "quintrigintillion", "sestrigintillion", "septentrigintillion", "octotrigintillion", "noventrigintillion", "quadragintillion", "quinquagintillion", "sexagintillion", "septuagintillion", "octogintillion", "nonagintillion", "centillion", "uncentillion", "decicentillion", "undecicentillion", "viginticentillion", "unviginticentillion", "trigintacentillion", "quadragintacentillion", "quinquagintacentillion", "sexagintacentillion", "septuagintacentillion", "octogintacentillion", "nonagintacentillion", "ducentillion", "trecentillion", "quadringentillion", "quingentillion", "sescentillion", "septingentillion", "octingentillion", "nongentillion", "millinillion"];

/* -- EVENT LISTENERS -- */
document.getElementById("Cookie").addEventListener("click", function () { 
    try {
        new Audio(src = biteSrc).play();
        cookieCount += cookieIncrement;
        clicks += 1;
        document.getElementById("counter").innerText = downsize(cookieCount);
        document.getElementById("clicks").innerText = clicks;
        events.push({event:`Clicked ${this.id}.`, result:"Cookies added"});
    }
    catch (e) {
        events.push({event:`Clicked ${this.id}.`, result:"Error", error:e});
    }
});

/* -- FUNCTIONS -- */
function createItem(item) {
    newItem = document.createElement("button");
    (item.unlocked) ? newItem.setAttribute("class", `${item.name}`) : newItem.setAttribute("class", `${item.name} locked`);
    newItem.innerHTML = `<p>${item.name}<br />Owned: <span id="${item.name}_owned">-</span><br />Cost: <span id="${item.name}_cost">${item.cost}</span></p><div class="tooltip"><p class="tooltip-text">${item.tooltip}</p></div>`;  
    newItem.addEventListener("click", function() {onItemClicked(item)});
    document.getElementsByClassName("items")[0].appendChild(newItem);
};

function onItemClicked(item) {  // Uniform template applied to each item. Can add to if/else statement to modify other paramaters.
    try {
        if (cookieCount >= item.cost && item.owned < 1000) {
            new Audio(src = appleSrc).play();
            cookieCount -= item.cost;
            item.owned += 1;
            item.cost *= 1.15;
            if (item.affects == "perclick") cookieIncrement += item.owned * item.multiplier;
            else cookiesPerSecond += item.multiplier;
            document.getElementById(`${item.name}_owned`).innerText = downsize(item.owned);
            document.getElementById(`${item.name}_cost`).innerText = downsize(Math.ceil(item.cost));
            events.push({event:`Clicked ${item.name}`, result:"Item Purchase Success"});
        }
        else if (item.owned < 1000) {
            events.push({event:`Clicked ${item.name}.`, result:"Item Purchase Failed.", reason:"Not enough cookies."});
        }
        else {
            events.push({event:`Clicked ${item.name}.`, result:"Item Purchase Failed.", reason:"Too Many Owned."});
        };
    }
    catch (e) {
        events.push({event:`Clicked ${item}.`, result:"Error", error:e});
    }
}

function downsize(number) { // Returns large numbers reformatted as strings rounded to 3 decimal places. e.g. "3.214 million"
    if (number < 1) { // round small numbers 0.333333333 becomes 0.3.
        return number.toFixed(1)
    }
    else if (number < 1_000) { // round and return number as is.
        return number.toFixed(0);
    }
    else if (number < 1_000_000) { // add commas. 10000 becomes 10,000.
        number = number.toString().split(".")[0];
        return `${number.slice(0,number.length-3)},${number.slice(number.length-3, number.length)}`;
    }
    else { // shrink and add extension. 1,923,000 becomes 1.923 million. 
        let index = 0;
        while (number >= 999_999) {
            number = number / 1_000;
            index += (number >= 999_999) ? 1 : 0;
        }
        return ((extensions[index] != undefined) ? `${(number/1000).toFixed(3)} ${extensions[index]}` : "Infinity");
    }
};

function checkItemStates() { // Updates item classes every cycle.
    for (let i = 0; i < items.length; i++) {
        if (cookieCount >= items[i].cost) {
            items[i].unlocked = true;
            document.getElementsByClassName(items[i].name)[0].setAttribute("class", items[i].name);
        }
        else {
            document.getElementsByClassName(items[i].name)[0].setAttribute("class", `${items[i].name} locked`);
        }
    }
}

setInterval(function () { // This is what actually drives the game. Every 1000/someNumber milliseconds it updates the page.
    checkItemStates();
    cookiesPerSecond = Number((cookiesPerSecond).toFixed(2))
    cookieCount += cookiesPerSecond / secondsSubdivision;
    document.getElementById("counter").innerHTML = downsize(cookieCount);
    document.getElementById("per-second").innerText = downsize(cookiesPerSecond);
}, 1000 / secondsSubdivision); 