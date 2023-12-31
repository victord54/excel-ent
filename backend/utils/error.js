export class CustomError extends Error {
    constructor(message, status) {
        super();
        this.name = this.constructor.name;
        this.message = message;
        this.status = status;
    }
}

export class MissingParameterError extends CustomError {
    constructor(message) {
        super(message, 400);
    }
}

export class UserError extends CustomError {
    constructor(message, status) {
        super(message, status);
    }
}

export class InvalidTokenError extends CustomError {
    constructor(message) {
        super(message, 401);
    }
}

export class UserNotFoundError extends UserError {
    constructor(message) {
        super(message, 404);
    }
}

export class UserAlreadyExistsError extends UserError {
    constructor(message) {
        super(message, 409);
    }
}

export class InvalidUserDataError extends UserError {
    constructor(message) {
        super(message, 401);
    }
}

export class InvalidIdentifiersError extends UserError {
    constructor(message) {
        super(message, 401);
    }
}

export class InvalidFormatError extends UserError {
    constructor(message) {
        super(message, 400);
    }
}

export class SheetError extends CustomError {
    constructor(message, status) {
        super(message, status);
    }
}

export class SheetNotFoundError extends SheetError {
    constructor(message) {
        super(message, 404);
    }
}

export class SheetAlreadyExistsError extends SheetError {
    constructor(message) {
        super(message, 409);
    }
}

export class LinkError extends CustomError {
    constructor(message, status) {
        super(message, status);
    }
}

export class LinkNotFoundError extends LinkError {
    constructor(message) {
        super(message, 404);
    }
}

export class LinkAlreadyExistsError extends LinkError {
    constructor(message) {
        super(message, 409);
    }
}

export class LinkExpiredError extends LinkError {
    constructor(message) {
        super(message, 401);
    }
}
