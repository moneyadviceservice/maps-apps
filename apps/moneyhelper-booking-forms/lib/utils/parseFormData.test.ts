import { parseFormData } from './parseFormData';

describe('parseFormData', () => {
  it('parses the example payload with junction override and checkbox array', () => {
    const requestData = new FormData();
    requestData.append('name', 'John Doe');
    requestData.append('age', '30|age-next-step');
    requestData.append('preferredMethodOfCommunication', 'text-message');
    requestData.append('preferredMethodOfCommunication', 'email');
    requestData.append('nextStep', 'default-next-step');

    const { parsedData, nextStep } = parseFormData(requestData);

    expect(parsedData).toEqual({
      name: 'John Doe',
      age: '30',
      preferredMethodOfCommunication: ['text-message', 'email'],
    });
    expect(nextStep).toBe('age-next-step');
  });

  it('defaults nextStep to empty string when nextStep is missing', () => {
    const requestData = new FormData();
    requestData.append('name', 'John Doe');

    const { parsedData, nextStep } = parseFormData(requestData);

    expect(parsedData).toEqual({
      name: 'John Doe',
    });
    expect(nextStep).toBe('');
  });

  it('parses checkbox values containing a route token and overrides nextStep', () => {
    const requestData = new FormData();
    requestData.append('preferredMethodOfCommunication', 'text-message');
    requestData.append('preferredMethodOfCommunication', 'post|postal-address');
    requestData.append('nextStep', 'confirm-details');

    const { parsedData, nextStep } = parseFormData(requestData);

    expect(parsedData).toEqual({
      preferredMethodOfCommunication: ['text-message', 'post'],
    });
    expect(nextStep).toBe('postal-address');
  });

  it('keeps hidden nextStep when junction nextStep part is empty', () => {
    const requestData = new FormData();
    requestData.append('name', 'John Doe');
    requestData.append('age', '30|');
    requestData.append('nextStep', 'default-next-step');

    const { parsedData, nextStep } = parseFormData(requestData);

    expect(parsedData).toEqual({
      name: 'John Doe',
      age: '30',
    });
    expect(nextStep).toBe('default-next-step');
  });

  it('stringifies non-string FormData values', () => {
    const requestData = new FormData();
    const file = new Blob(['hello'], { type: 'text/plain' });

    requestData.append('name', 'John Doe');
    requestData.append('attachment', file, 'note.txt');

    const { parsedData } = parseFormData(requestData);

    expect(parsedData).toEqual({
      name: 'John Doe',
      attachment: '{}',
    });
  });
});
