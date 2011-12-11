function getObjectLength(oObject)
{
	var nLength = 0,
		sKey = '';
	for (sKey in oObject) {
		if (oObject.hasOwnProperty(sKey)) {
			nLength = nLength + 1;
		}
	}
	return nLength;
}

TestCase("HermesLoggerConstructorTest", sinon.testCase({
	setUp: function () {
		this.clock = sinon.useFakeTimers();
	},
	"test should return an object with two appenders 'FileAppender' and 'ConsoleAppender' by default for oAppenders": function () {
		assertObject(Hermes.logger.oAppender);
		assertEquals(2, getObjectLength(Hermes.logger.oAppender));
	},
	"test should return Level.ALL by default for oLevel": function () {
		assertInstanceOf(Hermes.level, Hermes.logger.oLevel);
		assertSame(Hermes.level.ALL, Hermes.logger.oLevel);
	},
	"test should return 100 for nTimeLastSent if faketimers is on and we delay 100": function () {
		this.clock.tick(100);
		Hermes.logger.nTimeLastSent = Hermes.logger.now();
		assertEquals(100, Hermes.logger.nTimeLastSent);
	},
	"test should return Logger.IMMEDIATE by default for nImmediate": function () {
		assertEquals(1, Hermes.logger.nImmediate);
	},
	"test should return 5000 by default for nTimeout": function () {
		assertEquals(5000, Hermes.logger.nTimeout);
	},
	tearDown: function () {
		this.clock.restore();
		Hermes.logger.nImmediate = 1;
		Hermes.logger.oLevel = Hermes.level.ALL;
	}
}));

TestCase("HermesLoggerDeferLogTest", sinon.testCase({
	setUp: function () {

	},
	"test should change nImmediate from 1 to 0": function () {
		Hermes.logger.deferLog();

		assertEquals(0, Hermes.logger.nImmediate);
	},
	"test should return instance of Logger": function () {
		var oRetrieved = Hermes.logger.deferLog();

		assertSame(Hermes.logger, oRetrieved);
	},
	tearDown: function () {
		Hermes.logger.nImmediate = 1;
	}
}));

TestCase("HermesLoggerImmediateLogTest", sinon.testCase({
	setUp: function () {

	},
	"test should change nImmediate from 1 to 0": function () {
		Hermes.logger.deferLog();
		Hermes.logger.immediateLog();

		assertEquals(1, Hermes.logger.nImmediate);
	},
	"test should return instance of Logger": function () {
		var oRetrieved = Hermes.logger.immediateLog();

		assertSame(Hermes.logger, oRetrieved);
	},
	tearDown: function () {
		Hermes.logger.nImmediate = 1;
	}
}));

TestCase("HermesLoggerSetLevelTest", sinon.testCase({
	setUp: function () {

	},
	"test should change oLevel if the argument is instance of Level": function () {

		Hermes.logger.setLevel(Hermes.level.OFF);

		assertEquals(Hermes.level.OFF, Hermes.logger.oLevel);
	},
	"test should NOT change oLevel if the argument is NOT instance of Level": function () {

		Hermes.logger.setLevel({});

		assertEquals(Hermes.level.ALL, Hermes.logger.oLevel);
	},
	"test should return instance of Logger": function () {
		var oRetrieved = Hermes.logger.setLevel(Hermes.level.OFF);

		assertSame(Hermes.logger, oRetrieved);
	},
	tearDown: function () {
		Hermes.logger.oLevel = Hermes.level.ALL;
	}
}));

TestCase("HermesLoggerAddAppenderTest", sinon.testCase({
	setUp: function () {
		var TestAppender = function()
		{
			Hermes.appender.apply(this);
		};
		TestAppender.prototype = new Hermes.appender();
		this.oTestAppender = new TestAppender();
	},
	"test should add TestAppender if it's Appender instance": function () {
		Hermes.logger.addAppender(this.oTestAppender);

		assertEquals(3, getObjectLength(Hermes.logger.oAppender));
	},
	"test should add TestAppender if it's not  Appender instance": function () {
		Hermes.logger.addAppender({});

		assertEquals(2, getObjectLength(Hermes.logger.oAppender));
	},
	"test should return instance of Logger": function () {
		var oRetrieved = Hermes.logger.addAppender(this.oTestAppender);

		assertSame(Hermes.logger, oRetrieved);
	},
	tearDown: function () {
		Hermes.logger.removeAppender(this.oTestAppender);
	}
}));

