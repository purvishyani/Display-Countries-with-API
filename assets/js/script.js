let fetchData = [], currentPageData = [], searchedData = [];
let selectedItem;
let region = document.querySelectorAll('.dropdown-item');
let selectedRegion = document.getElementById("selected-region");
const searchCountry = document.getElementById("search-country");
const addCountry = document.getElementById("country");

if (selectedRegion) {
    selectedItem = (selectedRegion.innerText).toLowerCase();
}

// -------------------- PAGINATION -----------------------

const paginationElement = document.querySelector(".pagination ul");
let page = 1, skip = 0;
let itemsperPage = 12;

const indexPage = document.getElementById("index-page");
if (indexPage) {
    indexPage.onload = loadIndexPage;
}
function loadIndexPage() {
    if (sessionStorage.getItem("dark-mode") === "1") {
        darkModeOn();
    }
    else {
        sessionStorage.setItem("dark-mode", 0);
    }
    fetchAPI();
}

function fetchAPI() {
    fetch(`https://restcountries.com/v3.1/all`)
        .then(response => { return response.json(); })
        .then(result => {
            fetchData = result;
            totalPages = Math.ceil(fetchData.length / itemsperPage);
            paginationElement.innerHTML = createPagination(totalPages, page);
        });
}

function createPagination(totalPages, page) {

    skip = 12 * (page - 1);

    fetchCountryDetails();

    if (sessionStorage.getItem("dark-mode") === "1") {
        darkModeCountries();
    }

    let liTag = '';
    let maxPagesToShow = 3;
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (page > 1) {
        liTag += `<li class="btn prev" onclick="createPagination(${totalPages}, ${page - 1})"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
    }

    if (startPage > 1) {
        liTag += `<li class="first numb" onclick="createPagination(${totalPages}, 1)"><span>1</span></li>`;
        if (startPage > 2) {
            liTag += `<li class="dots"><span>...</span></li>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === page ? 'active' : '';
        liTag += `<li class="numb ${activeClass}" onclick="createPagination(${totalPages}, ${i})"><span>${i}</span></li>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            liTag += `<li class="dots"><span>...</span></li>`;
        }
        liTag += `<li class="last numb" onclick="createPagination(${totalPages}, ${totalPages})"><span>${totalPages}</span></li>`;
    }

    if (page < totalPages) {
        liTag += `<li class="btn next" onclick="createPagination(${totalPages}, ${page + 1})"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
    }

    paginationElement.innerHTML = liTag;

    return liTag;
}

function fetchCountryDetails() {

    if (addCountry) { addCountry.innerHTML = ""; }

    if (!searchCountry.value && (selectedRegion.innerText === "Filter By Region" || selectedRegion.innerText === "All")) {
        fetchData.forEach(country => {
            currentPageData.push(country);
        });
        let selectedData = currentPageData.slice(skip, (skip + 12));

        selectedData.forEach(country => {
            displayData(country.name.common, country.population, country.region, country.capital, country.flags.png);
        });
        while (currentPageData.length > 0) {
            currentPageData.pop();
        }
    }

    let searched = searchedData.slice(skip, (skip + 12));
    searched.forEach(country => {
        displayData(country.name.common, country.population, country.region, country.capital, country.flags.png);
    });


}

// DISPLAY COUNTRY WISE DATA
if (searchCountry) {
    searchCountry.oninput = searchForCountry;
}

function searchForCountry() {
    while (searchedData.length > 0) {
        searchedData.pop();
    }
    if (selectedItem === "all" && !searchCountry.value) {
        fetchAPI();

    }
    else if (selectedItem === "filter by region" && searchCountry.value
        || selectedItem === "all" && searchCountry.value) {
        fetchData.forEach(country => {
            if ((country.name.common.toLowerCase()).includes(searchCountry.value.toLowerCase())) {
                searchedData.push(country);
            }
        });
    }
    else {
        fetchData.forEach(country => {
            if (country.region.toLowerCase() === selectedItem) {
                if ((country.name.common.toLowerCase()).includes(searchCountry.value.toLowerCase())) {
                    searchedData.push(country);
                }
            }
        });
    }

    if (searchedData.length < itemsperPage) {
        totalPages = 1;
    }
    else {
        totalPages = Math.ceil(searchedData.length / itemsperPage);
    }
  

    if ((searchedData.length === 0 || !searchCountry.value) ) {
       
        document.querySelector(".hidden-content").style.display = "flex";
        document.querySelector(".pagination").style.display = "none";
    }
    else{

        document.querySelector(".hidden-content").style.display = "none";
        document.querySelector(".pagination").style.display = "flex";
    }
    createPagination(totalPages, page);

}

// DISPLAY REGION WISE

