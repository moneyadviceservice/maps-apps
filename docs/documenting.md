## Storybook

```bash
# Run Storybook locally
npm run storybook
```

Open your browser and navigate to <http://localhost:4400/>

**Production Storybook:**
When a pull request is merged to main, Storybook is automatically deployed and can be viewed at:
<https://main--65c4bdbe9bcdf2e1145a3b6a.chromatic.com>

### Adding Figma Design Links to Stories

```javascript
// Add to all story variations
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

// Add to specific story variant
export const Primary = Template.bind({});
Primary.parameters = {
  design: {
    type: 'figma',
    url: 'https://different-link-to-figma-url',
  },
};
```
