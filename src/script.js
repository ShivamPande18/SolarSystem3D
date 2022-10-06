import './style.css'
import * as THREE from 'three'
import gsap from 'gsap/gsap-core'

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'ea4916948emshf85c653b52f5d4fp158e4bjsnab29f1bea1b3',
        'X-RapidAPI-Host': 'planets-info-by-newbapi.p.rapidapi.com'
    }
};

var planetData;

fetch('https://planets-info-by-newbapi.p.rapidapi.com/api/v1/planet/list', options)
    .then(response => response.json())
    .then(data => {
        planetData = [data[7]["description"], data[4]["description"], data[5]["description"], data[6]["description"], data[1]["description"], data[0]["description"], data[2]["description"], data[3]["description"]]
        console.log(planetData)
    })
    .catch(err => console.error(err));



//html code
const planetName = ["Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune"]
let currIndex=8;
var infoTile = document.querySelector(".info-data h1")
var infoDesc = document.querySelector(".info-data p")
var planetsDom = document.querySelectorAll(".planet")

for (var i = 0, len = planetsDom.length; i < len; i++) {

    (function (index) {
        planetsDom[i].onclick = function () {
            for (let j = 0; j < planetsDom.length; j++) {
                planetsDom[j].classList.remove("selectedPlanet");
            }
            planetsDom[index].classList.add("selectedPlanet");
            onPlanetSelect(index)
        }
    })(i)
}

function onPlanetSelect(index){
    if(currIndex == index) return
    currIndex = index
    infoDesc.innerHTML = planetData[currIndex]
    changePlanet(currIndex)
    infoTile.innerHTML = planetName[currIndex]

}



// THREE.js code


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height,0.1,1000)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth,innerHeight)

document.body.appendChild(renderer.domElement)

const geometry = new THREE.SphereGeometry(2, 32, 16)

function getMaterial(texture){

    const material = new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load("https://raw.githubusercontent.com/ShivamPande18/solar-system-textures/master/" + texture + ".jpg"),
    })
    return material
}


const planets = [
    new THREE.Mesh(geometry, getMaterial("mercury")), 
    new THREE.Mesh(geometry, getMaterial("venus")), 
    new THREE.Mesh(geometry, getMaterial("earth")), 
    new THREE.Mesh(geometry, getMaterial("mars")), 
    new THREE.Mesh(geometry, getMaterial("jupiter")), 
    new THREE.Mesh(geometry, getMaterial("saturn")), 
    new THREE.Mesh(geometry, getMaterial("uranus")), 
    new THREE.Mesh(geometry, getMaterial("neptune"))
]

for (let i = 0; i < planets.length; i++) {
    planets[i].position.set(0,0,i*10);
    scene.add(planets[i])
}

camera.position.z = 75

const light = new THREE.PointLight(0xffffff,1)
light.position.set(0,4,75)
scene.add(light)

//Functions

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

function changePlanet(index) {
    console.log("lil dicky")
    var duration = 0.5;
    var distance = (index*10)+5 - camera.position.z;

    gsap.to(camera.position, {
        z: camera.position.z + distance,
        duration: duration,
        ease: "power1.out",
    })
    gsap.to(light.position, {
        z: light.position.z + distance,
        duration: duration,
        ease: "power1.out",
    })
}


function update(){

    for (let i = 0; i < planets.length; i++) {
        planets[i].rotation.y += 0.01;
    }

    requestAnimationFrame(update)
    renderer.render(scene,camera)

    // planet.rotation.y +=0.01     
}

update()