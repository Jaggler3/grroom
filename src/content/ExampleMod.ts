export const ExampleModText = `modify(function(rows, columnNames) {
	return rows.map(function(row) {
		var column = columnNames[0]
		row[column] = row[column].toUpperCase();
		return row;
	});
})
`