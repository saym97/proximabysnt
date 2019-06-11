let factionButton = $('#faction');
let factionOpen = false
let factionName
let factionId
let playerFactionData
factionButton.click(
    function () {
        if (!factionOpen) {
            openFaction();
            closeMarket();
            closeTrading();
            
        } else {
            closeFaction()
            
        }

    }
)
function factionOverview() {

    $.getJSON('/proxima/playerFaction', (data) => {
        console.log(data);
        playerFactionData = data
        factionName = data[0].faction_name;
        factionId = data[0].faction_id;
        $('#targetBuildingMaterial').html('Building material: ' + data[0].building_material + '/' + data[0].req_building_material);
        checkCompletion('#targetBuildingMaterial', data[0].building_material, data[0].req_building_material);

        $('#targetCredits').html('Credits: ' + data[0].credits + '/' + data[0].req_credits);
        checkCompletion('#targetCredits', data[0].credits, data[0].req_credits);

        $('#targetEnergy').html('Energy: ' + data[0].energy + '/' + data[0].req_energy);
        checkCompletion('#targetEnergy', data[0].energy, data[0].req_energy)

        $('#targetMineral').html('Minerals: ' + data[0].minerals + '/' + data[0].req_minerals);
        checkCompletion('#targetMineral', data[0].minerals, data[0].req_minerals);

        $('#targetPreciousMineral').html('Precious minerals: ' + data[0].precious_mineral + '/' + data[0].req_precious_mineral);
        checkCompletion('#targetPreciousMineral', data[0].precious_mineral, data[0].req_precious_mineral)

        $('#targetFossilFuel').html('Fossil fuel: ' + data[0].fossil_fuel + '/' + data[0].req_fossil_fuel);
        checkCompletion('#targetFossilFuel', data[0].fossil_fuel, data[0].req_fossil_fuel)
    })


    $.getJSON('/proxima/allFactions', (data) => {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            let totalProgress = data[i].req_building_material + data[i].req_credits + data[i].req_fossil_fuel + data[i].req_minerals + data[i].req_energy + data[i].req_precious_mineral;
            let factionProgress = Math.floor(((data[i].building_material + data[i].credits + data[i].fossil_fuel + data[i].minerals + data[i].energy + data[i].precious_mineral) / totalProgress) * 100)
            $(`#faction${i}`).html(data[i].faction_name + `'` + ' progress: ' + factionProgress + '%');
            $(`#faction${i}`).css('background', `linear-gradient(90deg, rgba(0,188,34,1) ${factionProgress}%, rgba(0,197,235,0) ${factionProgress}%)`)



            if (factionProgress == 100) {

                if (factionId) {
                    let winPopup = document.createElement('div');
                    winPopup.setAttribute('class', 'winpopup');
                    // $(':not(.winpopup)').css('filter', 'blur(10px)','pointer-events' ,'none')
                    //document.body.className = 'blur';
                    $("div, section, span").not(document.getElementsByClassName("winpopup")).css('filter', 'blur(5px)');
                    console.log('factionid', factionId)
                    if (data[i].faction_id == factionId) {
                        console.log(`Faction ${data[i].faction_name} won `)
                        winPopup.innerHTML = '<b>YOUR FACTION HAS WON !</b><p>Congratulations! Your faction succeeded in building the Fission Reactor before other factions showing your superiority and ensuring a clean future. </p>'
                    } else {
                        winPopup.innerHTML = `<b>${data[i].faction_name} has won !</b><p>${data[i].faction_name} succeeded in building the Fission Reactor first showing their superiority and leading to other factions collapse. </p>`

                    }
                    let mainMenuButton = document.createElement('a');
                    mainMenuButton.setAttribute('id', 'restartButton2');
                    mainMenuButton.setAttribute('href', '/logout');
                    mainMenuButton.innerHTML = '<b>Main Menu</b>'
                    winPopup.append(mainMenuButton)
                    clearInterval(turn);
                    $.post('/proxima/resetEverything')
                    document.body.append(winPopup);


                }


            }
        }

    })



}
function checkCompletion(a, b, c) {
    if (b >= c) {
        console.log('win win', a, b, c)
        $(a).css('background', 'rgba(0,200,0,0.5)');
    }
}
factionOverview();

$('#contributeButton').click(
    function () {
        let contributingResource = $('#contributeResource').val();
        let contributingResourceAmount = $('#contributeResourceAmount').val();

        let data = {
            contributeResource: contributingResource,
            contributeResourceAmount: contributingResourceAmount,
            factionId: factionId
        }
        console.log(checkMaxTarget(contributingResource).resource, contributingResourceAmount);
        console.log(checkCorrespondingResource(contributingResource) - contributingResourceAmount);
        if (((checkCorrespondingResource(contributingResource) - contributingResourceAmount) >= 0) && ((checkMaxTarget(contributingResource).resource + parseInt(contributingResourceAmount)) <= checkMaxTarget(contributingResource).totalResource)) {
            $.post('/proxima/contribute', data, () => {
                playerResources();
                factionOverview();
            })
            console.log(contributingResource, contributingResourceAmount);
        } else {
            shakeEffect(contributingResource)

        }


    });


function checkMaxTarget(demand) {
    let resource;
    let totalResource;
    if (demand == 'credits') {
        resource = playerFactionData[0].credits;
        totalResource = playerFactionData[0].req_credits;
    }
    else if (demand == 'energy') {
        resource = playerFactionData[0].energy;
        totalResource = playerFactionData[0].req_energy;
    }
    else if (demand == 'minerals') {
        resource = playerFactionData[0].minerals;
        totalResource = playerFactionData[0].req_minerals;
    }
    else if (demand == 'Building material') {
        resource = playerFactionData[0].building_material;
        totalResource = playerFactionData[0].req_building_material;
    }
    else if (demand == 'fossilFuel') {
        resource = playerFactionData[0].fossil_fuel;
        totalResource = playerFactionData[0].req_fossil_fuel;
    }
    else if (demand == 'Precious minerals') {
        resource = playerFactionData[0].precious_mineral;
        totalResource = playerFactionData[0].req_precious_mineral;
    }
    return { resource, totalResource }
}


function openFaction() {
    $('#factionBox').css('visibility', 'visible');
    $('#factionBox').css('width', '40vw');
    $('#factionBox').css('height', '48vh');

    $('#factionBox').css('transition', 'width 0.4s cubic-bezier(0,.84,1,1), height 0.6s cubic-bezier(.89,.64,.52,1), visibility  2s fade-in');

    factionOpen = true
    factionOverview();
}

function closeFaction() {
    $('#factionBox').css('width', '0px');
    $('#factionBox').css('height', '0px');
    $('#factionBox').css('visibility', 'hidden');
    $('#factionBox').css('transition', 'width 0.7s cubic-bezier(0,.84,1,1), height 0.4s cubic-bezier(0,.84,1,1), transform 5.6s ease-in, visibility 0.6s cubic-bezier(0,.84,1,1)');
    factionOpen = false
}