/**
 * Simple bordered console table for benchmark output.
 *
 * Uses box-drawing characters for a clean, readable look.
 * Supports optional section headers between rows.
 */

const C = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    white: "\x1b[37m"
};

const B = {
    TL: "\u250C",
    TR: "\u2510",
    BL: "\u2514",
    BR: "\u2518",
    H: "\u2500",
    V: "\u2502",
    TD: "\u252C",
    TU: "\u2534",
    TR2: "\u251C",
    TL2: "\u2524",
    X: "\u253C"
};

function line(widths, left, mid, right) {
    return left + widths.map((w) => B.H.repeat(w + 2)).join(mid) + right;
}

function p(str, n, align) {
    str = String(str);
    return align === "left" ? str.padEnd(n) : str.padStart(n);
}

function displayValue(val, isSpeedup) {
    if (val === "---") return {text: val, color: C.dim};
    if (val === "new") return {text: val, color: C.cyan};
    if (isSpeedup) {
        const num = parseFloat(val);
        if (num >= 1.2) return {text: val, color: C.bold + C.green};
        if (num >= 1.05) return {text: val, color: C.green};
        if (num < 1.0) return {text: val, color: C.yellow};
    }
    return {text: val, color: null};
}

/**
 * Print a bordered table to the console.
 *
 * @param {object} opts
 * @param {string} opts.title
 * @param {string} opts.subtitle
 * @param {string[]} opts.headers
 * @param {Array<{cells: string[], group?: string}>} opts.rows
 */
export function printTable({title, subtitle, headers, rows}) {
    const widths = headers.map((h) => h.length);

    // Calculate column widths
    for (const r of rows) {
        if (!r.cells) continue;
        r.cells.forEach((c, i) => {
            widths[i] = Math.max(widths[i], String(c).length);
        });
    }

    const totalWidth = widths.reduce((a, w) => a + w + 2, 0) + widths.length - 1 + 2;
    const lineInner = totalWidth - 4;

    const hr = line(widths, B.TL, B.TD, B.TR);
    const hrSep = line(widths, B.TR2, B.X, B.TL2);
    const hrBot = line(widths, B.BL, B.TU, B.BR);

    console.log();
    console.log(hr);
    console.log(`${B.V} ${C.bold + C.white}${title.padEnd(lineInner)}${C.reset} ${B.V}`);
    if (subtitle) {
        console.log(`${B.V} ${C.dim}${subtitle.padEnd(lineInner)}${C.reset} ${B.V}`);
    }
    console.log(hrSep);

    // Header
    const hdr = headers
        .map((h, i) => {
            const pad = i === 0 ? p(h, widths[i], "left") : p(h, widths[i], "right");
            return ` ${C.bold + C.cyan}${pad}${C.reset} `;
        })
        .join(`${B.V}`);
    console.log(`${B.V}${hdr}${B.V}`);
    console.log(hrSep);

    // Rows
    let lastGroup = null;
    for (const r of rows) {
        if (r.group !== undefined && r.group !== lastGroup) {
            if (lastGroup !== null) console.log(hrSep);
            console.log(`${B.V} ${C.bold + C.white}${r.group.padEnd(lineInner)}${C.reset} ${B.V}`);
            console.log(hrSep);
            lastGroup = r.group;
        }

        if (!r.cells) continue;
        const cells = r.cells
            .map((c, i) => {
                const isSpeedup = i === 3;
                const d = displayValue(c, isSpeedup);
                const align = i === 0 ? "left" : "right";
                const padStr = p(d.text, widths[i], align);
                return d.color ? ` ${d.color}${padStr}${C.reset} ` : ` ${padStr} `;
            })
            .join(`${B.V}`);
        console.log(`${B.V}${cells}${B.V}`);
    }

    console.log(hrBot);
    console.log();
}
