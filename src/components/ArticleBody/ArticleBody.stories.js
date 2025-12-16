import { ArticleBody } from './ArticleBody';

export default {
    title: 'Components/ArticleBody',
    component: ArticleBody,
};

const dummyText = (
    <>
        <p>In the beginning was the Word, and the Word was with God, and the Word was God. The same was in the beginning with God. All things were made by him; and without him was not any thing made that was made. In him was life; and the life was the light of men.</p>
        <p>This light shineth in darkness; and the darkness comprehended it not. There was a man sent from God, whose name was John. The same came for a witness, to bear witness of the Light, that all men through him might believe.</p>
        <p>He was not that Light, but was sent to bear witness of that Light. That was the true Light, which lighteth every man that cometh into the world.</p>
        <h3>The Authority of Truth</h3>
        <p>He was in the world, and the world was made by him, and the world knew him not. He came unto his own, and his own received him not. But as many as received him, to them gave he power to become the sons of God, even to them that believe on his name.</p>
    </>
);

const Template = (args) => <ArticleBody {...args} >{dummyText}</ArticleBody>;

export const Default = Template.bind({});
Default.args = {
    author: {
        name: "Pastor Gino Jennings",
        team: "General Overseer",
        location: "Philadelphia Headquarters",
        imageUrl: "https://placehold.co/200x200/222/gold?text=GJ"
    }
};

export const MobileView = Template.bind({});
MobileView.parameters = {
    viewport: { defaultViewport: 'mobile1' }
};
MobileView.args = {
    ...Default.args
};
