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
				<Route exact path="/" component={Clean} />
				<Route exact path="/signup" component={SignUp} />
				<Route exact path="/account" component={Account} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
