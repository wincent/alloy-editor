import ButtonQuote from '../../../src/components/buttons/button-quote.jsx';

var assert = chai.assert;
var Simulate = ReactTestUtils.Simulate;

describe('ButtonQuote', function() {
	before(Utils.createAlloyEditor);

	after(Utils.destroyAlloyEditor);

	beforeEach(Utils.beforeEach);

	afterEach(Utils.afterEach);

	it('should make a text selection quote on click', function() {
		bender.tools.selection.setWithHtml(
			this.nativeEditor,
			'There should be a {selection} made quote.'
		);

		var buttonQuote = this.render(<ButtonQuote />, this.container);

		Simulate.click(ReactDOM.findDOMNode(buttonQuote));

		var data = bender.tools.getData(this.nativeEditor, {
			fixHtml: false,
			compatHtml: true,
		});

		assert.strictEqual(
			data,
			'<blockquote><p>There should be a selection made quote.</p></blockquote>'
		);
	});

	it('should add class which represents pressed button', function() {
		bender.tools.selection.setWithHtml(
			this.nativeEditor,
			'<blockquote>A {selection} made quote.</blockquote>'
		);

		var buttonQuote = this.render(<ButtonQuote />, this.container);

		var buttonDOMNode = ReactDOM.findDOMNode(buttonQuote);

		assert.strictEqual(
			buttonDOMNode.classList.contains('ae-button-pressed'),
			true
		);
	});
});
