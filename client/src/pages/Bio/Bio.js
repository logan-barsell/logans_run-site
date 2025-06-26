import './Bio.css';
import vango from '../../images/logos/logansrunlogo.png';

import React, { useEffect } from 'react';
import SecondaryNav from '../../components/Navbar/SecondaryNav';
import { connect } from 'react-redux';
import { fetchBio, fetchMembers } from '../../redux/actions';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

const BioPage = ({ fetchMembers, members, fetchBio, currentBio }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
    fetchBio();
  }, [fetchMembers, fetchBio]);

  const renderBio = () => {
    return currentBio && currentBio[0]?.text;
  };

  const renderMembers = members.map((member, index) => {
    const { _id, bioPic, name, role } = member;
    const blob = new Blob([Int8Array.from(bioPic.img.image.data)], {
      type: bioPic.img.contentType,
    });
    const imgURL = window.URL.createObjectURL(blob);

    return (
      <div key={_id}>
        {index === 0 ? null : <hr />}
        <div className='row justify-content-center mb-5 mt-4 mx-1 gap-4'>
          <div className='col-12 col-md-5 bioPic'>
            <img
              src={imgURL}
              alt={`${name}: ${role}`}
            />
          </div>
          <div className='col-12 col-md-6 ind-bio'>
            <div className='row'>
              <h3>{name}</h3>
              <hr />
              <p>{role}</p>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div
      id='aboutus'
      className='fadeIn'
    >
      <div>
        <div
          id='biography'
          className='container'
        >
          <div className='row justify-content-center'>
            <div className='col-7 col-sm-auto'>
              <img
                onClick={() => navigate('/signin')}
                className='aboutuspic'
                src={theme.bandLogoUrl || vango}
                alt='Band Logo'
              />
            </div>
          </div>

          <div className='row justify-content-center bio'>
            <p>
              <span>
                This is{' '}
                <span className='yesdevil'>
                  {theme.siteTitle || "Logan's Run"}
                </span>
              </span>
              , &nbsp;{renderBio()}
            </p>
          </div>
        </div>

        {members.length ? (
          <div className='members'>
            <SecondaryNav label='Members' />
            <br />
            <div className='container pb-5'>{renderMembers}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

function mapStateToProps({ members, currentBio }) {
  return { members, currentBio };
}

export default connect(mapStateToProps, { fetchMembers, fetchBio })(BioPage);
