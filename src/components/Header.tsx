import React, { useEffect, useRef, useState } from 'react'
import './Header.scss'
import ProjectMenu from './ProjectMenu';

interface HeaderProps {
	projectName?: string;
	step?: string;
	onChangeStep: (step?: string) => void;
	onChangeProjectName: (newName: string) => void;
}

export default function Header({ projectName, step, onChangeStep, onChangeProjectName }: HeaderProps) {

	const [editingName, setEditingName] = useState(false)
	const [newName, setNewName] = useState("")
	const editNameRef = useRef<HTMLInputElement | null>(null)

	const onEditName = () => {
		setEditingName(true)
		setNewName(projectName || "")
		setTimeout(() => editNameRef.current?.focus(), 100)
	}

	const onCompleteEditName = () => {
		const normalized = newName.trim().length === 0 ? projectName! : newName
		onChangeProjectName(normalized)
		setEditingName(false)
	}

	return (
		<div id="header">
			<div id="header-left">
				{editingName ? (
					<input
						ref={editNameRef}
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" ? onCompleteEditName() : null}
						onBlur={onCompleteEditName}
						id="header-name-input"
					/>
				) : (
					<p id="header-name" onClick={onEditName}>
						{projectName || "Untitled"}
						<i className="fas fa-pencil-alt" />
					</p>
				)}
			</div>
			<ProjectMenu step={step} onChangeStep={onChangeStep} />
			<div id="header-right">
			</div>
		</div>
	)
}
