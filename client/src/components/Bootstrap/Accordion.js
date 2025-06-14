import './accordion.css';

import React, { Component } from 'react';
import EditItem from '../Modifiers/EditItem';
import DeleteItem from '../Modifiers/DeleteItem';

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
      const { id, header, img, subhead, content } = item;
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
              <div className='modify-options'>
                <EditItem
                  item={item}
                  editFields={this.props.editFields}
                  onEdit={this.props.onEdit}
                />
                <DeleteItem
                  item={item}
                  onDelete={this.props.onDelete}
                />
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
                  src={img}
                  className='img-thumbnail'
                  alt='preview'
                />
              </div>
              <div className='itemInfo col-12 col-sm-6 col-lg-7 center'>
                <div className='subhead'>{subhead}</div>
                <div className='content'>{this.renderSubItems(content)}</div>
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
            <h5 className='no-content'>No {this.props.title}</h5>
          )}
        </div>
      </>
    );
  }
}

export default Accordion;
