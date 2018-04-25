
var setsJSON = {};
var itemsJSON = {};
var tokenLayers = {
    "feet":[],
    "legs":[],
    "waist":[],
    "torso":[],
    "arms":[],
    "head":[]
};
var tokenSelector = document.getElementById("tokenSelector");

var feetMenu = document.getElementById("feetMenu");
var legsMenu = document.getElementById("legsMenu");
var waistMenu = document.getElementById("waistMenu");
var torsoMenu = document.getElementById("torsoMenu");
var armsMenu = document.getElementById("armsMenu");
var headMenu = document.getElementById("headMenu");
var tokenCanvas = document.getElementById("tokenCanvas");
var ctx = tokenCanvas.getContext("2d");

var newImg = new Image();
var pathQ = [];
var imageQ = [];
var imagePromises = [];

function getTokenSets() {
    var request = new XMLHttpRequest();

    console.log("something's cookin!");

    request.open("GET", "http://localhost:3000/sets", true);

    request.onreadystatechange = function() {
         if (request.readyState === 4 && request.status === 200) {
            try {
                var response = JSON.parse(request.responseText);
                 console.log(response);
                setsJSON = response;
                setTokenSelector();
                //setupMenus();
                //drawToken();
            }//end try
            catch (except) {
                alert("something's fucked:"+except);
            }//end catch
        }//end if 4 & 200
    };//end onreadystatechange
    request.send();
}//end getTokenSets

function removeChile(node) {
    var last;
    while (last = node.lastChild) node.removeChild(last);
};

function getTokenItems() {
    var request = new XMLHttpRequest();
    var seletedSetID = tokenSelector.options[tokenSelector.selectedIndex].value;

    //clear existing shit!
    removeChile(feetMenu);
    removeChile(legsMenu);
    removeChile(waistMenu);
    removeChile(torsoMenu);
    removeChile(armsMenu);
    removeChile(headMenu);
    tokenLayers = {
        "feet":[],
        "legs":[],
        "waist":[],
        "torso":[],
        "arms":[],
        "head":[]
    };

    console.log("cleared!");

    request.open("GET", "http://localhost:3000/shit?set="+seletedSetID, true);
    //request.open("GET", "http://localhost:3000/shit", true);

	request.onreadystatechange = function() {
   		 if (request.readyState === 4 && request.status === 200) {
    		try {
    			var response = JSON.parse(request.responseText);
                 console.log(response);
    			itemsJSON = response;
                setupMenus();
                drawToken();
    		}//end try
    		catch (except) {
    			alert("something's fucked:"+except);
    		}//end catch
    	}//end if 4 & 200
	};//end onreadystatechange
	request.send();
}//end getTokenItems

function setTokenSelector() {
    for (i = 0; i < setsJSON.length; i++) { 
        //add each token set name to the selector & 
        // set it's value to the set ID
        //set the onClick fo trh selector
        var option = document.createElement("option");
        option.value = setsJSON[i]._id;
        option.text = setsJSON[i].name;
        tokenSelector.appendChild(option);
    }//end for
    tokenSelector.onchange = getTokenItems;
}// end setTokenSelector

function addItem(theIndex, useColorBool, theColor) {
    console.log("in addItem "+theIndex);
    console.log("useColorBool: "+useColorBool);
    console.log("theColor: "+theColor);
    var newItemIndex;

    newItemIndex = tokenLayers[itemsJSON[theIndex].PartLayer].push(itemsJSON[theIndex]);
    tokenLayers[itemsJSON[theIndex].PartLayer][newItemIndex-1].UseColor = useColorBool;
    tokenLayers[itemsJSON[theIndex].PartLayer][newItemIndex-1].Color = theColor; 

}//end addItem

function removeItem(theIndex) {
    console.log("in removeItem "+theIndex);

    var targetIndex = tokenLayers[itemsJSON[theIndex].PartLayer].findIndex(i => i.ItemId === itemsJSON[theIndex].ItemId);
    console.log("located at: "+targetIndex);
    tokenLayers[itemsJSON[theIndex].PartLayer].splice(targetIndex,1);
}//end removeItem

