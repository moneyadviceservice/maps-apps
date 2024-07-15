import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type Props = {
  params: {
    id: string;
  };
};

export async function GET(
  request: NextRequest,
  { params: { id } }: Props,
): Promise<NextResponse> {
  const data = await import(`./test-scenario-${id}.mock.json`);

  return NextResponse.json(data, { status: 200 });
}
