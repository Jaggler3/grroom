import { DataSet } from '../core/DataSet'
import React, { createRef, useEffect } from 'react'

import BaseTable, { AutoResizer, Column, ColumnShape } from 'react-base-table'
import 'react-base-table/styles.css'
import './CleanerTable.scss'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle<{ columnCount: number }>`
	${({ columnCount }) => new Array(columnCount).fill("").map((_, index) =>`
		.AdvanceTable.active-col-${index + 1} [data-col-idx="${index + 1}"]
	`).join(",")} {
		background: #f3f3f3;
	}
`

interface CleanerTableProps {
	dataSet: DataSet;
	jumpToIndex?: number;
	additions?: number[];
	deletions?: number[];
	getBeforeData?: (row: number, cell: string) => string;
}

const headerCellProps = ({ columnIndex }: any) => ({ 'data-col-idx': columnIndex })

export default function CleanerTable({ dataSet, jumpToIndex, additions: additions, getBeforeData }: CleanerTableProps) {

	const tableRef = createRef<BaseTable<unknown>>()

	useEffect(() => {
		if(jumpToIndex && jumpToIndex !== -1) {
			if(tableRef?.current) {
				tableRef.current.scrollToRow(jumpToIndex)
			}
		}
	}, [jumpToIndex])

	const getClasses = ({ rowIndex }: any) => additions && additions.includes(rowIndex) ? "highlight" : ""

	const columns = React.useMemo((): ColumnShape[] => [
		{
			key: "#",
			title: "",
			width: 50,
			align: "center",
			cellRenderer: ({ rowIndex }) => <p>{rowIndex + 1}</p>,
			frozen: Column.FrozenDirection.LEFT,
		},
		...dataSet.columns.map((col) => ({
			key: col,
			dataKey: col,
			width: 150,
			maxWidth: 300,
			resizable: true,
			title: col,
			className: getClasses
		}))
	], [dataSet.columns])

	const cellProps = ({ columnIndex, rowIndex }: any) => ({
		'data-col-idx': columnIndex,
		onMouseEnter: (e:any) => {
			if(!tableRef) return
			const table = tableRef?.current?.getDOMNode()
			if(!table) return
			table.classList.add(`active-col-${columnIndex}`)
		},
		onMouseLeave: () => {
			if(!tableRef) return
			const table = tableRef?.current?.getDOMNode()
			if(!table) return
			table.classList.remove(`active-col-${columnIndex}`)
		},
	})

	return (
		<>
			<div id="main-table-container">
				<GlobalStyle columnCount={dataSet.columns.length} />
				<AutoResizer>
					{(size) => (
						<BaseTable
							ref={tableRef}
							classPrefix="AdvanceTable"
							data={dataSet.items}
							columns={columns}
							cellProps={cellProps}
							headerCellProps={headerCellProps}
							fixed
							{...size}
						/>
					)}
				</AutoResizer>
			</div>
		</>
	)
}
