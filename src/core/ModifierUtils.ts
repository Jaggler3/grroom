import CookieNames, { GetModCookieName } from "../content/CookieNames";
import { Modifier, createModifierID } from "./Modifier";
import { DataSet } from "./DataSet";
import { transform } from "@babel/standalone";
import removeUseStrict from "babel-plugin-remove-use-strict";

export const GetLocalMods = (): string[] => {
    const list = localStorage.getItem(CookieNames.ModList);
    return list ? list.split("\n") : [];
};

export const LoadLocalMods = (): Modifier[] => {
    const names = GetLocalMods();
    return names.map((name) => ({
        id: createModifierID(),
        name,
        effect: localStorage.getItem(GetModCookieName(name)) || "",
    }));
};

export const RemoveModFromCookies = (name: string): void => {
    localStorage.removeItem(GetModCookieName(name));
    const updatedList = GetLocalMods().filter((x) => x !== name).join("\n");
    localStorage.setItem(CookieNames.ModList, updatedList);
};

export const TransformEffect = (code: string): string => {
    try {
        let newCode = transform(code, {
            presets: ['env'],
            plugins: [removeUseStrict],
        }).code?.trim() || "";

        if (newCode.endsWith(";")) {
            newCode = newCode.slice(0, -1);
        }
        return newCode;
    } catch (e) {
        console.error(e);
        return "() => {}";
    }
};

export const LocalEffect = (original: DataSet, mod: Modifier): DataSet => {
    const beforeItems = original.items;
    const code = `${TransformEffect(mod.effect.trim()).trim()};modify(__rows, __cols)`;

    console.log(code);

    // @ts-ignore
    if (Interpreter) {
        try {
            // @ts-ignore
            const parsed = new Interpreter(code);
            parsed.setValueToScope("__rows", parsed.nativeToPseudo(beforeItems));
            parsed.setValueToScope("__cols", parsed.nativeToPseudo(original.columns));
            parsed.setValueToScope("modify", parsed.createNativeFunction((set: any) => set));
            parsed.setValueToScope("log", parsed.createNativeFunction(console.log));
            parsed.run();

            const newItems = parsed.pseudoToNative(parsed.value);
            return {
                lastModified: 0,
                items: newItems,
                columns: original.columns,
                name: original.name,
            };
        } catch (e) {
            console.error(e);
        }
    } else {
        console.error("Could not initialize interpreter.");
    }

    return {
        lastModified: 0,
        items: original.items,
        columns: original.columns,
        name: original.name,
    };
};

export const SaveMod = (mod: Modifier): void => {
    const modName = mod.name.trim();
    const beforeList = localStorage.getItem(CookieNames.ModList);

    if (beforeList) {
        const newList = beforeList.split("\n");
        if (!newList.includes(modName)) {
            newList.push(modName);
            localStorage.setItem(CookieNames.ModList, newList.join("\n"));
        }
    } else {
        localStorage.setItem(CookieNames.ModList, modName);
    }

    localStorage.setItem(GetModCookieName(modName), mod.effect);
};
