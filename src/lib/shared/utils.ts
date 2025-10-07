export function delay(t: number, val: any) {
    return new Promise(resolve => setTimeout(resolve, t, val));
}

export function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
