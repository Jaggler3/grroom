import React from 'react'

import './Welcome.scss'

interface WelcomeProps {
	selectUpload: () => void,
	selectExample: () => void
}

export default function Welcome({ selectUpload, selectExample }: WelcomeProps) {
	return (
		<div id="welcome">
			<h1>Welcome to Grroom!</h1>
			<p>To get started, select a data set to work with.</p>
			<div id="welcome-actions">
				<button onClick={selectUpload}>
					<p>Upload</p>
				</button>
				<span>or</span>
				<button onClick={selectExample}>
					<p>Use Example Data</p>
				</button>
			</div>
		</div>
	)
}
