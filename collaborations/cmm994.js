exports.filter = function (message)
{
	var subLength = Math.round(Math.random()*message.length);
	return message.substring(0,subLength);
}