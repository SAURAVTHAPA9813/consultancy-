import React from 'react';
import Icon from '../components/Icon'; // Adjust path to your Icon.jsx
import PublicHeader from '../components/public/PublicHeader'; // Adjust path
import PublicFooter from '../components/public/PublicFooter'; // Adjust path

const PricingPage = () => {
  const [hoveredCard, setHoveredCard] = React.useState(null);
  const [hoveredButton, setHoveredButton] = React.useState(null);
  const [hoveredPayment, setHoveredPayment] = React.useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = React.useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = React.useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState(null);
  const [selectedPlan, setSelectedPlan] = React.useState(null);

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'Forever',
      buttonText: 'Get Started Free',
      features: [
        'Up to 3 projects',
        'Basic dashboard',
        '5GB storage',
        'Community support'
      ],
      isPopular: false
    },
    {
      name: 'Unlimited',
      price: '$12',
      period: 'Per month',
      buttonText: 'Start Free Trial',
      features: [
        'Unlimited projects',
        'Advanced dashboard',
        '100GB storage',
        'Priority support',
        'Custom integrations'
      ],
      isPopular: false
    },
    {
      name: 'Business',
      price: '$29',
      period: 'Per month',
      buttonText: 'Get Started',
      features: [
        'Everything in Unlimited',
        'Team collaboration',
        '500GB storage',
        'Advanced analytics',
        'API access',
        'Custom branding'
      ],
      isPopular: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: 'Per month',
      buttonText: 'Contact Sales',
      features: [
        'Everything in Business',
        'Unlimited storage',
        'Dedicated support',
        'Custom deployment',
        'Advanced security',
        'SLA guarantee'
      ],
      isPopular: false
    }
  ];

  const paymentMethods = {
    wallets: [
      {
        name: 'eSewa',
        icon: 'check',
        description: 'Nepal\'s leading digital wallet',
        features: ['Instant payments', 'QR code support', 'Mobile recharge'],
        processingTime: 'Instant',
        fees: 'No fees'
      },
      {
        name: 'Khalti',
        icon: 'check',
        description: 'Popular digital payment platform',
        features: ['Quick transfers', 'Bill payments', 'Online shopping'],
        processingTime: 'Instant',
        fees: 'No fees'
      },
      {
        name: 'IME Pay',
        icon: 'check',
        description: 'Secure mobile wallet solution',
        features: ['Bank integration', 'International transfers', 'Utility bills'],
        processingTime: 'Instant',
        fees: 'Minimal fees'
      }
    ],
    banking: [
      {
        name: 'NIC Asia',
        icon: 'building-office',
        description: 'Premier banking mobile app',
        features: ['Direct bank transfer', 'Account integration', 'Statement access'],
        processingTime: '1-2 minutes',
        fees: 'Bank charges apply'
      },
      {
        name: 'Nabil Bank',
        icon: 'building-office',
        description: 'Trusted banking solution',
        features: ['Mobile banking', 'Fund transfers', 'Balance inquiry'],
        processingTime: '1-2 minutes',
        fees: 'Bank charges apply'
      },
      {
        name: 'SCB Mobile',
        icon: 'phone',
        description: 'Standard Chartered mobile banking',
        features: ['International support', 'Multi-currency', 'Premium service'],
        processingTime: '1-2 minutes',
        fees: 'Premium rates'
      }
    ],
    international: [
      {
        name: 'PayPal',
        icon: 'globe',
        description: 'Global payment leader',
        features: ['Buyer protection', 'Currency conversion', 'Worldwide acceptance'],
        processingTime: 'Instant',
        fees: '2.9% + $0.30'
      },
      {
        name: 'Stripe',
        icon: 'star',
        description: 'Developer-friendly payments',
        features: ['Advanced security', 'Recurring billing', 'Global coverage'],
        processingTime: 'Instant',
        fees: '2.9% + $0.30'
      },
      {
        name: 'Visa/MC',
        icon: 'credit-card',
        description: 'Credit/Debit card payments',
        features: ['Universal acceptance', 'Fraud protection', 'Instant verification'],
        processingTime: 'Instant',
        fees: '2.5% + $0.30'
      }
    ]
  };

  const paymentHistory = [
    {
      id: 'TXN001',
      date: '2024-03-15',
      plan: 'Business',
      amount: '$29.00',
      method: 'eSewa',
      status: 'Completed',
      invoice: 'INV-2024-001'
    },
    {
      id: 'TXN002',
      date: '2024-02-15',
      plan: 'Business',
      amount: '$29.00',
      method: 'Khalti',
      status: 'Completed',
      invoice: 'INV-2024-002'
    },
    {
      id: 'TXN003',
      date: '2024-01-15',
      plan: 'Unlimited',
      amount: '$12.00',
      method: 'Visa',
      status: 'Completed',
      invoice: 'INV-2024-003'
    }
  ];

  const styles = {
    container: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#fff',
      minHeight: '100vh',
      padding: '4rem 2rem',
      paddingTop: 'calc(72px + 4rem)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#000',
      marginBottom: '0.5rem',
      margin: 0
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#666',
      margin: 0
    },
    pricingSection: {
      width: '100%',
      maxWidth: '1200px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem',
      marginBottom: '2rem'
    },
    card: {
      backgroundColor: '#fff',
      border: '1px solid #eee',
      borderRadius: '1rem',
      padding: '2rem',
      textAlign: 'center',
      position: 'relative',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer'
    },
    cardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    },
    popularCard: {
      border: '2px solid #000',
      boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
    },
    popularBadge: {
      position: 'absolute',
      top: '-12px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#000',
      color: '#fff',
      padding: '0.5rem 1.5rem',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderRadius: '20px'
    },
    planName: {
      fontSize: '1.4rem',
      fontWeight: 'bold',
      color: '#000',
      marginBottom: '1rem',
      marginTop: '0.5rem'
    },
    price: {
      fontSize: '2.4rem',
      fontWeight: 'bold',
      color: '#000',
      lineHeight: '1',
      marginBottom: '0.25rem'
    },
    period: {
      fontSize: '0.9rem',
      color: '#666',
      marginBottom: '2rem'
    },
    button: {
      width: '100%',
      padding: '0.75rem 2rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginBottom: '2rem',
      textTransform: 'none'
    },
    primaryButton: {
      backgroundColor: '#000',
      color: '#fff'
    },
    secondaryButton: {
      backgroundColor: '#fff',
      color: '#000',
      border: '2px solid #000'
    },
    buttonHover: {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
    },
    features: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      textAlign: 'left'
    },
    feature: {
      fontSize: '1rem',
      color: '#333',
      marginBottom: '0.75rem',
      lineHeight: '1.5',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    footer: {
      textAlign: 'center',
      color: '#666',
      fontSize: '0.9rem',
      marginTop: '1rem'
    },
    paymentSection: {
      width: '100%',
      maxWidth: '1000px',
      backgroundColor: '#f9f9f9',
      borderRadius: '1rem',
      padding: '2rem',
      marginTop: '3rem',
      border: '1px solid #eee'
    },
    paymentHeader: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginBottom: '2rem'
    },
    paymentToggleBtn: {
      padding: '1rem 2.5rem',
      backgroundColor: '#f8f9fa',
      color: '#666',
      border: 'none',
      borderRadius: '50px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      minWidth: '180px',
      justifyContent: 'center'
    },
    activeToggleBtn: {
      backgroundColor: '#000',
      color: '#fff',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
      background: 'linear-gradient(135deg, #000 0%, #333 100%)'
    },
    paymentOptionsContainer: {
      backgroundColor: '#fff',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid #ddd'
    },
    historyContainer: {
      backgroundColor: '#fff',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid #ddd'
    },
    paymentMethods: {
      marginTop: '1rem'
    },
    paymentCategory: {
      marginBottom: '2rem'
    },
    categoryTitle: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#333',
      display: 'flex',
      alignItems: 'center'
    },
    paymentCarousel: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
      padding: '0.5rem'
    },
    paymentCard: {
      minWidth: '180px',
      flex: '1',
      maxWidth: '200px'
    },
    paymentIcon: {
      backgroundColor: '#fff',
      border: '2px solid #ddd',
      borderRadius: '12px',
      padding: '1.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      textAlign: 'center'
    },
    paymentIconHover: {
      border: '2px solid #000',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
    },
    iconContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
      position: 'relative'
    },
    paymentLogo: {
      fontSize: '2.5rem',
      marginBottom: '0.5rem',
      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
      transition: 'transform 0.3s ease'
    },
    iconText: {
      fontSize: '0.9rem',
      fontWeight: 'bold',
      color: '#333',
      marginTop: '0.5rem',
      display: 'block'
    },
    iconSubtext: {
      fontSize: '0.75rem',
      color: '#666',
      marginTop: '0.25rem',
      display: 'block'
    },
    selectedIndicator: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      backgroundColor: '#000',
      color: '#fff',
      borderRadius: '50%',
      width: '28px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1rem',
      fontWeight: 'bold',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
    },
    selectedMethodInfo: {
      backgroundColor: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '0',
      borderRadius: '1rem',
      textAlign: 'center',
      marginTop: '2rem',
      border: '2px solid #000',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    },
    selectedMethodCard: {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '1rem',
      margin: '4px',
      textAlign: 'center'
    },
    selectedIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
      display: 'flex',
      justifyContent: 'center'
    },
    selectedText: {
      fontSize: '1.1rem',
      color: '#333',
      marginBottom: '1.5rem',
      margin: '0 0 1.5rem 0'
    },
    proceedSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.75rem'
    },
    proceedButton: {
      backgroundColor: '#000',
      color: '#fff',
      border: 'none',
      padding: '1rem 2.5rem',
      borderRadius: '30px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    securityNote: {
      fontSize: '0.85rem',
      color: '#666',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    historyTable: {
      backgroundColor: '#fff',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      border: '1px solid #ddd'
    },
    tableHeader: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr 1fr 0.8fr 0.8fr 0.8fr',
      backgroundColor: '#000',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '0.9rem'
    },
    tableHeaderCell: {
      padding: '1rem 0.5rem',
      textAlign: 'center',
      borderRight: '1px solid #333'
    },
    tableRow: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr 1fr 0.8fr 0.8fr 0.8fr',
      borderBottom: '1px solid #eee',
      transition: 'background-color 0.2s ease'
    },
    tableCell: {
      padding: '1rem 0.5rem',
      textAlign: 'center',
      fontSize: '0.85rem',
      borderRight: '1px solid #eee',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    statusBadge: {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '0.25rem 0.75rem',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: 'bold'
    },
    downloadBtn: {
      backgroundColor: '#f8f9fa',
      color: '#000',
      border: '1px solid #ddd',
      padding: '0.4rem 0.8rem',
      borderRadius: '15px',
      fontSize: '0.75rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    historyFooter: {
      textAlign: 'center',
      marginTop: '1.5rem',
      paddingTop: '1.5rem',
      borderTop: '1px solid #eee'
    },
    historyNote: {
      fontSize: '0.9rem',
      color: '#666',
      margin: 0
    },
    supportLink: {
      color: '#000',
      fontWeight: 'bold',
      textDecoration: 'none'
    },
    selectedPayment: {
      backgroundColor: '#000',
      color: '#fff',
      borderColor: '#000'
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentOptions(true);
    setShowPaymentHistory(false);
  };

  const handlePaymentSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  return (
    <>
      <PublicHeader />
      
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Choose Your Plan</h1>
          <p style={styles.subtitle}>Select the perfect plan for your study abroad journey</p>
        </div>

        <div style={styles.pricingSection}>
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              style={{
                ...styles.card,
                ...(plan.isPopular ? styles.popularCard : {}),
                ...(hoveredCard === index ? styles.cardHover : {})
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handlePlanSelect(plan)}
            >
              {plan.isPopular && (
                <div style={styles.popularBadge}>Most Popular</div>
              )}
              
              <h3 style={styles.planName}>{plan.name}</h3>
              <div style={styles.price}>{plan.price}</div>
              <div style={styles.period}>{plan.period}</div>
              
              <button
                style={{
                  ...styles.button,
                  ...(plan.isPopular ? styles.primaryButton : styles.secondaryButton),
                  ...(hoveredButton === index ? styles.buttonHover : {})
                }}
                onMouseEnter={() => setHoveredButton(index)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                {plan.buttonText}
              </button>
              
              <ul style={styles.features}>
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} style={styles.feature}>
                    <Icon name="check" size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={styles.paymentSection}>
          <div style={styles.paymentHeader}>
            <button
              style={{
                ...styles.paymentToggleBtn,
                ...(showPaymentOptions ? styles.activeToggleBtn : {})
              }}
              onClick={() => {
                setShowPaymentOptions(!showPaymentOptions);
                setShowPaymentHistory(false);
              }}
            >
              <Icon name="credit-card" size={16} />
              Payment Options
            </button>
            <button
              style={{
                ...styles.paymentToggleBtn,
                ...(showPaymentHistory ? styles.activeToggleBtn : {})
              }}
              onClick={() => {
                setShowPaymentHistory(!showPaymentHistory);
                setShowPaymentOptions(false);
              }}
            >
              <Icon name="documents" size={16} />
              Payment History
            </button>
          </div>

          {showPaymentOptions && (
            <div style={styles.paymentOptionsContainer}>
              <h3>Choose Your Payment Method</h3>
              <p>Select from multiple secure payment options</p>
              
              <div style={styles.paymentMethods}>
                <div style={styles.paymentCategory}>
                  <h4 style={styles.categoryTitle}>
                    <Icon name="check" size={16} style={{ marginRight: '0.5rem' }} />
                    Digital Wallets
                  </h4>
                  <div style={styles.paymentCarousel}>
                    {paymentMethods.wallets.map((method, idx) => (
                      <div key={idx} style={styles.paymentCard}>
                        <div 
                          style={{
                            ...styles.paymentIcon,
                            ...(hoveredPayment === `wallet-${idx}` ? styles.paymentIconHover : {}),
                            ...(selectedPaymentMethod === `wallet-${method.name}` ? styles.selectedPayment : {})
                          }}
                          onMouseEnter={() => setHoveredPayment(`wallet-${idx}`)}
                          onMouseLeave={() => setHoveredPayment(null)}
                          onClick={() => handlePaymentSelect(`wallet-${method.name}`)}
                        >
                          <div style={styles.iconContainer}>
                            <div style={styles.paymentLogo}>
                              <Icon name={method.icon} size={32} />
                            </div>
                            <span style={styles.iconText}>{method.name}</span>
                            <span style={styles.iconSubtext}>Digital Wallet</span>
                          </div>
                          {selectedPaymentMethod === `wallet-${method.name}` && (
                            <div style={styles.selectedIndicator}>
                              <Icon name="check" size={14} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.paymentCategory}>
                  <h4 style={styles.categoryTitle}>
                    <Icon name="building-office" size={16} style={{ marginRight: '0.5rem' }} />
                    Mobile Banking
                  </h4>
                  <div style={styles.paymentCarousel}>
                    {paymentMethods.banking.map((method, idx) => (
                      <div key={idx} style={styles.paymentCard}>
                        <div 
                          style={{
                            ...styles.paymentIcon,
                            ...(hoveredPayment === `bank-${idx}` ? styles.paymentIconHover : {}),
                            ...(selectedPaymentMethod === `bank-${method.name}` ? styles.selectedPayment : {})
                          }}
                          onMouseEnter={() => setHoveredPayment(`bank-${idx}`)}
                          onMouseLeave={() => setHoveredPayment(null)}
                          onClick={() => handlePaymentSelect(`bank-${method.name}`)}
                        >
                          <div style={styles.iconContainer}>
                            <div style={styles.paymentLogo}>
                              <Icon name={method.icon} size={32} />
                            </div>
                            <span style={styles.iconText}>{method.name}</span>
                            <span style={styles.iconSubtext}>Mobile Banking</span>
                          </div>
                          {selectedPaymentMethod === `bank-${method.name}` && (
                            <div style={styles.selectedIndicator}>
                              <Icon name="check" size={14} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.paymentCategory}>
                  <h4 style={styles.categoryTitle}>
                    <Icon name="globe" size={16} style={{ marginRight: '0.5rem' }} />
                    International
                  </h4>
                  <div style={styles.paymentCarousel}>
                    {paymentMethods.international.map((method, idx) => (
                      <div key={idx} style={styles.paymentCard}>
                        <div 
                          style={{
                            ...styles.paymentIcon,
                            ...(hoveredPayment === `intl-${idx}` ? styles.paymentIconHover : {}),
                            ...(selectedPaymentMethod === `intl-${method.name}` ? styles.selectedPayment : {})
                          }}
                          onMouseEnter={() => setHoveredPayment(`intl-${idx}`)}
                          onMouseLeave={() => setHoveredPayment(null)}
                          onClick={() => handlePaymentSelect(`intl-${method.name}`)}
                        >
                          <div style={styles.iconContainer}>
                            <div style={styles.paymentLogo}>
                              <Icon name={method.icon} size={32} />
                            </div>
                            <span style={styles.iconText}>{method.name}</span>
                            <span style={styles.iconSubtext}>Global Payment</span>
                          </div>
                          {selectedPaymentMethod === `intl-${method.name}` && (
                            <div style={styles.selectedIndicator}>
                              <Icon name="check" size={14} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedPaymentMethod && selectedPlan && (
                <div style={styles.selectedMethodInfo}>
                  <div style={styles.selectedMethodCard}>
                    <div style={styles.selectedIcon}>
                      <Icon name="check" size={48} />
                    </div>
                    <p style={styles.selectedText}>
                      Payment Method Selected: <strong>{selectedPaymentMethod.split('-')[1]}</strong>
                    </p>
                    <div style={styles.proceedSection}>
                      <button style={styles.proceedButton}>
                        <Icon name="arrow-right" size={16} />
                        Proceed with {selectedPaymentMethod.split('-')[1]} - {selectedPlan.price}
                      </button>
                      <p style={styles.securityNote}>
                        <Icon name="shield-check" size={16} />
                        Secured with 256-bit SSL encryption
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {showPaymentHistory && (
            <div style={styles.historyContainer}>
              <h3>Payment History & Receipts</h3>
              <p>View your transaction history and download receipts</p>
              
              <div style={styles.historyTable}>
                <div style={styles.tableHeader}>
                  <div style={styles.tableHeaderCell}>Transaction ID</div>
                  <div style={styles.tableHeaderCell}>Date</div>
                  <div style={styles.tableHeaderCell}>Plan</div>
                  <div style={styles.tableHeaderCell}>Amount</div>
                  <div style={styles.tableHeaderCell}>Status</div>
                  <div style={styles.tableHeaderCell}>Receipt</div>
                </div>
                
                {paymentHistory.map((payment) => (
                  <div key={payment.id} style={styles.tableRow}>
                    <div style={styles.tableCell}>{payment.id}</div>
                    <div style={styles.tableCell}>{payment.date}</div>
                    <div style={styles.tableCell}>{payment.plan}</div>
                    <div style={styles.tableCell}><strong>{payment.amount}</strong></div>
                    <div style={styles.tableCell}>
                      <span style={styles.statusBadge}>{payment.status}</span>
                    </div>
                    <div style={styles.tableCell}>
                      <button style={styles.downloadBtn}>
                        <Icon name="download" size={14} />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.historyFooter}>
                <p style={styles.historyNote}>
                  Need help with a payment? <a href="#support" style={styles.supportLink}>Contact Support</a>
                </p>
              </div>
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <p>All plans include 30-day money-back guarantee • Cancel anytime • No hidden fees</p>
        </div>
      </div>

      <PublicFooter />
    </>
  );
};

export default PricingPage;