import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BaseModal from './BaseModal';
import Button from '../Button/Button';

// Mock the icons
jest.mock('../icons', () => ({
  Close: () => <span data-testid='close-icon'>×</span>,
}));

describe('BaseModal', () => {
  const defaultProps = {
    id: 'test-modal',
    title: 'Test Modal',
    children: <div>Test content</div>,
    trigger: <Button>Test Trigger</Button>,
  };

  it('renders trigger button', () => {
    render(<BaseModal {...defaultProps} />);
    expect(screen.getByText('Test Trigger')).toBeInTheDocument();
  });

  it('opens modal when trigger is clicked', () => {
    render(<BaseModal {...defaultProps} />);
    const trigger = screen.getByText('Test Trigger');
    fireEvent.click(trigger);

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    render(<BaseModal {...defaultProps} />);
    const trigger = screen.getByText('Test Trigger');
    fireEvent.click(trigger);

    const closeButton = screen.getByTestId('close-icon');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('closes modal when escape key is pressed', () => {
    render(<BaseModal {...defaultProps} />);
    const trigger = screen.getByText('Test Trigger');
    fireEvent.click(trigger);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('calls onOpen callback when modal opens', () => {
    const onOpen = jest.fn();
    render(
      <BaseModal
        {...defaultProps}
        onOpen={onOpen}
      />
    );

    const trigger = screen.getByText('Test Trigger');
    fireEvent.click(trigger);

    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('calls onClose callback when modal closes', () => {
    const onClose = jest.fn();
    render(
      <BaseModal
        {...defaultProps}
        onClose={onClose}
      />
    );

    const trigger = screen.getByText('Test Trigger');
    fireEvent.click(trigger);

    const closeButton = screen.getByTestId('close-icon');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('applies correct size classes', () => {
    render(
      <BaseModal
        {...defaultProps}
        size='lg'
      />
    );

    const trigger = screen.getByText('Test Trigger');
    fireEvent.click(trigger);

    const modalDialog = document.querySelector('.modal-dialog');
    expect(modalDialog).toHaveClass('modal-lg');
  });

  it('renders without title when not provided', () => {
    const propsWithoutTitle = { ...defaultProps };
    delete propsWithoutTitle.title;

    render(<BaseModal {...propsWithoutTitle} />);

    const trigger = screen.getByText('Test Trigger');
    fireEvent.click(trigger);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
