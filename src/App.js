import React, { Component } from 'react'
import { Simplex2 } from 'tumult'
import sn from 'spatial-noise'

/**
 * App
 * @author Julien Ferluc 1635588
 * Composante qui gère l'affichage du Canvas à l'écran
 */
export default class App extends Component {
	/**
	 * Lorsque la composante est initialisée
	 * Génération du terrain et affichage du terrain sur le canvas
	 */
	componentDidMount() {
		// Génération du bruit qui va affecter la génération du terrain
		let terrain = new Simplex2(Math.random())
		// Récupérer la référence au Canvas dans render()
		let canvas = this.refs.canvas
		let ctx = canvas.getContext('2d')
		// Variable affecte la taille de l'application du bruit lors de la génération du terrain
		const terrainScale = 500

		// Le canvas ne permet pas de gérer facilement l'affichage de pixels simplement
		// Nous allons générer une image et l'afficher sur le canvas
		var image = ctx.createImageData(canvas.width, canvas.height)
		var data = image.data

		// Loop sur chaque pixel de l'image dans l'axe des X et Y
		for (var x = 0; x < canvas.width; x++) {
			for (var y = 0; y < canvas.height; y++) {
				// Nous récupérons la valeur du bruit associée à la coordonnée X et Y de notre image
				// divisée par le scaler de notre terrain car le bruit est trop "petit"
				var noise = Math.min(
					Math.max(Math.abs(terrain.gen(x / terrainScale, y / terrainScale)), 0.2),
					0.3
				)

				// Récupération du pixel individuel car la gestion des images dans le navigateur est un peu wonky
				var cell = (x + y * canvas.width) * 4

				// Treshold avec cuttoff brusque pour simuler les différents aspects du terrain
				if (noise > 0.25 && noise < 0.3) {
					// Plage
					cellRGBA(data, cell, 255, 239, 97, 255)
				} else if (noise >= 0.3) {
					// Variation de la couleur du gazon par un algoritme de bruit spatial
					let grass = Math.min(Math.max(sn.noise2f(x, y), 0.45), 0.55)
					//	Gazon
					cellRGBA(data, cell, 90 * grass, 180 * grass, 45 * grass, 255)
				} else {
					// Eau
					cellRGBA(data, cell, 0, 128, 255, 255)
				}
			}
		}

		// Rendu de l'image dans le canvas
		ctx.putImageData(image, 0, 0)
	}
	render() {
		return <canvas height={window.innerHeight} width={window.innerWidth} ref="canvas" />
	}
}

/**
 * cellRGBA
 * @author Julien Ferluc 1635588
 * Fonction helper pour définir la couleur d'un pixel spécifique dans la structure de données d'une image
 * @param {*} data structure de donnée de l'image complète
 * @param {*} cell cellule que l'algorithme évalue présentement
 * @param {*} r valeur désirée pour le rouge
 * @param {*} g valeur désirée pour le vert
 * @param {*} b valeur désirée pour le bleu
 * @param {*} a valeur désirée pour le channel alpha
 * @returns {null}
 */
let cellRGBA = (data, cell, r, g, b, a) => {
	data[cell] = r
	data[cell + 1] = g
	data[cell + 2] = b
	data[cell + 3] = a
}
