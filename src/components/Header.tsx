import React from 'react'

import './Header.scss'
import { useHistory } from 'react-router-dom'

interface HeaderProps {
	onImport?: () => void,
	hideImport?: boolean,
	signedIn: boolean,
	onBack?: () => any
}

export default function Header({ signedIn, onImport, hideImport, onBack }: HeaderProps) {

	const history = useHistory()

	const isDashboard = window.location.pathname === "/"

	return (
		<header>
			{signedIn && !isDashboard && (
				<p id="back" onClick={onBack}>
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
