import React, { useState } from 'react'

import './CleanerTable.scss'
import './PreviewTable.scss'

import { DataSet } from '../core/DataSet'

interface PreviewTableProps {
	beforeSet: DataSet,
	afterSet: DataSet
}

const getDiff = (beforeSet: DataSet, afterSet: DataSet): (boolean[] | undefined)[] => (
	beforeSet.items.map((beforeItem, i) => {
		const compareItem = afterSet.items[i]
		let changed = []
		for (const col of beforeSet.columns) {
			changed.push(beforeItem[col] !== compareItem[col])
		}
		return changed.every((col) => col === false) ? undefined : changed
	})
)

export default function PreviewTable({ beforeSet, afterSet }: PreviewTableProps) {

	const [diff] = useState(getDiff(beforeSet, afterSet))

	return (
		<div id="table-container">
			<table>
				<thead>
					<tr>
						<th className="item-number"><p>#</p></th>
						{afterSet.columns.map((col, i) => (
							<th key={i}>{col}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{afterSet.items.map((item, i) => (
						<tr key={item._id}>
							<td className={"item-number" + (diff[i] ? " diff" : "")}>
								<p>{i + 1}</p>
							</td>
							{afterSet.columns.map((col, j) => (
								<td key={item._id + " " + col + " " + j} className={diff[i] ? "diff" : ""}>
									<span className={(diff[i] && diff[i]![j]) ? "diff-column" : ""}>{item[col]}</span>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
