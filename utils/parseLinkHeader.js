function unquote(value) {
  if (value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') return value.substring(1, value.length - 1);
  return value;
}

function parseLinkHeader(value) {
  const linkexp = /<[^>]*>\s*(\s*;\s*[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*")))*(,|$)/g;
  const paramexp = /[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*"))/g;

  const matches = value.match(linkexp);
  const rels = {};
  const titles = {};
  for (let i = 0; i < matches.length; i++) {
    const split = matches[i].split('>');
    const href = split[0].substring(1);
    const ps = split[1];
    const link = {};
    link.href = href;
    const s = ps.match(paramexp);
    for (let j = 0; j < s.length; j++) {
      const p = s[j];
      const paramsplit = p.split('=');
      const name = paramsplit[0];
      link[name] = unquote(paramsplit[1]);
    }

    if (link.rel !== undefined) {
      rels[link.rel] = link;
    }
    if (link.title !== undefined) {
      titles[link.title] = link;
    }
  }
  const linkheader = {};
  linkheader.rels = rels;
  linkheader.titles = titles;
  return linkheader;
}

export default parseLinkHeader;
