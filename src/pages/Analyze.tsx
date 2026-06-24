import React, { useMemo, useState } from "react"
import { AgGridReact } from "ag-grid-react"
import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import "./Analyze.scss"
import { DataSet } from "../core/DataSet"
import SummaryCard from "../components/SummaryCard"
import ColumnProfiler from "../components/ColumnProfiler"
import QualityBadge from "../components/QualityBadge"

ModuleRegistry.registerModules([AllCommunityModule])

interface AnalyzeProps {
	dataSet: DataSet;
}

interface ColumnQuality {
	column: string;
	completeness: number;
	emptyCount: number;
	uniqueCount: number;
}

export default function Analyze({ dataSet }: AnalyzeProps) {
	const [selectedColumn, setSelectedColumn] = useState<string | null>(null)
	const [duplicateThreshold, setDuplicateThreshold] = useState(0)

	const totalRows = dataSet.items.length
	const totalColumns = dataSet.columns.length
	const totalCells = totalRows * totalColumns

	const emptyCells = useMemo(() => {
		let count = 0
		for (const item of dataSet.items) {
			for (const col of dataSet.columns) {
				if (item[col] === null || item[col] === undefined || String(item[col]).trim() === "") {
					count++
				}
			}
		}
		return count
	}, [dataSet])

	const emptyPct = totalCells > 0 ? Math.round((emptyCells / totalCells) * 100) : 0

	const columnQuality = useMemo((): ColumnQuality[] => {
		return dataSet.columns.map(col => {
			let emptyCount = 0
			const values: string[] = []
			for (const item of dataSet.items) {
				const v = item[col]
				if (v === null || v === undefined || String(v).trim() === "") {
					emptyCount++
				} else {
					values.push(String(v).trim())
				}
			}
			const uniqueCount = new Set(values).size
			const completeness = totalRows > 0 ? (totalRows - emptyCount) / totalRows : 0
			return { column: col, completeness, emptyCount, uniqueCount }
		})
	}, [dataSet])

	const duplicates = useMemo(() => {
		const seen: Record<string, number[]> = {}
		const threshold = duplicateThreshold
		const cols = dataSet.columns.slice(threshold === 0 ? 0 : threshold - 1, threshold === 0 ? undefined : threshold)

		for (let i = 0; i < dataSet.items.length; i++) {
			const item = dataSet.items[i]
			const key = cols.map(c => String(item[c] ?? "")).join("||")
			if (!seen[key]) seen[key] = []
			seen[key].push(i)
		}

		return Object.values(seen).filter(indices => indices.length > 1)
	}, [dataSet, duplicateThreshold])

	const duplicateCount = duplicates.length

	const columnDefs = useMemo((): ColDef[] => {
		return [
			{ colId: "_rowNumber", headerName: "", width: 50, pinned: "left", sortable: false, suppressMovable: true,
				valueGetter: (params: any) => params.node.rowIndex + 1 },
			...dataSet.columns.map(col => ({
				field: col,
				headerName: col,
				width: 150,
				resizable: true,
			})),
		]
	}, [dataSet.columns])

	const selectedColumnData = selectedColumn && dataSet.columns.includes(selectedColumn)
		? selectedColumn
		: (dataSet.columns[0] ?? null)

	return (
		<div id="analyze">
			<div className="analyze-summary">
				<SummaryCard icon="fa-table" label="Total Rows" value={totalRows} color="#43CFBD" />
				<SummaryCard icon="fa-columns" label="Columns" value={totalColumns} color="#43CFBD" />
				<SummaryCard icon="fa-circle-exclamation" label="Empty Cells" value={`${emptyPct}%`} color={emptyPct > 10 ? "#E6A344" : "#43CFBD"} />
				<SummaryCard icon="fa-copy" label="Duplicate Groups" value={duplicateCount} color={duplicateCount > 0 ? "#E6446F" : "#43CFBD"} />
			</div>

			<div className="analyze-columns">
				<div className="analyze-column-list">
					<h3>Columns</h3>
					{dataSet.columns.map(col => {
						const q = columnQuality.find(c => c.column === col)
						return (
							<div
								key={col}
								className={`acl-item ${selectedColumnData === col ? "selected" : ""}`}
								onClick={() => setSelectedColumn(col)}
							>
								<span className="acl-name">{col}</span>
								{q && <QualityBadge label="Complete" value={q.completeness} />}
							</div>
						)
					})}
				</div>
				<div className="analyze-column-detail">
					{selectedColumnData && (
						<ColumnProfiler column={selectedColumnData} items={dataSet.items} />
					)}
				</div>
			</div>

			<div className="analyze-duplicates">
				<h3>Duplicate Finder</h3>
				<div className="ad-controls">
					<label>Match columns:</label>
					<select
						value={duplicateThreshold}
						onChange={e => setDuplicateThreshold(Number(e.target.value))}
					>
						<option value={0}>All columns</option>
						{dataSet.columns.map((col, i) => (
							<option key={col} value={i + 1}>First {i + 1} column{i > 0 ? "s" : ""}</option>
						))}
					</select>
					<span className="ad-count">
						{duplicateCount > 0
							? `${duplicateCount} group${duplicateCount > 1 ? "s" : ""} with duplicates`
							: "No duplicates found"}
					</span>
				</div>
				<div className="ag-theme-alpine ag-theme-grroom">
					<AgGridReact
						rowData={dataSet.items}
						columnDefs={columnDefs}
						headerHeight={32}
						rowHeight={28}
						suppressMovableColumns={true}
						suppressRowClickSelection={true}
						suppressDragLeaveHidesColumns={true}
						defaultColDef={{ sortable: false, suppressMovable: true, filter: false }}
						enableCellTextSelection={true}
						ensureDomOrder={true}
					/>
				</div>
			</div>
		</div>
	)
}
