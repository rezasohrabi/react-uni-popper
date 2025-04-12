import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
  // Theme configuration
  theme: {
    ...themes.light,
    brandTitle: 'Headless-Tooltip',
    brandTarget: '_self', // Opens the link in the same tab
  },
});
