function appendParams(url, params) {
  let hashIndex = url.indexOf('#'),
      urlBeforeHash = hashIndex > 0 ? url.substring(0, hashIndex) : url,
      hasParams = urlBeforeHash.indexOf('?') > 0,
      divider = hasParams ? '&' : '?',
      urlWithParams = urlBeforeHash + divider + params;

  if (hashIndex > 0) {
    return urlWithParams + url.substring(hashIndex);
  }

  return urlWithParams;
}

// Mock url params required by ZAF SDK
if (history.pushState) {
  let url = window.location.href;
  let origin = encodeURIComponent(window.top.location.origin);
  let app_guid = '36618c17-34c9-4ec3-8daa-24a9fa728461';
  let newUrl = appendParams(url, `origin=${origin}&app_guid=${app_guid}`);
  window.history.pushState({ path: newUrl }, '', newUrl);
}
