const showModel = require('../models/Show');
const HomeImage = require('../models/HomeImage');
const NewsletterService = require('./newsletterService');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get all home images
 */
async function getHomeImages() {
  try {
    const images = await HomeImage.find();
    return images;
  } catch (error) {
    logger.error('❌ Error fetching home images:', error);
    throw new AppError(
      error.message || 'Error fetching home images',
      error.statusCode || 500
    );
  }
}

/**
 * Remove a home image by ID
 */
async function removeImage(id) {
  try {
    if (!id) {
      throw new AppError('Image ID is required', 400);
    }

    const deletedImage = await HomeImage.findOneAndDelete({ _id: id });

    if (!deletedImage) {
      throw new AppError('Image not found', 404);
    }

    logger.info(`✅ Home image deleted successfully: ${id}`);
    return deletedImage;
  } catch (error) {
    logger.error('❌ Error deleting home image:', error);
    throw new AppError(
      error.message || 'Error deleting home image',
      error.statusCode || 500
    );
  }
}

/**
 * Add home image(s)
 */
async function addHomeImage(imageData) {
  try {
    if (!imageData) {
      throw new AppError('Image data is required', 400);
    }

    // Check if the request body is an array or single object
    if (Array.isArray(imageData)) {
      // Multiple images
      if (imageData.length === 0) {
        throw new AppError('At least one image is required', 400);
      }

      const homeImages = imageData.map(imageData => new HomeImage(imageData));
      const savedImages = await HomeImage.insertMany(homeImages);

      logger.info(`✅ ${savedImages.length} home images added successfully`);
      return savedImages;
    } else {
      // Single image
      const image = new HomeImage(imageData);
      const savedImage = await image.save();

      logger.info('✅ Home image added successfully');
      return savedImage;
    }
  } catch (error) {
    logger.error('❌ Error adding home image:', error);
    throw new AppError(
      error.message || 'Error adding home image',
      error.statusCode || 500
    );
  }
}

/**
 * Add a new show
 */
async function addShow(showData) {
  try {
    if (!showData || Object.keys(showData).length === 0) {
      throw new AppError('Show data is required', 400);
    }

    const newShow = new showModel(showData);
    await newShow.save();

    logger.info('✅ New show added successfully');

    // Send newsletter notification for new show
    try {
      await NewsletterService.sendContentNotification('show', {
        title: newShow.venue || 'New Show',
        date: newShow.date,
        venue: newShow.venue,
        location: newShow.location,
        description: `New show at ${newShow.venue}${
          newShow.location ? ` in ${newShow.location}` : ''
        }`,
      });
    } catch (newsletterError) {
      logger.error('Failed to send newsletter notification:', newsletterError);
      // Don't fail the show creation if newsletter fails
    }

    return newShow;
  } catch (error) {
    logger.error('❌ Error adding show:', error);
    throw new AppError(
      error.message || 'Error adding show',
      error.statusCode || 500
    );
  }
}

/**
 * Get all shows
 */
async function getShows() {
  try {
    const shows = await showModel.find().sort({ date: 1 });
    return shows;
  } catch (error) {
    logger.error('❌ Error fetching shows:', error);
    throw new AppError(
      error.message || 'Error fetching shows',
      error.statusCode || 500
    );
  }
}

/**
 * Update a show by ID
 */
async function updateShow(id, showData) {
  try {
    if (!id) {
      throw new AppError('Show ID is required', 400);
    }

    if (!showData || Object.keys(showData).length === 0) {
      throw new AppError('Show update data is required', 400);
    }

    const updatedShow = await showModel.findByIdAndUpdate(id, showData, {
      new: true,
      runValidators: true,
    });

    if (!updatedShow) {
      throw new AppError('Show not found', 404);
    }

    logger.info(`✅ Show updated successfully: ${id}`);
    return updatedShow;
  } catch (error) {
    logger.error('❌ Error updating show:', error);
    throw new AppError(
      error.message || 'Error updating show',
      error.statusCode || 500
    );
  }
}

/**
 * Delete a show by ID
 */
async function deleteShow(id) {
  try {
    if (!id) {
      throw new AppError('Show ID is required', 400);
    }

    const deletedShow = await showModel.findByIdAndDelete(id);

    if (!deletedShow) {
      throw new AppError('Show not found', 404);
    }

    logger.info(`✅ Show deleted successfully: ${id}`);
    return deletedShow;
  } catch (error) {
    logger.error('❌ Error deleting show:', error);
    throw new AppError(
      error.message || 'Error deleting show',
      error.statusCode || 500
    );
  }
}

module.exports = {
  getHomeImages,
  removeImage,
  addHomeImage,
  addShow,
  getShows,
  updateShow,
  deleteShow,
};
