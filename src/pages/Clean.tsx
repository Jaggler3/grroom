import React, { useState, useEffect, ChangeEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

import './Clean.scss'
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
import Net from '../net/Net'

const FIVE_MBS: number = 5 * 1024 * 1024

export interface CleanProps {
	projectID?: string,
	projectName?: string
}
export default function Clean({ projectID, projectName }: CleanProps) {

	const [dataSet, setDataSet] = useState<DataSet>(EmptyDataSet)
	const [showOverlay, setShowOverlay] = useState(true) // no projectID: welcome screen, yes projectID: loading screen
	const [overlayPurpose, setOverlayPurpose] = useState(projectID ? "loading" : "welcome")
	const [selectedMod, setSelectedMod] = useState<Modifier>({ id: "", name: "", effect: "" })
	const [previewType, setPreviewType] = useState("")
	const [localMods, setLocalMods] = useState<Modifier[]>(LoadLocalMods())
	const [changesMade, setChangesMade] = useState(false)
	const [namedChanged, setNameChanged] = useState(false)
	const [loading, setLoading] = useState(!!projectID)

	useEffect(() => {
		(async () => {
			if (projectID) {
				const projectContents = await Net.readProject(projectID)
				if (projectContents) {
					importString("", projectContents)
				}
			}
		})()
	}, [])

	useEffect(() => {
		(async () => {
			if (loading && dataSet.items.length > 0) {
				const info = await Net.getProjectInfo(projectID!)
				if (info.name) {
					setDataSet({
						name: info.name,
						items: dataSet.items,
						lastModified: dataSet.lastModified,
						columns: dataSet.columns
					})
					setLoading(false)
				}
			}
		})()
	}, [dataSet.items.length])

	const applyMod = (mod: Modifier, suggested: boolean) => {
		if (suggested) {
			const helpMod = mod as HelpModifier
			setDataSet({ ...helpMod.helpEffect() })
		} else {
			setDataSet({ ...LocalEffect(dataSet, mod) })
		}
		setChangesMade(true)
	}

	const selectUpload = (originState: string) => {
		const fileInput = document.createElement("input")
		fileInput.type = "file"
		fileInput.accept = "csv"
		fileInput.multiple = false
		fileInput.addEventListener("change", async () => {
			const formData = new FormData()
			if (fileInput.files) {
				formData.append('csv-file', fileInput.files[0])
				if (fileInput.files[0].size > FIVE_MBS) {
					setOverlayPurpose("disallowed " + originState)
					setShowOverlay(true)
					return;
				}

				setOverlayPurpose("loading")
				const fileContents = await Net.uploadBounce(formData)
				if (fileContents) {
					importString(fileInput.files[0].name, fileContents)
				}
			}
		})
		fileInput.click()
	}

	const importString = (name: string, contents: string) => {
		const parsedDataSet = Deserialize(name, contents.trim())
		setShowOverlay(false)
		setChangesMade(false)
		setDataSet(parsedDataSet)
	}

	const selectExample = () => {
		setShowOverlay(false)
		setDataSet(TestDataSet)
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

	const reopenUpload = () => {
		if (changesMade) {
			setOverlayPurpose("confirm discard")
			setShowOverlay(true)
		} else {
			selectUpload("none")
		}
	}

	const createExport = () => {
		SaveFile(dataSet.name, Serialize(dataSet))
		setChangesMade(false)
	}

	const createSave = async () => {
		const oldPurpose = overlayPurpose
		const wasShowing = showOverlay
		setOverlayPurpose("loading")
		setShowOverlay(true)
		await Net.saveProject(projectID!, Serialize(dataSet), namedChanged, dataSet.name)
		setShowOverlay(wasShowing)
		setOverlayPurpose(oldPurpose)
	}

	const closeDisallowed = (originState: string) => {
		setOverlayPurpose(originState)
		if (originState === "none") {
			setShowOverlay(false)
		}
	}

	const updateName = (e: ChangeEvent<HTMLInputElement>) => {
		setDataSet({ ...dataSet, name: e.target.value })
		setNameChanged(true)
	}

	return (
		<div id="main">
			<Header signedIn={!!projectID} onImport={reopenUpload} />
			<div id="top">
				<div id="name">
					<input
						placeholder="Your data set name..."
						value={dataSet.name}
						onChange={updateName}
						spellCheck={false}
					/>
				</div>
				<div id="top-buttons">
					{projectID ? (
						<button onClick={createSave}>
							<p>Save Project</p>
						</button>
					) : (
							<button onClick={createExport}>
								<p>Export CSV</p>
							</button>
						)}
				</div>
			</div>
			<div id="center">
				<CleanerTable dataSet={dataSet} />
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
						transition={{ duration: .25 }}
					>
						{overlayPurpose === "welcome" && (
							<Welcome selectUpload={() => selectUpload("welcome")} selectExample={selectExample} />
						)}
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
						{overlayPurpose === "loading" && (
							<div id="loading-spinner">
								<Loader
									type="Oval"
									color="#5697E3"
									height={100}
									width={100}
								/>
							</div>
						)}
						{overlayPurpose === "confirm discard" && (
							<div id="confirm">
								<p>You have unsaved changes. Are you sure you would like to import a new data set?</p>
								<div className="buttons">
									<button className="cancel" onClick={closeOverlay}>
										<p>Cancel</p>
									</button>
									<button onClick={() => selectUpload("none")}>
										<p>Continue</p>
									</button>
								</div>
							</div>
						)}
						{overlayPurpose.startsWith("disallowed") && (
							<div id="disallowed">
								<p><strong>Aw, snap.</strong></p>
								<br />
								<p>Currently, Grroom only supports uploading files no larger than 5 MB.</p>
								<div className="buttons">
									<button onClick={() => closeDisallowed(overlayPurpose.split(" ")[1])}>
										<p>Go Back</p>
									</button>
								</div>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
