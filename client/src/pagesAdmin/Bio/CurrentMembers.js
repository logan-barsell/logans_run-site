import React, { useEffect, useRef } from 'react';
import { fetchMembers } from '../../redux/actions';
import { connect } from 'react-redux';
import Accordion from '../../components/Accordion/Accordion';
import AddMember from './AddMember';
import EditMember from './EditMember';
import DeleteMember from './DeleteMember';
import { useTheme } from '../../contexts/ThemeContext';
import { useAlert } from '../../contexts/AlertContext';
import SocialIcons from '../../components/SocialIcons';
import LoadingSpinner from '../../components/LoadingSpinner';
import StaticAlert from '../../components/Alert/StaticAlert';

const CurrentMembers = ({ fetchMembers, members, loading, error }) => {
  const { theme } = useTheme();
  const { showSuccess, showError } = useAlert();
  const operationSuccessfulRef = useRef(false);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Handle successful member operations
  const handleMemberSuccess = message => {
    showSuccess(message);
    operationSuccessfulRef.current = true;
  };

  // Handle member operation errors
  const handleMemberError = message => {
    showError(message);
  };

  // Handle modal close - only fetch if operation was successful
  const handleModalClose = () => {
    if (operationSuccessfulRef.current) {
      fetchMembers();
      operationSuccessfulRef.current = false;
    }
  };

  const renderSocialIcons = member => {
    const links = {
      facebook: member.facebook,
      instagram: member.instagram,
      tiktok: member.tiktok,
      youtube: member.youtube,
      x: member.x,
    };

    const hasAnySocial = Object.values(links).some(
      v => typeof v === 'string' && v.trim() !== ''
    );

    if (!hasAnySocial) return null;

    return (
      <SocialIcons
        links={links}
        variant='member'
        theme={theme}
        className='mb-2'
      />
    );
  };

  const createAccordionItems = () => {
    if (!members || !Array.isArray(members)) {
      return [];
    }

    const items = [];

    members.forEach(member => {
      const { id, bioPic, name, role } = member;
      const imgURL = bioPic || '';

      const socials = renderSocialIcons(member);

      items.push({
        data: member,
        group: 'members',
        id,
        name,
        header: name,
        img: imgURL,
        subhead: role,
        content: [
          {
            prefix: 'Member Socials',
            value: socials ?? (
              <>
                <br />
                No Socials
              </>
            ),
          },
        ],
        actions: (
          <>
            <EditMember
              member={member}
              onSuccess={handleMemberSuccess}
              onError={handleMemberError}
              onClose={handleModalClose}
            />
            <DeleteMember
              member={member}
              onSuccess={handleMemberSuccess}
              onError={handleMemberError}
              onClose={handleModalClose}
            />
          </>
        ),
      });
    });

    return items;
  };

  return (
    <div className='my-5 mb-8'>
      <div className='d-flex mb-5'>
        <AddMember
          onSuccess={handleMemberSuccess}
          onError={handleMemberError}
          onClose={handleModalClose}
        />
      </div>

      {loading ? (
        <LoadingSpinner
          size='lg'
          color='white'
          centered={true}
        />
      ) : error ? (
        <StaticAlert
          type={error.severity || 'danger'}
          title={error.title || 'Error'}
          description={error.message || error}
        />
      ) : (
        <Accordion
          id='membersList'
          title='Members'
          items={createAccordionItems()}
        />
      )}
    </div>
  );
};

function mapStateToProps({ members }) {
  return {
    members: members?.data || [],
    loading: members?.loading || false,
    error: members?.error || null,
  };
}

export default connect(mapStateToProps, { fetchMembers })(CurrentMembers);
