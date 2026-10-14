// 匹配华科邮箱linkserver链接的正则
const LINK_REGEX = /^https?:\/\/mail\.hust\.edu\.cn:8443\/linkserver\?.*dest=([^&]+)/;

// URL解码处理（处理双重编码的情况）
function decodeDestUrl(encodedUrl) {
  try {
    return decodeURIComponent(encodedUrl);
  } catch (e) {
    console.error('URL解码失败:', e);
    return null;
  }
}

// 提取真实目标链接
function extractRealUrl(hustLink) {
  const match = hustLink.match(LINK_REGEX);
  if (match && match[1]) {
    return decodeDestUrl(match[1]);
  }
  return null;
}

// 替换页面上所有符合条件的链接
function replaceLinks() {
  const links = document.querySelectorAll('a[href*="mail.hust.edu.cn:8443/linkserver"]');

  links.forEach(link => {
    const realUrl = extractRealUrl(link.href);
    if (realUrl) {
      // 替换href为真实链接
      link.href = realUrl;
      // 添加标记类，避免重复处理
      link.classList.add('hust-link-converted');
      // 可选：在链接旁提示已转换
      link.title = '已自动转换为直接链接: ' + realUrl;
    }
  });
}

// 初始执行
replaceLinks();

// 监听DOM变化，处理动态加载的内容
const observer = new MutationObserver((mutations) => {
  let needReplace = false;
  for (const mutation of mutations) {
    if (mutation.addedNodes.length > 0) {
      needReplace = true;
      break;
    }
  }
  if (needReplace) {
    replaceLinks();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
