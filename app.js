const listGroup = document.querySelector(".list-group")
const navTabs = document.querySelector(".nav-tabs")
const navLinks = Array.from(document.querySelectorAll(".nav-link"))
const paginationArr = Array.from(document.querySelector(".pagination").children)
const paginationEl = document.querySelector(".pagination")
const spinner = document.getElementById("spinner")
const modalSpinner = document.getElementById("modal-spinner")
const modalTable = document.getElementById("modal-table")
const modal = document.getElementById("modal")
const luckyBtn = document.getElementById("lucky-btn")
const searchBtn = document.getElementById("search-btn")
const searchInputGroup = document.getElementById("search-input-group")
const searchInput = document.getElementById("search-input")
const searchSelect = document.getElementById("search-select")
let searchSelectValue

let globalDataObject

function navTabsHandler(e) {
    e.preventDefault()
    navLinks.forEach((link) => {
        link.classList.remove("active")
    })
    e.target.classList.add("active")
    const apiUrlSuffix = e.target.getAttribute("data-link")
    listGroup.innerHTML = ""
    spinner.classList.remove("d-none")
    getData(`https://swapi.dev/api/${apiUrlSuffix}`).then((dataObj) =>
        renderListGroup(dataObj, e)
    )
}

async function getData(url) {
    const response = await fetch(url)
    const data = await response.json()
    spinner.classList.add("d-none")
    return data
}

function renderListGroup(dataObj, e) {
    listGroup.innerHTML = ""
    let dataIndex = 0
    globalDataObject = dataObj.results
    dataObj.results.forEach((asset) => {
        const li = document.createElement("li")
        li.classList.add(
            "list-group-item",
            "d-flex",
            "justify-content-between",
            "align-items-center"
        )
        const button = document.createElement("button")
        button.classList.add("btn", "btn-primary")
        button.textContent = "show"
        button.setAttribute("data-index", dataIndex)
        dataIndex++
        button.setAttribute("data-bs-toggle", "modal")
        button.setAttribute("data-bs-target", "#modal")

        li.textContent = asset.name || asset.title
        li.appendChild(button)
        listGroup.appendChild(li)
    })
    renderPagitation(dataObj, e)
}

