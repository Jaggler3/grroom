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