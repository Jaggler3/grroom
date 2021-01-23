import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion"

import './Mods.scss'
import { DataSet } from '../core/DataSet'
import Suggest from '../content/Suggest'
import { HelpModifier, Modifier, GetModifierName } from '../core/Modifier'
import Net from '../net/Net'

interface ModsProps {
	dataSet: DataSet,
	applyMod: (mod: Modifier, suggested: boolean) => void,
	previewMod: (mod: Modifier, suggested: boolean) => void,
	newMod: () => void,
	localMods: Modifier[],
	removeLocalMod: (mod: Modifier) => void,
	editMod: (mod: Modifier) => void,
	startLoading: () => void,
	endLoading: () => void
}

/*
interface HostedModCache {
	[modID: string]: string
}
*/

export default function Mods({ dataSet, localMods, applyMod, previewMod, newMod, removeLocalMod, editMod }: ModsProps) {

	// const [hostedMods, setHostedMods] = useState<string[]>([])
	const [suggestions, setSuggestions] = useState<HelpModifier[]>([])

	// const [cachedMods, setCachedMods] = useState<HostedModCache>({})

	useEffect(() => setSuggestions((suggestions) => Suggest(suggestions, dataSet)), [dataSet])
	/*
	useEffect(() => {
		(async () => {
			const result = await Net.getHostedMods()
			setHostedMods(result)
		})();
	}, [])
	*/
	const applySuggestion = (mod: HelpModifier) => {
		removeSuggestion(mod)
		applyMod(mod, true)
	}

	const removeSuggestion = (mod: HelpModifier) => setSuggestions(suggestions.filter(x => x !== mod))

	const removeMod = (mod: Modifier, suggested: boolean) => suggested
		? removeSuggestion(mod as HelpModifier)
		: removeLocalMod(mod)

	/*
	const removeHostedMod = (modNameID: string) => setHostedMods(hostedMods.filter(x => x !== modNameID))

	const editHostedMod = (modNameID: string) => {
		if(isModCached(modNameID)) {
			editMod(cachedToModifier(modNameID))
		}
	}
	const deleteHostedMod = (modNameID: string) => {
		
	}
	const applyHostedMod = (modNameID: string) => {
		
	}
	const previewHostedMod = (modNameID: string) => {
		
	}

	const cachedToModifier = (modNameID: string): Modifier => ({
		id: modNameID,
		name: GetModifierName(modNameID),
		effect: cachedMods[modNameID]
	})

	const loadMod = async (modID: string) => {
		const modScript = await Net.readHostedMod(modID)
		if(modScript !==  "") {
			setCachedMods({
				modID: modScript
			})
		}
	}

	const isModCached = (modNameID: string) => !!cachedMods[modNameID];
	*/

	return (
		<div id="mods">
			<h2>Mods</h2>
			<button onClick={newMod}>
				<p><i className="fas fa-plus"></i>&nbsp; New Mod</p>
			</button>
			<div id="mod-list">
				<AnimatePresence>
					{localMods && (
						<>
							{localMods.map((mod, i) => (
								<ModCard
									key={mod.id}
									helper={false}
									indexForDelay={i}
									mod={mod}
									applyMod={applyMod}
									previewMod={previewMod}
									removeMod={(m) => removeMod(m, false)}
									editMod={editMod}
								/>
							))}
							<br />
						</>
					)}
					{/*hostedMods.length > 0 && (
						<>
							<h3 key="suggestion-label">Custom Mods</h3>
							<br key="space-label" />
						</>
					)}
					{hostedMods.map((modNameID, i) => (
						<HostedModCard
							key={modNameID}
							indexForDelay={i}
							modNameID={modNameID}
							applyMod={applyHostedMod}
							previewMod={previewHostedMod}
							removeMod={removeHostedMod}
							editMod={editHostedMod}
							deleteMod={deleteHostedMod}
						/>
					))*/}
					{suggestions.length > 0 && (
						<div key="suggestion-label">
							<h3 >Suggestions</h3>
							<br key="space-label" />
						</div>
					)}
					{suggestions.map((helpMod, i) => (
						<ModCard
							key={helpMod.id}
							helper={true}
							indexForDelay={i}
							mod={helpMod}
							applyMod={(m) => applySuggestion(m as HelpModifier)}
							previewMod={previewMod}
							removeMod={(m) => removeSuggestion(m as HelpModifier)}
						/>
					))}
				</AnimatePresence>
			</div>
		</div>
	)
}

