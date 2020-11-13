console.log("Zoom Zoom!")

const carUrl = 'http://localhost:3000/api/v1/models'
const carsNav = document.querySelector('nav')
const carNavUl = carsNav.querySelector(`ul`)
const carImg = document.querySelector(`#car-img`)
const carModel = document.querySelector(`#car-model`)
const carSpec = document.querySelector(`#spec-list`)
const carDesc = document.querySelector(`#car-info`)
const carYear = document.querySelector(`#year`)
const carMsrp = document.querySelector(`#msrp`)
const carType = document.querySelector(`#car_type`)
const carHp = document.querySelector(`#hp`)
const carTorq = document.querySelector(`#torque`)
const carMpg = document.querySelector(`#mpg`)
const carSeats = document.querySelector(`#seats`)
const carReview = document.querySelector("#car-review")

function init() {
    fetch(carUrl)
    .then(resp => resp.json())
    .then(carsArray => carNav(carsArray))
}

const getCarById = (id) => {
    fetch(carUrl+"/"+id)
        .then(resp => resp.json())
        .then(carObj => renderReviews(carObj))
}

function carNav(carsArray) {
    carsArray.forEach(car => {
        const li = document.createElement("li")
        li.innerText = car.name
        li.id = car.id
        li.addEventListener("click", function(event){
            const specCarUrl = carUrl +`/${li.id}`
            fetch(specCarUrl)
            .then(r=>r.json())
            .then(carObj => {
                renderCar(carObj)
                renderReviews(carObj)} )
            })
        carNavUl.append(li)
    })
}

function renderCar(carObj){
    carImg.src = carObj.image
    carImg.alt = carObj.name
    carModel.innerText = carObj.name
    carDesc.innerText = carObj.description
    carYear.innerText = `Year: ${carObj.year}`
    carMsrp.innerText = `MSRP: ${carObj.msrp}`
    carType.innerText = `Type: ${carObj.car_type}`
    carHp.innerText = `HP: ${carObj.hp}`
    carTorq.innerText = `Torque: ${carObj.torque}`
    carMpg.innerText = `MPG: ${carObj.mpg}`
    carSeats.innerText = `Seats: ${carObj.seats}`
    carReview.dataset.id = carObj.id
}

function renderReviews(carObj) {
    const reviewList = document.querySelector("#review-list")
        while (reviewList.firstElementChild) {
            reviewList.firstElementChild.remove()
        }

    
    const reviewArray = carObj.reviews
    reviewArray.forEach(review => {
        const li = document.createElement("li")
        li.innerText = review.review
        const editForm = document.createElement("form")
        editForm.dataset.id = review.id
        editForm.innerHTML = `
            <label for="review">Edit:</label>
            <input type="textfield" name="review" placeholder="${review.review}">
            <input type="submit" value="Submit"></input><br><br>`

        editForm.addEventListener("submit", event => {
            event.preventDefault()
            patchReview(event.target.dataset.id, event.target.review.value)        
        })

    const deleteButton = document.createElement('button')
        deleteButton.className = 'delete'
        deleteButton.textContent = 'X'
        deleteButton.dataset.id = review.id
        
    li.append(deleteButton, editForm)
    reviewList.append(li)
    })
}

// -----Backend stuffs --------
const patchReview = (id, newComment) => {
    // sends back car instance
    fetch(`http://localhost:3000/api/v1/reviews/${id}`,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ review: newComment })
    })
    .then(resp => resp.json())
    .then(editedReview => getCarById(editedReview.model_id))
}

// sends back a review instance
const deleteReview = (id) => {
    fetch(`http://localhost:3000/api/v1/reviews/${id}`, {
        method: 'DELETE'
    })
    .then(resp => resp.json())
    .then(deletedReviewObj => getCarById(deletedReviewObj.model_id))
}

// ------Event Listeners ------

document.addEventListener('click', event => {
    if (event.target.matches('.delete')) {
        deleteReview(event.target.dataset.id)
    }
})

carReview.addEventListener("submit", event => {
    event.preventDefault()
    fetch ('http://localhost:3000/api/v1/reviews', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            review: event.target.review.value,
            model_id: event.target.dataset.id
        })
    })
    .then(r=>r.json())
    .then(newReview => getCarById(newReview.model_id))
    event.target.reset()
})

