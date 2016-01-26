
var path = require('path');
var _ = require('lodash');
const DB_PATH_USER_CONTENT = path.join(__dirname, 'reserved.db');

var Datastore = require('nedb');
var db = new Datastore({ filename: DB_PATH_USER_CONTENT, autoload: true, timestampData: true });
// If there was an error, err is not null 
// db.ensureIndex({ fieldName: 'month' }, function (err) { });
/**
 * month:(1..12), date:Date()
 */
var reserved = {
    db: db,
    
    // metoda na vlozenie do DB
    create: function (data, cb) {
        db.insert(data, cb);
    },
    // metoda na vylistovanie vsetkeho z DB 
    list: function (data, cb) {
        db.find(data).exec(cb);
    },

    // Najde vsetky rezervacie od dnesneho dna neskor    
    getReservedDays: function (cb) {
        var query = { DTSTART: { "$gte": new Date(Date.now()) } };
        db.find(query, cb);
    },
    
    // rozobere kolekciu dokumentov a vrati z nej pripraveny array s datumami
    rangeReservetDates: function (coll, locales, cb) {
        var element = [];
        locales = (null || 'sk');  
        for (var index = 0; index < coll.length; index++) {
            var dates = enumerateDaysBetweenDates(coll[index].DTSTART, coll[index].DTEND);
            element = element.concat(dates); 
        }
        // vrati unikatny zoznam 
        return cb(null, _.uniqWith(element, _.isEqual));
    },
    
    // odstranenie zaznamu
    remove: function (query, isMulty, cb) {
        var options = {};
        if (isMulty) { options = { multi: true }; }
        db.remove(query, options, cb);
    },

    count: function (cb) {
        db.count({}, cb);
    }
};

// funkcia vytvori array medzi dvoma datumami
var enumerateDaysBetweenDates = function (startDate, endDate, locals) {
    var dates = [];
    var endD = new Date(endDate);
    var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    for (var stD = new Date(startDate); stD <= endD; stD.setDate(stD.getDate() + 1)) {
        dates.push("'" + new Date(stD).toLocaleString(locals, options) + "'");
    }

    return dates;
};

module.exports = reserved;
