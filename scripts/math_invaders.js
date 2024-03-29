/* FONCTIONS */

function nb_random(n) {
/*  paramètre : un entier fixant la borne maximum de l'aléatoire
	résultat : un entier aléatoire entre 1 et n 
*/
	return Math.floor(Math.random() * n + 1);
}

function timer(t) {
/*	paramètre : un entier
	résultat : succès de la promesse avec la valeur 1

	Attend un temps t avant de résoudre la promesse
	Cette méthode est utilisée comme un timer
*/
    return new Promise((resolve, reject) => {
	  	setTimeout(() => {
	  		resolve(1);
	  	}, t);
	});
}

function debut_jeu(){
/*	paramètre : aucun
	résultat : aucun

	Initialise quelques valeurs avant de lancer la boucle principale du jeu
*/
	console.log(limite_avancement)
	if (!jeu_en_cours) {
		joueur.style.visibility = "visible";
		score.textContent = "0";
		jeu_en_cours = true;
		main_jeu();
	};
};

function fin_jeu() {
/*	paramètre : aucun
	résultat : aucun

	Attribue à un grand nombre de variable leur valeur par défault
	Permet au jeu de se terminer en laissant la possibilité de le recommencer
*/
	if (jeu_en_cours) {
		jeu_en_cours = false;
		boss_en_cours = false;
		texte_commencer.textContent = "Commencer !";
		texte_banniere.textContent = "Appuyez pour commencer !";
		grp_boss.style.visibility = "hidden";
		boss.style.visibility = "hidden";
		boss_1.style.visibility = "hidden";
		boss_2.style.visibility = "hidden";
		boss_3.style.visibility = "hidden";
		boss_4.style.visibility = "hidden";
		boss_5.style.visibility = "hidden";
		grp_gauche.style.visibility = "hidden";
		grp_centre.style.visibility = "hidden";
		grp_droite.style.visibility = "hidden";
		joueur.style.visibility = "hidden";
		grp_gauche.style.border = "0px";
		grp_centre.style.border = "0px";
		grp_droite.style.border = "0px";
		boss_1.style.border = "0px";
		boss_2.style.border = "0px";
		boss_3.style.border = "0px";
		boss_4.style.border = "0px";
		boss_5.style.border = "0px";
		avancement = 0;
		vaisseau_choisit = null;
		vaisseaux_vivants = [false, false, false, false, false];
		vitesse = 1000;
		phase = 0;
		resolutions = 3;
		if (parseInt(score.textContent) > hi_score) {
			hi_score = parseInt(score.textContent);
			meilleur_score.textContent = hi_score;
		}	
	};
};


async function main_jeu() {
/*	paramètre : aucun
	résultat : aucun

	Boucle principale du jeu, fonctionnant jusqu'à ce qu'il se termine
	Vérification permanente de la présence d'opérations à résoudre
	Marque le rythme de l'avancement des vaisseaux ennemis
	Gestion de la fin du jeu, lorsque l'avancement est trop grand
*/
	while(jeu_en_cours) {
		if(resolutions == 3 && !boss_en_cours || resolutions == 5 && boss_en_cours) {
			phases();
			resolutions = 0;
			avancement = 0;
			temps_vaisseau = 0;
			boss_en_cours = false;
			boss.style.visibility = "hidden";
			if (phase % 5 == 0) {
				boss_en_cours = true;
				limite_avancement = 275;
				affichage_operations();
				apparition_boss();
			} 
			else {
				limite_avancement = 430;
				affichage_operations();
				apparition_vaisseaux();
			}
		}
		if (!vaisseau_choisit) {
			selection_vaisseau();
		}

		avancement_vaisseaux();

		await timer(vitesse);

		if (avancement >= limite_avancement) {
			fin_jeu();
			break;
		}
	}
}

