import React from 'react'

import './Header.scss'

interface HeaderProps { onImport: () => void }

export default function Header({ onImport }: HeaderProps) {
	return (
		<header>
			<p>Grroom</p>
			<button onClick={onImport}>
				<p>Import</p>
			</button>
			<p className="space"></p>
			<button id="account">
				<i className="fas fa-user-plus"></i>
			</button>
		</header>
	)
}
