import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import type { StorybookConfig } from '@storybook/nextjs';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: [
    '../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    '../../pwd/src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    '../../form/src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    '../../layouts/src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    '../../vendor/src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    '../../core/src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    '../../pension-tools/src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    '../../../../apps/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
  ],

  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-designs'),
    getAbsolutePath('@storybook/addon-docs'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/nextjs'),
    options: {},
  },

  core: {
    disableTelemetry: true, // 👈 Disables telemetry
  },

  staticDirs: ['../src/public'],

  webpackFinal: async (config: any) => {
    // Default rule for images /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/
    const fileLoaderRule = config.module.rules.find(
      (rule: any) => rule.test && rule.test.test('.svg'),
    );
    fileLoaderRule.exclude = /\.svg$/;
    config.module.rules.push({
      test: /\.svg$/,
      enforce: 'pre',
      loader: require.resolve('@svgr/webpack'),
    });

    return config;
  },

  docs: {},

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/packages/storybook/documents/custom-builder-configs

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
