type Props = {
  firmId: string;
  isChangeAnswer?: string;
};

export const DefaultHiddenFields = ({ firmId, isChangeAnswer }: Props) => (
  <>
    <input type="hidden" name="firmId" value={firmId} />
    {isChangeAnswer && (
      <input type="hidden" name="isChangeAnswer" value={isChangeAnswer} />
    )}
  </>
);
