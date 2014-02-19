exports.filterize = function(original) {
	var oReq = new XMLHttpRequest();

	oReq.open("GET", 'badwords.txt', true);
	oReq.onload = function(e) 
	{
  		var myText = oReq.responseText; 
 	}
	oReq.send();
	return "Fulton's additions are: " + original + myText;
}