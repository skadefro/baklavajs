import { ref } from "vue";

const INPUT_ELEMENT_TAGS = ["INPUT", "TEXTAREA", "SELECT"];

export function useHotkeyHandler(executeCommand: (name: string) => void) {
    const pressedKeys = ref<string[]>([]);
    const handlers = ref<Array<{ keys: string[]; commandName: string }>>([]);

    const handleKeyDown = (ev: KeyboardEvent) => {
        if (!pressedKeys.value.includes(ev.key)) {
            pressedKeys.value.push(ev.key);
        }

        if (INPUT_ELEMENT_TAGS.includes(document.activeElement?.tagName ?? "")) {
            return;
        }

        handlers.value.forEach((h) => {
            if (h.keys.every((k) => pressedKeys.value.includes(k))) {
                executeCommand(h.commandName);
            }
        });
    };

    const handleKeyUp = (ev: KeyboardEvent) => {
        const index = pressedKeys.value.indexOf(ev.key);
        if (index >= 0) {
            pressedKeys.value.splice(index, 1);
        }
    };

    const registerHotkey = (keys: string[], commandName: string) => {
        handlers.value.push({ keys, commandName });
    };

    return { pressedKeys, handleKeyDown, handleKeyUp, registerHotkey };
}
