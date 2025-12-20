import { __ } from '@wordpress/i18n';
import { 
    useBlockProps, 
    InspectorControls, 
    RichText 
} from '@wordpress/block-editor';
import { 
    PanelBody, 
    TextControl,
    Button
} from '@wordpress/components';
import { useState } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
    const { 
        amounts = [10, 25, 50, 75, 100, 250, 500, 1000, 2000], 
        defaultAmount = 100, 
        buttonText = 'Donate now',
        title = 'How much would you like to donate today?',
        subtitle = 'All donations directly impact our organization and help us further our mission.',
        donorTitle = "Who's Donating Today?",
        donorSubtitle = "We'll never share this information with anyone and we sincerely thank you.",
        paymentTitle = "Payment Details",
        paymentSubtitle = "How would you like to pay for your donation?"
    } = attributes;

    const [selectedAmount, setSelectedAmount] = useState(defaultAmount);
    const [customAmount, setCustomAmount] = useState('');

    const blockProps = useBlockProps({
        className: 'fc-donation-payment'
    });

    const activeAmount = customAmount || selectedAmount;

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Donation Settings', 'first-church-core-blocks')}>
                    <TextControl
                        label={__('Button Text', 'first-church-core-blocks')}
                        value={buttonText}
                        onChange={(val) => setAttributes({ buttonText: val })}
                    />
                    
                    <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
                        <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                            {__('Preset Amounts', 'first-church-core-blocks')}
                        </label>
                        {amounts.map((amt, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <TextControl
                                    type="number"
                                    value={amt}
                                    onChange={(val) => {
                                        const newAmounts = [...amounts];
                                        newAmounts[idx] = parseInt(val) || 0;
                                        setAttributes({ amounts: newAmounts });
                                    }}
                                    style={{ marginBottom: 0, flex: 1 }}
                                />
                                <Button 
                                    isSmall 
                                    isDestructive 
                                    onClick={() => {
                                        const newAmounts = amounts.filter((_, i) => i !== idx);
                                        setAttributes({ amounts: newAmounts });
                                    }}
                                >
                                    &times;
                                </Button>
                            </div>
                        ))}
                        <Button 
                            isSecondary
                            isSmall
                            onClick={() => setAttributes({ amounts: [...amounts, 0] })}
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            {__('Add Amount', 'first-church-core-blocks')}
                        </Button>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <TextControl
                            label={__('Default Selected Amount', 'first-church-core-blocks')}
                            type="number"
                            value={defaultAmount}
                            onChange={(val) => setAttributes({ defaultAmount: parseInt(val) || 0 })}
                        />
                    </div>
                </PanelBody>
            </InspectorControls>

            <div { ...blockProps }>
                <div className="fc-donation-payment__container">
                    
                    {/* Amount Selection Section */}
                    <div className="fc-donation-payment__section">
                        <RichText
                            tagName="h2"
                            className="fc-donation-payment__section-title"
                            value={ title }
                            onChange={ ( val ) => setAttributes( { title: val } ) }
                            placeholder={ __( 'Enter title...', 'first-church-core-blocks' ) }
                        />
                        <RichText
                            tagName="p"
                            className="fc-donation-payment__section-subtitle"
                            value={ subtitle }
                            onChange={ ( val ) => setAttributes( { subtitle: val } ) }
                            placeholder={ __( 'Enter description...', 'first-church-core-blocks' ) }
                        />
                        
                        <div className="fc-donation-payment__amount-grid">
                            {amounts.map((amt) => (
                                <button 
                                    key={amt}
                                    className={`fc-donation-payment__amount-btn ${activeAmount === amt ? 'is-selected' : ''}`}
                                    onClick={() => {
                                        setSelectedAmount(amt);
                                        setCustomAmount('');
                                    }}
                                >
                                    ${amt.toLocaleString()}.00
                                </button>
                            ))}
                        </div>

                        <div className="fc-donation-payment__custom-amount">
                            <input 
                                type="text" 
                                placeholder="Enter custom amount" 
                                value={customAmount}
                                onChange={(e) => {
                                    setCustomAmount(e.target.value);
                                    setSelectedAmount(null);
                                }}
                                className="fc-donation-payment__input"
                            />
                        </div>
                    </div>

                    {/* Donor Information Section */}
                    <div className="fc-donation-payment__section">
                        <RichText
                            tagName="h3"
                            className="fc-donation-payment__sub-title"
                            value={ donorTitle }
                            onChange={ ( val ) => setAttributes( { donorTitle: val } ) }
                            placeholder={ __( 'Enter section title...', 'first-church-core-blocks' ) }
                        />
                        <RichText
                            tagName="p"
                            className="fc-donation-payment__section-subtitle"
                            value={ donorSubtitle }
                            onChange={ ( val ) => setAttributes( { donorSubtitle: val } ) }
                            placeholder={ __( 'Enter section description...', 'first-church-core-blocks' ) }
                        />
                        
                        <div className="fc-donation-payment__form-grid">
                            <div className="fc-donation-payment__field">
                                <label>First name *</label>
                                <input type="text" placeholder="John" disabled />
                            </div>
                            <div className="fc-donation-payment__field">
                                <label>Last name</label>
                                <input type="text" placeholder="Doe" disabled />
                            </div>
                        </div>
                        <div className="fc-donation-payment__field">
                            <label>Email Address *</label>
                            <input type="email" placeholder="john@example.com" disabled />
                        </div>
                    </div>

                    {/* Payment Details Section */}
                    <div className="fc-donation-payment__section">
                        <RichText
                            tagName="h3"
                            className="fc-donation-payment__sub-title"
                            value={ paymentTitle }
                            onChange={ ( val ) => setAttributes( { paymentTitle: val } ) }
                            placeholder={ __( 'Enter section title...', 'first-church-core-blocks' ) }
                        />
                        <RichText
                            tagName="p"
                            className="fc-donation-payment__section-subtitle"
                            value={ paymentSubtitle }
                            onChange={ ( val ) => setAttributes( { paymentSubtitle: val } ) }
                            placeholder={ __( 'Enter section description...', 'first-church-core-blocks' ) }
                        />

                        <div className="fc-donation-payment__summary-box">
                            <h4 className="fc-donation-payment__summary-title">Donation Summary</h4>
                            <div className="fc-donation-payment__summary-row">
                                <span>Payment Amount</span>
                                <span>${activeAmount ? parseFloat(activeAmount).toLocaleString(undefined, {minimumFractionDigits: 2}) : '0.00'}</span>
                            </div>
                            <div className="fc-donation-payment__summary-row">
                                <span>Giving Frequency</span>
                                <span>One time</span>
                            </div>
                            <div className="fc-donation-payment__summary-total">
                                <span>Donation Total</span>
                                <span>${activeAmount ? parseFloat(activeAmount).toLocaleString(undefined, {minimumFractionDigits: 2}) : '0.00'}</span>
                            </div>
                        </div>

                        {/* Payment Method Placeholder */}
                        <div className="fc-donation-payment__method-selector">
                            <input type="radio" checked readOnly />
                            <span>Donate with Authorized.Net - Credit Cards</span>
                        </div>

                        <div className="fc-donation-payment__cc-fields">
                             <div className="fc-donation-payment__field">
                                <label>Credit Card Info *</label>
                                <div className="fc-donation-payment__cc-input-mock">
                                    <span>Card number</span>
                                    <span>MM/YY CVC</span>
                                </div>
                            </div>
                        </div>

                        <div className="fc-donation-payment__submit">
                            <button className="fc-donation-payment__submit-btn">
                                {buttonText}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
