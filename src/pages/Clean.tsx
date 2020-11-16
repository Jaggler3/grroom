import React, { useState, useRef, useEffect } from 'react'

/**
 * page loads table and suggestion sidebar, modal asks for data set, you can select the example data set or upload
 * top of sidebar has "create mod" button
 * below create mod button shows "suggested"
 * mods slide into sidebar
 * you can preview mods
 */

import './Clean.scss'
import Header from '../components/Header'
import { DataSet } from '../core/DataSet'
import CleanerTable from '../components/CleanerTable'
import Mods from '../components/Mods'
import { Modifier, HelpModifier } from '../core/Modifier'

const TestDataSet: DataSet = {
	lastModified: 0,
	name: "Test.csv",
	columns: [
		"Name",
		"Phone",
		"Type"
	],
	items: [
		{ _id: 0, "Name": "Martin", "Phone": "8035558030", "Type": "Student" },
		{ _id: 1, "Name": "Andrew", "Phone": "+1(803)-555-8030", "Type": "  Student" },
		{ _id: 2, "Name": "Darazs", "Phone": "8035558030", "Type": "student" },
		{ _id: 3, "Name": "isodore", "Phone": "8035558030", "Type": "Professor" },
		{ _id: 4, "Name": "Andrew", "Phone": "+1(803)-555-8030", "Type": "  Student" },
		{ _id: 5, "Name": "Darazs", "Phone": "8035558030", "Type": "student" },
		{ _id: 6, "Name": "isodore", "Phone": "8035558030", "Type": "Professor" },
		{ _id: 7, "Name": "Andrew", "Phone": "+1(803)-555-8030", "Type": "  Student" },
		{ _id: 8, "Name": "Darazs", "Phone": "8035558030", "Type": "student" },
		{ _id: 9, "Name": "isodore", "Phone": "8035558030", "Type": "Professor" },
		{ _id: 10, "Name": "Andrew", "Phone": "+1(803)-555-8030", "Type": "  Student" },
		{ _id: 22, "Name": "Darazs", "Phone": "8035558030", "Type": "student" },
		{ _id: 32, "Name": "isodore", "Phone": "8035558030", "Type": "Professor" },
		{ _id: 13, "Name": "Andrew", "Phone": "+1(803)-555-8030", "Type": "  Student" },
		{ _id: 24, "Name": "Darazs", "Phone": "8035558030", "Type": "student" },
		{ _id: 35, "Name": "isodore", "Phone": "8035558030", "Type": "Professor" },
	]
}

export default function Clean() {

	const [dataSet, setDataSet] = useState<DataSet>(TestDataSet)

	const measureColumns = useRef<(HTMLDivElement | null)[]>(new Array(TestDataSet.columns.length + 1))
	const [colWidths, setColWidths] = useState<string[]>([])

	useEffect(() => {
		setColWidths(measureColumns.current.map((a) => {
			let val: string = "";
			if(a) {
				val = a.clientWidth.toString();
			}
			return val;
		}))
	}, [])

	const applyMod = (mod: HelpModifier) => {
		let newData = mod.effect()
		setDataSet({
			...newData
		})
	}

	return (
		<div id="main">
			<Header />
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
				<CleanerTable dataSet={dataSet} colWidths={colWidths} measureColumns={measureColumns} />
				<Mods dataSet={dataSet} applyMod={applyMod} />
			</div>
		</div>
	)
}
