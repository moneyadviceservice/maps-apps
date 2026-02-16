import { PensionBand } from 'lib/types/summary.type';
import pensionBandsAsJson from 'public/data/state-pension-bands.json';

export function getStatePensionAge(dobString: string): string {
  const dob = new Date(dobString);
  const pensionBands: PensionBand[] = pensionBandsAsJson.map((band) => ({
    start: new Date(band.start),
    end: band.end ? new Date(band.end) : null,
    pensionAge: band.pensionAge,
  }));
  const match = pensionBands.find((band) => {
    const afterStart = dob >= band.start;
    const beforeEnd = band.end ? dob <= band.end : true;
    return afterStart && beforeEnd;
  });

  if (!match) {
    return '71 or above';
  }

  return match.pensionAge;
}
