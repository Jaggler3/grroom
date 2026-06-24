import React from "react"
import "./CleanMenu.scss"

interface CleanMenuProps {
	createExport: () => void;
}

export default function CleanMenu({ createExport }: CleanMenuProps) {
	return (
		<div id="clean-menu">
			<div id="cm-search-wrapper">
				<i className="fas fa-search" />
				<input type="text" id="cm-search" placeholder="Search..." />
			</div>
			<div id="cm-actions">
				<button id="cm-export" onClick={createExport}>
					<i className="fas fa-download"></i> Export
				</button>
			</div>
		</div>
	)
}
