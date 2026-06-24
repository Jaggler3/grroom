import React, { useState, useEffect } from 'react'
import Sval from "sval";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-kuroir";

import './ModEditor.scss'
import { Modifier } from '../core/Modifier'

interface ModEditorProps {
	initial: Modifier,
	editing: boolean,
	exit: () => void,
	saveMod: (originalName: string, mod: Modifier) => void
}

export default function ModEditor({ initial, editing, saveMod, exit }: ModEditorProps) {

	const [currentMod, setCurrentMod] = useState<Modifier>({
		...initial
	})
	const [validated, setValidated] = useState(true)
	const [validationError, setValidationError] = useState<string>("")

	const [saveNeeded, setSaveNeeded] = useState(false)
	const [showSaveModal, setShowSaveModal] = useState(false)

	const validate = async () => {
		setValidationError("")
		if (currentMod.name.trim().length === 0) {
			setValidationError("GrroomError: Name is empty")
		}
		const code: string = currentMod.effect
		try {
			let modifierFn: unknown = null

			const interpreter = new Sval({
				ecmaVer: "latest",
				sourceType: "script",
				sandBox: true,
			})

			interpreter.import("modify", (fn: unknown) => {
				modifierFn = fn
			})
			interpreter.run(code)

			if (typeof modifierFn !== "function" || modifierFn.length !== 2) {
				setValidationError("GrroomError: Not a valid function expression with params (rows, columnNames).")
			} else {
				setValidated(true)
			}
		} catch (e: any) {
			setValidationError(e.toString().split("\n").shift())
		}
	}

	const save = () => {
		saveMod(initial.name, currentMod)
		exit()
	}

	const changeEffect = (val: string) => {
		setValidated(false)
		setCurrentMod({ ...currentMod, effect: val })
		setSaveNeeded(true)
	}

	useEffect(() => {
		validate()
	}, [currentMod.effect])

	const updateName = (e: { target: { value: string }}) => {
		setCurrentMod({ ...currentMod, name: e.target.value })
		setSaveNeeded(true)
	}

	const closeEditor = () => {
		if(saveNeeded) {
			setShowSaveModal(true)
		} else {
			exit()
		}
	}

	const closeSaveModal = () => setShowSaveModal(false)

	return (
		<>
			<div id="mod-editor">
				<div id="editor-top">
					<h3>{editing ? "New Modifier" : "Edit Modifier"}</h3>
					<a id="help" href="https://github.com/Jaggler3/grroom/#custom-modifiers" rel="noreferrer" target="_blank">Need help?</a>
				</div>
				<button id="mod-editor-close" onClick={closeEditor}>
					<p><i className="fas fa-times"></i></p>
				</button>
				<div id="editor-name-parent">
					<input
						value={currentMod.name}
						onChange={updateName}
						placeholder="Modifier Name..."
					/>
				</div>
				<p id="editor-ace-label">JavaScript</p>
				<AceEditor
					mode="javascript"
					theme="kuroir"
					onChange={changeEffect}
					name="editor-ace"
					placeholder="Enter your modifier here..."
					defaultValue={initial.effect}
					editorProps={{
						enableBasicAutocompletion: true,
						enableLiveAutocompletion: true,
						tabSize: 4,
						showGutter: false
					}}
				/>
				<div id="validation-area">
					{validationError !== "" && (
						<div id="error">
							<p>{validationError}</p>
						</div>
					)}
					{validated && (
						<div id="success">
							<p><i className="fas fa-check"></i>Your modifier code has no problems.</p>
						</div>
					)}
				</div>
				<div id="editor-buttons">
					<button onClick={save} className={!validated ? "disabled" : ""}>
						<p>Save</p>
					</button>
				</div>
				<br/>
				{showSaveModal && <div id="mod-save">
					<div id="save-modal">
						<p>You have unsaved changes. Would you like to validate and save?</p>
						<div id="actions">
							<button onClick={closeSaveModal}>
								<p>Go back</p>
							</button>
							<button onClick={exit}>
								<p>Continue without saving</p>
							</button>
						</div>
					</div>
				</div>}
			</div>
		</>
	)
}
