import React, { useMemo, useState } from "react"
import { AgGridReact } from "ag-grid-react"
import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import "./Present.scss"
import { DataSet } from "../core/DataSet"
import SummaryCard from "../components/SummaryCard"
import DistributionChart, { DistributionItem } from "../components/DistributionChart"

ModuleRegistry.registerModules([AllCommunityModule])

interface PresentProps {
	dataSet: DataSet;
}

interface ColumnDistribution {
	column: string;
	items: DistributionItem[];
	total: number;
	type: string;
}

function detectType(values: (string | null | undefined)[]): string {
	const nonEmpty = values.filter(v => v !== null && v !== undefined && v !== "")
	if (nonEmpty.length === 0) return "string"

	const sample = nonEmpty.slice(0, 50)

	if (sample.every(v => /^-?\d+(\.\d+)?$/.test(String(v).trim()))) return "number"
	if (sample.every(v => /^(true|false|yes|no|0|1)$/i.test(String(v).trim()))) return "boolean"
	if (sample.every(v => !isNaN(new Date(String(v).trim()).getTime()))) return "date"

	return "string"
}

function computeDistribution(column: string, items: { [key: string]: any }[]): ColumnDistribution {
	const values = items.map(item => item[column] !== undefined ? String(item[column]) : null)
	const nonEmpty = values.filter(v => v !== null && v !== "") as string[]
	const type = detectType(nonEmpty)

	const freq: Record<string, number> = {}
	for (const v of nonEmpty) {
		const key = v.trim()
		freq[key] = (freq[key] || 0) + 1
	}

	const topValues: DistributionItem[] = Object.entries(freq)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 8)
		.map(([label, count]) => ({ label, count }))

	return { column, items: topValues, total: nonEmpty.length, type }
}

const typeColors: Record<string, string> = {
	number: "#5697E3",
	boolean: "#E6A344",
	date: "#43CFBD",
	string: "#E6446F",
}

export default function Present({ dataSet }: PresentProps) {
	const [fullScreen, setFullScreen] = useState(false)

	const totalRows = dataSet.items.length
	const totalColumns = dataSet.columns.length

	const totalCells = totalRows * totalColumns
	const emptyCells = useMemo(() => {
		let count = 0
		for (const item of dataSet.items)
			for (const col of dataSet.columns)
				if (item[col] === null || item[col] === undefined || String(item[col]).trim() === "")
					count++
		return count
	}, [dataSet])
	const emptyPct = totalCells > 0 ? Math.round((emptyCells / totalCells) * 100) : 0

	const distributions = useMemo(
		() => dataSet.columns.map(col => computeDistribution(col, dataSet.items)),
		[dataSet]
	)

	const columnDefs = useMemo((): ColDef[] => [
		{ colId: "_rowNumber", headerName: "", width: 50, pinned: "left", sortable: false, suppressMovable: true,
			valueGetter: (params: any) => params.node.rowIndex + 1 },
		...dataSet.columns.map(col => ({
			field: col,
			headerName: col,
			width: 150,
			resizable: true,
		})),
	], [dataSet.columns])

	const generateReport = () => {
		const rows = dataSet.items.length
		const cols = dataSet.columns.length
		let html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${dataSet.name || "Data Report"}</title>
<style>
body { font-family: Manrope, sans-serif; max-width: 60em; margin: 2em auto; padding: 0 1em; color: #333; }
h1 { font-size: 1.8em; margin-bottom: 0.25em; }
h2 { font-size: 1.2em; margin-top: 1.5em; color: #555; border-bottom: 2px solid #E6446F; padding-bottom: 0.3em; }
.summary { display: flex; gap: 1em; margin: 1em 0; }
.card { background: #f8f8f8; border-radius: 0.5em; padding: 0.75em 1em; text-align: center; flex: 1; border-top: 3px solid #43CFBD; }
.card .v { font-size: 1.5em; font-weight: 700; }
.card .l { font-size: 0.75em; color: #888; text-transform: uppercase; }
table { width: 100%; border-collapse: collapse; margin: 1em 0; font-size: 0.85em; }
th { background: #f0f0f0; text-align: left; padding: 0.5em; font-weight: 600; }
td { padding: 0.4em 0.5em; border-bottom: 1px solid #eee; }
tr:nth-child(even) td { background: #fafafa; }
</style></head><body>
<h1>${dataSet.name || "Untitled Data Report"}</h1>
<p>Generated on ${new Date().toLocaleString()}</p>
<div class="summary">
<div class="card"><div class="v">${rows}</div><div class="l">Rows</div></div>
<div class="card"><div class="v">${cols}</div><div class="l">Columns</div></div>
<div class="card"><div class="v">${emptyPct}%</div><div class="l">Empty Cells</div></div>
</div>
<h2>Data Preview</h2>
<table><thead><tr><th>#</th>${dataSet.columns.map(c => `<th>${c}</th>`).join("")}</tr></thead>
<tbody>${dataSet.items.slice(0, 100).map((item, i) =>
`<tr><td>${i + 1}</td>${dataSet.columns.map(c => `<td>${item[c] ?? ""}</td>`).join("")}</tr>`
).join("")}</tbody></table>
${dataSet.items.length > 100 ? `<p><em>Showing first 100 of ${dataSet.items.length} rows.</em></p>` : ""}
</body></html>`

		const blob = new Blob([html], { type: "text/html" })
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = `${dataSet.name || "data"}-report.html`
		a.click()
		URL.revokeObjectURL(url)
	}

	if (fullScreen) {
		return (
			<div id="present-fullscreen">
				<div id="pfs-header">
					<h2>{dataSet.name || "Data"}</h2>
					<button onClick={() => setFullScreen(false)}>
						<p><i className="fas fa-compress"></i> Exit Full Screen</p>
					</button>
				</div>
				<div className="ag-theme-alpine ag-theme-grroom" style={{ flex: 1 }}>
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
		)
	}

	return (
		<div id="present">
			<div className="present-actions">
				<h3>Dashboard</h3>
				<div className="pa-buttons">
					<button onClick={() => setFullScreen(true)}>
						<p><i className="fas fa-expand"></i> Full Screen</p>
					</button>
					<button onClick={generateReport}>
						<p><i className="fas fa-file-export"></i> Export Report</p>
					</button>
				</div>
			</div>

			<div className="present-summary">
				<SummaryCard icon="fa-table" label="Total Rows" value={totalRows} color="#E6446F" />
				<SummaryCard icon="fa-columns" label="Columns" value={totalColumns} color="#E6446F" />
				<SummaryCard icon="fa-circle-exclamation" label="Empty Cells" value={`${emptyPct}%`} color={emptyPct > 10 ? "#E6A344" : "#E6446F"} />
				<SummaryCard icon="fa-database" label="Total Cells" value={totalCells} color="#E6446F" />
			</div>

			<div className="present-distributions">
				<h3>Column Distributions</h3>
				<div className="pd-grid">
					{distributions.map(d => (
						<div key={d.column} className="pd-card" style={{ borderTopColor: typeColors[d.type] || "#ccc" }}>
							<div className="pd-header">
								<span className="pd-name">{d.column}</span>
								<span className="pd-type" style={{ backgroundColor: typeColors[d.type] || "#ccc" }}>
									{d.type}
								</span>
							</div>
							{d.items.length > 0 ? (
								<DistributionChart
									items={d.items}
									total={d.total}
									color={typeColors[d.type] || "#43CFBD"}
								/>
							) : (
								<p className="pd-empty">No data</p>
							)}
						</div>
					))}
				</div>
			</div>

			<div className="present-table">
				<h3>Data Preview</h3>
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
