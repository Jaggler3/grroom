import React from 'react';

import '@fortawesome/fontawesome-free/css/all.css'

import './App.scss';

import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Clean from './pages/Clean';
/*
<div>
	<p>grroom. apply mods based on suggestions once you upload your data. make your own mods with JS and save them to localStorage. pay to save to an account? ads?</p>
	<p>grroom.surge.sh will have landing page, grroom.surge.sh/clean will have editor, link this in resume</p>
</div>
*/

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact component={Landing} />
				<Route path="/clean" component={Clean} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
