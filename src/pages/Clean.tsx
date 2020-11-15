import React, { useState, useRef, useEffect, createRef } from 'react'

/**
 * page loads table and suggestion sidebar, modal asks for data set, you can select the example data set or upload
 * top of sidebar has "create mod" button
 * below create mod button shows "suggested"
 * mods slide into sidebar
 * you can preview mods
 */

import './Clean.scss'

interface DataItem {
	_id: Number,
	[key: string]: any
}

interface DataSet {
	name: string,
	columns: string[],
	items: DataItem[]
}

const TestDataSet: DataSet = {
	name: "Test.csv",
	columns: [
		"x",
		"y",
		"z"
	],
	items: [
		{ _id: 0, x: "hello", y: "world", z: "12345" },
		{ _id: 1, x: "hello", y: "orld", z: "52143452" },
		{ _id: 2, x: "hello", y: "world", z: "532123" },
		{ _id: 3, x: "hello", y: "world", z: "512987" },
	]
}

export default function Clean() {

	const [dataSet, setDataSet] = useState(TestDataSet)

	const measureColumns = useRef<(HTMLDivElement | null)[]>(new Array(TestDataSet.columns.length + 1))
	const [colWidths, setColWidths] = useState<(string | undefined)[]>([])

	useEffect(() => {
		setColWidths(measureColumns.current.map((a) => a?.offsetWidth + ""))
	}, [])

	return (
		<div id="main">
			<header>
				<p>Grroom</p>
				<button>
					<p>Import</p>
				</button>
			</header>
			<div id="top">
				<div id="name">
					<input placeholder="Your data set name..." />
				</div>
				<div id="top-buttons">
					<button>
						<p>Export</p>
					</button>
				</div>
			</div>
			<div id="center">
				<div id="table-container">
					<div id="table-content">
						<table id="data-header">
							<tr>
								<th style={{
									width: colWidths[0]
								}}>#</th>
								{dataSet.columns.map((col, i) => (
									<th key={col} style={{
										width: colWidths[i + 1]
									}}>{col}</th>
								))}
							</tr>
						</table>
						<table id="data-content">
							<tr id="data-content-empty-row">
								<td ref={(ref) => measureColumns.current[0] = ref}></td>
								{dataSet.columns.map((col, i) => (
									<td key={col + " " + i} ref={(ref) => measureColumns.current[i + 1] = ref}></td>
								))}
							</tr>
							{dataSet.items.map((item, i) => (
								<tr key={item._id.toString()}>
									<td className="item-number">{i + 1}</td>
									{dataSet.columns.map((col, i) => (
										<td key={item._id + " " + col + " " + i}>{item[col]}</td>
									))}
								</tr>
							))}
						</table>
					</div>
				</div>
				<div id="mods">
					<h2>Mods</h2>
					<button>
						<p>+ New Mod</p>
					</button>
					<h3>Suggestions</h3>
					<div id="mod-suggestions"></div>
				</div>
			</div>
		</div>
	)
}