TestCase("HermesLoggerRemoveAppenderTest", sinon.testCase({
	setUp: function () {
		var TestAppender = function()
		{
			Hermes.appender.apply(this);
		};
		TestAppender.prototype = new Hermes.appender();
		this.oTestAppender = new TestAppender();
	},
	"test should remove TestAppender": function () {
		Hermes.logger.addAppender(this.oTestAppender);

		Hermes.logger.removeAppender(this.oTestAppender);

		assertEquals(2, getObjectLength(Hermes.logger.oAppender));
	},
	"test should return instance of Logger": function () {
		var oRetrieved = Hermes.logger.removeAppender(this.oTestAppender);

		assertSame(Hermes.logger, oRetrieved);
	},
	tearDown: function () {
	}
}));

TestCase("HermesLoggerSetAppendersTest", sinon.testCase({
	setUp: function () {
		this.oAppender = Hermes.logger.oAppender;
		Hermes.logger.oAppender = {};
		var TestAppender = function()
		{
			Hermes.appender.apply(this);
		};
		TestAppender.prototype = new Hermes.appender();
		this.oTestAppender = new TestAppender();

		this.aAppenders = [this.oTestAppender];
	},
	"test should remove TestAppender": function () {

		Hermes.logger.setAppender(this.aAppenders);

		assertEquals(1, getObjectLength(Hermes.logger.oAppender));
	},
	"test should return instance of Logger": function () {
		var oRetrieved = Hermes.logger.setAppender(this.aAppenders);

		assertSame(Hermes.logger, oRetrieved);
	},
	tearDown: function () {
		Hermes.logger.oAppender = this.oAppender;
	}
}));

TestCase("HermesLoggerIsSameLevelTest", sinon.testCase({
	setUp: function () {
		this.oErrorOFF = {
			oLevel: Hermes.level.OFF
		};
		this.oErrorERROR = {
			oLevel: Hermes.level.ERROR
		};
		this.oErrorALL = {
			oLevel: Hermes.level.ALL
		};
	},
	"test should return true if the Level in error is the same that in Logger": function () {

		Hermes.logger.oLevel = Hermes.level.ERROR;

		var bRetrieved = Hermes.logger.isSameLevel(this.oErrorERROR);

		assertTrue(bRetrieved);
	},
	"test should return true if the Level of Logger is ALL": function () {

		Hermes.logger.oLevel = Hermes.level.ALL;

		var bRetrieved = Hermes.logger.isSameLevel(this.oErrorALL);

		assertTrue(bRetrieved);
	},
	"test should return false if the Level of error is OFF": function() {
		Hermes.logger.oLevel = Hermes.level.OFF;

		var bRetrieved = Hermes.logger.isSameLevel(this.oErrorALL);

		assertFalse(bRetrieved);
	},
	"test should return false if the Level of error is different from Logger": function () {

		Hermes.logger.oLevel = Hermes.level.OFF;

		var bRetrieved = Hermes.logger.isSameLevel(this.oErrorALL);

		assertFalse(bRetrieved);
	},
	tearDown: function () {
		Hermes.logger.oLevel = Hermes.level.ALL;
	}
}));

