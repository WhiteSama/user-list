export const addElement = (el, parent, html) => {
    if (typeof el === 'string') el = document.createElement(el);
    if (parent) parent.appendChild(el);
    if (html) el.innerHTML = html;

    return el;
};
