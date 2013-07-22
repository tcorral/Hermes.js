/*global window, document, TestCase, Hermes, assertObject, assertEquals, assertSame, assertInstanceOf, assertTrue, assertFalse, assertUndefined, assertNull   */
(function(win, doc, Hermes)
{
	'use strict';
	var oTestCase = TestCase;

	oTestCase("HermesLoggerConstructorTest", sinon.testCase({
		setUp: function () {
			this.clock = sinon.useFakeTimers();
		},
		tearDown: function () {
			this.clock.restore();
			Hermes.logger.nImmediate = 1;
			Hermes.logger.oLevel = Hermes.level.ALL;
		},
		"test should return an object with 0 appenders by default for oAppenders": function () {
			assertObject(Hermes.logger.oAppenders);
			assertEquals(0, getObjectLength(Hermes.logger.oAppenders));
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
		"test should return 10000 by default for nTimeout": function () {
			assertEquals(10000, Hermes.logger.nTimeout);
		}
	}));

	oTestCase("HermesLoggerDeferLogTest", sinon.testCase({
		setUp: function () {

		},
		tearDown: function () {
			Hermes.logger.nImmediate = 1;
		},
		"test should change nImmediate from 1 to 0": function () {
			Hermes.logger.deferLog();

			assertEquals(0, Hermes.logger.nImmediate);
		},
		"test should return instance of Logger": function () {
			var oRetrieved = Hermes.logger.deferLog();

			assertSame(Hermes.logger, oRetrieved);
		}
	}));

	oTestCase("HermesLoggerImmediateLogTest", sinon.testCase({
		setUp: function () {

		},
		tearDown: function () {
			Hermes.logger.nImmediate = 1;
		},
		"test should change nImmediate from 1 to 0": function () {
			Hermes.logger.deferLog();
			Hermes.logger.immediateLog();

			assertEquals(1, Hermes.logger.nImmediate);
		},
		"test should return instance of Logger": function () {
			var oRetrieved = Hermes.logger.immediateLog();

			assertSame(Hermes.logger, oRetrieved);
		}
	}));

	oTestCase("HermesLoggerSetLevelTest", sinon.testCase({
		setUp: function () {

		},
		tearDown: function () {
			Hermes.logger.oLevel = Hermes.level.ALL;
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
		}
	}));

	oTestCase("HermesLoggerAddAppenderTest", sinon.testCase({
		setUp: function () {
			var TestAppender = function()
			{
				Hermes.appender.apply(this);
			};
			TestAppender.prototype = new Hermes.appender();
			this.oTestAppender = new TestAppender();
		},
		tearDown: function () {
			Hermes.logger.removeAppender(this.oTestAppender);
		},
		"test should add TestAppender if it's Appender instance": function () {
			Hermes.logger.addAppender(this.oTestAppender);

			assertEquals(1, getObjectLength(Hermes.logger.oAppenders));
		},
		"test should not add TestAppender if it's not  Appender instance": function () {
			Hermes.logger.addAppender({});

			assertEquals(0, getObjectLength(Hermes.logger.oAppenders));
		},
		"test should return instance of Logger": function () {
			var oRetrieved = Hermes.logger.addAppender(this.oTestAppender);

			assertSame(Hermes.logger, oRetrieved);
		}
	}));

	oTestCase("HermesLoggerRemoveAppenderTest", sinon.testCase({
		setUp: function () {
			var TestAppender = function()
			{
				Hermes.appender.apply(this);
			};
			TestAppender.prototype = new Hermes.appender();
			this.oTestAppender = new TestAppender();
		},
		tearDown: function () {
			delete this.oTestAppender;
		},
		"test should remove TestAppender": function () {
			Hermes.logger.addAppender(this.oTestAppender);

			Hermes.logger.removeAppender(this.oTestAppender);

			assertEquals(0, getObjectLength(Hermes.logger.oAppenders));
		},
		"test should return instance of Logger": function () {
			var oRetrieved = Hermes.logger.removeAppender(this.oTestAppender);

			assertSame(Hermes.logger, oRetrieved);
		}
	}));

	oTestCase("HermesLoggerSetAppendersTest", sinon.testCase({
		setUp: function () {
			this.oAppender = Hermes.logger.oAppenders;
			Hermes.logger.oAppenders = {};
			var TestAppender = function()
			{
				Hermes.appender.apply(this);
			};
			TestAppender.prototype = new Hermes.appender();
			this.oTestAppender = new TestAppender();

			this.aAppenders = [this.oTestAppender];
		},
		tearDown: function () {
			Hermes.logger.oAppenders = this.oAppender;
			delete this.oAppender;
			delete this.oAppenders;
		},
		"test should remove TestAppender": function () {

			Hermes.logger.setAppenders(this.aAppenders);

			assertEquals(1, getObjectLength(Hermes.logger.oAppenders));
		},
		"test should return instance of Logger": function () {
			var oRetrieved = Hermes.logger.setAppenders(this.aAppenders);

			assertSame(Hermes.logger, oRetrieved);
		}
	}));

	oTestCase("HermesLoggerIsSameLevelTest", sinon.testCase({
		setUp: function () {
			this.oErrorERROR = {
				oLevel: Hermes.level.ERROR
			};
			this.oErrorALL = {
				oLevel: Hermes.level.ALL
			};
		},
		tearDown: function () {
			Hermes.logger.oLevel = Hermes.level.ALL;
			delete this.oErrorERROR;
			delete this.oErrorALL;
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
		}
	}));

	oTestCase("HermesLoggerSendMessageTest", sinon.testCase({
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
		tearDown: function () {
			Hermes.logger.isSameLevel.restore();
			Hermes.logger.aMessages = [];
			Hermes.logger.oAppender = this.oAppender;
			Hermes.logger.now.restore();
			delete this.oTestAppender;
			delete this.oStubSameLevel;
			delete this.oAppender;
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

			Hermes.logger.sendMessage(this.oTestAppender, sAction);

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
			Hermes.logger.aMessages = [{}];

			Hermes.logger.sendMessage(this.oTestAppender, sAction);

			assertEquals(1, this.oTestAppender.log.callCount);
		},
		"test should call now one time if isSameLevel returns true and action exist and has errors": function()
		{
			var sAction = 'log';
			this.oStubSameLevel.returns(true);
			Hermes.logger.aMessages = [{}];

			Hermes.logger.sendMessage(this.oTestAppender, sAction);

			assertEquals(1, Hermes.logger.now.callCount);
		},
		"test should call now one time if isSameLevel returns true and action exist but has no errors": function()
		{
			var sAction = 'log';
			this.oStubSameLevel.returns(true);

			Hermes.logger.sendMessage(this.oTestAppender, sAction);

			assertEquals(1, Hermes.logger.now.callCount);
		}
	}));

	oTestCase("HermesLoggerIsImmediateTest", sinon.testCase({
		setUp: function () {
			Hermes.logger.deferLog();
		},
		tearDown: function () {
			Hermes.logger.deferLog();
		},
		"test should return false if nImmediate is different from Logger.IMMEDIATE": function () {
			assertFalse(Hermes.logger.isImmediate());
		},
		"test should return true if nImmediate is equals to Logger.IMMEDIATE": function () {
			Hermes.logger.immediateLog();

			assertTrue(Hermes.logger.isImmediate());
		}
	}));

	oTestCase("HermesLoggerIsTimeToSendTest", sinon.testCase({
		setUp: function () {
			this.oNextTimeToSentStub = sinon.stub(Hermes.logger, "nextTimeToSend");
			this.oNowStub = sinon.stub(Hermes.logger, "now");
		},
		tearDown: function () {
			Hermes.logger.nextTimeToSend.restore();
			Hermes.logger.now.restore();
			delete this.oNowStub;
			delete this.oNextTimeToSentStub;
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
		}
	}));

	oTestCase("HermesLoggerNotifyAppenderTest", sinon.testCase({
		setUp: function () {
			this.oIsImmediateStub = sinon.stub(Hermes.logger, "isImmediate");
			this.oIsTimeToSentStub = sinon.stub(Hermes.logger, "isTimeToSend");
			sinon.stub(Hermes.logger, "sendMessage");
			sinon.stub(Hermes.logger, "resetMessages");
		},
		tearDown: function () {
			Hermes.logger.isImmediate.restore();
			Hermes.logger.isTimeToSend.restore();
			Hermes.logger.sendMessage.restore();
			Hermes.logger.resetMessages.restore();
			delete this.oIsImmediateStub;
			delete this.oIsTimeToSentStub;
		},
		"test should not call send message and resetErrors if isImmediate returns false and isTimeToSent is false": function () {
			this.oIsImmediateStub.returns(false);
			this.oIsTimeToSentStub.returns(false);

			Hermes.logger.notifyAppender('');

			assertFalse(Hermes.logger.sendMessage.called);
			assertFalse(Hermes.logger.resetMessages.called);
		},
		"test should not call send message if isImmediate returns true but there are no appenders added": function () {
			this.oIsImmediateStub.returns(true);

			Hermes.logger.notifyAppender('');

			assertFalse(Hermes.logger.sendMessage.called);
			assertTrue(Hermes.logger.resetMessages.called);
		}
	}));

	oTestCase("HermesLoggerAddErrorTest", sinon.testCase({
		setUp: function () {
			this.ErrorTest = function()
			{
				Hermes.message.apply(this);
			};
			this.ErrorTest.prototype = new Hermes.message();

			sinon.stub(Hermes.logger, "notifyAppender");
		},
		tearDown: function () {
			Hermes.logger.notifyAppender.restore();
			delete this.ErrorTest;
		},
		"test should not call notifyAppender if oError is not instance of ErrorExt": function () {
			Hermes.logger.addMessage({});

			assertEquals(0, Hermes.logger.notifyAppender.callCount);
		},
		"test should call notifyAppender if oError is instance of ErrorExt": function () {
			Hermes.logger.addMessage(new this.ErrorTest());

			assertEquals(1, Hermes.logger.notifyAppender.callCount);
		}
	}));

	oTestCase("HermesLoggerResetErrorsTest", sinon.testCase({
		setUp: function () {
			Hermes.logger.aMessages = [1, 2];
		},
		tearDown: function () {
			Hermes.logger.aMessages = [];
		},
		"test should empty aErrors": function () {
			Hermes.logger.resetMessages();

			assertEquals(0, Hermes.logger.aMessages.length);
		}
	}));

	oTestCase("HermesLoggerNextTimeToSendTest", sinon.testCase({
		setUp: function () {
			this.nTimeLastSent = Hermes.logger.nTimeLastSent;
			this.nTimeout = Hermes.logger.nTimeout;
			Hermes.logger.nTimeLastSent = 1;
			Hermes.logger.nTimeout = 1;
		},
		tearDown: function () {
			Hermes.logger.nTimeLastSent = this.nTimeLastSent;
			Hermes.logger.nTimeout = this.nTimeout;
			Hermes.logger.aMessages = [];
			delete this.nTimeLastSent;
			delete this.nTimeout;
		},
		"test should return 2": function () {
			var nRetrieved = Hermes.logger.nextTimeToSend();

			assertEquals(2, nRetrieved);
		}
	}));

	oTestCase("HermesLoggerForceLogTest", sinon.testCase({
		setUp: function () {
			sinon.stub(Hermes.logger, "immediateLog");
			sinon.stub(Hermes.logger, "log");
			sinon.stub(Hermes.logger, "deferLog");
		},
		tearDown: function () {
			Hermes.logger.immediateLog.restore();
			Hermes.logger.deferLog.restore();
			Hermes.logger.log.restore();
		},
		"test should call immediateLog, log and deferLog one time": function () {
			Hermes.logger.forceLog();

			assertEquals(1, Hermes.logger.immediateLog.callCount);
			assertEquals(1, Hermes.logger.log.callCount);
			assertEquals(1, Hermes.logger.deferLog.callCount);
		}
	}));

	oTestCase("HermesLoggerLogTest", sinon.testCase({
		setUp: function () {
			sinon.stub(Hermes.logger, "notifyAppender");
		},
		tearDown: function () {
			Hermes.logger.notifyAppender.restore();
		},
		"test should call notifyAppender one time with 'log' as argument": function () {
			Hermes.logger.log();

			assertEquals(1, Hermes.logger.notifyAppender.callCount);
			assertEquals('log', Hermes.logger.notifyAppender.getCall(0).args[0]);
		}
	}));

  oTestCase("HermesLoggerErrorTest", sinon.testCase({
    setUp: function () {
      sinon.stub(Hermes.logger, "notifyAppender");
    },
    tearDown: function () {
      Hermes.logger.notifyAppender.restore();
    },
    "test should call notifyAppender one time with 'error' as argument": function () {
      Hermes.logger.error();

      assertEquals(1, Hermes.logger.notifyAppender.callCount);
      assertEquals('error', Hermes.logger.notifyAppender.getCall(0).args[0]);
    }
  }));

	oTestCase("HermesLoggerClearTest", sinon.testCase({
		setUp: function () {
			sinon.stub(Hermes.logger, "notifyAppender");
		},
		tearDown: function () {
			Hermes.logger.notifyAppender.restore();
		},
		"test should call notifyAppender one time with 'clear' as argument": function () {
			Hermes.logger.clear();

			assertEquals(1, Hermes.logger.notifyAppender.callCount);
			assertEquals('clear', Hermes.logger.notifyAppender.getCall(0).args[0]);
		}
	}));

	oTestCase("HermesErrorConstructorTest", sinon.testCase({
		setUp: function () {
		},
		tearDown: function () {
		},
		"test should return Level.ALL for oLevel if nothing is supplied": function () {
			var oMessage = new Hermes.message();
			assertSame(Hermes.level.ALL, oMessage.oLevel);
		},
		"test should return Level.OFF for oLevel if we supply Level.OFF": function () {
			var oMessage = new Hermes.message(Hermes.level.OFF);
			assertSame(Hermes.level.OFF, oMessage.oLevel);
		},
		"test should return 'GENERAL' for sCategory  if nothing is supplied": function () {
			var oMessage = new Hermes.message();
			assertEquals('GENERAL', oMessage.sCategory);
		},
		"test should return 'ESPECIAL' for sCategory  if we supply 'ESPECIAL'": function () {
			var oMessage = new Hermes.message(null, 'ESPECIAL');
			assertEquals('ESPECIAL', oMessage.sCategory);
		},
		"test should return 'Error Undefined' for sMessage  if nothing is supplied": function () {
			var oMessage = new Hermes.message();
			assertEquals('Message Undefined', oMessage.sMessage);
		},
		"test should return 'ESPECIAL Error' for sMessage  if we supply 'ESPECIAL Error'": function () {
			var oMessage = new Hermes.message(null, '', 'ESPECIAL Error');
			assertEquals('ESPECIAL Error', oMessage.sMessage);
		},
		"test should return 'undefined file' for sFilenameUrl  if nothing is supplied": function () {
			var oMessage = new Hermes.message();
			assertNull(oMessage.sFilenameUrl);
		},
		"test should return 'ESPECIAL Error' for sFilenameUrl  if we supply 'ESPECIAL Error'": function () {
			var oMessage = new Hermes.message(null, '', '', 'filename');
			assertEquals('filename', oMessage.sFilenameUrl);
		},
		"test should return 'undefined file' for nLineNumber  if nothing is supplied": function () {
			var oMessage = new Hermes.message();
			assertNull(oMessage.nLineNumber);
		},
		"test should return 'ESPECIAL Error' for nLineNumber  if we supply 10": function () {
			var oMessage = new Hermes.message(null, '', '', '', 10);
			assertEquals(10, oMessage.nLineNumber);
		}
	}));

	oTestCase("HermesErrorSetFilenameUrlTest", sinon.testCase({
		setUp: function () {
		},
		tearDown: function () {
		},
		"test should change the filenameUrl": function () {
			var oMessage = new Hermes.message();

			oMessage.setFilenameUrl('test');

			assertEquals('test', oMessage.sFilenameUrl);
		}
	}));

	oTestCase("HermesErrorSetLineNumberTest", sinon.testCase({
		setUp: function () {
		},
		tearDown: function () {
		},
		"test should change nLineNumber": function () {
			var oMessage = new Hermes.message();

			oMessage.setLineNumber(10);

			assertEquals(10, oMessage.nLineNumber);
		}
	}));

	oTestCase("HermesErrorSetCategoryTest", sinon.testCase({
		setUp: function () {
		},
		tearDown: function () {
		},
		"test should change sCategory": function () {
			var oMessage = new Hermes.message();

			oMessage.setCategory('test');

			assertEquals('test', oMessage.sCategory);
		}
	}));

	oTestCase("HermesErrorSetLevelTest", sinon.testCase({
		setUp: function () {
		},
		tearDown: function () {
		},
		"test should not change oLevel if oLevel is not a Level instance": function () {
			var oMessage = new Hermes.message();

			oMessage.setLevel({});

			assertEquals(Hermes.level.ALL, oMessage.oLevel);
		},
		"test should change oLevel if oLevel is a Level instance": function () {
			var oMessage = new Hermes.message();

			oMessage.setLevel(Hermes.level.DEBUG);

			assertEquals(Hermes.level.DEBUG, oMessage.oLevel);
		}
	}));

	oTestCase("HermesErrorSetMessageTest", sinon.testCase({
		setUp: function () {
		},
		tearDown: function () {
		},
		"test should change sMessage": function () {
			var oMessage = new Hermes.message();

			oMessage.setMessage('test');

			assertEquals('test', oMessage.sMessage);
		}
	}));

	oTestCase("HermesErrorSetDateFormatTest", sinon.testCase({
		setUp: function () {
		},
		tearDown: function () {
		},
		"test should change sDateFormat": function () {
			var oMessage = new Hermes.message();

			oMessage.setDateFormat('test');

			assertEquals('test', oMessage.sDateFormat);
		}
	}));

	oTestCase("HermesErrorGetFormattedDateTest", sinon.testCase({
		setUp: function () {
			this.oMessage = new Hermes.message();
			sinon.stub(this.oMessage.oDateFormatter, "formatDate");
		},
		tearDown: function () {
			this.oMessage.oDateFormatter.formatDate.restore();
			delete this.oMessage;
		},
		"test should call formatDate method one time": function () {
			this.oMessage.getFormattedDate();

			assertEquals(1,this.oMessage.oDateFormatter.formatDate.callCount);
		}
	}));

	oTestCase("HermesLevelConstructorTest", sinon.testCase({
		setUp: function () {
			this.oLevel = new Hermes.level(10, 'test');
		},
		tearDown: function () {
			delete this.oLevel;
		},
		"test should return 10 for the nLevel property": function () {
			assertEquals(10, this.oLevel.nLevel);
		},
		"test should return 'test' for the sLevel property": function () {
			assertEquals('test', this.oLevel.sLevel);
		}
	}));

	oTestCase("HermesLevelGetLevelTest", sinon.testCase({
		setUp: function () {
			this.oLevel = new Hermes.level(10, 'test');
		},
		tearDown: function () {
			delete this.oLevel;
		},
		"test should return 10 for the nLevel property": function () {
			assertEquals(10, this.oLevel.nLevel);
		},
		"test should return 'test' for the sLevel property": function () {
			assertEquals('test', this.oLevel.sLevel);
		}
	}));

	oTestCase("HermesLevelToStringTest", sinon.testCase({
		setUp: function () {
			this.oLevel = new Hermes.level(10, 'test');
		},
		tearDown: function () {
			delete this.oLevel;
		},
		"test should return 'test'": function () {
			assertEquals('test', this.oLevel.toString());
		}
	}));

	oTestCase("HermesLevelValueOfTest", sinon.testCase({
		setUp: function () {
			this.oLevel = new Hermes.level(10, 'test');
		},
		tearDown: function () {
			delete this.oLevel;
		},
		"test should return 10": function () {
			assertEquals(10, this.oLevel.valueOf());
		}
	}));

}(window, document, Hermes));


