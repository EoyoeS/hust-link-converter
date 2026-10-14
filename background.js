const LINK_REGEX = /^https?:\/\/mail\.hust\.edu\.cn:8443\/linkserver\?.*dest=([^&]+)/;

// 防抖标记，避免重复重定向
const redirectTabs = new Set();

// 主监听：标签页URL更新时触发（覆盖所有场景）
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // 只在URL变化时处理
  if (!changeInfo.url) return;

  const url = changeInfo.url;

  // 跳过扩展自身页面，防止死循环
  if (url.startsWith(chrome.runtime.getURL(''))) return;

  // 跳过已处理的标签
  if (redirectTabs.has(tabId)) return;

  // 匹配linkserver链接
  const match = url.match(LINK_REGEX);
  if (!match || !match[1]) return;

  try {
    // 解码目标URL（处理双重编码）
    let destUrl = decodeURIComponent(match[1]);
    if (/%25|%26|%3F|%3D/.test(destUrl)) {
      destUrl = decodeURIComponent(destUrl);
    }

    if (destUrl.startsWith('http')) {
      redirectTabs.add(tabId);

      // 生成确认页地址
      const confirmPage = chrome.runtime.getURL('redirect.html') +
        `?dest=${encodeURIComponent(destUrl)}&origin=${encodeURIComponent(url)}`;

      chrome.tabs.update(tabId, { url: confirmPage }, () => {
        // 1秒后清除标记，允许后续导航
        setTimeout(() => redirectTabs.delete(tabId), 1000);
      });
    }
  } catch (e) {
    console.error('跳转处理失败:', e);
  }
});
