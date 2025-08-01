import React, { Component } from 'react';

class Accordion extends Component {
  renderSubItems(content) {
    return content.map(({ prefix, value }, index) => {
      if (value) {
        return (
          <div key={index}>
            {prefix}
            <span className='subItemVal'>{value}</span>
          </div>
        );
      }
    });
  }

  renderContent() {
    return this.props.items.map((item, index) => {
      const { id, header, img, subhead, content, actions } = item;
      const headerId = `heading${id}`;
      const collapseId = `collapse${id}`;

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
              <span className='header'>{header}</span>
              <div className='modify-options'>{actions}</div>
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
                  src={img}
                  className='img-thumbnail'
                  alt='preview'
                />
              </div>
              <div className='itemInfo col-12 col-sm-6 col-lg-7 center'>
                <div className='subhead secondary-font'>{subhead}</div>
                <div className='content secondary-font'>
                  {this.renderSubItems(content)}
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
            <h3 className='no-content'>No {this.props.title}</h3>
          )}
        </div>
      </>
    );
  }
}

export default Accordion;
