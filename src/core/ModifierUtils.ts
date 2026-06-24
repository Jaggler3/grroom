import Sval from "sval";
import { Modifier, createModifierID } from "./Modifier";
import { DataSet } from "./DataSet";

const MOD_LIST_KEY = "grroom-mods";
const MOD_PREFIX = "grroom-mod-";

const getModCookieName = (name: string) => MOD_PREFIX + name;

const getLocalModList = (): string[] => {
    const list = localStorage.getItem(MOD_LIST_KEY);
    return list ? list.split("\n") : [];
};

export const LoadLocalMods = (): Modifier[] => {
    const names = getLocalModList();
    return names.map((name) => ({
        id: createModifierID(),
        name,
        effect: localStorage.getItem(getModCookieName(name)) || "",
    }));
};

export const RemoveModFromCookies = (name: string): void => {
    localStorage.removeItem(getModCookieName(name));
    const updatedList = getLocalModList().filter((x) => x !== name).join("\n");
    localStorage.setItem(MOD_LIST_KEY, updatedList);
};

export const LocalEffect = (original: DataSet, mod: Modifier): DataSet => {
    try {
        let modifierFn: unknown = null;

        const interpreter = new Sval({
            ecmaVer: "latest",
            sourceType: "script",
            sandBox: true,
        });

        interpreter.import("modify", (fn: unknown) => {
            modifierFn = fn;
        });
        interpreter.import("log", console.log);
        interpreter.run(mod.effect);

        if (typeof modifierFn === "function") {
            const itemsCopy = original.items.map((row) => ({ ...row }));
            const newItems = modifierFn(itemsCopy, original.columns) as any[];
            return {
                lastModified: 0,
                items: newItems,
                columns: original.columns,
                name: original.name,
            };
        }
    } catch (e) {
        console.error(e);
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
    const beforeList = localStorage.getItem(MOD_LIST_KEY);

    if (beforeList) {
        const newList = beforeList.split("\n");
        if (!newList.includes(modName)) {
            newList.push(modName);
            localStorage.setItem(MOD_LIST_KEY, newList.join("\n"));
        }
    } else {
        localStorage.setItem(MOD_LIST_KEY, modName);
    }

    localStorage.setItem(getModCookieName(modName), mod.effect);
};
