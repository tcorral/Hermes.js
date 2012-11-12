(function(win, Hermes)
{
	'use strict';
	var Message = Hermes.message,
		Level = Hermes.level,
		Logger = Hermes.logger,
		Trace, Tracer, TraceMessage;
	/**
	 * TraceMessage is the message class for automatic Trace
	 * @private
	 * @extends Message
	 * @class TraceMessage
	 * @constructor
	 * @param sMessage
	 * @type {String}
	 */
	TraceMessage = function(sMessage) {
		Message.apply(this, [Level.TRACE, 'Trace Message', sMessage]);
	};
	TraceMessage.prototype = new Message();
	/**
	 * Trace is the class that manage all the info to be used in Tracer.
	 * @private
	 * @class Trace
	 * @constructor
	 * @param oConstructor
	 * @type {Function}
	 * @param sMethodName
	 * @type {String}
	 * @param oTracer
	 * @type {Tracer}
	 */
	Trace = function (oConstructor, sMethodName, oTracer) {
		/**
		 * sIndentString is the number of spaces to indent functions.
		 * Missing modification - maybe in the next version -
		 * @member Trace.prototype
		 * @type {String}
		 */
		this.sIndentString = '';
		/**
		 * oConstructor is the oConstructor to trace
		 * @member Trace.prototype
		 * @type {Function}
		 */
		this.oConstructor = oConstructor;
		/**
		 * sMethodName is the name of the oConstructor
		 * @member Trace.prototype
		 * @type {String}
		 */
		this.sMethodName = sMethodName;
		/**
		 * oTracer is the reference to the Tracer
		 * @member Trace.prototype
		 * @type {Tracer}
		 */
		this.oTracer = oTracer;
	};
	/**
	 * formatArguments returns the arguments passed to the function as a string
	 * @member Trace.prototype
	 * @param aArgs
	 * @type {Array}
	 * @return {String}
	 */
	Trace.prototype.formatArguments = function (aArgs) {
		return '(' + aArgs.join(", ") + ')';
	};
	/**
	 * getIndentation returns the indentation
	 * @member Trace.prototype
	 * @return {String}
	 */
	Trace.prototype.getIndentation = function () {
		return this.sIndentString;
	};
	/**
	 * getMethodNameIndentedAndParams return the string with method name and formatted arguments.
	 * @member Trace.prototype
	 * @return {String}
	 */
	Trace.prototype.getMethodNameIndentedAndParams = function(aArgs) {
		return (this.getIndentation() + this.sMethodName + this.formatArguments(aArgs));
	};
	/**
	 * getProfile return the string with method name, result and time that took the execution
	 * @member Trace.prototype
	 * @return {String}
	 */
	Trace.prototype.getProfile = function(nStart, oResult) {
		return this.getIndentation(true) + this.sMethodName + ' -> result: ' + oResult + '. (' + (+new Date() - nStart) + 'ms)';
	};
	/**
	 * wrap is the method to wrap all the methods to trace
	 * @member Trace.prototype
	 */
	Trace.prototype.wrap = function() {
		var sKey;
		for (sKey in this.oConstructor) {
			this[sKey] = this.oConstructor[sKey];
		}
	};
	/**
	 * Tracer is the class that start the automatic tracer for the element that you want to trace
	 * Is possible to trace more than one object at the same time.
	 * @private
	 * @class Tracer
	 * @constructor
	 */
	Tracer = function () {
		/**
		 * rNativeCode is the regular expression that returns if the content is native code or not.
		 * @member Tracer.prototype
		 * @type {RegExp}
		 */
		this.rNativeCode = /\[native code\]/;
		/**
		 * nIndentCount is the number of indents.
		 * Missing modification - maybe in the next version -
		 * @member Tracer.prototype
		 * @type {Number}
		 */
		this.nIndentCount = -4;
		/**
		 * aTracing is the array where all the trace elements will be saved to remove it if needed
		 * @member Tracer.prototype
		 * @type {Array}
		 */
		this.aTracing = [];
	};
	/**
	 * trace gets the method to trace and wraps his content
	 * @member Tracer.prototype
	 * @param oConstructor
	 * @type {Function}
	 * @param sMethodName
	 * @type {String}
	 * @return {function} Depends of the execution
	 */
	Tracer.prototype.trace = function (oConstructor, sMethodName) {
		var oTrace = new Trace(oConstructor, sMethodName, this);
		oTrace.wrap();
		Logger.addMessage(new TraceMessage("Tracing: " + sMethodName));
		return function () {
			var oResult,
				nStart = +new Date(),
				aArgs = [].slice.call(arguments);
			Logger.addMessage(new TraceMessage(oTrace.getMethodNameIndentedAndParams(aArgs)));
			oResult = oConstructor.apply(oTrace, arguments);
			Logger.addMessage(new TraceMessage(oTrace.getProfile(nStart, oResult)));
			return oResult;
		}
	};
	/**
	 * addTracing adds a new element to trace
	 * @member Tracer.prototype
	 * @param oTracing
	 * @type {Trace}
	 */
	Tracer.prototype.addTracing = function(oTracing) {
		this.aTracing.push(oTracing);
	};
	/**
	 * traceAll trace all the methods in oRoot to be traceable
	 * @member Tracer.prototype
	 * @param oRoot
	 * @type {Object}
	 * @param bRecursive
	 * @type {Boolean}
	 */
	Tracer.prototype.traceAll = function (oRoot, bRecursive) {
		var sKey, oThat;

		if ((oRoot === win) || !((typeof oRoot === 'object')) || (typeof oRoot === 'function')) {
			return;
		}
		for (sKey in oRoot) {
			if (oRoot[sKey] !== oRoot) {
				oThat = oRoot[sKey];
				if (typeof oThat === 'function') {
					if ((this !== oRoot) && !oThat.oConstructor && !this.rNativeCode.test(oThat)) {
						oRoot[sKey] = this.trace(oRoot[sKey], sKey);
						this.addTracing({
							oObj: oRoot,
							sMethodName: sKey
						});
					}
				}
				bRecursive && this.traceAll(oThat, true);
			}
		}
	};
	/**
	 * resetTracing removes all the traceable elements
	 * @member Tracer.prototype
	 */
	Tracer.prototype.resetTracing = function () {
		this.aTracing = [];
	};
	/**
	 * untraceAll removes all the traceable elements and restore the original object
	 * @member Tracer.prototype
	 */
	Tracer.prototype.untraceAll = function () {
		var nTrace = 0;
		var aTracing = this.aTracing;
		var nLenTrace = aTracing.length;
		var oTrace = null;
		for (; nTrace < nLenTrace; nTrace++) {
			oTrace = aTracing[nTrace];
			oTrace.oObj[oTrace.sMethodName] = oTrace.oObj[oTrace.sMethodName].oConstructor;
		}
		Logger.addMessage(new TraceMessage("Tracing disabled"));
		this.resetTracing();
	};
	Hermes.extend('tracer', new Tracer());
}(window, Hermes));