import { EventCard } from './EventCard';

export default {
    title: 'Components/EventCard',
    component: EventCard,
    argTypes: {
        title: { control: 'text' },
        label: { control: 'text' },
        location: { control: 'text' },
        startDate: { control: 'date' },
        isCanceled: { control: 'boolean' },
    },
};

const Template = (args) => <EventCard {...args} />;

export const Default = Template.bind({});
Default.args = {
    title: 'The Holy Convocation 2025',
    label: 'Convocation',
    location: 'Philadelphia, PA',
    startDate: '2025-10-12T19:00:00',
    endDate: '2025-10-15T12:00:00',
    location: 'Liacouras Center',
    linkText: 'Get Tickets'
};

export const WithImage = Template.bind({});
WithImage.args = {
    ...Default.args,
    mediaUrl: 'https://via.placeholder.com/300x200',
};

export const Canceled = Template.bind({});
Canceled.args = {
    ...Default.args,
    isCanceled: true,
};

export const MobileView = Template.bind({});
MobileView.args = Default.args;
MobileView.parameters = {
    viewport: { defaultViewport: 'mobile1' },
};

export const MultiDaySchedule = Template.bind({});
MultiDaySchedule.args = {
    ...Default.args,
    title: 'Leadership Summit',
    schedule: [
        'Friday, Oct 12: 7:00 PM - Opening Night',
        'Saturday, Oct 13: 10:00 AM - Morning Glory',
        'Sunday, Oct 14: 6:00 PM - Grand Finale'
    ]
};

// New Story: The Card in its intended Section Context
export const InContext = Template.bind({});
InContext.args = {
    ...Default.args,
    title: "North Eastern Holy Convocation"
};
InContext.decorators = [
    (Story) => (
        <section style={{ 
            width: '100%', 
            padding: 'var(--spacing-64) var(--wp--layout--margin)', // Standard Design System Pattern
            boxSizing: 'border-box'
        }}>
            {/* The "Regal" Header Mockup */}
            <div style={{ marginBottom: 'var(--spacing-48)', maxWidth: '800px' }}>
                <h2 style={{
                    fontFamily: 'var(--wp--preset--font-family--playfair-display)',
                    fontSize: 'var(--wp--preset--font-size--h2)',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    color: 'var(--wp--preset--color--burgundy)',
                    margin: '0 0 var(--spacing-24) 0'
                }}>
                    Upcoming Events
                </h2>
                <div style={{
                    width: '60px',
                    height: '4px',
                    backgroundColor: 'var(--wp--preset--color--divine-gold)',
                    margin: 0
                }}></div>
                <p style={{
                    fontFamily: 'var(--wp--preset--font-family--inter)',
                    fontSize: 'var(--wp--preset--font-size--body)',
                    color: 'var(--wp--preset--color--neutral-600)',
                    marginTop: 'var(--spacing-24)',
                    maxWidth: '600px',
                    lineHeight: 1.5
                }}>
                    This shows how the card renders inside the standard section container, constrained by margins.
                </p>
            </div>

            {/* The Card Container - Stacked Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <Story />
                <Story />
                <Story />
            </div>
        </section>
    ),
];
