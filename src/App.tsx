import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.css'

import './services/firebase'

import './App.scss';
import Clean from './pages/Clean';
import { BrowserRouter, Routes, Route, useParams, Navigate, useMatch } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Account from './pages/Account';
import { FirebaseApp } from './services/firebase';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import Net from './net/Net';
import { Oval } from 'react-loader-spinner';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

function CleanProject() {
	const { projectID } = useParams<{ projectID?: string }>()
	if (!projectID || projectID.length === 0) return <Navigate to={"/"} />
	return <Clean projectID={projectID} />
}

function Root({ hasSession, setHasSession }: { hasSession: boolean, setHasSession: (v: boolean) => void }) {
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
				<Oval
					color="#5697E3"
					height={100}
					width={100}
				/>
			</div>
		</div>
	)

	if (FirebaseApp.isSignedIn()) {
		return <Dashboard />
	} else {
		return <Clean />
	}
}

const stripePromise = loadStripe('pk_test_51I3zN8APSwzhwjAkbKJzwHHyyUwQjrmypndifIKtImuPKU1QOo7fmesUww7tcZPIM9lO7VoJDNG1HZgoH9TtZ6DO00VoA7CeAo');

function App() {

	const [hasSession, setHasSession] = useState(false)

	return (
		<BrowserRouter>
			<Elements stripe={stripePromise}>
				<Routes>
					{/* <Route path="/project/:projectID" element={<CleanProject />} />
					<Route path="/project" element={<Navigate replace to={"/"} />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/signin" element={<SignIn />} />
					<Route path="/account" element={<Account />} />
					<Route path="/terms" element={<Terms />} />
					<Route path="/privacy" element={<Privacy />} /> */}
					<Route path="/" element={<Root hasSession={hasSession} setHasSession={(v) => setHasSession(v)} />} />
				</Routes>
			</Elements>
		</BrowserRouter>
	);
}

export default App;