function renderPagitation(dataObj, e) {
    paginationArr.forEach((li) => {
        if (li.classList.contains("active")) {
            li.classList.remove("active")
        }
    })
    if (paginationArr[0].classList.contains("disabled")) {
        paginationArr[0].classList.remove("disabled")
    }
    if (paginationArr[6].classList.contains("disabled")) {
        paginationArr[6].classList.remove("disabled")
    }
    paginationArr[0].parentElement.parentElement.classList.remove("d-none")

    const maxIndex = Math.ceil(dataObj.count / 10)

    let currentPageIndx
    let url
    if (dataObj.next !== null) {
        currentPageIndx =
            Number(
                dataObj.next.slice(dataObj.next.length - 1, dataObj.next.length)
            ) - 1
        url = dataObj.next.slice(0, dataObj.next.length - 8)
    } else if (dataObj.previous !== null) {
        currentPageIndx =
            Number(
                dataObj.previous.slice(
                    dataObj.previous.length - 1,
                    dataObj.previous.length
                )
            ) + 1
        url = dataObj.previous.slice(0, dataObj.previous.length - 8)
    } else {
        paginationArr[0].parentElement.parentElement.classList.add("d-none")
        return
    }

    // previous
    paginationArr[0].children[0].setAttribute(
        "data-link",
        dataObj.previous ?? paginationArr[0].classList.add("disabled")
    )

    // 1
    paginationArr[1].children[0].textContent = 1
    paginationArr[1].children[0].setAttribute("data-link", `${url}/?page=1`)

    if (currentPageIndx === maxIndex) {
        // 2
        paginationArr[2].children[0].setAttribute(
            "data-link",
            `${url}/?page=${currentPageIndx - 2}`
        )
        paginationArr[2].children[0].textContent = currentPageIndx - 2

        // 3
        paginationArr[3].children[0].setAttribute(
            "data-link",
            `${url}/?page=${currentPageIndx - 1}`
        )
        paginationArr[3].children[0].textContent = currentPageIndx - 1
    } else if (currentPageIndx === maxIndex - 1) {
        // 2
        paginationArr[2].children[0].setAttribute(
            "data-link",
            `${url}/?page=${currentPageIndx - 1}`
        )
        paginationArr[2].children[0].textContent = currentPageIndx - 1

        // 3
        paginationArr[3].children[0].setAttribute(
            "data-link",
            `${url}/?page=${currentPageIndx}`
        )
        paginationArr[3].children[0].textContent = currentPageIndx
    } else if (currentPageIndx === 1) {
        // 2
        paginationArr[2].children[0].setAttribute(
            "data-link",
            `${url}/?page=${currentPageIndx + 1}`
        )
        paginationArr[2].children[0].textContent = currentPageIndx + 1

        // 3
        paginationArr[3].children[0].setAttribute(
            "data-link",
            `${url}/?page=${currentPageIndx + 2}`
        )
        paginationArr[3].children[0].textContent = currentPageIndx + 2
    } else {
        // 2
        paginationArr[2].children[0].setAttribute(
            "data-link",
            `${url}/?page=${currentPageIndx}`
        )
        paginationArr[2].children[0].textContent = currentPageIndx

        // 3
        paginationArr[3].children[0].setAttribute(
            "data-link",
            `${url}/?page=${currentPageIndx + 1}`
        )
        paginationArr[3].children[0].textContent = currentPageIndx + 1
    }

    // max
    paginationArr[5].children[0].setAttribute(
        "data-link",
        `${url}/?page=${maxIndex}`
    )
    paginationArr[5].children[0].textContent = maxIndex

    // next
    paginationArr[6].children[0].setAttribute(
        "data-link",
        dataObj.next ?? paginationArr[6].classList.add("disabled")
    )

    if (e.type === "load" || currentPageIndx === 1) {
        paginationArr[1].classList.add("active")
    } else if (currentPageIndx === maxIndex) {
        paginationArr[5].classList.add("active")
    } else if (currentPageIndx === maxIndex - 1) {
        paginationArr[3].classList.add("active")
    } else {
        paginationArr[2].classList.add("active")
    }
}

function paginationHandler(e) {
    if (e.target.classList.contains("disabled")) return
    paginationArr.forEach((li) => {
        if (li.classList.contains("active")) {
            li.classList.remove("active")
        }
    })
    if (
        e.target.textContent !== "Previous" &&
        e.target.textContent !== "Next"
    ) {
        e.target.parentElement.classList.add("active")
    }
    const dataLink = e.target.getAttribute("data-link")
    listGroup.innerHTML = ""
    spinner.classList.remove("d-none")
    getData(dataLink).then((dataObj) => renderListGroup(dataObj, e))
}

function firstLoadHandler(e) {
    listGroup.innerHTML = ""
    spinner.classList.remove("d-none")
    getData("https://swapi.dev/api/people/").then((dataObj) =>
        renderListGroup(dataObj, e)
    )
}

function listGroupHandler(e) {
    if (e.target.tagName !== "BUTTON") return
    const index = e.target.getAttribute("data-index")
    modalSpinner.classList.remove("d-none")
    searchSelect.classList.add("d-none")
    searchInputGroup.classList.add("d-none")
    modalTable.innerHTML = ""
    renderModal(globalDataObject[index])
}

