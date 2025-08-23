import React, { useEffect } from 'react';
import { fetchMembers } from '../../redux/actions';
import { connect } from 'react-redux';
import Accordion from '../../components/Accordion/Accordion';
import AddMember from './AddMember';
import EditMember from './EditMember';
import DeleteMember from './DeleteMember';
import {
  Facebook,
  Instagram,
  TikTok,
  YouTube,
  X as XIcon,
} from '../../components/icons';

const CurrentMembers = ({ fetchMembers, members }) => {
  useEffect(() => {
    fetchMembers();
  }, []);

  const renderSocialIcons = member => {
    const icons = [];
    if (member.facebook)
      icons.push(
        <a
          key='facebook'
          href={member.facebook}
          target='_blank'
          rel='noreferrer'
          className='mx-1'
        >
          {' '}
          <Facebook />{' '}
        </a>
      );
    if (member.instagram)
      icons.push(
        <a
          key='instagram'
          href={member.instagram}
          target='_blank'
          rel='noreferrer'
          className='mx-1'
        >
          {' '}
          <Instagram />{' '}
        </a>
      );
    if (member.tiktok)
      icons.push(
        <a
          key='tiktok'
          href={member.tiktok}
          target='_blank'
          rel='noreferrer'
          className='mx-1'
        >
          {' '}
          <TikTok />{' '}
        </a>
      );
    if (member.youtube)
      icons.push(
        <a
          key='youtube'
          href={member.youtube}
          target='_blank'
          rel='noreferrer'
          className='mx-1'
        >
          {' '}
          <YouTube />{' '}
        </a>
      );
    if (member.x)
      icons.push(
        <a
          key='x'
          href={member.x}
          target='_blank'
          rel='noreferrer'
          className='mx-1'
        >
          {' '}
          <XIcon />{' '}
        </a>
      );
    if (!icons.length) return null;
    return (
      <div className='member-social-icons d-flex justify-content-center mb-2'>
        {icons}
      </div>
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
            value: socials || (
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
  return { members: members?.data || [] };
}

export default connect(mapStateToProps, { fetchMembers })(CurrentMembers);
