import React from 'react';
import { Fundraiser } from './Fundraiser';

export default {
    title: 'Components/Fundraiser',
    component: Fundraiser,
    argTypes: {
        title: { control: 'text' },
        goalAmount: { control: 'number' },
        raisedAmount: { control: 'number' },
        linkText: { control: 'text' },
        linkUrl: { control: 'text' },
    }
};

const Template = (args) => <Fundraiser {...args} />;

export const Default = Template.bind({});
Default.args = {
    title: "FC Convention Center Fundraiser",
    goalAmount: 5000000,
    raisedAmount: 1644394,
    linkText: "Donate to FC Convention Center Fundraiser",
};

export const NearGoal = Template.bind({});
NearGoal.args = {
    ...Default.args,
    raisedAmount: 4800000,
};

export const JustStarted = Template.bind({});
JustStarted.args = {
    ...Default.args,
    raisedAmount: 250000,
};
