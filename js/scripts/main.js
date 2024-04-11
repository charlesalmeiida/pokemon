var slide_hero = new Swiper(".slide-hero", {
  effect: "fade",
  pagination: {
    el: ".slide-hero .main-area .area-explore .swiper-pagination",
  },
})

const cardPokemon = document.querySelectorAll(".js-open-details-pokemon")
const btnCloseModal = document.querySelector(".js-close-modal-details-pokemon")
const countPokemons = document.getElementById("js-count-pokemons")

cardPokemon.forEach((card) => {
  card.addEventListener("click", openDetailsPokemon)
})

if (btnCloseModal) {
  btnCloseModal.addEventListener("click", closeDetailsPokemon)
}

const btnDropdownSelect = document.querySelector(".js-open-select-custom")

btnDropdownSelect.addEventListener("click", () => {
  btnDropdownSelect.parentElement.classList.toggle("active")
})

function openDetailsPokemon() {
  document.documentElement.classList.add("open-modal")

  let codePokemon = this.getAttribute("code-pokemon")
  let imagePokemon = this.querySelector(".thumb-img")
  let namePokemon = this.querySelector(".info h3").textContent
  let codePokemonThis = this.querySelector(".info span").textContent

  const modalDetails = document.getElementById("js-modal-details")
  const imagePokemonModal = document.getElementById("js-image-pokemon-modal")
  const imageIconModal = document.getElementById("js-image-type-modal")
  const namePokemonModal = document.getElementById("js-name-pokemon-modal")
  const idPokemonModal = document.getElementById("js-code-pokemon-modal")
  const heightPokemonModal = document.getElementById("js-height-pokemon")
  const weightPokemonModal = document.getElementById("js-weight-pokemon")
  const mainAbilitiesModal = document.getElementById("js-main-abilities")
  const btnMoreAbilites = document.getElementById("js-show-more-abilities")
  const moreAbilitieName = document.getElementById("js-more-abilitie-name")
  const moreAbilitieTwoName = document.getElementById(
    "js-more-abilitie-two-name"
  )
  const modalAbilities = document.getElementById("js-modal-abilities")

  imagePokemonModal.setAttribute("src", imagePokemon.getAttribute("src"))
  modalDetails.setAttribute("type-pokemon-modal", this.classList[1])
  imageIconModal.setAttribute("src", `img/icon-types/${this.classList[1]}.svg`)
  namePokemonModal.textContent = namePokemon
  idPokemonModal.textContent = codePokemonThis

  axios({
    method: "GET",
    url: `https://pokeapi.co/api/v2/pokemon/${codePokemon}`,
  }).then((response) => {
    let data = response.data

    let infoPokemon = {
      mainAbilities: uppercase(data.abilities[0].ability.name),
      types: data.types,
      weight: data.weight,
      heigt: data.height,
      abilities: data.abilities,
      stats: data.stats,
      urlType: data.types[0].type.url,
    }
    moreAbilitieName.textContent = ""
    moreAbilitieTwoName.textContent = ""

    function showMoreAbilities() {
      infoPokemon.abilities.forEach((abilitie, index, array) => {
        console.log(array)
        if (uppercase(array[0].ability.name) === infoPokemon.mainAbilities) {
          moreAbilitieName.textContent = `${uppercase(array[1].ability.name)}`
          moreAbilitieTwoName.textContent = `${uppercase(
            array[2].ability.name
          )}`
        }
      })
    }

    let typePokemon = infoPokemon.types[0].type.name

    btnMoreAbilites.classList = `tag-abilities btn-${typePokemon}`

    function clearTypeClasses() {
      modalAbilities.classList.forEach((className) => {
        if (className.startsWith("type-")) {
          modalAbilities.classList.remove(className)
        }
      })
    }

    btnMoreAbilites.addEventListener("mouseover", () => {
      clearTypeClasses() //]
      modalAbilities.classList.add("active", `type-${typePokemon}`)
      showMoreAbilities()
    })

    // Adiciona a classe relevante ao modal quando o mouse passa sobre o botão
    btnMoreAbilites.addEventListener("mouseover", () => {
      clearTypeClasses() // Limpa as classes "type-" existentes no modal
      modalAbilities.classList.add(`type-${typePokemon}`)
    })

    // Remove a classe relevante do modal quando o mouse deixa o botão
    btnMoreAbilites.addEventListener("mouseleave", () => {
      modalAbilities.classList.remove("active", `type-${typePokemon}`)
    })

    function listingTypesPokenon() {
      let arrayTypes = infoPokemon.types
      const areaTypesModal = document.getElementById("js-types-pokemon")
      areaTypesModal.innerHTML = ""

      arrayTypes.forEach((itemType) => {
        let itemList = document.createElement("li")
        areaTypesModal.appendChild(itemList)

        let spanList = document.createElement("span")
        spanList.classList = `tag-type ${itemType.type.name}`
        spanList.textContent = uppercase(itemType.type.name)
        itemList.appendChild(spanList)
      })
    }

    function listingWeakness() {
      const areaWeak = document.getElementById("js-area-weak")
      areaWeak.innerHTML = ""

      axios({
        method: "GET",
        url: `${infoPokemon.urlType}`,
      }).then((response) => {
        const weakness = response.data.damage_relations.double_damage_from
        weakness.forEach((weak) => {
          const listWeak = document.createElement("li")
          listWeak.classList = `tag-type ${weak.name}`
          listWeak.textContent = uppercase(weak.name)
          areaWeak.appendChild(listWeak)
        })
      })
    }

    heightPokemonModal.textContent = `${infoPokemon.heigt / 10}m`
    weightPokemonModal.textContent = `${infoPokemon.weight / 10}kg`
    mainAbilitiesModal.textContent = infoPokemon.mainAbilities

    listingWeakness()
    listingTypesPokenon()

    const hpStats = document.getElementById("js-stats-hp")
    const attackStats = document.getElementById("js-stats-attack")
    const defenseStats = document.getElementById("js-stats-defense")
    const specialAttack = document.getElementById("js-stats-sp-attack")
    const specialDefense = document.getElementById("js-stats-sp-defense")
    const speedStats = document.getElementById("js-stats-speed")

    hpStats.style.width = `${infoPokemon.stats[0].base_stat}%`
    attackStats.style.width = `${infoPokemon.stats[1].base_stat}%`
    defenseStats.style.width = `${infoPokemon.stats[2].base_stat}%`
    specialAttack.style.width = `${infoPokemon.stats[3].base_stat}%`
    specialDefense.style.width = `${infoPokemon.stats[4].base_stat}%`
    speedStats.style.width = `${infoPokemon.stats[5].base_stat}%`
  })
}

