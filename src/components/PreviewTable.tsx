import React, { useRef, useState, useEffect} from 'react'

import './CleanerTable.scss'
import './PreviewTable.scss'

import { DataSet, DataItem } from '../core/DataSet'

interface PreviewTableProps {
	beforeSet: DataSet,
	afterSet: DataSet
}

export default function PreviewTable({ beforeSet, afterSet }: PreviewTableProps) {

	const measureColumns = useRef<(HTMLDivElement | null)[]>(new Array(afterSet.columns.length + 1))
	const [colWidths, setColWidths] = useState<string[]>([])

	const diff: (boolean[] | undefined)[] = beforeSet.items.map((beforeItem, i) => {
		const compareItem = afterSet.items[i]
		let changed = []
		for(const col of beforeSet.columns) {
			changed.push(beforeItem[col] !== compareItem[col])
		}
		return changed.every((col) => col === false) ? undefined : changed
	})

	useEffect(() => {
		setColWidths(measureColumns.current.map((a) => {
			if (a)
				return a.clientWidth.toString();
			else
				return ""
		}))
	}, [measureColumns.current.length, window.innerWidth])

	return (
		<div id="table-container">
			<div id="table-content">
				<table id="data-header">
					<thead>
						<tr>
							<th
								style={{
									width: Number(colWidths[0] || 0)
								}}
								className="empty-corner"
							></th>
							{afterSet.columns.map((col, i) => (
								<th
									key={col}
									style={{
										width: Number(colWidths[i + 1] || 0)
									}}
								>{col}</th>
							))}
						</tr>
					</thead>
				</table>
				<div id="data-scrollable">
					<table id="data-content">
						<thead>
							<tr id="data-content-empty-row">
								<td ref={(ref) => measureColumns.current[0] = ref}></td>
								{afterSet.columns.map((col, i) => (
									<td key={col + " " + i} ref={(ref) => measureColumns.current[i + 1] = ref}></td>
								))}
							</tr>
						</thead>
						<tbody>
							{afterSet.items.map((item, i) => (
								<tr key={item._id.toString()}>
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
			</div>
		</div>
	)
}
