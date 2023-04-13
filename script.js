

//let newJeu;//lesjeu = [];
let tousLesJeu;

async function getdata(path, search) {//ce code fait une demande aux api de board game geek


  const response = await fetch("https://crimson-sun-c8a9.gscales194.workers.dev/" + path + "?" + search)//voici la demande a mon worker
  console.log("https://crimson-sun-c8a9.gscales194.workers.dev/" + path + "?" + search)
  const text = await response.text();
  console.log(text)
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, "text/xml");//je parse le text pour que lordit peut le lire
  console.log(xmlDoc)
  const Name = document.querySelector("#Name");//je prend tous linformation que je veux du document
  const NameValue = xmlDoc.getElementsByTagName("name")[0].getAttribute('value')
  const WeightValue = xmlDoc.getElementsByTagName("averageweight")[0].getAttribute('value')
  const AverageValue = xmlDoc.getElementsByTagName("average")[0].getAttribute('value')
  const BayesValue = xmlDoc.getElementsByTagName("bayesaverage")[0].getAttribute('value')
  const OverallRankValue = (xmlDoc.getElementsByTagName("rank")[0]?.getAttribute('value') ?? "null")
  const StrategyValue = (xmlDoc.getElementsByTagName("rank")[1]?.getAttribute('value') ?? "null")
  const FamilyValue = (xmlDoc.getElementsByTagName("rank")[2]?.getAttribute('value') ?? "null")
  imageValue = xmlDoc.getElementsByTagName("thumbnail")[0].childNodes[0].nodeValue;
  const AverageTime = (parseInt(xmlDoc.getElementsByTagName("minplaytime")[0].getAttribute('value')) + parseInt(xmlDoc.getElementsByTagName("maxplaytime")[0].getAttribute('value'))) / 2

  newJeu = {//et je met tous l'information dans un objet
    Name: NameValue,
    Weight: WeightValue,
    Average: AverageValue,
    BayesAverage: BayesValue,
    OverallRank: OverallRankValue,
    Strategy: StrategyValue,
    Family: FamilyValue,
    image: imageValue,
    AverageTime: AverageTime,
  };
  return newJeu;
}

//https://attacomsian.com/blog/nodejs-write-json-object-to-file
//https://thewebdev.info/2022/04/26/how-to-create-json-object-dynamically-via-javascript/#:~:text=To%20create%20JSON%20object%20dynamically%20via%20JavaScript%2C%20we%20can%20create,%7B%7D%3B%20let%20employees%20%3D%20%5B%5D%3B%20sitePersonnel.

var lesbuttondiv = document.getElementById("divDesbutton");
const butOpenFile = document.createElement("button")//button pour ouvrir le json
butOpenFile.style.width = '100px'//les parametre
butOpenFile.style.height = '50px'
butOpenFile.textContent = "Importé nouveau Jeu"
var importerdiv = document.getElementById("Importer");
importerdiv.append(butOpenFile)//je le mets dans le div

butOpenFile.addEventListener('click', async () => {//quand click
  var importId = document.getElementById("ImporterID");
  let newJeu = await getdata("thing", "id=0" + importId.value + "&stats=1&page=1");//je prend la valeur du textbox et fait une demande
  [fileHandle] = await window.showOpenFilePicker();//je demande a l<utilisateur de me donner acces aux json
  const file = await fileHandle.getFile();
  const contents = await file.text();
  const obj = JSON.parse(contents || "[]");// je le transform en objet
  obj.push(newJeu)
  const data = JSON.stringify(obj, null, 4);
  writeFile(fileHandle, data)//et je l'ecrit dans le json
});

const butGetGames = document.createElement("button")//button pour avoir tous les jeu d'un utilisateur sur BGG
butGetGames.style.width = '100px'
butGetGames.style.height = '50px'
butGetGames.textContent = "GetUserGames"
var getuserdiv = document.getElementById("GetUser");
getuserdiv.append(butGetGames)//je le mets dans le div
var USerId = document.getElementById("UserID");
butGetGames.addEventListener('click', async () => {//click
  await getuserdata("collection", "username=" + USerId.value)//ma collection vien de l'utilisateur: JorWat

})


const butSaveGames = document.createElement("button")//button qui sauvagrde tous le jeux comme vient de prendre de l<utilisateur
butSaveGames.style.width = '100px'
butSaveGames.style.height = '50px'
butSaveGames.textContent = "Save Games"