function menuActions() {
    console.log("in menuActions. this.id: " + this.id)
    /*
    */
    var drawCheck = this.parentNode.parentNode.childNodes[0].childNodes[0];
    var tintCheck = this.parentNode.parentNode.childNodes[1].childNodes[0];
    var colorInput = this.parentNode.parentNode.childNodes[2].childNodes[0];

    console.log("drawCheck.id: "+ drawCheck.id)
    console.log("tintCheck.id: "+ tintCheck.id)
    console.log("colorInput.id: "+ colorInput.id)

    switch (this.name){
    case "draw":
        if (this.checked) {
            //if draw box being checked all we do is add to our token
            console.log(this.value + "draw is being checked");
            //if tint is checked use that color, otherwise use default
            if (tintCheck.checked) {
                console.log("tint is also checked");
                addItem(this.value, true, colorInput.value);
            }else{
                console.log("tint NOT also checked");
                addItem(this.value, itemsJSON[this.value].UseColor, itemsJSON[this.value].Color);
            }//end if tintCheck
        } else {
            console.log(this.value + "draw is being UNchecked");
            removeItem(this.value);
        }//end drawCheck "draw"
        break;

    case "tint":
        //mtint checkbox being clicked
        //We're going to need to find the item in question in order to mod it:
        //var partLayer = (itemsJSON[i].PartLayer)

        var partLayer = this.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("name");
        console.log(partLayer + " is the partLayer");
        var targetIndex = tokenLayers[partLayer].findIndex(i => i.ItemId === itemsJSON[this.value].ItemId);
        console.log(targetIndex + " is the targetIndex in "+partLayer);

        if (this.checked) {
            //if tint box being checked then also check draw and add to token
            console.log(this.value + " tint is checked");
            if (drawCheck.checked) {
                //draw is already checked
                console.log("draw is already checked");
                //NEED to find the item and set UseColor to true!
                tokenLayers[partLayer][targetIndex].UseColor = true;
                tokenLayers[partLayer][targetIndex].Color = colorInput.value;
            } else {
                //draw not already checked, so check it and add the item
                //console.log(this.parentNode.parentNode.childNodes[0].firstChild.id + " is the draw ID?")
                console.log("draw is NOT already checked");
                //drawCheck.setAttribute("checked", "checked");
                //addItem(this.value, true, colorInput.value);
            }//end else draw checked or not
//NEED to addItem ONLY if the item is not already IN TokenLayers!!!
        } else {
            //tint is being UNchecked
//NEED to find the partLayer that we're in so we can replace "head" below with the correct part
//THEN lastly in that partLayer, find targetIndex and set UseColor to false!!
            console.log(this.value + "tint is being UNchecked");
            //NEED to find the item and set UseColor to false!
            tokenLayers[partLayer][targetIndex].UseColor = false;

            console.log("tint uncheck located at: "+targetIndex);
            //tokenLayers.head.splice(targetIndex,1);
        }//end checked or unchecked
        break;

    case "color":
        //must be colorInput that changed valyuh
        console.log(this.value + "color changed");
        var partLayer = this.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("name");
        console.log(partLayer + " is the partLayer");
        var targetIndex = tokenLayers[partLayer].findIndex(i => i.ItemId === itemsJSON[this.value].ItemId);
        console.log(targetIndex + " is the targetIndex in "+partLayer);
        break;
    }//end switch

    drawToken();
}//end menuActions

