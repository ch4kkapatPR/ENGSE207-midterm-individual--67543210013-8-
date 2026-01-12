// src/presentation/controllers/bookController.js
const bookService = require('../../business/services/bookService');

class BookController {

    // Get all books (optional filter by status)
    async getAllBooks(req, res, next) {
        try {
            const { status } = req.query;
            const books = await bookService.getAllBooks(status);
            res.status(200).json(books);
        } catch (error) {
            next(error);
        }
    }

    // Get book by ID
    async getBookById(req, res, next) {
        try {
            const { id } = req.params;
            const book = await bookService.getBookById(id);
            res.status(200).json(book);
        } catch (error) {
            next(error);
        }
    }

    // Create new book
    async createBook(req, res, next) {
        try {
            const bookData = req.body;
            const newBook = await bookService.createBook(bookData);
            res.status(201).json(newBook);
        } catch (error) {
            next(error);
        }
    }

    // Update book
    async updateBook(req, res, next) {
        try {
            const { id } = req.params;
            const bookData = req.body;
            const updatedBook = await bookService.updateBook(id, bookData);
            res.status(200).json(updatedBook);
        } catch (error) {
            next(error);
        }
    }

    // Borrow book
    async borrowBook(req, res, next) {
        try {
            const { id } = req.params;
            const result = await bookService.borrowBook(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    // Return book
    async returnBook(req, res, next) {
        try {
            const { id } = req.params;
            const result = await bookService.returnBook(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    // Delete book
    async deleteBook(req, res, next) {
        try {
            const { id } = req.params;
            await bookService.deleteBook(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BookController();
