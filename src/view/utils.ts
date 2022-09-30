export function listenWindow<K extends keyof WindowEventMap>(event: K, handler: (e: WindowEventMap[K]) => void) {
    window.addEventListener(event, handler);

    return () => {
        window.removeEventListener<K>(event, handler);
    }
}