function setupMenus() {
    var i;

    //for (i = 0; i < itemsJSON.items.length; i++) { 
    for (i = 0; i < itemsJSON.length; i++) { 

        //create a LI
        var itemLI = document.createElement("LI"); 
        itemLI.setAttribute("value", "an item li");
                // Create a <li> node
        //create a sub UL with markers off - append to details
        var ItemDetails = document.createElement("DETAILS");
        ItemDetails.setAttribute("value", "an item details");
        var ItemSummary = document.createElement("SUMMARY");
        ItemSummary.setAttribute("value", "an item summary");
        //create a text node with ItemName
        var itemULName = document.createTextNode(itemsJSON[i].ItemName);
        //create a sub UL with markers off - append to details item
        var ItemUL = document.createElement("UL");
        ItemUL.setAttribute("value", "an item ul");
        //assign the text node ItemName to the summary of details item
        ItemSummary.appendChild(itemULName);
        itemLI.appendChild(ItemDetails);//details added to LI
        ItemDetails.appendChild(ItemSummary);//summary added to details
        ItemDetails.appendChild(ItemUL);//UL added to details


            //create a LI
            var drawLI = document.createElement("LI");
            //create a checkbox - append to LI
            var drawCheck = document.createElement("input");
            drawLI.appendChild(drawCheck);
            drawCheck.setAttribute("type", "checkbox");
            drawCheck.setAttribute("value", i);
            drawCheck.setAttribute("name", "draw");
            drawCheck.setAttribute("id", "drawCheck");
            //create a text node with "draw"  - append to LI
            var drawLabel = document.createTextNode("draw");
            drawLI.appendChild(drawLabel);
            //onclick menuActions
            drawCheck.onclick = menuActions;
            //append LI to UL
            ItemUL.appendChild(drawLI);

            //create a LI
            var tintLI = document.createElement("LI");
            //create a checkbox - append to LI
            var tintCheck = document.createElement("input");
            tintLI.appendChild(tintCheck);
            tintCheck.setAttribute("type", "checkbox");
            tintCheck.setAttribute("value", i);
            tintCheck.setAttribute("name", "tint");
            tintCheck.setAttribute("id", "tintCheck");
            //create a text node with "draw"  - append to LI
            var tintLabel = document.createTextNode("tint");
            tintLI.appendChild(tintLabel);
            //onclick menuActions
            tintCheck.onclick = menuActions;
            //append LI to UL
            ItemUL.appendChild(tintLI);

            //create a LI
            var colorLI = document.createElement("LI");                 // Create a <li> node
            //create a color input - append to LI
            var colorInput = document.createElement("input");
            colorLI.appendChild(colorInput);
            colorInput.setAttribute("type", "color");
            colorInput.setAttribute("id", "colorInput");
            colorInput.setAttribute("name", "color");
            colorInput.setAttribute("value", itemsJSON[i].Color); 
            //onclick if tint is checked then menuActions & ste color to color input
            colorInput.onchange = menuActions;
            //append LI to UL
            ItemUL.appendChild(colorLI);


        switch (itemsJSON[i].PartLayer){
        case "feet":
        feetMenu.appendChild(itemLI);
        break;
        case "legs":
        legsMenu.appendChild(itemLI);
        break;
        case "waist":
        waistMenu.appendChild(itemLI);
        break;
        case "torso":
        torsoMenu.appendChild(itemLI);
        break;
        case "arms":
        armsMenu.appendChild(itemLI);
        break;
        case "head":
        headMenu.appendChild(itemLI);
        break;
        }//end switch
    }//end for
}//end setupMenus

function drawColor(shadeImage, aColor) {
    
    var imageData = ctx.getImageData(0,0,can.width, can.height);
    var pixels = imageData.data;
    var numPixels = pixels.length;
    
    ctx.clearRect(0, 0, can.width, can.height);
    
    for (var i = 0; i < numPixels; i++) {
        var average = (pixels[i*4] + pixels[i*4+1] + pixels[i*4+2]) /3;
        // set red green and blue pixels to the average value
        pixels[i*4] = average;
        pixels[i*4+1] = average+30;
        pixels[i*4+2] = average;
    }
    ctx.putImageData(imageData, 0, 0);
}//end func drawcolor


