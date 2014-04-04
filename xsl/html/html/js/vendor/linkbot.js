// Generated by CoffeeScript 1.4.0
(function() {
  var Linkbot, baroboBridge, buttonAction, wheelAction,
    __hasProp = {}.hasOwnProperty;

  baroboBridge = this.baroboBridge != null ? this.baroboBridge : {
    angularSpeed: function() {},
    beginScan: function() {},
    connectRobot: function() {},
    disableAccelSignals: function() {},
    disableButtonSignals: function() {},
    disableMotorSignals: function() {},
    disconnectRobot: function() {},
    enableAccelSignals: function() {},
    enableButtonSignals: function() {},
    enableMotorSignals: function() {},
    fetch: function() {},
    move: function() {},
    numConnectedRobots: function() {},
    setLEDColor: function() {},
    setMotorEventThreshold: function() {},
    stop: function() {},
    buttonChanged: {
      connect: function() {},
      disconnect: function() {}
    },
    motorsChanged: {
      connect: function() {},
      disconnect: function() {}
    },
    motorChanged: {
      connect: function() {},
      disconnect: function() {}
    },
    accelChanged: {
      connect: function() {},
      disconnect: function() {}
    },
    idScanned: {
      connect: function() {},
      disconnect: function() {}
    },
    fetchFinished: {
      connect: function() {},
      disconnect: function() {}
    }
  };

  Linkbot = (function() {

    Linkbot.prototype._wheelRadius = 1.75;

    function Linkbot(_id) {
      var err, m, _i;
      this._id = _id;
      err = baroboBridge.connectRobot(this._id);
      if (err < 0) {
        throw "Linkbot connection failed. id: " + this._id;
      }
      for (m = _i = 1; _i <= 3; m = ++_i) {
        baroboBridge.setMotorEventThreshold(this._id, m, 1e10);
      }
      this.wheelPositions = baroboBridge.getMotorAngles(this._id);
    }

    Linkbot.prototype.color = function(r, g, b) {
      return baroboBridge.setLEDColor(this._id, r, g, b);
    };

    Linkbot.prototype.angularSpeed = function(s1, s2, s3) {
      if (s2 == null) {
        s2 = s1;
      }
      if (s3 == null) {
        s3 = s1;
      }
      return baroboBridge.angularSpeed(this._id, s1, s2, s3);
    };

    Linkbot.prototype.move = function(r1, r2, r3) {
      return baroboBridge.move(this._id, r1, r2, r3);
    };

    Linkbot.prototype.stop = function() {
      return baroboBridge.stop(this._id);
    };

    Linkbot.prototype.disconnect = function() {
      baroboBridge.disconnectRobot(this._id);
      return this._id = null;
    };

    Linkbot.prototype.register = function(connections) {
      var act, buttonId, registerObject, wheelId, _ref, _ref1, _results, _wheelId;
      if (connections.button != null) {
        _ref = connections.button;
        for (buttonId in _ref) {
          if (!__hasProp.call(_ref, buttonId)) continue;
          registerObject = _ref[buttonId];
          act = buttonAction(this, parseInt(buttonId), registerObject.callback, registerObject.data);
          baroboBridge.buttonChanged.connect(act);
          baroboBridge.enableButtonSignals(this._id);
        }
      }
      if (connections.wheel != null) {
        _ref1 = connections.wheel;
        _results = [];
        for (_wheelId in _ref1) {
          if (!__hasProp.call(_ref1, _wheelId)) continue;
          registerObject = _ref1[_wheelId];
          wheelId = parseInt(_wheelId);
          act = wheelAction(this, wheelId, registerObject.callback, registerObject.data);
          baroboBridge.setMotorEventThreshold(this._id, wheelId, registerObject.distance);
          baroboBridge.motorChanged.connect(act);
          _results.push(baroboBridge.enableMotorSignals(this._id));
        }
        return _results;
      }
    };

    return Linkbot;

  })();

  buttonAction = function(robot, buttonId, callback, model) {
    if (model == null) {
      model = {};
    }
    return function(robID, btnID, press) {
      if (press === 1 && robot._id === robID && buttonId === btnID) {
        return callback(robot, model, {
          button: btnID
        });
      }
    };
  };

  wheelAction = function(robot, wheelId, callback, model) {
    if (model == null) {
      model = {};
    }
    return function(robID, _wheelId, angle) {
      var diff;
      if (robot._id === robID && wheelId === _wheelId) {
        diff = angle - robot.wheelPositions[wheelId - 1];
        robot.wheelPositions[wheelId - 1] = angle;
        return callback(robot, model, {
          triggerWheel: wheelId,
          position: angle,
          difference: diff
        });
      }
    };
  };

  this.Linkbots = {
    scan: function() {
      return baroboBridge.scan();
    },
    connect: function(id) {
      return new Linkbot(id);
    }
  };

}).call(this);
