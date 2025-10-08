const DATA_SOURCES = [
  {
    id: 'weekly_wbr',
    label: 'Weekly WBR',
    keywords: ['weekly', 'wbr', 'trend', 'week'],
    keyValueTriggers: {
      report: ['weekly', 'wbr'],
      cadence: ['weekly'],
    },
  },
  {
    id: 'monthly',
    label: 'Monthly Summary',
    keywords: ['monthly', 'month', 'mo'],
    keyValueTriggers: {
      report: ['monthly'],
      cadence: ['monthly'],
    },
  },
  {
    id: 'product_performance',
    label: 'Product Performance',
    keywords: ['product', 'performance', 'asin', 'sku'],
    keyValueTriggers: {
      focus: ['product', 'sku', 'asin'],
      metric: ['performance', 'conversion'],
    },
  },
  {
    id: 'advertising',
    label: 'Advertising',
    keywords: ['advertising', 'ad', 'campaign', 'acos', 'roas'],
    keyValueTriggers: {
      focus: ['advertising', 'ad', 'campaign'],
      metric: ['acos', 'roas', 'spend'],
    },
  },
  {
    id: 'inventory',
    label: 'Inventory',
    keywords: ['inventory', 'stock', 'fulfillment', 'fba'],
    keyValueTriggers: {
      focus: ['inventory', 'stock'],
      metric: ['days', 'coverage', 'replenish'],
    },
  },
  {
    id: 'returns',
    label: 'Returns',
    keywords: ['return', 'refund', 'defect'],
    keyValueTriggers: {
      focus: ['returns', 'refund'],
      metric: ['rate', 'defect'],
    },
  },
  {
    id: 'promotions',
    label: 'Promotions',
    keywords: ['promotion', 'promo', 'discount', 'deal'],
    keyValueTriggers: {
      focus: ['promotion', 'discount', 'deal'],
      metric: ['lift', 'redemption'],
    },
  },
];

function normalizeValue(value) {
  if (Array.isArray(value)) {
    return value.flatMap(normalizeValue);
  }
  if (typeof value === 'string') {
    return value
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter(Boolean);
  }
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(normalizeValue);
  }
  return [];
}

function scoreKeyValueMatch(entry, criteria) {
  let score = 0;
  const normalizedCriteria = Object.entries(criteria).map(([key, value]) => ({
    key: key.toLowerCase(),
    values: normalizeValue(value),
  }));

  normalizedCriteria.forEach(({ key, values }) => {
    const triggers = entry.keyValueTriggers?.[key];
    if (!triggers || values.length === 0) {
      return;
    }
    values.forEach((candidate) => {
      if (triggers.includes(candidate)) {
        score += 2;
      }
    });
  });

  return score;
}

function scoreFreeTextMatch(entry, text) {
  if (!text) {
    return 0;
  }

  const tokens = normalizeValue(text);
  if (tokens.length === 0) {
    return 0;
  }

  return tokens.reduce((acc, token) => {
    if (entry.keywords.includes(token)) {
      return acc + 1;
    }
    return acc;
  }, 0);
}

function determineDataUsage({ keyValue = {}, freeText = '' } = {}) {
  return DATA_SOURCES.map((entry) => {
    const keyValueScore = scoreKeyValueMatch(entry, keyValue);
    const freeTextScore = scoreFreeTextMatch(entry, freeText);
    const totalScore = keyValueScore + freeTextScore;

    return {
      id: entry.id,
      label: entry.label,
      shouldUse: totalScore > 0,
      confidence: Math.min(1, totalScore / 5),
      matchedBy: {
        keyValue: keyValueScore > 0,
        freeText: freeTextScore > 0,
      },
    };
  }).filter((result) => result.shouldUse);
}

module.exports = {
  DATA_SOURCES,
  determineDataUsage,
};
