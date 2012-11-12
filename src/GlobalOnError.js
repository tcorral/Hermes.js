	(function(win, Hermes)
{
	'use strict';
	var Message = Hermes.message,
		Logger = Hermes.logger,
		Utils = Hermes.message.utils;
	/*
	 * fpErrorTrap is the method that will be called when uncaught errors are launched
	 * Returns false to avoid default behaviour.
	 * @return {Boolean}
	 */
	win.onerror = function fpErrorTrap(sErrorMsg, sFileNameUrl, nLineNumber) {
		Logger.addMessage(new Message(Logger.oLevel, Utils.getTypeFromMessage(sErrorMsg), Utils.removeTypeFromMessage(sErrorMsg), sFileNameUrl, nLineNumber));
		/**
		 * Return false avoids the browser to manage the errors.
		 */
		return false;
	};
}(window, Hermes));