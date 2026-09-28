import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';
import {
  mapJsonRichText,
  Node,
} from '@maps-react/vendor/utils/RenderRichText/RenderRichText';

export interface VideoWithTranscriptProps {
  videoUrl: string;
  transcriptTitle?: string;
  transcript?: Node[];
  testId?: string;
  className?: string;
}

export const VideoWithTranscript = ({
  videoUrl,
  transcriptTitle,
  transcript,
  testId = 'video-with-transcript',
  className,
}: VideoWithTranscriptProps) => {
  return (
    <div className={className} data-testid={testId}>
      <div>
        <iframe
          src={videoUrl}
          title={transcriptTitle ?? 'Video'}
          className="w-full aspect-video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          data-testid={`${testId}-iframe`}
        />
      </div>
      {transcriptTitle && transcript && (
        <ExpandableSection
          title={transcriptTitle}
          variant="main"
          testId={`${testId}-transcript`}
          className="bg-gray-100 py-4 px-4 [&_summary]:p-2 [&_summary]:border-y-1 [&_summary]:border-slate-400 border-0"
        >
          <div
            data-testid={`${testId}-transcript-content`}
            className="p-4 px-2"
          >
            <RichTextAem>{mapJsonRichText(transcript)}</RichTextAem>
          </div>
        </ExpandableSection>
      )}
    </div>
  );
};
