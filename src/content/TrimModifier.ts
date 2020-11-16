import { HelpModifier, ModifierGenerator, createModifierID } from "../core/Modifier"
import { DataSet } from "../core/DataSet"

const TrimModifier: ModifierGenerator = (data: DataSet) => {
	let modifiers: HelpModifier[] = []

	const trimEffect = (column: string) => {
		return () => {
			for(const item of data.items) {
				item[column] = item[column].trim()
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
					effect: trimEffect(column)
				})
			}
		}
	}

	return modifiers
}

export default TrimModifier