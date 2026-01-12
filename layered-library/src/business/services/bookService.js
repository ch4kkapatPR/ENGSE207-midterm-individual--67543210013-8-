// src/business/services/bookService.js
const bookRepository = require('../../data/repositories/bookRepository');
const bookValidator = require('../validators/bookValidator');
const ValidationError = require('../../shared/errors/ValidationError');
const NotFoundError = require('../../shared/errors/NotFoundError');
const ConflictError = require('../../shared/errors/ConflictError');

class BookService {

    // Get all books + statistics
    async getAllBooks(status = null) {
        // 1. ถ้ามี status ให้ validate
        if (status) {
            bookValidator.validateStatus(status);
        }

        // 2. เรียก repository
        const books = await bookRepository.findAll(status);

        // 3. คำนวณสถิติ
        const statistics = {
            total: books.length,
            available: books.filter(b => b.status === 'available').length,
            borrowed: books.filter(b => b.status === 'borrowed').length
        };

        // 4. return
        return { books, statistics };
    }

    // Get book by ID
    async getBookById(id) {
        // 1. Validate ID
        bookValidator.validateId(id);

        // 2. เรียก repository
        const book = await bookRepository.findById(id);

        // 3. ถ้าไม่เจอ
        if (!book) {
            throw new NotFoundError('Book not found');
        }

        // 4. return book
        return book;
    }

    // Create book
    async createBook(bookData) {
        // 1. Validate book data
        bookValidator.validateCreateBook(bookData);

        // 2. Validate ISBN format
        if (bookData.isbn) {
            bookValidator.validateISBN(bookData.isbn);
        }

        // 3. Create
        const createdBook = await bookRepository.create(bookData);

        // 4. return
        return createdBook;
    }

    // Update book
    async updateBook(id, bookData) {
        // 1. Validate ID
        bookValidator.validateId(id);

        // 2. Validate update data
        bookValidator.validateUpdateBook(bookData);

        // 3. Check existing book
        const book = await bookRepository.findById(id);
        if (!book) {
            throw new NotFoundError('Book not found');
        }

        // 4. Update
        const updatedBook = await bookRepository.update(id, bookData);
        return updatedBook;
    }

    // Borrow book
    async borrowBook(id) {
        // 1. Validate ID
        bookValidator.validateId(id);

        // 2. Get book
        const book = await bookRepository.findById(id);
        if (!book) {
            throw new NotFoundError('Book not found');
        }

        // 3. Check status
        if (book.status === 'borrowed') {
            throw new ConflictError('Book is already borrowed');
        }

        // 4. Update status
        const updatedBook = await bookRepository.updateStatus(id, 'borrowed');

        // 5. return
        return updatedBook;
    }

    // Return book
    async returnBook(id) {
        // 1. Validate ID
        bookValidator.validateId(id);

        // 2. Get book
        const book = await bookRepository.findById(id);
        if (!book) {
            throw new NotFoundError('Book not found');
        }

        // 3. Check status
        if (book.status === 'available') {
            throw new ConflictError('Book is not borrowed');
        }

        // 4. Update status
        const updatedBook = await bookRepository.updateStatus(id, 'available');

        // 5. return
        return updatedBook;
    }

    // Delete book
    async deleteBook(id) {
        // 1. Validate ID
        bookValidator.validateId(id);

        // 2. Get book
        const book = await bookRepository.findById(id);
        if (!book) {
            throw new NotFoundError('Book not found');
        }

        // 3. Check status
        if (book.status === 'borrowed') {
            throw new ConflictError('Cannot delete borrowed book');
        }

        // 4. Delete
        await bookRepository.delete(id);
    }
}

module.exports = new BookService();
