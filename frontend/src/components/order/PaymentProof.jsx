import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';

const PaymentProof = ({ orderId, upiId, upiName, amount, onSubmit, status }) => {
  const [transactionId, setTransactionId] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Generate UPI URI
  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId || !file) {
      toast.error('Please provide both Transaction ID and screenshot');
      return;
    }

    const formData = new FormData();
    formData.append('transactionId', transactionId);
    formData.append('screenshot', file);

    setLoading(true);
    try {
      await onSubmit(formData);
      toast.success('Payment proof submitted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit payment proof');
    } finally {
      setLoading(false);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    toast.success('UPI ID copied to clipboard');
  };

  if (status === 'submitted') {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-6 rounded-lg text-center">
        <h4 className="font-semibold text-lg mb-2">Payment Under Verification</h4>
        <p>We are verifying your payment. Your order status will be updated shortly.</p>
      </div>
    );
  }

  if (status === 'verified') {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg text-center">
        <h4 className="font-semibold text-lg mb-2">Payment Verified ✓</h4>
        <p>Your payment has been successfully verified.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-semibold text-text-primary mb-4">Complete Payment</h3>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* QR Code Section */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-cream rounded-lg">
          <p className="text-sm text-text-secondary mb-4 text-center">
            Scan QR code with any UPI app to pay
          </p>
          <div className="bg-white p-2 rounded-lg shadow-sm mb-4">
            <QRCodeSVG value={upiUri} size={200} />
          </div>
          <div className="text-center">
            <p className="font-semibold text-lg text-primary">{formatPrice(amount)}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-text-secondary text-sm">{upiId}</span>
              <button onClick={copyUpiId} className="text-primary hover:text-primary-dark text-sm font-medium">
                Copy
              </button>
            </div>
            <p className="text-xs text-text-light mt-1">{upiName}</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1">
          {status === 'failed' && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded mb-4 text-sm">
              Previous payment verification failed. Please check the details and submit again.
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Transaction ID / UTR
              </label>
              <input
                type="text"
                required
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. 123456789012"
                className="w-full px-4 py-2 border border-border rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Payment Screenshot
              </label>
              <input
                type="file"
                required
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full px-4 py-2 border border-border rounded-md focus:ring-primary focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cream file:text-primary hover:file:bg-secondary-light"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark font-medium ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Submitting...' : 'Submit Payment Proof'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentProof;