function recolorImage(shadeImage,aColor){

        var newRedVal = parseInt(aColor.substr(1,2), 16);
        var newGreenVal = parseInt(aColor.substr(3,2), 16);
        var newBlueVal = parseInt(aColor.substr(5,2), 16);

        var newLuminVal = 0.299 * Number(newRedVal) + 0.587 * Number(newGreenVal) + 0.114 * Number(newBlueVal);

        //console.log("aColor:"+newRedVal+", "+newGreenVal+", "+newBlueVal);
        //console.log("newLuminVal:"+newLuminVal);


        var newCan = document.createElement('canvas');
        var newTex=newCan.getContext("2d");
        var w = shadeImage.width;
        var h = shadeImage.height;

        newCan.width = w;
        newCan.height = h;

        // draw the image on the temporary canvas
        newTex.drawImage(shadeImage, 0, 0, w, h);

        // pull the entire image into an array of pixel data
        var imageData = newTex.getImageData(0, 0, w, h);
        //console.log("drew image got data...");

        // examine every pixel, 
        // change any old rgb to the new-rgb
        for (var i=0;i<imageData.data.length;i+=4)
          {
              // is this pixel the old rgb?
              if(imageData.data[i+3]!=0){//not transparent

                //break out rgb values

                var redVal = imageData.data[i];
                var greenVal = imageData.data[i+1];
                var blueVal = imageData.data[i+2];
                var alphaVal = imageData.data[i+3];

                //console.log("got data["+i+"]:"+redVal+", "+greenVal+", "+blueVal+", a:"+alphaVal);

                //var greyVal = (redVal+greenVal+blueVal)/3;
                var luminVal = 0.299 * redVal + 0.587 * greenVal + 0.114 * blueVal;

                //var redHex = redVal.toString(16);
                //var greenHex = greenVal.toString(16);
                //var blueHex = blueVal.toString(16);

                //var thisColor = "#"+redHex+greenHex+blueHex;
                var luminDiff = luminVal/newLuminVal;

                //console.log("luminVal:"+luminVal+" & newLuminVal: "+newLuminVal+", so luminDiff = "+luminDiff);

                var resultRed = Math.floor(newRedVal*luminDiff);
                var resultGreen = Math.floor(newGreenVal*luminDiff);
                var resultBlue = Math.floor(newBlueVal*luminDiff);
                // change to your new rgb
                //console.log("CHANGE TO:["+i+"]:"+resultRed+", "+resultGreen+", "+resultBlue+", a:"+alphaVal);
                imageData.data[i]=resultRed;
                imageData.data[i+1]=resultGreen;
                imageData.data[i+2]=resultBlue;
                imageData.data[i+3]=alphaVal;
              }
          }// end fro

        // put the altered data back on the canvas  
        newTex.putImageData(imageData,0,0);
        // put the re-colored image into an image and return it
 //       var newImg = new Image();
        newImg.src = newCan.toDataURL('image/png');
        console.log("newImg: "+ newImg);
        return  newImg;
}// end recolor

