/**
 * Adds a custom class based on the background value
 */
export class Background {
  constructor(editor, element) {
    const el = document.createElement('div');
    el.classList.add(element, 'default');
    editor.view.area.appendChild(el);
  }
}
