import React, { useState, ChangeEvent } from 'react'
import * as EmailValidator from 'email-validator';

import './SignUp.scss'
import DisplayError from '../components/DisplayError'
import { FirebaseApp } from '../services/firebase';
import Net from '../net/Net';
import Cookies from '../content/Cookies';
import { useHistory } from 'react-router-dom';

export default function SignIn() {

	const history = useHistory()

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const [emailErr, setEmailErr] = useState("")
	const [passwordErr, setPasswordErr] = useState("")

	const updateEmail = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value.trim())
		setEmailErr((emailErr.length > 0 && EmailValidator.validate(email)) ? "" : emailErr)
	}
	const updatePassword = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value)
		setPasswordErr((passwordErr.length > 0 && password.length >= 6) ? "" : emailErr)
	}

	const blurEmail = () =>
		setEmailErr(!EmailValidator.validate(email) ? "Not a valid email." : "")

	const blurPassword = () => {
		setPasswordErr(password.length < 6 ? "Password must be at least 6 characters." : "")
	}

	const hasErrors = () =>
		emailErr !== ""
		|| passwordErr !== ""

	const hasValidInputs = () =>
		EmailValidator.validate(email)
		&& password.length >= 6


	const submitInformation = async () => {
		const response = await (FirebaseApp.signIn(email, password).catch((error) => {
			console.log(error)
			if (FirebaseApp.emailErrorCodes.includes(error.code)) {
				setEmailErr(error.message)
			} else if (FirebaseApp.passwordErrorCodes.includes(error.code)) {
				setPasswordErr(error.message)
			}
		}))

		if (!response) {
			return
		}

		const user = response.user
		if (!user) {
			alert("An internal error occurred. [59812347]")
			return
		}


		// backend
		const sessionID = await Net.submitSignIn()

		// next steps
		if (sessionID) {
			Cookies.setSessionID(sessionID)
			history.push("/")
		} else {
			alert("An internal error occurred. [609820]")
			return
		}
	}

	return (
		<div id="signup">
			<div id="left">
				<div>
					<p id="service-name">Grroom</p>
					<p className="title">Sign In</p>
					<br />
				</div>
			</div>
			<div id="right">
				<div>
					<p className="label">Email</p>
					<input
						type="text"
						className="form-input"
						spellCheck={false}
						onChange={updateEmail}
						onBlur={blurEmail}
						value={email}
					/>
					<DisplayError errorText={emailErr} />
					<p className="label">Password</p>
					<input
						type="password"
						className="form-input"
						onChange={updatePassword}
						onBlur={blurPassword}
						value={password}
					/>
					<DisplayError errorText={passwordErr} />
					<p id="signin-suggest">Need to make an account? <a href="/signup">Sign Up</a></p>

					<div id="submit-container">
						<button disabled={!hasValidInputs() || hasErrors()} onClick={submitInformation}>
							<p>Continue</p>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
