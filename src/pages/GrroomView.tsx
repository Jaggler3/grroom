import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import './GrroomView.scss'
import Header from '../components/Header'
import { DataSet, EmptyDataSet } from '../core/DataSet'
import CleanerTable from '../components/CleanerTable'
import Mods from '../components/Mods'
import { HelpModifier, Modifier, createModifierID } from '../core/Modifier'
import PreviewTable from '../components/PreviewTable'
import { TestDataSet } from '../content/TestDataSet'
import Welcome from '../components/Welcome'
import ModEditor from '../components/ModEditor'
import { ExampleModText } from '../content/ExampleMod'
import { LoadLocalMods, LocalEffect, RemoveModFromCookies, SaveMod } from '../core/ModifierUtils'
import { Deserialize, SaveFile, Serialize } from '../core/CSVSerialize'
import CleanMenu from '../components/CleanMenu'
import Analyze from './Analyze'
import Present from './Present'

export default function GrroomView() {

	const [showOverlay, setShowOverlay] = useState(true)
	const [overlayPurpose, setOverlayPurpose] = useState("welcome")
	const [dataSet, setDataSet] = useState<DataSet>(EmptyDataSet)
	const [step, setStep] = useState<string | undefined>()

	const importString = (name: string, contents: string) => {
		const parsedDataSet = Deserialize(name, contents.trim())
		setShowOverlay(false)
		setDataSet(parsedDataSet)
	}

	const selectExample = () => {
		setShowOverlay(false)
		setDataSet(TestDataSet)
	}

	const selectUpload = () => {
		const fileInput = document.createElement("input")
		fileInput.type = "file"
		fileInput.accept = "csv"
		fileInput.multiple = false
		fileInput.addEventListener("change", () => {
			if (fileInput.files) {
				const file = fileInput.files[0]
				const reader = new FileReader()
				reader.onload = (e) => {
					const contents = e.target?.result as string
					if (contents) {
						importString(file.name, contents)
					}
				}
				reader.readAsText(file)
			}
		})
		fileInput.click()
	}

	const onChangeProjectName = (newName: string) => {
		setDataSet({ ...dataSet, name: newName })
	}

	return (
		<div id="main">
			<Header
				projectName={dataSet.name}
				step={step}
				onChangeStep={setStep}
				onChangeProjectName={onChangeProjectName}
			/>
			{!step && <Clean {...{dataSet, setDataSet}} />}
			{step === "analyze" && <Analyze dataSet={dataSet} />}
			{step === "present" && <Present dataSet={dataSet} />}
			<AnimatePresence>
				{showOverlay && (
					<motion.div
						key="overlay"
						id="overlay"
						exit={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						initial={{ opacity: 0 }}
						transition={{ duration: .25 }}
					>
						{overlayPurpose === "welcome" && (
							<Welcome selectUpload={selectUpload} selectExample={selectExample} />
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

type Setter<T> = React.Dispatch<React.SetStateAction<T>>

interface CleanProps {
	dataSet: DataSet;
	setDataSet: Setter<DataSet>;
}
function Clean({ dataSet, setDataSet }: CleanProps) {

	const [showOverlay, setShowOverlay] = useState(false)
	const [overlayPurpose, setOverlayPurpose] = useState("")
	const [selectedMod, setSelectedMod] = useState<Modifier>({ id: "", name: "", effect: "" })
	const [previewType, setPreviewType] = useState("")
	const [localMods, setLocalMods] = useState<Modifier[]>(LoadLocalMods())

	const applyMod = (mod: Modifier, suggested: boolean) => {
		if (suggested) {
			const helpMod = mod as HelpModifier
			setDataSet({ ...helpMod.helpEffect() })
		} else {
			setDataSet({ ...LocalEffect(dataSet, mod) })
		}
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
		setLocalMods([...localMods.filter(x => x.name !== initialName), mod])
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

	const createExport = () => {
		SaveFile(dataSet.name, Serialize(dataSet))
	}

	const onCellEdit = (rowIndex: number, column: string, value: string, ds: DataSet): DataSet => {
		const updated = { ...ds }
		updated.items = ds.items.map((item, i) => {
			if (i !== rowIndex) return item
			return { ...item, [column]: value }
		})
		setDataSet(updated)
		return updated
	}

	return (
		<>
			<div id="center">
				<div id="table-wrapper">
					<CleanMenu createExport={createExport} />
					<CleanerTable dataSet={dataSet} onCellEdit={onCellEdit} />
				</div>
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
						key="overlay"
						id="overlay"
						exit={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						initial={{ opacity: 0 }}
						transition={{ duration: .25 }}
					>
						{overlayPurpose === "preview" && (
							<div id="mod-preview">
								<h1>{selectedMod.name} (preview)</h1>
								<br />
								<PreviewTable
									beforeSet={dataSet}
									afterSet={('helpEffect' in selectedMod) ? (selectedMod as HelpModifier).helpEffect() : LocalEffect(dataSet, selectedMod)}
								/>
								<div className="buttons">
									<button className="cancel" onClick={closeOverlay}>
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
		</>
	)
}