for (let i = 0; i < region.length; i++) {

    region[i].addEventListener('click', function (e) {
        while (searchedData.length > 0) {
            searchedData.pop();
        }
        document.getElementById("selected-region").innerText = e.target.innerText;
        selectedItem = (document.getElementById("selected-region").innerText).toLowerCase();
        if (selectedItem === "all" && !searchCountry.value) {

            fetchAPI();
        }

        fetchData.forEach(country => {
            if (selectedItem === "all" && searchCountry.value) {

                let input = document.getElementById("search-country").value;
                if ((country.name.common.toLowerCase()).includes(input.toLowerCase())) {

                    searchedData.push(country);
                }
            }
            else if (selectedItem) {
                if (country.region.toLowerCase() === selectedItem) {

                    let input = document.getElementById("search-country").value;
                    if ((country.name.common.toLowerCase()).includes(input.toLowerCase())) {
                        searchedData.push(country);
                    }
                }
            }
            else if (country.region.toLowerCase() === selectedItem) {
                searchedData.push(country);
            }

        });

        if (searchedData.length < itemsperPage) {
            totalPages = 1
        }
        else {
            totalPages = Math.ceil(searchedData.length / itemsperPage);
        }
        createPagination(totalPages, page);

    });
}
let id = 0;
// FILERT DATA
function displayData(countryName, population, region, capital, flag) {

    id++;
    if (addCountry) {
        addCountry.innerHTML +=
            `<div class="col-3">
            <a class="select-country"  onclick="getSelectedCountry(this)" >
                <div class="country">
                    <div class="flag">
                        <img src="${flag}"
                    </div>
                    <div class="country-details">
                        <div class="country-title">
                            <span id="selected-${id}">${countryName}</span>
                        </div>
                        <div class="country-info">
                            <span><b>Population:</b> &nbsp${population}</span>
                            <span><b>Region: </b> &nbsp${region}</span>
                            <span><b>Capital:</b> &nbsp ${capital}</span>
                        </div>
                    </div>
                </div>
            </a>
        </div>`
    }
}

document.getElementById("dark-mode").addEventListener("click", () => {


    if (sessionStorage.getItem("dark-mode") === "1") {
        sessionStorage.setItem("dark-mode", 0);
        document.getElementById("index-page").classList.add("dark-mode");
    }
    else if (sessionStorage.getItem("dark-mode") === "0") {

        sessionStorage.setItem("dark-mode", 1);
        document.getElementById("index-page").classList.remove("dark-mode");
    }
    // darkModeOn();
});

// function darkModeOn() {
//     let element = document.body;
//     if

//     // element.classList.toggle("dark-mode");
//     document.querySelector(".header").classList.toggle("dark-mode");
//     document.querySelector("#dark-mode").classList.toggle("dark-mode");

//     if (document.querySelector("#search-country")) {
//         document.querySelector("#search-country").classList.toggle("dark-mode-input");
//     }

//     if (document.querySelector(".dropdown-menu")) {
//         document.querySelector(".dropdown-menu").classList.toggle("dark-mode-input");
//     }

//     const nodeList = document.querySelectorAll(".dropdown-item");
//     for (let i = 0; i < nodeList.length; i++) {
//         nodeList[i].classList.toggle("dark-mode-input");;
//     }

//     if (document.querySelector(".btn-filter")) {
//         document.querySelector(".btn-filter").classList.toggle("dark-mode-input");
//     }

//     if (document.querySelector("#btn-back")) {
//         document.querySelector("#btn-back").classList.toggle("dark-mode-input");
//     }

//     if (document.querySelector(".pagination ul")) {
//         document.querySelector(".pagination ul").classList.toggle("dark-mode-input");
//     }
//     darkModeCountries();
// }
function darkModeCountries() {
    if (document.querySelector(".country-details")) {
        const countries = document.querySelectorAll(".country-details");
        for (let i = 0; i < countries.length; i++) {
            countries[i].classList.toggle("dark-mode");
        }
    }
}

// ----------------COUNTRY DETAILS PAGE ----------------
const backButton = document.getElementById("btn-back");
const countryPage = document.getElementById("country-detail-page");
if (countryPage) {
    countryPage.onload = countryDetailPage;
}

if (backButton) {
    backButton.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}


function countryDetailPage() {

    fetch(`https://restcountries.com/v3.1/all`)
        .then(response => { return response.json(); })
        .then(result => {
            fetchData = result;
            displayCountryData();
        });

}
function getSelectedCountry(selectedIndex) {
    let data = selectedIndex.querySelector('.country-title span').id;
    let countryName = document.getElementById(data).innerText;
    let darkMode = sessionStorage.getItem('dark-mode');
    let inputUrl = `http://127.0.0.1:5500/country.html?mode=${darkMode}&name=${countryName}`;
    window.location.href = inputUrl;
    displayCountryData();
}

function displayCountryData() {

    let urlString = window.location.href;
    let paramString = decodeURIComponent(urlString.split('=')[2]);
    let mode = decodeURIComponent(urlString.split('=')[1]);
    if (mode.includes("1")) {
        darkModeOn();
    }

    let name = document.getElementById("country-name");
    let flag = document.getElementById("country-flag");

    fetchData.forEach(country => {
        let matchName = country.name.common.toLowerCase();

        if (matchName === paramString.toLowerCase()) {
            name.innerText = `${country.name.common}`;
            flag.src = `${country.flags.png}`;
            document.getElementById("official-name").innerHTML = `${country.name.official}`;
            document.getElementById("independent").innerHTML = `${country.independent}`;
            document.getElementById("status").innerHTML = `${country.status}`;
            document.getElementById("sub-region").innerHTML = `${country.subregion}`;
            document.getElementById("area").innerHTML = `${country.area}`;
            let language = country.languages;
            let languageValue = Object.values(language);

            document.getElementById("language").innerHTML = `${languageValue}`;

            let currency = country.currencies;
            let currencyValue = Object.values(currency);
            let currencyName, symbol;

            currencyValue.forEach(value => {
                currencyName = value.name;
                symbol = value.symbol;
            });

            document.getElementById("currency").innerHTML = `<b>Name:</b> ${currencyName} &nbsp <b>Symbol: </b> ${symbol}`
        }

    });
}
