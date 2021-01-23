import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.css'

import './services/firebase'

import './App.scss';
import Clean from './pages/Clean';
import { BrowserRouter, Switch, Route, useParams, Redirect } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Account from './pages/Account';
import { FirebaseApp } from './services/firebase';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import Net from './net/Net';
import Loader from 'react-loader-spinner';

function CleanProject() {
	const { projectID } = useParams<{ projectID?: string }>()

	if (!projectID || projectID.length === 0) return <Redirect to={"/"} />

	return <Clean projectID={projectID} />
}

function Root({ match, hasSession, setHasSession }: { match: any, hasSession: boolean, setHasSession: (v: boolean) => void }) {
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		(async () => {
			await FirebaseApp.getServiceStatus()
			if (FirebaseApp.isSignedIn() && !hasSession) {
				if (await Net.verifySession()) {
					setHasSession(true)
				} else {
					const result = await Net.submitSignIn()
					if (result) {
						setHasSession(true)
					}
				}
			}
			setLoaded(true)
		})()
	}, [])

	if (!loaded) return (
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
	)

	if (FirebaseApp.isSignedIn()) {
		return <Dashboard match={match} />
	} else {
		return <Clean />
	}
}

function App() {

	const [hasSession, setHasSession] = useState(false)

	return (
		<BrowserRouter>
			<Switch>
				<Route path="/project/:projectID" component={CleanProject} />
				<Route path="/project" render={() => <Redirect to={"/"} />} />
				<Route exact path="/signup" component={SignUp} />
				<Route exact path="/signin" component={SignIn} />
				<Route exact path="/account" component={Account} /> {/* Billing, Plan */}
				<Route path="/" component={({ match }: { match: any }) => <Root match={match} hasSession={hasSession} setHasSession={(v) => setHasSession(v)} />} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
