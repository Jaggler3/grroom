import { HelpModifier, ModifierGenerator, createModifierID } from "../../core/Modifier"
import { DataSet, DataItem, createDataItemID } from "../../core/DataSet"

const DuplicateModifier: ModifierGenerator = (data: DataSet) => {
	let modifiers: HelpModifier[] = []

	const dropDuplicatesEffect = () => {
		return () => {
			const seen = new Set<string>()
			const newItems: DataItem[] = []
			
			for(const item of data.items) {
				// Create a string representation ignoring internal _id
				const comparable = data.columns.map(col => item[col]).join("|||")
				if(!seen.has(comparable)) {
					seen.add(comparable)
					newItems.push({ ...item, _id: createDataItemID() })
				}
			}
			
			data.items = newItems
			return data
		}
	}

	const seen = new Set<string>()
	let duplicatesFound = 0
	
	for(const item of data.items) {
		const comparable = data.columns.map(col => item[col]).join("|||")
		if(seen.has(comparable)) {
			duplicatesFound++
		} else {
			seen.add(comparable)
		}
	}

	if(duplicatesFound > 0) {
		modifiers.push({
			id: createModifierID(),
			name: `Drop ${duplicatesFound} duplicate rows`,
			desc: "Remove rows that have identical values across all columns",
			helpEffect: dropDuplicatesEffect(),
			effect: ""
		})
	}

	return modifiers
}

export default DuplicateModifier
