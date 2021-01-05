import React from 'react';
import '@fortawesome/fontawesome-free/css/all.css'

import './App.scss';
import Clean from './pages/Clean';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Account from './pages/Account';

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={Clean} /> {/*
				Not logged in: show tool
				Logged in: show project list & new button, custom modifier list, logout button
				*/}
				<Route exact path="/signup" component={SignUp} /> {/* Email, password, plan, card info if paid plan */}
				<Route exact path="/account" component={Account} /> {/* Billing, Plan */}
			</Switch>
		</BrowserRouter>
	);
}

export default App;
