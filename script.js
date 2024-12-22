//Sikkerhetsmessig:
// API nøkkelen er restricted til å kun kunne brukes fra valge nettaddresser
// SQL injection skal ikke være mulig
// XSS skal heller ikke være mulig fordi jeg tar ikke inn data fra bruker og har kontroll over dataen. Kunne bl.a. brukt textcontent i stedet for innerhtml hvis dette var en risiko
//Derfor jeg kan bruke innerHTML

document.addEventListener("DOMContentLoaded", function () {
    fetchGoogleSheetData();
    searchBarSetup();
    displayBooks(books)
});

// TODO FIX String Literal randomly breaking
const spreadsheetId = "1t4fglWfkJVbSddoe976eucCISS4s8W_4h4zj-R-mk0s";
const sheetId = 0; //Første tab = 0 andre er 1 osv
const sheetName = "nylige"; //Første tab = 0 andre er 1 osv
const restrictedApiKey = "AIzaSyBDQw9Woru2ooYmmsjnRh564xlVYyeYQww";
// const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${restrictedApiKey}`; Slutta å funke for some reason skal væreriktikg backticks
const url = `https://sheets.googleapis.com/v4/spreadsheets/1t4fglWfkJVbSddoe976eucCISS4s8W_4h4zj-R-mk0s/values/nylige?key=AIzaSyBDQw9Woru2ooYmmsjnRh564xlVYyeYQww`;
// Fun fact du kan ikke bruke "" med template literals, men må bruke backtick . Hadde vært fint å huske for 12 timer siden

class Bok {
    constructor(tittel, nr, forfatter, pris, antall, bildeUrl, beskrivelse, igLink) {
        this.tittel = tittel;
        this.nr = nr;
        this.forfatter = forfatter;
        this.pris = pris;
        this.antall = antall;
        this.bildeUrl = bildeUrl;
        this.beskrivelse = beskrivelse;
        this.igLink = igLink;
    }
}

const books = [];

async function fetchGoogleSheetData() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        const rows = data.values;
        // console.log(rows);

        for (let i = 1; i < rows.length; i++) {
            let tittel = rows[i][0];
            let nr = rows[i][1];
            let forfatter = rows[i][2];
            let pris = rows[i][3];
            let antall = rows[i][4];
            let bildeUrl = rows[i][5];
            bildeUrl = convertToEmbed(bildeUrl);
            let beskrivelse = rows[i][6];
            let igLink = rows[i][7];
            if (igLink == undefined) {
                igLink = "https://www.instagram.com/maktabanorulilm/";
            }

            books.push(new Bok(tittel, nr, forfatter, pris, antall, bildeUrl, beskrivelse, igLink));
        }

        displayBooks(books.slice(0, 4));

    } catch (error) {
        console.error('Problem med å hente data fra google sheets', error); //Kan gjøre det her til send meg en mail ellerno + teknisk sett feil feilmelding
    }
}

//Inspired by: https://joe-walton.com/blog/embedding-google-drive-images-in-html-in-2024/ and used with ChatGPT to generate this regex and function
function convertToEmbed(bildeurl) {
    const driveRegex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view\?usp=[a-zA-Z0-9_=&-]+/;
    const match = bildeurl.match(driveRegex);

    if (match && match[1]) {
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
    }

    //Hvis bildet ikke kan returneres så returneres en placeholder med info
    return "https://raw.githubusercontent.com/saleemtoure/maktaba/7d9a7616b0f3d8f32176fbd658c0a49ec1733457/images/cant-load-picture.png";
}

const bookContainer = document.getElementById('book-container') //Fun fact getElement... er O(1) mens queryselector er O(n)
function makeBookDisplay(book) {
    // console.log(book); Make sure the fields work - remember to change all mentions of a field when changing field/variable nam

    let bookDiv = document.createElement("div");
    bookDiv.classList.add("bookDiv");

    let bookDetaljer = document.createElement("div");
    bookDetaljer.classList.add("book-detaljer");

    let bookTittel = document.createElement("div");
    bookTittel.classList.add("book-tittel");
    bookTittel.textContent = book.tittel;

    let bookNr = document.createElement("div");
    bookNr.classList.add("book-nr");
    bookNr.textContent = `Bok Nr: ${book.nr}`;

    let bookForfatter = document.createElement("div");
    bookForfatter.classList.add("book-forfatter");
    bookForfatter.textContent = `av: ${book.forfatter}`;

    let bookPris = document.createElement("div");
    bookPris.classList.add("book-pris");
    bookPris.textContent = `Pris: ${book.pris} kr`;

    let bookAntall = document.createElement("div");
    bookAntall.classList.add("book-antall");
    bookAntall.textContent = `Antall: ${book.antall}`;

    bookDetaljer.appendChild(bookTittel);
    // bookDetaljer.appendChild(bookNr);
    bookDetaljer.appendChild(bookForfatter);
    bookDetaljer.appendChild(bookPris);
    bookDetaljer.appendChild(bookAntall);

    let bookBilde = document.createElement("img");
    bookBilde.classList.add("book-bilde");
    bookBilde.src = book.bildeUrl;
    bookBilde.alt = book.bokTittel + " cover";

    let bookBeskrivelse = document.createElement("div");
    bookBeskrivelse.classList.add("book-beskrivelse");
    bookBeskrivelse.textContent = book.beskrivelse;

    let igLink = document.createElement("a");
    igLink.classList.add("ig-link");
    igLink.href = book.igLink;
    igLink.textContent = "Mer info";
    igLink.target = "_blank";

    bookDiv.appendChild(bookBilde);
    bookDiv.appendChild(bookDetaljer);
    bookDiv.appendChild(bookBeskrivelse);
    bookDiv.appendChild(igLink);

    bookContainer.appendChild(bookDiv);
}

function displayBooks(books) {
    bookContainer.innerHTML = '';
    books.forEach(makeBookDisplay);
}


window.allBooks = books;
function searchBarSetup() {

    const searchBar = document.getElementById("searchBar");
    const antallTreff = document.getElementById("antallTreff")
    antallTreff.innerHTML = "Våre nyligste bøker";

    searchBar.addEventListener("input", function () {
        const search = searchBar.value.toLowerCase();

        if (search == "") {
            antallTreff.innerHTML = "Våre nyligste bøker:";
            displayBooks(window.allBooks.slice(0, 4));
            return;
        }

        const resultater = window.allBooks.filter(function (book) {
            return book.tittel.toLowerCase().includes(search) ||
                book.forfatter.toLowerCase().includes(search) ||
                book.beskrivelse.toLowerCase().includes(search);
        });

        //Inspired by a snippet from:https://webdesign.tutsplus.com/how-to-build-a-search-bar-with-javascript--cms-107227t
        if (resultater.length > 0) {
            antallTreff.style.opacity = 1;
            if (resultater.length == 1) {
                antallTreff.innerHTML = "Ett resultat funnet"
            }
            else {
                antallTreff.innerHTML = `${resultater.length} resultater funnet`
            }
        } else {
            antallTreff.innerHTML = "Ingen resultater. Sjekk våre sosiale medier!"
        }

        displayBooks(resultater)
    });
}

//TODO: Mobile responsiveness
//* Ide: Fjern de med antall 0 fra søkresultat for å unngå for mange resultater?
//!Restrict apien - den er åpen for testing nå
