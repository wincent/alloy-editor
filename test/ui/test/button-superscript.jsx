import ButtonSuperscript from '../../../src/components/buttons/button-superscript.jsx';

var assert = chai.assert;
var Simulate = ReactTestUtils.Simulate;

describe('ButtonSuperscript', function() {
	before(Utils.createAlloyEditor);

	after(Utils.destroyAlloyEditor);

	beforeEach(Utils.beforeEach);

	afterEach(Utils.afterEach);

	it('should make a text selection superscript on click', function() {
		bender.tools.selection.setWithHtml(
			this.nativeEditor,
			'There should be a {selection} made superscript.'
		);

		var buttonSuperscript = this.render(
			<ButtonSuperscript />,
			this.container
		);

		Simulate.click(ReactDOM.findDOMNode(buttonSuperscript));

		var data = bender.tools.getData(this.nativeEditor, {
			fixHtml: false,
			compatHtml: true,
		});

		assert.strictEqual(
			data,
			'<p>There should be a <sup>selection</sup> made superscript.</p>'
		);
	});

	it('should add class which represents pressed button', function() {
		bender.tools.selection.setWithHtml(
			this.nativeEditor,
			'A <sup>{selection}</sup> made superscript.'
		);

		var buttonSuperscript = this.render(
			<ButtonSuperscript />,
			this.container
		);

		var buttonDOMNode = ReactDOM.findDOMNode(buttonSuperscript);

		assert.strictEqual(
			buttonDOMNode.classList.contains('ae-button-pressed'),
			true
		);
	});
});
