import React, { useState } from 'react'

import AceEditor from "react-ace";
 
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-kuroir";

import './ModEditor.scss'
import { Modifier } from '../core/Modifier'
import CookieNames, { GetModCookieName } from '../content/CookieNames';

interface ModEditorProps {
	initial: Modifier,
	editing: boolean,
	exit: () => void
}

const validateJSIObject = (obj: any): boolean => {
	return obj.class === "Function" && obj.node.type === "FunctionExpression" && obj.node.params.length === 2
}

export default function ModEditor({ initial, editing, exit }: ModEditorProps) {

	const [currentMod, setCurrentMod] = useState<Modifier>({
		...initial
	})
	const [validated, setValidated] = useState(false)
	const [validationError, setValidationError] = useState<string>("")

	const validate = () => {
		setValidationError("")
		if(currentMod.name.trim().length == 0) {
			setValidationError("GrroomError: Name is empty")
		}
		let code = currentMod.effect
		function initFunc(interpreter: any, scope: any) {
			interpreter.setProperty(scope, "modify", interpreter.createNativeFunction(function(res: any) { return res; }))
		}
		if(Interpreter) {
			try {
				let parsed = new Interpreter(code, initFunc)
				parsed.run()
				const validationResult = validateJSIObject(parsed.value)
				if(!validationResult) {
					setValidationError("GrroomError: Not a valid function expression with params (rows, columnNames).")
				} else {
					setValidated(true)
				}
			} catch (e) {
				setValidationError(e.toString().split("\n").shift())
			}
		} else {
			setValidationError("GrroomError: Could not initialize interpreter.")
		}
	}

	const save = () => {
		let modName = currentMod.name.trim()

		// add to list of mods
		let beforeList: string | null = "";
		if((beforeList = localStorage.getItem(CookieNames.ModList))) {
			let newList = beforeList.split("\n")
			if(!newList.includes(modName)) {
				newList.push(modName)
				localStorage.setItem(CookieNames.ModList, newList.join("\n"))
			}
		} else {
			localStorage.setItem(CookieNames.ModList, modName)
		}

		// save mod
		localStorage.setItem(GetModCookieName(modName), currentMod.effect);

		// exit
		exit()
	}

	const changeEffect = (val: string) => {
		setValidated(false)
		setCurrentMod({ ...currentMod, effect: val})
	}

	return (
		<div id="mod-editor">
			<h3>{editing ? "New Mod" : "Editing Mod"}</h3>
			<div id="editor-name-parent">
				<input
					value={currentMod.name}
					onChange={(e) => setCurrentMod({ ...currentMod, name: e.target.value })}
					placeholder="Modifier Name..."
				/>
			</div>
			<p id="editor-ace-label">JavaScript (ES5 Only)</p>
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
						<p><i className="fas fa-check"></i>&nbsp;Validation successful. Your modifier code has no problems.</p>
					</div>
				)}
			</div>
			<div id="editor-buttons">
				<button onClick={validate}>
					<p>Validate</p>
				</button>
				<button onClick={save} className={!validated ? "disabled" : ""}>
					<p>Save</p>
				</button>
			</div>
		</div>
	)
}
