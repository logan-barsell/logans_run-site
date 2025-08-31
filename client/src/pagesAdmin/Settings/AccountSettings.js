import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useAlert } from '../../contexts/AlertContext';
import EditableForm from '../../components/Forms/EditableForm';
import * as userService from '../../services/userService';
import { refreshUserData } from '../../redux/actions/authActions';

const AccountSettings = ({ user, refreshUserData }) => {
  const { showSuccess, showError } = useAlert();
  const [loading, setLoading] = useState(false);

  const handleSave = async formData => {
    try {
      setLoading(true);
      await userService.updateUser(formData);
      // Refresh user data in Redux
      await refreshUserData();
      showSuccess('Account information updated successfully');
    } catch (error) {
      console.error('Error updating account:', error);
      showError('Failed to update account information');
      throw error; // Re-throw to prevent form from closing
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.adminEmail) {
    return (
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ minHeight: '200px' }}
      >
        <div
          className='spinner-border text-light'
          role='status'
        >
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {user && user.adminEmail ? (
        <EditableForm
          initialData={{
            adminEmail: user.adminEmail,
            adminPhone: user.adminPhone || '',
          }}
          onSave={handleSave}
          title='Admin Information'
          description='Manage your primary contact information for account management and notifications.'
          loading={loading}
        >
          {({ formData, handleInputChange, errors }) => (
            <>
              <div className='mb-4'>
                <label
                  htmlFor='adminEmail'
                  className='form-label'
                >
                  Email
                </label>
                <input
                  type='email'
                  className={`form-control ${
                    errors?.adminEmail ? 'is-invalid' : ''
                  }`}
                  id='adminEmail'
                  name='adminEmail'
                  value={formData?.adminEmail || ''}
                  onChange={handleInputChange}
                  placeholder='Enter your email address'
                  required
                />
                {errors?.adminEmail && (
                  <div className='invalid-feedback'>{errors.adminEmail}</div>
                )}
                <div className='form-text'>
                  This is your primary email for authentication, account
                  management, and notifications.
                </div>
              </div>

              <div className='mb-4'>
                <label
                  htmlFor='adminPhone'
                  className='form-label'
                >
                  Phone
                </label>
                <input
                  type='tel'
                  className={`form-control ${
                    errors?.adminPhone ? 'is-invalid' : ''
                  }`}
                  id='adminPhone'
                  name='adminPhone'
                  value={formData?.adminPhone || ''}
                  onChange={handleInputChange}
                  placeholder='Enter your phone number'
                />
                {errors?.adminPhone && (
                  <div className='invalid-feedback'>{errors.adminPhone}</div>
                )}
                <div className='form-text'>
                  Optional phone number for account management and support.
                </div>
              </div>
            </>
          )}
        </EditableForm>
      ) : (
        <div className='alert alert-warning'>
          Unable to load user data. Please refresh the page.
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.auth?.user || null,
});

const mapDispatchToProps = {
  refreshUserData,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);
