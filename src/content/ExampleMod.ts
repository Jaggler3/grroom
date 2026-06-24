export const ExampleModText = `modify((rows, columnNames) => {
	return rows.map((row) => {
		const column = columnNames[0];
		row[column] = row[column].toUpperCase();
		return row;
	});
})
`