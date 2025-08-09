import emailjs from '@emailjs/browser';

// Initialize EmailJS with your Public Key
// You need to replace 'YOUR_PUBLIC_KEY' with your actual EmailJS Public Key
emailjs.init('VcbYcAWCdtw78Bqj4');

const SERVICE_ID = 'service_zcu7dsa'; // Replace with your EmailJS Service ID
const TEMPLATE_ID_CONTACT = 'template_t9y97se'; // Replace with your EmailJS Contact Template ID
const TEMPLATE_ID_BOOKING = 'template_vbrpk7s'; // Replace with your EmailJS Booking Template ID

export const sendContactEmail = async (templateParams) => {
  try {
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID_CONTACT, templateParams);
    console.log('Contact email sent successfully!', response.status, response.text);
    return { success: true, message: 'Message sent successfully!' };
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return { success: false, message: 'Failed to send message. Please try again later.' };
  }
};

export const sendBookingConfirmationEmail = async (templateParams) => {
  try {
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID_BOOKING, templateParams);
    console.log('Booking confirmation email sent successfully!', response.status, response.text);
    return { success: true, message: 'Booking request submitted successfully!' };
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    return { success: false, message: 'Failed to submit booking. Please try again later.' };
  }
};
