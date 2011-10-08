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
		assertObject(window.Hermes.logger.oAppenders);
		assertEquals(2, getObjectLength(window.Hermes.logger.oAppenders));
	},
	"test should return Level.ALL by default for oLevel": function () {
		assertInstanceOf(window.Hermes.level, window.Hermes.logger.oLevel);
		assertSame(window.Hermes.level.ALL, window.Hermes.logger.oLevel);
	},
	"test should return 100 for nTimeLastSent if faketimers is on and we delay 100": function () {
		this.clock.tick(100);
		window.Hermes.logger.nTimeLastSent = window.Hermes.logger.now();
		assertEquals(100, window.Hermes.logger.nTimeLastSent);
	},
	"test should return Logger.IMMEDIATE by default for nImmediate": function () {
		assertEquals(1, window.Hermes.logger.nImmediate);
	},
	"test should return 5000 by default for nTimeout": function () {
		assertEquals(5000, window.Hermes.logger.nTimeout);
	},
	tearDown: function () {
		this.clock.restore();
		window.Hermes.logger.nImmediate = 1;
		window.Hermes.logger.oLevel = window.Hermes.level.ALL;
	}
}));

TestCase("HermesLoggerDeferLogTest", sinon.testCase({
	setUp: function () {

	},
	"test should change nImmediate from 1 to 0": function () {
		window.Hermes.logger.deferLog();

		assertEquals(0, window.Hermes.logger.nImmediate);
	},
	"test should return instance of Logger": function () {
		var oRetrieved = window.Hermes.logger.deferLog();

		assertSame(window.Hermes.logger, oRetrieved);
	},
	tearDown: function () {
		window.Hermes.logger.nImmediate = 1;
	}
}));

TestCase("HermesLoggerImmediateLogTest", sinon.testCase({
	setUp: function () {

	},
	"test should change nImmediate from 1 to 0": function () {
		window.Hermes.logger.deferLog();
		window.Hermes.logger.immediateLog();

		assertEquals(1, window.Hermes.logger.nImmediate);
	},
	"test should return instance of Logger": function () {
		var oRetrieved = window.Hermes.logger.immediateLog();

		assertSame(window.Hermes.logger, oRetrieved);
	},
	tearDown: function () {
		window.Hermes.logger.nImmediate = 1;
	}
}));

TestCase("HermesLoggerSetLevelTest", sinon.testCase({
	setUp: function () {

	},
	"test should change oLevel if the argument is instance of Level": function () {

		window.Hermes.logger.setLevel(window.Hermes.level.OFF);

		assertEquals(window.Hermes.level.OFF, window.Hermes.logger.oLevel);
	},
	"test should NOT change oLevel if the argument is NOT instance of Level": function () {

		window.Hermes.logger.setLevel({});

		assertEquals(window.Hermes.level.ALL, window.Hermes.logger.oLevel);
	},
	"test should return instance of Logger": function () {
		var oRetrieved = window.Hermes.logger.setLevel(window.Hermes.level.OFF);

		assertSame(window.Hermes.logger, oRetrieved);
	},
	tearDown: function () {
		window.Hermes.logger.oLevel = window.Hermes.level.ALL;
	}
}));

TestCase("HermesLoggerAddAppenderTest", sinon.testCase({
	setUp: function () {
		var TestAppender = function()
		{
			window.Hermes.appender.apply(this);
		};
		TestAppender.prototype = new window.Hermes.appender();
		this.oTestAppender = new TestAppender();
	},
	"test should add TestAppender if it's Appender instance": function () {
		window.Hermes.logger.addAppender(this.oTestAppender);

		assertEquals(3, getObjectLength(window.Hermes.logger.oAppenders));
	},
	"test should add TestAppender if it's not  Appender instance": function () {
		window.Hermes.logger.addAppender({});

		assertEquals(2, getObjectLength(window.Hermes.logger.oAppenders));
	},
	"test should return instance of Logger": function () {
		var oRetrieved = window.Hermes.logger.addAppender(this.oTestAppender);

		assertSame(window.Hermes.logger, oRetrieved);
	},
	tearDown: function () {
		window.Hermes.logger.removeAppender(this.oTestAppender);
	}
}));