TestCase("HermesLoggerSendMessageTest", sinon.testCase({
	setUp: function () {
		var TestAppender = function()
		{
			Hermes.appender.apply(this);
		};
		TestAppender.prototype = new Hermes.appender();
		this.oTestAppender = new TestAppender();
		sinon.stub(this.oTestAppender, "log");
		sinon.stub(Hermes.logger, "now");
		this.oStubSameLevel = sinon.stub(Hermes.logger, "isSameLevel");
		this.oAppender = Hermes.logger.oAppender;
	},
	"test should not call if sAction doesn't exist on Appender": function () {
		var sAction = 'fake';

		Hermes.logger.oLevel = Hermes.level.OFF;
		var oRetrieved = Hermes.logger.sendMessage(this.oTestAppender, sAction);

		assertUndefined(oRetrieved);
	},
	"test should not call the action in Appender if isSameLevel returns true and action exist but there are no errors": function () {
		var sAction = 'log';
		this.oStubSameLevel.returns(true);
		Hermes.logger.oLevel = Hermes.level.OFF;

		var oRetrieved = Hermes.logger.sendMessage(this.oTestAppender, sAction);

		assertEquals(0, this.oTestAppender.log.callCount);
	},
	"test should not call the action in Appender if isSameLevel returns false and action exist": function () {
		var sAction = 'log';
		this.oStubSameLevel.returns(false);

		Hermes.logger.sendMessage(this.oTestAppender, sAction);

		assertEquals(0, this.oTestAppender.log.callCount);
	},
	"test should call the action in Appender if isSameLevel returns true and action exist and has errors": function () {
		var sAction = 'log';
		this.oStubSameLevel.returns(true);
		Hermes.logger.aErrors = [{}]

		Hermes.logger.sendMessage(this.oTestAppender, sAction);

		assertEquals(1, this.oTestAppender.log.callCount);
	},
	"test should call now one time if isSameLevel returns true and action exist and has errors": function()
	{
		var sAction = 'log';
		this.oStubSameLevel.returns(true);
		Hermes.logger.aErrors = [{}]

		Hermes.logger.sendMessage(this.oTestAppender, sAction);

		assertEquals(1, Hermes.logger.now.callCount);
	},
	"test should call now one time if isSameLevel returns true and action exist but has no errors": function()
	{
		var sAction = 'log';
		this.oStubSameLevel.returns(true);

		Hermes.logger.sendMessage(this.oTestAppender, sAction);

		assertEquals(1, Hermes.logger.now.callCount);
	},
	tearDown: function () {
		Hermes.logger.isSameLevel.restore();
		Hermes.logger.aErrors = [];
		Hermes.logger.oAppender = this.oAppender;
		Hermes.logger.now.restore();
	}
}));

TestCase("HermesLoggerIsImmediateTest", sinon.testCase({
	setUp: function () {
		Hermes.logger.deferLog();
	},
	"test should return false if nImmediate is different from Logger.IMMEDIATE": function () {
		assertFalse(Hermes.logger.isImmediate());
	},
	"test should return true if nImmediate is equals to Logger.IMMEDIATE": function () {
		Hermes.logger.immediateLog();

		assertTrue(Hermes.logger.isImmediate());
	},
	tearDown: function () {
		Hermes.logger.deferLog();
	}
}));

TestCase("HermesLoggerIsTimeToSentTest", sinon.testCase({
	setUp: function () {
		this.oNextTimeToSentStub = sinon.stub(Hermes.logger, "nextTimeToSend");
		this.oNowStub = sinon.stub(Hermes.logger, "now");
	},
	"test should call one time nextTimeToSent": function () {
		this.oNextTimeToSentStub.returns(100);
		this.oNowStub.returns(1);

		Hermes.logger.isTimeToSend();

		assertEquals(1, Hermes.logger.nextTimeToSend.callCount);
	},
	"test should call one time now": function () {
		this.oNextTimeToSentStub.returns(100);
		this.oNowStub.returns(1);

		Hermes.logger.isTimeToSend();

		assertEquals(1, Hermes.logger.now.callCount);
	},
	"test should return true if now returns a lower value than nextTimeToSent": function () {
		this.oNextTimeToSentStub.returns(100);
		this.oNowStub.returns(1);

		var bRetrieved = Hermes.logger.isTimeToSend();

		assertFalse(bRetrieved);
	},
	"test should return false if now returns a greater value than nextTimeToSent": function () {
		this.oNextTimeToSentStub.returns(1);
		this.oNowStub.returns(100);

		var bRetrieved = Hermes.logger.isTimeToSend();

		assertTrue(bRetrieved);
	},
	tearDown: function () {
		Hermes.logger.nextTimeToSend.restore();
		Hermes.logger.now.restore();
	}
}));

