import React from 'react';
import { Location } from './Location';

export default {
  title: 'Blocks/Location',
  component: Location,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    heading: { control: 'text' },
    subHeading: { control: 'text' },
    // Simplified controls for arrays
  },
};

const Template = (args) => <Location {...args} />;

export const Default = Template.bind({});
Default.args = {
  heading: "Visit Apostle, Pastor Gino Jennings",
  subHeading: "International Headquarters Campus",
  addressLines: [
    "First Church of Our Lord Jesus Christ",
    "5105 N. 5th Street",
    "Philadelphia, PA. 19120"
  ],
  schedule: [
    { label: "Tuesday", time: "@ 7pm" },
    { label: "Thursday", time: "@ 7pm" },
    { label: "Sunday", time: "11am & 5pm" }
  ],
  mapEmbedIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3056.592523287664!2d-75.12937992426338!3d40.0211649715053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6b7bd167732d9%3A0xe54523774880562b!2s5105%20N%205th%20St%2C%20Philadelphia%2C%20PA%2019120!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
};

export const MobileView = Template.bind({});
MobileView.parameters = {
  viewport: {
    defaultViewport: 'mobile1',
  },
};
MobileView.args = {
  ...Default.args
};
