import { useState } from 'react';

export default function ContactForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to your backend or email service
    alert(`Message Sent: ${message}`);
    setMessage('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating button */}
      {!isOpen && (
        <button
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
          onClick={() => setIsOpen(true)}
        >
          Contact Us
        </button>
      )}

      {/* Popup form */}
      {isOpen && (
        <div className="bg-white p-4 rounded-xl shadow-xl w-72">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
            <textarea
              className="border p-2 rounded resize-none"
              rows="4"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
