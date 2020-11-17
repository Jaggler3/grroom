import { HelpModifier, createModifierID } from "../core/Modifier"
import { DataSet } from "../core/DataSet"
import CapitalizeModifier from "./CapitalizeModifier";
import TrimModifier from "./TrimModifier";

const AllHelpModifiers = [
	CapitalizeModifier,
	TrimModifier
]

export default function Suggest(data: DataSet) {
	let suggestions: HelpModifier[] = [];

	for(const modifier of AllHelpModifiers) {
		const result = modifier({
			lastModified: data.lastModified,
			items: [...data.items],
			columns: [...data.columns],
			name: data.name
		});
		if(result && result.length > 0) {
			suggestions = [...suggestions, ...result]
		}
	}

	return suggestions;
}