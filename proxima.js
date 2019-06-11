let player_id;
let factionid;
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const path = require('path');
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('web'))
const proxima = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7295206',
    password: 'uDQL4RIWiS',
    database: 'sql7295206',
    port: '3306'
});

/*proxima.connect((err) => {
	if (err) throw err;
	console.log("Connected to proxima");
});*/

/*const port = 3000;
app.listen(port, () => { console.log('listening on port', port) });*/
router.get('/', authenticationMiddleware(), (req, res) => {
    res.sendFile(path.join(__dirname + '/web/proxima.html'));
})

function authenticationMiddleware() {
    return (req, res, next) => {

        // console.log(player_id);
        // console.log('player_id', req.session.passport);
        if (req.isAuthenticated()) {

            player_id = req.session.passport.user.player_id;
            factionid = req.session.passport.user.faction_id;
            console.log(req.session.passport.user.player_id)
            next();
        } else {
            res.redirect('/')
        }

    }
}

router.get('/playerIdName', authenticationMiddleware(), (req, res) => {
    let q = 'select login.*, faction.faction_name from login join faction on faction.faction_id = login.faction_id where login.player_id =  "' + player_id + '" ';
    proxima.query(q, (err, result) => {
        if (err) {
            console.log('NO user', err);
        } else {
            res.send(result);
        }
    })
})

////////////////////////////////////GETTING SERVER TIME \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.get('/time', authenticationMiddleware(), (req, res) => {
    let s = "select * from turn_time where player_id = '" + player_id + "';"
    proxima.query(s, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

/////////////////////////////////////GETTING CARDS' DATA BASED ON CARD IDs IN PLAYER_CARD TABLE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.get('/cards', authenticationMiddleware(), (req, res) => {
    var q = " select player_card.player_card_id ,card.* from card inner join player_card on player_card.card_id = card.card_id where player_card.card_state = 1 and player_card.player_id = '" + player_id + "' order by player_card.player_card_id ";
    proxima.query(q, (err, result) => {
        if (err) throw err;
        res.send(result);
        console.log("player_cards");

    })
})

////////////////////////////////////GETTING TILES FROM MAP_TEMPLATE TABLE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.get('/tiles', authenticationMiddleware(), (req, res) => {
    //if(err) throw err;
    var q = "SELECT * FROM map_template ";
    proxima.query(q, (err, result) => {
        if (err) throw err;
        res.send(result);
        console.log("resulttiles")
    })
});

////////////////////////////////GETTING CARD DATA BASED ON PLAYER IDs AND CARD IDs IN TURN TABLE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.get('/refreshMarket', authenticationMiddleware(), (req, res) => {
    //if(err) throw err;
    var q = 'select card.* from turn join card on turn.card_id = card.card_id where turn.state = 1 and turn.player_id = "' + player_id + '" ';
    proxima.query(q, (err, result) => {
        if (err) throw err;
        res.send(result);
        console.log("resultrefreshMarket")
    })
});

////////////////////////////////////////////GETTING ALL STATS OF PLAYER\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.get('/player', authenticationMiddleware(), (req, res) => {

    var q = "SELECT * FROM player where player_id = '" + player_id + "'";
    proxima.query(q, (err, result) => {
        if (err) throw err;
        res.send(result);
        console.log("resultplayer")
    })


});


////////////////////////////////////////GETTING BUILDING DATA/TILES OF PLACED BUILDINGS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.get('/building', authenticationMiddleware(), (req, res) => {
    var q = "select building.* , player.faction_id  from building join player on building.player_id = player.player_id where building.player_id = '"+player_id+"' and state = 1"
    proxima.query(q, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})


