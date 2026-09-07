import { render, screen } from '@testing-library/react';

import { VideoWithTranscript } from './VideoWithTranscript';

import '@testing-library/jest-dom';

describe('VideoWithTranscript', () => {
  const videoUrl = 'https://player.vimeo.com/video/123456789';
  const transcriptTitle = 'Test Video Transcript';
  const transcript = [
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
  ];

  it('renders the video iframe with the correct source', () => {
    render(<VideoWithTranscript videoUrl={videoUrl} />);

    const iframe = screen.getByTestId('video-with-transcript-iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', videoUrl);
    expect(iframe).toHaveAttribute('allowfullscreen');
  });

  it('renders the transcript inside an ExpandableSection when provided', () => {
    render(
      <VideoWithTranscript
        videoUrl={videoUrl}
        transcriptTitle={transcriptTitle}
        transcript={transcript}
      />,
    );

    expect(
      screen.getByTestId('video-with-transcript-transcript'),
    ).toBeInTheDocument();
    expect(screen.getByText(transcriptTitle)).toBeInTheDocument();
    expect(
      screen.getByText('This is the transcript content'),
    ).toBeInTheDocument();
  });

  it('does not render the transcript section when transcript is missing', () => {
    render(
      <VideoWithTranscript
        videoUrl={videoUrl}
        transcriptTitle={transcriptTitle}
      />,
    );

    expect(
      screen.queryByTestId('video-with-transcript-transcript'),
    ).not.toBeInTheDocument();
  });

  it('supports a custom testId and className', () => {
    render(
      <VideoWithTranscript
        videoUrl={videoUrl}
        testId="custom-video"
        className="custom-class"
      />,
    );

    const container = screen.getByTestId('custom-video');
    expect(container).toHaveClass('custom-class');
    expect(screen.getByTestId('custom-video-iframe')).toBeInTheDocument();
  });
});
