import React, { MutableRefObject } from 'react'
import { DataSet } from '../core/DataSet'
import './CleanerTable.scss'

interface CleanerTableProps {
	dataSet: DataSet,
	colWidths: string[],
	measureColumns: MutableRefObject<(HTMLDivElement | null)[]>
}

export default function CleanerTable({ dataSet, colWidths, measureColumns }: CleanerTableProps) {
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
							{dataSet.columns.map((col, i) => (
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
								{dataSet.columns.map((col, i) => (
									<td key={col + " " + i} ref={(ref) => measureColumns.current[i + 1] = ref}></td>
								))}
							</tr>
						</thead>
						<tbody>
							{dataSet.items.map((item, i) => (
								<tr key={item._id.toString()}>
									<td className="item-number">
										<p>{i + 1}</p>
									</td>
									{dataSet.columns.map((col, i) => (
										<td key={item._id + " " + col + " " + i}>
											{item[col]}
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
