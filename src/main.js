const addBookForm = document.getElementById("add-book");
const startReadingBtn = document.getElementById("start-reading");
const currentlyReading = document.getElementById("currently-reading");
const bookReadBtn = document.getElementById("book-read");

class BookList {
    //no books initially in the list
    #books = [];

    constructor() {

        this.read = 0;
        this.notRead = 0;
        this.current = null;
        this.next = null;
        this.last = null;
    }

    get getBooks() {
        return this.#books;
    }

    readBooks() {
        return this.#books.filter(book => book.read)
    }

    toReadBooks() {
        return this.#books.filter(book => (!book.read && this.current !== book))
    }

    add(book) {
        //add to books
        this.#books.push(book);
    }

    startBook(book) {
        if (this.current !== null) {
            console.log(`You are still reading ${this.current.title}`)
        } else {
            this.current = book;
        }

    }

    finishCurrentBook() {
        this.read++;

        // should mark the book that is currently being read as “read”
        this.current.setRead();

        // Change the last book read to be the book that just got finished
        this.last = this.current;

        // Change the current book to be the next book to be read
        this.current = null;

        if (this.next === null) {
            console.log("no more books to read!");
        } else {
            this.startBook(this.next);

            // Change the next book to be read property to be the first unread book you find in the list of books
            this.next = this.getNextBookToRead();
        }

    }

    getNextBookToRead() {
        let next = null;
        for (let i = 0; i < this.#books.length; i++) {
            const book = this.#books[i];

            if (!book.getRead() && book !== this.current) {
                next = book;
                break;
            }
        }

        if (next === null) {
            console.log("out of books!")
        }
        return next;
    }

    startReading() {
        const current = this.getNextBookToRead();

        if (current === null) {
            console.log("no books to read!");
        } else {
            this.startBook(current)
        }

        const next = this.getNextBookToRead();

        if (next === null) {
            console.log("no books to read!");
        } else {
            this.next = next;
        }

    }
}


class Book {

    constructor(title, genre, author) {
        this.title = title;
        this.genre = genre;
        this.author = author;
        this.read = false;
        this.readDate = null;
    }


    setRead(read = true) {
        this.read = read;
        // Give it a read date of new Date(Date.now())
        if (read) {
            this.readDate = new Date(Date.now());
        } else {
            this.readDate = null;
        }
    }

    getRead() {
        return this.read;
    }

    getTableValues(table) {

        if (table === 'read') {
            return [
                this.title,
                this.genre,
                this.author,
                this.readDate
            ]
        }

        if (table === 'to-read') {
            return [
                this.title,
                this.genre,
                this.author,
            ]
        }
    }
}

const books = [
    {
        title: "lord of the rings: The fellowship of the ring",
        genre: "fantasy",
        author: "J. R. R. Tolkien",
    },
    {
        title: "lord of the rings: the 2 towers",
        genre: "fantasy",
        author: "J. R. R. Tolkien",
    },
    {
        title: "lord of the rings: The Return of the King",
        genre: "fantasy",
        author: "J. R. R. Tolkien",
    },
]


class DisplayUpdater {
    constructor(bookList) {
        this.bookList = bookList;

        this.updateBookListTable()
    }

    #toReadBooksContainer = document.getElementById("to-read-books-container");
    #readBooksContainer = document.getElementById("read-books-container");


    get getToReadBooksContainer() {
        return this.#toReadBooksContainer;
    }

    makeReadTable(books) {
        const listTable = document.createElement("tbody");

        // bookList.readBooks().forEach(book => {
        books.forEach(book => {
            const bookTr = document.createElement('tr');

            book.getTableValues('read').forEach(value => {
                const td = document.createElement('td');
                td.innerText = value;
                bookTr.appendChild(td);
            })

            listTable.appendChild(bookTr);
        });
        return listTable;

    }

    updateBookListTable() {
        const readTable = this.makeReadTable(this.bookList.readBooks());
        this.#readBooksContainer.replaceChild(readTable, document.querySelector('#read-books-container tbody'));

        const toReadTable = this.makeReadTable(this.bookList.toReadBooks());
        this.#toReadBooksContainer.replaceChild(toReadTable, document.querySelector('#to-read-books-container tbody'));
    }

    updateCurrentlyReading() {
        if (this.bookList.current === null) {
            currentlyReading.innerText = `Not Reading Anymore!`;
            startReadingBtn.style.display = 'block';
            bookReadBtn.style.display = 'none';
        } else {
            currentlyReading.innerText = `Reading: ${this.bookList.current.title}`;
        }

    }
}

const bookList = new BookList();
//add some books for initial display
books.forEach((book) => {
    bookList.add(new Book(book.title, book.genre, book.author));
})


const displayUpdater = new DisplayUpdater(bookList);


addBookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formValues = (Object.fromEntries(formData));

    bookList.add(new Book(formValues.title, formValues.genre, formValues.author));

    displayUpdater.updateBookListTable();
})

startReadingBtn.addEventListener('click', (event) => {
    startReadingBtn.style.display = 'none';
    bookReadBtn.style.display = 'block';

    bookList.startReading();
    displayUpdater.updateCurrentlyReading();
    displayUpdater.updateBookListTable();
    if (bookList.current === null) {
        alert("Add more books to your list")
    }

})

bookReadBtn.addEventListener('click', (event) => {
    bookList.finishCurrentBook();
    displayUpdater.updateCurrentlyReading();
    displayUpdater.updateBookListTable();
})