lesbuttondiv.append(butSaveGames)//je le mets dans le div
butSaveGames.addEventListener('click', async () => {
  const data = JSON.stringify(tousLesJeu, null, 4);
  [fileHandle2] = await window.showOpenFilePicker();//on demende pour le json, puis ecrit
  writeFile(fileHandle2, data);

})






const butSort = document.createElement("button")//button pour sort selon les poids
butSort.style.width = '100px'
butSort.style.height = '50px'
butSort.textContent = "Sort"
lesbuttondiv.append(butSort)//je le mets dans le div
butSort.addEventListener('click', async () => {
  sort()//appele sort

})

const butget = document.createElement("button")//button qui prend tous nos jeu qui sont dans le json et les met sur l<ecran
butget.style.width = '100px'
butget.style.height = '50px'
butget.textContent = "Get Jeu de JSON"

lesbuttondiv.append(butget)//je le mets dans le div
butget.addEventListener('click', async () => {
  console.log(tousLesJeu);
  [fileHandle] = await window.showOpenFilePicker();//demande pour json
  const file = await fileHandle.getFile();
  const contents = await file.text();
  const obj = JSON.parse(contents || "[]");//transform en objet
  tousLesJeu = obj;
  divDesJeu.style.height = 100 * tousLesJeu.length;//choisi la lougeur total des jeu
  for (i = 0; i < tousLesJeu.length; i++) {
    generateNewDivJeu(i);//cree tous les jeu sur l<ecran
  };


});



async function generateNewDivJeu(nombre) {//mets les jeu sur l'ecran

  let Jeu = document.createElement('div');//le div pour le jeu
  Jeu.style.width = '800px'
  Jeu.style.height = '100px'
  Jeu.style.position = "absolute"//les parametre
  Jeu.style.transform = `translate(${(window.innerWidth - 800) / 2}px,${500 + nombre * 100}px)`//l<emplacement du div
  Jeu.style.inset = '0'
  let image = document.createElement('img')//l'image
  image.src = tousLesJeu[nombre].image
  let text = document.createElement('p')
  Jeu.id = tousLesJeu[nombre].Name;//et je met le id du div
  //je met tous le text
  text.textContent = "Nom : " + tousLesJeu[nombre].Name + "\tComplexité: " + tousLesJeu[nombre].Weight + "\tScore: " + tousLesJeu[nombre].Average + "\tBayesScore: " + tousLesJeu[nombre].BayesAverage + "\tOverallRank: " + tousLesJeu[nombre].OverallRank + "\tFamilyrank: " + tousLesJeu[nombre].Family + "\tStrategy: " + tousLesJeu[nombre].Strategy + "\tPlay Time: " + tousLesJeu[nombre].AverageTime + " min"
  Jeu.append(image)//et je met tous ca dans le div
  Jeu.append(text)
  var divDesJeu = document.getElementById("divDesJeu");

  divDesJeu.append(Jeu)//puis sur l'ecran

}




async function writeFile(fileHandle, contents) {//ecrit dans le josn

  const writable = await fileHandle.createWritable();//attend et verify
  await writable.write(contents);
  await writable.close();
}



function sort() {//je sort mes jeu
  console.log(tousLesJeu)
  console.log(sliderAverageTime.value)

  tousLesJeu.sort((a, b) => {//sort les jeu selon leur score
    const scoreA = getScore(a)//get leur score
    const scoreB = getScore(b)
    if (scoreA < scoreB)
      return 1
    else if (scoreB < scoreA)//sort en avant ou arriere
      return -1
  })
  console.log(tousLesJeu)

  for (i = 0; i < tousLesJeu.length; i++) {//bouge les jeu dans leur nouvelle emplacement
    jeu = document.getElementById(tousLesJeu[i].Name);
    jeu.style.transform = ` translate(${(window.innerWidth - 800) / 2}px, ${500 + i * 100}px)`

  };

}
function getScore(leJeu) {// je fait le score du jeu selon les parametre de l<utiolisateur et un hyperbolic tnagent qui fait en sorte que tous les parrametre dvrait avoir le meme poid quand les slider ne sont pas toucher
  return tanh(leJeu.AverageTime, 5, 240) * sliderAverageTime.value / 100 + tanh(leJeu.Weight, 1, 4) * sliderWeight.value / 100 + tanh(leJeu.Average, 5, 9) * sliderScore.value / 100 + tanh(leJeu.BayesAverage, 5, 8) * sliderBayesScore.value / 100 + tanh((isNaN(leJeu.Strategy) ? 1215 : leJeu.Strategy), 1, 1214) * sliderStrategyRank.value / 100 + tanh((isNaN(leJeu.OverallRank) ? 17352 : leJeu.OverallRank), 48, 17353) * sliderOverallRank.value / 100 + tanh((isNaN(leJeu.Family) ? 2222 : leJeu.Family), 4, 2221) * sliderFamilyRank.value / 100
}
function tanh(valeur, min, max) {
  const power = (valeur - min) / (max - min)
  return (Math.pow(Math.E, power) - Math.pow(Math.E, -power)) / (Math.pow(Math.E, power) + Math.pow(Math.E, -power))//hyperbolic tangeant
}




