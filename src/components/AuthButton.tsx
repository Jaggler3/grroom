import React from "react"
import { useNavigate } from "react-router-dom"
import { FirebaseApp } from "../services/firebase"
import Cookies from "../content/Cookies"

import './AuthButton.scss'

interface AuthButtonProps {
	signedIn: boolean
}

export const AuthButton = ({ signedIn  }: AuthButtonProps) => {

	const navigate = useNavigate()

	const signIn = () => navigate("/signin")

	const signOut = async () => {
		await FirebaseApp.signOut()
		Cookies.setSessionID(null)
		window.location.assign("/")
	}

	return (
		<button id="account" onClick={signedIn ? signOut : signIn}>
			<i className={signedIn ? "fas fa-door-open" : "fas fa-user-plus"}></i>
		</button>
	)
}