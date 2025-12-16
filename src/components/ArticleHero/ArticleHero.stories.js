import { ArticleHero } from './ArticleHero';

export default {
    title: 'Components/ArticleHero',
    component: ArticleHero,
    argTypes: {
        variant: {
             control: { type: 'select', options: ['standard', 'immersive'] }
        },
        title: { control: 'text' },
        category: { control: 'text' },
        imageUrl: { control: 'text' }
    }
};

const Template = (args) => <ArticleHero {...args} />;

export const Standard = Template.bind({});
Standard.args = {
    title: 'The Divine Authority of the Scriptures',
    date: 'November 14, 2025',
    author: 'Pastor Gino Jennings',
    category: 'Doctrines',
    variant: 'standard',
    imageUrl: 'https://placehold.co/1200x600/222/gold?text=Standard+Hero+Image'
};

export const Immersive = Template.bind({});
Immersive.args = {
    title: 'Walking in the Light of Truth',
    date: 'December 25, 2025',
    author: 'Apostle Jennings',
    category: 'Sermons',
    variant: 'immersive',
    imageUrl: 'https://placehold.co/1600x900/1a1a1a/gold?text=Immersive+Background'
};

export const NoImage = Template.bind({});
NoImage.args = {
    ...Standard.args,
    imageUrl: null,
    title: 'A Simple text-only Article Header'
};
