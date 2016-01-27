
var path = require('path');
var _ = require('lodash');
var Datastore = require('nedb');

// funkcia vytvori array medzi dvoma datumami
function enumerateDaysBetweenDates(startDate, endDate, locals) {
    var dates = [];
    var endD = new Date(endDate);
    var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    for (var stD = new Date(startDate); stD <= endD; stD.setDate(stD.getDate() + 1)) {
        dates.push("'" + new Date(stD).toLocaleString(locals, options) + "'");
    }

    return dates;
}

// Rezeravcie v databaze
function Reserved(room_type) {
    this.romm_type = room_type;
    this.db = null;
    if (!this.db) {
        this.db = new Datastore({ filename: path.join(__dirname, 'reserved_' + room_type + '.db'), autoload: true, timestampData: true });
    }
}
    
// metoda na vlozenie do DB
Reserved.prototype.create = function (data, cb) {
    this.db.insert(data, cb);
};
    
// metoda na vylistovanie vsetkeho z DB 
Reserved.prototype.list = function (data, cb) {
    this.db.find(data).exec(cb);
};

// Najde vsetky rezervacie od dnesneho dna neskor    
Reserved.prototype.getReservedDays = function (cb) {
    var query = { DTSTART: { "$gte": new Date(Date.now()) } };
    this.db.find(query, cb);
};
    
// rozobere kolekciu dokumentov a vrati z nej pripraveny array s datumami
Reserved.prototype.rangeReservetDates = function (coll, locales, cb) {
    var element = [];
    locales = (null || 'sk');
    for (var index = 0; index < coll.length; index++) {
        var dates = enumerateDaysBetweenDates(coll[index].DTSTART, coll[index].DTEND);
        element = element.concat(dates);
    }
    // vrati unikatny zoznam 
    return cb(null, _.uniqWith(element, _.isEqual));
};
    
// odstranenie zaznamu
Reserved.prototype.remove = function (query, isMulty, cb) {
    var options = {};
    if (isMulty) { options = { multi: true }; }
    this.db.remove(query, options, cb);
};

Reserved.prototype.count = function (cb) {
    this.db.count({}, cb);
};

module.exports = Reserved;