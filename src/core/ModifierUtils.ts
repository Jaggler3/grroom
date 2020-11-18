import CookieNames, { GetModCookieName } from "../content/CookieNames";
import { Modifier, createModifierID } from "./Modifier";
import { DataSet } from "./DataSet";

export const GetLocalMods = (): string[] => {
	let list;
	if((list = localStorage.getItem(CookieNames.ModList))) {
		return list.split("\n")
	} else {
		return []
	}
}

export const LoadLocalMods = (): Modifier[] => {
	const names = GetLocalMods();
	return names.map((name) => {
		let _mod: Modifier = {
			id: createModifierID(),
			name,
			effect: "" + localStorage.getItem(GetModCookieName(name))
		}
		return _mod;
	})
}

export const RemoveModFromCookies = (name: string) => {
	localStorage.removeItem(GetModCookieName(name))
	localStorage.setItem(CookieNames.ModList, GetLocalMods().filter(x => x !== name).join("\n"))
}

export const LocalEffect = (original: DataSet, mod: Modifier): DataSet => {
	let beforeItems = original.items;

	const code = mod.effect.trim().replace("modify", "") + "(__rows, __cols)"

	// @ts-ignore
	if(Interpreter) {
		try {
			// @ts-ignore
			let parsed = new Interpreter(code)
			parsed.setValueToScope("__rows", parsed.nativeToPseudo(beforeItems))
			parsed.setValueToScope("__cols", parsed.nativeToPseudo(original.columns))
			parsed.setValueToScope("modify", parsed.createNativeFunction((set: any) => set))
			parsed.setValueToScope("log", parsed.createNativeFunction(console.log))
			parsed.run()
			const newItems = parsed.pseudoToNative(parsed.value)

			const result: DataSet = {
				lastModified: 0,
				items: newItems,
				columns: original.columns,
				name: original.name
			}

			return result;
		} catch (e) {
			console.error(e)

			return {
				lastModified: 0,
				items: original.items,
				columns: original.columns,
				name: original.name
			}
		}
	} else {
		console.error("Could not initialize interpreter.")
		return {
			lastModified: 0,
			items: original.items,
			columns: original.columns,
			name: original.name
		}
	}
}

export const SaveMod = (mod: Modifier) => {
	const modName = mod.name.trim()
	
	// add to list of mods
	let beforeList: string | null = "";
	if((beforeList = localStorage.getItem(CookieNames.ModList))) {
		let newList = beforeList.split("\n")
		if(!newList.includes(modName)) {
			newList.push(modName)
			localStorage.setItem(CookieNames.ModList, newList.join("\n"))
		}
	} else {
		localStorage.setItem(CookieNames.ModList, modName)
	}

	// save mod
	localStorage.setItem(GetModCookieName(modName), mod.effect);
}
