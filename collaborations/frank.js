exports.filter = function ( original ) {
	var split_message = original.split(" ");
	for (var i = split_message.length - 1; i >= 0; i--) {
		split_message[i] = split_message[i] + "sh";
	};
	var message = split_message.join(" ");

	return 'iTap text message: \'' + message + '..hic!';
}