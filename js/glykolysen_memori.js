var container = document.getElementById("containerId");
	var comments = document.getElementById("commentsId");
	var statistic = document.getElementById("statisticId");

	var givePositiveAnswer = document.createElement("button");
	givePositiveAnswer.innerHTML = "Ja";

	var  giveNegativeAnswer = document.createElement("button");
	giveNegativeAnswer.innerHTML = "Nei";

	var nesteKnappRiktig  = document.createElement("button");
	nesteKnappRiktig.innerHTML = "Neste";

	var nesteKnappFeil  = document.createElement("button");
	nesteKnappFeil.innerHTML = "Prøv igjen";

	var reaksjoner = [
	"glucose &#x2192 glucose 6-phosphate",
	"glucose 6-phosphate &#x2194 fructose 6-phosphate",
	"fructose 6-phosphate &#x2192 fructose 1,6-bisphosphate",
	"fructose 1,6-bisphosphat &#x2194 glyceraldehyde 3-phosphate and dihydroxyacetone phosphate",
	"dihydroxyacetone phosphate &#x2194 glyceraldehyde 3-phosphate",
	"glyceraldehyde 3-phosphate &#x2194 1,3-bisphosphoglycerate",
	"1,3-bisphosphoglycera &#x2194 3-phosphoglycerate",
	"3-phosphoglycerate &#x2194 2-phosphoglycerate",
	"2-phosphoglycerate &#x2194 phosphoenolpyruvat",
	"phosphoenolpyruvat &#x2192 pyruvat"
	];

	var enzymer = [
	"hexokinase",
	"phosphoglucose isomerase",
	"phosphofructokinase",
	"aldolase",
	"triose phosphate isomerase",
	"glyceraldehyde 3-phosphate dehydrogenase",
	"phosphoglycerate kinase",
	"phosphoglycerate mutase",
	"enolase",
	"pyruvat kinase"
	];

	var alleElementer = reaksjoner.concat(enzymer);
	//https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
	function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
	}

	shuffle(alleElementer);

	var allElementsDisplayArray = [];

	for (var i = 0; i < alleElementer.length; i++) {
		//Each array, name and chosen/not chosen value, 0 is default
		allElementsDisplayArray[i] = [alleElementer[i], 0]
	}

	var numberOfValg = 0;

	var numberOfCorrect = 0;
	var numberOfWrong = 0;
	var points = 0;

	var valgteElement = [];
	var detteElementet = "";
	var tidligereElementet = "";

	var numberOfValgReaksjoner = 0;
	var numberOfValgEnzymer = 0;

	var indexEnzym = 0;
	var indexReaksjon = 0;

	GiveQuestion = function (elementOne, elementTwo) {
		console.log(elementOne);
		console.log(elementTwo);

		if (reaksjoner.indexOf(elementOne[0]) > -1) {
			console.log("reaksjoner");
			numberOfValgReaksjoner += 1;
			elementOneKategori = "enzym";
		}

		else if (enzymer.indexOf(elementOne[0]) > -1) {
			console.log("enzymer");
			numberOfValgEnzymer += 1;
		}

		if (reaksjoner.indexOf(elementTwo[0]) > -1) {
			console.log("reaksjoner");
			numberOfValgReaksjoner += 1;
		}

		else if (enzymer.indexOf(elementTwo[0]) > -1) {
			console.log("enzymer");
			numberOfValgEnzymer += 1;
		}

		if (numberOfValgEnzymer > 1 || numberOfValgReaksjoner > 1) {
			comments.innerHTML = "Du har valgt to enzymer eller reaksjoner!";
			comments.appendChild(nesteKnappFeil);
			nesteKnappFeil.onclick = function () {
				Reset();
			}
		}

		else {
			if (reaksjoner.indexOf(elementOne[0]) > -1 && enzymer.indexOf(elementTwo[0]) > -1) {
				comments.innerHTML = "Tror du <b>" + elementTwo[0] + "</b> katatlyserer <b>" + elementOne[0] + "</b>?";
				comments.appendChild(givePositiveAnswer);
				givePositiveAnswer.onclick = function() {
					CheckAnswer(elementOne, elementTwo);
				}
				comments.appendChild(giveNegativeAnswer);
				giveNegativeAnswer.onclick = function() {
					Reset();
				}
			}

			else if (reaksjoner.indexOf(elementTwo[0]) > -1 && enzymer.indexOf(elementOne[0]) > -1) {
				comments.innerHTML = "Tror du <b>" + elementOne[0] + "</b> katatlyserer <b>" + elementTwo[0] + "</b>?";
				comments.appendChild(givePositiveAnswer);
				givePositiveAnswer.onclick = function() {
					CheckAnswer(elementTwo, elementOne);
				}
				comments.appendChild(giveNegativeAnswer);
				giveNegativeAnswer.onclick = function() {
					Reset();
				}
			}
		}
	}

	CheckAnswer = function (reaksjonValg, enzymValg) {	
		if (reaksjoner.indexOf(reaksjonValg[0]) == enzymer.indexOf(enzymValg[0])) {
			comments.innerHTML = "Det er riktig!";
			comments.appendChild(nesteKnappRiktig);
			nesteKnappRiktig.onclick = function () {
				//Removes reaksjon
				//alleElementer.splice(alleElementer.indexOf(reaksjonValg), 1);
				//Removes enzym
				//alleElementer.splice(alleElementer.indexOf(enzymValg), 1);
				numberOfCorrect += 1;
				points += 1;

				reaksjonValg[1] = 1;
				enzymValg[1] = 1;
				console.log(reaksjonValg);
				console.log(enzymValg);


				allElementsDisplayArray[alleElementer.indexOf(reaksjonValg[0])] = reaksjonValg;
				allElementsDisplayArray[alleElementer.indexOf(enzymValg[0])] = enzymValg;

				Reset();
			}
		}
		else {
			comments.innerHTML = "Det er feil!";
			comments.appendChild(nesteKnappFeil);
			nesteKnappFeil.onclick = function () {
				numberOfWrong += 1;
				points -= 1;

				Reset();
			}
		}
	}

	Reset = function() {
		numberOfValg = 0;

		valgteElement = [];
		detteElementet = "";
		tidligereElementet = "";

		numberOfValgReaksjoner = 0;
		numberOfValgEnzymer = 0;

		indexEnzym = 0;
		indexReaksjon = 0;

		comments.innerHTML = "";

		DisplayArray();
		UpdateStatistics();
	}

	BindOnclickElement = function (valg, valgNavn, indeks) {
		valg.onclick = function () {
			//console.log(indeks)
			if (indeks == 0) {
				console.log("kjører");
				numberOfValg += 1;

				if (numberOfValg > 2) {

				}

				else {
					valg.style.backgroundColor = "orange";
					valg.style.color =  "black";

					detteElementet = [valgNavn, indeks];

					valgteElement.push(detteElementet);

					if (detteElementet == tidligereElementet) {
						numberOfValg -= 1;
						valgteElement.splice(1,1)
						comments.innerHTML = "Du må velge et annet kort!"
					}

					else {
						tidligereElementet = detteElementet;
						if (numberOfValg > 1) {
							console.log("valg");
							GiveQuestion(valgteElement[0], valgteElement[1]);
						}
					}
				}
			console.log(numberOfValg);
			}

			else {
				console.log("kjører ikke");
			}
		}
	}

	UpdateStatistics = function () {
		statistic.innerHTML = "Antall rette: " + numberOfCorrect;
		statistic.innerHTML += "<br>";
		statistic.innerHTML += "Antall feil: " + numberOfWrong;
		statistic.innerHTML += "<br>";
		statistic.innerHTML += "Poeng: " + points;
	}

	DisplayArray = function () {
		container.innerHTML = "";

		for (var i = 0; i < allElementsDisplayArray.length; i++) {
			console.log(allElementsDisplayArray[i]);
			var containerElement = document.createElement("div");
			containerElement.className = "containerElement";
			var element = document.createElement("div");
			element.className = "element";
			element.innerHTML = alleElementer[i];

			if (allElementsDisplayArray[i][1] == 1) {
				element.style.backgroundColor = "lightgreen";
			}
			/* This will show which enzym goes to which reactions
			if (reaksjoner.indexOf(alleElementer[i]) > -1) {
				element.innerHTML += " " + reaksjoner.indexOf(alleElementer[i]);
			}
			else {
				element.innerHTML += " " + enzymer.indexOf(alleElementer[i]);
			}
			*/
			containerElement.appendChild(element);
			container.appendChild(containerElement);

			BindOnclickElement(element, allElementsDisplayArray[i][0], allElementsDisplayArray[i][1]);
		}
	}

	DisplayArray();
	UpdateStatistics();