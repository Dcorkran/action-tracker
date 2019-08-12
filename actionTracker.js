// could put the non-actionTracker functions in a helper / utils file but as they are currently specific to the actionTracker class i don't think it's necessary

const getAvg = (sum, n) => sum / n;

const parseAction = stringAction => {
  try {
    return JSON.parse(stringAction);
  } catch (error) {
    throw new Error('invalid action - must be JSON string');
  }
};

const validateAction = actionObj => {
  const { action, time } = actionObj;
  if (!action) {
    throw new Error('invalid action - missing action');
  }
  if (typeof action !== 'string') {
    throw new Error('invalid action - action must be a string');
  }
  if (!time) {
    throw new Error('invalid action - missing time');
  }
  if (typeof time !== 'number' || time < 0) {
    throw new Error('invalid action - time must be a positive int');
  }
};

const transformAction = (newAction, existingAction) => {
  if (existingAction) {
    const { entries, timeSum } = existingAction;
    const updatedEntries = entries + 1;
    const updatedTimeSum = timeSum + newAction.time;
    return { entries: updatedEntries, timeSum: updatedTimeSum };
  }
  const { time } = newAction;
  return { entries: 1, timeSum: time };
};

class ActionTracker {
  constructor() {
    this.actions = {};
  }

  addAction = actionString => {
    try {
      const actionObj = parseAction(actionString);
      validateAction(actionObj);
      const actionType = actionObj.action;
      if (this.actions[actionType]) {
        this.actions[actionType] = transformAction(actionObj, this.actions[actionType]);
      } else {
        this.actions[actionType] = transformAction(actionObj);
      }
    } catch (error) {
      throw new Error(`addAction - ${error.message}`);
    }
  };

  getStats = () => {
    const stats = [];
    for (const key in this.actions) {
      const action = this.actions[key];
      const { entries, timeSum } = action;
      stats.push({ action: key, avg: getAvg(timeSum, entries) });
    }
    return JSON.stringify(stats);
  };
}

module.exports = {
  ActionTracker,
  getAvg,
  parseAction,
  transformAction,
  validateAction,
};
