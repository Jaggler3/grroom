import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function BackHeader() {
	const navigate = useNavigate()
	return (
		<div style={{
			display: "flex",
			alignItems: "center",
			padding: ".5em 1em",
			marginBottom: "1em",
			width: "fit-content",
			cursor: "pointer"
		}} onClick={() => navigate(-1)}>
			<i className="fas fa-arrow-left" style={{
				marginRight: "1em",
				fontSize: "1.25em"
			}}></i>
			<span>Back</span>
		</div>
	)
}
