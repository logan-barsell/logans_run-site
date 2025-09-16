import './ShowsAccordion.css';
import '../../../../../components/Accordion/accordion.css';
import { Ticket } from '../../../../../components/icons';

import React from 'react';
import Image from 'next/image';
import Button from '../../../../../components/Button/Button';

export default function ShowsAccordion({ items, id, title }) {
  const renderSubItems = content => {
    return content.map(({ prefix, value }, index) => {
      if (value) {
        return (
          <div
            className='secondary-font'
            key={index}
          >
            <span className='font-weight-bold'>
              {prefix && String(prefix).replace('0', 'O')}
            </span>
            <span className='subItemVal'>{value && String(value)}</span>
          </div>
        );
      }
    });
  };

  const renderContent = () => {
    return items.map((item, index) => {
      const {
        id: itemId,
        venue,
        poster,
        date,
        location,
        tixlink,
        content,
      } = item;
      const headerId = `show_heading${itemId}`;
      const collapseId = `show_collapse${itemId}`;
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
                <Image
                  className='poster'
                  src={poster}
                  alt='show poster'
                  width={100}
                  height={150}
                  style={{ width: 'auto' }}
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
                    <Button
                      as='a'
                      href={tixlink}
                      target='_blank'
                      rel='noreferrer'
                      size='sm'
                      variant='outline-light'
                      className='tix secondary-font'
                      icon={<Ticket />}
                      iconPosition='right'
                    >
                      Tickets
                    </Button>
                  </div>
                ) : null}
              </div>
            </button>
          </h2>
          <div
            id={collapseId}
            className='accordion-collapse collapse'
            aria-labelledby={headerId}
            data-bs-parent={`#${id}`}
          >
            <div className='accordion-body row'>
              <div className='accordion-img col-12 col-sm-6 col-lg-5'>
                <Image
                  src={poster}
                  className='img-thumbnail'
                  alt='preview'
                  width={300}
                  height={400}
                  style={{ width: 'auto' }}
                />
              </div>
              <div className='itemInfo col-12 col-sm-6 col-lg-7 center'>
                <div className='subhead'>
                  {venue}
                  <div className='coSubhead secondary-font'>{location}</div>
                </div>
                <div className='content'>
                  {renderSubItems(content)}
                  {tixlink ? (
                    <Button
                      as='a'
                      href={tixlink}
                      target='_blank'
                      rel='noreferrer'
                      variant='outline-light'
                      className='tix secondary-font d-flex align-items-center'
                      style={{
                        maxWidth: 'fit-content',
                        margin: '30px auto',
                      }}
                      icon={<Ticket />}
                      iconPosition='right'
                    >
                      Tickets
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <div
        className='accordion'
        id={id}
      >
        {items.length ? renderContent() : <h5>No {title}</h5>}
      </div>
    </>
  );
}
