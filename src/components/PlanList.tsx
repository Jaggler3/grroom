import React from "react"

import { PlanData } from '../content/Plans';

import './PlanList.scss'

interface PlanListProps {
	selectedPlan: string,
	setSelectedPlan: (value: string) => void
}
const PlanList = ({ selectedPlan, setSelectedPlan }: PlanListProps) => (
	<>
		{PlanData.map(({ name, price, desc, excluded, mostPopular }, i) => (
			<div
				onClick={() => setSelectedPlan(name)}
				key={i}
				className={"plan" + (selectedPlan === name ? " selected" : "")}
			>
				{mostPopular && <p className="most-popular">MOST POPULAR</p>}
				<p className="plan-title">{name}</p>
				<p className="plan-price">{price}</p>
				{desc.map((item, j) => (
					<p key={j}>{item}</p>
				))}
				{excluded.map((item, j) => (
					<p className="excluded" key={j}>{item}</p>
				))}
			</div>
		))}
	</>
)

export default PlanList
