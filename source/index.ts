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
 * All the information about an ECMAScript edition/version.
 * https://en.wikipedia.org/wiki/ECMAScript#Versions
 */
export type ESVersionInformation = {
	version: ESVersionIdentifier
	ratified: Date
	edition: Number
}

/**
 * ECMAScript version information mapped by the edition number.
 * Sorted from oldest ratification date first.
 */
const esVersionsByEdition: Map<Number, ESVersionInformation> = new Map()
// June 1997
esVersionsByEdition.set(1, {
	version: 'ES1',
	ratified: new Date('1997-06-01'),
	edition: 1,
})
// June 1998
esVersionsByEdition.set(2, {
	version: 'ES2',
	ratified: new Date('1998-06-01'),
	edition: 2,
})
// December 1999
esVersionsByEdition.set(3, {
	version: 'ES3',
	ratified: new Date('1999-12-01'),
	edition: 3,
})
// ES4 was abandoned
// December 2009
esVersionsByEdition.set(5, {
	version: 'ES5',
	ratified: new Date('2009-12-01'),
	edition: 5,
})
// ES5.1 doesn't count
// Add the `ES${year}` versions which are ratified in June
// Certain APIs like Node.green go into the future, so add a year or two.
for (
	let year = 2015, edition = 6;
	year <= now.getFullYear() + 2;
	year++, edition++
) {
	esVersionsByEdition.set(edition, {
		version: `ES${year}`,
		ratified: new Date(`${year}-06-01`),
		edition,
	})
}

/**
 * ECMAScript version information as an array.
 * Sorted from oldest ratification date first.
 */
const esVersionList = Array.from(esVersionsByEdition.values())

/**
 * ECMAScript version information mapped by the version identifier.
 * Sorted from oldest ratification date first.
 */
const esVersionsByVersion: Map<ESVersionIdentifier, ESVersionInformation> =
	new Map(esVersionList.map((v) => [v.version, v]))

// ------------------------------------
// Helpers

/** Sort the ECMAScript version information by oldest ratification date first. */
export function compareESVersionInformation(
	a: ESVersionInformation,
	b: ESVersionInformation,
): number {
	return a.ratified.getTime() - b.ratified.getTime()
}

/** Sort the ECMAScript version identifiers by oldest ratification date first. */
export function compareESVersionIdentifier(
	a: ESVersionIdentifier,
	b: ESVersionIdentifier,
): number {
	return compareESVersionInformation(
		getESVersionInformationByVersion(a),
		getESVersionInformationByVersion(b),
	)
}

/** Sort the ECMAScript version identifiers by oldest ratification date first. */
export function sortESVersionIdentifiers(versions: Array<ESVersionIdentifier>) {
	return versions.sort(compareESVersionIdentifier)
}

/** Sort the ECMAScript version information by oldest ratification date first. */
export function sortESVersionInformation(
	versions: Array<ESVersionInformation>,
) {
	return versions.sort(compareESVersionInformation)
}

// ------------------------------------
// By Version

/** Get the associated ECMAScript version information for the version identifier. */
export function getESVersionInformationByVersion(
	version: ESVersionIdentifier,
): ESVersionInformation {
	if (esVersionsByVersion.has(version)) return esVersionsByVersion.get(version)!
	throw new Error(`ECMAScript version was not found: ${version}`)
}

/**
 * Get all the associated ECMAScript version information for the version identifiers.
 * Sorted from oldest ratification date first.
 */
export function getESVersionsInformationByVersion(
	versions: Array<ESVersionIdentifier>,
): Array<ESVersionInformation> {
	return versions
		.map((version) => getESVersionInformationByVersion(version))
		.sort(compareESVersionInformation)
}

// ------------------------------------
// By Date

/**
 * Get all the ECMAScript versions that have been ratified by the specified datetime.
 * Sorted from oldest ratification date first.
 */
export function getESVersionsInformationByDate(
	when: Date,
): Array<ESVersionInformation> {
	const time = when.getTime()
	const results = esVersionList.filter(
		(meta) => time >= meta.ratified.getTime(),
	)
	if (results.length) return results
	throw new Error(`ECMAScript did not exist by ${when}`)
}

/**
 * Get all the ECMAScript versions that have been ratified by the specified datetime.
 * Sorted from oldest ratification date first.
 */
export function getESVersionsByDate(when: Date): Array<ESVersionIdentifier> {
	return getESVersionsInformationByDate(when).map((meta) => meta.version)
}

/** Get the latest ECMAScript version information that was the ratified by the specified datetime. */
export function getESVersionInformationByDate(
	when: Date,
): ESVersionInformation {
	return getESVersionsInformationByDate(when).slice(-1)[0]
}

/** Get the latest ECMAScript version that has been ratified by the specified datetime. */
export function getESVersionByDate(when: Date = now): string {
	return getESVersionInformationByDate(when).version
}

// ------------------------------------
// By Now

/**
 * Get all the ECMAScript versions that have been ratified by the current datetime, or {@link datetime}.
 * Sorted from oldest ratification date first.
 */
export function getESVersionsInformationByNow() {
	return getESVersionsInformationByDate(now)
}

/**
 * Get all the ECMAScript versions that have been ratified by the current datetime, or {@link datetime}.
 * Sorted from oldest ratification date first.
 */
export function getESVersionsByNow() {
	return getESVersionsByDate(now)
}

/** Get the latest ECMAScript version information that was the ratified by the current datetime, or {@link datetime}. */
export function getESVersionInformationByNow(): ESVersionInformation {
	return getESVersionInformationByDate(now)
}

/** Get the latest ECMAScript version that has been ratified by the current datetime, or {@link datetime}. */
export function getESVersionByNow(): string {
	return getESVersionByDate(now)
}

// ------------------------------------
// By Edition

/** Get the ECMAScript version information by the edition number. */
export function getESVersionInformationByEdition(
	edition: Number,
): ESVersionInformation {
	const meta = esVersionsByEdition.get(edition)
	if (meta) return meta
	throw new Error(`ECMAScript does not have the edition ${edition}`)
}

/** Get the ECMAScript version by the edition number. */
export function getESVersionByEdition(edition: Number): string {
	return getESVersionInformationByEdition(edition).version
}