TestCase("HermesLoggerRemoveAppenderTest", sinon.testCase({
	setUp: function () {
		var TestAppender = function()
		{
			window.Hermes.appender.apply(this);
		};
		TestAppender.prototype = new window.Hermes.appender();
		this.oTestAppender = new TestAppender();
	},
	"test should remove TestAppender": function () {
		window.Hermes.logger.addAppender(this.oTestAppender);

		window.Hermes.logger.removeAppender(this.oTestAppender);

		assertEquals(2, getObjectLength(window.Hermes.logger.oAppenders));
	},
	"test should return instance of Logger": function () {
		var oRetrieved = window.Hermes.logger.removeAppender(this.oTestAppender);

		assertSame(window.Hermes.logger, oRetrieved);
	},
	tearDown: function () {
	}
}));

TestCase("HermesLoggerSetAppendersTest", sinon.testCase({
	setUp: function () {
		this.oAppenders = window.Hermes.logger.oAppenders;
		window.Hermes.logger.oAppenders = {};
		var TestAppender = function()
		{
			window.Hermes.appender.apply(this);
		};
		TestAppender.prototype = new window.Hermes.appender();
		this.oTestAppender = new TestAppender();

		this.aAppenders = [this.oTestAppender];
	},
	"test should remove TestAppender": function () {

		window.Hermes.logger.setAppenders(this.aAppenders);

		assertEquals(1, getObjectLength(window.Hermes.logger.oAppenders));
	},
	"test should return instance of Logger": function () {
		var oRetrieved = window.Hermes.logger.setAppenders(this.aAppenders);

		assertSame(window.Hermes.logger, oRetrieved);
	},
	tearDown: function () {
		window.Hermes.logger.oAppenders = this.oAppenders;
	}
}));

TestCase("HermesLoggerIsSameLevelTest", sinon.testCase({
	setUp: function () {
		this.oErrorOFF = {
			oLevel: window.Hermes.level.OFF
		};
		this.oErrorALL = {
			oLevel: window.Hermes.level.ALL
		};
	},
	"test should return true if the Level in error is the same that in Logger": function () {

		window.Hermes.logger.oLevel = window.Hermes.level.OFF;
		var bRetrieved = window.Hermes.logger.isSameLevel(this.oErrorOFF);

		assertTrue(bRetrieved);
	},
	"test should return true if the Level of Logger is ALL": function () {

		window.Hermes.logger.oLevel = window.Hermes.level.ALL;
		var bRetrieved = window.Hermes.logger.isSameLevel(this.oErrorALL);

		assertTrue(bRetrieved);
	},
	"test should return false if the Level of error is different from Logger": function () {

		window.Hermes.logger.oLevel = window.Hermes.level.OFF;
		var bRetrieved = window.Hermes.logger.isSameLevel(this.oErrorALL);

		assertFalse(bRetrieved);
	},
	tearDown: function () {
		window.Hermes.logger.oLevel = window.Hermes.level.ALL;
	}
}));

TestCase("HermesLoggerSendMessageTest", sinon.testCase({
	setUp: function () {
		var TestAppender = function()
		{
			window.Hermes.appender.apply(this);
		};
		TestAppender.prototype = new window.Hermes.appender();
		this.oTestAppender = new TestAppender();
		sinon.stub(this.oTestAppender, "log");
		sinon.stub(window.Hermes.logger, "now");
		this.oStubSameLevel = sinon.stub(window.Hermes.logger, "isSameLevel");
		this.oAppenders = window.Hermes.logger.oAppenders;
	},
	"test should not call if sAction doesn't exist on Appender": function () {
		var sAction = 'fake';

		window.Hermes.logger.oLevel = window.Hermes.level.OFF;
		var oRetrieved = window.Hermes.logger.sendMessage(this.oTestAppender, sAction);

		assertUndefined(oRetrieved);
	},
	"test should not call the action in Appender if isSameLevel returns true and action exist but there are no errors": function () {
		var sAction = 'log';
		this.oStubSameLevel.returns(true);
		window.Hermes.logger.oLevel = window.Hermes.level.OFF;

		var oRetrieved = window.Hermes.logger.sendMessage(this.oTestAppender, sAction);

		assertEquals(0, this.oTestAppender.log.callCount);
	},
	"test should not call the action in Appender if isSameLevel returns false and action exist": function () {
		var sAction = 'log';
		this.oStubSameLevel.returns(false);

		window.Hermes.logger.sendMessage(this.oTestAppender, sAction);

		assertEquals(0, this.oTestAppender.log.callCount);
	},
	"test should call the action in Appender if isSameLevel returns true and action exist and has errors": function () {
		var sAction = 'log';
		this.oStubSameLevel.returns(true);
		window.Hermes.logger.aErrors = [{}]

		window.Hermes.logger.sendMessage(this.oTestAppender, sAction);

		assertEquals(1, this.oTestAppender.log.callCount);
	},
	"test should call now one time if isSameLevel returns true and action exist and has errors": function()
	{
		var sAction = 'log';
		this.oStubSameLevel.returns(true);
		window.Hermes.logger.aErrors = [{}]

		window.Hermes.logger.sendMessage(this.oTestAppender, sAction);

		assertEquals(1, window.Hermes.logger.now.callCount);
	},
	"test should call now one time if isSameLevel returns true and action exist but has no errors": function()
	{
		var sAction = 'log';
		this.oStubSameLevel.returns(true);

		window.Hermes.logger.sendMessage(this.oTestAppender, sAction);

		assertEquals(1, window.Hermes.logger.now.callCount);
	},
	tearDown: function () {
		window.Hermes.logger.isSameLevel.restore();
		window.Hermes.logger.aErrors = [];
		window.Hermes.logger.oAppenders = this.oAppenders;
		window.Hermes.logger.now.restore();
	}
}));

