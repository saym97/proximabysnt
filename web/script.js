var timer;
let deductionValue;
var data;
var playerid;
var credits = document.getElementById('credits');
var buildingMaterial = document.getElementById('buildingMaterial');
var food = document.getElementById('food');
var energy = document.getElementById('energy');
var consumerGoods = document.getElementById('consumerGoods');
var minerals = document.getElementById('mineral');
var waste = document.getElementById('waste');
var localPollution = document.getElementById('localPollution');
var fossilFuel = document.getElementById('fossilFuel');
var preciousMinerals = document.getElementById('preciousMineral');

var marketTime = document.getElementById('timer');

$.getJSON('/proxima/playerIdName', (data) => {
    console.log(data)
    $('#playerName').html( data[0].username + '<br>' + data[0].faction_name + '<img id = "img">')
    playerid = data[0].player_id;
    if (data[0].faction_name == 'Technocrats') {
        $('div #img').attr('src', 'images/factions/technocrat_small.png');
        $('#factionBox #factionImage').css('background-image', 'url("images/factions/technocrat.png")')
        $('#factionBox #factionImage').css('opacity','0.2');
    } else if (data[0].faction_name == 'Industrialists') {
        $('#factionBox #factionImage').css('background-image', 'url("images/factions/industrialist.png")')
        $('div #img').attr('src', 'images/factions/industrialist_small.png');
    }else if (data[0].faction_name == 'Ecologists') {
        $('#factionBox #factionImage').css('background-image', 'url("images/factions/ecologist.png")')
        $('div #img').attr('src', 'images/factions/ecologist_small.png');
    }
})


var date = new Date();
$.getJSON('/proxima/time', (data) => {
    console.log(new Date())
    console.log(new Date(Date.parse(data[0].start_time)))
    timer = (Math.floor((date - new Date(Date.parse(data[0].start_time))) / 1000));
   console.log('timer', timer)
});






function playerResources() {
    // console.log('credits updated')
    $.getJSON('/proxima/player', end2);


    function end2(d) {
        data = d
        // console.log(d)
        showResources(d)

    };
};
getcards();
playerResources();


function showResources(data) {
    credits.innerHTML = data[0].credits + ' /1000';
    $("#crdts").css('background', `linear-gradient(90deg, rgba(194,146,0,0.5) ${progress(data[0].credits)}%, rgba(0,197,235,0) ${progress(data[0].credits)}%)`)

    buildingMaterial.innerHTML = data[0].building_material + ' /1000';
    $('#bm').css('background', `linear-gradient(90deg, rgba(138,91,78,1) ${progress(data[0].building_material)}%, rgba(0,197,235,0) ${progress(data[0].building_material)}%)`)

    food.innerHTML = data[0].food + ' /1000';
    $("#fd").css('background', `linear-gradient(90deg, rgba(156,189,17,1) ${progress(data[0].food)}%, rgba(0,197,235,0) ${progress(data[0].food)}%)`)

    energy.innerHTML = data[0].Energy + ' /1000';
    $("#enr").css('background', `linear-gradient(90deg, rgba(6,122,223,1) ${progress(data[0].Energy)}%, rgba(0,197,235,0) ${progress(data[0].Energy)}%)`)

    consumerGoods.innerHTML = data[0].consumer_goods + ' /1000';
    $("#cg").css('background', `linear-gradient(90deg, rgba(113,145,230,1) ${progress(data[0].consumer_goods)}%, rgba(0,197,235,0) ${progress(data[0].consumer_goods)}%)`)

    waste.innerHTML = data[0].waste + ' /1000';
    $("#wst").css('background', `linear-gradient(90deg, rgba(146,20,9,1) ${progress(data[0].waste)}%, rgba(0,197,235,0) ${progress(data[0].waste)}%)`)

    minerals.innerHTML = data[0].mineral + ' /1000';
    $("#mnrl").css('background', `linear-gradient(90deg, rgba(174,174,175,1) ${progress(data[0].mineral)}%, rgba(0,197,235,0) ${progress(data[0].mineral)}%)`)

    localPollution.innerHTML = data[0].pollution_local + ' /1000';
    $("#lp").css('background', `linear-gradient(90deg, rgba(146,20,9,1) ${progress(data[0].pollution_local)}%, rgba(0,197,235,0) ${progress(data[0].pollution_local)}%)`)

    preciousMinerals.innerHTML = data[0].precious_mineral + ' /1000';
    $("#pmnrl").css('background', `linear-gradient(90deg, rgba(174,174,175,1) ${progress(data[0].precious_mineral)}%, rgba(0,197,235,0) ${progress(data[0].precious_mineral)}%)`)

    fossilFuel.innerHTML = data[0].fossil_fuel + ' /1000';
    $("#ff").css('background', `linear-gradient(90deg, rgba(129,194,236,1) ${progress(data[0].fossil_fuel)}%, rgba(0,197,235,0) ${progress(data[0].fossil_fuel)}%)`)

    $("#creditsGain").html(data[0].credits_gain);
    $("#buildingMaterialGain").html(data[0].building_material_gain);
    $("#foodGain").html(data[0].food_gain);
    $("#energyGain").html(data[0].energy_gain);
    $("#consumerGoodsGain").html(data[0].consumer_goods_gain);
    $("#mineralGain").html(data[0].mineral_gain);
    $("#wasteGain").html(data[0].waste_gain);
    $("#localPollutionGain").html(data[0].pollution_local_gain);
    $("#fossilFuelGain").html(data[0].fossil_fuel_gain);
    $("#preciousMineralGain").html(data[0].precious_mineral_gain);

    if (data[0].waste >= 900 && data[0].pollution_local <= 900) {

        $('#infotab').html('<b>Waste</b> is reaching its maximum value. Once it reaches maximum value, 10 units will be deducted from all of your resources per turn. It will keeping going until your Waste level goes below maximum');
    } else if (data[0].pollution_local >= 900 && data[0].waste <= 900) {
        $('#infotab').html('<b>Pollution</b> is reaching its maximum value. Once it reaches maximum value, 10 units will be deducted from all of your resources per turn. It will keeping going until your Pollution level goes below maximum');
    } else if (data[0].waste >= 900 && data[0].pollution_local >= 900) {
        $('#infotab').html('<b>Waste</b> and <b>Pollution</b> are reaching their maximum values. Once they both reach maximum value, each of them will deduct 20 units from all of your resources per turn. It will keeping going until your waste and pollution level go below maximum');
    }


    if (data[0].credits == 0 && data[0].Energy == 0 && data[0].food == 0 && data[0].building_material == 0 && data[0].consumer_goods == 0 && data[0].mineral == 0 && data[0].precious_mineral == 0 && data[0].fossil_fuel == 0) {
        console.log('i dont wana go')
        let lossPopup = document.createElement('div');
        let mainMenuButton = document.createElement('a');
        mainMenuButton.setAttribute('id','restartButton');
        mainMenuButton.setAttribute('href','/logout');
        lossPopup.setAttribute('class', 'losspopup');
        $("div, section, span").not(document.getElementsByClassName("losspopup")).css('filter', 'blur(5px)');
        lossPopup.innerHTML = '<b>You Lost</b>'
        mainMenuButton.innerHTML = '<b>Main Menu</b>'
        lossPopup.append(mainMenuButton)
        document.body.append(lossPopup);
        clearInterval(turn);
        $.post('/proxima/resetResources');
    }
}

