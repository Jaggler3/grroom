import { HelpModifier, ModifierGenerator, createModifierID } from "../../core/Modifier"
import { DataSet, DataItem, createDataItemID } from "../../core/DataSet"

const EmailModifier: ModifierGenerator = (data: DataSet) => {
	let modifiers: HelpModifier[] = []

	const normalizeEmailEffect = (column: string) => {
		return () => {
			for(let i = 0; i < data.items.length; i++) {
				const item = data.items[i]
				const piece = item[column] ? item[column].toString() : ""
				data.items[i] = {
					...item,
					_id: createDataItemID(),
					[column]: piece.trim().toLowerCase()
				}
			}
			return data
		}
	}

	let usedColumns: string[] = []

	for(const column of data.columns) {
		let totalTested = 0
		let emails = 0
		let messyEmails = 0

		for(const item of data.items.slice(0, 100)) {
			const piece = item[column] ? item[column].toString() : ""
			if(piece.length > 0) {
				totalTested++
				if(piece.includes("@") && piece.includes(".")) {
					emails++
					// Check if messy (uppercase or whitespace)
					if(piece !== piece.trim().toLowerCase()) {
						messyEmails++
					}
				}
			}
		}

		// If a column looks like emails and some are messy
		if(messyEmails > 0 && emails / totalTested > 0.5 && !usedColumns.includes(column)) {
			usedColumns.push(column)
			modifiers.push({
				id: createModifierID(),
				name: `Normalize Emails in '${column}'`,
				desc: "Make all emails lowercase and remove any surrounding whitespace",
				helpEffect: normalizeEmailEffect(column),
				effect: ""
			})
		}
	}

	return modifiers
}

export default EmailModifier
