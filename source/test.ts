import { equal } from 'assert-helpers'
import kava from 'kava'
import {
	datetime,
	getDateWithYearOffset,
	getESVersion,
	getESVersions,
} from './index.js'

kava.suite('es-versions', function (suite, test) {
	test('2020 November works as expected', function () {
		datetime(new Date('2020-11-03'))
		equal(getESVersion(), 'ES2020')
		equal(getESVersion(getDateWithYearOffset(-1)), 'ES2019')
		equal(
			getESVersions().join(', '),
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
		equal(getESVersion(), 'ES2019')
		equal(getESVersion(getDateWithYearOffset(-1)), 'ES2018')
		equal(
			getESVersions().join(', '),
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
