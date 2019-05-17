const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const allToys = document.querySelector('#toy-collection')
const toyFormBtn = document.querySelector('.add-toy-form')
let addToy = false

// YOUR CODE HERE

function onSubmit(){
  const toyName = this.name.value
  const toyImg = this.image.value
  event.preventDefault();
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
    },
    body: JSON.stringify({ name: toyName, image: toyImg, likes: 0 })
  })
  .then(resR => resR.json())
  .then(dataR => slapToyOnTheList(dataR))
  toyForm.style.display = 'none'
}

function bindFormSubmit(){
  toyFormBtn.addEventListener("submit", onSubmit)
}

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
    bindFormSubmit()
  } else {
    toyForm.style.display = 'none'
  }
})

function addLikeText(card_json,card_like,card_like_data) {
  console.log(card_json.likes)
  card_like.innerText = `${ card_json.likes } Likes`
  card_like_data.dataset.cardLikes = card_json.likes
}

function addLike() {
  selfId = this.dataset.cardId
  selfLikes = parseInt(this.dataset.cardLikes)
  currentLikes = selfLikes + 1
  likeTextPath = event.path[1].childNodes[2]
  dataLikePath = event.path[1].childNodes[3]

  fetch(`http://localhost:3000/toys/${ selfId }`, {
    method: "PATCH",
    headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
    },
    body: JSON.stringify({ likes: currentLikes })
  })
  .then(resP => resP.json())
  .then(dataP => addLikeText(dataP,likeTextPath,dataLikePath))

  // .then(event.path[1].childNodes[2].innerText = `${ currentLikes } Likes`)
  // .then(event.path[1].childNodes[3].dataset.cardLikes = currentLikes)
}

function slapToyOnTheList(toy) {
  const divTag = document.createElement("div")
  const h2Tag = document.createElement("h2")
  const imgTag = document.createElement("img")
  const pTag = document.createElement("p")
  const buttonTag = document.createElement("button")
  h2Tag.innerText = toy.name
  imgTag.src = toy.image
  imgTag.className = "toy-avatar"
  pTag.innerText = `${toy.likes} Likes`
  buttonTag.innerText = "Like <3"
  buttonTag.className = "like-btn"
  buttonTag.dataset.cardId = toy.id
  buttonTag.dataset.cardLikes = toy.likes
  // buttonTag.dataset.displayLikes
  buttonTag.addEventListener("click", addLike)
  divTag.className = "card"
  divTag.appendChild(h2Tag)
  divTag.appendChild(imgTag)
  divTag.appendChild(pTag)
  divTag.appendChild(buttonTag)
  allToys.appendChild(divTag)
}

function fillToyList(){
  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(data => data.forEach(slapToyOnTheList))
}

// OR HERE!

document.addEventListener("DOMContentLoaded", function(){
 fillToyList()
})