function phases() {
/*	paramètre : aucun
	résultat : aucun

	Marque le changement de phase
	Augmente la vitesse des ennemis
*/
	phase++;
	texte_banniere.textContent = "Phase " + phase.toString();
	vitesse /= 1.2;
	if (phase % 5 == 0) {
		vitesse += 100 / (phase * 2);
	}
}

function apparition_vaisseaux() {
/*	paramètre : aucun
	résultat : aucun

	Fait apparaitre tous les vaisseaux ennemis
*/
	grp_gauche.style.visibility = "visible";
	grp_centre.style.visibility = "visible";
	grp_droite.style.visibility = "visible";
}

function apparition_boss() {
/*	paramètre : aucun
	résultat : aucun

	Fait apparaitre le boss et ses composants
*/
	grp_boss.style.visibility = "visible";
	boss.style.visibility = "visible";
	boss_1.style.visibility = "visible";
	boss_2.style.visibility = "visible";
	boss_3.style.visibility = "visible";
	boss_4.style.visibility = "visible";
	boss_5.style.visibility = "visible";
}

function selection_vaisseau() {
/*	paramètre : aucun
	résultat : aucun

	Choisit un vaisseau ennemi dont l'opération va être à résoudre, parmis les vaisseaux encore vivants
*/
	let nb = 3;
	if (boss_en_cours) {
		nb = 5;
	}
	while (vaisseau_choisit == null){
		proposition_vaisseau = nb_random(nb) - 1;
		if (vaisseaux_vivants[proposition_vaisseau]) {
			if (boss_en_cours) {
				groupes_boss[proposition_vaisseau].style.border = "1px solid red";
			} else {
				groupes[proposition_vaisseau].style.border = "1px solid red";
			}
			reponse_joueur.focus();
			vaisseau_choisit = proposition_vaisseau;
			texte_commencer.textContent = operations[vaisseau_choisit][0].toString() + type_operation + operations[vaisseau_choisit][1].toString();
		}
	}
}

function validation() {
/*	paramètre : aucun
	résultat : aucun

	Vérifie si la réponse du joueur est égale à celle demandée
	Fait évoluer le score du joueur en fonction de la rapidité de réponse
	Diminue le score si la réponse est fausse
	Empêche que le score soit négatif
*/
	let attendu = 0
	if (type_operation == " + ") {
		attendu = operations[vaisseau_choisit][0] + operations[vaisseau_choisit][1]
	} else {
		attendu = operations[vaisseau_choisit][0] * operations[vaisseau_choisit][1]
	}
	if (reponse_joueur.valueAsNumber == attendu) {
		elimination();
		if (boss_en_cours) {
			score.textContent = parseInt(score.textContent) + calcul_score() * 2;
		} else {
			score.textContent = parseInt(score.textContent) + calcul_score();
		}
		temps_vaisseau = 0;
	}
	else {
		score.textContent = parseInt(score.textContent) - (phase * 100);
	}
	reponse_joueur.valueAsNumber = NaN;
	if (parseInt(score.textContent) < 0){
		score.textContent = 0;
	}
}
	
function elimination() {
/*	paramètre : aucun
	résultat : aucun

	Elimine un vaisseau ennemi à la suite de la résolution de son équation
*/
	vaisseaux_vivants[vaisseau_choisit] = false;
	if (boss_en_cours) {
		groupes_boss[vaisseau_choisit].style.border = "0px";
		groupes_boss[vaisseau_choisit].style.visibility = "hidden";
	} else {
		groupes[vaisseau_choisit].style.border = "0px";
		groupes[vaisseau_choisit].style.visibility = "hidden";
	}
	vaisseau_choisit = null;
	resolutions++
}

function calcul_score() {
/*	paramètre : aucun
	résultat : un entier compris entre 0 et phase * 100

	Calcule le score du joueur
*/
	let pourcentage_tps_restant = (limite_avancement - temps_vaisseau) / limite_avancement;
	return Math.round((phase * 100) * pourcentage_tps_restant);
}


