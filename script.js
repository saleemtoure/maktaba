//Mesteparten av koden her er henten fra StackOverflow og redigert med AI

document.addEventListener("DOMContentLoaded", function () {
    fetchSheetData();

    setupSearchBar();

});



// Web scraping function to fetch the Google Sheet data
function fetchSheetData() {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSjFnZEDGPhbTF3F9lw_tduqU0wz0YOAi7l_P-WdJz2MUTcCkrapzuUzx0sEPT_e0XIw0bPdT9dLPpN/pubhtml';

    fetch(sheetUrl)
        .then(response => response.text())
        .then(html => {
            // Parse the HTML content
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Select all rows of data, skipping the first row (the header row)
            const rows = doc.querySelectorAll('table tbody tr');

            const books = [];

            // Loop through each row and extract the relevant columns
            rows.forEach((row, index) => {
                if (index === 0) return; // Skip the first row (header row)

                const columns = row.querySelectorAll('td');

                if (columns.length >= 8) { // Ensure there are enough columns (Title, BookNr, Author, Price,Antall, ImgURL, Desc, IGLink)
                    const title = columns[0].innerText.trim(); // Title
                    const bookNr = columns[1].innerText.trim(); // BookNr
                    const author = columns[2].innerText.trim(); // Author
                    const price = columns[3].innerText.trim(); // Price
                    const antall = columns[4].innerText.trim(); // Antall
                    const imgUrl = columns[5].innerText.trim(); // Image URL
                    const desc = columns[6].innerText.trim(); // Description
                    const igLink = columns[7].innerText.trim(); // Instagram Link

                    // Ensure ImgURL is in the correct format (i.e., the direct image URL)
                    const imageUrl = convertToDirectImageUrl(imgUrl); // Convert if necessary

                    books.push({ title, bookNr, author, price, antall, imageUrl, desc, igLink });
                }
            });

            // After fetching all the books, display them
            displayBooks(books);

            window.booksData = books;  // Store the books data globally for search

        })
        .catch(error => {
            console.error('Error fetching sheet data:', error);
        });
}

// Function to convert Google Drive file URL to a direct image URL
function convertToDirectImageUrl(imgUrl) {
    // If the URL is a Google Drive URL
    const driveRegex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view\?usp=[a-zA-Z0-9_=&-]+/;
    const match = imgUrl.match(driveRegex);

    if (match && match[1]) {
        // Convert to the direct image URL format
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
    }

    // Return the URL as-is if it's not a Google Drive link
    return imgUrl;
}

function displayBooks(books) {
    const bookContainer = document.getElementsByClassName("book_container")[0];
    bookContainer.innerHTML = '';  // Clear any existing content in the container

    // Iterate over each book
    books.forEach(book => {
        let bookDiv = document.createElement("div");  // Create a new div for each book
        bookDiv.classList.add("book");  // Add a class to the div for styling

        // Create a div for the book details (including title, book number, author, and price)
        let bookDetails = document.createElement("div");
        bookDetails.classList.add("book-details");

        // Title for the book
        let bookTitle = document.createElement("div");
        bookTitle.classList.add("book-title");
        bookTitle.textContent = book.title;

        // Book Number for the book
        let bookNr = document.createElement("div");
        bookNr.classList.add("book-nr");
        bookNr.textContent = `Bok Nr: ${book.bookNr}`;

        // Author for the book with "by" prefix
        let bookAuthor = document.createElement("div");
        bookAuthor.classList.add("book-author");
        bookAuthor.textContent = `av: ${book.author}`;

        // Price for the book
        let bookPrice = document.createElement("div");
        bookPrice.classList.add("book-price");
        bookPrice.textContent = `Pris: ${book.price} kr`;

        // Antall for the book
        let bookAntall = document.createElement("div");
        bookAntall.classList.add("book-antall");
        bookAntall.textContent = `Antall: ${book.antall}`;

        // Append the title, book number, author, and price to the bookDetails div
        bookDetails.appendChild(bookTitle);
        bookDetails.appendChild(bookNr);
        bookDetails.appendChild(bookAuthor);
        bookDetails.appendChild(bookPrice);
        bookDetails.appendChild(bookAntall);

        // Image for the book (separate from book details)
        let bookImage = document.createElement("img");
        bookImage.classList.add("book-image");
        bookImage.src = book.imageUrl;  // Set the image URL
        bookImage.alt = book.title + " cover";  // Alt text for the image

        // Short description for the book (separate from book details)
        let bookDesc = document.createElement("div");
        bookDesc.classList.add("book-desc");
        bookDesc.textContent = book.desc;

        // Instagram link for the book (separate from book details)
        let igLink = document.createElement("a");
        igLink.classList.add("ig-link");
        igLink.href = book.igLink;
        igLink.textContent = "Mer info";
        igLink.target = "_blank";

        // Append the image and description separately (outside of bookDetails)
        bookDiv.appendChild(bookImage);
        bookDiv.appendChild(bookDetails);  // Append the book details to the div
        bookDiv.appendChild(bookDesc);
        bookDiv.appendChild(igLink);

        // Append the bookDiv to the container
        bookContainer.appendChild(bookDiv);
    });
}



function setupSearchBar() {
    const searchBar = document.getElementById("searchBar");
    const header = document.querySelector("h2"); // Assuming there's only one h2 on your page

    searchBar.addEventListener("input", function () {
        const query = searchBar.value.toLowerCase();
        // If there's an active search, hide the h2
        if (query) {
            header.style.display = "none";  // Hide the <h2> when searching
        } else {
            header.style.display = "block"; // Show the <h2> again when the search is cleared
        }
        const filteredBooks = window.booksData.filter(book => {
            return book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) ||
                book.desc.toLowerCase().includes(query);
        });

        // Display only the four most similar books
        displayBooks(filteredBooks.slice(0, 4));
    });
}