let tradingButton = document.getElementById('trading');
let searchButton = document.getElementById('search');
let myRequestButton = document.getElementById('myRequest');
//let filterButton = document.getElementById('filterButton');
let tradingOpen = false;
let demandResource = document.getElementById('demandResource');
let demandAmount = document.getElementById('demandResourceAmount');
let offerResource = document.getElementById('offerResource');
let offerAmount = document.getElementById('offerResourceAmount');
let completedDeals = document.getElementById('completedDeals');
let placedDeals = document.getElementById('placedDeals');
let allDeals = document.getElementById('allDeals');
var BuyOfferButton = document.createElement('button');
let cancelOfferButton = document.createElement('button');
cancelOfferButton.id = 'cancelOfferButton'
BuyOfferButton.id = 'BuyOfferButton'
BuyOfferButton.innerHTML = 'Buy'
let selectedTab = [];
let placedTab = [];
tradingButton.onclick = function () {
    if (!tradingOpen) {
        console.log("Clicked Trade button !! ")
        openTrading()
        closeMarket();
        closeFaction();
    } else {
        closeTrading()
    }



}

// filterButton.onclick = function () {
//     $('#searchResult').html('search results')
// }


function refreshMyDeals() {
    $.getJSON('/proxima/refreshMyDeals', (data) => {
        console.log(data)
        completedDeals.innerHTML = '';
        placedDeals.innerHTML = '';
        for (let i = 0; i < data.length; i++) {
            if (data[i].completed == 1) {
                console.log(data[i])

                let completedOfferTab = document.createElement('div');
                completedOfferTab.className = 'completedOfferTab'
                console.log(data[i].trans_id)
                completedOfferTab.innerHTML = 'Received ' + data[i].demand_amount + ' ' + data[i].demand + ' for  ' + data[i].offer_amount + ' ' + data[i].offer;
                completedDeals.append(completedOfferTab)
            }

            if (data[i].completed == 0) {
                console.log(data[i])
                placedTab[i] = false
                let placedOfferTab = document.createElement('div');
                placedOfferTab.className = 'placedOfferTab'
                console.log(data[i].trans_id)
                placedOfferTab.innerHTML = 'Requested ' + data[i].demand_amount + ' ' + data[i].demand + ' for  ' + data[i].offer_amount + ' ' + data[i].offer;
                placedDeals.append(placedOfferTab)


                placedOfferTab.onclick = function () {
                    if (!placedTab[i]) {
                        setWholeArray(placedTab, false)
                        $('.placedOfferTab').css('borderColor', 'rgb(9, 228, 250)');
                        placedOfferTab.style.borderColor = 'red';
                        placedTab[i] = true;

                        document.getElementById('placedDealstitle').append(cancelOfferButton);

                        cancelOfferButton.onclick = async function () {
                            console.log(data[i].trans_id)
                            let offerData = {
                                transid: data[i].trans_id,
                                demandResource: data[i].demand,
                                demandAmount: data[i].demand_amount,
                                offerResource: data[i].offer,
                                offerAmount: data[i].offer_amount,
                                playerid: playerid
                            }
                            $.post('/proxima/remove', offerData, () => {
                                refreshMyDeals();
                                playerResources();
                            });
                            cancelOfferButton.remove();
                        }




                    } else if (placedTab[i]) {
                        placedTab[i] = false;
                        placedOfferTab.style.borderColor = 'rgb(9, 228, 250)';
                        cancelOfferButton.remove();
                    }
                }
            }
        }


    })
}




$('#postOffer').click(async function () {
    console.log(playerid + demandResource.value + demandAmount.value + offerResource.value + offerAmount.value);
    console.log(checkCorrespondingResource(offerResource.value) - offerAmount.value)
    if ((checkCorrespondingResource(offerResource.value) - offerAmount.value) >= 0) {
        let offerData = {
            demandResource: demandResource.value,
            demandAmount: demandAmount.value,
            offerResource: offerResource.value,
            offerAmount: offerAmount.value,
            playerid: playerid
        }

        $.post('/proxima/offer', offerData, () => {
            refreshMyDeals();
            playerResources();
        })

    } else {
        shakeEffect(offerResource.value)
    }

});


