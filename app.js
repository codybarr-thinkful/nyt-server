const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(cors())
app.use(morgan('common')) // let's see what 'common' format looks like

app.get('/books', (req, res) => {
	const { search = '', sort } = req.query
	const books = require('./books.js')

	if (sort) {
		if (!['title', 'rank'].includes(sort)) {
			return res.status(400).send('Sort must be one of title or rank')
		}
	}

	let results = books.filter(book =>
		book.title.toLowerCase().includes(search.toLowerCase())
	)

	if (sort) {
		results.sort((a, b) => {
			return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0
		})
	}

	res.json(results)
})

app.get('/apps', (req, res) => {
	const { sort, genres } = req.query
	const apps = require('./playstore.js')

	const sortOpts = {
		rating: 'Rating',
		app: 'App'
	}

	if (sort) {
		if (!Object.keys(sortOpts).includes(sort)) {
			return res.status(400).send('Sort must be one of rating or app')
		}
	}

	if (genres) {
		if (
			![
				'Action',
				'Puzzle',
				'Strategy',
				'Casual',
				'Arcade',
				'Card'
			].includes(genres)
		) {
			return res
				.status(400)
				.send('Genres must be one of the available options')
		}
	}

	let results = apps

	if (genres) {
		results = apps.filter(app => app.Genres === genres)
	}

	if (sort) {
		results.sort((a, b) => {
			return a[sortOpts[sort]] > b[sortOpts[sort]]
				? 1
				: a[sortOpts[sort]] < b[sortOpts[sort]]
				? -1
				: 0
		})
	}

	res.json(results)
})

app.listen(8000, () => {
	console.log('Server started on PORT 8000')
})
