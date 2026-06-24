import React, { useMemo } from "react"
import "./ColumnProfiler.scss"
import DistributionChart, { DistributionItem } from "./DistributionChart"

interface ColumnProfilerProps {
	column: string;
	items: { [key: string]: any }[];
}

type DetectedType = "number" | "boolean" | "date" | "string"

interface ColumnStats {
	type: DetectedType;
	total: number;
	empty: number;
	unique: number;
	min: string | number | null;
	max: string | number | null;
	mean: number | null;
	median: number | null;
	topValues: DistributionItem[];
}

function detectType(values: (string | null | undefined)[]): DetectedType {
	const nonEmpty = values.filter(v => v !== null && v !== undefined && v !== "")
	if (nonEmpty.length === 0) return "string"

	const sample = nonEmpty.slice(0, 50)

	const isNumber = sample.every(v => /^-?\d+(\.\d+)?$/.test(String(v).trim()))
	if (isNumber) return "number"

	const isBoolean = sample.every(v => /^(true|false|yes|no|0|1)$/i.test(String(v).trim()))
	if (isBoolean) return "boolean"

	const isDate = sample.every(v => {
		const d = new Date(String(v).trim())
		return !isNaN(d.getTime())
	})
	if (isDate) return "date"

	return "string"
}

function computeStats(column: string, items: { [key: string]: any }[]): ColumnStats {
	const values = items.map(item => item[column] !== undefined ? String(item[column]) : null)
	const nonEmpty = values.filter(v => v !== null && v !== "") as string[]
	const total = values.length
	const empty = total - nonEmpty.length
	const unique = new Set(nonEmpty.map(v => v.trim())).size
	const type = detectType(nonEmpty)

	let min: string | number | null = null
	let max: string | number | null = null
	let mean: number | null = null
	let median: number | null = null

	if (type === "number") {
		const nums = nonEmpty.map(v => parseFloat(v.trim())).filter(n => !isNaN(n))
		if (nums.length > 0) {
			min = Math.min(...nums)
			max = Math.max(...nums)
			mean = nums.reduce((a, b) => a + b, 0) / nums.length
			const sorted = [...nums].sort((a, b) => a - b)
			const mid = Math.floor(sorted.length / 2)
			median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
		}
	}

	if (type === "date") {
		const dates = nonEmpty.map(v => new Date(v.trim())).filter(d => !isNaN(d.getTime()))
		if (dates.length > 0) {
			const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime())
			min = sorted[0].toLocaleDateString()
			max = sorted[sorted.length - 1].toLocaleDateString()
		}
	}

	const freq: Record<string, number> = {}
	for (const v of nonEmpty) {
		const key = v.trim()
		freq[key] = (freq[key] || 0) + 1
	}

	const topValues: DistributionItem[] = Object.entries(freq)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 10)
		.map(([label, count]) => ({ label, count }))

	return { type, total, empty, unique, min, max, mean, median, topValues }
}

export default function ColumnProfiler({ column, items }: ColumnProfilerProps) {
	const stats = useMemo(() => computeStats(column, items), [column, items])

	const typeColors: Record<DetectedType, string> = {
		number: "#5697E3",
		boolean: "#E6A344",
		date: "#43CFBD",
		string: "#E6446F",
	}

	const formatNum = (n: number | null, decimals = 2) =>
		n !== null ? n.toLocaleString(undefined, { maximumFractionDigits: decimals }) : "—"

	return (
		<div className="column-profiler">
			<div className="cp-header" style={{ borderLeftColor: typeColors[stats.type] }}>
				<h3>{column}</h3>
				<span className="cp-type" style={{ backgroundColor: typeColors[stats.type] }}>
					{stats.type}
				</span>
			</div>

			<div className="cp-stats">
				<div className="cp-stat">
					<span className="cp-stat-value">{stats.total}</span>
					<span className="cp-stat-label">Total</span>
				</div>
				<div className="cp-stat">
					<span className="cp-stat-value">{stats.unique}</span>
					<span className="cp-stat-label">Unique</span>
				</div>
				<div className="cp-stat">
					<span className="cp-stat-value">{stats.empty}</span>
					<span className="cp-stat-label">Empty</span>
				</div>
				{stats.mean !== null && (
					<div className="cp-stat">
						<span className="cp-stat-value">{formatNum(stats.mean)}</span>
						<span className="cp-stat-label">Mean</span>
					</div>
				)}
				{stats.median !== null && (
					<div className="cp-stat">
						<span className="cp-stat-value">{formatNum(stats.median)}</span>
						<span className="cp-stat-label">Median</span>
					</div>
				)}
				{stats.min !== null && stats.max !== null && (
					<>
						<div className="cp-stat">
							<span className="cp-stat-value">{String(stats.min)}</span>
							<span className="cp-stat-label">Min</span>
						</div>
						<div className="cp-stat">
							<span className="cp-stat-value">{String(stats.max)}</span>
							<span className="cp-stat-label">Max</span>
						</div>
					</>
				)}
			</div>

			{stats.topValues.length > 0 && (
				<div className="cp-distribution">
					<h4>Top Values</h4>
					<DistributionChart
						items={stats.topValues}
						total={stats.total - stats.empty}
						color={typeColors[stats.type]}
					/>
				</div>
			)}
		</div>
	)
}
