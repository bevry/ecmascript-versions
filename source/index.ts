// prepares
let now = new Date()

/**
 * Get or set the current datetime that is used in version date comparisons.
 * The only need to use this would be for testing or server purposes.
 */
export function datetime(when?: Date): Date {
	if (when != null) {
		now = when
	}
	return now
}

/**
 * Tuples of ECMAScript Versions and their Ratification Dates.
 * Sorted from oldest first to most recent last.
 * https://en.wikipedia.org/wiki/ECMAScript#Versions
 */
const esVersions: Array<[version: string, ratified: Date]> = [
	// June 1997
	['ES1', new Date('1997-06-01')],
	// June 1998
	['ES2', new Date('1998-06-01')],
	// December 1999
	['ES3', new Date('1999-12-01')],
	// December 2009
	['ES5', new Date('2009-12-01')],
]
// Add the `ES${year}` versions which are ratified in June
for (let year = 2015; year <= now.getFullYear(); year++) {
	esVersions.push([`ES${year}`, new Date(`${year}-06-01`)])
}

/** Get a date with a year offset */
export function getDateWithYearOffset(offset: number = 0, when: Date = now) {
	return new Date(when.getFullYear() + offset, when.getMonth(), when.getDate())
}

/** Get the ratified ECMAScript version for the date. */
export function getESVersion(when: Date = now): string {
	const time = when.getTime()
	for (let i = esVersions.length - 1; i >= 0; --i) {
		const [version, ratified] = esVersions[i]
		if (time >= ratified.getTime()) {
			return version
		}
	}
	throw new Error(`ECMAScript did not exist on ${when}`)
}

/**
 * Get all the ECMAScript versions that have been ratified so far.
 * Sorted from oldest first to most recent last.
 */
export function getAllESVersions(when: Date = now): Array<string> {
	const versions = []
	const time = when.getTime()
	for (const [version, ratified] of esVersions) {
		if (time > ratified.getTime()) {
			versions.push(version)
		}
	}
	return versions
}