interface ModCardProps {
	helper: boolean,
	mod: Modifier | HelpModifier,
	indexForDelay: number,
	previewMod: (mod: Modifier, suggested: boolean) => void,
	removeMod: (mod: Modifier) => void,
	applyMod: (mod: Modifier, suggested: boolean) => void,
	editMod?: (mod: Modifier) => void
}

function ModCard({ helper, indexForDelay, mod, previewMod, removeMod, applyMod, editMod }: ModCardProps) {
	return (
		<motion.div
			className="help-modifier"
			initial={{
				opacity: 0
			}}
			animate={{
				opacity: 1
			}}
			transition={{
				duration: .25,
				delay: 0.1 * indexForDelay
			}}
			exit={{
				opacity: 0,
				scale: 0.5
			}}
		>
			<div className="modifier-top">
				<h2>{mod.name}</h2>
				{helper && <button onClick={() => removeMod(mod)}>
					<p><i className="fas fa-times"></i></p>
				</button>}
			</div>
			{helper && <p>{(mod as HelpModifier).desc}</p>}
			<div className="modifier-buttons">
				<button onClick={() => previewMod(mod, helper)}>
					<p><i className="fas fa-eye"></i> Preview</p>
				</button>
				<button onClick={() => applyMod(helper ? mod as HelpModifier : mod, helper)}>
					<p><i className="fas fa-check"></i> Apply</p>
				</button>
			</div>
			{!helper && (
				<div className="modifier-buttons">
					<button onClick={() => removeMod(mod)}>
						<p><i className="fas fa-times"></i> Delete</p>
					</button>
					<button onClick={() => editMod!(mod)}>
						<p><i className="fas fa-i-cursor"></i> Edit</p>
					</button>
				</div>
			)}
		</motion.div>
	)
}

interface HostedModCardProps {
	modNameID: string,
	indexForDelay: number,
	removeMod: (modNameID: string) => void,
	deleteMod: (modNameID: string) => void,
	previewMod: (modNameID: string) => void,
	applyMod: (modNameID: string) => void,
	editMod: (modNameID: string) => void
}

function HostedModCard({ modNameID, indexForDelay, removeMod, deleteMod, previewMod, applyMod, editMod }: HostedModCardProps) {
	const modInputSpl = modNameID.split("|||")
	const modName = modInputSpl[0]
	const modID = modInputSpl[1]

	return (
		<motion.div
			className="help-modifier"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: .25, delay: 0.1 * indexForDelay }}
			exit={{ opacity: 0, scale: 0.5 }}
		>
			<div className="modifier-top">
				<h2>{modName}</h2>
				<button onClick={() => removeMod(modNameID)}>
					<p><i className="fas fa-times"></i></p>
				</button>
			</div>
			<div className="modifier-buttons">
				<button onClick={() => previewMod(modNameID)}>
					<p><i className="fas fa-eye"></i> Preview</p>
				</button>
				<button onClick={() => applyMod(modNameID)}>
					<p><i className="fas fa-check"></i> Apply</p>
				</button>
			</div>
			<div className="modifier-buttons">
				<button onClick={() => deleteMod(modNameID)}>
					<p><i className="fas fa-times"></i> Delete</p>
				</button>
				<button onClick={() => editMod(modNameID)}>
					<p><i className="fas fa-i-cursor"></i> Edit</p>
				</button>
			</div>
		</motion.div>
	)
}