function renderModal(dataObj) {
    for (let property in dataObj) {
        if (
            property === "url" ||
            property === "created" ||
            property === "edited"
        ) {
            continue
        }
        // рандомні номера не завжди мають дані
        // повторний запит на такий випадок
        if (dataObj[property] === "Not found") {
            luckyBtnHandler()
            return
        }

        let buttonIndex = 0
        const tr = document.createElement("tr")
        const thKey = document.createElement("th")
        thKey.textContent = property
        const tdValue = document.createElement("td")
        if (property === "name") {
            tr.classList.add("table-primary")
        }
        if (Array.isArray(dataObj[property]) && dataObj[property].length > 0) {
            dataObj[property].forEach((element) => {
                addButton(buttonIndex, element, tdValue)
                buttonIndex++
            })
        } else if (`"${dataObj[property]}"`.slice(0, 9) == '"https://') {
            addButton(buttonIndex, dataObj[property], tdValue)
        } else {
            tdValue.textContent = dataObj[property]
        }
        tr.appendChild(thKey)
        tr.appendChild(tdValue)
        modalTable.appendChild(tr)
    }
    modalSpinner.classList.add("d-none")
    function addButton(buttonIndex, link, tdValue) {
        const button = document.createElement("button")
        button.classList.add("btn", "btn-primary")
        button.textContent = `show ${buttonIndex + 1}`
        button.setAttribute("data-link", link)
        tdValue.appendChild(button)
        tdValue.classList.add("flex-table-cell")
    }
}

function modalHandler(e) {
    if (e.target.tagName !== "BUTTON") return
    const url = e.target.getAttribute("data-link")
    modalSpinner.classList.remove("d-none")
    searchSelect.classList.add("d-none")
    searchInputGroup.classList.add("d-none")
    modalTable.innerHTML = ""
    getData(url).then((dataObj) => renderModal(dataObj))
}

function luckyBtnHandler() {
    const baseUrl = "https://swapi.dev/api"

    // я знаю шо це хардкод і так не можна
    // але апі дуже повільний
    // і робити багато запитів не хочеться
    const endpoints = [
        ["people", 82],
        ["planets", 60],
        ["starships", 36],
        ["films", 6],
        ["vehicles", 39],
        ["species", 37],
    ]

    const randomArr = endpoints[Math.floor(Math.random() * endpoints.length)]
    const randomNumber = Math.floor(Math.random() * randomArr[1])
    const url = `${baseUrl}/${randomArr[0]}/${randomNumber}`
    modalSpinner.classList.remove("d-none")
    searchSelect.classList.add("d-none")
    searchInputGroup.classList.add("d-none")
    modalTable.innerHTML = ""
    getData(url).then((dataObj) => renderModal(dataObj))
}

function searchBtnHandler(e) {
    modalTable.innerHTML = ""
    modalSpinner.classList.add("d-none")
    searchSelect.classList.remove("d-none")
    searchInputGroup.classList.remove("d-none")
}

function delay(fn, ms) {
    let timer = 0
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(fn.bind(this, ...args), ms || 0)
    }
}

function searchInputHandler(e) {
    const searchQuery = e.target.value
    const url = `https://swapi.dev/api/${searchSelectValue}/?search=${searchQuery}`
    modalSpinner.classList.remove("d-none")
    getData(url).then((dataObj) => renderSearchResults(dataObj.results))
}

function searchSelectHandler(e) {
    searchSelectValue = e.target.value
}

function renderSearchResults(results) {
    modalSpinner.classList.add("d-none")
    modalTable.innerHTML = ""
    results.forEach((result) => {
        renderModal(result)
    })
}

navTabs.addEventListener("click", navTabsHandler)
paginationEl.addEventListener("click", paginationHandler)
listGroup.addEventListener("click", listGroupHandler)
modal.addEventListener("click", modalHandler)
luckyBtn.addEventListener("click", luckyBtnHandler)
searchBtn.addEventListener("click", searchBtnHandler)
searchSelect.addEventListener("input", searchSelectHandler)
searchInput.addEventListener("keyup", delay(searchInputHandler, 500))
window.addEventListener("load", firstLoadHandler)
