import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion"

import './Mods.scss'
import { DataSet } from '../core/DataSet'
import Suggest from '../content/Suggest'
import { HelpModifier, Modifier } from '../core/Modifier'

interface ModsProps {
	dataSet: DataSet,
	applyMod: (mod: Modifier, suggested: boolean) => void,
	previewMod: (mod: Modifier, suggested: boolean) => void,
	newMod: () => void,
	localMods: Modifier[],
	removeLocalMod: (mod: Modifier) => void,
	editMod: (mod: Modifier) => void
}

export default function Mods({ dataSet, localMods, applyMod, previewMod, newMod, removeLocalMod, editMod }: ModsProps) {

	const [suggestions, setSuggestions] = useState<HelpModifier[]>([])

	useEffect(() => setSuggestions(Suggest(dataSet)), [dataSet])

	const applySuggestion = (mod: HelpModifier) => {
		removeSuggestion(mod)
		applyMod(mod, true)
	}

	const removeSuggestion = (mod: HelpModifier) => setSuggestions(suggestions.filter(x => x !== mod))

	const removeMod = (mod: Modifier, suggested: boolean) => {
		if(suggested) {
			removeSuggestion(mod as HelpModifier)
			return;
		} else {
			removeLocalMod(mod)
		}
	}

	return (
		<div id="mods">
			<h2>Mods</h2>
			<button onClick={newMod}>
				<p><i className="fas fa-plus"></i>&nbsp;New Mod</p>
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
					<h3 key="suggestion-label">Suggestions</h3>
					<br key="space-label" />
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
			key={mod.id}
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
