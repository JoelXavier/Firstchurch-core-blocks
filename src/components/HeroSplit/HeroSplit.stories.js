import React from 'react';
import { HeroSplit } from './HeroSplit';

export default {
    title: 'Components/Hero Split',
    component: HeroSplit,
    argTypes: {
        imagePosition: {
            control: { type: 'select' },
            options: ['left', 'right'],
        },
        backgroundColor: { control: 'color' },
        textColor: { control: 'color' },
        linkColor: { control: 'color' },
    }
};

const Template = (args) => <HeroSplit {...args} />;

export const Default = Template.bind({});
Default.args = {
    label: "Label",
    title: "Visit Apostle, Pastor Gino Jennings In The City Of Philadelphia",
    imageSrc: "https://via.placeholder.com/800x800",
    imagePosition: "left",
    backgroundColor: "#1a1a1a",
    textColor: "#f1eadd",
    linkColor: "#ffffff"
};

export const ImageRight = Template.bind({});
ImageRight.args = {
    ...Default.args,
    imagePosition: "right",
    title: "Experience the Conference"
};

export const LightTheme = Template.bind({});
LightTheme.args = {
    ...Default.args,
    backgroundColor: "#f1eadd", // Sandwood
    textColor: "#1a1a1a", // Dark
    linkColor: "#581c1c"  // Burgundy
};
