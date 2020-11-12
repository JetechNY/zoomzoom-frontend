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


const init = () => {
    fetch(carUrl)
    .then(resp => resp.json())
    .then(carsArray => carNav(carsArray))
}

function carNav (carsArray) {
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
    carMsrp.innerText = `Msrp: ${carObj.msrp}`
    carType.innerText = `Type: ${carObj.car_type}`
    carHp.innerText = `HP: ${carObj.hp}`
    carTorq.innerText = `Torque: ${carObj.torque}`
    carMpg.innerText = `MPG: ${carObj.mpg}`
    carSeats.innerText = `Seats: ${carObj.seats}`
    carReview.dataset.id = carObj.id
}

function renderReviews(carObj){
    const reviewList = document.querySelector("#review-list")
        while (reviewList.firstElementChild) {
            reviewList.firstElementChild.remove()
        }
    const reviewArray = carObj.reviews
    reviewArray.forEach(review => {
        const li = document.createElement("li")
        li.innerText = review.review
        reviewList.append(li)
    })

}
//click to submit
//info to be sent to back end

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
    .then(newForm => renderReviews(newForm))
    event.target.reset()
})

init()



