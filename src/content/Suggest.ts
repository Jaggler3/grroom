import { HelpModifier } from "../core/Modifier"
import { DataSet } from "../core/DataSet"
import CapitalizeModifier from "./suggestions/CapitalizeModifier";
import TrimModifier from "./suggestions/TrimModifier";
import PhoneFormatModifier from "./suggestions/PhoneFormatModifier";

const AllHelpModifiers = [
	CapitalizeModifier,
	TrimModifier,
]

const PremiumModifiers = [
	PhoneFormatModifier
]

export default function Suggest(premium: boolean, oldSuggestions: HelpModifier[], data: DataSet) {
	let suggestions: HelpModifier[] = [];

	for(const modifier of [...PremiumModifiers, ...AllHelpModifiers]) {
		const result = modifier({
			lastModified: data.lastModified,
			items: [...data.items],
			columns: [...data.columns],
			name: data.name
		});
		if(result && result.length > 0) {
			suggestions.push(...result)
		}
	}

	for(const oldSuggestion of oldSuggestions) {
		for(const newSuggestion of suggestions) {
			if(newSuggestion.name === oldSuggestion.name) {
				newSuggestion.id = oldSuggestion.id
				break
			}
		}
	}

	return suggestions;
}