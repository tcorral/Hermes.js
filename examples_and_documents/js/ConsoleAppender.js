(function(win, Hermes)
{
	'use strict';
	var ConsoleAppender,
		ConsoleLayout,
		Appender = Hermes.appender,
		Layout = Hermes.layout,
		Message = Hermes.message,
		Logger = Hermes.logger;
	/**
	 * existObjectAndMethod checks if sMethod exist on oObject
	 * @private
	 * @return {Boolean}
	 */
	function existObjectAndMethod(oObject, sMethod) {
		return oObject && oObject[sMethod];
	}
	/**
	 * ConsoleLayout is a class to format log messages.
	 * @extends Layout
	 * @private
	 * @class ConsoleLayout
	 * @constructor
	 */
	ConsoleLayout = function () {
		Layout.apply(this);
	};
	ConsoleLayout.prototype = new Layout();
	/**
	 * formatError is a method to format the error.
	 * @member ConsoleLayout.prototype
	 * @param oMessage
	 * @type {Message}
	 * @return String
	 */
	ConsoleLayout.prototype.format = function (oMessage) {
		var sError = '';
		if (oMessage instanceof Message) {
			sError = "Error level: " + oMessage.oLevel.toString() +
				", Time: " + oMessage.getFormattedDate();
			if (oMessage.sCategory !== null) {
				sError += ", Category: " + oMessage.sCategory;
			}
			if (oMessage.sMessage !== null) {
				sError += ", Message: " + oMessage.sMessage
			}
			if (oMessage.sFilenameUrl !== null) {
				sError += ", FilenameUrl: " + oMessage.sFilenameUrl
			}
			if (oMessage.nLineNumber !== null) {
				sError += ", LineNumber: " + oMessage.nLineNumber
			}
			sError += '.';
		}
		return sError;
	};
	/**
	 * ConsoleAppender is a class to append log messages in the console.
	 * @extends Appender
	 * @private
	 * @class ConsoleAppender
	 * @constructor
	 */
	ConsoleAppender = function (oLayout) {
		Appender.apply(this, arguments);
		/**
		 * sName is the name of the appender
		 * @member ConsoleAppender.prototype
		 * @type {String}
		 */
		this.sName = '[object ConsoleAppender]';
	};
	ConsoleAppender.prototype = new Appender();
	/**
	 * log is the method that logs the message to the console.
	 * Before log it's needed to check if console exist.
	 * @member ConsoleAppender.prototype
	 * @param oError
	 * @type {Message}
	 */
	ConsoleAppender.prototype.log = function (oError) {
		if (existObjectAndMethod(win.console, "log")) {
			win.console.log(this.oLayout.format(oError));
			return true;
		}
		return false;
	};
	/**
	 * clear is the method that clear all the logged messages in the console.
	 * Before clear it's needed to check if console exist.
	 * @member ConsoleAppender.prototype
	 */
	ConsoleAppender.prototype.clear = function () {
		if (existObjectAndMethod(win.console, "clear")) {
			win.console.clear();
			return true;
		}
		return false;
	};
	Logger.addAppender(new ConsoleAppender(new ConsoleLayout()));
}(window, Hermes));