function closeDetailsPokemon() {
  document.documentElement.classList.remove("open-modal")
}

const areaPokemons = document.getElementById("js-list-pokemons")

function uppercase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function createCardPokemon(code, type, nome, imagePoke) {
  let card = document.createElement("button")
  card.classList = `card-pokemon ${type} js-open-details-pokemon`
  card.setAttribute("code-pokemon", code)
  areaPokemons.appendChild(card)

  let image = document.createElement("div")
  image.classList = `image`
  card.appendChild(image)

  let thumbImg = document.createElement("img")
  thumbImg.setAttribute("src", imagePoke)
  thumbImg.classList = `thumb-img`
  image.appendChild(thumbImg)

  let infoPoke = document.createElement("div")
  infoPoke.classList = "info"
  card.appendChild(infoPoke)

  let textDetails = document.createElement("div")
  textDetails.classList = "text"
  infoPoke.appendChild(textDetails)

  let idPoke = document.createElement("span")
  idPoke.textContent =
    code < 10 ? `#00${code}` : code < 100 ? `#0${code}` : `#${code}`
  textDetails.appendChild(idPoke)

  let nomePoke = document.createElement("h3")
  nomePoke.textContent = uppercase(nome)
  textDetails.appendChild(nomePoke)

  let icon = document.createElement("div")
  icon.classList = "icon"
  infoPoke.appendChild(icon)

  let imageIcon = document.createElement("img")
  imageIcon.setAttribute("src", `img/icon-types/${type}.svg`)
  icon.appendChild(imageIcon)

  card.addEventListener("click", openDetailsPokemon)
}

function listingPokemon(urlApi) {
  axios({
    method: "GET",
    url: urlApi,
  }).then((response) => {
    const countPokemons = document.getElementById("js-count-pokemons")
    const { results, count, next } = response.data
    countPokemons.textContent = count

    results.forEach((pokemon) => {
      let pokemonUrl = pokemon.url
      axios({
        method: "GET",
        url: `${pokemonUrl}`,
      }).then((response) => {
        const { name, id, sprites, types } = response.data
        const infocard = {
          nome: name,
          code: id,
          image: sprites.other.dream_world.front_default,
          type: types[0].type.name,
        }
        createCardPokemon(
          infocard.code,
          infocard.type,
          infocard.nome,
          infocard.image
        )
      })
    })
  })
}

listingPokemon("https://pokeapi.co/api/v2/pokemon?limit=9&offset=0")

const areaTypes = document.getElementById("js-type-area")
const areaTypesMobile = document.querySelector(".dropdown-select")

