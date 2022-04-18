const STORAGE_KEY = "BOOKS_APPS";
const RENDER_BOOKS_EVENT = "render-books";
const SAVED_BOOKS_EVENT = "saved-books";
const books = [];

function generateIdBook() {
	return +new Date();
}

function generateBookObject(title, author, year, isCompleted) {
	return {
		id: generateIdBook(),
		title,
		author,
		year,
		isCompleted
	};
}

function isStorageExist() {
	if (typeof (Storage) === undefined) {
		alert("Browser kamu tidak mendukung local storage");
		return false;
	}

	return true;
}

function saveBooks() {

	if (isStorageExist()) {
		const booksFromStorage = JSON.stringify(books);
		localStorage.setItem(STORAGE_KEY, booksFromStorage);
		document.dispatchEvent(new Event(SAVED_BOOKS_EVENT));
	}
}

function loadBooksFromStorage() {
	let data = JSON.parse(localStorage.getItem(STORAGE_KEY));

	if (data !== null) {
		for (let book of data) {
			books.push(book);
		}
	}
	document.dispatchEvent(new Event(RENDER_BOOKS_EVENT));
}

function refreshDataFromBooks() {
	const booksUnfinished = document.getElementById('unfinished');
	const booksFinished = document.getElementById('finished');

	booksUnfinished.innerHTML = '';
	booksFinished.innerHTML = '';

	for (let book of books) {
		const newBook = makeBook(book);
		if (book.isCompleted) {
			booksFinished.append(newBook);
		} else {
			booksUnfinished.append(newBook);
		}
	}
}

