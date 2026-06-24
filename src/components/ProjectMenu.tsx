import React, { useCallback, useEffect, useRef, useState } from "react"
import "./ProjectMenu.scss"

interface ProjectMenuProps {
	step?: string;
	onChangeStep: (step?: string) => void;
}

export default function ProjectMenu({ step, onChangeStep }: ProjectMenuProps) {

	const steps = [undefined, "analyze", "present"]
	const colors = ["#5697E3", "#43CFBD", "#E6446F"]
	const stepIndex = steps.indexOf(step)
	const itemsRef = useRef<(HTMLDivElement | null)[]>([])
	const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

	const updateIndicator = useCallback(() => {
		const el = itemsRef.current[stepIndex]
		if (el) {
			setIndicatorStyle({
				left: el.offsetLeft,
				width: el.offsetWidth,
			})
		}
	}, [stepIndex])

	useEffect(() => {
		updateIndicator()
	}, [updateIndicator])

	const getStepName = (s: string | undefined) => !s ? "Wrangle" : (s.substring(0, 1).toUpperCase() + s.substring(1))

	return (
		<div id="project-menu">
			<div
				id="project-step-indicator"
				style={{
					left: indicatorStyle.left,
					width: indicatorStyle.width,
					backgroundColor: colors[stepIndex],
				}}
			/>
			{steps.map((s, i) => (
				<div
					key={i}
					ref={(el) => { itemsRef.current[i] = el }}
					className={`project-menu-item ${stepIndex === i ? "selected" : ""}`}
					onClick={() => onChangeStep(s)}
				>
					{getStepName(s)}
				</div>
			))}
		</div>
	)
}
