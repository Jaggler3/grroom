import React, { useState, useEffect } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import SwitchPlan from './settings-page-nav/SwitchPlan'
import Loader from 'react-loader-spinner'
import { PlanDataByName } from '../../content/Plans'
import UpdateCard from './settings-page-nav/UpdateCard'
import Net from '../../net/Net'
import { FirebaseApp } from '../../services/firebase'

export default function SettingsPage() {
	return (
		<div className="dashboard-page">
			<Switch>
				<Route path="/settings/plan" component={SwitchPlan} />
				<Route path="/settings/card" component={UpdateCard} />
				<Route path="/settings" component={SettingsMainPage} />
			</Switch>
		</div>
	)
}

function SettingsMainPage() {

	const [initialPlan, setInitialPlan] = useState("")

	useEffect(() => {
		(async () => {
			const userInfo = await Net.getUserInfo()
			if(userInfo) {
				setInitialPlan(userInfo.plan)
			}
		})()
	}, [])

	const sendPasswordEmail = () => {
		FirebaseApp.sendPasswordEmail()
		alert("An email was sent to your email address with instructions to change your password.")
	}

	if (initialPlan === "") return (
		<div>
			<h1>Settings</h1>
			<div id="loading-container">
				<div id="loading-spinner">
					<Loader
						type="Oval"
						color="#5697E3"
						height={100}
						width={100}
					/>
				</div>
			</div>
		</div>
	)

	return (
		<div>
			<h1>Settings</h1>
			<br />
			<br />
			<h2>Your Plan: {initialPlan}</h2>
			<br />
			<p>What's included:</p>
			{PlanDataByName[initialPlan].desc.map((text, i) => (
				<p key={i + " " + text}>&nbsp;-&nbsp;{text}</p>
			))}
			<br />
			<Link to="/settings/plan">
				<button><p>Switch Plan</p></button>
			</Link>
			<br />
			<br />
			<h2>Your Payment Information</h2>
			<br />
			{initialPlan === "Lite" ? (
				<p>Your subscription is free.</p>
			) : (
					<>
						<p>Your subscription is <span className="bold">{PlanDataByName[initialPlan].price}</span></p>
						<br />
						<Link to="/settings/card">
							<button><p>Update Card Information</p></button>
						</Link>
					</>
				)}
			<br />
			<br />
			<h2>Authentication</h2>
			<br />
			<button onClick={sendPasswordEmail}><p>Change your password</p></button>
		</div>
	)
}