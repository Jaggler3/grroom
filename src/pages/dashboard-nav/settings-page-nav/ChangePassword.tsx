import React, { useState, ChangeEvent } from 'react'
import * as EmailValidator from 'email-validator';

import BackHeader from '../BackHeader'
import DisplayError from '../../../components/DisplayError';

export default function ChangePassword() {

	const [old, setOld] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	
	const [passwordErr, setPasswordErr] = useState("")
	const [confirmErr, setConfirmErr] = useState("")

	const updateOld = (e: ChangeEvent<HTMLInputElement>) => setOld(e.target.value)

	const updatePassword = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value)
		setPasswordErr((passwordErr.length > 0 && password.length >= 6) ? "" : passwordErr)
	}
	const updateConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
		setConfirmPassword(e.target.value)
		setConfirmErr((confirmErr.length > 0 && password === confirmPassword) ? "" : confirmErr)
	}

	const blurPassword = () => {
		setPasswordErr(password.length < 6 ? "Password must be at least 6 characters." : "")
		setConfirmErr((password !== confirmPassword && confirmPassword.length > 0) ? "Passwords do not match." : "")
	}
	const blurConfirmPassword = () =>
		setConfirmErr(password !== confirmPassword ? "Passwords do not match." : "")

	const hasErrors = () => passwordErr !== "" || confirmErr !== ""

	const hasValidInputs = () => old.length >= 6 && password.length >= 6 && confirmPassword === password
	
	const submit = () => {

	}

	return (
		<div>
			<BackHeader />
			<h1>Change Password</h1>
			<p className="label">Current Password</p>
			<input
				type="password"
				className="form-input"
				onChange={updateOld}
				value={old}
			/>
			<p className="label">New Password</p>
			<input
				type="password"
				className="form-input"
				onChange={updatePassword}
				onBlur={blurPassword}
				value={password}
			/>
			<DisplayError errorText={passwordErr} />
			<p className="label">Confirm New Password</p>
			<input
				type="password"
				className="form-input"
				onChange={updateConfirmPassword}
				onBlur={blurConfirmPassword}
				value={confirmPassword}
			/>
			<div id="submit-container">
				<button disabled={hasErrors()} onClick={submit}><p>Confirm</p></button>
				<DisplayError errorText={hasErrors() ? "You have an error above." : ""} />
			</div>
		</div>
	)
}