TestCase("HermesLoggerNotifyAppenderTest", sinon.testCase({
	setUp: function () {
		this.oIsImmediateStub = sinon.stub(Hermes.logger, "isImmediate");
		this.oIsTimeToSentStub = sinon.stub(Hermes.logger, "isTimeToSend");
		this.oSendMessageStub = sinon.stub(Hermes.logger, "sendMessage");
		this.oResetErrorsStub = sinon.stub(Hermes.logger, "resetErrors");
	},
	"test should not call send message and resetErrors if isImmediate returns false and isTimeToSent is false": function () {
		this.oIsImmediateStub.returns(false);
		this.oIsTimeToSentStub.returns(false);

		Hermes.logger.notifyAppender('');

		assertFalse(Hermes.logger.sendMessage.called);
		assertFalse(Hermes.logger.resetErrors.called);
	},
	"test should call send message and resetErrors if isImmediate returns true": function () {
		this.oIsImmediateStub.returns(true);

		Hermes.logger.notifyAppender('');

		assertTrue(Hermes.logger.sendMessage.called);
		assertTrue(Hermes.logger.resetErrors.called);
	},
	tearDown: function () {
		Hermes.logger.isImmediate.restore();
		Hermes.logger.isTimeToSend.restore();
		Hermes.logger.sendMessage.restore();
		Hermes.logger.resetErrors.restore();
	}
}));

TestCase("HermesLoggerAddErrorTest", sinon.testCase({
	setUp: function () {
		this.ErrorTest = function()
		{
			Hermes.error.apply(this);
		};
		this.ErrorTest.prototype = new Hermes.error();

		this.oNotifyAppenderStub = sinon.stub(Hermes.logger, "notifyAppender");
	},
	"test should not call notifyAppender if oError is not instance of ErrorExt": function () {
		Hermes.logger.addError({});

		assertEquals(0, Hermes.logger.notifyAppender.callCount);
	},
	"test should call notifyAppender if oError is instance of ErrorExt": function () {
		Hermes.logger.addError(new this.ErrorTest());

		assertEquals(1, Hermes.logger.notifyAppender.callCount);
	},
	tearDown: function () {
		Hermes.logger.notifyAppender.restore();
	}
}));

TestCase("HermesLoggerResetErrorsTest", sinon.testCase({
	setUp: function () {
		Hermes.logger.aErrors = [1, 2];
	},
	"test should empty aErrors": function () {
		Hermes.logger.resetErrors();

		assertEquals(0, Hermes.logger.aErrors.length);
	},
	tearDown: function () {
		Hermes.logger.aErrors = [];
	}
}));

TestCase("HermesLoggerNextTimeToSentTest", sinon.testCase({
	setUp: function () {
		this.nTimeLastSent = Hermes.logger.nTimeLastSent;
		this.nTimeout = Hermes.logger.nTimeout;
		Hermes.logger.nTimeLastSent = 1;
		Hermes.logger.nTimeout = 1;
	},
	"test should return 2": function () {
		var nRetrieved = Hermes.logger.nextTimeToSend();

		assertEquals(2, nRetrieved);
	},
	tearDown: function () {
		Hermes.logger.nTimeLastSent = this.nTimeLastSent;
		Hermes.logger.nTimeout = this.nTimeout;
		Hermes.logger.aErrors = [];
	}
}));

TestCase("HermesLoggerForceLogTest", sinon.testCase({
	setUp: function () {
		sinon.stub(Hermes.logger, "immediateLog");
		sinon.stub(Hermes.logger, "log");
		sinon.stub(Hermes.logger, "deferLog");
	},
	"test should call immediateLog, log and deferLog one time": function () {
		Hermes.logger.forceLog();

		assertEquals(1, Hermes.logger.immediateLog.callCount);
		assertEquals(1, Hermes.logger.log.callCount);
		assertEquals(1, Hermes.logger.deferLog.callCount);
	},
	tearDown: function () {
		Hermes.logger.immediateLog.restore();
		Hermes.logger.deferLog.restore();
		Hermes.logger.log.restore();
	}
}));

