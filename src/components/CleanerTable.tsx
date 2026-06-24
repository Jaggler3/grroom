import { DataSet } from '../core/DataSet'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModule, CellValueChangedEvent, ColDef, ModuleRegistry, RowClassParams } from 'ag-grid-community'

ModuleRegistry.registerModules([AllCommunityModule])

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import './CleanerTable.scss'

interface CleanerTableProps {
	dataSet: DataSet;
	jumpToIndex?: number;
	additions?: number[];
	deletions?: number[];
	getBeforeData?: (row: number, cell: string) => string;
	onCellEdit?: (rowIndex: number, column: string, value: string, dataSet: DataSet) => DataSet;
}

export default function CleanerTable({ dataSet, jumpToIndex, additions, onCellEdit }: CleanerTableProps) {

	const gridRef = useRef<AgGridReact>(null)
	const [gridApi, setGridApi] = useState<any>(null)

	const onGridReady = useCallback((params: any) => {
		setGridApi(params.api)
	}, [])

	useEffect(() => {
		if (jumpToIndex !== undefined && jumpToIndex !== -1 && gridApi) {
			gridApi.ensureIndexVisible(jumpToIndex)
		}
	}, [jumpToIndex, gridApi])

	const onCellValueChanged = useCallback((event: CellValueChangedEvent) => {
		if (!onCellEdit) return
		const rowIndex = event.rowIndex
		const col = event.colDef.field
		if (rowIndex === null || rowIndex === undefined || !col) return
		onCellEdit(rowIndex, col, event.newValue ?? "", dataSet)
	}, [onCellEdit, dataSet])

	const rowClassRules = useMemo(() => ({
		'highlight': (params: RowClassParams) => {
			if (!additions) return false
			return additions.includes(params.rowIndex)
		}
	}), [additions])

	const columnDefs = useMemo((): ColDef[] => {
		const cols: ColDef[] = [
			{
				colId: '_rowNumber',
				headerName: '',
				width: 65,
				pinned: 'left',
				sortable: false,
				suppressMovable: true,
				valueGetter: (params: any) => params.node.rowIndex + 1,
			}
		]

		const colNames = dataSet.columns
		for (let i = 0; i < colNames.length; i++) {
			const isLast = i === colNames.length - 1
			cols.push({
				field: colNames[i],
				headerName: colNames[i],
				width: 150,
				maxWidth: isLast ? undefined : 300,
				resizable: true,
				editable: true,
				flex: isLast ? 1 : undefined,
			})
		}

		return cols
	}, [dataSet.columns])

	return (
			<div id="main-table-container" className="ag-theme-alpine ag-theme-grroom">
				<AgGridReact
					ref={gridRef}
					rowData={dataSet.items}
					columnDefs={columnDefs}
					onGridReady={onGridReady}
					onCellValueChanged={onCellValueChanged}
					rowClassRules={rowClassRules}
					headerHeight={32}
					rowHeight={28}
					stopEditingWhenCellsLoseFocus={true}
					columnHoverHighlight={true}
					enableCellTextSelection={true}
					ensureDomOrder={true}
					suppressMovableColumns={true}
					suppressRowClickSelection={true}
					suppressDragLeaveHidesColumns={true}
					defaultColDef={{
						sortable: false,
						suppressMovable: true,
						filter: false,
					}}
				/>
			</div>
	)
}
