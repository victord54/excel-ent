export function evaluateur(operation) {
    console.log('op : ' + operation);
    try {
        const result = eval(operation);
        return result;
    } catch (e) {
        return 'error';
    }
    return 'error';
}
