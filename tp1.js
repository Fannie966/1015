/*
* TP 1 - IFT1015
* Auteurs:
*   Mael Le Petit (matricule),
*   Fannie Filion Bienvenue (20104125)
*
* Ce programme permet de modifier une image selon differents paramètres : 
* la mettre en noir et blanc, augmenté ou réduire la clarté, appliquer un 
* filtre "flou" et détecter les contours
*/

let canvas = document.getElementById('canvas');	

//Fonction pour la formule de la luminance 
var nuanceGris = function(r, g, b) {	
    return  (0.2126 * r) + (0.7152 * g) + (0.0722 *  b);
};

//Fonction qui met l'image en noir et blanc
function noirEtBlanc(imageOriginale) {
    for (var y = 0; y < canvas.height; y++) {	//Iterer tous les pixels
        for (var x = 0; x < canvas.width; x++) {
			//Application de la fonction nuanceGris sur chacun des pixels
            var valeur = nuanceGris(imageOriginale[y][x].r, imageOriginale[y][x].g ,imageOriginale[y][x].b);
            imageOriginale[y][x].r = valeur; 
            imageOriginale[y][x].g = valeur; 
            imageOriginale[y][x].b = valeur; 
        }
    }
    return imageOriginale;
}

//Fonction qui calcul l'eclat selon la couleur du pixel. Valeur de l'eclat : < 1 = foncé, > 1 = claire
function brightness(couleur, eclat) {
    return (Math.pow((couleur/255), eclat) * 255);
}

//Fonction qui augmente ou diminue la clarté de l'image
function correctionClarte(imageOriginale, quantite) {
  for (var y = 0; y < canvas.height; y++) {	//Iterer tous les pixels
        for (var x = 0; x < canvas.width; x++) {
			//Application de la fonction brightness sur chacun des pixels
            imageOriginale[y][x].r = brightness(imageOriginale[y][x].r, quantite); 
            imageOriginale[y][x].g = brightness(imageOriginale[y][x].g, quantite); 
            imageOriginale[y][x].b = brightness(imageOriginale[y][x].b, quantite); 
        }
    }
    return imageOriginale;
}

//Fonction qui applique un filtre "flou" a l'image
function flou (imageOriginale, taille) {
    let ponderation = (1/Math.pow(taille, 2)); //Valeur de la ponderation selon la taille

    var centre = Math.floor(taille/2); //Centre de la matrice

    for (var y = 0; y < canvas.height; y++) { //Iterer tous les pixels
        for (var x = 0; x < canvas.width; x++) {
            var red = ponderation * imageOriginale[y][x].r,
				green = ponderation * imageOriginale[y][x].g,
				blue = ponderation * imageOriginale[y][x].b;

            let indexX = x - centre,
                indexY = y - centre,
                horizontale = 0, // x of matrix
                verticale = 0; // y of matrix

            for(var a = indexY; a < (indexY + taille); a++) {
                for(var b = indexX; b < (indexX + taille); b++) {
                    if (b > 0 && b < canvas.width && a > 0 && a < canvas.height) { //Depassement des bornes
                        red += ponderation * imageOriginale[a][b].r;
                        green += ponderation * imageOriginale[a][b].g;
                        blue += ponderation * imageOriginale[a][b].b;
                    }
                    horizontale++;
                }
                verticale++;
            }
            imageOriginale[y][x].r = red;
            imageOriginale[y][x].g = green;
            imageOriginale[y][x].b = blue;
        }
    }
    return imageOriginale;
}

//Fonction qui fait ressortir les contours 
function detectionContours(imageOriginale) {

    //Mettre l'image en noir et blanc afin d'avoir la meme valeur pour les pixels r, g, b
    var image = noirEtBlanc(imageOriginale);
	
	//Ponderation verticale et horizontale des pixels de la matrice 3 x 3
    let ponderation_verticale = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]],
        ponderation_horizontale = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];

    for (var y = 0; y < canvas.height; y++) {	//Iterer tous les pixels
        for (var x = 0; x < canvas.width; x++) {
            var variationX = 0, variationY = 0,
				bound = 3,
				indexX = x - 1,
				indexY = y - 1;
			
			var verticale = 0;
            for(var a = indexY; a < (indexY + bound); a++) {	//Iterer les pixels de la matrice 3 x 3
				var horizontale = 0;
                for(var b = indexX; b < (indexX + bound); b++) {
					if (a >= 0 && a < canvas.height && b >= 0 && b < canvas.width) {
						var couleur = image[a][b].r; //Choix du canal rouge 
						variationX += (ponderation_horizontale[verticale][horizontale] * couleur);
						variationY += (ponderation_verticale[verticale][horizontale] * couleur);	
					}
					horizontale++;
				}
				verticale++;
            }
			//Intensite des contours 
            var intensiteContour = Math.floor(Math.max(Math.abs(variationX), Math.abs(variationY))); 
			
			if (intensiteContour > 255) {
				intensiteContour = 255;
			}
			
			image[y][x].r = intensiteContour;
			image[y][x].g = intensiteContour;
			image[y][x].b = intensiteContour;
        }
    }
    return image;
}

function tests() {

}