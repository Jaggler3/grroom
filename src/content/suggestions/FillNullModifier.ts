import { HelpModifier, ModifierGenerator, createModifierID } from "../../core/Modifier"
import { DataSet, DataItem, createDataItemID } from "../../core/DataSet"

const FillNullModifier: ModifierGenerator = (data: DataSet) => {
	let modifiers: HelpModifier[] = []

	const fillNullEffect = (column: string, defaultValue: string = "N/A") => {
		return () => {
			for(let i = 0; i < data.items.length; i++) {
				const item = data.items[i]
				const piece = item[column] ? item[column].toString().trim() : ""
				if(piece.length === 0) {
					data.items[i] = {
						...item,
						_id: createDataItemID(),
						[column]: defaultValue
					}
				}
			}
			return data
		}
	}

	let usedColumns: string[] = []

	for(const column of data.columns) {
		let emptyCells = 0
		let totalTested = 0

		for(const item of data.items) {
			totalTested++
			const piece = item[column] ? item[column].toString().trim() : ""
			if(piece.length === 0) {
				emptyCells++
			}
		}

		// Suggest filling nulls if there are SOME missing values, but not ALL missing values
		if(emptyCells > 0 && emptyCells < totalTested && !usedColumns.includes(column)) {
			usedColumns.push(column)
			modifiers.push({
				id: createModifierID(),
				name: `Fill missing values in '${column}'`,
				desc: `Replace empty cells with "N/A"`,
				helpEffect: fillNullEffect(column),
				effect: ""
			})
		}
	}

	return modifiers
}

export default FillNullModifier