function recolorImage2(shadeImage,aColor){

        var newRedVal = parseInt(aColor.substr(1,2), 16);
        var newGreenVal = parseInt(aColor.substr(3,2), 16);
        var newBlueVal = parseInt(aColor.substr(5,2), 16);

        var newLuminVal = 0.299 * Number(newRedVal) + 0.587 * Number(newGreenVal) + 0.114 * Number(newBlueVal);

        //console.log("aColor:"+newRedVal+", "+newGreenVal+", "+newBlueVal);
        //console.log("newLuminVal:"+newLuminVal);


        var newCan = document.createElement('canvas');
        var newTex=newCan.getContext("2d");
        var w = shadeImage.width;
        var h = shadeImage.height;

        newCan.width = w;
        newCan.height = h;

        // draw the image on the temporary canvas
        newTex.drawImage(shadeImage, 0, 0, w, h);

        // pull the entire image into an array of pixel data
        var imageData = newTex.getImageData(0, 0, w, h);
        //console.log("drew image got data...");

        // examine every pixel, 
        // change any old rgb to the new-rgb
        for (var i=0;i<imageData.data.length;i+=4)
          {
              // is this pixel the old rgb?
              if(imageData.data[i+3]!=0){//not transparent

                //break out rgb values

                var redVal = imageData.data[i];
                var greenVal = imageData.data[i+1];
                var blueVal = imageData.data[i+2];
                var alphaVal = imageData.data[i+3];

                //console.log("got data["+i+"]:"+redVal+", "+greenVal+", "+blueVal+", a:"+alphaVal);

                var luminVal = (redVal+greenVal+blueVal)/3;
                //var luminVal = 0.299 * redVal + 0.587 * greenVal + 0.114 * blueVal;
                luminVal = Math.min(luminVal, 255);//just make sure it stays under 255
                //var redHex = redVal.toString(16);
                //var greenHex = greenVal.toString(16);
                //var blueHex = blueVal.toString(16);

                //var thisColor = "#"+redHex+greenHex+blueHex;
                var luminDiff = luminVal/newLuminVal;

                //console.log("luminVal:"+luminVal+" & newLuminVal: "+newLuminVal+", so luminDiff = "+luminDiff);

                //var resultRed = Math.floor(redVal+(newRedVal-redVal)*luminVal/255);//more new with more lumin
                //var resultGreen = Math.floor(greenVal+(newGreenVal-greenVal)*luminVal/255);
                //var resultBlue = Math.floor(blueVal+(newBlueVal-blueVal)*luminVal/255);


                //var resultRed = Math.floor(newRedVal+(redVal-newRedVal)*luminVal/255);//more old with more lumin
                //var resultGreen = Math.floor(newGreenVal+(greenVal-newGreenVal)*luminVal/255);
                //var resultBlue = Math.floor(newBlueVal+(blueVal-newBlueVal)*luminVal/255);

                var resultRed = Math.floor(redVal+(newRedVal-redVal)*(-2*Math.abs(luminVal-129)+255)/255);//more old in the middle
                var resultGreen = Math.floor(greenVal+(newGreenVal-greenVal)*(-2*Math.abs(luminVal-129)+255)/255);
                var resultBlue = Math.floor(blueVal+(newBlueVal-blueVal)*(-2*Math.abs(luminVal-129)+255)/255);

                //var resultRed = Math.floor(resultRed*luminDiff);//apply lumin diff
                //var resultGreen = Math.floor(resultGreen*luminDiff);
                //var resultBlue = Math.floor(resultBlue*luminDiff); 

                var resultRed = (resultRed+redVal+redVal)/3;//just tone down to old color
                var resultGreen = (resultGreen+greenVal+greenVal)/3;
                var resultBlue = (resultBlue+blueVal+blueVal)/3;


                // change to your new rgb
                //console.log("CHANGE TO:["+i+"]:"+resultRed+", "+resultGreen+", "+resultBlue+", a:"+alphaVal);
                imageData.data[i]=resultRed;
                imageData.data[i+1]=resultGreen;
                imageData.data[i+2]=resultBlue;
                imageData.data[i+3]=alphaVal;
              }
          }// end fro

        // put the altered data back on the canvas  
        newTex.putImageData(imageData,0,0);
        // put the re-colored image into an image and return it
 //       var newImg = new Image();
        newImg.src = newCan.toDataURL('image/png');
        console.log("newImg: "+ newImg);
        return  newImg;
}// end recolor2

function logImgData(theImg){
        var newCan = document.createElement('canvas');
        var newTex=newCan.getContext("2d");
        var w = theImg.width;
        var h = theImg.height;

        newCan.width = w;
        newCan.height = h;
        newTex.drawImage(theImg, 0, 0, w, h);

        // pull the entire image into an array of pixel data
        var imageData = newTex.getImageData(0, 0, w, h);
        // examine every pixel, 
        for (var i=0;i<imageData.data.length;i+=4)
          {
            console.log("log data["+i+"]:"+imageData.data[i]+", "+imageData.data[i+1]+", "+imageData.data[i+2]+", "+imageData.data[i+3]);
          }//end fro 
}//end logImgData

