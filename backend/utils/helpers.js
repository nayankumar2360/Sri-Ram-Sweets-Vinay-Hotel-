const Notification = require('../models/Notification');

const generateOrderNumber = (prefix = 'ORD') => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${timestamp}-${random}`;
};

const createNotification = async (userId, title, message, type = 'system', relatedOrder = null, relatedOrderType = null) => {
  try {
    const notification = new Notification({
      user: userId,
      title,
      message,
      type,
      relatedOrder,
      relatedOrderType
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = {
  generateOrderNumber,
  createNotification
};
