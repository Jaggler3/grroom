import React from "react"
import "./DistributionChart.scss"

export interface DistributionItem {
	label: string;
	count: number;
}

interface DistributionChartProps {
	items: DistributionItem[];
	total: number;
	color?: string;
	showPercentages?: boolean;
}

export default function DistributionChart({ items, total, color = "#43CFBD", showPercentages = true }: DistributionChartProps) {
	const maxCount = Math.max(...items.map(i => i.count), 1)

	return (
		<div className="distribution-chart">
			{items.map((item, i) => {
				const pct = total > 0 ? Math.round((item.count / total) * 100) : 0
				return (
					<div key={i} className="dc-row">
						<div className="dc-label" title={item.label}>{item.label}</div>
						<div className="dc-bar-wrapper">
							<div
								className="dc-bar"
								style={{
									width: `${(item.count / maxCount) * 100}%`,
									backgroundColor: color,
								}}
							/>
						</div>
						<div className="dc-count">{item.count}</div>
						{showPercentages && <div className="dc-pct">{pct}%</div>}
					</div>
				)
			})}
		</div>
	)
}
