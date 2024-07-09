# MapsDigital NX Workspace Setup

This document explains how to set up the developer environment for the current applications,
and how to create new applications, libraries and generators.

### To generate a new NX app

`yarn nx generate @nx/next:application example-app`

> Options:

- Default stylesheet format: SCSS
- Use App Router: No

### Generate a library

`yarn nx generate @nx/react:library shared/ui`

> Options:

- Default stylesheet format: SCSS
- Use App Router: No

### Set up tailwind

For each app run the set up for tailwind
`yarn nx g @nx/react:setup-tailwind --project=example-app`

Copy the contents of tailwind.config.js file from current moneyhelper tools into a global
`tailwind-workspace-preset.js` file

Add this line to the module.exports section of each apps tailwind.config.js file
`presets: [require('../../tailwind-workspace-preset.js')],`

This allows us to share the tailwind config between apps.

### Set up storybook

Install storybook dependency
`yarn add --dev @nx/storybook`

Generate storybook config
`yarn nx generate @nx/storybook:configuration shared-ui`

> Options:

- Configure a cypress e2e app: No
- Storybook framework: NextJS

### To add a Figma design link to a Story

Here we will use the Button component story as an example.

You can add the design link to the StoryProps to add the link to all variations.

```
const StoryProps = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://link-to-figma-url',
    },
  },
};
```

You can also add a link to a specific variant in a story.

```
export const Primary = Template.bind({});
Primary.args = {
  children: 'Primary',
};
Primary.parameters = {
  design: {
    type: 'figma',
    url: 'https://different-link-to-figma-url',
  },
};
```
