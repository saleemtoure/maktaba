document.addEventListener("DOMContentLoaded", function () {
    loadBooks();
});

function loadBooks() {
    let books = ["Book 1", "Book 2", "Book 3"];

    // Clear previous books if any
    const bookContainer = document.getElementsByClassName("book_container")[0];
    bookContainer.innerHTML = '';  // Clears existing content inside book_container

    for (let i = 0; i < books.length; i++) {
        let bookDiv = document.createElement("div");  // Create a new div for each book
        bookDiv.classList.add("book");  // Add a class to the div for styling

        // Image for the book (you can replace this with actual book image URLs)
        let bookImage = document.createElement("img");
        bookImage.classList.add("book-image");
        bookImage.src = "/images/100placeholder.jpg";  // Placeholder image
        bookImage.alt = books[i] + " cover";  // Alt text for the image

        // Log the image URL to ensure it's set correctly
        console.log("Image URL:", bookImage.src);

        // Title for the book (middle section over the image)
        let bookTitle = document.createElement("div");
        bookTitle.classList.add("book-title");
        bookTitle.textContent = books[i];

        // Append image and title to the book div
        bookDiv.appendChild(bookImage);
        bookDiv.appendChild(bookTitle);

        // Append the book div to the container
        bookContainer.appendChild(bookDiv);
    }
}
