import React from "react"
import "./SummaryCard.scss"

interface SummaryCardProps {
	icon: string;
	label: string;
	value: string | number;
	color: string;
}

export default function SummaryCard({ icon, label, value, color }: SummaryCardProps) {
	return (
		<div className="summary-card" style={{ borderTopColor: color }}>
			<div className="sc-icon" style={{ color }}>
				<i className={`fas ${icon}`} />
			</div>
			<div className="sc-value">{value}</div>
			<div className="sc-label">{label}</div>
		</div>
	)
}
