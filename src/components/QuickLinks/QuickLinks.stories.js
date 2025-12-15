import React from 'react';
import { QuickLinks } from './QuickLinks';

export default {
    title: 'Components/Quick Links',
    component: QuickLinks,
    argTypes: {
        title: { control: 'text' },
    }
};

const Template = (args) => <QuickLinks {...args} />;

export const Default = Template.bind({});
Default.args = {
    title: "Quick Links",
    links: [
        { id: 1, label: "TOG Times", image: "https://via.placeholder.com/100/581c1c/FFD700?text=TOG", url: "#" },
        { id: 2, label: "FC Medical Unit", image: "https://via.placeholder.com/100/581c1c/FFD700?text=MED", url: "#" },
        { id: 3, label: "FC ByLaws", image: "https://via.placeholder.com/100/581c1c/FFD700?text=LAW", url: "#" }
    ]
};
