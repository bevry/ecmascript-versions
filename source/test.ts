import { equal, deepEqual } from 'assert-helpers'
import kava from 'kava'
import {
	datetime,
	getDateWithYearOffset,
	getESVersionInformationByEdition,
	getESVersionInformationByVersion,
	getESVersionByNow,
	getESVersionByDate,
	getESVersionsByNow,
	sortESVersionIdentifiers,
	getESVersionsInformationByVersion,
} from './index.js'

kava.suite('es-versions', function (suite, test) {
	test('es5 is 5', function () {
		equal(getESVersionInformationByEdition(5).edition, 5)
		equal(getESVersionInformationByVersion('ES5').edition, 5)
	})
	test('sorting works as expected', function () {
		deepEqual(sortESVersionIdentifiers(['ES2021', 'ES5']), ['ES5', 'ES2021'])
		deepEqual(getESVersionsInformationByVersion(['ES2021', 'ES5']), [
			{ version: 'ES5', ratified: new Date('2009-12-01'), edition: 5 },
			{ version: 'ES2021', ratified: new Date('2021-06-01'), edition: 12 },
		])
	})
	test('2020 November works as expected', function () {
		datetime(new Date('2020-11-03'))
		equal(getESVersionByNow(), 'ES2020')
		equal(getESVersionByDate(getDateWithYearOffset(-1)), 'ES2019')
		equal(
			getESVersionsByNow().join(', '),
			[
				'ES1',
				'ES2',
				'ES3',
				'ES5',
				'ES2015',
				'ES2016',
				'ES2017',
				'ES2018',
				'ES2019',
				'ES2020',
			].join(', ')
		)
	})
	test('2020 March works as expected', function () {
		datetime(new Date('2020-03-03'))
		equal(getESVersionByNow(), 'ES2019')
		equal(getESVersionByDate(getDateWithYearOffset(-1)), 'ES2018')
		equal(
			getESVersionsByNow().join(', '),
			[
				'ES1',
				'ES2',
				'ES3',
				'ES5',
				'ES2015',
				'ES2016',
				'ES2017',
				'ES2018',
				'ES2019',
			].join(', ')
		)
	})
})
