class ApiAuthError extends Error {
    status: number
    errors: Array<string>

    constructor(status, message, errors = []) {
        super(message)
        this.status = status
        this.errors = errors
    }

    static UnauthorizedError() {
        return new ApiAuthError(401, 'Пользователь не авторизован')
    }

    static BadRequest(message, errors?) {
        return new ApiAuthError(400, message, errors)
    }

    static NoAccessRights() {
        return new ApiAuthError(403, 'У вас нет прав доступа')
    }

}

export default ApiAuthError