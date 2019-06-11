let buildingData;
var hexTileWidth = 2 * (70 / (2 * Math.tan(Math.PI / 6)))
let img;
let canvas;
let selected = []
let tileOccupied;
let selectedCard;
let tileMap;
let selectedBuildingData;
let buildingImg = []

let removeBuilding = document.createElement('button');
removeBuilding.innerHTML = 'Remove';

$.getJSON('/proxima/tiles', (data) => {
    tileMap = data;
    //console.log("tileMap", data);
})
$.getJSON('/proxima/building', building);

function building(data) {
    buildingData = data;
    console.log(data);


};

function getcards() {
    $.getJSON('/proxima/cards', end);

    function end(data) {
        //console.log(data)
        showcards(data)
    };
};

let auto;
function setup() {
    canvas = createCanvas(787, 696);
    canvas.parent('canvas')
    //canvas.position(280, 15);
    canvas.mouseClicked(placingBuilding);
    // img2 = loadImage('map.png')
    g = loadImage('images/g.png');
    m = loadImage('images/m.png');
    r = loadImage('images/r.png');
    f = loadImage('images/f.png');
    c = loadImage('images/c.png');
    //auto = loadImage('images/buildings/auto_mine.png');
    
    $('canvas').css({
        /*outline: 5px solid rgb(21, 160, 8);*/
        'width': '54vw',
        'height': '100vh',
        'position': 'absolute',
        'left': '17.6vw',
        'top': '5px'
    })

    for(let i = 0 ; i < 28; i++){
     buildingImg[i]= loadImage(`images/buildings/${i+1}.png`);
    }
}
//////////////////////////////////////////////Drawing buildings,hovering effect and template drawing///////////////////////////////////
function draw() {
    //background(img2, 0, 0, img2.width, img2.height)
    translate((70 / (2 * Math.tan(Math.PI / 6))), 70)
    
    if (tileMap) {
        var tx, ty;

        for (i = 0; i < tileMap.length; i++) {

            if ((tileMap[i].tile_y % 2) == 0) {
                tx = (tileMap[i].tile_x * (hexTileWidth));
            } else {
                tx = (tileMap[i].tile_x * (hexTileWidth)) + (hexTileWidth / 2);

            }
            ty = (tileMap[i].tile_y * 105);
            if (tileMap[i].tile_type == "grassland") { img = g }
            if (tileMap[i].tile_type == "river") { img = r }
            if (tileMap[i].tile_type == "ocean") { img = c }
            if (tileMap[i].tile_type == "mountain") { img = m }
            if (tileMap[i].tile_type == "fossil") { img = f }
            fill(0)
            strokeWeight(0);
            //polygon(tx, ty, 70, 6)
            image(img, tx - 61, ty - 70)
        }
    }

    if (mouseX < canvas.width && mouseX > 0) {
        // var mouse = `${mouseX} ${mouseY}`;
        // text(mouse,mouseX,mouseY)
        let coor = findHexTile()
        var x = coor[0]
        var y = coor[1]
        // stroke(0, 206, 209, 80)
        //console.log('X-axis',x,'Y-axis',y)

        if (x >= 0 && x <= 5 && y >= 0 && y <= 5 && !marketOpen && !tradingOpen && !factionOpen) {
            if ((y % 2) == 0) {
                x = (x * hexTileWidth)
            } else {
                x = (x * hexTileWidth) + (hexTileWidth / 2)
            }
            y = coor[1] * 105
            fill(255, 255, 255, 60)
            //text(coor[0]+' '+coor[1],mouseX,mouseY)
            polygon(x, y, 70, 6);
        }
    }

    if (buildingData) {
        let buildingImage;
        for (let i = 0; i < buildingData.length; i++) {
            let bx = buildingData[i].map_tile_x;
            let by = buildingData[i].map_tile_y;
            let faction = buildingData[i].faction_id;
            let cardid = buildingData[i].card_id;
            buildingImage = buildingImg[(cardid-((faction-1)*28 )-1)]
            //console.log(buildingImage);
            fill(23, 21, 21);
            if ((by % 2) == 0) {
                bx = (bx * hexTileWidth)
            } else {
                bx = (bx * hexTileWidth) + (hexTileWidth / 2)
            }
            by = by * 105
            
            fill('rgba(46, 87, 131, 0.75)')
            stroke(59, 208, 250)
            strokeWeight(3);


            polygon(bx, by, 55, 6);
            imageMode(CENTER);
            image(buildingImage, bx, by - 3);
            imageMode(CORNER)
        }
    }

}


