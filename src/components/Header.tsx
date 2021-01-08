import React from 'react'

import './Header.scss'
import { FirebaseApp } from '../services/firebase'
import Cookies from '../content/Cookies'
import { useHistory } from 'react-router-dom'

interface HeaderProps {
	onImport?: () => void,
	hideImport?: boolean,
	signedIn: boolean
}

export default function Header({ signedIn, onImport, hideImport }: HeaderProps) {

	const history = useHistory()

	const isDashboard = window.location.pathname === "/"

	const signOut = async () => {
		await FirebaseApp.signOut()
		Cookies.setSessionID(null)
		history.push("/")
	}

	const signIn = () => {
		history.push("/signin")
	}

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
			<p className="space"></p>
			<button id="account" onClick={signedIn ? signOut : signIn}>
				<i className={signedIn ? "fas fa-door-open" : "fas fa-user-plus"}></i>
			</button>
		</header>
	)
}
