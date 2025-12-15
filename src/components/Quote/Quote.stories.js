import { Quote } from './Quote';

export default {
  title: 'Blocks/Quote',
  component: Quote,
  argTypes: {
    layout: {
      control: { type: 'select' },
      options: ['center', 'side-line'],
    },
    quote: { control: 'text' },
    citation: { control: 'text' },
  },
};

const Template = (args) => <Quote {...args} />;

export const CenterRegal = Template.bind({});
CenterRegal.args = {
  quote: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
  citation: "John 3:16",
  layout: "side-line",
  variant: "card"
};

export const StatementNoIcon = Template.bind({});
StatementNoIcon.args = {
  quote: "This is a general statement or announcement that doesn't require a large decorative quote mark.",
  citation: "The Management",
  layout: "center",
  variant: "card",
  showIcon: false
};

export const SideLineStrong = Template.bind({});
SideLineStrong.args = {
  quote: "In the beginning was the Word, and the Word was with God, and the Word was God.",
  citation: "John 1:1",
  layout: "side-line"
};