var sliderScore = document.getElementById("Score");//voici le code pour tous les slider
var outputScore = document.getElementById("ScoreText");
outputScore.textContent = "Score : " + sliderScore.value;
sliderScore.oninput = function () {//quand ca change la valuer change
  outputScore.textContent = "Score : " + this.value;
}
var sliderWeight = document.getElementById("Weight");
var outputWeight = document.getElementById("WeightText");
outputWeight.textContent = "Complexité : " + sliderWeight.value;
sliderWeight.oninput = function () {
  outputWeight.textContent = "Complexité : " + this.value;
}
var sliderOverallRank = document.getElementById("OverallRank");
var outputOverallRank = document.getElementById("OverallRankText");
outputOverallRank.textContent = "OverallRank : " + sliderOverallRank.value;
sliderOverallRank.oninput = function () {
  outputOverallRank.textContent = "OverallRank : " + this.value;
}
var sliderFamilyRank = document.getElementById("FamilyRank");
var outputFamilyRank = document.getElementById("FamilyRankText");
outputFamilyRank.textContent = "FamilyRank : " + sliderFamilyRank.value;
sliderFamilyRank.oninput = function () {
  outputFamilyRank.textContent = "FamilyRank : " + this.value;
}
var sliderStrategyRank = document.getElementById("StrategyRank");
var outputStrategyRank = document.getElementById("StrategyRankText");
outputStrategyRank.textContent = "StrategyRank : " + sliderStrategyRank.value;
sliderStrategyRank.oninput = function () {
  outputStrategyRank.textContent = "StrategyRank : " + this.value;
}
var sliderBayesScore = document.getElementById("BayesScore");
var outputBayesScore = document.getElementById("BayesScoreText");
outputBayesScore.textContent = "BayesScore : " + sliderBayesScore.value;
sliderBayesScore.oninput = function () {
  outputBayesScore.textContent = "BayesScore : " + this.value;
}
var sliderAverageTime = document.getElementById("AverageTime");
var outputAverageTime = document.getElementById("AverageTimeText");
outputAverageTime.textContent = "AverageTime : " + sliderAverageTime.value;
sliderAverageTime.oninput = function () {
  outputAverageTime.textContent = "AverageTime : " + this.value;
}


async function getuserdata(path, search) {//prend tous les jeux d'un utlisateur

  [fileHandle] = await window.showOpenFilePicker();//demande pour le json
  const file = await fileHandle.getFile();
  const contents = await file.text();
  const obj = JSON.parse(contents || "[]");
  const response = await fetch("https://crimson-sun-c8a9.gscales194.workers.dev/" + path + "?" + search)//fait une demande
  const text = await response.text();
  console.log(text)
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, "text/xml");//transform le data de l<utilisateur en xml pour le lire
  console.log(xmlDoc)
  const NumOfItems = xmlDoc.getElementsByTagName("items")[0].getAttribute('totalitems')//prend le nombre total de jeu q'uils ont
  console.log(NumOfItems)
  for (i = 0; i < NumOfItems; i++) {
    const IDValue = xmlDoc.getElementsByTagName("item")[i].getAttribute('objectid')
    let newJeu = await getdata("thing", "id=" + IDValue + "&stats=1&page=1");//pour chaque jeu prend toute le data que ont a besoin
    console.log(newJeu)
    obj.push(newJeu)
    console.log(i)
    await timer(1000)//attendre parce que ils pense quon est un hacker et nous bloque si on va trop vite

  }
  console.log("Done")
  tousLesJeu = obj;//mettre les jeu dans notre list de jeu






}
const timer = ms => new Promise(res => setTimeout(res, ms))//pour attendre le 1second

