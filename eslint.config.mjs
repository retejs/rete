import tseslint from 'typescript-eslint';
import configs from 'rete-cli/configs/eslint.mjs';

export default tseslint.config(
  ...configs
)