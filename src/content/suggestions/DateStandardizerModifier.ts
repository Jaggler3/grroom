import { HelpModifier, ModifierGenerator, createModifierID } from "../../core/Modifier"
import { DataSet, DataItem, createDataItemID } from "../../core/DataSet"

const DateStandardizerModifier: ModifierGenerator = (data: DataSet) => {
	let modifiers: HelpModifier[] = []

	const standardizeEffect = (column: string) => {
		return () => {
			for(let i = 0; i < data.items.length; i++) {
				const item = data.items[i]
				const piece = item[column] ? item[column].toString().trim() : ""
				if(piece) {
					const parsed = Date.parse(piece)
					if(!isNaN(parsed)) {
						const d = new Date(parsed)
						// Check for valid date parts
						if (!isNaN(d.getFullYear())) {
							const yyyy = d.getFullYear()
							const mm = String(d.getMonth() + 1).padStart(2, '0')
							const dd = String(d.getDate()).padStart(2, '0')
							data.items[i] = {
								...item,
								_id: createDataItemID(),
								[column]: `${yyyy}-${mm}-${dd}`
							}
						}
					}
				}
			}
			return data
		}
	}

	let usedColumns: string[] = []

	for(const column of data.columns) {
		let foundMessyDate = false
		let totalTested = 0
		let validDates = 0

		for(const item of data.items.slice(0, 100)) {
			const piece = item[column] ? item[column].toString().trim() : ""
			if(piece.length > 0) {
				totalTested++
				// Check if it's a valid date
				const parsed = Date.parse(piece)
				// Exclude simple numbers and purely numeric strings to avoid converting arbitrary numbers to dates
				if(!isNaN(parsed) && isNaN(Number(piece))) {
					validDates++
					// If it doesn't strictly match YYYY-MM-DD
					if(!/^\d{4}-\d{2}-\d{2}$/.test(piece)) {
						foundMessyDate = true
					}
				}
			}
		}

		// If a significant portion are dates (e.g., > 50%) and some are messy
		if(foundMessyDate && validDates > 0 && validDates / totalTested > 0.5 && !usedColumns.includes(column)) {
			usedColumns.push(column)
			modifiers.push({
				id: createModifierID(),
				name: `Standardize '${column}' to YYYY-MM-DD`,
				desc: "Convert mixed date formats into standard YYYY-MM-DD format",
				helpEffect: standardizeEffect(column),
				effect: ""
			})
		}
	}

	return modifiers
}

export default DateStandardizerModifier