////////////////////////////////////////////////hexagon formula for drawing map from temp_x and temp_y in DB/////////////////////////////
function polygon(x, y, radius, npoints) {
    let angle = TWO_PI / npoints;
    beginShape();
    for (let a = PI / 6; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius;
        let sy = y + sin(a) * radius;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}
//////////////////////////////////////////formula to check correct coodrinate of Hexagon on hovering and placing building/////////////////////////////
function findHexTile() {
    let posx = mouseX;
    let posy = mouseY;
    let hexTileWidth = 2 * (70 / (2 * Math.tan(Math.PI / 6)))
    var hexTileHeight = 140
    //pos.x-=hexGrid.x;
    //pos.y-=hexGrid.y;
    var xVal = Math.floor((posx) / hexTileWidth);
    var yVal = Math.floor((posy) / (hexTileHeight * 3 / 4));
    fill(0)
    //text(xVal+' '+yVal,10,10)
    var dX = (posx) % hexTileWidth;
    var dY = (posy) % (hexTileHeight * 3 / 4);
    //text(dX+' dx dy  '+dY,30,30)
    var slope = (hexTileHeight / 4) / (hexTileWidth / 2);
    var caldY = dX * slope;
    var delta = hexTileHeight / 4 - caldY;
    //text(caldY+' caldY delta  '+delta,50,50)

    if (yVal % 2 === 0) {
        //correction needs to happen in triangular portions & the offset rows
        if (Math.abs(delta) > dY) {
            if (delta > 0) { //odd row bottom right half
                xVal--;
                yVal--;
            } else { //odd row bottom left half
                yVal--;
            }
        }
    } else {
        if (dX > hexTileWidth / 2) { // available values don't work for even row bottom right half
            if (dY < ((hexTileHeight / 2) - caldY)) { //even row bottom right half
                yVal--;
            }
        } else {
            if (dY > caldY) { //odd row top right & mid right halves
                xVal--;
            } else { //even row bottom left half
                yVal--;
            }
        }
    }
    posy = yVal;
    posx = xVal;
    //console.log(posx,posy)
    return [posx, posy];
}


///////////////////////////////////////////ShowCards in player's hand/////////////////////////////////////
function showcards(data) {
    console.log(buildingImg)
    
    var cards = document.getElementById('cards');
    cards.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        let createCards = document.createElement('div');
        createCards.className = "slots"
        // createCards.innerHTML = data[i].description;
        //console.log(data[i].card_id)
        createCards.style.backgroundImage = `url("images/cards/${data[i].card_id}.png")`
        //console.log(createCards.style.backgroundImage)



        cards.append(createCards);
        selected[i] = false;

        // console.log(selected.every(Checkselected))

        //////////////////////////////////////////////////////showing card info on hovering/////////////////////////////////////////////// 
        createCards.addEventListener('mouseover', () => {
            createCards.style.transform = 'scale(1.1,1.1)';
            if (selected.every(Checkselected)) {
                showSelectedCardInfo(data[i]);

                console.log('mouseover')
            }
        })
        createCards.addEventListener('mouseout', () => {
            createCards.style.transform = 'scale(1,1)';
            if (selected.every(Checkselected)) {

                $(".cardinfo").css('visibility', 'hidden');
                console.log('mouseout')
            }
        })


        //////////////////////////////////////////////highlighting card and locking its stats on card info  Onclick////////////////////////
        createCards.onclick = function can() {
            //console.log("whole is false ", selected.every(Checkselected));
            if (!selected[i]) {
                setWholeArray(selected, false);
                selected[i] = true;
                $('.slots').css('borderColor', 'rgb(59, 208, 250)');
                createCards.style.borderColor = "red";
                selectedCard = data[i]
                showSelectedCardInfo(data[i]);

                console.log(selectedCard)
            } else {
                selectedCard = null
                selected[i] = false;

                createCards.style.borderColor = "rgb(59, 208, 250)";

            }

        }
    }

}

