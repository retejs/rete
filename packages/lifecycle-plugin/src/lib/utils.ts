import { NodeEditor } from '@naetverkjs/naetverk';

export function getHook<T extends unknown>(
  editor: NodeEditor,
  name: undefined | string,
  method: keyof T
) {
  if (!name) return () => null;

  const component = editor.getComponent(name);

  if (method in component) {
    const c = component as T;

    return c[method];
  }

  return () => null;
}
