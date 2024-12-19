document.addEventListener("DOMContentLoaded", function () {
    loadBooks();
});

function loadBooks() {
    // Define a map with book titles as keys and [imageURL, description] as values
    let books = new Map([
        ["Book 1", ["https://placecats.com/100/100", "Description of Book 1"]],
        ["Book 2", ["https://placecats.com/100/100", "Description of Book 2"]],
        ["Book 3", ["https://placecats.com/100/100", "Description of Book 3"]]
    ]);

    // Clear previous books if any
    const bookContainer = document.getElementsByClassName("book_container")[0];
    bookContainer.innerHTML = '';  // Clears existing content inside book_container

    // Iterate over the map
    books.forEach((value, title) => {
        let bookDiv = document.createElement("div");  // Create a new div for each book
        bookDiv.classList.add("book");  // Add a class to the div for styling

        // Image for the book (get the image URL from the map)
        let bookImage = document.createElement("img");
        bookImage.classList.add("book-image");
        bookImage.src = value[0];  // Set the src to the image URL from the map
        bookImage.alt = title + " cover";  // Alt text for the image

        // Log the image URL to ensure it's set correctly
        console.log("Image URL:", bookImage.src);

        // Title for the book (middle section over the image)
        let bookTitle = document.createElement("div");
        bookTitle.classList.add("book-title");
        bookTitle.textContent = title;  // Set the title from the map key

        // Append image and title to the book div
        bookDiv.appendChild(bookImage);
        bookDiv.appendChild(bookTitle);

        // Append the book div to the container
        bookContainer.appendChild(bookDiv);
    })
}