//////////////////////function for checking for tiletype and availability,placing building and add or substracting gain and refresh all data/////// 
async function placingBuilding() {
    let coor = findHexTile()
    let x = coor[0];
    let y = coor[1];
    console.log('hexcordinates', x, y);

    if (selectedCard && buildingData) {
        console.log(buildingData);

        let player_card_id = selectedCard.player_card_id
        let cardid = selectedCard.card_id
        tileOccupied = buildingCheck(x, y, buildingData);
        let sameTileType = checkTileType(x, y, tileMap, selectedCard);
        console.log('tileType is same', sameTileType);

        let remainingBM = parseInt($('#buildingMaterial').html()) - selectedCard.build_cost;
        console.log('tileOccupied', remainingBM)
        if (!tileOccupied && sameTileType && remainingBM >= 0) {
            console.log(x, y, player_card_id, selectedCard)

            $(".cardinfo").css('visibility', 'hidden');
            let TotalcreditGain = parseInt($("#creditsGain").html()) + selectedCard.credits;
            let TotalfoodGain = parseInt($("#foodGain").html()) + selectedCard.food;
            let TotalenergyGain = parseInt($("#energyGain").html()) + selectedCard.energy;
            let TotalbuildingMaterialGain = parseInt($("#buildingMaterialGain").html()) + selectedCard.building_material;
            let TotalconsumerGoodsGain = parseInt($("#consumerGoodsGain").html()) + selectedCard.consumer_goods;
            let TotalwasteGain = parseInt($("#wasteGain").html()) + selectedCard.waste;
            let TotallocalPollutionGain = parseInt($("#localPollutionGain").html()) + selectedCard.pollution;
            let TotalfossilfuelGain = parseInt($("#fossilFuelGain").html()) + selectedCard.fossil_fuel;
            let TotalmineralGain = parseInt($("#mineralGain").html()) + selectedCard.mineral;
            let TotalpreciousMineralGain = parseInt($("#preciousMineralGain").html()) + selectedCard.precious_mineral;

            let gainData = new resourcesGain(TotalcreditGain, TotalbuildingMaterialGain, TotalfoodGain, TotalenergyGain, TotalconsumerGoodsGain, TotalwasteGain, TotalfossilfuelGain, TotallocalPollutionGain, TotalmineralGain, TotalpreciousMineralGain)
            //console.log(gainData);
            //await $.post('/gains', gainData);
            
            await $.post('/proxima/insertBuilding', {
                x: x,
                y: y,
                pcard_id: player_card_id,
                cardid: cardid,
                gainData: gainData,
                bm: remainingBM
            }, () => {
                playerResources()
                changeEffect('bm');
                refreshMapnCards();
            });

        } else if (tileOccupied) {
            $('#infotab').html('<b style = "margin: 30% ; margin-top: 10%; ">Tile occupied</b>')
            //alert('')
        } else if (!sameTileType) {
            $('#infotab').html('<b style = "margin: 30% ; margin-top: 10%; ">Wrong tile type</b>')
            // alert('');
        } else if (remainingBM < 0) {
            //console.log(remainingBM)
            $('#infotab').html('<b style = "margin: 30% ; margin-top: 10%; ">Wrong tile type</b>');
            shakeEffect('bm')
            //alert();
        }
    } else if (!selectedCard && buildingData) {
        tileOccupied = buildingCheck(x, y, buildingData);
        if (tileOccupied) {
            $.getJSON('/proxima/getBuildingStats' + x + y, (data) => {
                console.log('buildingStats', data);
                selectedBuildingData = data;
                $('#infotab').html("<b>Building: </b>" + data[0].description + "<br><b>Credits: </b>" + data[0].credits + "<br><b>Building Material: </b > " + data[0].building_material);
                $('#infotab').append(removeBuilding);
            });
        }
    }
};
////////////////////////////REMOVING BUILDING/////////////////////////////////////////

removeBuilding.onclick = async function () {
    removeBuilding.remove();
    console.log(selectedBuildingData[0].building_id)
    let TotalcreditGain = parseInt($("#creditsGain").html()) - selectedBuildingData[0].credits;
    let TotalfoodGain = parseInt($("#foodGain").html()) - selectedBuildingData[0].food;
    let TotalenergyGain = parseInt($("#energyGain").html()) - selectedBuildingData[0].energy;
    let TotalbuildingMaterialGain = parseInt($("#buildingMaterialGain").html()) - selectedBuildingData[0].building_material;
    let TotalconsumerGoodsGain = parseInt($("#consumerGoodsGain").html()) - selectedBuildingData[0].consumer_goods;
    let TotalwasteGain = parseInt($("#wasteGain").html()) - selectedBuildingData[0].waste;
    let TotallocalPollutionGain = parseInt($("#localPollutionGain").html()) - selectedBuildingData[0].pollution;
    let TotalfossilfuelGain = parseInt($("#fossilFuelGain").html()) - selectedBuildingData[0].fossil_fuel;
    let TotalmineralGain = parseInt($("#mineralGain").html()) - selectedBuildingData[0].mineral;
    let TotalpreciousMineralGain = parseInt($("#preciousMineralGain").html()) - selectedBuildingData[0].precious_mineral;

    let gainData = new resourcesGain(TotalcreditGain, TotalbuildingMaterialGain, TotalfoodGain, TotalenergyGain, TotalconsumerGoodsGain, TotalwasteGain, TotalfossilfuelGain, TotallocalPollutionGain, TotalmineralGain, TotalpreciousMineralGain)
    console.log(gainData);
    await $.post('/proxima/removebuilding', {
        buildingId: selectedBuildingData[0].building_id,
        gainData: gainData
    }, () => {
        playerResources()
        $.getJSON('/proxima/building', building);
        $('#infotab').html('');
    });

};

