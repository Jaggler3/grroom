import { HelpModifier, ModifierGenerator, createModifierID } from "../../core/Modifier"
import { DataSet, createDataItemID } from "../../core/DataSet"

const CapitalizeModifier: ModifierGenerator = (data: DataSet) => {
	let modifiers: HelpModifier[] = []

	const capitalizeEffect = (column: string) => {
		return () => {
			for(let i = 0; i < data.items.length; i++) {
				const item = data.items[i]
				const original: string = item[column]
				const firstCharIndex = original.length - original.trimStart().length;
				data.items[i] = {
					...item,
					_id: createDataItemID(),
					[column]: original.substring(0, firstCharIndex) + //whitespace
					original.charAt(firstCharIndex).toUpperCase() + //capitalize
					(original.length > firstCharIndex ? original.substring(firstCharIndex + 1) : "") //text after first character
				}
			}
			return data
		}
	}

	let usedColumns: string[] = []

	for(const column of data.columns) {
		for(const item of data.items.slice(0, 100)) {
			const piece: string = item[column].trim()
			if(piece.length > 0) {
				const start: string = piece.charAt(0)
				if(start != start.toUpperCase() && !usedColumns.includes(column)) {
					usedColumns.push(column)
					modifiers.push({
						id: createModifierID(),
						name: `Capitalize '${column}'`,
						desc: "Make the first character of each item in this column uppercase",
						helpEffect: capitalizeEffect(column),
						effect: ""
					})
				}
			}
		}
	}

	return modifiers
}

export default CapitalizeModifier