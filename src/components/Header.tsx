import React from 'react'
import './Header.scss'
import ProjectMenu from './ProjectMenu';

interface HeaderProps {
	projectName?: string;
	onImport?: () => void;
	hideImport?: boolean;
	onBack?: () => any;
	projectID?: string;
}

export default function Header({ projectID, projectName, onImport, hideImport, onBack }: HeaderProps) {

	const isDashboard = window.location.pathname === "/"

	const onEditName = () => {

	}

	const onHelp = () => {
		
	}

	return (
		<>
			<header>
				{projectID && !isDashboard && (
					<>
						<div id="header-left">
							<p id="back" onClick={onBack}>
								<i className="fas fa-arrow-left"></i>
							</p>
							<div id="breadcrumbs">
								<p id="breadcrumbs-top">MY PROJECTS</p>
								<p id="breadcrumbs-bottom">
									{projectName}
									<i className="fas fa-pencil-alt" onClick={onEditName} />
								</p>
							</div>
						</div>
						<div id="header-middle">
							<p id="service-name">Grroom</p>
						</div>
						<div id="header-right">
							<p id="help" onClick={onHelp}>
								<i className="fas fa-question-circle"></i>
							</p>
						</div>
					</>
				)}
				{!projectID && (
					<button onClick={onImport}>
						<p>Import</p>
					</button>
				)}
			</header>
			<ProjectMenu projectID={projectID} />
		</>
	)
}
