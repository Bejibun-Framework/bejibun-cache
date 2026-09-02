const realLog = console.log;
console.log = () => {};

const t0 = performance.now();
await import("../../index.js");
const t1 = performance.now();

console.log = realLog;
process.stderr.write(String(t1 - t0));
