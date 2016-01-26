var path = require('path');
var reserved = require(path.join(process.cwd(), 'data', 'reserved'));


describe('reserved',function(){
   it('Vytvorenie DB',function(){
       var dbef = reserved.db;
        dbef.filename.should.equal('somefile');
        dbef.inMemoryOnly.should.equal(false);
   });
   it('pridanie zaznamu do tabulky',function (){
       reserved.create({month: 1,reserved: 26}, function(err){
           reserved.find({}, function(err,docs){
              docs.length.should.equal(1);
              docs[0].month.should.equal(1);   
           });
       });
   });
   it('nacitanie jedneho zaznamu z tabulky');
   it('nacitanie vsetkych zaznamov z tabulky');
   it('nacitanie vsetkych zaznamov z tabulky na zaklade parametra month');
   it('odstranenie zaznamu z tabulky');
});
