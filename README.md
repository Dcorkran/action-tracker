# Action Tracker

Action Tracker is a library class that keeps track of actions, and averages their durations.

## Prerequisites

* You must have `node 6+` and `npm` installed

## Installation

1. `git clone https://github.com/Dcorkran/action-tracker.git && cd action-tracker`
2. `npm install`

## Usage

The ActionTracker class must first be imported and instantiated:

```
const { ActionTracker } = require('{proj_root}/src/actionTracker')

const AT = new ActionTracker();
```

The ActionTracker class has two methods:

1. `addAction` - returning `error` - This function accepts a json serialized string of the form below and maintains an average time
for each action. Each JSON must have an `action` (string), and `time` (int) property. 

```
AT.addAction(JSON.stringify({ action: 'jump', time: 100 }));
AT.addAction(JSON.stringify({ action: 'jump', time: 200 }));
AT.addAction(JSON.stringify({ action: 'swim', time: 100 }));
```

2. `getStats` - returning `string` - returns a serialized json array of the average
time for each action that has been provided to the addAction function.

```
AT.getStats()
// [{"action":"jump","avg":300},{"action":"swim","avg":100}]
```

## Testing

`npm test`