/////////////////////////////////////remember to optimize this by limiting to only one player's building with state 1 on post side////////////
function buildingCheck(x, y, c) {
    for (var i = 0; i < c.length; i++) {
        if (x == c[i].map_tile_x && y == c[i].map_tile_y && c[i].state == 1) {
            return true
        }
    }
    return false
}

function refreshMapnCards() {

    getcards();
    $.getJSON('/proxima/building', building);
    selectedCard = null
    //console.log('refreshMapnCards()')

}

function checkTileType(x, y, a, b) {
    for (var i = 0; i < a.length; i++) {
        if (x == a[i].tile_x && y == a[i].tile_y && (a[i].tile_type == 'grassland' || a[i].tile_type == 'river') && (b.type == 'grassland')) {
            return true
        }
        if (x == a[i].tile_x && y == a[i].tile_y && a[i].tile_type == 'river' && (b.type == 'river')) {
            return true
        }
        if (x == a[i].tile_x && y == a[i].tile_y && a[i].tile_type == 'ocean' && (b.type == 'ocean')) {
            return true
        }

        if (x == a[i].tile_x && y == a[i].tile_y && a[i].tile_type == 'mountain' && b.type == 'mountain') {
            return true
        }
        if (x == a[i].tile_x && y == a[i].tile_y && a[i].tile_type == 'fossil' && b.type == 'fossil') {
            return true
        }
    }
    return false
}


function showSelectedCardInfo(a) {
    $(".cardinfo").css('visibility', 'visible');
    cardInfoAndBackground(a.credits, '#cardCreditinfo');
    // $("#cardCreditinfo").html(a.credits);
    cardInfoAndBackground(a.building_material, '#cardBuildingMaterialinfo');
    // $("#cardBuildingMaterialinfo").html(a.building_material);
    cardInfoAndBackground(a.food, '#cardFoodinfo');
    //$("#cardFoodinfo").html(a.food);
    cardInfoAndBackground(a.energy, '#cardEnergyinfo');
    // $("#cardEnergyinfo").html(a.energy);
    cardInfoAndBackground(a.consumer_goods, '#cardConsumerGoodsinfo');
    // $("#cardConsumerGoodsinfo").html(a.consumer_goods);
    cardInfoAndBackground(a.mineral, '#cardMineralinfo');
    //$("#cardMineralinfo").html(a.mineral);
    cardInfoAndBackground(a.waste, '#cardWasteinfo');
    // $("#cardWasteinfo").html(a.waste);
    cardInfoAndBackground(a.pollution, '#cardLocalPollutioninfo');
    //$("#cardLocalPollutioninfo").html(a.pollution);
    cardInfoAndBackground(a.fossil_fuel, '#cardFossilFuelinfo');
    //$("#cardFossilFuelinfo").html(a.fossil_fuel);
    cardInfoAndBackground(a.precious_mineral, '#cardPreciousMineralinfo');
    //$("#cardPreciousMineralinfo").html(a.precious_mineral);
}

function cardInfoAndBackground(value, id) {
    if (value > 0) {


        $(id).css('background-color', 'green');
        $(id).html('+' + value);
    } else if (value < 0) {
        $(id).css('background-color', 'rgb(250, 50, 50)');
        $(id).html(value);
    } else {
        console.log(value)
        $(id).css('visibility', 'hidden');
        // $(id).css('background-color', 'rgb(50, 161, 113)');
        $(id).html('');
    }
}


function resourcesGain(c, bm, f, e, cg, w, ff, lp, m, pm) {
    this.creditsGain = c;
    this.buildingMaterialGain = bm;
    this.foodGain = f;
    this.energyGain = e;
    this.consumerGoodsGain = cg;
    this.wasteGain = w;
    this.fossilFuelGain = ff;
    this.localPollutionGain = lp;
    this.mineralGain = m;
    this.preciousMineralGain = pm;

}