import { HelpModifier, ModifierGenerator, createModifierID } from "../../core/Modifier"
import { DataSet, DataItem, createDataItemID } from "../../core/DataSet"

const EmptyDropModifier: ModifierGenerator = (data: DataSet) => {
	let modifiers: HelpModifier[] = []

	// 1. Drop empty columns
	const dropColumnEffect = (column: string) => {
		return () => {
			// Remove from columns
			data.columns = data.columns.filter(c => c !== column)
			// Remove from items
			for(let i = 0; i < data.items.length; i++) {
				const newItem = { ...data.items[i] }
				delete newItem[column]
				newItem._id = createDataItemID()
				data.items[i] = newItem
			}
			return data
		}
	}

	for(const column of data.columns) {
		let allEmpty = true
		for(const item of data.items) {
			const piece = item[column] ? item[column].toString().trim() : ""
			if(piece.length > 0) {
				allEmpty = false
				break
			}
		}

		if(allEmpty) {
			modifiers.push({
				id: createModifierID(),
				name: `Drop empty column '${column}'`,
				desc: "Remove this column because all of its cells are completely empty",
				helpEffect: dropColumnEffect(column),
				effect: ""
			})
		}
	}

	// 2. Drop empty rows
	const dropRowsEffect = () => {
		return () => {
			data.items = data.items.filter(item => {
				for(const column of data.columns) {
					const piece = item[column] ? item[column].toString().trim() : ""
					if(piece.length > 0) {
						return true // keep it if at least one column has data
					}
				}
				return false // drop if all are empty
			}).map(item => ({ ...item, _id: createDataItemID() }))
			return data
		}
	}

	let emptyRowsCount = 0
	for(const item of data.items) {
		let allEmpty = true
		for(const column of data.columns) {
			const piece = item[column] ? item[column].toString().trim() : ""
			if(piece.length > 0) {
				allEmpty = false
				break
			}
		}
		if(allEmpty) {
			emptyRowsCount++
		}
	}

	if(emptyRowsCount > 0) {
		modifiers.push({
			id: createModifierID(),
			name: `Drop ${emptyRowsCount} empty row(s)`,
			desc: "Remove rows where all columns are completely empty",
			helpEffect: dropRowsEffect(),
			effect: ""
		})
	}

	return modifiers
}

export default EmptyDropModifier