router.get('/getBuildingStats:x:y', authenticationMiddleware(), (req, res) => {
    let x = req.params.x;
    let y = req.params.y;
    //let p = req.params.playerid;
    let p = 1
    let q = 'select t.* from (select player_card.building_id as building_id ,card.* from card join player_card on player_card.Card_id = card.card_id where player_card.card_state = 0 and player_card.player_id = "' + player_id + '") as t join building on t.building_id = building.building_id where building.map_tile_x = "' + x + '" and building.map_tile_y = "' + y + '" and building.player_id = "' + player_id + '" and building.state = 1 ;'
    proxima.query(q, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

////////////////////////////////Refresh all deals made by Player//////////////////////////
router.get('/refreshMyDeals', authenticationMiddleware(), (req, res) => {
    let q = 'select * from trading where (player_id = "' + player_id + '" or accepter_id = "' + player_id + '")   and not completed = 2 ';
    proxima.query(q, (err, result) => {
        if (err) throw err;
        res.send(result)
    })

})


router.get('/allDeals', authenticationMiddleware(), (req, res) => {
    let q = 'select * from trading where not player_id = "' + player_id + '" and completed = 0 ';
    proxima.query(q, (err, result) => {
        if (err) throw err;
        res.send(result)
    })

});

router.get('/allFactions', authenticationMiddleware(), (req, res) => {
    let allFactionData = 'select * from faction'
    proxima.query(allFactionData, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})


router.get('/playerFaction', authenticationMiddleware(), (req, res) => {
    let playerFactionData = 'select faction.* from faction join player on faction.faction_id = player.faction_id where player.player_id = "' + player_id + '" ; '
    proxima.query(playerFactionData, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

///////////////////////////////////////REFRESH MARKET(TURN TABLE) CARD AFTER A TURN\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.post('/post', authenticationMiddleware(), (req, res) => {

    proxima.query("update turn set state = 0 where player_id = '" + player_id + "' and state = 1 ", (err, result1) => { });
    for (var i = 0; i < 5; i++) {
        let q = "insert into turn(player_id,card_id ) values ('" + player_id + "',(SELECT card_id FROM card  where faction_id = '"+factionid+"' Order by Rand() LIMIT 1));"

        proxima.query(q, (err, result2) => {
            if (err) throw err;
            console.log("posted sucess");
        });
    }
    res.send("ok its posted")


});

/////////UPDATING MARKET(TURN TABLE) CARD AFTER BUYING CARD  &&& MOVING THAT CARD PLAYER'S CARDS AND DEDUCTING THE COST OF BUYING\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.post('/buycard', authenticationMiddleware(), (req, res) => {
    console.log("buycard", req.body);
    let q = 'update turn set state = 0 where card_id = "' + req.body.card_id + '" and state = 1 and turn.player_id = "' + player_id + '" limit 1 ';
    proxima.query(q, (err, result) => {
        let v = 'insert into player_card (card_id,player_id) values ("' + req.body.card_id + '","' + player_id + '")';
        proxima.query(v, (err, result2) => {
            if (err) { console.log(err) }
        })
    })
    let c = 'update player set credits = credits - "' + req.body.cost + '" where player_id = "' + player_id + '" ;'
    proxima.query(c, (err, result3) => {
        if (err) throw err;
        console.log('new credits posted')
    })
    res.send('ok');
})

////////////////////////////////////////UPDATING  SERVER TIME AFTER TURN\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ 
router.post('/newTime', authenticationMiddleware(), (req, res) => {
    let s = 'update turn_time set start_time = now() where player_id = "' + player_id + '";'
    proxima.query(s, (err, result) => {
        if (err) throw err;
        res.send('ok time');


    })
})

///////////////////PLACING BUILDING/TILE ON MAP W.R.T CARD CHOSEN AND ASSIGNING THAT BUILDING ID TO THAT CARD AND CHANGING STATE OF CARD  AND ADDING GAINS OF THAT CARD\\\\\\\\\\\\\\\\\\\\\
router.post('/insertBuilding', authenticationMiddleware(), (req, res) => {
    let x = req.body.x;
    let y = req.body.y;
    let p = req.body.pcard_id
    let cardid = req.body.cardid
    let gain = req.body.gainData
    let bm = req.body.bm
    let q = 'insert into building (map_tile_x,map_tile_y,player_id,card_id) values ("' + x + '","' + y + '","' + player_id + '","'+ cardid+'");'
    proxima.query(q, (err, result) => {
        if (err) throw err;
        console.log(result);
    })
    let s = 'update player_card set card_state = "0", building_id = (select building_id from building where map_tile_x = "' + x + '" and map_tile_y = "' + y + '" and player_id = "' + player_id + '" and state = 1) where player_card_id = "' + p + '";';
    proxima.query(s, (err, res) => {
        if (err) throw err;

    })
    let g = "update player set building_material = '" + bm + "',food_gain = '" + gain.foodGain + "', credits_gain = '" + gain.creditsGain + "', energy_gain = '" + gain.energyGain + "', building_material_gain = '" + gain.buildingMaterialGain + "', mineral_gain = '" + gain.mineralGain + "', consumer_goods_gain = '" + gain.consumerGoodsGain + "', waste_gain = '" + gain.wasteGain + "', pollution_local_gain = '" + gain.localPollutionGain + "', fossil_fuel_gain = '" + gain.fossilFuelGain + "', precious_mineral_gain = '" + gain.mineralGain + "' where player_id = '" + player_id + "'; "
    proxima.query(g, (err, res) => {
        if (err) throw err;

    })
    res.send('building POSTED!');
});

/////////////////////////REMOVING BUILDING W.R.T BUILDING_ID AND SUBTRACTING GAINS ///////////////////////////////
router.post('/removebuilding', authenticationMiddleware(), (req, res) => {
    let buildingId = req.body.buildingId;
    let gain = req.body.gainData;
    let q = 'update building set state = 0 where  building_id = "' + buildingId + '" '
    proxima.query(q, (err, res) => {
        if (err) throw err;
        console.log('removed')
    });
    let g = "update player set food_gain = '" + gain.foodGain + "', credits_gain = '" + gain.creditsGain + "', energy_gain = '" + gain.energyGain + "', building_material_gain = '" + gain.buildingMaterialGain + "', mineral_gain = '" + gain.mineralGain + "', consumer_goods_gain = '" + gain.consumerGoodsGain + "', waste_gain = '" + gain.wasteGain + "', pollution_local_gain = '" + gain.localPollutionGain + "', fossil_fuel_gain = '" + gain.fossilFuelGain + "', precious_mineral_gain = '" + gain.mineralGain + "' where player_id = '" + player_id + "'; "
    proxima.query(g, (err, res) => {
        if (err) throw err;

    })
    res.send('removed')
})

//////////////////////////////ADDING GAIN TO RESOURCES AFTER TURN\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.post('/addGains', authenticationMiddleware(), (req, res) => {

    console.log('sgfsgggjkfgjk', req.body)
    proxima.query('select * from player where player_id = "' + player_id + '"', (err, result) => {
        if (err) throw err;
        console.log('lhdlshdkghds', result[0].player_id)
        let credits = checkLimit(result[0].credits + result[0].credits_gain);
        let food = checkLimit(result[0].food + result[0].food_gain);
        let energy = checkLimit(result[0].Energy + result[0].energy_gain);
        let building_material = checkLimit(result[0].building_material + result[0].building_material_gain);
        let mineral = checkLimit(result[0].mineral + result[0].mineral_gain);
        let consumer_goods = checkLimit(result[0].consumer_goods + result[0].consumer_goods_gain);
        let waste = checkLimit(result[0].waste + result[0].waste_gain);
        let pollution_local = checkLimit(result[0].pollution_local + result[0].pollution_local_gain);
        let fossil_fuel = checkLimit(result[0].fossil_fuel + result[0].fossil_fuel_gain);
        let precious_mineral = checkLimit(result[0].precious_mineral + result[0].precious_mineral_gain);

        let q = 'update player set credits = "' + credits + '" , food = "' + food + '", energy = "' + energy + '", building_material = "' + building_material + '", mineral = "' + mineral + '", consumer_goods = "' + consumer_goods + '", waste = "' + waste + '", pollution_local ="' + pollution_local + '", fossil_fuel = "' + fossil_fuel + '", precious_mineral = "' + precious_mineral + '"  where player_id = "' + player_id + '";';
        proxima.query(q, (err, result) => {
            if (err) throw err;
            res.send("gains added to main values")
        })
    })


});

function checkLimit(a) {
    if (a > 1000) {
        a = 1000
    } else if (a < 0) {
        a = 0
    }
    return a
}


////////////////penalty on maximum waste and pollution//////////////////////////////
router.post('/deductResources',authenticationMiddleware(), (req, res) => {
    let decrement = req.body.deductionValue;
    proxima.query('select * from player where player_id = "' + player_id + '"', (err, result) => {
        if (err) throw err;
        let credits = checkLimit(result[0].credits - decrement);
        let food = checkLimit(result[0].food - decrement);
        let energy = checkLimit(result[0].Energy - decrement);
        let building_material = checkLimit(result[0].building_material - decrement);
        let mineral = checkLimit(result[0].mineral - decrement);
        let consumer_goods = checkLimit(result[0].consumer_goods - decrement);
        let fossil_fuel = checkLimit(result[0].fossil_fuel - decrement);
        let precious_mineral = checkLimit(result[0].precious_mineral - decrement);

        let q = 'update player set credits = "' + credits + '" , food = "' + food + '", energy = "' + energy + '", building_material = "' + building_material + '", mineral = "' + mineral + '", consumer_goods = "' + consumer_goods + '", fossil_fuel = "' + fossil_fuel + '", precious_mineral = "' + precious_mineral + '"  where player_id = "' + player_id + '";';
        proxima.query(q, (err, result) => {
            if (err) throw err;
            res.send("gains added to main values")
        })

    })


})


///////////////////////////////////post offer on trading and subtracting sender's resources//////////////////////////
router.post('/offer', authenticationMiddleware(), (req, res) => {
    let demandResource = req.body.demandResource;
    let demandAmount = req.body.demandAmount;
    let offerResource = req.body.offerResource;
    let offerAmount = req.body.offerAmount;
    let playerid = req.body.playerid;
    let q = 'insert into trading(demand, demand_amount, offer, offer_amount, player_id) values (?,?,?,?,?)';
    proxima.query(q, [demandResource, demandAmount, offerResource, offerAmount, playerid], (err, res) => {
        if (err) throw err;

    })
    let offerSubtraction = subtractResource(offerResource, offerAmount, player_id);
    proxima.query(offerSubtraction, (err, result) => {
        if (err) throw err;
    })
    res.send('offerPosted!!')
});


///////////////////////////////////////////////////////cancelling offer and returning resource to player//////////////////////////
router.post('/remove', authenticationMiddleware(), (req, res) => {

    let transid = req.body.transid;
    let offerResource = req.body.offerResource;
    let offerAmount = req.body.offerAmount;
    console.log('transid is , ', transid);
    let q = 'update trading set completed = 2 where trans_id = "' + transid + '"';
    proxima.query(q, (err, result) => {
        if (err) throw err;
    })
    let offercancellation = addResource(offerResource, offerAmount, player_id);
    console.log(offercancellation)
    proxima.query(offercancellation, (err, result) => {
        if (err) throw err;
        res.send('removedoffer')
    })

})

////////buying an offer and subtracting demand and adding offer to acceptor and adding demand value to sender/////
router.post('/boughtDeal', authenticationMiddleware(), (req, res) => {
    let transid = req.body.trans_id
    let q = 'update trading set completed = 1, accepter_id = "' + player_id + '" where trans_id = "' + transid + '"';
    let demand = req.body.demand;
    let demandAmount = req.body.demand_amount;
    let offerResource = req.body.offer;
    let offerAmount = req.body.offer_amount;
    let sellerid = req.body.player_id;
    let d = subtractResource(demand, demandAmount, player_id);
    let o = addResource(offerResource, offerAmount, player_id);
    let s = addResource(demand, demandAmount, sellerid)
    console.log(d, '  ', o, '  ', s);
    //let transaction = 'start Transaction; "' + q + '"; "' + d + '"; "' + o + '";  COMMIT;'
    proxima.beginTransaction(function (err) {
        if (err) { throw err; }
        proxima.query(q, function (error, results) {
            if (error) {
                return proxima.rollback();
            }
        });

        proxima.query(d, function (error, results) {
            if (error) {
                return proxima.rollback();
            }
        });
        proxima.query(s, function (error, results) {
            if (error) {
                return proxima.rollback();
            }
        });
        proxima.query(o, function (error, results) {
            if (error) {
                return proxima.rollback();
            }
        });
        proxima.commit(function (err) {
            if (err) {
                return proxima.rollback();
            }
            console.log('success!');

        });
    });
    res.send('success')


})



/////////////////////////////////////sending resource to faction and subtracting from sender/////////////////////
router.post('/contribute',authenticationMiddleware(), (req, res) => {
    let contribute = subtractResource(req.body.contributeResource, req.body.contributeResourceAmount, player_id);
    proxima.query(contribute, (err, result) => {
        if (err) throw err;
        let updateFaction = contributeResource(req.body.contributeResource, req.body.contributeResourceAmount, req.body.factionId)
        proxima.query(updateFaction, (err, result2) => {
            if (err) throw err;
            res.send(`${req.body.contributeResource} is contibuted`)
        })

    })
});



//////////////////////////////resetting resources on loosing//////////////////////////////////
router.post('/resetResources',authenticationMiddleware(), (req,res) => {
    let resetQuery = "call resetPlayer(?)"
    proxima.query(resetQuery,[player_id], (err,result) => {
        if (err)  throw err;
        res.send('player resetted');
    })
})


router.post('/resetEverything',authenticationMiddleware(), (req,res) => {
    let resetQuery = "call endGame()"
    proxima.query(resetQuery, (err,result) => {
        if (err)  throw err;
        res.send('Everything resetted');
    })
})




function subtractResource(a, b, player_id) {
    var query;

    if (a == 'credits') {
        query = 'update player set credits = credits - "' + b + '" where player_id = "' + player_id + '"';
        return query
    } else if (a == 'energy') {
        query = 'update player set energy = energy - "' + b + '" where player_id = "' + player_id + '"';
        return query
    } else if (a == 'food') {
        query = 'update player set food = food - "' + b + '" where player_id = "' + player_id + '"';
        return query
    } else if (a == 'minerals') {
        query = 'update player set mineral = mineral - "' + b + '" where player_id = "' + player_id + '"';
        return query
    } else if (a == 'Building material') {
        query = 'update player set building_material = building_material - "' + b + '" where player_id = "' + player_id + '"';
        return query
    } else if (a == 'Consumer goods') {
        query = 'update player set consumer_goods = consumer_goods - "' + b + '" where player_id = "' + player_id + '"';
        return query
    } else if (a == 'fossilFuel') {
        query = 'update player set fossil_fuel = fossil_fuel - "' + b + '" where player_id = "' + player_id + '"';
        return query
    } else if (a == 'Precious minerals') {
        query = 'update player set precious_mineral = precious_mineral - "' + b + '" where player_id = "' + player_id + '"';
        return query
    }
}

function addResource(a, b, player_id) {
    var query;
    if (a == 'credits') {
        query = 'update player set credits = credits + "' + b + '" where player_id = "' + player_id + '"';
        return query
    } else if (a == 'energy') {
        query = 'update player set energy = energy + "' + b + '" where player_id = "' + player_id + '"';
        return query
    } else if (a == 'food') {
        query = 'update player set food = food + "' + b + '" where player_id = "' + player_id + '"';
        return query
    } else if (a == 'minerals') {
        query = 'update player set mineral = mineral + "' + b + '" where player_id = "' + player_id + '"';
        return query
    } else if (a == 'Building material') {
        query = 'update player set building_material = building_material + "' + b + '" where player_id = "' + player_id + '"';
        return query
    } else if (a == 'Consumer goods') {
        query = 'update player set consumer_goods = consumer_goods + "' + b + '" where player_id = "' + player_id + '"';
        return query
    } else if (a == 'fossilFuel') {
        query = 'update player set fossil_fuel = fossil_fuel + "' + b + '" where player_id = "' + player_id + '"';
        return query
    } else if (a == 'Precious minerals') {
        query = 'update player set precious_mineral = precious_mineral + "' + b + '" where player_id = "' + player_id + '"';
        return query
    }
}


function contributeResource(a, b, faction_id) {
    var query;
    if (a == 'credits') {
        query = 'update faction set credits = credits + "' + b + '" where faction_id = "' + faction_id + '"';
        return query
    } else if (a == 'energy') {
        query = 'update faction set energy = energy + "' + b + '" where faction_id = "' + faction_id + '"';
        return query
    } else if (a == 'minerals') {
        query = 'update faction set minerals = minerals + "' + b + '" where faction_id = "' + faction_id + '"';
        return query
    } else if (a == 'Building material') {
        query = 'update faction set building_material = building_material + "' + b + '" where faction_id = "' + faction_id + '"';
        return query
    } else if (a == 'fossilFuel') {
        query = 'update faction set fossil_fuel = fossil_fuel + "' + b + '" where faction_id = "' + faction_id + '"';
        return query
    } else if (a == 'Precious minerals') {
        query = 'update faction set precious_mineral = precious_mineral + "' + b + '" where faction_id = "' + faction_id + '"';
        return query
    }
}
module.exports = router


