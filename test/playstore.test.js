const { expect } = require('chai')
const supertest = require('supertest')

const app = require('../app')

describe.only('GET /playstore', () => {
	it('should return an array of apps', () => {
		return supertest(app)
			.get('/apps')
			.expect(200)
			.expect('Content-Type', /json/)
			.then(res => {
				expect(res.body).to.be.an('array')
				expect(res.body).to.have.lengthOf.at.least(1)

				const book = res.body[0]
				expect(book).to.have.all.keys(
					'App',
					'Category',
					'Rating',
					'Reviews',
					'Size',
					'Installs',
					'Type',
					'Price',
					'Content Rating',
					'Genres',
					'Last Updated',
					'Current Ver',
					'Android Ver'
				)
			})
	})

	it(`should only accept a sort of 'rating' or 'app'`, () => {
		return supertest(app)
			.get('/apps')
			.query({ sort: 'BARGLE!' })
			.expect(400, 'Sort must be one of rating or app')
	})

	const genres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card']
	genres.forEach(genre => {
		it(`'${genre}' should be an acceptable genres sort option`, () => {
			return supertest(app)
				.get('/apps')
				.query({ genres: genre })
				.expect(200)
		})
	})

	it(`muzzle should NOT be an acceptable genre sort option`, () => {
		return supertest(app)
			.get('/apps')
			.query({ genres: 'muzzle' })
			.expect(400)
	})
})
