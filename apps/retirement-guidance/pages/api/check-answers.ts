import type { NextApiRequest, NextApiResponse } from 'next';

import {
  buildData,
  buildQueryString,
  buildRedirectUrl,
  checkAnswersNavRules,
  parseOldData,
} from 'lib/util';

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const { language, questionNbr, savedData, isEmbed } = request.body;
  const isEmbedBool = isEmbed === 'true';
  const oldData = parseOldData(savedData);
  const navRules = checkAnswersNavRules(Number(questionNbr), oldData);
  const data = buildData(navRules, oldData, questionNbr);
  const queryString = buildQueryString(data);
  const redirectUrl = buildRedirectUrl(
    language,
    `/question-${questionNbr}`,
    queryString,
    isEmbedBool,
  );

  response.redirect(302, redirectUrl);
};

export default handler;
