
'use strict';

var test    = require('tape'),
    H       = require('../../src/scripts/game/modules/Hex.js'),
    M       = require('../../src/scripts/game/modules/Math.js'),

    hexA,
    hexB,
    rand,
    result;

test('Neighbouring hexes', function(t) {

    hexA = new H.Hex(0,0,0);

    t.plan(1)

    t.deepEqual({q: 0, r: 0, s: 0}, hexA, 'Hex lol');
});