TestCase("HermesLoggerLogTest", sinon.testCase({
	setUp: function () {
		sinon.stub(Hermes.logger, "notifyAppender");
	},
	"test should call notifyAppender one time with 'log' as argument": function () {
		Hermes.logger.log();

		assertEquals(1, Hermes.logger.notifyAppender.callCount);
		assertEquals('log', Hermes.logger.notifyAppender.getCall(0).args[0]);
	},
	tearDown: function () {
		Hermes.logger.notifyAppender.restore();
	}
}));

TestCase("HermesLoggerClearTest", sinon.testCase({
	setUp: function () {
		sinon.stub(Hermes.logger, "notifyAppender");
	},
	"test should call notifyAppender one time with 'clear' as argument": function () {
		Hermes.logger.clear();

		assertEquals(1, Hermes.logger.notifyAppender.callCount);
		assertEquals('clear', Hermes.logger.notifyAppender.getCall(0).args[0]);
	},
	tearDown: function () {
		Hermes.logger.notifyAppender.restore();
	}
}));

TestCase("HermesErrorConstructorTest", sinon.testCase({
	setUp: function () {
	},
	"test should return Level.ALL for oLevel if nothing is supplied": function () {
		var oError = new Hermes.error();
		assertSame(Hermes.level.ALL, oError.oLevel);
	},
	"test should return Level.OFF for oLevel if we supply Level.OFF": function () {
		var oError = new Hermes.error(Hermes.level.OFF);
		assertSame(Hermes.level.OFF, oError.oLevel);
	},
	"test should return 'GENERAL' for sCategory  if nothing is supplied": function () {
		var oError = new Hermes.error();
		assertEquals('GENERAL', oError.sCategory);
	},
	"test should return 'ESPECIAL' for sCategory  if we supply 'ESPECIAL'": function () {
		var oError = new Hermes.error(null, 'ESPECIAL');
		assertEquals('ESPECIAL', oError.sCategory);
	},
	"test should return 'Error Undefined' for sMessage  if nothing is supplied": function () {
		var oError = new Hermes.error();
		assertEquals('Error Undefined', oError.sMessage);
	},
	"test should return 'ESPECIAL Error' for sMessage  if we supply 'ESPECIAL Error'": function () {
		var oError = new Hermes.error(null, '', 'ESPECIAL Error');
		assertEquals('ESPECIAL Error', oError.sMessage);
	},
	"test should return 'undefined file' for sFilenameUrl  if nothing is supplied": function () {
		var oError = new Hermes.error();
		assertNull(oError.sFilenameUrl);
	},
	"test should return 'ESPECIAL Error' for sFilenameUrl  if we supply 'ESPECIAL Error'": function () {
		var oError = new Hermes.error(null, '', '', 'filename');
		assertEquals('filename', oError.sFilenameUrl);
	},
	"test should return 'undefined file' for nLineNumber  if nothing is supplied": function () {
		var oError = new Hermes.error();
		assertNull(oError.nLineNumber);
	},
	"test should return 'ESPECIAL Error' for nLineNumber  if we supply 10": function () {
		var oError = new Hermes.error(null, '', '', '', 10);
		assertEquals(10, oError.nLineNumber);
	},
	tearDown: function () {
	}
}));

TestCase("HermesErrorSetFilenameUrlTest", sinon.testCase({
	setUp: function () {
	},
	"test should change the filenameUrl": function () {
		var oError = new Hermes.error();

		oError.setFilenameUrl('test');

		assertEquals('test', oError.sFilenameUrl);
	},
	tearDown: function () {
	}
}));

TestCase("HermesErrorSetLineNumberTest", sinon.testCase({
	setUp: function () {
	},
	"test should change nLineNumber": function () {
		var oError = new Hermes.error();

		oError.setLineNumber(10);

		assertEquals(10, oError.nLineNumber);
	},
	tearDown: function () {
	}
}));

