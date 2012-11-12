# Hermes.js
Hermes.js. Highly extensible message/error handler system.

[Changelog](http://tcorral.github.com/Hermes.js/changelog.txt)

## Description

Hermes definition in Wikipedia:

	"Hermes is the great messenger of the gods in Greek mythology and a guide to the Underworld"

Hermes will log all the messages for you.
Defer or send your logs immediately.
Different defined message types:

* ALL
* DEBUG
* INFO
* TRACE
* WARNING
* ERROR
* FATAL
* DISRUPTOR

And if you have some error you can add (or add it by the system if it's an uncaugh error) info about the file (filename or filename Url) and the line number where the error is logged.

Another important things:

* You can create your own errors or messages
* You can create your own layouts
* You can create your own appenders
* You can create your own levels

Hermes is an error handler that allows you to create your own log appenders extending the Appender abstract class and define your log and clear methods.

[Examples](http://tcorral.github.com/Hermes.js/examples_and_documents/index.html) to see for yourself!

## Usage

### Before using it:
Insert in your code:

	<script type="text/javascript" src="/path/to/your/js/libs/Hermes.js"></script>

### Add Message:
If Immediate mode is active the message will be logged immediately.

	Hermes.logger.addMessage( new Hermes.message( Hermes.level.DEBUG, "Category", "Message", "", "" ) );

### Log Error:
Hermes will try to log all the deferred and pending errors.

	Hermes.logger.log();

### Force Log:
Hermes will log all the deferred and pending error.

	Hermes.logger.forceLog();

### Create a new Message/Error
	var NewError = function(sFilenameUrl, nLineNumber)
	{
		Hermes.message.apply(this, [Level.INFO, 'New Error or message', 'The error or message', sFilenameUrl, nLineNumber, sDateFormat]);
	};
	NewError.prototype = new Hermes.message();

### Create a new Layout
	var NewLayout = function()
	{
		Hermes.layout.apply(this, arguments);
	};
	NewLayout.prototype = new Hermes.layout();
	NewLayout.prototype.format = function(oMessage)
	{
		//Your implementation must be here
	};

### Create a new Appender
	var NewAppender = function(oLevel, sCategory, sMessage, sFilenameUrl, nLineNumber, sDateFormat)
	{
		Hermes.appender.apply(this, arguments);
		this.oLayout = new NewLayout();
	};
	NewAppender.prototype = new Hermes.appender();
	NewAppender.prototype.log = function(oError)
	{
		//Your implementation must be here
	};
	NewAppender.prototype.clear = function(oError)
	{
		//Your implementation must be here
	};

## Documentation

[Examples from cloned repo](examples_and_documents/index.html) to see for yourself!

[Examples](/tcorral/Hermes.js/tree/master/examples_and_documents/index.html) to see for yourself!


## License

Hermes.js is licensed under the MIT license.

## Agreements

Hermes.js was inspired by Log4Js.