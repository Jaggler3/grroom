import CookieNames, { GetModCookieName } from "../content/CookieNames";
import { Modifier, createModifierID } from "./Modifier";
import { DataSet } from "./DataSet";
import { transform } from "@babel/standalone";
import removeUseStrict from "babel-plugin-remove-use-strict"

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

export const TransformEffect = (code: string): string => {
	try {
		let newCode = (transform(code, {
			presets: ['env'],
			plugins: [removeUseStrict]
		}).code || "").trim();
		if(newCode.endsWith(";")) {
			newCode = newCode.substring(0, newCode.length - 1)
		}
		return newCode
	} catch (e) {
		console.error(e)
		return "() => {}"
	}
}

export const LocalEffect = (original: DataSet, mod: Modifier): DataSet => {
	let beforeItems = original.items;

	const code = TransformEffect(mod.effect.trim()).trim() + ";modify(__rows, __cols)"

	console.log(code)

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
			console.log({ parsed })
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