TestCase("HermesErrorSetCategoryTest", sinon.testCase({
	setUp: function () {
	},
	"test should change sCategory": function () {
		var oError = new Hermes.error();

		oError.setCategory('test');

		assertEquals('test', oError.sCategory);
	},
	tearDown: function () {
	}
}));

TestCase("HermesErrorSetLevelTest", sinon.testCase({
	setUp: function () {
	},
	"test should not change oLevel if oLevel is not a Level instance": function () {
		var oError = new Hermes.error();

		oError.setLevel({});

		assertEquals(Hermes.level.ALL, oError.oLevel);
	},
	"test should change oLevel if oLevel is a Level instance": function () {
		var oError = new Hermes.error();

		oError.setLevel(Hermes.level.DEBUG);

		assertEquals(Hermes.level.DEBUG, oError.oLevel);
	},
	tearDown: function () {
	}
}));

TestCase("HermesErrorSetMessageTest", sinon.testCase({
	setUp: function () {
	},
	"test should change sMessage": function () {
		var oError = new Hermes.error();

		oError.setMessage('test');

		assertEquals('test', oError.sMessage);
	},
	tearDown: function () {
	}
}));

TestCase("HermesErrorSetDateFormatTest", sinon.testCase({
	setUp: function () {
	},
	"test should change sDateFormat": function () {
		var oError = new Hermes.error();

		oError.setDateFormat('test');

		assertEquals('test', oError.sDateFormat);
	},
	tearDown: function () {
	}
}));

TestCase("HermesErrorGetFormattedDateTest", sinon.testCase({
	setUp: function () {
		this.oError = new Hermes.error();
		sinon.stub(this.oError.oDateFormatter, "formatDate");
	},
	"test should call formatDate method one time": function () {
		this.oError.getFormattedDate();

		assertEquals(1,this.oError.oDateFormatter.formatDate.callCount);
	},
	tearDown: function () {
		this.oError.oDateFormatter.formatDate.restore();
	}
}));

TestCase("HermesLevelConstructorTest", sinon.testCase({
	setUp: function () {
		this.oLevel = new Hermes.level(10, 'test');
	},
	"test should return 10 for the nLevel property": function () {
		assertEquals(10, this.oLevel.nLevel);
	},
	"test should return 'test' for the sLevel property": function () {
		assertEquals('test', this.oLevel.sLevel);
	},
	tearDown: function () {
	}
}));

TestCase("HermesLevelGetLevelTest", sinon.testCase({
	setUp: function () {
		this.oLevel = new Hermes.level(10, 'test');
	},
	"test should return 10 for the nLevel property": function () {
		assertEquals(10, this.oLevel.nLevel);
	},
	"test should return 'test' for the sLevel property": function () {
		assertEquals('test', this.oLevel.sLevel);
	},
	tearDown: function () {
	}
}));

TestCase("HermesLevelToStringTest", sinon.testCase({
	setUp: function () {
		this.oLevel = new Hermes.level(10, 'test');
	},
	"test should return 'test'": function () {
		assertEquals('test', this.oLevel.toString());
	},
	tearDown: function () {
	}
}));

TestCase("HermesLevelValueOfTest", sinon.testCase({
	setUp: function () {
		this.oLevel = new Hermes.level(10, 'test');
	},
	"test should return 10": function () {
		assertEquals(10, this.oLevel.valueOf());
	},
	tearDown: function () {
	}
}));

TestCase("HermesDisruptorErrorTest", sinon.testCase({
	setUp: function()
	{
		this.oError = new Hermes.disruptorError('Test', 'testFile.js');
	},
	"test should return Hermes.error instance as parent": function()
	{
		assertInstanceOf(Hermes.error, this.oError);
	},
	"test should return Hermes.disruptorError as instance": function()
	{
		assertInstanceOf(Hermes.disruptorError, this.oError);
	},
	tearDown: function()
	{

	}
}));