import React from 'react'

import './Header.scss'
import { useHistory } from 'react-router-dom'

interface HeaderProps {
	onImport?: () => void,
	hideImport?: boolean,
	signedIn: boolean
}

export default function Header({ signedIn, onImport, hideImport }: HeaderProps) {

	const history = useHistory()

	const isDashboard = window.location.pathname === "/"

	const backToDashboard = () => {
		history.push("/")
	}

	return (
		<header>
			{signedIn && !isDashboard && (
				<p id="back" onClick={backToDashboard}>
					<i className="fas fa-arrow-left"></i>
					<span>Dashboard</span>
				</p>
			)}
			{!hideImport && !signedIn && (
				<button onClick={ onImport}>
					<p>Import</p>
				</button>
			)}
			<p id="service-name">Grroom</p>
		</header>
	)
}
