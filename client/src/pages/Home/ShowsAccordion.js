import './showsAccordion.css';
import '../../components/Bootstrap/accordion.css';

import React, { Component } from 'react';
class ShowsAccordion extends Component {
  renderSubItems(content) {
    return content.map(({ prefix, value }, index) => {
      if (value) {
        return (
          <div key={index}>
            {prefix && String(prefix).replace('0', 'O')}
            <span className='subItemVal'>{value && String(value)}</span>
          </div>
        );
      }
    });
  }

  renderContent() {
    return this.props.items.map((item, index) => {
      const { id, venue, poster, date, location, tixlink, content } = item;
      const headerId = `show_heading${id}`;
      const collapseId = `show_collapse${id}`;
      const headerDate = new Date(date).toDateString();

      return (
        <div
          key={index}
          className='accordion-item'
        >
          <h2
            className='accordion-header'
            id={headerId}
          >
            <button
              className='accordion-button collapsed'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target={`#${collapseId}`}
              aria-expanded='false'
              aria-controls={collapseId}
            >
              <div className='col-auto'>
                <img
                  className='poster'
                  src={poster}
                  alt='show poster'
                />
              </div>
              <div className='row w-100 gx-0 justify-content-between ms-2'>
                <div className='col-12 col-sm-6'>
                  <div className='coHeader'>{headerDate.replace('0', 'O')}</div>
                  <div className='header'>{venue}</div>
                  <div className='coHeader'>{location}</div>
                </div>
                {tixlink ? (
                  <div className='col-12 col-sm-6 w-auto align-self-center mt-2 mt-sm-0'>
                    <a
                      href={tixlink}
                      onClick={e => window.open(e.target.href, '_blank')}
                      target='_blank'
                      rel='noreferrer'
                      className='tix btn btn-sm btn-light secondary-font'
                      style={{ gap: '5px' }}
                    >
                      Tickets{' '}
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        x='0px'
                        y='0px'
                        width='20'
                        height='20'
                        viewBox='0 0 30 30'
                      >
                        <path d='M 25.980469 2.9902344 A 1.0001 1.0001 0 0 0 25.869141 3 L 20 3 A 1.0001 1.0001 0 1 0 20 5 L 23.585938 5 L 13.292969 15.292969 A 1.0001 1.0001 0 1 0 14.707031 16.707031 L 25 6.4140625 L 25 10 A 1.0001 1.0001 0 1 0 27 10 L 27 4.1269531 A 1.0001 1.0001 0 0 0 25.980469 2.9902344 z M 6 7 C 4.9069372 7 4 7.9069372 4 9 L 4 24 C 4 25.093063 4.9069372 26 6 26 L 21 26 C 22.093063 26 23 25.093063 23 24 L 23 14 L 23 11.421875 L 21 13.421875 L 21 16 L 21 24 L 6 24 L 6 9 L 14 9 L 16 9 L 16.578125 9 L 18.578125 7 L 16 7 L 14 7 L 6 7 z'></path>
                      </svg>
                    </a>
                  </div>
                ) : null}
              </div>
            </button>
          </h2>
          <div
            id={collapseId}
            className='accordion-collapse collapse'
            aria-labelledby={headerId}
            data-bs-parent={`#${this.props.id}`}
          >
            <div className='accordion-body row'>
              <div className='accordion-img col-12 col-sm-6 col-lg-5'>
                <img
                  src={poster}
                  className='img-thumbnail'
                  alt='preview'
                />
              </div>
              <div className='itemInfo col-12 col-sm-6 col-lg-7 center'>
                <div className='subhead'>
                  {venue}
                  <div className='coSubhead'>{location}</div>
                </div>
                <div className='content'>
                  {this.renderSubItems(content)}
                  {tixlink ? (
                    <a
                      href={tixlink}
                      target='_blank'
                      rel='noreferrer'
                      className='tix btn btn-light secondary-font d-flex align-items-center'
                      style={{
                        maxWidth: 'fit-content',
                        margin: '30px auto',
                        gap: '5px',
                      }}
                    >
                      Tickets
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        x='0px'
                        y='0px'
                        width='20'
                        height='20'
                        viewBox='0 0 30 30'
                      >
                        <path d='M 25.980469 2.9902344 A 1.0001 1.0001 0 0 0 25.869141 3 L 20 3 A 1.0001 1.0001 0 1 0 20 5 L 23.585938 5 L 13.292969 15.292969 A 1.0001 1.0001 0 1 0 14.707031 16.707031 L 25 6.4140625 L 25 10 A 1.0001 1.0001 0 1 0 27 10 L 27 4.1269531 A 1.0001 1.0001 0 0 0 25.980469 2.9902344 z M 6 7 C 4.9069372 7 4 7.9069372 4 9 L 4 24 C 4 25.093063 4.9069372 26 6 26 L 21 26 C 22.093063 26 23 25.093063 23 24 L 23 14 L 23 11.421875 L 21 13.421875 L 21 16 L 21 24 L 6 24 L 6 9 L 14 9 L 16 9 L 16.578125 9 L 18.578125 7 L 16 7 L 14 7 L 6 7 z'></path>
                      </svg>
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <>
        <div
          className='accordion'
          id={this.props.id}
        >
          {this.props.items.length ? (
            this.renderContent()
          ) : (
            <h5>No {this.props.title}</h5>
          )}
        </div>
      </>
    );
  }
}

export default ShowsAccordion;
