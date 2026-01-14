const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const IP_REGEX = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
const IPV6_REGEX = /(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}|(?:[A-F0-9]{1,4}:){1,7}:|:(?::[A-F0-9]{1,4}){1,7}/gi;

let settings = {
    hideEmails: true,
    hideIps: true
};

chrome.storage.local.get(['hideEmails', 'hideIps'], (result) => {
    settings.hideEmails = result.hideEmails !== false;
    settings.hideIps = result.hideIps !== false;
    init();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateSettings") {
        settings = request.settings;
        toggleAllBlurs();
        if (settings.hideEmails || settings.hideIps) {
            scanAndBlur(document.documentElement);
        }
    }
});

function init() {
    scanAndBlur(document.documentElement);

    const observer = new MutationObserver((mutations) => {
        if (!settings.hideEmails && !settings.hideIps) return;

        let shouldScan = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldScan = true;
            } else if (mutation.type === 'characterData') {
                processTextNode(mutation.target);
            }
        });

        if (shouldScan) {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            scanAndBlur(node);
                        } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
                            processTextNode(node);
                        }
                    });
                }
            });
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        characterData: true
    });

    setInterval(() => {
        scanAndBlur(document.documentElement);
    }, 100);
}

function scanAndBlur(rootNode) {
    if (!rootNode) return;
    if (!settings.hideEmails && !settings.hideIps) return;

    if (rootNode.shadowRoot) {
        scanAndBlur(rootNode.shadowRoot);
    }

    const walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
        {
            acceptNode: function (node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.shadowRoot) return NodeFilter.FILTER_ACCEPT;
                    if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_SKIP;
                }

                if (node.parentElement && (
                    node.parentElement.classList.contains('sb-blurred-email') ||
                    node.parentElement.classList.contains('sb-blurred-ip') ||
                    node.parentElement.isContentEditable
                )) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    const nodesToProcess = [];
    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.nodeType === Node.TEXT_NODE) {
            nodesToProcess.push(node);
        } else if (node.shadowRoot) {
            scanAndBlur(node.shadowRoot);
        }
    }

    nodesToProcess.forEach(processTextNode);
}

function processTextNode(textNode) {
    if (!textNode.parentElement) return;

    const text = textNode.nodeValue;

    let pattern = null;
    let cls = '';

    if (settings.hideEmails && EMAIL_REGEX.test(text)) {
        pattern = EMAIL_REGEX;
        cls = 'sb-blurred-email';
    } else if (settings.hideIps) {
        if (IP_REGEX.test(text)) {
            pattern = IP_REGEX;
            cls = 'sb-blurred-ip';
        } else if (IPV6_REGEX.test(text)) {
            pattern = IPV6_REGEX;
            cls = 'sb-blurred-ip';
        }
    }

    if (!pattern) return;

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    pattern.lastIndex = 0;
    let match;

    let computedFontSize = 16;
    try {
        const style = window.getComputedStyle(textNode.parentElement);
        computedFontSize = parseFloat(style.fontSize) || 16;
    } catch (e) { }

    const blurRadius = Math.max(3, computedFontSize * 0.35);

    while ((match = pattern.exec(text)) !== null) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));

        const content = match[0];
        const wrapper = document.createElement('span');
        wrapper.className = 'sb-wrapper';
        wrapper.dataset.type = cls === 'sb-blurred-email' ? 'email' : 'ip';

        const blurSpan = document.createElement('span');
        blurSpan.className = 'sb-blurred-email';
        blurSpan.textContent = content;

        blurSpan.style.setProperty('--sb-blur-radius', `${blurRadius}px`);

        const iconSpan = document.createElement('span');
        iconSpan.className = 'sb-eye-icon';

        const reblurIcon = document.createElement('span');
        reblurIcon.className = 'sb-reblur-icon';
        reblurIcon.title = 'Hide content';

        wrapper.appendChild(blurSpan);
        wrapper.appendChild(iconSpan);
        wrapper.appendChild(reblurIcon);

        let clickCount = 0;

        blurSpan.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (wrapper.classList.contains('revealed')) return;

            clickCount++;

            if (clickCount === 1) {
                iconSpan.classList.add('warning');
            } else if (clickCount >= 2) {
                wrapper.classList.add('revealed');
                blurSpan.classList.add('sb-email-revealed');
                clickCount = 0;
                iconSpan.classList.remove('warning');
            }
        });

        iconSpan.addEventListener('click', (e) => {
            blurSpan.click();
        });

        reblurIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            wrapper.classList.remove('revealed');
            blurSpan.classList.remove('sb-email-revealed');
            clickCount = 0;
            iconSpan.classList.remove('warning');
        });

        fragment.appendChild(wrapper);
        lastIndex = pattern.lastIndex;
    }

    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    textNode.parentNode.replaceChild(fragment, textNode);
}

function toggleAllBlurs() {
    const allWrappers = document.querySelectorAll('.sb-wrapper');
    allWrappers.forEach(wrapper => {
        const type = wrapper.dataset.type;
        const blurSpan = wrapper.querySelector('.sb-blurred-email');

        let shouldHide = false;
        if (type === 'email' && settings.hideEmails) shouldHide = true;
        if (type === 'ip' && settings.hideIps) shouldHide = true;

        if (shouldHide) {
            wrapper.classList.remove('revealed');
            blurSpan.classList.remove('sb-email-revealed');
            wrapper.style.display = 'inline-block';
            wrapper.classList.remove('disabled-by-setting');
        } else {
            wrapper.classList.add('revealed');
            blurSpan.classList.add('sb-email-revealed');
            wrapper.classList.add('disabled-by-setting');
        }
    });

    scanAndBlur(document.documentElement);
}
