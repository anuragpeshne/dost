var request = require('request');
var priceMatrix = undefined;
var matrixSize = 10000;
var chkingTimeout = 1000*60*30;			//chk every half an hour
var ownURL = "http://dontdostupidtasks.herokuapp.com/priceWatch";
var bombarding = {};
bombarding.status = true;
bombarding.URL = "http://www.flipkart.com/nikon-d5100-dslr-camera/p/itmduzhmeyjh2zec?q=Nikon+D5100+DSLR+Camera&as=on&as-show=on&otracker=start&as-pos=p_1&pid=CAMCXH4FFUDGAMHS";
bombarding.re =  /<span class=\"fk-font-verybig pprice fk-bold\"> Rs. \d+<\/span>/;
bombarding.freq = 1000*60*10;		//every 10min

exports.priceWatch = function(req, res){
	
	res.render('index', { title: 'dost: Don\'t dO Stupid Task', priceMatrix: priceMatrix });
};
exports.updatePrices = function(){
	if(priceMatrix === undefined){
		priceMatrix = new Array();
		updatePrices();
	}
}
exports.sendPriceMatrix = function(req, res){
	res.json(priceMatrix);
};

exports.startBombarding= function(){
	console.log("starting bombarding...");
	if(bombarding.matrix === undefined){
		bombarding.matrix = [];
		console.log("bombarding array created");
		bombard();
	}
}

exports.sendBombMatrix = function(req, res){
	res.json(bombarding.matrix);
}

function bombard(){
	scrapPrice(bombarding.URL, bombarding.re, updatePriceCallback, 'bomb');
	setTimeout(bombard, bombarding.freq);
}

function updatePrices(){
	var fpkProductURL = "http://www.flipkart.com/nikon-d5200-dslr-camera/p/itmdv58g4z5d2b9b?pid=CAMDF4FHEHKYNSHY&otracker=from-search&srno=t_1&query=5200&ref=e1a22cd3-5ce9-4dc7-b248-588aae72fe2b"
	var re = /<span class=\"fk-font-verybig pprice fk-bold\"> Rs. \d+<\/span>/;
	scrapPrice(fpkProductURL, re, updatePriceCallback, 'fpk');
	
	var amazonProductURL = "http://www.amazon.in/Nikon-D5200-24-1MP-Digital-Camera/dp/B00JM4VAC2/ref=sr_1_1?ie=UTF8&qid=1400419151&sr=8-1&keywords=5200"
	var re = /<span id=\"actualPriceValue\">.*<\/span>/
	scrapPrice(amazonProductURL, re, updatePriceCallback, 'ama');
	setTimeout(updatePrices, chkingTimeout);
	touchSelf();
}

function touchSelf(){
	request(ownURL, function(error, res,html){
			if(!error)
				console.log("toched:"+ownURL);
			else
				console.log(error);
		});
	setTimeout(touchSelf, 1000*60*50);									// touch self every 50minutes to refrain from sleeping
}

function updatePriceCallback(price, type){
	price = price.replace(/,/,'');					//clean the price
	console.log("new entry:"+price+type);
	var d = new Date();
	var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	var nd = new Date(utc + (3600000*(5.5)));					//offset is 5.5 for bombay
	if(type === 'bomb')
		bombarding.matrix.push([nd.getDate()+"/"+(parseInt(nd.getMonth())+1)+"@"+nd.getHours()+":"+nd.getMinutes(), price, type]);
	else
		priceMatrix.push([nd.getDate()+"/"+(parseInt(nd.getMonth())+1)+"@"+nd.getHours()+":"+nd.getMinutes(), price, type]);
	if(priceMatrix.length > matrixSize)
		priceMatrix.pop();
	console.log(priceMatrix);
}

function scrapPrice(URL, re, updateCallback, callbackArgs){
	request(URL, function(error, response, html){
		if(error){
			console.log(error);
		}
		else{
			var temp = html.match(re);
			if(temp !== null){
				var priceExtractorRe = /\d+,?\d+/;
				var price = temp[0].match(priceExtractorRe);
				updateCallback(price[0], callbackArgs);

			}
		}
	});
}
