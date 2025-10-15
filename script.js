// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handles User Interface Tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        // Note: The ISBN is included as a data-attribute for easy deletion
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><span class="delete-icon delete">X</span></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(target) {
        if(target.classList.contains('delete')) {
            // Remove the parent <tr> element (the whole row)
            target.parentElement.parentElement.remove();
        }
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store Class: Handles Local Storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            // Parse the JSON string back into a JavaScript array
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        // Stringify the array to store it as a string in Local Storage
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1); // Remove 1 element at this index
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}


// Event: Display Books on Page Load
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent actual submit (default form behavior)
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate (Simple validation as fields are marked 'required' in HTML)
    if(title === '' || author === '' || isbn === '') {
        // In a real app, you'd show a proper error message here
        console.error('Please fill in all fields');
        return;
    }

    // Instantiate book
    const book = new Book(title, author, isbn);

    // Add book to UI
    UI.addBookToList(book);

    // Add book to Local Storage
    Store.addBook(book);

    // Clear form fields
    UI.clearFields();
});

// Event: Remove a Book (using event delegation on the book-list table body)
document.querySelector('#book-list').addEventListener('click', (e) => {
    // Remove book from UI
    UI.deleteBook(e.target);

    // Remove book from Local Storage
    // Get the ISBN (which is the third child of the row, third column in the table)
    // The target is the 'X' span -> parent is <td> -> parent is <tr> -> child [2] is the ISBN <td>
    const isbn = e.target.parentElement.previousElementSibling.textContent;
    Store.removeBook(isbn);
});