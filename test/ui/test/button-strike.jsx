import ButtonStrike from '../../../src/components/buttons/button-strike.jsx';

var assert = chai.assert;
var Simulate = ReactTestUtils.Simulate;

describe('ButtonStrike', function() {
	before(Utils.createAlloyEditor);

	after(Utils.destroyAlloyEditor);

	beforeEach(Utils.beforeEach);

	afterEach(Utils.afterEach);

	it('should make a text selection strike on click', function() {
		bender.tools.selection.setWithHtml(
			this.nativeEditor,
			'There should be a {selection} made strike.'
		);

		var buttonStrike = this.render(<ButtonStrike />, this.container);

		Simulate.click(ReactDOM.findDOMNode(buttonStrike));

		var data = bender.tools.getData(this.nativeEditor, {
			fixHtml: false,
			compatHtml: true,
		});

		assert.strictEqual(
			data,
			'<p>There should be a <s>selection</s> made strike.</p>'
		);
	});

	it('should add class which represents pressed button', function() {
		bender.tools.selection.setWithHtml(
			this.nativeEditor,
			'A <s>{selection}</s> made strike.'
		);

		var buttonStrike = this.render(<ButtonStrike />, this.container);

		var buttonDOMNode = ReactDOM.findDOMNode(buttonStrike);

		assert.strictEqual(
			buttonDOMNode.classList.contains('ae-button-pressed'),
			true
		);
	});
});
