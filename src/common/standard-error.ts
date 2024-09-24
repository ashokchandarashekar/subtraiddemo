class StandardError extends Error {
    public error_code: string;

    constructor(errorCode: string, message: string) {
        super(message);
        this.name = this.constructor.name;
        this.error_code = errorCode;
        // So you can do typeof CustomError
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export default StandardError;