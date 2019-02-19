import ButtonItalic from '../../../src/components/buttons/button-italic.jsx';

var assert = chai.assert;
var Simulate = ReactTestUtils.Simulate;

var KEY_I = 73;

describe('ButtonItalic', function() {
	before(Utils.createAlloyEditor);

	after(Utils.destroyAlloyEditor);

	beforeEach(Utils.beforeEach);

	afterEach(Utils.afterEach);

	it('should make a text selection italic on click', function() {
		bender.tools.selection.setWithHtml(
			this.nativeEditor,
			'There should be a {selection} made italic.'
		);

		var buttonItalic = this.render(<ButtonItalic />, this.container);

		Simulate.click(ReactDOM.findDOMNode(buttonItalic));

		var data = bender.tools.getData(this.nativeEditor, {
			fixHtml: false,
			compatHtml: true,
		});

		assert.strictEqual(
			data,
			'<p>There should be a <em>selection</em> made italic.</p>'
		);
	});

	it('should make a text selection italic on [Ctrl|Cmd] + I', function() {
		bender.tools.selection.setWithHtml(
			this.nativeEditor,
			'There should be a {selection} made italic.'
		);

		var buttonItalic = this.render(<ButtonItalic />, this.container);

		happen.keydown(this._editable, {
			ctrlKey: true,
			keyCode: KEY_I,
		});

		var data = bender.tools.getData(this.nativeEditor, {
			fixHtml: false,
			compatHtml: true,
		});

		assert.strictEqual(
			data,
			'<p>There should be a <em>selection</em> made italic.</p>'
		);
	});

	it('should add class which represents pressed button', function() {
		bender.tools.selection.setWithHtml(
			this.nativeEditor,
			'A <em>{selection}</em> made italic.'
		);

		var buttonItalic = this.render(<ButtonItalic />, this.container);

		var buttonDOMNode = ReactDOM.findDOMNode(buttonItalic);

		assert.strictEqual(
			buttonDOMNode.classList.contains('ae-button-pressed'),
			true
		);
	});
});
