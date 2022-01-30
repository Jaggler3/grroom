import React from "react"
import "./CleanMenu.scss"

interface CleanMenuProps {
	canSave: boolean;
	createSave: () => void;
	createExport: () => void;
}

export default function CleanMenu({ canSave, createSave, createExport }: CleanMenuProps) {
	return (
		<div id="clean-menu">
			<div id="cm-search-wrapper">
				<i className="fas fa-search" />
				<input type="text" id="cm-search" placeholder="Search..." />
			</div>
			<button>
				<i className="fas fa-undo-alt"></i>
			</button>
			<button disabled>
				<i className="fas fa-redo-alt"></i>
			</button>
			<button>
				<i className="fas fa-font"></i>
				<i className="fas fa-font small"></i>
			</button>
			<button>
				<i className="fas fa-font small"></i>
				<i className="fas fa-font"></i>
			</button>
			<button disabled>
				<i className="fas fa-trash"></i>
			</button>
		</div>
	)
}
