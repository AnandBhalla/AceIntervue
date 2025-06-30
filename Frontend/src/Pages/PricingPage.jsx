import React, { useState } from 'react';
import '../styles/PricingPage.css';

const PricingPage = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packageOptions, setPackageOptions] = useState({});

  const packages = [
    {
      id: 'interview',
      name: 'Interview Package',
      description: 'Perfect for job interview preparation',
      basePrice: 29,
      options: {
        questions: [
          { value: '3q', label: '3 Questions', price: 0 },
          { value: '5q', label: '5 Questions', price: 10 },
          { value: '10q', label: '10 Questions', price: 20 }
        ],
        type: [
          { value: 'audio', label: 'Audio Only', price: 0 },
          { value: 'video', label: 'Video Interview', price: 15 }
        ],
        analysis: [
          { value: 'basic', label: 'Basic Analysis', price: 0 },
          { value: 'detailed', label: 'Detailed Analysis', price: 12 }
        ]
      }
    },
    {
      id: 'resume',
      name: 'Resume Package',
      description: 'AI-powered resume building and optimization',
      basePrice: 19,
      options: {
        templates: [
          { value: 'basic', label: '5 Templates', price: 0 },
          { value: 'premium', label: '15 Templates', price: 8 },
          { value: 'ultimate', label: 'All Templates', price: 15 }
        ],
        analysis: [
          { value: 'standard', label: 'Standard Review', price: 0 },
          { value: 'expert', label: 'Expert Review', price: 20 }
        ],
        customization: [
          { value: 'basic', label: 'Basic Customization', price: 0 },
          { value: 'advanced', label: 'Advanced Customization', price: 12 }
        ]
      }
    },
    {
      id: 'preparation',
      name: 'Preparation Package',
      description: 'Comprehensive interview preparation resources',
      basePrice: 39,
      options: {
        duration: [
          { value: '1week', label: '1 Week Access', price: 0 },
          { value: '1month', label: '1 Month Access', price: 20 },
          { value: '3months', label: '3 Months Access', price: 45 }
        ],
        domains: [
          { value: '1domain', label: '1 Domain', price: 0 },
          { value: '3domains', label: '3 Domains', price: 15 },
          { value: 'all', label: 'All Domains', price: 30 }
        ],
        mentorship: [
          { value: 'none', label: 'Self-Study', price: 0 },
          { value: 'basic', label: '2 Sessions', price: 50 },
          { value: 'premium', label: '5 Sessions', price: 100 }
        ]
      }
    },
    {
      id: 'complete',
      name: 'Complete Career Package',
      description: 'Everything you need for career success',
      basePrice: 79,
      options: {
        duration: [
          { value: '3months', label: '3 Months', price: 0 },
          { value: '6months', label: '6 Months', price: 40 },
          { value: '1year', label: '1 Year', price: 80 }
        ],
        interviews: [
          { value: '10', label: '10 Mock Interviews', price: 0 },
          { value: '25', label: '25 Mock Interviews', price: 30 },
          { value: 'unlimited', label: 'Unlimited', price: 60 }
        ],
        support: [
          { value: 'email', label: 'Email Support', price: 0 },
          { value: 'priority', label: 'Priority Support', price: 20 },
          { value: 'dedicated', label: 'Dedicated Manager', price: 50 }
        ]
      }
    }
  ];

  const calculatePrice = (pkg) => {
    let total = pkg.basePrice;
    const options = packageOptions[pkg.id] || {};
    
    Object.keys(pkg.options).forEach(optionType => {
      const selectedOption = options[optionType];
      if (selectedOption) {
        const option = pkg.options[optionType].find(opt => opt.value === selectedOption);
        if (option) total += option.price;
      }
    });
    
    return total;
  };

  const handleOptionChange = (packageId, optionType, value) => {
    setPackageOptions(prev => ({
      ...prev,
      [packageId]: {
        ...prev[packageId],
        [optionType]: value
      }
    }));
  };

  return (
    <div className="pricing-page">
      <section className="pricing-hero">
        <div className="container">
          <h1>Choose Your Plan</h1>
          <p>Select the perfect package to accelerate your career journey</p>
        </div>
      </section>

      <section className="pricing-packages">
        <div className="container">
          <div className="packages-grid">
            {packages.map(pkg => (
              <div key={pkg.id} className="package-card">
                <div className="package-header">
                  <h3>{pkg.name}</h3>
                  <p>{pkg.description}</p>
                  <div className="package-price">
                    <span className="price">${calculatePrice(pkg)}</span>
                    <span className="period">one-time</span>
                  </div>
                </div>

                <div className="package-options">
                  {Object.keys(pkg.options).map(optionType => (
                    <div key={optionType} className="option-group">
                      <label className="option-label">
                        {optionType.charAt(0).toUpperCase() + optionType.slice(1)}:
                      </label>
                      <select 
                        className="option-select"
                        value={packageOptions[pkg.id]?.[optionType] || ''}
                        onChange={(e) => handleOptionChange(pkg.id, optionType, e.target.value)}
                      >
                        <option value="">Select...</option>
                        {pkg.options[optionType].map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label} {option.price > 0 && `(+$${option.price})`}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <button className="btn package-btn">
                  Get Started - ${calculatePrice(pkg)}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-faq">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Can I upgrade my package later?</h3>
              <p>Yes, you can upgrade to a higher package at any time. You'll only pay the difference.</p>
            </div>
            <div className="faq-item">
              <h3>Is there a refund policy?</h3>
              <p>We offer a 30-day money-back guarantee if you're not satisfied with our service.</p>
            </div>
            <div className="faq-item">
              <h3>Do packages expire?</h3>
              <p>One-time packages don't expire, but subscription-based features have specific durations as mentioned.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