function drawItem(theItem) {

    if(theItem.Files["Base"]) {
        var baseImg = new Image();
        baseImg.src = theItem.Files["Base"];
        baseImg.onload = function () {
            if (theItem.UseColor == true) {
                var colorImg = recolorImage2(baseImg,theItem.Color)
                //colorImg = recolorImage(shadeImg,"#0000FF")
                colorImg.onload = function () {
                    console.log("about to color draw: "+theItem.Files["Base"]);
                    ctx.drawImage(colorImg,1,1);
                };//end onload
            }else{//end if useColor
                console.log("about to draw: "+theItem.Files["Base"]);
                ctx.drawImage(baseImg,1,1);
            }//end else not UseColor
        };//end onload
    }//end if exists

    if(theItem.Files["Outline"]) {
        var outlineImg = new Image();
        outlineImg.src = theItem.Files["Outline"];
        outlineImg.onload = function () {
            console.log("about to draw: "+theItem.Files["Outline"]);
            ctx.drawImage(outlineImg,1,1);
        };//end onload
    }//end if exists

}//end drawItem

function QItem(theItem) {

    if(theItem.Files["Base"]) {
        var baseImg = new Image();
        baseImg.src = theItem.Files["Base"];
        baseImg.onload = function () {
            if (theItem.UseColor == true) {
                var colorImg = recolorImage2(baseImg,theItem.Color)
                //colorImg = recolorImage(shadeImg,"#0000FF")
                imageQ.push(colorImg);

                //colorImg.onload = function () {
                //    console.log("about to color draw: "+theItem.Files["Base"]);
                //     ctx.drawImage(colorImg,1,1);
                //};//end onload

            }else{//end if useColor
                imageQ.push(baseImg);

                //console.log("about to draw: "+theItem.Files["Base"]);
                //ctx.drawImage(baseImg,1,1);
            }//end else not UseColor
        };//end onload
    }//end if exists

    if(theItem.Files["Outline"]) {
        var outlineImg = new Image();
        outlineImg.src = theItem.Files["Outline"];
        imageQ.push(outlineImg);

        //outlineImg.onload = function () {
        //   console.log("about to draw: "+theItem.Files["Outline"]);
        //   ctx.drawImage(outlineImg,1,1);
        //};//end onload
    }//end if exists

}//end QItem

function drawItem2(theItem) {

/*

    new Promise(function(resolve, reject) {
      
        if(theItem.Files["Base"]) {
            var baseImg = new Image();
            baseImg.src = theItem.Files["Base"];
            baseImg.onload = function () {
                if (theItem.UseColor == true) {
                    var colorImg = recolorImage2(baseImg,theItem.Color)
                    //colorImg = recolorImage(shadeImg,"#0000FF")
                    colorImg.onload = function () {
                        console.log("about to color draw: "+theItem.Files["Base"]);
                        ctx.drawImage(colorImg,1,1);
                    };//end onload
                }else{//end if useColor
                    console.log("about to draw: "+theItem.Files["Base"]);
                    ctx.drawImage(baseImg,1,1);
                }//end else not UseColor
            };//end onload
        }//end if exists
        resolve();
    
    }).then(function(result) {
    
        if(theItem.Files["Outline"]) {
        var outlineImg = new Image();
        outlineImg.src = theItem.Files["Outline"];
        outlineImg.onload = function () {
            console.log("about to draw: "+theItem.Files["Outline"]);
            ctx.drawImage(outlineImg,1,1);
        };//end onload
        return result * 2;
    
    });
*/

}//end drawItem2

function drawLayer(aLayer) {
    aLayer.sort(function(a, b){return a.Index - b.Index});
    for (i = 0; i < aLayer.length; i++) { 
        //drawItem2(aLayer[i]);
        //drawItem(aLayer[i]);
        QItem(aLayer[i]);

    }//end for items of aLayer
}//end drawLayer

function loadImage(pathRecord, someFunc) {
    var theImage;
    var tempImage;

    if (pathRecord.Usecolor) {
        //colorize
        tempImage = new Image();
        tempImage.src = pathRecord.Path;
        tempImage.onload = function () {
            theImage = recolorImage2(tempImage,pathRecord.Color);
        };//end onload
    }else{
        //don't colorize
        theImage = new Image();
        theImage.src = pathRecord.Path;
    }//end UseColor or not

    someFunc(null,theImage);//is that it?
    return theImage;//but what do I do with someFunc????

}//end loadImage

