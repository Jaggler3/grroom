import { DataSet, DataItem, createDataItemID } from "./DataSet";
import PapaParse from 'papaparse'

export const Serialize = (dataSet: DataSet): string => {
	let res = "";

	return res;
}

export const Deserialize = (name: string, fileContents: string): DataSet => {
	const parsed = PapaParse.parse(fileContents)
	const count = parsed.data.length
	
	let result: DataSet = {
		name,
		items: [],
		columns: [],
		lastModified: Date.now()
	}

	switch (count) {
		case 0:
			break;
		case 1:
			result.columns = parsed.data[0] as string[]
			break;
		default:
			result.columns = parsed.data[0] as string[]
			result.items = (parsed.data.slice(1) as string[][]).map((row: string[]) => ArrayToDataItem(row, result.columns))
			break;
	}

	return result;
}

const ArrayToDataItem = (arr: string[], columns: string[]): DataItem => {
	let item: DataItem = {
		_id: createDataItemID()
	}

	for(let i = 0; i < columns.length; i++) {
		const col = columns[i]
		item[col] = arr[i]
	}

	return item;
}