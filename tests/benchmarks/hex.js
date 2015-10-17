
'use strict';

var H       = require('../../src/scripts/game/modules/Hex.js'),
    M       = require('../../src/scripts/game/modules/Math.js'),

    hexA,
    hexB,
    rand,
    result,
    time;

    hexA = new H.Hex(1,1,1);
    hexB = new H.Hex(0,0,0);
    time = Date.now();

    for ( var i = 0, l = 10000; i < l; i++ ) {
        hexB = H.hex_add(hexB, hexA);
    }
    time = ((Date.now() - time) / 1000);

    console.log('Hex addition: ' + time + 's');
