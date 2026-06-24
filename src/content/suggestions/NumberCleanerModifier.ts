import { HelpModifier, ModifierGenerator, createModifierID } from "../../core/Modifier"
import { DataSet, DataItem, createDataItemID } from "../../core/DataSet"

const NumberCleanerModifier: ModifierGenerator = (data: DataSet) => {
	let modifiers: HelpModifier[] = []

	const cleanNumberEffect = (column: string) => {
		return () => {
			for(let i = 0; i < data.items.length; i++) {
				const item = data.items[i]
				const piece = item[column] ? item[column].toString().trim() : ""
				if(piece) {
					// Strip everything except digits, minus sign, and decimal point
					const cleaned = piece.replace(/[^\d.-]/g, '')
					if(!isNaN(Number(cleaned)) && cleaned.length > 0) {
						data.items[i] = {
							...item,
							_id: createDataItemID(),
							[column]: cleaned
						}
					}
				}
			}
			return data
		}
	}

	let usedColumns: string[] = []

	for(const column of data.columns) {
		let totalTested = 0
		let messyNumbers = 0

		for(const item of data.items.slice(0, 100)) {
			const piece = item[column] ? item[column].toString().trim() : ""
			if(piece.length > 0) {
				totalTested++
				// Check if it's currently NOT a pure number but contains numbers (like "$1,200.50")
				if(isNaN(Number(piece)) && /\d/.test(piece)) {
					// Strip out expected currency/formatting chars
					const cleaned = piece.replace(/[^\d.-]/g, '')
					if(!isNaN(Number(cleaned)) && cleaned.length > 0) {
						messyNumbers++
					}
				}
			}
		}

		if(messyNumbers > 0 && messyNumbers / totalTested > 0.5 && !usedColumns.includes(column)) {
			usedColumns.push(column)
			modifiers.push({
				id: createModifierID(),
				name: `Extract Numbers from '${column}'`,
				desc: "Remove text and symbols to leave only pure numbers",
				helpEffect: cleanNumberEffect(column),
				effect: ""
			})
		}
	}

	return modifiers
}

export default NumberCleanerModifier