TestCase("HermesLoggerIsImmediateTest", sinon.testCase({
	setUp: function () {
		window.Hermes.logger.deferLog();
	},
	"test should return false if nImmediate is different from Logger.IMMEDIATE": function () {
		assertFalse(window.Hermes.logger.isImmediate());
	},
	"test should return true if nImmediate is equals to Logger.IMMEDIATE": function () {
		window.Hermes.logger.immediateLog();

		assertTrue(window.Hermes.logger.isImmediate());
	},
	tearDown: function () {
		window.Hermes.logger.deferLog();
	}
}));

TestCase("HermesLoggerIsTimeToSentTest", sinon.testCase({
	setUp: function () {
		this.oNextTimeToSentStub = sinon.stub(window.Hermes.logger, "nextTimeToSent");
		this.oNowStub = sinon.stub(window.Hermes.logger, "now");
	},
	"test should call one time nextTimeToSent": function () {
		this.oNextTimeToSentStub.returns(100);
		this.oNowStub.returns(1);

		window.Hermes.logger.isTimeToSent();

		assertEquals(1, window.Hermes.logger.nextTimeToSent.callCount);
	},
	"test should call one time now": function () {
		this.oNextTimeToSentStub.returns(100);
		this.oNowStub.returns(1);

		window.Hermes.logger.isTimeToSent();

		assertEquals(1, window.Hermes.logger.now.callCount);
	},
	"test should return true if now returns a lower value than nextTimeToSent": function () {
		this.oNextTimeToSentStub.returns(100);
		this.oNowStub.returns(1);

		var bRetrieved = window.Hermes.logger.isTimeToSent();

		assertFalse(bRetrieved);
	},
	"test should return false if now returns a greater value than nextTimeToSent": function () {
		this.oNextTimeToSentStub.returns(1);
		this.oNowStub.returns(100);

		var bRetrieved = window.Hermes.logger.isTimeToSent();

		assertTrue(bRetrieved);
	},
	tearDown: function () {
		window.Hermes.logger.nextTimeToSent.restore();
		window.Hermes.logger.now.restore();
	}
}));

TestCase("HermesLoggerNotifyAppendersTest", sinon.testCase({
	setUp: function () {
		this.oIsImmediateStub = sinon.stub(window.Hermes.logger, "isImmediate");
		this.oIsTimeToSentStub = sinon.stub(window.Hermes.logger, "isTimeToSent");
		this.oSendMessageStub = sinon.stub(window.Hermes.logger, "sendMessage");
		this.oResetErrorsStub = sinon.stub(window.Hermes.logger, "resetErrors");
	},
	"test should not call send message and resetErrors if isImmediate returns false and isTimeToSent is false": function () {
		this.oIsImmediateStub.returns(false);
		this.oIsTimeToSentStub.returns(false);

		window.Hermes.logger.notifyAppenders('');

		assertFalse(window.Hermes.logger.sendMessage.called);
		assertFalse(window.Hermes.logger.resetErrors.called);
	},
	"test should call send message and resetErrors if isImmediate returns true": function () {
		this.oIsImmediateStub.returns(true);

		window.Hermes.logger.notifyAppenders('');

		assertTrue(window.Hermes.logger.sendMessage.called);
		assertTrue(window.Hermes.logger.resetErrors.called);
	},
	tearDown: function () {
		window.Hermes.logger.isImmediate.restore();
		window.Hermes.logger.isTimeToSent.restore();
		window.Hermes.logger.sendMessage.restore();
		window.Hermes.logger.resetErrors.restore();
	}
}));

