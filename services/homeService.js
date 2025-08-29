const showModel = require('../models/Show');
const HomeImage = require('../models/HomeImage');
const logger = require('../utils/logger');

class HomeService {
  /**
   * Get all home images
   */
  async getHomeImages() {
    try {
      const images = await HomeImage.find();
      return images;
    } catch (error) {
      logger.error('Error fetching home images:', error);
      throw error;
    }
  }

  /**
   * Remove a home image by ID
   */
  async removeImage(id) {
    try {
      if (!id) {
        throw new Error('Image ID is required');
      }

      const deletedImage = await HomeImage.findOneAndDelete({ _id: id });

      if (!deletedImage) {
        throw new Error('Image not found');
      }

      logger.info(`Home image deleted successfully: ${id}`);
      return deletedImage;
    } catch (error) {
      logger.error('Error deleting home image:', error);
      throw error;
    }
  }

  /**
   * Add home image(s)
   */
  async addHomeImage(imageData) {
    try {
      if (!imageData) {
        throw new Error('Image data is required');
      }

      // Check if the request body is an array or single object
      if (Array.isArray(imageData)) {
        // Multiple images
        if (imageData.length === 0) {
          throw new Error('At least one image is required');
        }

        const homeImages = imageData.map(imageData => new HomeImage(imageData));
        const savedImages = await HomeImage.insertMany(homeImages);

        logger.info(`${savedImages.length} home images added successfully`);
        return savedImages;
      } else {
        // Single image
        const image = new HomeImage(imageData);
        const savedImage = await image.save();

        logger.info('Home image added successfully');
        return savedImage;
      }
    } catch (error) {
      logger.error('Error adding home image:', error);
      throw error;
    }
  }

  /**
   * Add a new show
   */
  async addShow(showData) {
    try {
      if (!showData || Object.keys(showData).length === 0) {
        throw new Error('Show data is required');
      }

      const newShow = new showModel(showData);
      await newShow.save();

      logger.info('New show added successfully');

      // Send newsletter notification for new show
      try {
        const NewsletterService = require('./newsletterService');
        await NewsletterService.sendContentNotification('show', {
          title: newShow.venue || 'New Show',
          date: newShow.date,
          venue: newShow.venue,
          location: newShow.location,
          description: `New show at ${newShow.venue}${
            newShow.location ? ` in ${newShow.location}` : ''
          }`,
        });
      } catch (notificationError) {
        logger.error(
          'Failed to send newsletter notification for new show:',
          notificationError
        );
        // Don't throw error - show was still added successfully
      }

      return newShow;
    } catch (error) {
      logger.error('Error adding show:', error);
      throw error;
    }
  }

  /**
   * Get all shows, sorted by date
   */
  async getShows() {
    try {
      const shows = await showModel.find({}).sort({ date: 1 });
      return shows;
    } catch (error) {
      logger.error('Error fetching shows:', error);
      throw error;
    }
  }

  /**
   * Update a show by ID
   */
  async updateShow(id, showData) {
    try {
      if (!id) {
        throw new Error('Show ID is required');
      }

      if (!showData || Object.keys(showData).length === 0) {
        throw new Error('Show update data is required');
      }

      const updatedShow = {};
      for (let key in showData) {
        if (showData[key] !== '') {
          updatedShow[key] = showData[key];
        }
      }

      const show = await showModel.findOneAndUpdate(
        { _id: updatedShow.id },
        updatedShow,
        { new: true }
      );

      if (!show) {
        throw new Error('Show not found');
      }

      logger.info(`Show updated successfully: ${id}`);
      return show;
    } catch (error) {
      logger.error('Error updating show:', error);
      throw error;
    }
  }

  /**
   * Delete a show by ID
   */
  async deleteShow(id) {
    try {
      if (!id) {
        throw new Error('Show ID is required');
      }

      const deletedShow = await showModel.findOneAndDelete({ _id: id });

      if (!deletedShow) {
        throw new Error('Show not found');
      }

      logger.info(`Show deleted successfully: ${id}`);
      return deletedShow;
    } catch (error) {
      logger.error('Error deleting show:', error);
      throw error;
    }
  }
}

module.exports = new HomeService();
