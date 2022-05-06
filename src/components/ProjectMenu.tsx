import React, { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getParams } from "../core/Util"
import "./ProjectMenu.scss"

interface ProjectMenuProps {
	projectID?: string;
}

export default function ProjectMenu({ projectID }: ProjectMenuProps) {

	const steps = [undefined, "analyze", "present"]
	const colors = ["#5697E3", "#43CFBD", "#E6446F"] // blue, green, red
	const { step: currentStep } = getParams()
	const stepIndex = steps.indexOf(currentStep)

	const getStepName = (step: string | undefined) => !step  ? "Wrangle" : (step.substring(0, 1).toUpperCase() + step.substring(1))

	return (
		<div id="project-menu-wrapper">
			<div id="project-menu">
				<div id="project-step-indicator" style={{ left: stepIndex * 7 + "em", backgroundColor: colors[stepIndex] }}></div>
				{steps.map((step, index) => (
					<div key={index} className={`project-menu-item ${stepIndex === index ? "project-menu-item-selected" : ""}`}>
						<Link to={(step ? `?step=${step}` : "")}>
							<p>{getStepName(step)}</p>
						</Link>
					</div>
				))}
			</div>
		</div>
	)
}