TestCase("HermesLoggerAddErrorTest", sinon.testCase({
	setUp: function () {
		this.ErrorTest = function()
		{
			window.Hermes.error.apply(this);
		};
		this.ErrorTest.prototype = new window.Hermes.error();

		this.oNotifyAppendersStub = sinon.stub(window.Hermes.logger, "notifyAppenders");
	},
	"test should not call notifyAppenders if oError is not instance of ErrorExt": function () {
		window.Hermes.logger.addError({});

		assertEquals(0, window.Hermes.logger.notifyAppenders.callCount);
	},
	"test should call notifyAppenders if oError is instance of ErrorExt": function () {
		window.Hermes.logger.addError(new this.ErrorTest());

		assertEquals(1, window.Hermes.logger.notifyAppenders.callCount);
	},
	tearDown: function () {
		window.Hermes.logger.notifyAppenders.restore();
	}
}));

TestCase("HermesLoggerResetErrorsTest", sinon.testCase({
	setUp: function () {
		window.Hermes.logger.aErrors = [1, 2];
	},
	"test should empty aErrors": function () {
		window.Hermes.logger.resetErrors();

		assertEquals(0, window.Hermes.logger.aErrors.length);
	},
	tearDown: function () {
		window.Hermes.logger.aErrors = [];
	}
}));

TestCase("HermesLoggerNextTimeToSentTest", sinon.testCase({
	setUp: function () {
		this.nTimeLastSent = window.Hermes.logger.nTimeLastSent;
		this.nTimeout = window.Hermes.logger.nTimeout;
		window.Hermes.logger.nTimeLastSent = 1;
		window.Hermes.logger.nTimeout = 1;
	},
	"test should return 2": function () {
		var nRetrieved = window.Hermes.logger.nextTimeToSent();

		assertEquals(2, nRetrieved);
	},
	tearDown: function () {
		window.Hermes.logger.nTimeLastSent = this.nTimeLastSent;
		window.Hermes.logger.nTimeout = this.nTimeout;
		window.Hermes.logger.aErrors = [];
	}
}));

TestCase("HermesLoggerForceLogTest", sinon.testCase({
	setUp: function () {
		sinon.stub(window.Hermes.logger, "immediateLog");
		sinon.stub(window.Hermes.logger, "log");
		sinon.stub(window.Hermes.logger, "deferLog");
	},
	"test should call immediateLog, log and deferLog one time": function () {
		window.Hermes.logger.forceLog();

		assertEquals(1, window.Hermes.logger.immediateLog.callCount);
		assertEquals(1, window.Hermes.logger.log.callCount);
		assertEquals(1, window.Hermes.logger.deferLog.callCount);
	},
	tearDown: function () {
		window.Hermes.logger.immediateLog.restore();
		window.Hermes.logger.deferLog.restore();
		window.Hermes.logger.log.restore();
	}
}));

TestCase("HermesLoggerLogTest", sinon.testCase({
	setUp: function () {
		sinon.stub(window.Hermes.logger, "notifyAppenders");
	},
	"test should call notifyAppenders one time with 'log' as argument": function () {
		window.Hermes.logger.log();

		assertEquals(1, window.Hermes.logger.notifyAppenders.callCount);
		assertEquals('log', window.Hermes.logger.notifyAppenders.getCall(0).args[0]);
	},
	tearDown: function () {
		window.Hermes.logger.notifyAppenders.restore();
	}
}));

TestCase("HermesLoggerClearTest", sinon.testCase({
	setUp: function () {
		sinon.stub(window.Hermes.logger, "notifyAppenders");
	},
	"test should call notifyAppenders one time with 'clear' as argument": function () {
		window.Hermes.logger.clear();

		assertEquals(1, window.Hermes.logger.notifyAppenders.callCount);
		assertEquals('clear', window.Hermes.logger.notifyAppenders.getCall(0).args[0]);
	},
	tearDown: function () {
		window.Hermes.logger.notifyAppenders.restore();
	}
}));

