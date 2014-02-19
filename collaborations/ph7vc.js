exports.filter = function(original) 
{
	var orig = original.split(" ");
	var doge = ["very","much","so","wow","such","doge"];
	
	var finalString = "";
	
	for(var i = 0; i < orig.length; i++)
	{
		var randOrig = Math.round(Math.random() * orig.length) % orig.length;
		var randDoge = Math.round(Math.random() * doge.length) % doge.length;
		
		finalString += doge[randDoge] + " " + orig[randOrig] + ", ";
		orig.splice(randOrig, 1);
		doge.splice(randDoge, 1);
		
		if(doge.length > 1)
			break;
	}
	
	return finalString;
};