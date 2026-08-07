export function getCount(items: any[] | undefined) {
    return Array.isArray(items) ? items.length : 0;
}

export function getTotalPopulation(data: any[]) {
    if (!Array.isArray(data)) return 0;
    return data.reduce((sum: number, country: any) => sum + (country.population || 0), 0);
}

export function formatNumberShort(n: number) {
    if (n >= 1e12) return (n / 1e12).toFixed(1).replace(/\.0$/, '') + 'T';
    if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return n.toString();
}

export function getUniqueLanguagesCount(data: any[]) {
    const languageSet = new Set<string>();
    if (!Array.isArray(data)) return 0;
    data.forEach((country: any) => {
        const langs = country.languages;
        if (Array.isArray(langs)) {
            langs.forEach((l: any) => {
                if (!l) return;
                if (typeof l === 'string') languageSet.add(l);
                else if (typeof l === 'object' && l.name) languageSet.add(l.name);
            });
        } else if (langs && typeof langs === 'object') {
            Object.values(langs).forEach((v: any) => {
                if (!v) return;
                if (typeof v === 'string') languageSet.add(v);
                else if (typeof v === 'object' && v.name) languageSet.add(v.name);
            });
        } else if (typeof langs === 'string') {
            languageSet.add(langs);
        }
    });
    return languageSet.size;
}

export function getUniqueCurrenciesCount(data: any[]) {
    const currencySet = new Set<string>();
    if (!Array.isArray(data)) return 0;
    data.forEach((country: any) => {
        const currs = country.currencies;
        if (Array.isArray(currs)) {
            currs.forEach((c: any) => {
                if (!c) return;
                if (typeof c === 'string') currencySet.add(c);
                else if (typeof c === 'object') currencySet.add(c.code || c.name || JSON.stringify(c));
            });
        } else if (currs && typeof currs === 'object') {
            Object.values(currs).forEach((v: any) => {
                if (!v) return;
                if (typeof v === 'string') currencySet.add(v);
                else if (typeof v === 'object') currencySet.add(v.code || v.name || JSON.stringify(v));
            });
        } else if (typeof currs === 'string') {
            currencySet.add(currs);
        }
    });
    return currencySet.size;
}
