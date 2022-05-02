import { DataSet, DataItem, createDataItemID } from "./DataSet";
import PapaParse from 'papaparse'

export const Serialize = (dataSet: DataSet): string =>
	PapaParse.unparse([
		dataSet.columns,
		...dataSet.items.map((item) => DataItemToArray(item, dataSet.columns))
	])

const DataItemToArray = (item: DataItem, columns: string[]): string[] => {
	let res: string[] = Array(columns.length)
	for (let i = 0; i < columns.length; i++) {
		res[i] = item[columns[i]]
	}
	return res
}

export const SaveFile = (name: string, fileContents: string) => {
	const fileName = name.endsWith(".csv") ? name : name + ".csv"
	var blob = new Blob([fileContents], { type: 'text/csv' });
	// @ts-ignore
	if (typeof window.navigator.msSaveOrOpenBlob === "function") {
		// @ts-ignore
		window.navigator.msSaveBlob(blob, fileName);
	}
	else {
		var elem = window.document.createElement('a');
		elem.href = window.URL.createObjectURL(blob);
		elem.download = fileName;
		document.body.appendChild(elem);
		elem.click();
		document.body.removeChild(elem);
	}
}

export const Deserialize = (name: string, fileContents: string): DataSet => {
	const parsed = PapaParse.parse(fileContents.trim())
	const count = parsed.data.length

	const fileName = (name.endsWith(".csv") && name !== ".csv") ? name.substring(0, name.length - 1 - ".csv".length) : name

	let result: DataSet = {
		name: fileName,
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

	for (let i = 0; i < columns.length; i++) {
		const col = columns[i]
		item[col] = arr[i]
	}

	return item;
}