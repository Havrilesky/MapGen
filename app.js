
var startID = 10;

var express = require('express');
var cors = require('cors');
var app = express();
var mongoose = require('mongoose');

app.use(cors());
mongoose.connect('mongodb://localhost/maps');

 var mapSchema = mongoose.Schema;
/*
   var mapItemSchema = mapSchema({
      MapId: Number,
      Render: {
        coasts:[[
        [Number, Number]
        ]],
        h:[],
        params:{
          extent:{
            width:String,
            height:String,
          },
          fontsizes:{
            region:Number,
            city:Number,
            town:Number,
          },
          ncities: Number,
          npts: String,
          nterrs: Number,
        },
        rivers: [[
        [Number, Number]
        ]],
      },
  });//end mapItemSchema
   */

  var mapItemSchema = mapSchema({
      MapId: Number,
      MapData: String,  
  });//end mapItemSchema

  var mapItem = mongoose.model('MapItem', mapItemSchema);


 var tokenSchema = mongoose.Schema;

  var tokenSetSchema = tokenSchema({
      //_id: Schema.Types.ObjectId,
      name: String,
      tokenItems: [{ type: tokenSchema.Types.ObjectId, ref: 'TokenItem' }]
  });//end tokenSetSchema
  
  var tokenItemSchema = tokenSchema({
  //"ItemId": 1,
    ItemId: Number,
  //"PoseID": 1,
    PoseID: Number,
  //"SubPoseID":1,
    SubPoseID: Number,
  //"ItemName":"bare feet",
    ItemName: String,
  //"Files":{
  //  "Base":"Male 1 feet base.png",
  //  "Outline":"Male 1 feet out.png"
  //  },
    Files: {
      Base: String,
      Outline: String
    },
  //"UseColor":false,
    UseColor: Boolean,
  //"Color":"#000000",
    Color: String,
  //"PartLayer": "feet",
    PartLayer: String,
  //"Index": 0
    Index: Number,
  });//end tokenItemSchema

  var tokenSet = mongoose.model('TokenSet', tokenSetSchema);
  var tokenItem = mongoose.model('TokenItem', tokenItemSchema);

function mongoJSON(){

  for (i = 0; i < theJSON.items.length; i++) {

    var someToken = new tokenItem(theJSON.items[i]);//end new token itm

    console.log(someToken.ItemName); // 'suck it bitch'

    someToken.save(function (err, someToken) {
        if (err) return console.error(err);
    });
  }//end for

}//end mongoJSON



var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('connected');

 

  //mongoJSON();








 /* var someToken = new tokenItem(  {"ItemId": 2,
  "PoseID": 1,
  "SubPoseID":1,
  "ItemName":"bare legs",
  "Files":{
    "Base":"Male 1 legs base.png",
    "Outline":"Male 1 legs out.png"
    },
  "UseColor":false,
  "Color":"#FF0000",
  "PartLayer": "legs",
  "Index": 0
});//end new token itm
*/
  //console.log(someToken.ItemName); // 'suck it bitch'

 // someToken.save(function (err, someToken) {
 //   if (err) return console.error(err);
 // });

/*
  //stuff could be made into a makenew set func?
  var someTokenItems;

  tokenItem.find(function (err, someTokenItems) {
    if (err) return console.error(err);
    console.log("1 someTokenItems: " + someTokenItems);

    var newSet = new tokenSet({
      name: "Male Fighter",
      tokenItems: someTokenItems
    });//end newSet

    newSet.save(function (err, newSet) {
      if (err) return console.error(err);
      console.log("1 newSet: " + newSet);
    });//end save newset

    console.log("2 newSet: " + newSet);

  });//end find func

  console.log("2 someTokenItems: " + someTokenItems);
*/


 // var theTokenSets;

//  tokenSet.find(function (err, theTokenSets) {
//    if (err) return console.error(err);
//    console.log("1 theTokenSets: " + theTokenSets);
//    });//end find function


});//end open func



app.use(express.static('public'));
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.post('/crap', function(req, res) {

  var theCrap = JSON.stringify(req.body);
  console.log("req.body: "+ req.body);
  console.log("theCrap: "+ theCrap);
  console.dir(req.body);
  res.send("got some crap");

startID+=1;

  var theMap = new mapItem(  {"MapId": startID,
  "MapData": theCrap
  });//end new map itm

  console.log(theMap.MapId); // 'suck it bitch'

  theMap.save(function (err, theMap) {
    if (err) return console.error(err);
  });

});//end post

app.get('/shit', function(req, res) {
//res.json(null);
//res.json(theJSON);
//res.status(500).json({ error: 'message' });

  var mapID = req.query.map;
  var someMaps;

  if (req.query.map) {
    //if there was a ?set=blahblah in the request
    console.log("req.query.map: " + req.query.map);
    mapItem.
      findOne({MapId:req.query.map});
  }else{
    //if no set specified we'll just find all? for now
    mapItem.find(function (err, someMaps) {
      if (err) return console.error(err);
      console.log("2 someMaps: " + someMaps);
      res.json(someMaps);
    });//end find all tokenItems
  }//end else
});//end /shit

app.get('/sets', function(req, res) {
  var allTokenSets;

  tokenSet.find(function (err, allTokenSets) {
    if (err) return console.error(err);
    console.log("allTokenSets: " + allTokenSets);
    res.json(allTokenSets);

  });//end find sets
});//end /sets



app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});