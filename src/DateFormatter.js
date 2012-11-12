(function(Hermes)
{
	'use strict';
	var DateFormatter;
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
	 * DEFAULT is the string to be used to format date by default
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
			sYearShort = String(nYearLong).substring(3, 4),
			nYear = this.sFormat.indexOf("yyyy") > -1 ? nYearLong : sYearShort,
			nHours = this.addZero(oDate.getHours()),
			nMinutes = this.addZero(oDate.getMinutes()),
			nSeconds = this.addZero(oDate.getSeconds()),
			nTimeZone = this.getTimeZoneOffset(oDate),
			sDate = this.sFormat.replace(/dd/g, nDay).replace(/MM/g, nMonth).replace(/y{1,4}/g, nYear);
		sDate = sDate.replace(/hh/g, nHours).replace(/mm/g, nMinutes).replace(/ss/g, nSeconds);
		sDate = sDate.replace(/TZ/g, nTimeZone);
		/*
		 * try-finally pattern is used to be able to remove all the variables from memory when using it in a method that returns something.
		 * return is don in try and the 'nullify' of variables must be done in the finally block.
		 */
		try {
			return sDate;
		} finally {
			nDay = nMonth = nYearLong = nYear = nHours = nMinutes = nSeconds = nTimeZone = sDate = null;
			sYearShort = null;
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
		/*
		 * try-finally pattern is used to be able to remove all the variables from memory when using it in a method that returns something.
		 * return is don in try and the 'nullify' of variables must be done in the finally block.
		 */
		try {
			return oDate.getTimezoneOffset() < 0 ? "+" + nHour + ":" + nMinutes : "-" + nHour + ":" + nMinutes;
		} finally {
			nOffset = nHour = nMinutes = null;
		}
	};
	Hermes.message.setDateFormatter(new DateFormatter().setDefaultFormat(DateFormatter.DEFAULT));
}(Hermes));