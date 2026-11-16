import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const testScenarioCode =
    (data.get('selectedOption') as string) ?? 'testScenario1';

  const url = new URL(data.get('redirect') as string);
  url.searchParams.set('code', testScenarioCode);

  return NextResponse.redirect(url, {
    status: 302,
  });
}
