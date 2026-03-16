import { NextApiRequest, NextApiResponse } from 'next';

import { normalizeToString } from 'utils/query/queryHelpers';

type FormDataValue = string | string[] | undefined;

interface FormData {
  keyword?: string;
  year?: string;
  order?: string;
  'order-current'?: string;
  'keyword-current'?: string;
  search?: string;
  limit?: string;
  [key: string]: FormDataValue;
}

const YEAR_FIELD_VARIANTS = ['year'] as const;
const ALLOWED_METHODS = ['POST', 'GET'] as const;

/**
 * Normalize form data by removing ID prefixes (desktop- or mobile-)
 * from form field names to ensure consistent processing
 */
function normalizeFormData(formData: FormData): FormData {
  const normalized: FormData = {};

  for (const [key, value] of Object.entries(formData)) {
    // Remove desktop- or mobile- prefix if present
    const normalizedKey = key.replace(/^(desktop|mobile)-/, '');
    normalized[normalizedKey] = value;
  }

  return normalized;
}

function addKeywordToParams(formData: FormData, params: URLSearchParams): void {
  const keyword = formData.keyword?.trim();
  if (keyword) {
    params.set('keyword', keyword);
  }
}

function addYearToParams(formData: FormData, params: URLSearchParams): void {
  const yearValue = YEAR_FIELD_VARIANTS.map((field) => formData[field]).find(
    (value) => value?.trim(),
  );

  if (yearValue) {
    params.set('year', yearValue);
  }
}

function addTagFiltersToParams(
  formData: FormData,
  params: URLSearchParams,
): void {
  for (const [key, value] of Object.entries(formData)) {
    if (!key.endsWith('[]') || !value) continue;

    const groupName = key.slice(0, -2);
    const values = Array.isArray(value) ? value : [value];

    const filteredValues = values.filter(
      (v): v is string => typeof v === 'string' && v.trim() !== '',
    );

    if (filteredValues.length > 0) {
      params.set(groupName, filteredValues.join(','));
    }
  }
}

function setOrderParamIfValid(
  order: string | string[] | undefined,
  params: URLSearchParams,
): void {
  const orderStr = normalizeToString(order);
  if (orderStr) {
    params.set('order', orderStr);
  }
}

function addLimitToParams(formData: FormData, params: URLSearchParams): void {
  const limit = formData.limit ?? '10';
  if (typeof limit === 'string') {
    params.set('limit', limit);
  }
}

/**
 * Add order parameter to URL params based on form submission context
 * Uses shared determineDefaultOrder utility for consistency
 */
function addOrderToParams(formData: FormData, params: URLSearchParams): void {
  const {
    order,
    'order-current': orderCurrent,
    'keyword-current': keywordCurrent,
    search,
  } = formData;

  // Normalize keyword values for comparison
  const keywordStr = normalizeToString(formData.keyword);
  const keywordCurrentStr = normalizeToString(keywordCurrent);
  const keywordChanged = keywordStr !== keywordCurrentStr;

  // Determine if order should be set based on submission context
  const shouldSetOrder = determineOrderParam(
    search === 'true',
    keywordChanged,
    normalizeToString(order),
    normalizeToString(orderCurrent),
  );

  if (shouldSetOrder) {
    setOrderParamIfValid(order, params);
  } else {
    params.delete('order');
  }
}

/**
 * Determine if order parameter should be set based on form submission context
 * Simplified logic using shared utilities
 */
function determineOrderParam(
  isSearchClicked: boolean,
  keywordChanged: boolean,
  order: string,
  orderCurrent: string,
): boolean {
  // New keyword search - order will default to relevance on frontend
  if (isSearchClicked && keywordChanged) {
    return false;
  }

  // Apply filters clicked and order changed - preserve the new order
  if (!isSearchClicked && orderCurrent && orderCurrent !== order && order) {
    return true;
  }

  // Search clicked with same keyword - preserve current order selection
  if (isSearchClicked && !keywordChanged && order) {
    return true;
  }

  // Default: don't set order (will use defaults on frontend)
  return false;
}

// Helper to build redirect URL
export function buildRedirectUrl(formData: FormData): string {
  const params = new URLSearchParams();

  addKeywordToParams(formData, params);
  addYearToParams(formData, params);
  addTagFiltersToParams(formData, params);
  addOrderToParams(formData, params);
  addLimitToParams(formData, params);

  return `/en/research-library${
    params.toString() ? `?${params.toString()}` : ''
  }`;
}

// Main handler with better error handling
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Method validation
  if (
    !ALLOWED_METHODS.includes(req.method as (typeof ALLOWED_METHODS)[number])
  ) {
    return res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ALLOWED_METHODS,
    });
  }

  try {
    const rawFormData = (
      req.method === 'GET' ? req.query : req.body
    ) as FormData;

    // Validate that we have some data
    if (!rawFormData || Object.keys(rawFormData).length === 0) {
      return res.redirect(302, '/en/research-library');
    }

    // Normalize form data to remove any ID prefixes
    const formData = normalizeFormData(rawFormData);

    const redirectUrl = buildRedirectUrl(formData);
    return res.redirect(302, redirectUrl);
  } catch (error) {
    console.error('Error processing filter form:', error);

    // More detailed error response in development
    const errorMessage =
      process.env.NODE_ENV === 'development'
        ? `Internal server error: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        : 'Internal server error';

    return res.status(500).json({
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}
