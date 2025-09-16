'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTheme, updateTheme } from '../../../../../redux/actions';
import EditableForm from '../../../../../components/Forms/EditableForm';
import { RadioField } from '../../../../../components/Forms/FieldTypes';
import { useAlert } from '../../../../../contexts/AlertContext';

const NewsletterEdit = () => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme?.data || {});
  const { showSuccess, showError } = useAlert();

  // Fetch theme data on component mount
  useEffect(() => {
    dispatch(fetchTheme());
  }, [dispatch]);

  const handleSubmit = async values => {
    try {
      await dispatch(updateTheme(values));
      showSuccess('Newsletter settings updated successfully!');
    } catch (error) {
      console.error('Error updating newsletter settings:', error);
      showError('Failed to update newsletter settings. Please try again.');
    }
  };

  return (
    <>
      <EditableForm
        initialValues={theme || {}}
        onSubmit={handleSubmit}
        title=''
        description='Configure newsletter settings and automatic notification preferences.'
        showTitle={false}
      >
        {({ values, form }) => {
          const isNewsletterEnabled = values?.enableNewsletter === true;

          // Handle newsletter enable/disable - manage notification options
          const handleNewsletterChange = newValue => {
            if (newValue === true) {
              // If enabling newsletter, enable all notification options by default
              form.change('notifyOnNewShows', true);
              form.change('notifyOnNewMusic', true);
              form.change('notifyOnNewVideos', true);
            } else {
              // If disabling newsletter, disable all notification options
              form.change('notifyOnNewShows', false);
              form.change('notifyOnNewMusic', false);
              form.change('notifyOnNewVideos', false);
            }
          };

          return (
            <>
              {/* Newsletter Enable/Disable */}
              <div className='mb-4'>
                <RadioField
                  label='Newsletter Signup'
                  name='enableNewsletter'
                  initialValue={values?.enableNewsletter}
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
                    initialValue={
                      isNewsletterEnabled ? values?.notifyOnNewShows : false
                    }
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
                    initialValue={
                      isNewsletterEnabled ? values?.notifyOnNewMusic : false
                    }
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
                    initialValue={
                      isNewsletterEnabled ? values?.notifyOnNewVideos : false
                    }
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

export default NewsletterEdit;