function refereshAllDeals() {
    allDeals.innerHTML = '';
    $.getJSON('/proxima/allDeals', (data) => {
        console.log(data);

        for (let i = 0; i < data.length; i++) {
            if (data[i].completed == 0) {

                selectedTab[i] = false
                console.log(data[i], selectedTab)
                let allDealsTab = document.createElement('div');
                allDealsTab.className = 'allDealsTab'
                console.log(data[i].trans_id)
                allDealsTab.innerHTML = `Give <span id = 'demandAmount${i}'>${data[i].demand_amount}</span> <span id = 'demand${i}'> ${data[i].demand}</span>
                                         for <span id = 'offerAmount${i}'>${data[i].offer_amount}</span> <span id = 'offer${i}'> ${data[i].offer} </span>`;
                allDeals.append(allDealsTab);


                allDealsTab.onclick = function () {
                    if (!selectedTab[i]) {
                        $('.allDealsTab').css('borderColor', 'rgb(9, 228, 250)');
                        allDealsTab.style.borderColor = 'red';
                        setWholeArray(selectedTab, false)
                        selectedTab[i] = true;
                        document.getElementById('allDealstitle').append(BuyOfferButton);


                        BuyOfferButton.onclick = async function () {
                            var remainingResource = checkCorrespondingResource(data[i].demand) - (data[i].demand_amount)
                            console.log(remainingResource)
                            if (remainingResource >= 0) {
                                var boughtDeal = data[i];
                                console.log(boughtDeal);

                                $.post('/proxima/boughtDeal', boughtDeal, () => {
                                    playerResources();
                                    refreshMyDeals();
                                });
                                allDealsTab.remove();
                                BuyOfferButton.remove();




                            } else {
                                shakeEffect(data[i].demand)
                            }

                        }

                    } else if (selectedTab[i]) {
                        selectedTab[i] = false;
                        BuyOfferButton.remove();
                        allDealsTab.style.borderColor = 'rgb(9, 228, 250)';

                    }

                    console.log(selectedTab)
                }
            }
        }
    })
}


function checkCorrespondingResource(demand) {
    let resource;
    if (demand == 'credits') {
        resource = parseInt(credits.innerHTML)
    }
    else if (demand == 'energy') {
        resource = parseInt(energy.innerHTML)
    }
    else if (demand == 'food') {
        resource = parseInt(food.innerHTML)
    }
    else if (demand == 'minerals') {
        resource = parseInt(minerals.innerHTML)
    }
    else if (demand == 'Building material') {
        resource = parseInt(buildingMaterial.innerHTML)
    }
    else if (demand == 'Consumer goods') {
        resource = parseInt(consumerGoods.innerHTML)
    }
    else if (demand == 'fossilFuel') {
        resource = parseInt(fossilFuel.innerHTML)
    }
    else if (demand == 'Precious minerals') {
        resource = parseInt(preciousMinerals.innerHTML)
    }
    return resource

}

function openTrading() {
    $('#tradingSection').css('visibility', 'visible');
    $('#tradingSection').css('width', '52.8vw');
    $('#tradingSection').css('height', '76vh');
    $('#tradingSection').css('transform', 'translate(-53.1vw,-9vh)')
    $('#tradingSection').css('transition', 'width 0.4s cubic-bezier(0,.84,1,1), height 0.6s cubic-bezier(.89,.64,.52,1), transform 0.4s cubic-bezier(0,.84,1,1)');
    tradingOpen = true;
    refereshAllDeals();
    refreshMyDeals();
}


function closeTrading() {
    $('.placedOfferTab').css('borderColor', 'rgb(9, 228, 250)');
    cancelOfferButton.remove();
    $('.allDealsTab').css('borderColor', 'rgb(9, 228, 250)');
    BuyOfferButton.remove();
    $('#tradingSection').css('transform', 'translate(0px,0px)');
    $('#tradingSection').css('width', '0px');
    $('#tradingSection').css('height', '0px');
    $('#tradingSection').css('visibility', 'hidden');
    $('#tradingSection').css('transition', 'width 0.7s cubic-bezier(0,.84,1,1), height 0.4s cubic-bezier(0,.84,1,1), transform 5.6s ease-in, visibility 0.6s cubic-bezier(0,.84,1,1)');
    tradingOpen = false;
}