function affichage_operations() {
/*	paramètre : aucun
	résultat : aucun

	Définie les opérations des vaisseaux à calculer aléatoirement
*/
	for (i = 0; i < 5; i++) {
		operations[i][0] = nb_random(nombre_choisi);
		operations[i][1] = nb_random(nombre_choisi);
	};
	gauche.textContent = operations[0][0].toString() + type_operation + operations[0][1].toString();
	centre.textContent = operations[1][0].toString() + type_operation + operations[1][1].toString();
	droite.textContent = operations[2][0].toString() + type_operation + operations[2][1].toString();
	boss_1.textContent = operations[0][0].toString() + type_operation + operations[0][1].toString();
	boss_2.textContent = operations[1][0].toString() + type_operation + operations[1][1].toString();
	boss_3.textContent = operations[2][0].toString() + type_operation + operations[2][1].toString();
	boss_4.textContent = operations[3][0].toString() + type_operation + operations[3][1].toString();
	boss_5.textContent = operations[4][0].toString() + type_operation + operations[4][1].toString();
	vaisseaux_vivants = [true, true, true, true, true];
};

function avancement_vaisseaux() {
/*	paramètre : aucun
	résultat : aucun

	Met la position verticale des vaisseaux et du boss à la valeur 'avancement'
*/
	avancement++;
	temps_vaisseau++;
	grp_gauche.style.margin = avancement.toString() + "px 0px 0px 0px";
	grp_centre.style.margin = avancement.toString() + "px 0px 0px 0px";
	grp_droite.style.margin = avancement.toString() + "px 0px 0px 0px";
	grp_boss.style.margin = avancement.toString() + "px 0px 0px 0px";
};



function affiche_regles() {
/*	paramètre : aucun
	résultat : aucun

	Rend l'espace de jeu et l'espace des paramètres invisibles
*/
	if (!demo_en_cours) {
		demo_en_cours = true;
		demo();
	}
	f_regles.style.visibility = "visible";
	f_jeu.style.visibility = "hidden";
	f_parametres.style.visibility = "hidden";
	fin_jeu();
};
function affiche_jeu() {
/*	paramètre : aucun
	résultat : aucun

	Rend l'espace des règles et l'espace des paramètres invisibles
*/
	demo_en_cours = false;
	f_regles.style.visibility = "hidden";
	f_jeu.style.visibility = "visible";
	f_parametres.style.visibility = "hidden";
};
function affiche_parametres() {
/*	paramètre : aucun
	résultat : aucun

	Rend l'espace de jeu et l'espace des règles invisibles
*/
	demo_en_cours = false;
	f_regles.style.visibility = "hidden";
	f_jeu.style.visibility = "hidden";
	f_parametres.style.visibility = "visible";
	fin_jeu();
};

async function demo(){
/*	paramètre : aucun
	résultat : aucun

	Fait bouger les vaisseaux ennemis de démonstration sur l'espace des règles
*/
	let avance = 0;
	while (demo_en_cours){
		avance += 1
		for (let i = ennemi_demo.length - 1; i >= 0; i--) {
			ennemi_demo[i].style.margin = avance.toString() + "px 20px 0px 20px";
		}
		await timer(50);
		if (avance == 350) {
			avance = 0;
		}
	}
}

function mode_difficile() {
/*	paramètre : aucun
	résultat : aucun

	Augmente le nombre maximal dans les opérations à 30
*/
	nombre_choisi = 30
	facile.style.background = "#806FA5";
	moyen.style.background = "#806FA5";
	difficile.style.background = "#A396C2";
};

function mode_moyen() {
/*	paramètre : aucun
	résultat : aucun

	Augmente le nombre maximal dans les opérations à 20
*/
	nombre_choisi = 20
	facile.style.background = "#806FA5";
	moyen.style.background = "#A396C2";
	difficile.style.background = "#806FA5";
};

