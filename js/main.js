function findBook(bookID) {
	for (let bookItem of books) {
		if (bookItem.id === bookID) return bookItem;
	}
	return null;
}

function findBookIndex(bookID) {
	for (let booksIndex in books) {
		if (books[booksIndex].id === bookID) return booksIndex;
	}
	return -1;
}

function makeBook(bookObject) {
	const {id, title, author, year, isCompleted} = bookObject;


	const bookTitleCite = document.createElement('cite');
	bookTitleCite.innerText = title;
	const bookTitle = document.createElement('h3');
	bookTitle.append(bookTitleCite);


	const bookAuthor = document.createElement('p');
	bookAuthor.innerText = author;

	const bookYear = document.createElement('p');
	bookYear.innerText = year;

	const bookDetailContainer = document.createElement('div');
	bookDetailContainer.classList.add('book-detail');
	bookDetailContainer.append(bookTitle, bookAuthor, bookYear);

	const buttonContainer = document.createElement('div');
	buttonContainer.classList.add('button-container');

	if (isCompleted) {
		buttonContainer.append(
			createUnfinishedButton(id),
			createRemoveButton(id, title)
		);
	} else {
		buttonContainer.append(
			createFinishedButton(id),
			createRemoveButton(id, title)
		);
	}

	const bookItem = document.createElement('div');
	bookItem.classList.add('book-item');
	bookItem.append(bookDetailContainer, buttonContainer);

	return bookItem;
}

function addBook() {
	const bookTitle = document.getElementById('title').value;
	const bookAuthor = document.getElementById('author').value;
	const bookYear = document.getElementById('year').value;

	const bookObject = generateBookObject(bookTitle, bookAuthor, bookYear, false);
	books.push(bookObject);

	document.dispatchEvent(new Event(RENDER_BOOKS_EVENT));
	saveBooks();
}

function addBookToFinished(bookID) {
	const bookTarget = findBook(bookID);
	if (bookTarget == null) {
		return;
	}

	bookTarget.isCompleted = true;
	document.dispatchEvent(new Event(RENDER_BOOKS_EVENT));
	saveBooks();
}

function removeBookFromBookshelf(bookID) {
	const bookTarget = findBookIndex(bookID);
	if (bookTarget === -1) return;

	books.splice(bookTarget, 1);
	document.dispatchEvent(new Event(RENDER_BOOKS_EVENT));
	saveBooks();
}

function undoBookFromUnfinished(bookID) {
	const bookTarget = findBook(bookID);
	if (bookTarget == null) return;

	bookTarget.isCompleted = false;
	document.dispatchEvent(new Event(RENDER_BOOKS_EVENT));
	saveBooks();
}

function totalBooks() {
	const totalBooks = document.getElementById('total-book-count');
	totalBooks.innerText = String(books.length);
}



function createFinishedButton(bookID) {
	const finishedButton = document.createElement('button');
	finishedButton.innerText = 'Selesai';
	finishedButton.classList.add('btn', 'finished');
	finishedButton.addEventListener('click', function () {
		addBookToFinished(bookID);
	});
	return finishedButton;
}

function createUnfinishedButton(bookID) {
	const unfinishedButton = document.createElement('button');
	unfinishedButton.innerText = 'Belum Selesai';
	unfinishedButton.classList.add('btn', 'unfinished');
	unfinishedButton.addEventListener('click', function () {
		undoBookFromUnfinished(bookID);
	});
	return unfinishedButton;
}

function createRemoveButton(bookID, title) {
	const removeButton = document.createElement('button');
	removeButton.innerText = 'Hapus';
	removeButton.classList.add('btn', 'remove');
	removeButton.addEventListener('click', function () {
		if(confirm(`ANDA AKAN MENGHAPUS BUKU BERJUDUL "${title}" ?`)) {
			removeBookFromBookshelf(bookID)
		}
	});
	return removeButton;
}


document.addEventListener('DOMContentLoaded', function () {
	const submitForm = document.getElementById('form-bookshelf');

	submitForm.addEventListener('submit', function (event) {
		event.preventDefault();
		addBook();
	});

	if (isStorageExist()) {
		loadBooksFromStorage();
	}

	const searchBookForm = document.getElementById('search-book-form');
	searchBookForm.addEventListener('submit', function (event) {
		event.preventDefault();

		const value = document.getElementById('search').value.toLowerCase();
		const searchResult = document.getElementById('search-result');

		for (let bookItem of books) {
			const title = bookItem.title.toLowerCase();
			if (title.includes(value)) {
				const book = makeBook(bookItem);
				searchResult.append(book);
			}
		}
	});

	const removeSearchResult = document.getElementById('removeSearch');
	removeSearchResult.addEventListener('click', function() {
		const searchResult = document.getElementById('search-result');
		searchResult.innerHTML = '';
	})
});

document.addEventListener(SAVED_BOOKS_EVENT, function () {
	totalBooks();
});

document.addEventListener(RENDER_BOOKS_EVENT, function () {
	refreshDataFromBooks();
	totalBooks();
});


