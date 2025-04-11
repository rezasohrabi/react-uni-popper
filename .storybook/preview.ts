import type { Preview } from '@storybook/react';
import { themes } from '@storybook/theming';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    versions: {
      current: 'v0',
      previous: [
        { name: 'v0', url: 'https://rezasohrabi.github.io/headless-tooltip' },
      ],
    },
    docs: {
      theme: themes.light,
    },
  },
};

export default preview;
