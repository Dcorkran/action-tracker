const { expect } = require('chai');
const { ActionTracker, getAvg, parseAction, transformAction, validateAction } = require('../src/actionTracker');

describe('ActionTracker', () => {
  describe('class creation', () => {
    it('should create the action tracker class with appropriate methods', () => {
      const test = new ActionTracker();
      expect(test)
        .to.have.property('addAction')
        .that.is.a('function');
      expect(test)
        .to.have.property('getStats')
        .that.is.a('function');
    });

    it('should create the action tracker class with empty actions object', () => {
      const test = new ActionTracker();
      expect(test)
        .to.have.property('actions')
        .that.deep.equals({});
    });
  });

  describe('ActionTracker - addAction', () => {
    it('should add a new action', () => {
      const AT = new ActionTracker();
      AT.addAction(JSON.stringify({ action: 'jump', time: 100 }));
      AT.addAction(JSON.stringify({ action: 'run', time: 100 }));
      expect(AT.actions).to.deep.equal({ jump: { entries: 1, timeSum: 100 }, run: { entries: 1, timeSum: 100 } });
    });

    it('should update an existing action', () => {
      const AT = new ActionTracker();
      AT.addAction(JSON.stringify({ action: 'jump', time: 100 }));
      AT.addAction(JSON.stringify({ action: 'jump', time: 100 }));
      expect(AT.actions).to.deep.equal({ jump: { entries: 2, timeSum: 200 } });
    });

    it('should throw an error if the action provided is malformed / invalid', () => {
      const AT = new ActionTracker();
      expect(() => AT.addAction({})).to.throw(Error);
    });
  });

  describe('ActionTracker - getStats', () => {
    it('should return an empty JSON array if no actions are tracked', () => {
      const AT = new ActionTracker();
      expect(AT.getStats()).to.equal('[]');
    });

    it('should correctly average times when multiple of the same activity are tracked', () => {
      const AT = new ActionTracker();
      AT.addAction(JSON.stringify({ action: 'jump', time: 100 }));
      AT.addAction(JSON.stringify({ action: 'jump', time: 300 }));
      expect(AT.getStats()).to.equal('[{"action":"jump","avg":200}]');
    });

    it('should correctly average times when multiple of different activities are tracked', () => {
      const AT = new ActionTracker();
      AT.addAction(JSON.stringify({ action: 'jump', time: 100 }));
      AT.addAction(JSON.stringify({ action: 'jump', time: 300 }));
      AT.addAction(JSON.stringify({ action: 'swim', time: 100 }));
      AT.addAction(JSON.stringify({ action: 'swim', time: 200 }));
      AT.addAction(JSON.stringify({ action: 'swim', time: 300 }));
      expect(AT.getStats()).to.equal('[{"action":"jump","avg":200},{"action":"swim","avg":200}]');
    });
  });

  describe('getAvg', () => {
    it('should return the average of a sum of numbers divided by the number of entries', () => {
      const testAvg = getAvg(300, 5);
      expect(testAvg).to.equal(60);
    });
  });

  describe('parseAction', () => {
    it('should return a parsed object if the passed argument is a valid JSON', () => {
      const testObj = { a: 'foo', b: 'bar' };
      const testJSON = JSON.stringify(testObj);
      const parsedObj = parseAction(testJSON);
      expect(parsedObj).to.deep.equal(testObj);
    });

    it('should throw an error if the passed argument is not valid JSON', () => {
      const testObj = { a: 'foo', b: 'bar' };
      expect(() => parseAction(testObj)).to.throw(Error, 'invalid action - must be JSON string');
    });
  });

  describe('validateAction', () => {
    it('should return undefined if the action is valid', () => {
      const testAction = { action: 'foo', time: 100 };
      const testResult = validateAction(testAction);
      expect(testResult).to.equal(undefined);
    });

    it('should throw an error if the action is missing / undefined', () => {
      expect(() => validateAction({})).to.throw(Error, 'invalid action - missing action');
    });

    it('should throw an error if the action is not a string', () => {
      const testAction = { action: 100, time: 100 };
      expect(() => validateAction(testAction)).to.throw(Error, 'invalid action - action must be a string');
    });

    it('should throw an error if the time is missing / undefined', () => {
      const testAction = { action: 'foo' };
      expect(() => validateAction(testAction)).to.throw(Error, 'invalid action - missing time');
    });

    it('should throw an error if the time is not a number, or is less than 0', () => {
      const testAction1 = { action: 'foo', time: 'bar' };
      const testAction2 = { action: 'foo', time: -1 };
      expect(() => validateAction(testAction1)).to.throw(Error, 'invalid action - time must be a positive int');
      expect(() => validateAction(testAction2)).to.throw(Error, 'invalid action - time must be a positive int');
    });
  });

  describe('transformAction', () => {
    it('should return a new action object if no existingAction argument is passed ', () => {
      const transformedAction = transformAction({ time: 100 });
      expect(transformedAction).to.deep.equal({ entries: 1, timeSum: 100 });
    });

    it('should return an updated action object if an existingAction argument is passed ', () => {
      const transformedAction = transformAction({ time: 100 }, { entries: 2, timeSum: 200 });
      expect(transformedAction).to.deep.equal({ entries: 3, timeSum: 300 });
    });
  });
});
