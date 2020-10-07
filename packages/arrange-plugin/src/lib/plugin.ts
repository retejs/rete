import { AutoArrange } from './auto-arrange';
import { ArrangeOptions } from './interfaces/arrange-options.interface';

export const ArrangePlugin = {
  name: 'auto-arrange',
  install,
};

export function install(
  editor,
  { margin = { x: 50, y: 50 }, depth = null, vertical = false }: ArrangeOptions
) {
  editor.bind('arrange');

  const autoArrange = new AutoArrange(editor, margin, depth, vertical);
  editor.on('arrange', ({ node }) => autoArrange.arrange(node));
}
