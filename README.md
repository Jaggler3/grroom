![Grroom Logo](logo.png)

# Grroom

Grroom is a data clean-up tool to prepare your data sets for analysis and usage.

## How to use Grroom
On the initial screen, open your CSV file to edit with the "Upload" button to get started. The list of changes you can make are to the right side of the screen. The lower portion of that section are some suggestions detected by Grroom to jump start your data-cleanup efforts.

You can make your own modifiers to apply to your data set. See [Custom Modifiers](#custom-modifiers).

## Modifiers
Modifiers are actions you can apply to your data set to change in the way you desire. Grroom suggests some actions you can take once you upload a data set. You can select "Preview" on any modifier to show exactly how it would modify your data and the specific rows it would affect.

## Custom Modifiers
If Grroom does not come up with a modifier that you need, you can make your own with JavaScript! This can be handy if you want to transform the data is a specific column in every row or even accumulate to fix an indexing issue.

Custom modifiers can be written with ES5 (ES6 and onward coming soon). **You can trust that Grroom does not `eval()` your code or make you vulnerable to XSS and injection attacks:**  The code you write is executed using [JS-Interpreter](https://github.com/NeilFraser/JS-Interpreter/), an amazing library written for exactly this reason: to be used in isolation and safety.

## Writing a custom modifier
When you select the "+ New Modifier" button, an example is used a a template to work with. It is recommended that you maintain the `row` reference when `map`ping through the data set. The wrapping `modify` function is what will be called when your modifier is executed, and it's argument must be a function with the arguments `rows, columnNames`. This function must return a row array in the same structure as it was given as input. Writing code outside of the modify function may result in unexpected behavior.

## Exporting
To export your data set, simply click "Export" to the right of the file name input bar.

# Running locally
In the project directory, you can run `npm start`

# License (MIT)
Copyright (c) 2020 Martin Darazs

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
