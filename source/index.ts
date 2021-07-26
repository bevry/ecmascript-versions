/**
 * The datetime to use by default.
 * Defaults to the current date at time of invocation.
 * Or can be specified via {@link datetime}.
 */
let now = new Date()

/**
 * Get or set the current datetime that is used in version date comparisons.
 * Used for testing and server purposes.
 */
export function datetime(when?: Date): Date {
	if (when != null) {
		now = when
	}
	return now
}

/** Get a date with a year offset */
export function getDateWithYearOffset(offset: number = 0, when: Date = now) {
	return new Date(when.getFullYear() + offset, when.getMonth(), when.getDate())
}

/**
 * A complete ECMAScript edition/version identifier.
 * @example `"ES2015"` or `"ES5"`
 */
export type ESVersionIdentifier = string

/**
 * All the details about an ECMAScript edition/version.
 */
export type ESVersionInformation = {
	version: ESVersionIdentifier
	ratified: Date
	edition: Number
}

/**
 * The mapping of an ECMAScript edition number to its information.
 * Sorted from oldest first to most recent last.
 * https://en.wikipedia.org/wiki/ECMAScript#Versions
 */
export type ESVersionMap = Map<Number, ESVersionInformation>

const esVersionMap: ESVersionMap = new Map()
// June 1997
esVersionMap.set(1, {
	version: 'ES1',
	ratified: new Date('1997-06-01'),
	edition: 1,
})
// June 1998
esVersionMap.set(2, {
	version: 'ES2',
	ratified: new Date('1998-06-01'),
	edition: 2,
})
// December 1999
esVersionMap.set(3, {
	version: 'ES3',
	ratified: new Date('1999-12-01'),
	edition: 3,
})
// December 2009
esVersionMap.set(4, {
	version: 'ES5',
	ratified: new Date('2009-12-01'),
	edition: 4,
})
// Add the `ES${year}` versions which are ratified in June
for (
	let year = 2015, edition = 6;
	year <= now.getFullYear();
	year++, edition++
) {
	esVersionMap.set(edition, {
		version: `ES${year}`,
		ratified: new Date(`${year}-06-01`),
		edition,
	})
}

// Premake as an array
const esVersionList = Array.from(esVersionMap.values())

/**
 * Get all the ECMAScript versions that have been ratified by the datetime.
 * Sorted from oldest first to most recent last.
 */
export function getESVersionsInformation(
	when: Date = now
): Array<ESVersionInformation> {
	const time = when.getTime()
	const results = esVersionList.filter(
		(meta) => time >= meta.ratified.getTime()
	)
	if (results.length) return results
	throw new Error(`ECMAScript did not exist by ${when}`)
}

/**
 * Get all the ECMAScript versions that have been ratified by the datetime.
 * Sorted from oldest first to most recent last.
 */
export function getESVersions(when: Date = now): Array<ESVersionIdentifier> {
	return getESVersionsInformation(when).map((meta) => meta.version)
}

/** Get the latest ECMAScript version details that was the ratified by the datetime. */
export function getESVersionInformation(
	when: Date = now
): ESVersionInformation {
	return getESVersionsInformation(when).slice(-1)[0]
}

/** Get the latest ECMAScript version that has been ratified by the datetime. */
export function getESVersion(when: Date = now): string {
	return getESVersionInformation(when).version
}

/** Get the ECMAScript version details by the edition number. */
export function getESVersionInformationByEdition(
	edition: Number
): ESVersionInformation {
	const meta = esVersionMap.get(edition)
	if (meta) return meta
	throw new Error(`ECMAScript does not have the edition ${edition}`)
}

/** Get the ECMAScript version by the edition number. */
export function getESVersionByEdition(edition: Number): string {
	return getESVersionInformationByEdition(edition).version
}
