import { useRouter } from 'next/router';

import { renderHook } from '@testing-library/react';

import { useFocusTargetByParams } from './useFocusTargetByParam';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockUseRouter = useRouter as jest.Mock;
describe('useFocusTargetByParams', () => {
  let mockReplace: jest.Mock;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockReplace = jest.fn();
    mockUseRouter.mockReturnValue({
      query: {},
      pathname: '/test-path',
      replace: mockReplace,
    });

    // Create a mock element and add it to DOM
    mockElement = document.createElement('div');
    mockElement.id = 'test-element';
    mockElement.focus = jest.fn();
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('should focus element when focus param matches element ID', () => {
    mockUseRouter.mockReturnValue({
      query: { focus: 'test-element', other: 'param' },
      pathname: '/test-path',
      replace: mockReplace,
    });

    renderHook(() => useFocusTargetByParams());

    expect(mockElement.focus).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith(
      { pathname: '/test-path', query: { other: 'param' } },
      undefined,
      { shallow: true },
    );
  });

  it('should not focus any element when focus param is not present', () => {
    mockUseRouter.mockReturnValue({
      query: { other: 'param' },
      pathname: '/test-path',
      replace: mockReplace,
    });

    renderHook(() => useFocusTargetByParams());

    expect(mockElement.focus).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should not focus when element with focus param ID does not exist', () => {
    mockUseRouter.mockReturnValue({
      query: { focus: 'non-existent-element' },
      pathname: '/test-path',
      replace: mockReplace,
    });

    renderHook(() => useFocusTargetByParams());

    expect(mockElement.focus).not.toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith(
      { pathname: '/test-path', query: {} },
      undefined,
      { shallow: true },
    );
  });

  it('should remove focus param from query after processing', () => {
    mockUseRouter.mockReturnValue({
      query: { focus: 'test-element', keep: 'this', also: 'keep' },
      pathname: '/test-path',
      replace: mockReplace,
    });

    renderHook(() => useFocusTargetByParams());

    expect(mockReplace).toHaveBeenCalledWith(
      { pathname: '/test-path', query: { keep: 'this', also: 'keep' } },
      undefined,
      { shallow: true },
    );
  });
});
