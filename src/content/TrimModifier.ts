import { HelpModifier, ModifierGenerator, createModifierID } from "../core/Modifier"
import { DataSet, DataItem, createDataItemID } from "../core/DataSet"

const TrimModifier: ModifierGenerator = (data: DataSet) => {
	let modifiers: HelpModifier[] = []

	const trimEffect = (column: string) => {
		return () => {
			for(let i = 0; i < data.items.length; i++) {
				const newItem: DataItem = {
					...data.items[i],
					_id: createDataItemID(),
					[column]: data.items[i][column].trim()
				}
				data.items[i] = newItem
			}
			return data
		}
	}

	let usedColumns: string[] = []

	for(const column of data.columns) {
		for(const item of data.items) {
			const piece: string = item[column]
			if(piece.trim().length !== piece.length && !usedColumns.includes(column)) {
				usedColumns.push(column)
				modifiers.push({
					id: createModifierID(),
					name: `Trim '${column}'`,
					desc: "Remove the leading and trailing whitespace of each item in this column",
					helpEffect: trimEffect(column),
					effect: ""
				})
			}
		}
	}

	return modifiers
}

export default TrimModifier