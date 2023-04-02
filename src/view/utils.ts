export function listenWindow<K extends keyof WindowEventMap>(event: K, handler: (e: WindowEventMap[K]) => void) {
    window.addEventListener(event, handler);

    return () => {
        window.removeEventListener<K>(event, handler);
    }
}


export function getOffset(el: HTMLElement, offsetParentEl: HTMLElement, searchDepth = 8) {
    let x = el.offsetLeft;
    let y = el.offsetTop;
    let parent = el.offsetParent as HTMLElement | null;

    while (parent && parent !== offsetParentEl && searchDepth > 0) {
        searchDepth--;
        x += parent.offsetLeft;
        y += parent.offsetTop;
        parent = parent.offsetParent as HTMLElement | null;
    }

    return { x, y };
}