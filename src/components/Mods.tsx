import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion"

import './Mods.scss'
import { DataSet } from '../core/DataSet'
import Suggest from '../content/Suggest'
import { HelpModifier } from '../core/Modifier'

interface ModsProps {
	dataSet: DataSet,
	applyMod: (mod: HelpModifier) => void
}

export default function Mods({ dataSet, applyMod }: ModsProps) {

	const [suggestions, setSuggestions] = useState<HelpModifier[]>([])

	useEffect(() => {
		setSuggestions(Suggest(dataSet))
	}, [])

	const applySuggestion = (mod: HelpModifier) => {
		applyMod(mod)
		setSuggestions(suggestions.filter(x => x !== mod))
	}

	return (
		<div id="mods">
			<h2>Mods</h2>
			<button>
				<p><i className="fas fa-plus"></i>&nbsp;New Mod</p>
			</button>
			<h3>Suggestions</h3>
			<div id="mod-suggestions">
				<AnimatePresence>
					{suggestions.map((helpMod, i) => (
						<motion.div
							className="help-modifier"
							key={helpMod.id}
							initial={{
								opacity: 0
							}}
							animate={{
								opacity: 1
							}}
							transition={{
								duration: .25,
								delay: 0.1 * i
							}}
							exit={{
								opacity: 0,
								scale: 0.5
							}}
						>
							<div className="modifier-top">
								<h2>{helpMod.name}</h2>
								<button>
									<p><i className="fas fa-times"></i></p>
								</button>
							</div>
							<p>{helpMod.desc}</p>
							<div className="modifier-buttons">
								<button>
									<p><i className="fas fa-eye"></i> Preview</p>
								</button>
								<button onClick={() => applySuggestion(helpMod)}>
									<p><i className="fas fa-check"></i> Apply</p>
								</button>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	)
}
