import React from 'react';
import { CardItem, CardGrid } from './Card';

export default {
    title: 'Components/Card',
    component: CardItem,
    argTypes: {
        label: { control: 'text' },
        title: { control: 'text' },
        linkText: { control: 'text' },
        image: { control: 'text' }, // URL
    }
};

const Template = (args) => (
    <CardGrid>
        <CardItem {...args} />
        <CardItem {...args} title="Another Great Event In The City Of Brotherly Love" />
        <CardItem {...args} title="Visit The Temple" label="LOCATION" />
    </CardGrid>
);

export const Default = Template.bind({});
Default.args = {
    label: 'LABEL',
    title: 'Visit Apostle, Pastor Gino Jennings In The City Of Philadelphia',
    linkText: 'LEARN MORE >',
    image: 'https://placehold.co/600x338/png', // 16:9 placeholder
    href: '#'
};

export const NoImage = Template.bind({});
NoImage.args = {
    ...Default.args,
    image: null
};
