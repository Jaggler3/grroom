import React from "react"
import "./QualityBadge.scss"

interface QualityBadgeProps {
	label: string;
	value: number;
	color?: string;
}

export default function QualityBadge({ label, value, color }: QualityBadgeProps) {
	const pct = Math.round(value * 100)
	const badgeColor = color || (pct >= 90 ? "#43CFBD" : pct >= 70 ? "#E6A344" : "#E6446F")

	return (
		<div className="quality-badge" style={{ borderColor: badgeColor }}>
			<div className="qb-value" style={{ color: badgeColor }}>{pct}%</div>
			<div className="qb-label">{label}</div>
		</div>
	)
}
