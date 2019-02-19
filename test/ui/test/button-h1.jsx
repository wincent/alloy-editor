import ButtonH1 from '../../../src/components/buttons/button-h1.jsx';

var assert = chai.assert;
var Simulate = ReactTestUtils.Simulate;

describe('ButtonH1', function() {
	before(Utils.createAlloyEditor);

	after(Utils.destroyAlloyEditor);

	beforeEach(Utils.beforeEach);

	afterEach(Utils.afterEach);

	it('should make a text selection h1 on click', function() {
		bender.tools.selection.setWithHtml(
			this.nativeEditor,
			'There should be a {selection} made h1.'
		);

		var buttonH1 = this.render(<ButtonH1 />, this.container);

		Simulate.click(ReactDOM.findDOMNode(buttonH1));

		var data = bender.tools.getData(this.nativeEditor, {
			fixHtml: false,
			compatHtml: true,
		});

		assert.strictEqual(
			data,
			'<h1>There should be a selection made h1.</h1>'
		);
	});

	it('should add class which represents pressed button', function() {
		bender.tools.selection.setWithHtml(
			this.nativeEditor,
			'<h1>A {selection} made h1.</h1>'
		);

		var buttonH1 = this.render(<ButtonH1 />, this.container);

		var buttonDOMNode = ReactDOM.findDOMNode(buttonH1);

		assert.strictEqual(
			buttonDOMNode.classList.contains('ae-button-pressed'),
			true
		);
	});
});
