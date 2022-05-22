const BASE_URL = "https://restcountries.com/v3.1/all"

const app = document.querySelector("#app")
const main_container = document.createElement("section")
const search_container = document.createElement("section")
const page_container = document.createElement("section")
const countries_list_raw = []
let countries_list = []
let current_page = 1
let total_countries = 0
let total_page = 0
let per_page = 25

document.body.className = "flex items-center justify-center bg-stone-100 py-10"
app.className = "max-w-[90%] w-[780px] text-stone-700"

const getAllCountries = async () => {
  try {
    const response = await fetch(BASE_URL)
    const result = await response.json()
    const results_ordered = result.sort((a, b) =>
      a.name.common.localeCompare(b.name.common)
    )
    countries_list_raw.push(...results_ordered)
    total_countries = countries_list_raw.length
    total_page = total_countries / per_page
    formatPages()
    createElementsInDom()
  } catch (error) {
    console.error(error)
  }
}

const formatPages = () => {
  countries_list = []
  const countries_list_temp = countries_list_raw.slice(
    (current_page - 1) * per_page,
    per_page * current_page
  )
  countries_list.push(...countries_list_temp)
}

const createElementsInDom = () => {
  getCountriesByPage()
  createSearchContainer()
  createPaginatorContainer()

  main_container.setAttribute("id", "main_container")
  main_container.className =
    "grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3"

  app.append(main_container)
  app.insertAdjacentElement("afterbegin", search_container)
  app.insertAdjacentElement("beforeend", page_container)
}

const getPrevNextPage = (value) => {
  value ? current_page++ : current_page--
  next_button.disabled = total_page == current_page
  prev_button.disabled = current_page == 1
  const current_page_show = document.getElementById("current_page_show")
  current_page_show.textContent = "page: " + current_page
  formatPages()
  getCountriesByPage()
}

const getCountriesByPage = () => {
  const cards = document.querySelectorAll('.card-container')
  cards.forEach(card => card.remove())
  const countries_items = mapAllCountriesInCard()
  main_container.append(...countries_items)
}

const createSearchContainer = () => {
  // Add search container || title page || input search
  const title_page = document.createElement("h2")
  title_page.className = "mb-5 text-3xl font-bold"
  title_page.textContent = "Select a country"

  const input_search = document.createElement("input")
  input_search.onkeyup = (e) => searchByName(e.target.value)
  input_search.className =
    "w-[300px] max-w-full h-[48px] px-3 rounded " +
    "focus:outline-none focus:border-blue-500 focus:border"
  input_search.type = "search"
  input_search.placeholder = "Search by name"

  search_container.className = "text-center mb-5"
  search_container.append(title_page, input_search)
}

const createPaginatorContainer = () => {
  // Add paginator container || num of pages
  const total_page_show = document.createElement("small")
  total_page_show.textContent = total_page + " pages"

  const total_countries_show = document.createElement("small")
  total_countries_show.textContent = total_countries + "  countries"

  const current_page_show = document.createElement("small")
  current_page_show.textContent = "page: " + current_page
  current_page_show.setAttribute("id", "current_page_show")

  const counter_items = document.createElement("div")
  counter_items.className = "text-sm flex items-center gap-2"
  counter_items.append(total_page_show, total_countries_show, current_page_show)

  const prev_button = document.createElement("button")
  prev_button.disabled = current_page == 1
  prev_button.className =
    "bg-white hover:shadow hover:shadow-blue-500 hover:bg-blue-500 py-3 px-5 rounded hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
  prev_button.setAttribute("id", "prev_button")
  prev_button.textContent = "Prev"
  prev_button.addEventListener("click", () => getPrevNextPage(false))

  const next_button = document.createElement("button")
  next_button.disabled = total_page == current_page
  next_button.className =
    "bg-white hover:shadow hover:shadow-blue-500 hover:bg-blue-500 py-3 px-5 rounded hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
  next_button.setAttribute("id", "next_button")
  next_button.textContent = "Next"
  next_button.addEventListener("click", () => getPrevNextPage(true))

  const next_prev_container = document.createElement("div")
  next_prev_container.className = "text-sm flex items-center gap-2"
  next_prev_container.append(prev_button, next_button)

  page_container.className = "mt-5 flex items-center justify-between"
  page_container.append(counter_items, next_prev_container)
}

const mapAllCountriesInCard = () => {
  const countries_items = countries_list.map((country) => {
    const image_country = document.createElement("img")
    image_country.className = "w-[25px] h-[20px] object-cover rounded"
    image_country.src = country?.flags.png

    const title_country = document.createElement("h3")
    title_country.className = "truncate font-semibold"
    title_country.textContent = country.name.common

    const card = document.createElement("div")
    card.className =
      "bg-white rounded-lg py-3 px-5 flex items-center gap-5 " +
      "bg-white rounded hover:shadow-md cursor-pointer hover:shadow-blue-500 " +
      "hover:bg-blue-500 hover:text-white ease-in-out duration-300 card-container"
    card.appendChild(image_country)
    card.appendChild(title_country)

    return card
  })
  return countries_items
}

const searchByName = (value) => {
  const cards = document.querySelectorAll('.card-container')
  cards.forEach(card => card.remove())
  if (value.length > 0) {
    page_container.classList.add('hidden')
    countries_list = []
    const countries_list_temp = countries_list_raw.filter((country) => {
      const countryLower = country.name.common.toLowerCase()
      const valueLower = value.toLowerCase()
      return countryLower.includes(valueLower)
    } )
    countries_list.push(...countries_list_temp)
  } else {
    page_container.classList.remove('hidden')
    formatPages()
  }
  const countries_items = mapAllCountriesInCard()
  main_container.append(...countries_items)
}

getAllCountries()
