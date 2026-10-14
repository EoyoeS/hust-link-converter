// 解析URL参数
const params = new URLSearchParams(location.search);
const dest = params.get('dest');
const origin = params.get('origin');

// 元素引用
const elFullUrl = document.getElementById('fullUrl');
const elDomain = document.getElementById('domain');
const elPath = document.getElementById('path');
const elParamCount = document.getElementById('paramCount');
const elJumpSource = document.getElementById('jumpSource');
const elGatewayDomain = document.getElementById('gatewayDomain');
const elRecipient = document.getElementById('recipient');
const elJump = document.getElementById('jump');
const elCancel = document.getElementById('cancel');

// 初始化
init();

function init() {
  if (!dest) {
    renderError('链接参数缺失');
    return;
  }

  try {
    // 解析目标链接
    const destUrl = new URL(dest);
    renderDestInfo(destUrl);

    // 解析原始跳转链接
    if (origin) {
      try {
        const originUrl = new URL(origin);
        renderOriginInfo(originUrl);
      } catch (e) {
        renderOriginFallback();
      }
    } else {
      renderOriginFallback();
    }

    bindEvents();
  } catch (e) {
    renderError('目标链接格式无效');
    console.error('URL解析失败:', e);
  }
}

// 渲染目标链接信息
function renderDestInfo(url) {
  elFullUrl.textContent = dest;
  elDomain.textContent = url.hostname;
  elPath.textContent = url.pathname || '/';
  elParamCount.textContent = url.searchParams.size + ' 个';
}

// 渲染原链接信息
function renderOriginInfo(originUrl) {
  elJumpSource.textContent = '华中科技大学邮件网关';
  elGatewayDomain.textContent = originUrl.host;

  // 提取收件人邮箱
  const rcpt = originUrl.searchParams.get('rcpt');
  elRecipient.textContent = rcpt || '未知';
}

// 原链接解析失败时的兜底显示
function renderOriginFallback() {
  elJumpSource.textContent = '华科邮箱链接转换';
  elGatewayDomain.textContent = 'mail.hust.edu.cn';
  elRecipient.textContent = '-';
}

function renderError(msg) {
  elFullUrl.textContent = msg;
  elFullUrl.style.color = '#cf1322';
  elJump.disabled = true;
  elJump.style.opacity = '0.5';
  elJump.style.cursor = 'not-allowed';
}

function bindEvents() {
  elJump.addEventListener('click', () => {
    if (dest) location.href = dest;
  });

  elCancel.addEventListener('click', () => {
    history.back();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !elJump.disabled) {
      elJump.click();
    }
  });
}
