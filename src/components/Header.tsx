import React, { useEffect, useRef, useState } from 'react'
import './Header.scss'
import ProjectMenu from './ProjectMenu';

interface HeaderProps {
	projectName?: string;
	onImport?: () => void;
	onBack?: () => any;
	projectID?: string;
	signedIn?: boolean;
	onChangeProjectName: (newName: string) => void;
}

export default function Header({ projectID, projectName, onChangeProjectName, onImport, onBack, signedIn }: HeaderProps) {

	const isDashboard = window.location.pathname === "/"

	const [editingName, setEditingName] = useState(false)
	const [newName, setNewName] = useState("")
	const editNameRef = useRef<HTMLInputElement | null>(null)

	const onEditName = () => {
		setEditingName(true)
		setTimeout(() => {
			editNameRef.current!.focus()
			editNameRef.current!.setSelectionRange(0, projectName!.length)
		}, 100)
	}

	const onCompleteEditName = () => {
		let normalized = newName
		if(newName.trim().length === 0) {
			normalized = projectName!
		}
		onChangeProjectName(newName!)
		setEditingName(false)
	}
	const onHelp = () => {
		
	}

	const onOpenSignUp = () => {
		window.open("/signup", "_blank")
	}

	useEffect(() => {
		if(projectName)
			setNewName(projectName)
	}, [projectName])

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
									{editingName ? (
										<input
											ref={editNameRef}
											value={newName}
											onChange={(e) => setNewName(e.target.value)}
											onSubmit={onCompleteEditName}
											onKeyDown={(e) => e.key === "Enter" ? onCompleteEditName() : null}
											onBlur={onCompleteEditName} />
									) : (
										<>
											<span>{projectName}</span>
											<i className="fas fa-pencil-alt" onClick={onEditName} />
										</>
									)}
									
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
					<>
						<button onClick={onImport}>
							<p>Import</p>
						</button>
						<div id="header-middle-float">
							<p id="service-name">Grroom</p>
						</div>
						<div id="header-right">
							{!signedIn && <p id="sign-up" onClick={onOpenSignUp}>
								<i className="fas fa-user"></i>
							</p>}
							<p id="help" onClick={onHelp}>
								<i className="fas fa-question-circle"></i>
							</p>
						</div>
					</>
				)}
			</header>
			<ProjectMenu projectID={projectID} />
		</>
	)
}
