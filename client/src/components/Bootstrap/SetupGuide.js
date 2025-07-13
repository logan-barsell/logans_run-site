import React from 'react';

const SetupGuide = ({ title, steps, documentation }) => {
  return (
    <div className='setup-guide mt-4'>
      <h4 className='text-center mb-3'>{title}</h4>

      <div
        className='accordion'
        id={`${title.replace(/\s+/g, '').toLowerCase()}SetupAccordion`}
      >
        {steps.map((step, index) => (
          <div
            key={index}
            className='accordion-item'
          >
            <h2
              className='accordion-header'
              id={`heading${index + 1}`}
            >
              <button
                className={`accordion-button ${index === 0 ? '' : 'collapsed'}`}
                type='button'
                data-bs-toggle='collapse'
                data-bs-target={`#collapse${index + 1}`}
                aria-expanded={index === 0 ? 'true' : 'false'}
                aria-controls={`collapse${index + 1}`}
              >
                {step.label}
              </button>
            </h2>
            <div
              id={`collapse${index + 1}`}
              className={`accordion-collapse collapse ${
                index === 0 ? 'show' : ''
              }`}
              aria-labelledby={`heading${index + 1}`}
              data-bs-parent={`#${title
                .replace(/\s+/g, '')
                .toLowerCase()}SetupAccordion`}
            >
              <div className='accordion-body'>
                <ol>
                  {step.value.map((content, contentIndex) => (
                    <li key={contentIndex}>{content}</li>
                  ))}
                </ol>
                {step.tip && (
                  <div className={`alert alert-${step.tip.type} mt-3`}>
                    <strong>{step.tip.title || 'Note:'}</strong>{' '}
                    {step.tip.content}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {documentation && (
        <div className='text-center mt-4'>
          <p className='text-muted'>
            <strong>{documentation.text}</strong>{' '}
            <a
              href={documentation.url}
              target='_blank'
              rel='noopener noreferrer'
            >
              {documentation.linkText}
            </a>{' '}
            or contact their support.
          </p>
        </div>
      )}
    </div>
  );
};

export default SetupGuide;
