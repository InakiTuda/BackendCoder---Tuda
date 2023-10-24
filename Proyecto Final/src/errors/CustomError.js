export default class ProductError {
    static createError(message) {
        const error = new Error(message);
        throw error;
    }
}