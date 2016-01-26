var path = require('path');

var reserved = require(path.join(process.cwd(), 'data', 'reserved'));
var assert = require('assert');
var async = require('async');
var dbf = reserved.db;


describe('Data test reserved.js', function () {

    it('Aktualny stav tabulky count', function (done) {
        reserved.count(function (err, count) {
            console.log(count);
            done();
        });
    });
    var dt = Date.now();
    var doc = null;
    it('pridat 1 zaznam ', function (done) {
        reserved.create({ DTSTART: dt, DTEND: dt, SUMMARY: "0" }, function (err, newDoc) {
            newDoc.should.be.an.instanceOf(Object);
            doc = newDoc;
            done();
        });
    });

    it('kontrola na rok', function (done) {
        doc.DTSTART.should.equal(dt);
        done();
    });
    it('kontrola na mesiac', function (done) {
        doc.DTEND.should.equal(dt);
        done();
    });
    it('kontrola na den', function (done) {
        doc.SUMMARY.should.equal("0");
        done();
    });


    var dt2 = new Date(dt);
    dt2.setDate(dt2.getDate() - 2);

    var docs = [{ DTSTART: dt, DTEND: dt, SUMMARY: "00" }, { DTSTART: dt2, DTEND: dt2, SUMMARY: "00" }];

    it('pridat 2 zaznamy', function (done) {
        reserved.create(docs, function (err, newDocs) {
            newDocs.length.should.equal(2);
            done();
        });
    });

    it('vycistit celu tabulku', function (done) {
        reserved.remove({}, true, function (err, count) {
            (err === null).should.equal(true);

        });
        reserved.list({}, function (err, docs) {
            (err === null).should.equal(true);
            docs.length.should.equal(0);

            done();
        });
    });

    it('pridat 2 new zaznamy', function (done) {
        reserved.create(docs, function (err, newDocs) {
            newDocs.length.should.equal(2);
            done();
        });
    });

    it('odstrani prvy zaznam ' + dt.toString(), function (done) {
        this.sDate = dt.toString();
        reserved.remove({ DTSTART: { "$gte": new Date(this.sDate) } }, false, function (err, count) {
            count.should.equal(0);
            done();
        });
    });

    it('odstrani druhy zaznam ' + dt2.toString() , function (done) {
        this.sDate = dt2.toString();
        reserved.remove({ DTSTART: { "$gte": new Date(this.sDate) } }, false, function (err, count) {
            count.should.equal(1);
            done();
        });
    });

    it('pridat 2 new zaznamy', function (done) {
        reserved.create(docs, function (err, newDocs) {
            newDocs.length.should.equal(2);
            done();
        });
    });

    it('list query month non exist record', function (done) {
        reserved.list({ DTSTART: { "$gte": new Date(2016, 2) } }, function (err, docs) {
            docs.length.should.equal(0);
            done();
        });
    });

    it('list query month 1 exist 2 record', function (done) {
        reserved.list({ DTSTART: { "$gte": new Date(2016, 2) } }, function (err, docs) {
            docs.length.should.equal(0);
            done();
        });
    });

    it('list All exist record', function (done) {
        reserved.list({}, function (err, docs) {
            docs.length.should.equal(3);
            // console.log(docs);
            done();
        });
    });

    it('count', function (done) {
        reserved.count(function (err, count) {
            // console.log(count);
            done();
        });
    });


    var dt3 = new Date(dt);
    dt3.setDate(dt3.getDate() + 2);
    var dt4 = new Date(dt);
    dt4.setDate(dt4.getDate() + 1);
    var dt5 = new Date(dt);
    dt5.setDate(dt5.getDate() + 10);
    it('pridat 4 new zaznamy', function (done) {
        var docs = [
            { DTSTART: dt3, DTEND: dt3, SUMMARY: "111" },
            { DTSTART: dt4, DTEND: dt4, SUMMARY: "222" },
            { DTSTART: dt5, DTEND: dt5, SUMMARY: "333" },
        ];
        reserved.create(docs, function (err) {
            reserved.list({}, function (err, docs) {
                docs.length.should.equal(6);
                done();
            });
        });
    });
    it('list vsetky dokumentov', function (done) {
        reserved.list({}, function (err, docs) {
            docs.length.should.be.above(5);
            done();
        });
    });

    it('list getReservedDays', function (done) {
        var query = { DTSTART: { "$gte": new Date(Date.now()) } };
        var coll = {};

        reserved.list(query, function (err, docs) {
            coll = docs;
        });

        reserved.getReservedDays(function (err, docs) {
            assert.deepEqual(coll, docs);
            done();
        });
    });

    
    
    var dt6_1 = new Date(dt);
    dt6_1.setDate(dt6_1.getDate() + 2);
    var dt6_2 = new Date(dt6_1);
    dt6_2.setDate(dt6_2.getDate() + 2);
   
    it('pridat 3 new zaznamy', function (done) {
        var docs = [
            { DTSTART: dt6_1, DTEND: dt6_2, SUMMARY: "na 2 dni" },
            { DTSTART: dt6_1, DTEND: dt6_1, SUMMARY: "na 1 dup" },
            { DTSTART: dt6_2, DTEND: dt6_2, SUMMARY: "na 1 dup" },
        ];
        reserved.create(docs, function (err) {
            reserved.list({}, function (err, docs) {
                docs.length.should.equal(9);
                done();
            });
        });
    });
    
    it('list rangeReservetDates', function (done) {
        reserved.getReservedDays(function (err, docs) {
            reserved.rangeReservetDates(docs, 'en',function (err, aDates) {
                console.log('date range');
                console.log(aDates);
                
                done();
            });
        });
    });
});

