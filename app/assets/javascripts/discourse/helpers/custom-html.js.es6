import { registerHelper } from 'discourse/lib/helpers';
import PreloadStore from 'preload-store';

const _customizations = {};

export function getCustomHTML(key) {
  const c = _customizations[key];
  if (c) {
    return new Handlebars.SafeString(c);
  }

  const html = PreloadStore.get("customHTML");
  if (html && html[key] && html[key].length) {
    return new Handlebars.SafeString(html[key]);
  }
}

// Set a fragment of HTML by key. It can then be looked up with `getCustomHTML(key)`.
export function setCustomHTML(key, html) {
  _customizations[key] = html;
}

registerHelper('custom-html', function(params, hash, options, env) {
  const name = params[0];
  const html = getCustomHTML(name);
  if (html) { return html; }

  const contextString = params[1];
  const target = (env || contextString);
  const container = target.container || target.data.view.container;
  if (container.lookup('template:' + name)) {
    return env.helpers.partial.helperFunction.apply(this, arguments);
  }
});