function progress(a) {
    let b = (a / 1000) * 100;
    return b
}

async function market() {
    $.post('/proxima/newTime')
    await $.post('/proxima/post', () => {
        $.getJSON('/proxima/refreshMarket', refreshMarket);
    });



};


async function clock(t) {
    //console.log('TTTTTTTTTTT',t)
    if (t < 30) {
        t = t + 1;
        timer = t

    }
    else if (t >= 30 || t <= 0) {

        market();
        refreshStatsAfterGain();
        timer = 0
    }
    let progress = ((timer / 30) * 100)
    $('#timer').css('background', `linear-gradient(90deg, rgba(56,219,25,1) ${progress}%, rgba(0,197,235,0) ${progress}%)`)
    $('#timer').css('transition', 'background 0.7s cubic-bezier(0,.84,1,1)');

    return timer
};
//market();

var turn = setInterval(() => {
    clock(timer);
    var seconds = timer % 60;

    if (seconds < 10) {
       // marketTime.innerHTML = 'Day: ' + Math.floor(timer / 60) + ":" + '0' + timer % 60;
       marketTime.innerHTML = 'Day: ' + '0' + timer % 60;
    } else {
        //marketTime.innerHTML = 'Day: ' + Math.floor(timer / 60) + ":" + timer % 60;
        marketTime.innerHTML = 'Day: '  + timer % 60;
    }
}, 1000);


function success() {
    console.log('gjdhsjkghdjfkh jkfhbklsdnhkljfdklbcjkldfn jdfkljch kldjhjklfcnkldjghfklbj lkjhklfjkljzdsklfhsjkj')
}






//////////////////////To check if all cards are deselected\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function Checkselected(s) {
    return s == false
}

function setWholeArray(a, b) {
    for (var i = 0; i < a.length; i++) {
        a[i] = b
    }
}

///////////////////To add effect to a div for example if credits increase or decrease\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

function changeEffect(a) {
    let e = document.getElementById(a);
    e.classList.add('blink');
    setTimeout(() => {
        e.classList.remove('blink');
    }, 500)
};

function shakeEffect(a) {
    let e = document.getElementById(a);
    e.classList.add('shakeeffect')
    setTimeout(() => {
        e.classList.remove('shakeeffect')
    }, 500)
};


async function refreshStatsAfterGain() {
    //console.log(data);
    await $.post('/proxima/addGains', () => {
        playerResources();
    });
    if (data[0].waste == 1000 || data[0].pollution_local == 1000) {
        if (data[0].waste == 1000 && data[0].pollution_local != 1000) {
            deductionValue = 10
        } else if (data[0].pollution_local == 1000 && data[0].waste != 1000) {
            deductionValue = 10
        } else if (data[0].waste == 1000 && data[0].pollution_local == 1000) {
            deductionValue = 20
        }
        await $.post('/proxima/deductResources', { deductionValue: deductionValue }, () => {
            changeEffect('crdts');
            changeEffect('bm');
            changeEffect('fd');
            changeEffect('cg');
            changeEffect('enr');
            changeEffect('mnrl');
            changeEffect('ff');
            changeEffect('pmnrl');
            //changeEffect('resources')
            playerResources();
        })
    }



}
