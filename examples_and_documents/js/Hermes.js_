(function (win) {
  'use strict';
  /**
   * Hermes is the class that allows to log messages to different appenders depending of level to show.
   * Highly extensible. You can create your own Appenders and add it to Hermes.
   * The idea was to create an ErrorHandler in the same way as Log4JS but being more extensible.
   * @author Tomás Corral Casas
   * @version 1.0
   */
  /**
   * Hermes is the private declaration of the Hermes object.
   * Hermes is declared null by default.
   * @private
   * @type Hermes
   */
  var Hermes = null,
    /**
     * oHermes is the instance of Hermes object.
     * oHermes is declared null by default.
     * @private
     * @type Hermes
     */
    oHermes = null,
    /**
     * ErrorExt is the private declaration of the ErrorExt object.
     * ErrorExt is declared null by default.
     * @private
     * @type ErrorExt
     */
    ErrorExt = null,
    /**
     * Appender is the private declaration of the Appender object.
     * Appender is declared null by default.
     * @private
     * @type Appender
     */
    Appender = null,
    /**
     * ConsoleAppender is the private declaration of the ConsoleAppender object.
     * ConsoleAppender is declared null by default.
     * @private
     * @type ConsoleAppender
     */
    ConsoleAppender = null,
    /**
     * Layout is the private declaration of the Layout object.
     * Layout is declared null by default.
     * @private
     * @type Layout
     */
    Layout = null,
    /**
     * ConsoleLayout is the private declaration of the ConsoleLayout object.
     * ConsoleLayout is declared null by default.
     * @private
     * @type ConsoleLayout
     */
    ConsoleLayout = null,
    /**
     * Level is the private declaration of the Level object.
     * Level is declared null by default.
     * @private
     * @type Level
     */
    Level = null,
    /**
     * DateFormatter is the private declaration of the DateFormatter object.
     * DateFormatter is declared null by default.
     * @private
     * @type DateFormatter
     */
    DateFormatter = null,
    /**
     * nTimeoutToLogMilliseconds is the default value for nTimeout in Hermes to defer the log of message
     * If we need to log messages to one DB it's important not to launch so much Ajax calls
     * nTimeoutToLogMilliseconds is declared 10000 by default.
     * @private
     * @type Number
     */
    nTimeoutToLogMilliseconds = 10000;
  /**
   * isFunction checks if fpCallback is function or not
   * @private
   * @return {Boolean}
   */
  function isFunction(fpCallback) {
    return Object.prototype.toString.call(fpCallback) === '[object Function]';
  }
  /**
   * existObjectAndMethod checks if sMethod exist on oObject
   * @private
   * @return {Boolean}
   */
  function existObjectAndMethod(oObject, sMethod) {
    return oObject && isFunction(oObject[sMethod]);
  }
  /**
   * getTypeFromMessage returns the type of error extracted from message
   * @private
   * @returns {String}
   */
  function getTypeFromMessage(sMessage) {
    var nIndexDoubleColon = sMessage.indexOf(":");
    return sMessage.substr(0, nIndexDoubleColon);
  }
  /**
   * removeTypeFromMessage returns the message removing the error type
   * @private
   * @returns {String}
   */
  function removeTypeFromMessage(sMessage) {
    var sType = getTypeFromMessage(sMessage);
    return sMessage.replace(sType + ":", "");
  }
  /**
   * Appender is the class that will log or clear messages
   * @abstract
   * @private
   * @class Appender
   * @constructor
   * @param oLayout
   * @type {Layout}
   */
  Appender = function (oLayout) {
    /**
     * sName is the name of the appender
     * @member Appender.prototype
     * @type {String}
     */
    this.sName = '[object Appender]';
    /**
     * oLayout is the Layout instance to be used to format the error before append it
     * @member Appender.prototype
     * @type {Layout}
     */
    this.oLayout = oLayout || null;
  };
  /**
   * setName is the method to set the name of Appender
   * @member Appender.prototype
   * @param sName
   * @type {String}
   * @return Appender instance
   */
  Appender.prototype.setName = function (sName) {
    this.sName = sName;
    return this;
  };
  /**
   * setLayout is the method to set the layout for Appender
   * @member Appender.prototype
   * @param oLayout
   * @type {Layout}
   * @return Appender instance
   */
  Appender.prototype.setLayout = function (oLayout) {
    this.oLayout = oLayout;
    return this;
  };
  /**
   * toString is the method to overwrite the Object.prototype.toString
   * @member Appender.prototype
   * @return {String}
   */
  Appender.prototype.toString = function () {
    return this.sName;
  };
  /**
   * log is an abstract method that needs to be overwritten on extended classes to make it work.
   * @member Appender.prototype
   * @param oError
   * @type {ErroExt}
   */
  Appender.prototype.log = function (oError) {
    throw new Error("This method must be overwritten!");
  };
  /**
   * clear is an abstract method that needs to be overwritten on extended classes to make it work.
   * @member Appender.prototype
   */
  Appender.prototype.clear = function () {
    throw new Error("This method must be overwritten!");
  };
  /**
   * Layout is the class that will format the errors before send it to the Appender class
   * @abstract
   * @private
   * @class Layout
   * @constructor
   */
  Layout = function () {

  };
  /**
   * formatError is an abstract method that needs to be overwritten on extended classes to make it work.
   * @member Layout.prototype
   * @param oError
   * @type {ErroExt}
   */
  Layout.prototype.formatError = function (oError) {
    throw new Error("This method must be overwritten!");
  };
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
   * @param oError
   * @type {ErrorExt}
   * @return sError
   * @type {String}
   */
  ConsoleLayout.prototype.formatError = function (oError) {
    var sError = '';
    if (oError instanceof ErrorExt) {
      sError = "Error level: " + oError.oLevel.toString() +
        ", Time: " + oError.getFormattedDate() +
        ", Category: " + oError.sCategory +
        ", Message: " + oError.sMessage +
        ", FilenameUrl: " + oError.sFilenameUrl +
        ", LineNumber: " + oError.nLineNumber;
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
    /**
     * oLayout is the Layout instance to be used to format the error before append it
     * @member ConsoleAppender.prototype
     * @type {ConsoleLayout}
     */
    this.oLayout = new ConsoleLayout();
  };
  ConsoleAppender.prototype = new Appender();
  /**
   * log is the method that logs the message to the console.
   * Before log it's needed to check if console exist.
   * @member ConsoleAppender.prototype
   * @param oError
   * @type {ErrorExt}
   */
  ConsoleAppender.prototype.log = function (oError) {
    if (existObjectAndMethod(win.console, "log")) {
      win.console.log(this.oLayout.formatError(oError));
    }
  };
  /**
   * clear is the method that clear all the logged messages in the console.
   * Before clear it's needed to check if console exist.
   * @member ConsoleAppender.prototype
   */
  ConsoleAppender.prototype.clear = function () {
    if (existObjectAndMethod(win.console, "clear")) {
      win.console.clear();
    }
  };
  /**
   * Hermes is the class that manages Appenders, Error, Deferred calls and Levels of Error to show
   * We can add Errors but if the Error is not of the same level the error will not be showed.
   * If the Hermes Error Level is ALL all the logs will be added
   * If the Hermes Error Level is OFF no log will be added
   * The add of logs can be deferred to avoid multiple calls that block browser
   * @private
   * @class Hermes
   * @constructor
   * @param oLevel
   * @type {Level}
   * @param nImmediate
   * @type {Number}
   * @param nTimeout
   * @type {Number}
   */
  Hermes = function (oLevel, nImmediate, nTimeout) {
    /**
     * oAppenders is the object that will contain the Appenders to append messages
     * @member Hermes.prototype
     * @type {Object}
     */
    this.oAppenders = {};
    /**
     * aErrors is the array that will contain the Errors
     * @member Hermes.prototype
     * @type {Array}
     */
    this.aErrors = [];
    /**
     * oLevel is the Level instance to manage the Error Level to show.
     * @member Hermes.prototype
     * @type {Level}
     */
    this.oLevel = oLevel || Level.ALL;
    /**
     * nTimeLastSent is the number of milliseconds of the last sent
     * now date by default
     * @member Hermes.prototype
     * @type {Number}
     */
    this.nTimeLastSent = this.now();
    /**
     * nImmediate is the config number to defer or not the append of logs
     * @member Hermes.prototype
     * @type {Number}
     */
    this.nImmediate = nImmediate || Hermes.DEFERRED;
    /**
     * nTimeout is the number of milliseconds to defer the append of logs
     * @member Hermes.prototype
     * @type {Number}
     */
    this.nTimeout = nTimeout || nTimeoutToLogMilliseconds;
  };
  /**
   * @static
   */
  Hermes.DEFERRED = 0;
  /**
   * @static
   */
  Hermes.IMMEDIATE = 1;
  /**
   * deferLog change the method to append logs to be deferred
   * @member Hermes.prototypè
   * @return Hermes instance
   */
  Hermes.prototype.deferLog = function () {
    this.nImmediate = Hermes.DEFERRED;
    return this;
  };
  /**
   * immediateLog change the method to append logs to be immediate
   * @member Hermes.prototypè
   * @return Hermes instance
   */
  Hermes.prototype.immediateLog = function () {
    this.nImmediate = Hermes.IMMEDIATE;
    return this;
  };
  /**
   * now returns the number of milliseconds at the moment of the execution of this method
   * @member Hermes.prototype
   * @return {Number} Milliseconds
   */
  Hermes.prototype.now = function () {
    return +new Date();
  };
  /**
   * setLevel set a new Level for the Hermes
   * Before change the level it's checked if oLevel is instance of Level to be assigned or not.
   * @member Hermes.prototype
   * @param oLevel
   * @type {Level}
   * @return Hermes instance
   */
  Hermes.prototype.setLevel = function (oLevel) {
    if (oLevel instanceof Level) {
      this.oLevel = oLevel;
    }
    return this;
  };
  /**
   * addAppender add a new Appender to Hermes. When the Appender is added starts to log messages
   * Before add a new Appender it's checked if oAppender is instance of Appender to be added or not.
   * @member Hermes.prototype
   * @param oAppender
   * @type {Appender}
   * @return Hermes instance
   */
  Hermes.prototype.addAppender = function (oAppender) {
    if (oAppender instanceof Appender) {
      this.oAppenders[oAppender.toString()] = oAppender;
    }
    return this;
  };
  /**
   * removeAppender removes the Appender. When the Appender is removed stops to log messages
   * @member Hermes.prototype
   * @param oAppender
   * @type {Appender}
   * @return Hermes instance
   */
  Hermes.prototype.removeAppender = function (oAppender) {
    delete this.oAppenders[oAppender.toString()];
    return this;
  };
  /**
   * setAppenders add an array of Appenders to be added in one step.
   * @member Hermes.prototype
   * @param aAppenders
   * @type {Array}
   * @return Hermes instance
   */
  Hermes.prototype.setAppenders = function (aAppenders) {
    var nAppender = 0,
      nLenAppenders = aAppenders.length,
      oAppender = null;

    for (; nAppender < nLenAppenders;) {
      oAppender = aAppenders[nAppender];
      this.addAppender(oAppender);
      nAppender = nAppender + 1;
    }
    try {
      return this;
    } finally {
      nAppender = nLenAppenders = oAppender = null;
    }
  };
  /**
   * isSameLevel checks if the Error Level is the same that in oError
   * The method returns true if Level is ALL to allow log all the logs
   * The method returns false if Level is OFF to avoid log any log
   * @member Hermes.prototype
   * @param oError
   * @type {ErrorExt}
   * @return {Boolean}
   */
  Hermes.prototype.isSameLevel = function (oError) {
    if (this.oLevel.valueOf() === Level.nALL) {
      return true;
    } else if (this.oLevel.valueOf() === Level.OFF) {
      return false;
    } else {
      return this.oLevel.valueOf() === oError.oLevel.valueOf();
    }
  };
  /**
   * sendMessage executes the action in Appender for each Error.
   * @member Hermes.prototype
   * @param oAppender
   * @type {Appender}
   * @param sAction
   * @type {String}
   */
  Hermes.prototype.sendMessage = function (oAppender, sAction) {
    if (typeof oAppender[sAction] === "undefined") {
      return;
    }
    var nError = 0,
      nLenError = this.aErrors.length,
      oError = null;

    for (; nError < nLenError;) {
      oError = this.aErrors[nError];
      if (this.isSameLevel(oError)) {
        oAppender[sAction](oError);
      }
      nError = nError + 1;
    }
    this.nTimeLastSent = this.now();
  };
  /**
   * isImmediate checks if nImmediate is equals to Hermes.IMMEDIATE
   * @member Hermes.prototype
   * @return {Boolean}
   */
  Hermes.prototype.isImmediate = function () {
    return this.nImmediate === Hermes.IMMEDIATE;
  };
  /**
   * isTimeToSent checks if now is time to sent new logs to the appender
   * @member Hermes.prototype
   * @return {Boolean}
   */
  Hermes.prototype.isTimeToSent = function () {
    return this.nextTimeToSent() >= this.now();
  };
  /**
   * notifyAppenders send the message log for all the Appenders if the execution is Deferred and is time to send new logs or if the execution is Immediate.
   * after execute notifyAppenders the errors are reset to allow new Errors to log.
   * @member Hermes.prototype
   * @param sAction
   * @type {String}
   * @return Hermes instance
   */
  Hermes.prototype.notifyAppenders = function (sAction) {
    var sKey = '',
      oAppender = null;
    sAction = sAction.toLowerCase();

    if ((!this.isImmediate() && this.isTimeToSent()) || this.isImmediate()) {
      for (sKey in this.oAppenders) {
        if (this.oAppenders.hasOwnProperty(sKey)) {
          oAppender = this.oAppenders[sKey];
          this.sendMessage(oAppender, sAction);
        }
      }
      this.resetErrors();
    }
    return this;
  };
  /**
   * addError check if oError is instance of ErrorExt and if it's the error is added and the notifyAppenders is called
   * notifyAppenders is executed to defer or log the message.
   * @member Hermes.prototype
   * @param oError
   * @type {ErrorExt}
   * @return Hermes instance
   */
  Hermes.prototype.addError = function (oError) {
    if (oError instanceof ErrorExt) {
      this.aErrors.push(oError);
      this.notifyAppenders('log');
    }
    return this;
  };
  /**
   * resetErrors clean all the erros in the aErrors Array
   * @member Hermes.prototype
   */
  Hermes.prototype.resetErrors = function () {
    this.aErrors = [];
  };
  /**
   * nextTimeToSent returns the time to know, if the method of log is Deferred, if it's possible to log messages.
   * @member Hermes.prototype
   * @return {Number}
   */
  Hermes.prototype.nextTimeToSent = function () {
    return this.nTimeLastSent + this.nTimeout;
  };
  /**
   * forceLog will log messages even if the method of log is Deferred.
   * @member Hermes.prototype
   * @return Hermes instance
   */
  Hermes.prototype.forceLog = function () {
    this.immediateLog();
    this.log();
    this.deferLog();
    return this;
  };
  /**
   * log is the method that will log messages
   * @member Hermes.prototype
   */
  Hermes.prototype.log = function () {
    this.notifyAppenders("log");
  };
  /**
   * clear is the method that will clear messages
   * @member Hermes.prototype
   */
  Hermes.prototype.clear = function () {
    this.notifyAppenders("clear");
  };
  /**
   * DateFormatter is the class to format dates
   * @private
   * @class DateFormatter
   * @constructor
   * @param sFormat
   * @type {String}
   */
  DateFormatter = function (sFormat) {
    this.sFormat = sFormat || DateFormatter.DEFAULT;
  };
  /**
   * @static
   */
  DateFormatter.DEFAULT = "yyyy-MM-dd  hh:mm:ss TZ";
  /**
   * setDefaultFormat change the format to format the date
   * @member DateFormatter.prototype
   * @param sFormat
   * @type {String}
   * @return DateFormatter instance
   */
  DateFormatter.prototype.setDefaultFormat = function (sFormat) {
    this.sFormat = sFormat || DateFormatter.DEFAULT;
    return this;
  };
  /**
   * formatDate returns the string with the formatted date.
   * @member DateFormatter.prototype
   * @param oDate
   * @type {Date}
   */
  DateFormatter.prototype.formatDate = function (oDate) {
    var nDay = this.addZero(oDate.getDate()),
      nMonth = this.addZero(oDate.getMonth() + 1),
      nYearLong = oDate.getFullYear(),
      nYearShort = String(nYearLong).substring(3, 4),
      nYear = this.sFormat.indexOf("yyyy") > -1 ? nYearLong : nYearShort,
      nHours = this.addZero(oDate.getHours()),
      nMinutes = this.addZero(oDate.getMinutes()),
      nSeconds = this.addZero(oDate.getSeconds()),
      nTimeZone = this.getTimeZoneOffset(oDate),
      sDate = this.sFormat.replace(/dd/g, nDay).replace(/MM/g, nMonth).replace(/y{1,4}/g, nYear);
    sDate = sDate.replace(/hh/g, nHours).replace(/mm/g, nMinutes).replace(/ss/g, nSeconds);
    sDate = sDate.replace(/TZ/g, nTimeZone);
    try {
      return sDate;
    } finally {
      nDay = nMonth = nYearLong = nYearShort = nYear = nHours = nMinutes = nSeconds = nTimeZone = sDate = null;
    }
  };
  /**
   * addZero is a method that adds a Zero to all the number that are less than 10
   * @member DateFormatter.prototype
   * @param nNumber
   * @type {Number}
   * @return {String}
   */
  DateFormatter.prototype.addZero = function (nNumber) {
    return ((nNumber < 10) ? "0" : "") + nNumber;
  };
  /**
   * getTimeZoneOffset set the timezone and returns the difference
   * @member DateFormatter.prototype
   * @param oDate
   * @type {Date}
   * @return {String}
   */
  DateFormatter.prototype.getTimeZoneOffset = function (oDate) {
    var nOffset = Math.abs(oDate.getTimezoneOffset()),
      nHour = this.addZero(Math.floor(nOffset / 60)),
      nMinutes = this.addZero((nOffset % 60));
    try {
      return oDate.getTimezoneOffset() < 0 ? "+" + nHour + ":" + nMinutes : "-" + nHour + ":" + nMinutes;
    } finally {
      nOffset = nHour = nMinutes = null;
    }
  };
  /**
   * ErrorExt is the class that represents the Error
   * @private
   * @class ErrorExt
   * @constructor
   * @param oLevel
   * @type {Level}
   * @param sCategory
   * @type {String}
   * @param sMessage
   * @type {String}
   * @param sFilenameUrl
   * @type {String}
   * @param nLineNumber
   * @type {Number}
   * @param sDateFormat
   * @type {String}
   */
  ErrorExt = function (oLevel, sCategory, sMessage, sFilenameUrl, nLineNumber, sDateFormat) {
    /**
     * oLevel is the Error Level to know if it can be logged or not.
     * @member ErrorExt.prototype
     * @type {Level}
     */
    this.oLevel =  oLevel || Level.ALL;
    /**
     * sCategory is the error category
     * @member ErrorExt.prototype
     * @type {String}
     */
    this.sCategory = sCategory || 'GENERAL';
    /**
     * sMessage is the error message
     * @member ErrorExt.prototype
     * @type {String}
     */
    this.sMessage = sMessage || 'Error Undefined';
    /**
     * dInitialize sets the instanciation date
     * @member ErrorExt.prototype
     * @type {Date}
     */
    this.dInitialize = new Date();
    /**
     * oDateFormatter is the instance of DateFormatter after set the default format
     * @member ErrorExt.prototype
     * @type {DateFormatter}
     */
    this.oDateFormatter = new DateFormatter().setDefaultFormat(sDateFormat);
    /**
     * sFilenameUrl is the url or filename to the file where the error is launched
     * @member ErrorExt.prototype
     * @type {String}
     */
    this.sFilenameUrl = sFilenameUrl || 'undefined file';
    /**
     * nFileNumber is the number of line where the error is launched
     */
    this.nLineNumber = nLineNumber || 'undefined line';
  };
  /**
   * setFilenameUrl change the sFilenameUrl
   * @member ErrorExt.prototype
   * @param sFilenameUrl
   * @type {String}
   * @return ErrorExt instance
   */
  ErrorExt.prototype.setFilenameUrl = function (sFilenameUrl) {
    this.sFilenameUrl = sFilenameUrl;
    return this;
  };
  /**
   * setLineNumber change the nLineNumber
   * @member ErrorExt.prototype
   * @param nLineNumber
   * @type {Number}
   * @return ErrorExt instance
   */
  ErrorExt.prototype.setLineNumber = function (nLineNumber) {
    this.nLineNumber = nLineNumber;
    return this;
  };
  /**
   * setCategory change the sCategory
   * @member ErrorExt.prototype
   * @param sCategory
   * @type {String}
   * @return ErrorExt instance
   */
  ErrorExt.prototype.setCategory = function (sCategory) {
    this.sCategory = sCategory;
    return this;
  };
  /**
   * setLevel change the level if oLevel is instance of Level
   * @member ErrorExt.prototype
   * @param oLevel
   * @type {Level}
   * @return ErrorExt instance
   */
  ErrorExt.prototype.setLevel = function (oLevel) {
    if (oLevel instanceof Level) {
      this.oLevel = oLevel;
    }
    return this;
  };
  /**
   * setMessage change the sMessage
   * @member ErrorExt.prototype
   * @param sMessage
   * @type {String}
   * @return ErrorExt instance
   */
  ErrorExt.prototype.setMessage = function (sMessage) {
    this.sMessage = sMessage;
    return this;
  };
  /**
   * setDateFormat change the sDateFormat
   * @member ErrorExt.prototype
   * @param sDateFormat
   * @type {String}
   * @return ErrorExt instance
   */
  ErrorExt.prototype.setDateFormat = function (sDateFormat) {
    this.sDateFormat = sDateFormat;
    return this;
  };
  /**
   * getFormattedDate returns the error Date afte format it
   * @member ErrorExt.prototype
   * @return {String}
   */
  ErrorExt.prototype.getFormattedDate = function () {
    return this.oDateFormatter.formatDate(this.dInitialize);
  };
  /**
   * Level is the class that sets the Error level
   * @private
   * @class Level
   * @constructor
   * @param nLevel
   * @type {Level}
   * @param sLevel
   * @type {String}
   */
  Level = function (nLevel, sLevel) {
    this.nLevel = nLevel;
    this.sLevel = sLevel;
  };
  /**
   * getLevel return the Level from the sLevel Name
   * @param sLevel
   * @type {String}
   * @return oNewLevel
   * @type Level
   */
  Level.prototype.getLevel = function (sLevel) {
    var oNewLevel = Level[sLevel];
    if (typeof oNewLevel !== "undefined") {
      return oNewLevel;
    }
    oNewLevel = null;
  };
  /**
   * toString overwrittes the Object.prototype.toString to return the name of the Level
   * @return sLevel
   * @type {String}
   */
  Level.prototype.toString = function () {
    return this.sLevel;
  };
  /**
   * valueOf returns the number of Level
   * @return nLevel
   * @type {Number}
   */
  Level.prototype.valueOf = function () {
    return this.nLevel;
  };
  /**
   * @static
   * @type {Number}
   */
  Level.nOFF = Number.MAX_VALUE;
   /**
   * @static
   * @type {Number}
   */
  Level.nFATAL = 50000;
   /**
   * @static
   * @type {Number}
   */
  Level.nERROR = 40000;
   /**
   * @static
   * @type {Number}
   */
  Level.nWARNING = 30000;
   /**
   * @static
   * @type {Number}
   */
  Level.nINFO = 20000;
   /**
   * @static
   * @type {Number}
   */
  Level.nDEBUG = 10000;
   /**
   * @static
   * @type {Number}
   */
  Level.nTRACE = 5000;
   /**
   * @static
   * @type {Number}
   */
  Level.nALL = Number.MIN_VALUE;
   /**
   * @static
   * @type {Level}
   */
  Level.OFF = new Level(Level.nOFF, "OFF");
   /**
   * @static
   * @type {Level}
   */
  Level.FATAL = new Level(Level.nFATAL, "FATAL");
   /**
   * @static
   * @type {Level}
   */
  Level.ERROR = new Level(Level.nERROR, "ERROR");
   /**
   * @static
   * @type {Level}
   */
  Level.WARNING = new Level(Level.nWARNING, "WARN");
   /**
   * @static
   * @type {Level}
   */
  Level.INFO = new Level(Level.nINFO, "INFO");
   /**
   * @static
   * @type {Level}
   */
  Level.DEBUG = new Level(Level.nDEBUG, "DEBUG");
   /**
   * @static
   * @type {Level}
   */
  Level.TRACE = new Level(Level.nTRACE, "TRACE");
   /**
   * @static
   * @type {Level}
   */
  Level.ALL = new Level(Level.nALL, "ALL");

  /*
   * oHermes is the instance of Hermes.
   */
  oHermes = new Hermes(Level.ALL, Hermes.IMMEDIATE).addAppender(new ConsoleAppender());

  /*
   * fpErrorTrap is the method that will be called when uncaught errors are launched
   * Returns false to avoid default behaviour.
   * @return {Boolean}
   */
  win.onerror = function fpErrorTrap(oErrorMsg, sFileNameUrl, nLineNumber) {
    oHermes.addError(new ErrorExt(oHermes.oLevel, getTypeFromMessage(oErrorMsg), removeTypeFromMessage(oErrorMsg), sFileNameUrl, nLineNumber));
    return false;
  };
  /*
   * This object expose the private classes as global to use it from outside of the module.
   */
  win.Hermes = {
    logger: oHermes,
    appender: Appender,
    level: Level,
    error: ErrorExt,
    layout: Layout
  };
}(window));
