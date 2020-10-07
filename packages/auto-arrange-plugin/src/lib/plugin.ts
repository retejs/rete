import { AutoArrange } from './auto-arrange';

export const AutoArrangePlugin = {
  name: 'auto-arrange',
  install,
};

export function install(
  editor,
  { margin = { x: 50, y: 50 }, depth = null, vertical = false }
) {
  editor.bind('arrange');

  const ar = new AutoArrange(editor, margin, depth, vertical);

  editor.on('arrange', ({ node }) => ar.arrange(node));

  editor.arrange = (node) => {
    console.log(`Deprecated: use editor.trigger('arrange', { node }) instead`);
    ar.arrange(node);
  };
}
