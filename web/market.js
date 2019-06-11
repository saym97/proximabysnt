var cards = document.getElementById('marketcards');
var button = document.getElementById('market');
var buyButton = document.createElement('button');
buyButton.id = "buybutton";
buyButton.innerHTML = "Buy"
var marketOpen = false;
let marketCard = [];
$.getJSON('/proxima/refreshMarket', refreshMarket)
function refreshMarket(data) {
    //console.log('refereshed', data);
    //console.log(playerid);
    button.onclick = function () {
        if (!marketOpen) {
            openMarket();
            closeFaction();
            closeTrading();

        } else {
            closeMarket();

        }
    };
    cards.innerHTML = '<span>Market</span><button id = "closeMarket" onclick="closeMarket()"></button><br>';
    for (let i = 0; i < data.length; i++) {
        let createCards = document.createElement('div');
        createCards.className = "marketslots"
        console.log(data[i].faction_id, data[i].card_id)
        
        createCards.style.backgroundImage = `url("images/cards/${data[i].card_id}.png")`

        cards.append(createCards);
        marketCard[i] = false;
        createCards.onclick = function () {
            if (!marketCard[i]) {
                //console.log("you clicked card", createCards.innerHTML);
                //console.log("selected is ", marketCard[i]);
                setWholeArray(marketCard, false);
                $('.marketslots').css('borderColor', 'rgb(59, 208, 250)');
                createCards.style.borderColor = "red";
                marketCard[i] = true;
                cards.append(buyButton);
                buyButton.onclick = async function () {
                    if ((parseInt(credits.innerHTML) - data[i].cost) >= 0) {
                        //console.log(createCards.textContent, data[i].cost, parseInt(credits.innerHTML));
                        var cardbought = data[i]
                        //console.log(cardbought.card_id)
                        // var remainingCredit = parseInt(credits.innerHTML) - data[i].cost;
                        //console.log('remainingCredits', remainingCredit);
                        marketCard.splice(i, 1);
                        //console.log(marketCard)
                        $.post('/proxima/buycard', cardbought, () => {
                            $.getJSON('/proxima/refreshMarket', refreshMarket);
                            getcards();
                            playerResources();
                            changeEffect("crdts")
                        })


                    } else {
                        $('#infotab').html("not enough credits")
                        shakeEffect('crdts')
                        // alert()
                    }
                }
            } else if (marketCard[i]) {


                //console.log(marketCard[i]);
                marketCard[i] = false;
                createCards.style.borderColor = "rgb(59, 208, 250)";
                buyButton.remove();
            }

        }
    }
}



function success1() {

}

function Checkselected(s) {
    return s == false
}


function openMarket() {
    marketOpen = true;
    cards.style.visibility = "visible"
    cards.style.width = "44.25vw";
    cards.style.height = "33vh"
    cards.style.transform = "translate(-44.6vw,2vh)"
    cards.style.transition = "width 0.3s cubic-bezier(0,.84,1,1), height 0.3s cubic-bezier(.89,.64,.52,1), transform 0.4s cubic-bezier(0,.84,1,1)";
}

function closeMarket() {
    setWholeArray(marketCard, false);
    $('.marketslots').css('borderColor', 'rgb(59, 208, 250)');
    buyButton.remove();
    cards.style.width = "0px";
    cards.style.height = "0px";
    cards.style.visibility = "hidden"
    cards.style.transform = "translate(0px,00px)";
    //cards.style.transition = "width 0.5s cubic-bezier(.89,.64,.52,1), height 0.2s cubic-bezier(0,.84,1,1), transform 0.4s cubic-bezier(0,.84,1,1),visibility 0.4s cubic-bezier(0,.84,1,1)  ";
    cards.style.transition = "width 0.3s cubic-bezier(0,.84,1,1), height 0.3s cubic-bezier(0,.84,1,1), transform 0.4s cubic-bezier(0,.84,1,1),visibility 0.4s cubic-bezier(0,.84,1,1) ";

    marketOpen = false
}