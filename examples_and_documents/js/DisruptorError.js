(function(win, Hermes, und)
{
	'use strict';
	var DisruptorError,
		Message = Hermes.message,
		Level = Hermes.level,
		Logger = Hermes.logger,
		Utils = Message.utils,
		sMessage = 'DISRUPTOR_ERROR';

	/**
	 * DisruptorError is a special error class that will disrupt the execution.
	 * It will throw an error, that will not be logged by Hermes, to disrupt the execution.
	 * @extends Message
	 * @class DisruptorError
	 * @constructor
	 * @param sMessage
	 * @param sFilenameUrl
	 */
	DisruptorError = function(sMessage, sFilenameUrl)
	{
		Message.call(this, Level.DISRUPTOR, "Error that disrupt execution", sMessage, sFilenameUrl);
	};
	DisruptorError.prototype = new Message();

	var proxyNotifyAppender = Hermes.basic.prototype.notifyAppender;
	/**
	 * Overwrite Hermes notifyAppender to make fail if the type of message is
	 * DisruptorError
	 * @param {String} sAction
	 * @param {Message} oMessage
	 * @return {*}
	 */
	Hermes.basic.prototype.notifyAppender = function(sAction, oMessage)
	{
		proxyNotifyAppender.call(this, sAction, oMessage);
		/**
		 * This conditional checks if the instance of the error needs to stop the execution throwing an Error that will not be tracked again.
		 */
		if(oMessage !== und && oMessage instanceof DisruptorError)
		{
			throw new Error(sMessage);
		}
		return this;
	};
	/**
	 * isImmediate checks if nImmediate is equals to Hermes.IMMEDIATE
	 * @member Hermes.prototype
	 * @return {Boolean}
	 */
	Hermes.basic.prototype.isImmediate = function (oMessage) {
		return this.nImmediate === Hermes.basic.IMMEDIATE ||
				(oMessage !== und && oMessage instanceof DisruptorError);
	};
	/*
	 * fpErrorTrap is the method that will be called when uncaught errors are launched
	 * Returns false to avoid default behaviour.
	 * @return {Boolean}
	 */
	win.onerror = function fpErrorTrap(sErrorMsg, sFileNameUrl, nLineNumber) {
		/*
		 * This conditional checks for a Disruptor Error
		 */
		if(sErrorMsg.replace("Uncaught Error: ", "") !== sMessage)
		{
			Logger.addMessage(new Message(Hermes.oLevel, Utils.getTypeFromMessage(sErrorMsg), Utils.removeTypeFromMessage(sErrorMsg), sFileNameUrl, nLineNumber));
		}
		/**
		 * Return false avoids the browser to manage the errors.
		 */
		return false;
	};
	Hermes.extend('disruptorError', DisruptorError);
}(window, Hermes));