//Mesteparten av koden her er henten fra StackOverflow og redigert med AI

document.addEventListener("DOMContentLoaded", function () {
    fetchSheetData();
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

                if (columns.length >= 7) { // Ensure there are enough columns (Title, BookNr, Author, Price, ImgURL, Desc, IGLink)
                    const title = columns[0].innerText.trim(); // Title
                    const bookNr = columns[1].innerText.trim(); // BookNr
                    const author = columns[2].innerText.trim(); // Author
                    const price = columns[3].innerText.trim(); // Price
                    const imgUrl = columns[4].innerText.trim(); // Image URL (assuming it's a URL text)
                    const desc = columns[5].innerText.trim(); // Description
                    const igLink = columns[6].innerText.trim(); // Instagram Link

                    // Ensure ImgURL is in the correct format (i.e., the direct image URL)
                    const imageUrl = convertToDirectImageUrl(imgUrl); // Convert if necessary

                    books.push({ title, bookNr, author, price, imageUrl, desc, igLink });
                }
            });

            // After fetching all the books, display them
            displayBooks(books);
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


// Display books in the container
function displayBooks(books) {
    const bookContainer = document.getElementsByClassName("book_container")[0];
    bookContainer.innerHTML = '';  // Clear any existing content in the container

    // Iterate over each book
    books.forEach(book => {
        let bookDiv = document.createElement("div");  // Create a new div for each book
        bookDiv.classList.add("book");  // Add a class to the div for styling

        // Image for the book
        let bookImage = document.createElement("img");
        bookImage.classList.add("book-image");
        bookImage.src = book.imageUrl;  // Set the image URL
        bookImage.alt = book.title + " cover";  // Alt text for the image

        // Title for the book
        let bookTitle = document.createElement("div");
        bookTitle.classList.add("book-title");
        bookTitle.textContent = book.title;

        // Book Number for the book
        let bookNr = document.createElement("div");
        bookNr.classList.add("book-nr");
        bookNr.textContent = `Book No: ${book.bookNr}`;

        // Author for the book
        let bookAuthor = document.createElement("div");
        bookAuthor.classList.add("book-author");
        bookAuthor.textContent = `Author: ${book.author}`;

        // Price for the book
        let bookPrice = document.createElement("div");
        bookPrice.classList.add("book-price");
        bookPrice.textContent = `Price: ${book.price}`;

        // Short description for the book
        let bookDesc = document.createElement("div");
        bookDesc.classList.add("book-desc");
        bookDesc.textContent = book.desc;

        // Instagram link for the book
        let igLink = document.createElement("a");
        igLink.classList.add("book-ig-link");
        igLink.href = book.igLink;
        igLink.textContent = "Instagram Link";
        igLink.target = "_blank";

        // Append all book details to the bookDiv
        bookDiv.appendChild(bookImage);
        bookDiv.appendChild(bookTitle);
        bookDiv.appendChild(bookNr);
        bookDiv.appendChild(bookAuthor);
        bookDiv.appendChild(bookPrice);
        bookDiv.appendChild(bookDesc);
        bookDiv.appendChild(igLink);

        // Append the bookDiv to the container
        bookContainer.appendChild(bookDiv);
    });
}
