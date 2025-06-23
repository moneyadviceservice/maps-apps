import React from 'react';

import { render, screen } from '@testing-library/react';

import { DateField } from './DateField';

import '@testing-library/jest-dom';

describe('DateField Component', () => {
  const mockQuestions = [
    {
      title: 'What is your date of birth?',
      definition:
        "Your age during each year of employment can change how much redundancy pay you'll get.",
      exampleText: 'For example, 27 3 2007',
      group: '',
      questionNbr: 2,
      subType: 'dayMonthYear',
      type: 'date',
      inputProps: {
        additionalLabels: {
          label1: 'Day',
          label2: 'Month',
          label3: 'Year',
        },
      },
      answers: [],
    },
  ];

  const renderDateField = (props) =>
    render(
      <DateField
        threePartDate={true}
        questions={mockQuestions}
        currentStep={1}
        {...props}
      />,
    );

  it('renders the three-part date fields when threePartDate is true', () => {
    renderDateField({ threePartDate: true, defaultValues: '01-2-2023' });

    expect(screen.getByLabelText('Day')).toBeInTheDocument();
    expect(screen.getByLabelText('Month')).toBeInTheDocument();
    expect(screen.getByLabelText('Year')).toBeInTheDocument();
  });

  it('does not render the day field when threePartDate is false', () => {
    renderDateField({ threePartDate: false, defaultValues: '01-22-2023' });

    expect(screen.queryByLabelText('Day')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Month')).toBeInTheDocument();
    expect(screen.getByLabelText('Year')).toBeInTheDocument();
  });

  it('applies error styles to fields with errors', () => {
    renderDateField({
      fieldErrors: { day: true, month: false, year: true },
    });

    expect(screen.getByLabelText('Day')).toHaveClass('border-red-600');
    expect(screen.getByLabelText('Month')).not.toHaveClass('border-red-600');
    expect(screen.getByLabelText('Year')).toHaveClass('border-red-600');
  });

  it('renders default values correctly', () => {
    renderDateField({ defaultValues: '15-8-1995' });

    expect(screen.getByLabelText('Day')).toHaveValue('15');
    expect(screen.getByLabelText('Month')).toHaveValue('8');
    expect(screen.getByLabelText('Year')).toHaveValue('1995');
  });

  it('renders labels correctly from questions prop', () => {
    renderDateField({});

    expect(screen.getByLabelText('Day')).toBeInTheDocument();
    expect(screen.getByLabelText('Month')).toBeInTheDocument();
    expect(screen.getByLabelText('Year')).toBeInTheDocument();
  });

  it('renders empty fields when defaultValues is an empty string', () => {
    renderDateField({ defaultValues: '' });

    expect(screen.getByLabelText('Day')).toHaveValue('');
    expect(screen.getByLabelText('Month')).toHaveValue('');
    expect(screen.getByLabelText('Year')).toHaveValue('');
  });

  it('uses fallback labels when no labels are provided', () => {
    const questionsWithoutLabels = [
      {
        ...mockQuestions[0],
        inputProps: {},
      },
    ];

    renderDateField({ questions: questionsWithoutLabels });

    expect(screen.getByLabelText('Day')).toBeInTheDocument();
    expect(screen.getByLabelText('Month')).toBeInTheDocument();
    expect(screen.getByLabelText('Year')).toBeInTheDocument();
  });
});