axios({
  method: "GET",
  url: "https://pokeapi.co/api/v2/type",
}).then((response) => {
  const { results } = response.data

  results.forEach((type, index) => {
    if (index < 18) {
      let itemType = document.createElement("li")
      areaTypes.appendChild(itemType)

      let btnType = document.createElement("button")
      btnType.classList = `type-filter ${type.name}`
      btnType.setAttribute("code-type", index + 1)
      itemType.appendChild(btnType)

      let iconType = document.createElement("div")
      iconType.classList = "icon"
      btnType.appendChild(iconType)

      let imgType = document.createElement("img")
      imgType.src = `img/icon-types/${type.name}.svg`
      iconType.appendChild(imgType)

      let nameType = document.createElement("span")
      nameType.textContent = `${uppercase(type.name)}`
      btnType.appendChild(nameType)

      let itemTypeMobile = document.createElement("li")
      areaTypesMobile.appendChild(itemTypeMobile)

      let btnTypeMobile = document.createElement("button")
      btnTypeMobile.classList = `type-filter ${type.name}`
      btnTypeMobile.setAttribute("code-type", index + 1)
      itemTypeMobile.appendChild(btnTypeMobile)

      let iconTypeMobile = document.createElement("div")
      iconTypeMobile.classList = "icon"
      btnTypeMobile.appendChild(iconTypeMobile)

      let imgTypeMobile = document.createElement("img")
      imgTypeMobile.src = `img/icon-types/${type.name}.svg`
      iconTypeMobile.appendChild(imgTypeMobile)

      let nameTypeMobile = document.createElement("span")
      nameTypeMobile.textContent = `${uppercase(type.name)}`
      btnTypeMobile.appendChild(nameTypeMobile)

      const allTypes = document.querySelectorAll(".type-filter")

      allTypes.forEach((btn) => {
        btn.addEventListener("click", filterbyTypes)
      })
    }
  })
})

const btnLoadMore = document.getElementById("js-btn-load-more")
let countPaginationPokemon = 10

function openMorePokemons() {
  listingPokemon(
    `https://pokeapi.co/api/v2/pokemon?limit=9&offset=${countPaginationPokemon}`
  )
  countPaginationPokemon = countPaginationPokemon + 9
}

btnLoadMore.addEventListener("click", openMorePokemons)

function filterbyTypes() {
  let codePokemon = this.getAttribute("code-type")

  const allTypes = document.querySelectorAll(".type-filter")
  const areaPokemons = document.getElementById("js-list-pokemons")
  const btnLoadMore = document.getElementById("js-btn-load-more")
  const countPokemons = document.getElementById("js-count-pokemons")

  areaPokemons.textContent = ""
  btnLoadMore.style.display = "none"
  const sectionPokemons = document.querySelector(".s-all-info-pokemons")
  const topSection = sectionPokemons.offsetTop

  window.scrollTo({
    top: topSection + 288,
    behavior: "smooth",
  })

  allTypes.forEach((type) => {
    type.classList.remove("active")
  })

  this.classList.add("active")

  if (codePokemon) {
    axios({
      method: "GET",
      url: `https://pokeapi.co/api/v2/type/${codePokemon}`,
    }).then((response) => {
      const { pokemon } = response.data

      countPokemons.textContent = pokemon.length

      pokemon.forEach((pok) => {
        const { url } = pok.pokemon

        axios({
          method: "GET",
          url: `${url}`,
        }).then((response) => {
          const { name, id, sprites, types } = response.data
          const infocard = {
            nome: name,
            code: id,
            image: sprites.other.dream_world.front_default,
            type: types[0].type.name,
          }

          if (infocard.image) {
            createCardPokemon(
              infocard.code,
              infocard.type,
              infocard.nome,
              infocard.image
            )
          }
        })
      })
    })
  } else {
    areaPokemons.innerText = ""
    listingPokemon("https://pokeapi.co/api/v2/pokemon?limit=9&offset=0")
    btnLoadMore.style.display = "block"
  }
}

const inputSearch = document.getElementById("js-input-search")
const btnSearch = document.getElementById("js-btn-search")

btnSearch.style.opacity = "40%"
btnSearch.style.pointerEvents = "none"
btnSearch.style.transition = "all .2s ease"

inputSearch.addEventListener("keyup", () => {
  if (inputSearch.value.length != 0) {
    btnSearch.style.opacity = "100%"
    btnSearch.style.pointerEvents = "auto"
  } else if (inputSearch.value.length === 0) {
    btnSearch.style.opacity = "40%"
    btnSearch.style.pointerEvents = "none"
  }
})

btnSearch.addEventListener("click", searchPokemon)

inputSearch.addEventListener("keyup", (event) => {
  if (event.code === "Enter") {
    searchPokemon()
  }
})

function searchPokemon() {
  const typeFilter = document.querySelectorAll(".type-filter")
  typeFilter.forEach((type) => {
    type.classList.remove("active")
  })

  let valueInput = inputSearch.value.toLowerCase()

  axios({
    method: "GET",
    url: `https://pokeapi.co/api/v2/pokemon/${valueInput}`,
  })
    .then((response) => {
      areaPokemons.innerHTML = ""
      btnLoadMore.style.display = "none"
      countPokemons.textContent = "1"

      const { name, id, sprites, types } = response.data
      const infocard = {
        nome: name,
        code: id,
        image: sprites.other.dream_world.front_default,
        type: types[0].type.name,
      }
      createCardPokemon(
        infocard.code,
        infocard.type,
        infocard.nome,
        infocard.image
      )
    })
    .catch((error) => {
      if (error.response) {
        areaPokemons.innerHTML = ""
        btnLoadMore.style.display = "none"
        countPokemons.textContent = "0"
        alert("Não foi encontrado um Pokemon com esta pesquisa")
      }
    })
}
