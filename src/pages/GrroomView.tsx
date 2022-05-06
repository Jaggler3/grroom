import React, { useState, useEffect, ChangeEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Oval } from 'react-loader-spinner'

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
import Net, { InfoResponse } from '../net/Net'
import { useNavigate } from 'react-router-dom';
import CleanMenu from '../components/CleanMenu';
import { getParams } from '../core/Util'
import ComingSoon from './main-view/ComingSoon'

const FIVE_KBS: number = 5 * 1024

export interface GrroomViewProps {
	projectID?: string
}
export default function GrroomView({ projectID }: GrroomViewProps) {

	const { step } = getParams()
	const navigate = useNavigate()

	const [showOverlay, setShowOverlay] = useState(true)
	const [overlayPurpose, setOverlayPurpose] = useState(projectID ? "loading" : "welcome")
	const [dataSet, setDataSet] = useState<DataSet>(EmptyDataSet)
	const [userInfo, setUserInfo] = useState<InfoResponse | undefined>()
	const [signedIn, setSignedIn] = useState<boolean>(false)
	const [changesMade, setChangesMade] = useState(false)

	useEffect(() => {
		(async () => {
			if(!await Net.verifySession()) {
				if(window.location.href.includes("project")) {
					window.location.replace("/")
				}
				return
			}
			setUserInfo(await Net.getUserInfo())
			setSignedIn(true)
			if (projectID) {
				const projectContents = await Net.readProject(projectID)
				const info = await Net.getProjectInfo(projectID)
				if (projectContents) {
					importString(info.name, projectContents)
				}
			}
		})()
	}, [])

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

	const backToDashboardButton = () => {
		if (changesMade) {
			setOverlayPurpose("confirm discard to dashboard")
			setShowOverlay(true)
		} else {
			backToDashboard()
		}
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
				if (fileInput.files[0].size > FIVE_KBS) {
					setOverlayPurpose("disallowed " + originState)
					setShowOverlay(true)
					return;
				}

				const fileContents = await Net.uploadBounce(formData)
				if (fileContents) {
					importString(fileInput.files[0].name, fileContents)
				}
			}
		})
		fileInput.click()
	}

	const backToDashboard = () => navigate("/")

	const onChangeProjectName = async (newName: string) => {
		if(newName === dataSet.name) return
		setDataSet({ ...dataSet, name: newName })
		await Net.renameProject(projectID!, newName)
	}

	const reopenUpload = () => {
		if (changesMade) {
			setOverlayPurpose("confirm discard")
			setShowOverlay(true)
		} else {
			selectUpload("none")
		}
	}

	const closeOverlay = () => setShowOverlay(false)

	const closeDisallowed = (originState: string) => {
		setOverlayPurpose(originState)
		if (originState === "none") {
			setShowOverlay(false)
		}
	}

	return (
		<div id="main">
			<Header
				projectID={projectID}
				projectName={dataSet.name}
				onImport={reopenUpload}
				onBack={backToDashboardButton}
				signedIn={signedIn}
				onChangeProjectName={onChangeProjectName}
			/>
			{!step && <Clean {...{userInfo, projectID, dataSet, setDataSet, setChangesMade}} />}
			{step && <ComingSoon />}
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
							<Welcome selectUpload={() => selectUpload("welcome")} selectExample={selectExample} />
						)}
						{overlayPurpose === "loading" && (
							<div id="loading-spinner">
								<Oval
									color="#5697E3"
									secondaryColor='white'
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
						{overlayPurpose === "confirm discard to dashboard" && (
							<div id="confirm">
								<p>You have unsaved changes. Are you sure you would like go back to the dashboard?</p>
								<div className="buttons">
									<button className="cancel" onClick={closeOverlay}>
										<p>Cancel</p>
									</button>
									<button onClick={() => backToDashboard()}>
										<p>Continue</p>
									</button>
								</div>
							</div>
						)}
						{overlayPurpose.startsWith("disallowed") && (
							<div id="disallowed">
								<p><strong>Aw, snap.</strong></p>
								<br />
								<p>The selected file is too large to upload, either due to your current plan or Grroom service limits.</p>
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

type Setter<T> = React.Dispatch<React.SetStateAction<T>>

interface CleanProps {
	projectID?: string,
	userInfo?: InfoResponse;
	dataSet: DataSet;
	setDataSet: Setter<DataSet>;
	setChangesMade: Setter<boolean>;
}
function Clean({ dataSet, setDataSet, projectID, userInfo, setChangesMade }: CleanProps) {

	const [showOverlay, setShowOverlay] = useState(false) // no projectID: welcome screen, yes projectID: loading screen
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
		setChangesMade(true)
	}

	const startLoading = () => {
		setShowOverlay(true)
		setOverlayPurpose("loading")
	}

	const endLoading = () => {
		setShowOverlay(false)
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
		setChangesMade(false)
	}

	const createSave = async () => {
		const oldPurpose = overlayPurpose
		const wasShowing = showOverlay
		setOverlayPurpose("loading")
		setShowOverlay(true)
		await Net.saveProject(projectID!, Serialize(dataSet))
		setShowOverlay(wasShowing)
		setOverlayPurpose(oldPurpose)
		setChangesMade(false)
	}

	return (
		<>
			<div id="center">
				<div id="table-wrapper">
					<CleanMenu canSave={!!projectID} {...{createSave, createExport}} />
					<CleanerTable dataSet={dataSet} />
				</div>
				<Mods
					premium={userInfo?.plan !== "Lite"}
					dataSet={dataSet}
					applyMod={applyMod}
					previewMod={openModPreview}
					newMod={newMod}
					localMods={localMods}
					removeLocalMod={removeLocalMod}
					editMod={editMod}
					startLoading={startLoading}
					endLoading={endLoading}
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
						{overlayPurpose === "loading" && (
							<div id="loading-spinner">
								<Oval
									color="#5697E3"
									secondaryColor='white'
									height={100}
									width={100}
								/>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}
