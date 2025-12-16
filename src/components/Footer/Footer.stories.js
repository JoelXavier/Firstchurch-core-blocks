import React from 'react';
import { Footer } from './Footer';

export default {
    title: 'Components/Footer',
    component: Footer,
    parameters: {
        layout: 'fullscreen',
        backgrounds: {
            default: 'light',
        },
    },
};

const Template = (args) => <Footer {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const CustomMission = Template.bind({});
CustomMission.args = {
    missionText: "Empowering our community through faith, hope, and love since 1924.",
    copyrightText: "© 2025 First Church. Built with ❤️."
};
