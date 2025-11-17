import { render, screen } from '@testing-library/react';

import { VideoWithTranscript } from './VideoWithTranscript';

import '@testing-library/jest-dom';

describe('VideoWithTranscript', () => {
  const mockVideoUrl = 'https://www.youtube.com/embed/test-video';
  const mockTranscriptTitle = 'Test Video Transcript';
  const mockTitle = 'Test Video';

  describe('when transcriptContent is a ReactNode', () => {
    const mockJsonRichText = {
      json: [
        {
          nodeType: 'paragraph',
          content: [
            {
              nodeType: 'text',
              value: 'This is the transcript content',
              marks: [],
            },
          ],
        },
      ],
    };

    const mockVideo = {
      title: mockTitle,
      videoUrl: mockVideoUrl,
      transcriptTitle: mockTranscriptTitle,
      transcript: mockJsonRichText,
    };

    it('renders the video iframe with correct attributes', () => {
      render(<VideoWithTranscript video={mockVideo} />);

      const iframe = screen.getByTestId('video-with-transcript-iframe');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('src', mockVideoUrl);
      expect(iframe).toHaveAttribute('title', mockTranscriptTitle);
      expect(iframe).toHaveAttribute('allow');
      expect(iframe).toHaveAttribute('allowfullscreen');
    });

    it('renders the transcript as ReactNode content', () => {
      render(<VideoWithTranscript video={mockVideo} />);

      expect(
        screen.getByText('This is the transcript content'),
      ).toBeInTheDocument();
    });

    it('renders the transcript inside ExpandableSection', () => {
      render(<VideoWithTranscript video={mockVideo} />);

      const expandableSection = screen.getByTestId(
        'video-with-transcript-transcript',
      );
      expect(expandableSection).toBeInTheDocument();
    });

    it('renders with custom testId', () => {
      const customTestId = 'custom-video-test';
      render(<VideoWithTranscript video={mockVideo} testId={customTestId} />);

      expect(screen.getByTestId(customTestId)).toBeInTheDocument();
      expect(screen.getByTestId(`${customTestId}-iframe`)).toBeInTheDocument();
      expect(
        screen.getByTestId(`${customTestId}-transcript`),
      ).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const customClass = 'custom-class';
      render(<VideoWithTranscript video={mockVideo} className={customClass} />);

      const container = screen.getByTestId('video-with-transcript');
      expect(container).toHaveClass(customClass);
    });

    it('renders the transcript title in the ExpandableSection', () => {
      render(<VideoWithTranscript video={mockVideo} />);

      const expandableSection = screen.getByTestId(
        'video-with-transcript-transcript',
      );
      expect(expandableSection).toHaveTextContent(mockTranscriptTitle);
    });
  });

  describe('when transcriptContent is JsonRichText', () => {
    const mockJsonRichText = {
      json: [
        {
          nodeType: 'paragraph',
          content: [
            {
              nodeType: 'text',
              value: 'Transcript content from rich text',
              marks: [],
            },
          ],
        },
      ],
    };

    const mockVideo = {
      title: mockTitle,
      videoUrl: mockVideoUrl,
      transcriptTitle: mockTranscriptTitle,
      transcript: mockJsonRichText,
    };

    it('renders JsonRichText content using RichTextAem', () => {
      render(<VideoWithTranscript video={mockVideo} />);

      expect(
        screen.getByText('Transcript content from rich text'),
      ).toBeInTheDocument();
    });

    it('renders multiple paragraphs from JsonRichText', () => {
      const multiParagraphJson = {
        json: [
          {
            nodeType: 'paragraph',
            content: [
              { nodeType: 'text', value: 'First paragraph', marks: [] },
            ],
          },
          {
            nodeType: 'paragraph',
            content: [
              { nodeType: 'text', value: 'Second paragraph', marks: [] },
            ],
          },
        ],
      };

      const mockVideoWithMultiParagraph = {
        ...mockVideo,
        transcript: multiParagraphJson,
      };

      render(<VideoWithTranscript video={mockVideoWithMultiParagraph} />);

      expect(screen.getByText('First paragraph')).toBeInTheDocument();
      expect(screen.getByText('Second paragraph')).toBeInTheDocument();
    });
  });
});
