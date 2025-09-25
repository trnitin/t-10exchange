
export const fetcher = async (url, method = 'GET', body = null, customHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Node)',
    'Origin':'https://ag.t10exchange.com',
    ...customHeaders,
  };

  const options = {
    method,
    headers
  };

  if (body && method.toUpperCase() !== 'GET') {
    options.body = JSON.stringify(body);
  }

  console.log('➡️ fetcher request:', { url, options });

  try {
    const response = await fetch(url, options);
    console.log(response,"Sda")
    console.log('⬅️ fetcher response status:', response.status);
    const respText = await response.text();
    console.log('⬅️ fetcher response body:', respText.substring(0, 500)); // limit to avoid huge

    if (!response.ok) {
      console.log(`❌ HTTP Error ${response.status}: ${response.statusText}`);
      return;
    }

    const data = JSON.parse(respText);
    return { response: data, header: response.headers.get('authorization') || null };

  } catch (err) {
    console.error('❌ Fetcher error:', err.message);
    return;
  }
};
