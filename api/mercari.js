// api/mercari.js  –  Vercel Edge Function
// メルカリ商品URLから全フィールドをJSONで返す

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  if (!url) return jsonResponse({ error: 'url パラメータが必要です' }, 400);

  const itemIdMatch = url.match(/\/item\/(m\w+)/);
  if (!itemIdMatch) return jsonResponse({ error: '有効なメルカリ商品URLを指定してください' }, 400);
  const itemId = itemIdMatch[1];

  try {
    // 1st: 非公式API
    const apiData = await fetchFromMercariApi(itemId);
    if (apiData) return jsonResponse(apiData);

    // 2nd: ページHTML → __NEXT_DATA__
    const pageData = await fetchFromPage(url, itemId);
    if (pageData) return jsonResponse(pageData);

    return jsonResponse({ error: '商品データを取得できませんでした' }, 404);
  } catch (err) {
    return jsonResponse({ error: `取得エラー: ${err.message}` }, 500);
  }
}

// ── 非公式API ──────────────────────────────────────────────────────────
async function fetchFromMercariApi(itemId) {
  try {
    const res = await fetch(`https://api.mercari.jp/items/get?id=${itemId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const item = json.data;
    if (!item) return null;
    return normalizeApi(item);
  } catch {
    return null;
  }
}

function normalizeApi(item) {
  // 画像URL配列（大きい画像を優先）
  const images = (item.photos || []).map(p => p.image_url || p.thumbnail_url).filter(Boolean);
  if (!images.length && item.thumbnails) images.push(...item.thumbnails);

  return {
    itemId: item.id,
    title: item.name || '',
    currentPrice: item.price || null,
    description: item.description || '',
    category: (item.categories || []).map(c => c.name).filter(Boolean).join(' > '),
    condition: item.item_condition?.name || conditionLabel(item.item_condition?.id),
    shippingPayer: item.shipping_payer?.name || (item.shipping_payer?.id === 1 ? '送料込み（出品者負担）' : '着払い（購入者負担）'),
    shippingMethod: item.shipping_method?.name || '',
    shippingFrom: item.shipping_from_area?.name || '',
    shippingDays: item.shipping_duration?.name || '',
    images,
    thumbnailUrl: images[0] || null,
    status: item.status || '',
    url: `https://jp.mercari.com/item/${item.id}`,
    source: 'api',
  };
}

// ── ページスクレイプ ────────────────────────────────────────────────────
async function fetchFromPage(url, itemId) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'ja-JP,ja;q=0.9',
      'Cache-Control': 'no-cache',
    },
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  // __NEXT_DATA__ を解析
  const ndMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
  if (ndMatch) {
    try {
      const nd = JSON.parse(ndMatch[1]);
      const item = nd?.props?.pageProps?.item
        || nd?.props?.pageProps?.itemResponse?.item
        || nd?.props?.pageProps?.data?.item
        || findItemInObject(nd?.props);
      if (item) return normalizePageData(item, itemId, url);
    } catch {}
  }

  // og: メタタグにフォールバック
  return parseOgMeta(html, itemId, url);
}

// __NEXT_DATA__ のネスト構造を再帰探索
function findItemInObject(obj, depth = 0) {
  if (!obj || typeof obj !== 'object' || depth > 5) return null;
  if (obj.id && (obj.name || obj.title) && (obj.price !== undefined)) return obj;
  for (const val of Object.values(obj)) {
    const found = findItemInObject(val, depth + 1);
    if (found) return found;
  }
  return null;
}

function normalizePageData(item, itemId, url) {
  // 画像配列の抽出（複数パターン対応）
  const images = extractImages(item);

  // カテゴリ
  const cats = item.categories || item.itemCategoryGroupList || item.category_list || [];
  const category = Array.isArray(cats)
    ? cats.map(c => c.name || c.displayName || '').filter(Boolean).join(' > ')
    : (item.category?.name || '');

  // 商品状態
  const condition = item.itemCondition?.name
    || conditionLabel(item.itemConditionId || item.item_condition_id)
    || '';

  // 配送情報
  const shippingPayer = item.shippingPayer?.name
    || (item.shippingPayerId === 1 ? '送料込み（出品者負担）' : item.shippingPayerId === 2 ? '着払い（購入者負担）' : '');
  const shippingMethod = item.shippingMethod?.name || item.shipping?.name || '';
  const shippingFrom = item.shippingFromArea?.name || '';
  const shippingDays = item.shippingDuration?.name || item.shippingDays?.name || '';

  return {
    itemId: item.id || itemId,
    title: item.name || item.title || '',
    currentPrice: item.price ?? null,
    description: item.description || '',
    category,
    condition,
    shippingPayer,
    shippingMethod,
    shippingFrom,
    shippingDays,
    images,
    thumbnailUrl: images[0] || null,
    status: item.status || '',
    url: url || `https://jp.mercari.com/item/${itemId}`,
    source: 'page',
  };
}

function extractImages(item) {
  const images = [];
  // パターン1: photos配列
  if (Array.isArray(item.photos)) {
    for (const p of item.photos) {
      const u = p.imageUrl || p.image_url || p.url || (typeof p === 'string' ? p : null);
      if (u) images.push(u.split('?')[0]); // クエリストリング除去
    }
  }
  // パターン2: thumbnails配列
  if (!images.length && Array.isArray(item.thumbnails)) {
    images.push(...item.thumbnails.filter(Boolean));
  }
  // パターン3: 単体
  if (!images.length) {
    const single = item.thumbnailUrl || item.thumbnail_url || item.image_url;
    if (single) images.push(single);
  }
  return images;
}

function parseOgMeta(html, itemId, url) {
  const title = (html.match(/<meta property="og:title" content="([^"]+)"/) || [])[1];
  if (!title) return null;
  const desc = (html.match(/<meta property="og:description" content="([^"]+)"/) || [])[1];
  const img = (html.match(/<meta property="og:image" content="([^"]+)"/) || [])[1];
  const priceNum = (html.match(/"price"\s*:\s*(\d+)/) || [])[1];
  return {
    itemId,
    title: title.replace(/\s*[-–]\s*メルカリ.*$/, '').trim(),
    currentPrice: priceNum ? parseInt(priceNum) : null,
    description: desc ? decodeHtmlEntities(desc) : '',
    category: '', condition: '',
    shippingPayer: '', shippingMethod: '', shippingFrom: '', shippingDays: '',
    images: img ? [img] : [],
    thumbnailUrl: img || null,
    url: `https://jp.mercari.com/item/${itemId}`,
    source: 'og-meta',
  };
}

function conditionLabel(id) {
  const map = { 1: '新品・未使用', 2: '未使用に近い', 3: '目立った傷や汚れなし', 4: 'やや傷や汚れあり', 5: '傷や汚れあり', 6: '全体的に状態が悪い' };
  return map[id] || '';
}

function decodeHtmlEntities(str) {
  return str.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}
