import { AuthorCard } from './AuthorCard';

export default {
    title: 'Components/AuthorCard',
    component: AuthorCard,
    argTypes: {
        name: { control: 'text' },
        team: { control: 'text' },
        location: { control: 'text' },
        imageUrl: { control: 'text' }
    }
};

const Template = (args) => <AuthorCard {...args} />;

export const Default = Template.bind({});
Default.args = {
    name: 'Brother Joel Guerrero',
    team: 'IT Team',
    location: 'Bronx Temple',
    imageUrl: 'https://placehold.co/200x200/222/gold?text=JG'
};

export const NoImage = Template.bind({});
NoImage.args = {
    name: 'Editorial Staff',
    team: 'Content Team',
    location: 'Headquarters',
    imageUrl: null
};
