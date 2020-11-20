export interface DataItem {
	_id: Number,
	[key: string]: any
}

export interface DataSet {
	lastModified: number,
	name: string,
	columns: string[],
	items: DataItem[]
}

export const createDataItemID = () => Math.floor(Math.random() * 8999999999 + 1000000000)

export const EmptyDataSet: DataSet = {
	lastModified: 0,
	name: "",
	columns: [],
	items: []
}