function drawToken() {


    var pathRec={};

    ctx.clearRect(0, 0, tokenCanvas.width, tokenCanvas.height);
    pathQ = [];
    imageQ = [];

    //CREATE A QUEUE OF FILE PATHS (and if they need color)
    for (nextLayer in tokenLayers) {
        console.log("nextLayer: "+nextLayer);
        console.log(tokenLayers[nextLayer]);
        tokenLayers[nextLayer].sort(function(a, b){return a.Index - b.Index});
        for (i = 0; i < tokenLayers[nextLayer].length; i++) {
            //for the "Base"
            pathRec = {
                "Path":tokenLayers[nextLayer][i].Files.Base,
                "UseColor":tokenLayers[nextLayer][i].UseColor,
                "Color":tokenLayers[nextLayer][i].Color
            };//end path rec
            pathQ.push(pathRec);
            //for the "Outline"
            pathRec = {
                "Path":tokenLayers[nextLayer][i].Files.Outline,
                "UseColor": false,
                "Color":""
            };//end path rec
            pathQ.push(pathRec);
        }//end for items of tokenLayers[nextLayer]
    }//end for nextLayer

    console.log("pathQ: "+pathQ);


    //LOAD IMAGES AND QUEUE UP (using Promises to make them load in order!)

/*
    const imagePromises = pathQ.map(pRec => new Promise(resolve, reject) {
        loadImage(pRec, (error, anImage) => {
            if(error) {
                reject('Bad image path');
                return;
            }//end error
            resolve(anImage);
        });//end of call to loadImage
    }//end statements of => func passed to pathQ.map?
    );//end pathQ.map
*/


function getImageFor(pathIndex) {  
  return new Promise(function(resolve, reject) {
    download(function(err, data) {
      if (err) {
        reject(err);
      } else {
        // --
        // look here: we call resolve, and pass in data.
        // now our next chained method should receive data as an arg.
        resolve(data);
      }//end else
    });//end download
  });//end promise
}//end getImageFor

var i=0;///for loop here
getImageFor(i)  
  .then(function(song) {
    play(song);
  });


/*

    imagePromises = [];
    for (i = 0; i < pathQ.length; i++) {
        var theImage;
        var nextPromise = new Promise(function(resolve) {
            console.log('in promise for: ' + pathQ[i]);

            resolve();
            //resolve = loadImage(nextPathRec);
            theImage= new Image();
            console.log('pathQ[i].Path is: ' + pathQ[i].Path);
            theImage.src = pathQ[i].Path;
            theImage.onload = resolve(theImage);
            theImage.onerror = reject;
            console.log("settled for: "+pathQ[i]);
        }).then(function(someImage) {
            console.log('pushing sgit...');
            imageQ.push(someImage);
            console.log('someImage.src is : '+someImage.src);
            console.log('imageQ.length is now: '+imageQ.length);
        });
        console.log('nextPromise: '+JSON.stringify(nextPromise));
        //imagePromises.push(nextPromise);
    };//end for i
     
    console.log('imagePromises[1]: '+JSON.stringify(imagePromises[1]));
    console.log('iimageQ: '+imageQ);
*/

/*
    const output = Promise.all(imagePromises)
        .then(function() {
            console.log('in then');
            console.log('POST imagePromises[1]: '+imagePromises[1]);
            //imageQ.map(anImage => ctx.drawImage(anImage, 1, 1));
            for (i = 0; i < imageQ.length; i++) {
               ctx.drawImage(imageQ[i], 1, 1); 
            };//end for i
        });//end then function
*/



    //.then(results => 
    //results.map(
        //anImage => { 
        //return { 
        // in theory all images now loaded so...
        //ctx.drawImage(anImage, 1, 1);
        //};
   // }

}//end drawToken







//getTokenItems();
getTokenSets();

