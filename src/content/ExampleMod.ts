export const ExampleModText = `modify(function(rows, columnNames) {
	rows.map(function(row) {
		var newRow = Object.assign({}, row);
		var column = columnNames[0]
		newRow[column] = newRow[column].toUpperCase();
		return newRow;
	});
})
`