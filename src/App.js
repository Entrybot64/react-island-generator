import React, { Component } from 'react'
import { Simplex2 } from 'tumult'
import sn from 'spatial-noise'

export default class App extends Component {
	componentDidMount() {
		let terrain = new Simplex2(Math.random())
		let canvas = this.refs.canvas
		let ctx = canvas.getContext('2d')
		const terrainScale = 500

		var image = ctx.createImageData(canvas.width, canvas.height)
		var data = image.data

		for (var x = 0; x < canvas.width; x++) {
			for (var y = 0; y < canvas.height; y++) {
				var value = Math.min(
					Math.max(Math.abs(terrain.gen(x / terrainScale, y / terrainScale)), 0.2),
					0.3
				)
				var cell = (x + y * canvas.width) * 4

				if (value > 0.25 && value < 0.3) {
					// Plage
					cellRGBA(data, cell, 255, 239, 97, 255)
				} else if (value >= 0.3) {
					let grass = Math.min(
						Math.max(sn.noise2f(x, y), 0.45),
						0.55
					)
					//	Gazon
					cellRGBA(data, cell, 90 * grass, 180 * grass, 45 * grass, 255)
				} else {
					// Eau
					cellRGBA(data, cell, 0, 128, 255, 255)
				}
			}
		}

		ctx.putImageData(image, 0, 0)
	}
	render() {
		return (
			<canvas
				height={window.innerHeight}
				width={window.innerWidth}
				ref="canvas"
			/>
		)
	}
}

let cellRGBA = (data, cell, r, g, b, a) => {
	data[cell] = r
	data[cell + 1] = g
	data[cell + 2] = b
	data[cell + 3] = a
}
