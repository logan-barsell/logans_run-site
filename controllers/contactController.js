const contactService = require('../services/contactService');
const { AppError } = require('../middleware/errorHandler');

class ContactController {
  /**
   * Get contact information
   */
  async getContactInfo(req, res, next) {
    try {
      const info = await contactService.getContactInfo();
      res.status(200).json({
        success: true,
        data: info,
      });
    } catch (error) {
      if (error.message === 'Contact information not found') {
        return next(new AppError('Contact information not found', 404));
      }
      next(new AppError('Failed to fetch contact information', 500));
    }
  }

  /**
   * Update contact information
   */
  async updateContact(req, res, next) {
    try {
      const updatedInfo = req.body;
      const result = await contactService.updateContact(updatedInfo);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error.message === 'Contact information is required') {
        return next(new AppError('Contact information is required', 400));
      }
      next(new AppError('Failed to update contact information', 500));
    }
  }
}

module.exports = new ContactController();
