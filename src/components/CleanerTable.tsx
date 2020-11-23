import React from 'react'

import './CleanerTable.scss'
import { DataSet } from '../core/DataSet'

interface CleanerTableProps { dataSet: DataSet }

export default function CleanerTable({ dataSet }: CleanerTableProps) {
	return (
		<div id="table-container">
			<table>
				<thead>
					<tr>
						<th className="item-number"><p>#</p></th>
						{dataSet.columns.map((col, i) => (
							<th key={i}>{col}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{dataSet.items.map((item, i) => (
						<tr key={item._id}>
							<td className="item-number"><p>{i + 1}</p></td>
							{dataSet.columns.map((col, i) => (
								<td key={item._id.toString() + i}>
									{item[col]}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
