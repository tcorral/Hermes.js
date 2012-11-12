/**
 * FileAppender is an extension to append messages to one file in the computer
 * It makes use of the HTML5 FileApi
 * @author Tomás Corral Casas
 * @fileOverview
 * @version 1.0
 */
(function (win, Hermes) {
	'use strict';

	var Level, Logger, Appender, Message, Layout, BlobBuilder, FileAppender, FileLayout, sFileName, nFileSize, nPersistence, oFileAppender;

	/**
	 * Level is a reference to Level from Hermes
	 * @private
	 * @type {Level}
	 */
	Level = Hermes.level;
	/**
	 * Logger is a reference to the Logger instance
	 * @private
	 * @type {Logger}
	 */
	Logger = Hermes.logger;
	/**
	 * Appender is a reference to the Appender abstract class
	 * @private
	 * @type {Appender}
	 */
	Appender = Hermes.appender;
	/**
	 * Message is a reference to the ErrorExt class
	 * @private
	 * @type {Message}
	 */
	Message = Hermes.message;
	/**
	 * Layout is a reference to the Layout abstract class
	 * @private
	 * @type {Layout}
	 */
	Layout = Hermes.layout;
	/**
	 * BlobBuilder is an adapter to set the BlobBuilder
	 * @private
	 * @type {BlobBuilder}
	 */
	BlobBuilder = win.BlobBuilder || win.WebKitBlobBuilder;
	/**
	 * sFileName is the private declaration that will be the path to the created log file
	 * @private
	 * @type {String}
	 */
	sFileName = 'C:\\logError.txt';
	/**
	 * nFileSize is the private declaration that will be the size of the log file to be created
	 * nFileSize is declared 5mb by default
	 * @private
	 * @type {Number}
	 */
	nFileSize = 1024 * 1024 * 5;
	/**
	 * nPersistence is the private reference to the persistance type
	 * nPersistence is declared PERSISTENT by default.
	 */
	nPersistence = win.PERSISTENT;

	/**
	 * set the requestFileSystem.
	 */
	win.requestFileSystem = win.requestFileSystem || win.webkitRequestFileSystem;
	/**
	 * Check if the requestFileSystem and all his dependencies are available before add the FileAppender
	 */
	if (typeof win.requestFileSystem === "undefined" || !(win.File && win.FileReader && win.FileList && win.Blob)) {
		Logger.addMessage(new Message(Level.ERROR, "FileError", "The File APIs are not fully supported in this browser.", "FileAppender", 21));
		return;
	}
	/**
	 * FileLayout is a class to format log messages.
	 * @extends Layout
	 * @private
	 * @class FileLayout
	 * @constructor
	 */
	FileLayout = function () {
		Layout.apply(this);
	};
	FileLayout.prototype = new Layout();
	/**
	 * formatError is a method to format the error.
	 * @member FileLayout.prototype
	 * @param {Message} oError
	 * @return {String} sError
	 */
	FileLayout.prototype.format = function (oError) {
		var sError = '';
		if (oError instanceof Message) {
			sError = "Error level: " + oError.oLevel.toString() +
				", Time: " + oError.getFormattedDate() +
				", Category: " + oError.sCategory +
				", Message: " + oError.sMessage +
				", FilenameUrl: " + oError.sFilenameUrl +
				", LineNumber: " + oError.nLineNumber + "\n";
		}
		return sError;
	};
	/**
	 * FileAppender is a class to append log messages in the console.
	 * @extends Appender
	 * @private
	 * @class FileAppender
	 * @constructor
	 */
	FileAppender = function () {
		Appender.apply(this);
		this.sName = '[object FileAppender]';
		this.oLayout = new FileLayout();
	};
	FileAppender.prototype = new Appender();
	/**
	 * HTML5 FileApi ErrorHandler
	 * @member FileAppender.prototype
	 * @param erError
	 * @type {Error}
	 */
	FileAppender.prototype.onErrorHandler = function (erError) {
		var sMsg = '';
		switch (erError.code) {
			case FileError.QUOTA_EXCEEDED_ERR:
				sMsg = 'QUOTA_EXCEEDED_ERR';
				break;
			case FileError.NOT_FOUND_ERR:
				sMsg = 'NOT_FOUND_ERR';
				break;
			case FileError.SECURITY_ERR:
				sMsg = 'SECURITY_ERR';
				break;
			case FileError.INVALID_MODIFICATION_ERR:
				sMsg = 'INVALID_MODIFICATION_ERR';
				break;
			case FileError.INVALID_STATE_ERR:
				sMsg = 'INVALID_STATE_ERR';
				break;
			default:
				sMsg = 'Unknown Error';
				break;
		}
		Logger.removeAppender(oFileAppender);
		Logger.addMessage(new Message(Level.FATAL, "FileError", sMsg, "FileAppender", 76));
		Logger.addAppender(oFileAppender);
	};
	/**
	 * openFile will create the file the first time it's executed
	 * openFile will get the created file the next times it's executed
	 * @member FileAppender.prototype
	 * @param {Message} oMessage
	 */
	FileAppender.prototype.openFile = function (oMessage) {
		var self = this;
		this.oMessage = oMessage;
		win.requestFileSystem(nPersistence, nFileSize, function (oFile) {
			oFile.root.getFile(sFileName, {create: true, exclusive: true}, function (oFileEntry) {
				self.privLog(oFileEntry, self.oMessage);
			}, self.onErrorHandler);
		}, self.onErrorHandler);

		this.openFile = function (oMessage) {
			var self = this;
			this.oMessage = oMessage;
			win.requestFileSystem(nPersistence, nFileSize, function (oFile) {
				oFile.root.getFile(sFileName, {create: false}, function (oFileEntry) {
					self.privLog(oFileEntry, self.oMessage);
				}, self.onErrorHandler);
			}, this.onErrorHandler);
		};
	};
	/**
	 * privLog is the private function to log messages to the file
	 * @member FileAppender.prototype
	 * @param {File} oFileEntry
	 * @param {Message} oMessage
	 */
	FileAppender.prototype.privLog = function (oFileEntry, oMessage) {
		var self = this;
		// Create a FileWriter object for our FileEntry (log.txt).
		oFileEntry.createWriter(function (oFileWriter) {
			var oBlob;
			oFileWriter.onwriteend = function () {
				Logger.addMessage(new Message(Level.INFO, "FileWriter", 'Write completed', "FileAppender", 113));
			};

			oFileWriter.onerror = function (eEvent) {
				Logger.removeAppender(oFileAppender);
				Logger.addMessage(new Message(Level.ERROR, "FileWriter", 'Write failed:' + eEvent.toString(), "FileAppender", 119));
				Logger.addAppender(oFileAppender);
			};

			oFileWriter.seek(oFileWriter.length);

			// Create a new Blob and write it to log.txt.
			oBlob = new BlobBuilder();
			oBlob.append(self.oLayout.format(oMessage));
			oFileWriter.write(oBlob.getBlob('text/plain'));

		}, this.onErrorHandler);
	};
	/**
	 * log is the method that logs the message to the file.
	 * @member FileAppender.prototype
	 * @param {Message} oMessage
	 */
	FileAppender.prototype.log = function (oMessage) {
		this.openFile(oMessage);
	};
	/**
	 * clear is the method that clear all the logged messages in the console.
	 * Before clear it's needed to check if console exist.
	 * @member FileAppender.prototype
	 */
	FileAppender.prototype.clear = function () {
		var self = this;
		win.requestFileSystem(nPersistence, nFileSize, function (oFile) {
			oFile.root.getFile(sFileName, {create: false}, function (oFileEntry) {
				oFileEntry.remove(function () {
					Logger.removeAppender(oFileAppender);
					Logger.addMessage(new Message(Level.INFO, "FileWriter", 'Write completed', "FileAppender", 146));
					Logger.addAppender(oFileAppender);

				}, self.onErrorHandler);
			}, self.onErrorHandler);
		}, this.onErrorHandler);
	};
	/*
	 * add the new FileAppender
	 */
	oFileAppender = new FileAppender();
	Logger.addAppender(oFileAppender);
}(window, Hermes));
