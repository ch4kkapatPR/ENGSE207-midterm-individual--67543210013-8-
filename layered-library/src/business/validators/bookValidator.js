// src/business/validators/bookValidator.js
const ValidationError = require('../../shared/errors/ValidationError');

class BookValidator {

    // ใช้ตอน create
    validateCreateBook(data) {
        const { title, author, isbn } = data;

        if (!title || !author || !isbn) {
            throw new ValidationError('Title, author, and ISBN are required');
        }

        return true;
    }

    // ใช้ตอน update
    validateUpdateBook(data) {
        if (!data || Object.keys(data).length === 0) {
            throw new ValidationError('Update data cannot be empty');
        }
        return true;
    }

    validateStatus(status) {
        const allowedStatus = ['available', 'borrowed'];
        if (!allowedStatus.includes(status)) {
            throw new ValidationError('Invalid status value');
        }
        return true;
    }

    validateISBN(isbn) {
        // Pattern: (978|979) + 9 digits + (digit or X)
        const isbnPattern = /^(978|979)\d{9}[\dXx]$/;

        // ลบขีดออกก่อนตรวจ
        const cleanISBN = isbn.replace(/-/g, '');

        if (!isbnPattern.test(cleanISBN)) {
            throw new ValidationError('Invalid ISBN format');
        }

        return true;
    }

    validateId(id) {
        const numId = parseInt(id, 10);

        if (isNaN(numId) || numId <= 0) {
            throw new ValidationError('Invalid book ID');
        }

        return numId;
    }
}

module.exports = new BookValidator();
