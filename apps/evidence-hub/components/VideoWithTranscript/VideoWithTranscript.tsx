import { VideoData } from 'types/@adobe/homepage';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';
import { mapJsonRichText } from '@maps-react/vendor/utils/RenderRichText';

export interface VideoWithTranscriptProps {
  video: VideoData;
  testId?: string;
  className?: string;
}

export const VideoWithTranscript = ({
  video,
  testId = 'video-with-transcript',
  className,
}: VideoWithTranscriptProps) => {
  const { videoUrl, transcriptTitle, transcript } = video;

  return (
    <div className={className} data-testid={testId}>
      <div>
        <iframe
          src={videoUrl}
          title={transcriptTitle}
          className="w-full aspect-video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          data-testid={`${testId}-iframe`}
        />
      </div>
      <ExpandableSection
        title={transcriptTitle}
        variant="main"
        testId={`${testId}-transcript`}
        className="bg-gray-100 py-4 px-4 [&_summary]:p-2 [&_summary]:border-y-1 [&_summary]:border-slate-400 border-0"
      >
        <div data-testid={`${testId}-transcript-content`} className="p-4 px-2">
          <RichTextAem>{mapJsonRichText(transcript.json)}</RichTextAem>
        </div>
      </ExpandableSection>
    </div>
  );
};
