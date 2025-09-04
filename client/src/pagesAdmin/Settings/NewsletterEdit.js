import React from 'react';
import { connect } from 'react-redux';
import { fetchTheme, updateTheme } from '../../redux/actions';
import EditableForm from '../../components/Forms/EditableForm';
import { RadioField } from '../../components/Forms/FieldTypes';
import { useAlert } from '../../contexts/AlertContext';

const NewsletterEdit = ({ theme, fetchTheme, updateTheme }) => {
  const { showSuccess, showError } = useAlert();

  const handleSubmit = async formData => {
    try {
      await updateTheme(formData);
      showSuccess('Newsletter settings updated successfully!');
    } catch (error) {
      console.error('Error updating newsletter settings:', error);
      showError('Failed to update newsletter settings. Please try again.');
    }
  };

  return (
    <>
      <EditableForm
        initialData={theme}
        onSave={handleSubmit}
        fetchData={fetchTheme}
        title=''
        description='Configure newsletter settings and automatic notification preferences.'
        showTitle={false}
      >
        {({ formData, handleInputChange }) => {
          const isNewsletterEnabled = formData.enableNewsletter === true;

          // Handle newsletter disable - unselect all notification options
          const handleNewsletterChange = e => {
            const newValue = e.target.value === 'true';
            handleInputChange(e);

            // If disabling newsletter, also disable all notification options
            if (!newValue) {
              const updates = {
                notifyOnNewShows: false,
                notifyOnNewMusic: false,
                notifyOnNewVideos: false,
              };

              // Update each field
              Object.entries(updates).forEach(([fieldName, value]) => {
                const syntheticEvent = {
                  target: {
                    name: fieldName,
                    value: String(value),
                  },
                };
                handleInputChange(syntheticEvent);
              });
            }
          };

          return (
            <>
              {/* Newsletter Enable/Disable */}
              <div className='mb-4'>
                <RadioField
                  label='Newsletter Signup'
                  name='enableNewsletter'
                  value={formData.enableNewsletter}
                  onChange={handleNewsletterChange}
                  toggle={true}
                  enabledText='Visitors can subscribe to your newsletter through your website'
                  disabledText='Newsletter signup is hidden from your website'
                />
              </div>

              {/* Information Section - After newsletter signup */}
              <div className='mb-4'>
                <ul
                  className='newsletter-info-list'
                  style={{
                    color: 'white',
                    fontFamily: 'var(--secondary-font)',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    marginBottom: '0',
                    paddingLeft: '1.5rem',
                  }}
                >
                  <li>
                    When enabled, automatic notifications will be sent to all
                    current newsletter subscribers
                  </li>
                  <li>
                    Notifications are sent immediately when content is added to
                    your site
                  </li>
                  <li>
                    You can still send manual newsletters at any time through
                    your newsletter management system
                  </li>
                  <li>
                    Subscribers can unsubscribe from these notifications while
                    remaining on your general newsletter list
                  </li>
                </ul>
              </div>

              <hr
                className='my-4'
                style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
              />

              {/* Automatic Notifications Section */}
              <div className='mb-4'>
                <h5
                  className='mb-3'
                  style={{ color: 'var(--main)' }}
                >
                  Automatic Email Notifications
                </h5>
                <p
                  className='mb-4'
                  style={{
                    color: 'white',
                    fontFamily: 'var(--secondary-font)',
                    fontSize: 'clamp(14px, 2vw, 19px)',
                  }}
                >
                  Automatically notify your newsletter subscribers when you add
                  new content to your site.
                </p>

                {/* New Shows Notification */}
                <div className='mb-4'>
                  <RadioField
                    label='New Shows & Events'
                    name='notifyOnNewShows'
                    value={
                      isNewsletterEnabled ? formData.notifyOnNewShows : false
                    }
                    onChange={handleInputChange}
                    toggle={true}
                    enabledText='Subscribers will be notified when you add new shows to your site'
                    disabledText='Subscribers will not be notified when you add new shows to your site'
                    disabled={!isNewsletterEnabled}
                    helperText='This only applies to custom shows you add to your site, not Bandsintown events.'
                  />
                </div>

                {/* New Music Notification */}
                <div className='mb-4'>
                  <RadioField
                    label='New Music & Albums'
                    name='notifyOnNewMusic'
                    value={
                      isNewsletterEnabled ? formData.notifyOnNewMusic : false
                    }
                    onChange={handleInputChange}
                    toggle={true}
                    enabledText='Subscribers will be notified when you add new music to your site'
                    disabledText='Subscribers will not be notified when you add new music to your site'
                    disabled={!isNewsletterEnabled}
                  />
                </div>

                {/* New Videos Notification */}
                <div className='mb-4'>
                  <RadioField
                    label='New Videos'
                    name='notifyOnNewVideos'
                    value={
                      isNewsletterEnabled ? formData.notifyOnNewVideos : false
                    }
                    onChange={handleInputChange}
                    toggle={true}
                    enabledText='Subscribers will be notified when you add new videos to your site'
                    disabledText='Subscribers will not be notified when you add new videos to your site'
                    disabled={!isNewsletterEnabled}
                  />
                </div>
              </div>
            </>
          );
        }}
      </EditableForm>
    </>
  );
};

const mapStateToProps = state => ({
  theme: state.theme?.data || {},
});

export default connect(mapStateToProps, { fetchTheme, updateTheme })(
  NewsletterEdit
);
