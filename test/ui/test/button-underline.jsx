import ButtonUnderline from '../../../src/components/buttons/button-underline.jsx';

var assert = chai.assert;
var Simulate = ReactTestUtils.Simulate;

var KEY_U = 85;

describe('ButtonUnderline', function() {
	before(Utils.createAlloyEditor);

	after(Utils.destroyAlloyEditor);

	beforeEach(Utils.beforeEach);

	afterEach(Utils.afterEach);

	it('should make a text selection underline on click', function() {
		bender.tools.selection.setWithHtml(
			this.nativeEditor,
			'There should be a {selection} made underline.'
		);

		var buttonUnderline = this.render(<ButtonUnderline />, this.container);

		Simulate.click(ReactDOM.findDOMNode(buttonUnderline));

		var data = bender.tools.getData(this.nativeEditor, {
			fixHtml: false,
			compatHtml: true,
		});

		assert.strictEqual(
			data,
			'<p>There should be a <u>selection</u> made underline.</p>'
		);
	});

	it('should make a text selection underline on [Ctrl|Cmd] + I', function() {
		bender.tools.selection.setWithHtml(
			this.nativeEditor,
			'There should be a {selection} made underline.'
		);

		var buttonUnderline = this.render(<ButtonUnderline />, this.container);

		happen.keydown(this._editable, {
			ctrlKey: true,
			keyCode: KEY_U,
		});

		var data = bender.tools.getData(this.nativeEditor, {
			fixHtml: false,
			compatHtml: true,
		});

		assert.strictEqual(
			data,
			'<p>There should be a <u>selection</u> made underline.</p>'
		);
	});

	it('should add class which represents pressed button', function() {
		bender.tools.selection.setWithHtml(
			this.nativeEditor,
			'A <u>{selection}</u> made underline.'
		);

		var buttonUnderline = this.render(<ButtonUnderline />, this.container);

		var buttonDOMNode = ReactDOM.findDOMNode(buttonUnderline);

		assert.strictEqual(
			buttonDOMNode.classList.contains('ae-button-pressed'),
			true
		);
	});
});
