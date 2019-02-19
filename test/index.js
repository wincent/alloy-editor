/**
 * This is the entry point for the main test bundle set up following the pattern
 * described in:
 *
 *     https://www.npmjs.com/package/karma-webpack
 *
 * There are over a hundred files matching the "files" patterns defined
 * in karma.common.js, and almost all of them get passed through
 * webpack, effectively creating hundreds of bundles. This is a problem
 * because every bundle contains its own copy of its dependencies, which
 * means that we download, parse and exectue around 65 MB of JavaScript
 * just to run the tests. We also wind up with literally dozens of
 * copies of React (and other dependencies) on the page, and this
 * breaks a lot of functionality that relies on object identity and
 * module-internal state.
 */

const sources = [
	/* Globals. */
	'scripts/test/loader-alloy-editor.js',

	/* Source files */
	'src/adapter/main.js',
	'src/core/debounce.js',
	'src/core/link.js',
	'src/core/plugins.js',
	'src/core/selection-region.js',
	'src/core/table.js',
	'src/core/tools.js',
	'src/core/uicore.js',
	'src/plugins/*.js',
	'src/components/uibridge/*.js*',
	'src/oop/lang.js',
	'src/oop/oop.js',
	'src/oop/attribute.js',
	'src/oop/base.js',
	'src/selections/selection-arrowbox.js',
	'src/selections/selection-position.js',
	'src/selections/selection-test.js',
	'src/selections/selections.js',
	'src/adapter/core.js',
	'src/components/base/*.js*',
	'src/components/buttons/*.js*',
	'src/components/toolbars/*.js*',
	'src/components/main.js*',

	/* Other */
	'test/core/test/*.js*',
	'test/plugins/test/*.js*',
	'test/ui/test/*.js*',
	'src/__generated__/lang/en.js',
];

/**
 * Takes a file path pattern that may contain globs (eg. "a/b/*.js") and
 * returns a pattern that can be passed to `new RegExp()` to create a regular
 * expression capable of identifying matching paths.
 */
function globPatternToRegExpPattern(pattern) {
	return '^' + pattern.replace(/\*/g, '[^/]*') + '$';
}

/**
 * Given a file path pattern, returns the leading path component. That is, given
 * "foo/bar/baz.js", returns "foo".
 */
function getPrefix(pattern) {
	const match = pattern.match('^[^/]+');
	return match && match[0];
}

const prefixes = Array.from(new Set(sources.map(getPrefix)));

/**
 * Creates the main data structure used to look up modules.
 *
 * It is a map from:
 *
 * - Top-level directory names (eg. "src", "test" etc); to
 * - Maps from regular expression patterns for matching files; to
 * - Objects containing the original file glob pattern and index within the
 *   source array (for sorting purposes).
 */
function getDirectories(prefixes) {
	const directories = {};
	for (let prefix of prefixes) {
		const map = (directories[prefix] = new Map());
		sources.forEach((source, index) => {
			if (source.startsWith(prefix)) {
				const pattern = globPatternToRegExpPattern(source);
				map.set(pattern, {
					index,
					regExp: new RegExp(pattern),
					source,
				});
			}
		});
	}
	return directories;
}

const directories = getDirectories(prefixes);

/**
 * @unused
 *
 * Creates a regular expression suitable for passing to webpack
 * `require.context` for the given directory.
 *
 * https://webpack.js.org/guides/dependency-management/#require-context
 */
function getContextRegExp(directory, directories) {
	const regExpPatterns = Object.keys(directories[directory]);
	return new RegExp(regExpPatterns.join('|'));
}

/**
 * Sadly, all arguments passed to `require.context` must be literal strings, in
 * order for webpack to analyze them.
 */
const contexts = [
	require.context('../scripts', true, /\.jsx?/),
	require.context('../src', true, /\.jsx?/),
	require.context('../test', true, /\.jsx?/),
];

/**
 * Get a list of all the targets found in `contexts`.
 *
 * The list contains objects with keys `filename` and `context`.
 */
const targets = contexts.reduce((acc, context) => {
	const contextModules = context.keys().map(file => {
		file, context;
	});
	return acc.concat(contextModules);
}, []);

/**
 * Given a target `file`, look up its sort index in the provided `directories`
 * data structure.
 */
function findSortIndex(file, directories) {
	// Trim off leading "./" added by webpack.
	file = file.replace(/^.\//, '');
	const prefix = getPrefix(file);
	if (directories.hasOwnProperty(prefix)) {
		return directories[prefix]
			.values()
			.find(({index, regex}) => regex.test(file)).index;
	} else {
		return NaN;
	}
}

/**
 * Sort all found targets according to the order that they appear in the
 * `sources` array.
 */
targets
	.map(({file, context}) => {
		const index = findSortIndex(file, directories);
		return {file, context, index};
	})
	.filter(({index}) => !isNaN(index))
	.sort(({index: a}, {index: b}) => a - b);

/**
 * Actually require the target files.
 */
targets.forEach(({file, context}) => context(file));