TestCase("HermesErrorConstructorTest", sinon.testCase({
	setUp: function () {
	},
	"test should return Level.ALL for oLevel if nothing is supplied": function () {
		var oError = new window.Hermes.error();
		assertSame(window.Hermes.level.ALL, oError.oLevel);
	},
	"test should return Level.OFF for oLevel if we supply Level.OFF": function () {
		var oError = new window.Hermes.error(window.Hermes.level.OFF);
		assertSame(window.Hermes.level.OFF, oError.oLevel);
	},
	"test should return 'GENERAL' for sCategory  if nothing is supplied": function () {
		var oError = new window.Hermes.error();
		assertEquals('GENERAL', oError.sCategory);
	},
	"test should return 'ESPECIAL' for sCategory  if we supply 'ESPECIAL'": function () {
		var oError = new window.Hermes.error(null, 'ESPECIAL');
		assertEquals('ESPECIAL', oError.sCategory);
	},
	"test should return 'Error Undefined' for sMessage  if nothing is supplied": function () {
		var oError = new window.Hermes.error();
		assertEquals('Error Undefined', oError.sMessage);
	},
	"test should return 'ESPECIAL Error' for sMessage  if we supply 'ESPECIAL Error'": function () {
		var oError = new window.Hermes.error(null, '', 'ESPECIAL Error');
		assertEquals('ESPECIAL Error', oError.sMessage);
	},
	"test should return 'undefined file' for sFilenameUrl  if nothing is supplied": function () {
		var oError = new window.Hermes.error();
		assertNull(oError.sFilenameUrl);
	},
	"test should return 'ESPECIAL Error' for sFilenameUrl  if we supply 'ESPECIAL Error'": function () {
		var oError = new window.Hermes.error(null, '', '', 'filename');
		assertEquals('filename', oError.sFilenameUrl);
	},
	"test should return 'undefined file' for nLineNumber  if nothing is supplied": function () {
		var oError = new window.Hermes.error();
		assertNull(oError.nLineNumber);
	},
	"test should return 'ESPECIAL Error' for nLineNumber  if we supply 10": function () {
		var oError = new window.Hermes.error(null, '', '', '', 10);
		assertEquals(10, oError.nLineNumber);
	},
	tearDown: function () {
	}
}));

TestCase("HermesErrorSetFilenameUrlTest", sinon.testCase({
	setUp: function () {
	},
	"test should change the filenameUrl": function () {
		var oError = new window.Hermes.error();

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
		var oError = new window.Hermes.error();

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
		var oError = new window.Hermes.error();

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
		var oError = new window.Hermes.error();

		oError.setLevel({});

		assertEquals(window.Hermes.level.ALL, oError.oLevel);
	},
	"test should change oLevel if oLevel is a Level instance": function () {
		var oError = new window.Hermes.error();

		oError.setLevel(window.Hermes.level.DEBUG);

		assertEquals(window.Hermes.level.DEBUG, oError.oLevel);
	},
	tearDown: function () {
	}
}));

TestCase("HermesErrorSetMessageTest", sinon.testCase({
	setUp: function () {
	},
	"test should change sMessage": function () {
		var oError = new window.Hermes.error();

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
		var oError = new window.Hermes.error();

		oError.setDateFormat('test');

		assertEquals('test', oError.sDateFormat);
	},
	tearDown: function () {
	}
}));

TestCase("HermesErrorGetFormattedDateTest", sinon.testCase({
	setUp: function () {
		this.oError = new window.Hermes.error();
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
		this.oLevel = new window.Hermes.level(10, 'test');
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
		this.oLevel = new window.Hermes.level(10, 'test');
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
		this.oLevel = new window.Hermes.level(10, 'test');
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
		this.oLevel = new window.Hermes.level(10, 'test');
	},
	"test should return 'test'": function () {
		assertEquals('test', this.oLevel.toString());
	},
	tearDown: function () {
	}
}));

TestCase("HermesLevelValueOfTest", sinon.testCase({
	setUp: function () {
		this.oLevel = new window.Hermes.level(10, 'test');
	},
	"test should return 10": function () {
		assertEquals(10, this.oLevel.valueOf());
	},
	tearDown: function () {
	}
}));