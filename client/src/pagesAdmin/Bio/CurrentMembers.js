import React, { useEffect } from 'react';
import { fetchMembers } from '../../redux/actions';
import { connect } from 'react-redux';
import Accordion from '../../components/Accordion/Accordion';
import AddMember from './AddMember';
import EditMember from './EditMember';
import DeleteMember from './DeleteMember';
import { useTheme } from '../../contexts/ThemeContext';
import SocialIcons from '../../components/SocialIcons';

const CurrentMembers = ({ fetchMembers, members }) => {
  const { theme } = useTheme();

  useEffect(() => {
    fetchMembers();
  }, []);

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
      const { _id, bioPic, name, role } = member;
      const imgURL = bioPic || '';

      const socials = renderSocialIcons(member);

      items.push({
        data: member,
        group: 'members',
        id: _id,
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
              fetchMembers={fetchMembers}
            />
            <DeleteMember
              member={member}
              fetchMembers={fetchMembers}
            />
          </>
        ),
      });
    });

    return items;
  };

  return (
    <div className='my-5 mb-8'>
      <Accordion
        id='membersList'
        title='Members'
        items={createAccordionItems()}
      />
      <div className='d-flex mb-5'>
        <AddMember />
      </div>
    </div>
  );
};

function mapStateToProps({ members }) {
  return {
    members: members?.data || [],
  };
}

export default connect(mapStateToProps, { fetchMembers })(CurrentMembers);
