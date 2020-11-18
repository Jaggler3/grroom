import React, { useState, useRef, useEffect } from 'react'

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
import { LoadLocalMods, LocalEffect, RemoveModFromCookies, SaveMod } from '../core/ModifierUtils'

const InitialDataSet: DataSet = {
	lastModified: 0,
	name: "",
	columns: [],
	items: []
}

export default function Clean() {

	const [dataSet, setDataSet] = useState<DataSet>(InitialDataSet)

	const measureColumns = useRef<(HTMLDivElement | null)[]>(new Array(1))
	const [colWidths, setColWidths] = useState<string[]>([])

	const [showOverlay, setShowOverlay] = useState(true)
	const [overlayPurpose, setOverlayPurpose] = useState("welcome")
	const [selectedMod, setSelectedMod] = useState<Modifier>({ id: "", name: "", effect: "" })
	const [previewType, setPreviewType] = useState("")

	const [localMods, setLocalMods] = useState<Modifier[]>(LoadLocalMods())

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
		if(suggested) {
			const helpMod = mod as HelpModifier
			setDataSet({
				...helpMod.helpEffect()
			})
		} else {
			setDataSet({
				...LocalEffect(dataSet, mod)
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

	const saveLocalMod = (initialName: string, mod: Modifier) => {
		RemoveModFromCookies(initialName)
		setLocalMods([ ...localMods.filter(x => x.name !== initialName), mod])
		SaveMod(mod)
	}

	const removeLocalMod = (mod: Modifier) => {
		const modName = mod.name.trim()
		RemoveModFromCookies(modName)
		setLocalMods(localMods.filter(x => x.name !== modName))
	}

	const editMod = (mod: Modifier) => {
		setOverlayPurpose("edit custom")
		setSelectedMod(mod)
		setShowOverlay(true)
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
					editMod={editMod}
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
									afterSet={('helpEffect' in selectedMod) ? (selectedMod as HelpModifier).helpEffect() : LocalEffect(dataSet, selectedMod)}
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
								saveMod={saveLocalMod}
							/>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