function mode_facile() {
/*	paramètre : aucun
	résultat : aucun

	Augmente le nombre maximal dans les opérations à 10
*/
	nombre_choisi = 10;
	facile.style.background = "#A396C2";
	moyen.style.background = "#806FA5";
	difficile.style.background = "#806FA5";
};

function mode_additions() {
	type_operation = " + ";
	additions.style.background = "#A396C2";
	multiplications.style.background = "#806FA5";
}

function mode_multiplications() {
	type_operation = " x ";
	additions.style.background = "#806FA5";
	multiplications.style.background = "#A396C2";
}







/* MAIN */

// Boutons de navigation
const regles = document.querySelector("#regles");
const jeu = document.querySelector("#jeu");
const parametres = document.querySelector("#parametres");

// Fenêtres
const f_regles = document.querySelector("#f_regles");
const f_jeu = document.querySelector("#f_jeu");
const f_parametres = document.querySelector("#f_parametres");

// Fenêtre de jeu
const commencer = document.querySelector("#commencer");
const texte_banniere = document.querySelector("#texte_banniere");
const texte_commencer = document.querySelector("#texte_commencer");
const reponse_joueur = document.querySelector("#entree_resultat");
const valider = document.querySelector("#valider");
const espace = document.querySelector("#espace_jeu");
const score = document.querySelector("#score_joueur");

// Images et groupes d'images de vaisseaux
const ennemi_demo = document.querySelectorAll(".ennemi_demo");
const joueur = document.querySelector("#joueur");
const ennemi_gauche = document.querySelector("#ennemi_gauche");
const ennemi_centre = document.querySelector("#ennemi_centre");
const ennemi_droite = document.querySelector("#ennemi_droite");
const grp_gauche = document.querySelector("#grp_gauche");
const grp_centre = document.querySelector("#grp_centre");
const grp_droite = document.querySelector("#grp_droite");
const groupes = [grp_gauche, grp_centre, grp_droite];
const gauche = document.querySelector("#operation_gauche");
const centre = document.querySelector("#operation_centre");
const droite = document.querySelector("#operation_droite");

// Boss
const boss = document.querySelector("#boss");
const grp_boss = document.querySelector("#grp_boss");
const boss_1 = document.querySelector("#boss_1");
const boss_2 = document.querySelector("#boss_2");
const boss_3 = document.querySelector("#boss_3");
const boss_4 = document.querySelector("#boss_4");
const boss_5 = document.querySelector("#boss_5");
const groupes_boss = [boss_1, boss_2, boss_3, boss_4, boss_5];

const difficile = document.querySelector("#difficile");
const moyen = document.querySelector("#moyen");
const facile = document.querySelector("#facile");
const additions = document.querySelector("#additions");
const multiplications = document.querySelector("#multiplications");

// Variables autres
var demo_en_cours = true;
var jeu_en_cours = false;
var boss_en_cours = false;
var phase = 0;
var vitesse = 1000;
mode_facile();
var operations = [[0,0],[0,0],[0,0],[0,0],[0,0]];
mode_additions();
var avancement = 0;
var temps_vaisseau = 0;
var limite_avancement = 430;
var resolutions = 3;
var vaisseau_choisit = null;
var vaisseaux_vivants = [false, false, false, false, false];
var proposition_vaisseau = 0;
var hi_score = 0;

// Ecouteurs d'évènement
regles.addEventListener("click", affiche_regles);
jeu.addEventListener("click", affiche_jeu);
parametres.addEventListener("click", affiche_parametres);
commencer.addEventListener("click", debut_jeu);
valider.addEventListener("click", validation);
difficile.addEventListener("click", mode_difficile );
moyen.addEventListener("click", mode_moyen );
facile.addEventListener("click", mode_facile );
additions.addEventListener("click" , mode_additions);
multiplications.addEventListener("click", mode_multiplications);

reponse_joueur.addEventListener("keydown", (e) => {
	if (e.key == "Enter") {
		validation();
	};
});

demo();