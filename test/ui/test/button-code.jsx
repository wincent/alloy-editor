import ButtonCode from '../../../src/components/buttons/button-code.jsx';

var assert = chai.assert;
var Simulate = ReactTestUtils.Simulate;

describe('ButtonCode', function() {
	before(Utils.createAlloyEditor);

	after(Utils.destroyAlloyEditor);

	beforeEach(Utils.beforeEach);

	afterEach(Utils.afterEach);

	it('should make a text selection code on click', function() {
		bender.tools.selection.setWithHtml(
			this.nativeEditor,
			'There should be a {selection} made code.'
		);

		var buttonCode = this.render(<ButtonCode />, this.container);

		Simulate.click(ReactDOM.findDOMNode(buttonCode));

		var data = bender.tools.getData(this.nativeEditor, {
			fixHtml: false,
			compatHtml: true,
		});

		assert.strictEqual(
			data,
			'<pre>There should be a selection made code.</pre>'
		);
	});

	it('should add class which represents pressed button', function() {
		bender.tools.selection.setWithHtml(
			this.nativeEditor,
			'<pre>A {selection} made code.</pre>'
		);

		var buttonCode = this.render(<ButtonCode />, this.container);

		var buttonDOMNode = ReactDOM.findDOMNode(buttonCode);

		assert.strictEqual(
			buttonDOMNode.classList.contains('ae-button-pressed'),
			true
		);
	});
});
