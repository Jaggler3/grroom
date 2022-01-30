import { HelpModifier, ModifierGenerator, createModifierID } from "../../core/Modifier"
import { DataSet, createDataItemID } from "../../core/DataSet"

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

const checkColumnNeedsFormatting = (data: DataSet, column: string) => {
	let count = 0

	for(const item of data.items) {
		const text: string = item[column].trim()
		if(text.length < 7) continue
		let numCount = 0
		for(let i = 0; i < text.length; i++) {
			if(numbers.indexOf(text[i]) !== -1) {
				numCount++
			}
		}
		if([7, 10, 11].indexOf(numCount) !== -1 && !text.includes("/") && numCount < text.length) {
			count++
		}
	}

	return (count / data.items.length) >= 0.5
}

const PhoneFormatModifier: ModifierGenerator = (data: DataSet) => {
	let modifiers: HelpModifier[] = []

	const effect = (column: string) => () => {
		for(let i = 0; i < data.items.length; i++) {
			const item = data.items[i]
			const original: string = item[column]
			let result = ""
			for(let j = 0; j < original.length; j++) {
				if(numbers.indexOf(original[j]) !== -1) {
					result += "" + original[j]
				}
			}
			
			data.items[i] = {
				...item,
				_id: createDataItemID(),
				[column]: result
			}
		}
		return data
	}

	let usedColumns: string[] = []

	for(const column of data.columns) {
		const check = checkColumnNeedsFormatting(data, column)
		if(!usedColumns.includes(column) && check) {
			usedColumns.push(column)
			modifiers.push({
				id: createModifierID(),
				name: `Format Phone Numbers in '${column}'`,
				desc: "Remove unecessary characters from phone numbers. Whitespace will be trimmed.",
				helpEffect: effect(column),
				effect: "",
				premium: true
			})
		}
	}

	return modifiers
}

export default PhoneFormatModifier