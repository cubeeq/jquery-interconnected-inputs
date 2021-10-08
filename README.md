# jquery-interconnected-inputs

A simple and easy accessory for connecting two input fields with extended options.

## Installation

```
npm install jquery-interconnected-inputs
```
## Usage

Install webpack - https://webpack.js.org/guides/installation/

Install webpack plugins:
- https://webpack.js.org/loaders/css-loader/
- https://webpack.js.org/loaders/style-loader/


**index.html**
```
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>

	<div>From:</div>
	<input type="text" id="date_from" readonly="readonly">

	<div>To:</div>
	<input type="text" id="date_to" readonly="readonly">

	<script src="dist/main.js"></script>
</body>
</html>
```

**index.js**

```
// Import dependencies
var $ = require('jquery')
var moment = require('moment')

// Use dependencies
window.jQuery = window.$ = $
window.moment = moment

// Import CSS
import 'jquery-ui-bundle/jquery-ui.css'

// Import settings
require('../jquery-interconnected-inputs')

// Import plugins
require('jquery-ui-bundle')
require('jquery-interconnected-inputs')
```


**jquery-interconnected-inputs.js**
```
window.InterconnectedInputsOptions = {
	
	disableDaysFormat: 'Y/M/D',
	disableDays: [
	'2021-09-12',
	'2021-09-13'
	],

	datepicker: {
		minDate: new  Date('2021-09-03')
	},

	from: {
		input: '#date_from',
		daysDiff: 1,
		datepicker: {}
	},

	to: {
		input: '#date_to',
		daysDiff: 1,
		datepicker: {}
	}

}
```
