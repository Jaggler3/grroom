import React, { useState, useRef, useEffect } from 'react'

/**
 * page loads table and suggestion sidebar, modal asks for data set, you can select the example data set or upload
 * top of sidebar has "create mod" button
 * below create mod button shows "suggested"
 * mods slide into sidebar
 * you can preview mods
 */

import './Clean.scss'
import Header from '../components/Header'
import { DataSet, createDataItemID } from '../core/DataSet'
import CleanerTable from '../components/CleanerTable'
import Mods from '../components/Mods'
import { HelpModifier, Modifier, createModifierID } from '../core/Modifier'
import { AnimatePresence, motion } from 'framer-motion'
import PreviewTable from '../components/PreviewTable'
import { TestDataSet } from '../content/TestDataSet'
import Welcome from '../components/Welcome'
import ModEditor from '../components/ModEditor'
import { ExampleModText } from '../content/ExampleMod'
import CookieNames, { GetModCookieName } from '../content/CookieNames'

const InitialDataSet: DataSet = {
	lastModified: 0,
	name: "",
	columns: [],
	items: []
}

const getLocalMods = (): string[] => {
	let list;
	if((list = localStorage.getItem(CookieNames.ModList))) {
		return list.split("\n")
	} else {
		return []
	}
}

const loadLocalMods = (): Modifier[] => {
	const names = getLocalMods();
	return names.map((name) => {
		let _mod: Modifier = {
			id: createModifierID(),
			name,
			effect: "" + localStorage.getItem(GetModCookieName(name))
		}
		return _mod;
	})
}

const localEffect = (original: DataSet, mod: Modifier): DataSet => {
	let result: DataSet = {
		lastModified: 0,
		name: "",
		columns: original.columns,
		items: original.items
	}

	function initFunc(interpreter: any, scope: any) {
		interpreter.setProperty(scope, "__rows", interpreter.createArray(result.items))
		interpreter.setProperty(scope, "__cols", interpreter.createArray(result.columns))
	}

	const code = `
	function modify(effect) { effect(__rows, __cols) }
	` + mod.effect

	if(Interpreter) {
		try {
			let parsed = new Interpreter(code, initFunc)
			parsed.run()
		} catch (e) {
			console.error(e)
		}
	}

	return result;
}

export default function Clean() {

	const [dataSet, setDataSet] = useState<DataSet>(InitialDataSet)

	const measureColumns = useRef<(HTMLDivElement | null)[]>(new Array(1))
	const [colWidths, setColWidths] = useState<string[]>([])

	const [showOverlay, setShowOverlay] = useState(true)
	const [overlayPurpose, setOverlayPurpose] = useState("welcome")
	const [selectedMod, setSelectedMod] = useState<Modifier>({ id: "", name: "", effect: "" })
	const [previewType, setPreviewType] = useState("")

	const [localMods, setLocalMods] = useState<Modifier[]>(loadLocalMods())

	useEffect(() => {
		setColWidths(measureColumns.current.map((a) => {
			let val: string = "";
			if (a) {
				val = a.clientWidth.toString();
			}
			return val;
		}))
	}, [measureColumns.current.length, window.innerWidth])

	const applyMod = (mod: Modifier, suggested: boolean) => {
		console.log("apply")
		if(suggested) {
			const helpMod = mod as HelpModifier
			setDataSet({
				...helpMod.helpEffect()
			})
		}
	}

	const selectUpload = () => {
		
	}

	const selectExample = () => {
		setShowOverlay(false)
		setDataSet(TestDataSet)
		measureColumns.current = new Array(TestDataSet.columns.length + 1)
	}

	const openModPreview = (mod: Modifier, suggested: boolean) => {
		setShowOverlay(true)
		setOverlayPurpose("preview")
		setSelectedMod(mod)
		setPreviewType(suggested ? "help" : "custom")
	}

	const approvePreview = () => {
		applyMod(selectedMod, previewType === "help")
		setShowOverlay(false)
	}

	const closeOverlay = () => setShowOverlay(false)

	const newMod = () => {
		setOverlayPurpose("new custom")
		let initialCustomMod: Modifier = {
			id: createModifierID(),
			name: "My Custom Mod",
			effect: ExampleModText
		}
		setSelectedMod(initialCustomMod)
		setShowOverlay(true)
	}

	const removeLocalMod = (mod: Modifier) => {
		localStorage.removeItem(GetModCookieName(mod.name))
		setLocalMods(localMods.filter(x => x.name !== mod.name))
	}

	return (
		<div id="main">
			<Header />
			<div id="top">
				<div id="name">
					<input
						placeholder="Your data set name..."
						value={dataSet.name}
						onChange={(e) => setDataSet({ ...dataSet, name: e.target.value })}
					/>
				</div>
				<div id="top-buttons">
					<button>
						<p>Export CSV</p>
					</button>
				</div>
			</div>
			<div id="center">
				<CleanerTable dataSet={dataSet} colWidths={colWidths} measureColumns={measureColumns} />
				<Mods
					dataSet={dataSet}
					applyMod={applyMod}
					previewMod={openModPreview}
					newMod={newMod}
					localMods={localMods}
					removeLocalMod={removeLocalMod}
				/>
			</div>
			<AnimatePresence>
				{showOverlay && (
					<motion.div
						id="overlay"
						exit={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						initial={{ opacity: 0 }}
						transition={{ duration: .5 }}
					>
						{overlayPurpose === "welcome" && (
							<Welcome selectUpload={selectUpload} selectExample={selectExample} />
						)}
						{overlayPurpose === "preview" && (
							<div id="mod-preview">
								<h1>{selectedMod.name} (preview)</h1>
								<br/>
								<PreviewTable
									beforeSet={dataSet}
									afterSet={('helpEffect' in selectedMod) ? (selectedMod as HelpModifier).helpEffect() : localEffect(dataSet, selectedMod)}
								/>
								<div id="preview-buttons">
									<button id="cancel-preview" onClick={closeOverlay}>
										<p>Cancel</p>
									</button>
									<button onClick={() => approvePreview()}>
										<p><i className="fas fa-check"></i> Apply</p>
									</button>
								</div>
							</div>
						)}
						{(overlayPurpose === "new custom" || overlayPurpose === "edit custom") && (
							<ModEditor
								initial={selectedMod}
								editing={overlayPurpose === "new custom"}
								exit={closeOverlay}
							/>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
