var words = {
	"coinNamePrefix": ["Bit", "Digi", "Crypt", "Rai", "Priv", "Nano", "Ledger", "Block", "Decentra", "Trust", "Rai", "Claxo", "IO", "World pay", "Top", "Hack", "Hyper", "Q", "Data"],
	"coinNameSuffix": ["coin", "block", "bit", "store", "chain", "o", "xor", "xo", "ly", "pay"],
	
	"adjective": [
		"revolutionary",
		"novel",
		"up-and-coming",
		"exciting",
		"fascinating",
		"explosive",
		"documented",
		"safe",
		"convenient",
		"speculative",
		"disruptive"
	],
	
	"cryptoAdjective": [
		"trustless",
		"decentralised",
		"privacy-oriented",
		"distributed",
		"reputation-protocol-based",
		"Etherium-based",
		"AI-powered",
		"digital",
		"transparent",
		"broker-less",
		"tokenised",
		"autonomous",
		"peer-to-peer"
	],
	
	"cryptoSubject": [
		"the blockchain",
		"the problem of micropayments",
		"the proof-of-work initiative",
		"node-chains",
		"the scaling problem",
		"trust ensurance",
		"value evaluation",
		"AI",
		"machine learning",
		"financial trading"
	],
	
	"cryptoAsset": [
		"token",
		"asset",
		"coin"
	],

	"person": [
		"John McAffe",
		"Roger Ver",
		"Andreas Antonopoulos",
		"Satoshi"
	],

	"cryptoUseCase": [
		"wealth-storage",
		"remote verification",
		"value-extraction",
		"mining bitcoin"
	],
	
	"startingSentence": [
		"{coinname} is {a adjective}, {cryptoAdjective} approach to {cryptoSubject}.",
		"{coinname} is the world's first {cryptoAdjective} {cryptoAsset} designed with {cryptoSubject} in mind.",
		"Introducing {coinname}: a {cryptoAdjective} {cryptoAsset} which promises to revolutionise {cryptoSubject}.",
		"The future is here and the future is {coinname}.",
		"Examining the possibilities of {cryptoSubject} is {a adjective} topic of focus in recent times. The introduction of {coinname} will revolutionise the way we think about {cryptoSubject}.",
		"Our mission at {coinname} is to create {a cryptoAdjective} {cryptoAsset} which will become the world leading {cryptoAsset} for {cryptoUseCase}."
	],

	"genericPlatitude": [
		"{coinname} is being developed by the best minds in the crypo-space.",
		"{person} recently described {coinname} as \"{adjective}\".",
		"With a market capitalisation of ${random:3,500} billion, {coinname} is taking the cryptoworld by storm.",
		"{coinname} recently published its {adjective} whitepaper, and is opening an ICO shortly.",
		"Just last week, {coinname} grew by {random:50,17000}%.",
		"{coinname} is a must-have addition to any respectable crypto-portfolio.",
		"This is the future of trust.",
		"{coinname} is becoming the {cryptoAsset} of choice for {cryptoUseCase}.",
		"We recently demonstrated that {coinname} can produce up to {random:45,300}% improvement compared with Bitcoin, with regards to {cryptoSubject}.",
		""
	],

	"pleaForMoney": [
		"{coinname} can be obtained through our dedicated exchange: {coinname}Trade.",
		"The {coinname} team welcomes additional liquidity to faciliate growth.",
		"We highly recommend buying {coinname} now.",
		"", "", "", "", ""]
};

var coinname,
	random = function(array) {
		return array[Math.floor(Math.random() * array.length)]
	},
	startsWithVowel = function(str) {
		return str.startsWith('a') || str.startsWith('e') || str.startsWith('i') || str.startsWith('o') || str.startsWith('u');
	},
	

	interpolate = function(input) {
		var loopCount = 0;
		while (found = input.match(/{(.+?)}/i)) {
			loopCount += 1;
			// Some special matches
			if (found[1] === 'coinname') {
				input = input.replace('{coinname}', coinname);
			}
			else if (found[1].startsWith('random:')) {
				var min = parseInt(found[1].substr(7).split(',')[0], 10),
					max = parseInt(found[1].substr(7).split(',')[1], 10);

				input = input.replace(found[0], min + Math.floor((Math.random() * (max - min))));
			}
			else {
				var includeA = found[1].startsWith('a '),
					propertyName = includeA ? found[1].substr(2) : found[1],
					toReplace = random(words[propertyName]);

				if(includeA) {
					input = input.replace(found[0], (startsWithVowel(toReplace) ? 'an ' : 'a ') + toReplace);
				}
				else {
					input = input.replace(found[0], toReplace);
				}
				
			}
			if (loopCount > 30) {
				alert('stuck');
			}
		}
		return input;
	};


coinname = interpolate('{coinNamePrefix}{coinNameSuffix}');
document.getElementById('name').innerHTML = coinname;
document.getElementById('description').innerHTML = interpolate('{startingSentence} {genericPlatitude} {pleaForMoney}');

var fonts = ['Open Sans', 'Raleway', 'Roboto', 'PT Sans', 'Lato', 'sans-serif'];
document.getElementById('name').style.fontFamily = random(fonts);
document.getElementById('description').style.fontFamily = random(fonts);