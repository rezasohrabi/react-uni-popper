import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
  // Theme configuration
  theme: {
    ...themes.light,
    brandTitle: 'Headless-Tooltip',
    brandUrl: 'https://github.com/rezasohrabi/headless-tooltip',
    brandImage:
      'https://rezasohrabi.github.io/headless-tooltip/headless-tooltip.png',
    brandTarget: '_self', // Opens the link in the same tab
  },
});
